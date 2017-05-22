import arangoose from '@jfa/arangoose';
import { graphql } from 'graphql';
import { schema } from '../schema';
import { User } from '../model';
import { setupTest } from '../../test/helper';

import { getUser, generateToken } from '../auth';

beforeEach(async () => await setupTest());

describe('getanother', () => {
  it('should return an user null when token is null', async () => {
    const token = null;
    const { user } = await getUser(token);
    expect(token).toBe(null);
  });

  it('should return null when token is invalid', async () => {
    const token = 'invalid token';
    const { user } = await getUser(token);

    expect(user).toBe(null);
  });

  it('should return null when token do not represent a valid user', async () => {
    const token = generateToken({ _id: 'User/123456' });
    const { user } = await getUser(token);

    expect(user).toBe(null);
  });

  it('should return user from a valid token', async () => {
    const viewer = await User.add({
      name: 'user',
      email: 'user@example.com',
      password: '123'
    });

    const token = generateToken(viewer);
    const { user } = await getUser(token);

    expect(user.name).toBe(viewer.name);
    expect(user.email).toBe(viewer.email);
  });
});
