import {config} from 'dotenv';
import { writeFile } from 'fs-extra';
import { argv } from 'yargs';

// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
config();

// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
const environment = argv.environment;
const isProd = environment === 'prod';

const targetPath = `./src/environments/environment.${environment}.ts`;
const envConfigFile = `
export const environment = {
  production: ${isProd},
  backendUrl: "${process.env.BACKEND_URL}",
};
`
writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Output generated at ${targetPath}`);
});
