// @flow
import DataLoader from 'dataloader';
import { User as UserModel } from '../model';
import {connectionFromPromisedArray} from 'graphql-relay';
import arangooseLoader from './arangooseLoader';

type UserType = {
  id: string,
  _id: string,
  name: string,
  email: string,
  active: boolean,
};

export default class User {
  id: string;
  _id: string;
  name: string;
  email: string;
  active: boolean;

  constructor(data: UserType, viewer) {
    this.id = data.id;
    this._id = data._id;
    this.name = data.name;

    // you can only see your own email, and your active status
    if (viewer && viewer._id === data._id) {
      this.email = data.email;
      this.active = data.active;
    }
  }

  static getLoader = () => new DataLoader(ids => arangooseLoader(UserModel, ids));

  static viewerCanSee(viewer, data) {
    // Anyone can se another user
    return true;
  }

  static async load({ user: viewer, dataloaders }, id) {

    if (!id) return null;

    const data = await dataloaders.UserLoader.load(id);
    if (!data) return null;

    return User.viewerCanSee(viewer, data) ? new User(data, viewer) : null;
  }

  static clearCache({ dataloaders }, id) {
    return dataloaders.UserLoader.clear(id.toString());
  }

  // static async loadUsers(context, args) {
  //   const where = args.search ? { name: { $regex: new RegExp(`^${args.search}`, 'ig') } } : {};
  //   const users = UserModel
  //     .find(where, { _id: 1 })
  //     .sort({ createdAt: -1 });

  //   return ConnectionFromArangoCursor.connectionFromArangoCursor(context, users, args, User.load);
  // }

  static async loadUsers(context, { connectionArguments, ...searchArgs }) {
    const users = UserModel
      .find(searchArgs);
    return connectionFromPromisedArray(users, connectionArguments);
  }
}

