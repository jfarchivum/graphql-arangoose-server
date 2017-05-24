import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import UserType from '../type/UserType';
import { UserLoader } from '../../loader';
import { User } from '../../model';

export default mutationWithClientMutationId({
  name: 'ChangePassword',
  inputFields: {
    oldPassword: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'user new password',
    },
  },
  mutateAndGetPayload: async ({ oldPassword, password }, { user }) => {
    if (!user) {
      throw new Error('invalid user');
    }

    const correctPassword = await user.authenticate(oldPassword);

    if (!correctPassword) {
      return {
        error: 'INVALID_PASSWORD',
      };
    }

    user.password = await User.encryptPassword(password);
    await user.save();

    return {
      error: null,
    };
  },
  outputFields: {
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
    me: {
      type: UserType,
      resolve: (obj, args, context) => UserLoader.load(context, user.id),
    },
  },
});
