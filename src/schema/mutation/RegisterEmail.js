// @flow

import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';
import { User } from '../../model';
import { generateToken } from '../../auth';

export default mutationWithClientMutationId({
  name: 'RegisterEmail',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    email: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  mutateAndGetPayload: async ({ name, email, password }) => {
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      return {
        token: null,
        error: 'EMAIL_ALREADY_IN_USE'
      };
    }

    user = await User.add({
      name,
      email,
      password: await User.encryptPassword(password)
    });

    return {
      token: generateToken(user),
      error: null
    };
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error
    }
  }
});
