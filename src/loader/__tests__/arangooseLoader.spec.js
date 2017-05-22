import { User } from '../../model';
import { Password } from '../../model/User';
import { setupTest } from '../../../test/helper';
import arangooseLoader from '../arangooseLoader';

beforeEach(async () => await setupTest());

it('should retrieve all ids in the correct order', async () => {

    const user1 = await User.add({
        name : 'User #6666666666666',
        email: 'user-1@email.com',
        password: await User.encryptPassword('sdsd'),
        active: true
    });
    const user2 = await User.add({
        name : 'User #222222222222',
        email: 'user-2@email.com',
    });

    const user3 = await User.add({
        name : 'User #3',
        email: 'user-3@email.com',
    });

    const idsToRetrieve = [user2._id, user1._id, user3._id];

    const results = await arangooseLoader(User, idsToRetrieve);

    expect(results).toHaveLength(3);
    expect(results[0].name).toBe(user2.name);
    expect(results[1].name).toBe(user1.name);
    expect(results[2].name).toBe(user3.name);
});

it('should return error objects for missing ids', async () => {
    const user1 = await User.add({
        name : 'User #1',
        email: 'user-1@email.com',
    });

    const user2 = {
        _id: 'fff',
        name : 'User #2',
        email: 'user-2@email.com',
    };

    const user3 = await User.add({
        name : 'User #3',
        email: 'user-3@email.com',
    });

    const idsToRetrieve = [user1._id, user2._id, user3._id];

    const results = await arangooseLoader(User, idsToRetrieve);

    expect(results).toHaveLength(3);
    expect(results[0].name).toBe(user1.name);
    expect(results[1]).toBeInstanceOf(Error);
    expect(results[2].name).toBe(user3.name);
});
