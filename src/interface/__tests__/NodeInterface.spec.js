import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import { schema } from '../../schema';
import {
  User,
} from '../../model';
import {
  getContext,
  setupTest,
} from '../../../test/helper';

beforeEach(async () => await setupTest());

it('should load Viewer', async () => {
  const user = new User({
    name: 'user',
    email: 'user@example.com',
    password: '123',
  });
  await user.save();

  //language=GraphQL
  const query = `
    query Q {
      node(id: "${toGlobalId('Viewer', user._id)}") {
        ... on Viewer {
          me {
             name
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = getContext({ user });

  const result = await graphql(schema, query, rootValue, context);
  const { node } = result.data;

  expect(node.me.name).toBe(user.name);
});

it('should load User', async () => {
  const user = new User({
    name: 'user',
    email: 'user@example.com',
    password: '123',
  });
  await user.save();

  //language=GraphQL
  const query = `
    query Q {
      node(id: "${toGlobalId('User', user._id)}") {
        ... on User {
          name
        }
      }
    }
  `;

  const rootValue = {};
  const context = getContext();

  const result = await graphql(schema, query, rootValue, context);
  const { node } = result.data;

  expect(node.name).toBe(user.name);
});
