'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const currDir = path.resolve(__dirname);
const uuid = require('uuid/v4');

const data = fs.readFileSync(path.resolve(currDir, './config.template.json'));

data.replace('{worker_client_id}', uuid());

fs.writeFileSync(path.resolve(root, './config.json'), data);
console.log('[init] config file created. please update with your mongo connection string before using workr.')
