// @flow

import Arangoose from '@jfa/arangoose';
import bcrypt from 'bcrypt-as-promised';

const User = class User extends Arangoose.Model {
  static schema = {
    name: String,
    password: String,
    email: String,
  }

  async authenticate(plainTextPassword) {
    try {
      return await bcrypt.compare(plainTextPassword, this.password);
    } catch (err) {
      return false;
    }
  }

  static encryptPassword(password) {
    return bcrypt.hash(password, 8);
  }
};

export default Arangoose.model(User);
