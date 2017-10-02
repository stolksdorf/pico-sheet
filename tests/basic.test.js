const test = require('ava');
const _ = require('lodash');
const Picosheet = require('../pico-sheet.js');





const SheetUrl = 'https://docs.google.com/spreadsheets/d/1eKm3rrzb5ErhCAz4Oyxzo-22rLuthH4WNp5b8GQUzFQ/edit#gid=0';
const SheetId = '1eKm3rrzb5ErhCAz4Oyxzo-22rLuthH4WNp5b8GQUzFQ';
const auth = require('./auth.json');


test.skip('connection to sheet works', (t)=>{
	return Picosheet(auth.api_key, SheetId)
		.then((sheets)=>{
			t.true(_.size(sheets) > 0);
		})
});


test.skip('can fetch from sheets', (t)=>{
	return Picosheet(auth.api_key, SheetId)
		.then((sheets)=>sheets.test.fetch())
		.then((data)=>{
			t.is(typeof data, 'array');

		})
});

test.skip('creates an id column on sheet', (t)=>{
	return Picosheet(auth.api_key, SheetId)
		.then((sheets)=>sheets.test.fetch())
		.then((data)=>{
			t.false()


		})
		.catch((err)=>{
			if(err.status == 401) t.fail('Auth error');
		})
})

test.todo(`throw error if first row isn't popualted`);

/*

let BasicSheets;

Picosheet(auth.api_key, auth.spreadsheetId)
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