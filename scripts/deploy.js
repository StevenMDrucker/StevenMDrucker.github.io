const fs = require('fs');
const rimraf = require('rimraf');

rimraf.sync('../../docs/app/__');

const indexPath = '../../docs/app/index.html';

let index = fs.readFileSync(indexPath, 'utf8');
index = index.replace(/__\\__\\__\\docs\\sample-data\\/g, '../sample-data/');
fs.writeFileSync(indexPath, index, 'utf8');
