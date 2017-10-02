const _ = require('lodash');
const request = require('superagent');

//const serviceAuth = require('./tests/picosheet-serviceaccount.json');



const Picosheet = (apiKey, docId)=>{



	const createSheetInstance = (sheet)=>{

		const fetchHeaderRow = ()=>{
			const range = `${sheet.title}!1:1`;
			return request.get(`https://sheets.googleapis.com/v4/spreadsheets/${docId}/values/${range}`)
				.query({ key : apiKey })
				.then((res)=>res.body.values?_.map(res.body.values[0], (header)=>_.camelCase(header)):null);
		}

		const createIdCol = ()=>{
			return request.post(`https://sheets.googleapis.com/v4/spreadsheets/${docId}:batchUpdate`)
				.send({
					key : apiKey,
					requests: [
						{
							insertDimension: {
								range: {
									sheetId: sheet.sheetId,
									dimension: 'COLUMNS',
									startIndex: 0,
									endIndex: 0
								},
								inheritBefore: false
							}
						},
					]
				})
		}


		return Promise.resolve()
			.then(()=>createIdCol())
			.then(()=>fetchHeaderRow())
			.then((headers)=>{

				return {
					title : sheet.title,
					id : sheet.sheetId,

					create : (data)=>{

					},
					delete : (rowId)=>{
						return request.post(`https://sheets.googleapis.com/v4/spreadsheets/${docId}:batchUpdate`)
							.send({
								requests: [ { deleteDimension: { range: {
									sheetId    : sheet.sheetId,
									dimension  : "ROWS",
									startIndex : rowId,
									endIndex   : rowId
								}}}]
							})
					},

					fetch : ()=>{
						return request.get(`https://sheets.googleapis.com/v4/spreadsheets/${docId}/values/${sheet.title}!2:20000`)
							.query({ key : apiKey })
							.then((res)=>{
								return _.map(res.body.values, (row,idx)=>{
									const entry = _.reduce(headers, (acc, key, idx)=>{
										acc[key] = row[idx];
										return acc;
									},{})
									entry._row = idx;
									return entry;
								});
							});


					},
					update: (index, newRow)=>{
						const modIdx = index + 2;
						const range = `${sheet.title}!${index+2}:${index+2}`;
						//console.log('https://docs.google.com/spreadsheets/d/1eKm3rrzb5ErhCAz4Oyxzo-22rLuthH4WNp5b8GQUzFQ/edit?usp=sharing');
						//console.log(`https://sheets.googleapis.com/v4/spreadsheets/${docId}`);


						return request.put(`https://sheets.googleapis.com/v4/spreadsheets/${docId}/values/${range}`)
						//return request.put(`https://docs.google.com/spreadsheets/d/1eKm3rrzb5ErhCAz4Oyxzo-22rLuthH4WNp5b8GQUzFQ/values/${range}`)
							.query({
								key : apiKey,
								ValueInputOption : 'USER_ENTERED'
							})
							//insertDataOption=INSERT_ROWS
							.send({
								range:`${index+2}:${index+2}`,
								values: [
									[
										3,4
									],
								]
							})
					}
				}
			})
	};

	return request.get(`https://sheets.googleapis.com/v4/spreadsheets/${docId}/`)
		.query({
			key : apiKey,
			//fields: 'sheets.properties',
			//includeGridData : true
		})
		.then((res)=>{
			return Promise.all(_.map(res.body.sheets, (sheet)=>createSheetInstance(sheet.properties)))
		})
		.then((sheets)=>{
			return _.reduce(sheets, (acc, sheet)=>{
				if(sheet) acc[_.camelCase(sheet.title)] = sheet

				return acc;
			}, {})
		})




/*
	const sheet = {
		link : '',
		sheets : {},
		api : (query = {})=>{
			return request.get(`https://sheets.googleapis.com/v4/spreadsheets/${docId}/`)
				.query(Object.assign({key : apiKey}, query))
				.then((res)=>res.body)
		},

		connect : ()=>{
			return sheet.api({fields: 'sheets.properties'})
				.then((res)=>{
					console.log(res);
					_.each(res.sheets, (sheet)=>{
						console.log(sheet);
					})
				})
		},

	}



	return sheet;
	*/
}


module.exports = Picosheet;