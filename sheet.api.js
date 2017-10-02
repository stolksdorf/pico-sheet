const _ = require('lodash');
var google = require('googleapis');

let sheets = google.sheets('v4').spreadsheets;

var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];



module.exports = (sheetID, auth={})=>{

	let jwtClient;


	const api = {

		authorize : (creds)=>{
			return new Promise((resolve, reject)=>{
				jwtClient = new google.auth.JWT(
						creds.client_email,
						null,
						creds.private_key,
						SCOPES);
				//authenticate request
				jwtClient.authorize(function (err, tokens) {
				 if (err) {
					return reject(err);
				 } else {
					return resolve(jwtClient)
				 }
				});

			});


		},
		checkAuthorize : ()=>{
			if(jwtClient) return Promise.resolve();
			return api.authorize(auth);
		},


		get : (data)=>{
			//TODO: Add a check authorize
			// return api.checkAuthorize()
			// 	.then(()=>{
			return new Promise((resolve, reject)=>{
				sheets.values.get(_.merge({
					auth: jwtClient,
					spreadsheetId: sheetID
				}, data)
				, (err, res)=>{
					if(err) return reject(err);
					return resolve(res.values);
				});
			});
				// })
		},
		update : (data, values)=>{
			return new Promise((resolve, reject)=>{
				sheets.values.update({
					auth: jwtClient,
					spreadsheetId: sheetID,
					valueInputOption : 'USER_ENTERED',
					range : data.range,
					resource : values
				}, values
				, (err, res)=>{
					if (err) {
						//TODO: check for a deauth?
						return reject(err);
					} else {
						return resolve(res);
					}
				});
			});


		}
	}

	return api;

}


// // Load client secrets from a local file.
// fs.readFile('client_secret.json', function processClientSecrets(err, content) {
// 	if (err) {
// 		console.log('Error loading client secret file: ' + err);
// 		return;
// 	}
// 	// Authorize a client with the loaded credentials, then call the
// 	// Google Sheets API.
// 	authorize(JSON.parse(content), listMajors);
// });

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	var clientSecret = credentials.installed.client_secret;
	var clientId = credentials.installed.client_id;
	var redirectUrl = credentials.installed.redirect_uris[0];
	var auth = new googleAuth();
	var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, function(err, token) {
		if (err) {
			getNewToken(oauth2Client, callback);
		} else {
			oauth2Client.credentials = JSON.parse(token);
			callback(oauth2Client);
		}
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
	var authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	console.log('Authorize this app by visiting this url: ', authUrl);
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.question('Enter the code from that page here: ', function(code) {
		rl.close();
		oauth2Client.getToken(code, function(err, token) {
			if (err) {
				console.log('Error while trying to retrieve access token', err);
				return;
			}
			oauth2Client.credentials = token;
			storeToken(token);
			callback(oauth2Client);
		});
	});
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
	try {
		fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
		if (err.code != 'EEXIST') {
			throw err;
		}
	}
	fs.writeFile(TOKEN_PATH, JSON.stringify(token));
	console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors(auth) {
	var sheets = google.sheets('v4');
	sheets.spreadsheets.values.get({
		auth: auth,
		spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
		range: 'Class Data!A2:E',
	}, function(err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}
		var rows = response.values;
		if (rows.length == 0) {
			console.log('No data found.');
		} else {
			console.log('Name, Major:');
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				// Print columns A and E, which correspond to indices 0 and 4.
				console.log('%s, %s', row[0], row[4]);
			}
		}
	});
}