const Picosheet = require('../pico-sheet.js');
const auth = require('./auth.json');


Picosheet.connect(auth.api_key, auth.spreadsheetId)