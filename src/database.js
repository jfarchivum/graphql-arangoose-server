// @flow

import Arangoose from '@jfa/arangoose';
import { databaseConfig } from './config';

export default async function connectDatabase() {
  return await Arangoose.connect(
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
  }