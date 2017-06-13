const Picosheet = require('../pico-sheet.js');
const auth = require('./auth.json');


let BasicSheets

Picosheet(auth.api_key, auth.spreadsheetId)
	.then((res)=>{
		console.log(res);

		res[0].update(1)
			.then((res2)=>{
				console.log(res2);
			})
			.catch((err)=>{
				console.log(err.response.body)
			})

	})

