const fs = require('node:fs');
const path = require('node:path');

const run = Number(process.argv[2]);
if (!Number.isSafeInteger(run) || run < 1) throw Error('Invalid GitHub run number.');
const file = path.resolve(__dirname, '..', 'package.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const [major, minor] = data.version.split('.');
if (!/^\d+$/.test(major) || !/^\d+$/.test(minor)) throw Error('Invalid base version.');
data.version = `${major}.${minor}.${run}`;
fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
process.stdout.write(`Building Sketchspace ${data.version}\n`);
