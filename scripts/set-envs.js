const {writeFileSync, mkdirSync} = require('fs');
require('dotenv').config();


const targetPath = './src/enviroments/enviroments.ts';

const envFileContent = `
export const enviroment = {
  mapbox_key : "${process.env['MAPBOX_KEY'] }",
};
`;

mkdirSync('./src/enviroments', {recursive: true});

writeFileSync(targetPath, envFileContent);

