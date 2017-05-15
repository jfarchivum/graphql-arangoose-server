// @flow

import path from 'path';
import dotenvSafe from 'dotenv-safe';

const root = path.join.bind(this, __dirname, '../');

dotenvSafe.load({
  path: root('.env'),
  sample: root('.env.example'),
});

// Database Settings
const {
  DB_HOST,
  DB_PORT = '8529',
  DB_USERNAME = null,
  DB_PASSWORD = null,
  DB_NAME
} = process.env;

const dBproduction = {
 host: DB_HOST,
 database: DB_NAME,
 port: DB_PORT,
 username: DB_USERNAME ,
 password: DB_PASSWORD
};

const dBdevelopment = dBproduction;

// Test Database Settings
// const test = 'mongodb://localhost/awesome-test';

// Export DB Settings
export const databaseConfig = (process.env.NODE_ENV === 'production') ? dBproduction : dBdevelopment;

// Export GraphQL Server settings
export const graphqlPort = process.env.GRAPHQL_PORT || 5000;
export const jwtSecret = process.env.JWT_KEY || 'secret_key';
