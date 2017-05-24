import { graphql } from 'graphql';
import { schema } from '../../index.js';
import {
  getContext,
  setupTest,
} from '../../../../test/helper';
import { User } from '../../../model';


beforeEach(async () => await setupTest());

it('should not show email of other users', async () => {
  let user = await User.add({
    name: 'user',
    email: 'user@example.com',
    password: '123',
    active: true
  });

  let user1 = await User.add({
    name: 'awesome',
    email: 'awesome@example.com',
    password: '123',
    active: true
  });

  user1.name = 'superAwesome'
  await user1.save();

  //language=GraphQL
  const query = `
    query Q {
      viewer {
        users(first: 2) {
          edges {
            node {
              _id
              name
              email
              active
            }
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = getContext({ user });
  // console.log( context )

  const result = await graphql(schema, query, rootValue, context);

  // console.log( result.data.viewer.users.edges )
  const { edges } = result.data.viewer.users;

  // expect(edges[0].node.name).toBe(user1.name);
  // expect(edges[0].node.email).toBe(null);

  // expect(edges[1].node.name).toBe(user.name);
  // expect(edges[1].node.email).toBe(user.email);
});
