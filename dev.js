const _ = require('lodash');
const Picosheet = require('./pico-sheet.js');

const auth = require('./tests/auth.json');

const SheetId = '1eKm3rrzb5ErhCAz4Oyxzo-22rLuthH4WNp5b8GQUzFQ';

const sheet = Picosheet(auth.api_key, SheetId)
	.then((res)=>{
		console.log(res);
	})
	.catch((err)=>{
		console.log(err);
	})