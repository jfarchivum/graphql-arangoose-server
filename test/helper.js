// @flow
import arangoose from '@jfa/arangoose';

import * as loaders from '../src/loader';
import { databaseConfig } from '../src/config'


const dbConfig = {
  DB_HOST: '192.168.99.100',
  DB_PORT: '32771',
  DB_USERNAME: 'root',
  DB_PASSWORD: 'test',
  DB_NAME: 'test'
};

const { DB_HOST, DB_NAME, DB_PORT, DB_USERNAME, DB_PASSWORD } = dbConfig;

// const { ObjectId } = mongoose.Types;

process.env.NODE_ENV = 'test';

const config = {
  db: {
    test: 'mongodb://localhost/test'
  },
  connection: null
};

function connect() {
  return arangoose.connect(DB_HOST, DB_NAME, DB_PORT, {
      username: DB_USERNAME,
      password: DB_PASSWORD
    })

    // config.connection.once('open', resolve).on('error', e => {
    //   if (e.message.code === 'ETIMEDOUT') {
    //     console.log(e);

    //     arangoose.connect(DB_HOST, DB_NAME, DB_PORT, {
    //       username: DB_USERNAME,
    //       password: DB_PASSWORD
    //     });
    //   }

    //   console.log(e);
    //   reject(e);
    // });
}

function clearDatabase() {
  return new Promise(resolve => {
    for (const i in arangoose.connection.collections) {
      arangoose.connection.collections[i].drop();
    }

    resolve();
  });
}

export function getContext(context) {
  const dataloaders = Object.keys(loaders).reduce(
    (dataloaders, loaderKey) => ({
      ...dataloaders,
      [loaderKey]: loaders[loaderKey].getLoader()
    }),
    {}
  );

  return {
    ...context,
    req: {},
    dataloaders
  };
}

export async function setupTest() {
  await connect();
  await clearDatabase();
}
