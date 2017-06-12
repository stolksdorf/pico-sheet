const API_KEY = 'AIzaSyCjm-IXZxQww4vvw26ErDm6pdsJFcCGLck'


var _ = require('lodash');

const spreadsheetId = '1eKm3rrzb5ErhCAz4Oyxzo-22rLuthH4WNp5b8GQUzFQ';

const request = require('superagent');





const get = (query={})=>{
	return request.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/`)
		.query(query)
		.send()

}

const getSheetIds = ()=>{
	return get({
		fields: 'sheets.properties',
		key : API_KEY
	})
}
getSheetIds()
.then((res)=>{
	console.log(JSON.stringify(res.body, null, '  '));
})
.catch((err)=>console.log(err))

const Picosheet = {
	link : '',

	connect : (api_key)=>{



	}


}


module.exports = Picosheet;