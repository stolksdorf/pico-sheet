const _ = require('lodash');
const request = require('superagent');

const Picosheet = (api_key, spreadsheetId)=>{

	const createSheet = (sheetInfo)=>{
		console.log(sheetInfo);
		const range = `${sheetInfo.title}!1:1`;
		return request.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`)
			.query({ key : api_key })
			.then((res)=>{
				if(!res.body.values) return;
				const headers = res.body.values[0];
				console.log(headers);


				return {
					title : sheetInfo.title,
					id : sheetInfo.sheetId,

					fetch : ()=>{

					},
					update: (index, newRow)=>{
						const modIdx = index + 2;
						const range = `${sheetInfo.title}!${index+2}:${index+2}`;
						return request.put(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`)
							.query({
								key : api_key,
								ValueInputOption : 'USER_ENTERED'
							})
							//insertDataOption=INSERT_ROWS
							.send({
								range:`${index+2}:${index+2}`,

								values: [
									[
										1,2
									],
								]
							})
					}
				}


				console.log(headers);
			});


	};



	return request.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/`)
		.query({
			key : api_key,
			//fields: 'sheets.properties',
			//includeGridData : true
		})
		.then((res)=>{
			return Promise.all(_.map(res.body.sheets, (sheet)=>createSheet(sheet.properties)))
		});









	const sheet = {
		link : '',
		sheets : {},
		api : (query = {})=>{
			return request.get(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/`)
				.query(Object.assign({key : api_key}, query))
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
}


module.exports = Picosheet;