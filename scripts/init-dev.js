'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const currDir = path.resolve(__dirname);

const data = fs.readFileSync(path.resolve(currDir, './config.template.json'));
fs.writeFileSync(path.resolve(root, './config.json'), data);
console.log('[init] config file created. please update with your mongo connection string before using workr.')
