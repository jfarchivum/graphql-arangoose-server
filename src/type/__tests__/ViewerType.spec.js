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

it('should get user by id', async () => {
  const user = new User({
    name: 'user',
    email: 'user@example.com',
    password: '123',
  });
  await user.save();

  //language=GraphQL
  const query = `
    query Q {
      viewer {
        user(id: "${toGlobalId('User', user._id)}") {
          _id
          name
          email
          active         
        }
      }
    }
  `;

  const rootValue = {};
  const context = getContext();

  const result = await graphql(schema, query, rootValue, context);
  const { viewer } = result.data;

  expect(viewer.user.name).toBe(user.name);
  expect(viewer.user.email).toBe(null); // no authenticated user
});
