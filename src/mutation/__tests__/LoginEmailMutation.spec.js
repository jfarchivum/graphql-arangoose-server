import { graphql } from 'graphql';
import { schema } from '../../schema';
import {
  User,
} from '../../model';
import { generateToken } from '../../auth';
import {
  getContext,
  setupTest,
} from '../../../test/helper';

beforeEach(async () => await setupTest());

it('should not login if email is not in the database', async () => {


  //language=GraphQL
  const query = `
    mutation M {
      LoginEmail(input: {
        clientMutationId: "abc"
        email: "notInTheDatabaselogin@test.com"
        password: "awesome"
      }) {
        clientMutationId
        token
        error
      }     
    }
  `;

  const rootValue = {};
  const context = getContext();
  const result = await graphql(schema, query, rootValue, context);
  const { LoginEmail } = result.data;




  expect(LoginEmail.token).toBe(null);
  expect(LoginEmail.error).toBe('INVALID_EMAIL');
});

it('should not login with wrong email', async () => {
  await User.add({
    email: Math.random().toString().substring(2,8) + "@test.com",
    password: await User.encryptPassword("testpassword"),
  })

  //language=GraphQL
  const query = `
    mutation M {
      LoginEmail(input: {
        clientMutationId: "abc"
        email: "wrongEmail@test.com"
        password: "testpassword"
      }) {
        clientMutationId
        token
        error
      }     
    }
  `;

  const rootValue = {};
  const context = getContext();

  const result = await graphql(schema, query, rootValue, context);
  const { LoginEmail } = result.data;

  expect(LoginEmail.token).toBe(null);
  expect(LoginEmail.error).toBe('INVALID_EMAIL');
});

it('should generate token when email and password is correct', async () => {
  const email = 'prettyawesome@example.com';
  const password = 'awesome';

  const user = await User.add({
    name: 'user',
    email,
    password: await User.encryptPassword(password),
  });

  //language=GraphQL
  const query = `
    mutation M {
      LoginEmail(input: {
        email: "${email}"
        password: "${password}"
      }) {
        clientMutationId
        token
        error
      }     
    }
  `;

  const rootValue = {};
  const context = getContext();

  const result = await graphql(schema, query, rootValue, context);

  // console.log(result)
  const { LoginEmail } = result.data;

  // expect(LoginEmail.token).toBe(generateToken(user));
  expect(LoginEmail.error).toBe(null);
});
