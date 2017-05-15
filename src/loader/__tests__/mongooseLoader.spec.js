import { User } from '../../model';
import { setupTest } from '../../../test/helper';

import mongooseLoader from '../mongooseLoader';

beforeEach(async () => await setupTest());

it('should retrieve all ids in the correct order', async () => {

    const user1 = new User({
        name : 'User #1',
        email: 'user-1@email.com',
    });

    const user2 = new User({
        name : 'User #2',
        email: 'user-2@email.com',
    });

    const user3 = new User({
        name : 'User #3',
        email: 'user-3@email.com',
    });

    await user1.save();
    await user2.save();
    await user3.save();

    const idsToRetrieve = [user2.id, user1.id, user3.id];

    const results = await mongooseLoader(User, idsToRetrieve);

    expect(results).toHaveLength(3);
    expect(results[0].name).toBe(user2.name);
    expect(results[1].name).toBe(user1.name);
    expect(results[2].name).toBe(user3.name);
});

it('should return error objects for missing ids', async () => {

    const user1 = new User({
        name : 'User #1',
        email: 'user-1@email.com',
    });

    const user2 = new User({
        name : 'User #2',
        email: 'user-2@email.com',
    });

    const user3 = new User({
        name : 'User #3',
        email: 'user-3@email.com',
    });

    await user1.save();
    await user3.save();

    const idsToRetrieve = [user1.id, user2.id, user3.id];

    const results = await mongooseLoader(User, idsToRetrieve);

    expect(results).toHaveLength(3);
    expect(results[0].name).toBe(user1.name);
    expect(results[1]).toBeInstanceOf(Error);
    expect(results[2].name).toBe(user3.name);
});
