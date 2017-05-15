// @flow

import arangoose from 'arangoose';
import { databaseConfig } from './config';

export default function connectDatabase() {
  return new Promise((resolve, reject) => {
    arangoose.connection
      .on('error', error => reject(error))
      .on('close', () => console.log('Database connection closed.'))
      .once('open', () => resolve(arangoose.connections[0]));
    arangoose.connect(
      databaseConfig.host,
      databaseConfig.database,
      databaseConfig.port,
      databaseConfig.username 
        ? {
          username: databaseConfig.username,
          password: databaseConfig.password
        }
        : null
    );
  });
}
