const test = require('ava');
const _ = require('lodash');


const SheetAPI = require('../sheet.api.js');
const privateKey = require('./picosheet-serviceaccount.json');
const SheetId = '1eKm3rrzb5ErhCAz4Oyxzo-22rLuthH4WNp5b8GQUzFQ';


const api = SheetAPI(SheetId, privateKey);


test('can authorize with google sheet api', (t)=>{
	return api.authorize(privateKey)
		.then((res)=>t.pass());
});



test('can make read from sheets', (t)=>{
	return api.get({ range : 'Test!1:1' })
		.then((values)=>{
			t.true(_.isArray(values));
		})

});


test('can make write to sheets', (t)=>{
	return api.update({
			range : 'Test!1:1',
			valueInputOption : 'USER_ENTERED'
		}, {values: [['test1', 'I AM FUCKING WORKING']]})
		.then((values)=>{
			t.pass();
		})

	t.pass();
});



/*

let BasicSheets;

Picosheet(privateKey.api_key, privateKey.spreadsheetId)
	.then((res)=>{
		//console.log(res);

		res[0].update(1)
			.then((res2)=>{
				console.log(res2);
			})
			.catch((err)=>{
				console.log(err.response.body)
			})

	})

*/