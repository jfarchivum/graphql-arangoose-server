// @flow


// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt-as-promised';

// const Schema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     hidden: true,
//   },
//   email: {
//     type: String,
//     required: false,
//     index: true,
//   },
//   active: {
//     type: Boolean,
//     default: true,
//   },
// }, {
//   timestamps: {
//     createdAt: 'createdAt',
//     updatedAt: 'updatedAt',
//   },
//   collection: 'user',
// });

// Schema
//   .pre('save', function (next) {
//     // Hash the password
//     if (this.isModified('password')) {
//       this.encryptPassword(this.password)
//         .then((hash) => {
//           this.password = hash;
//           next();
//         })
//         .catch(err => next(err));
//     } else {
//       return next();
//     }
//   });

// Schema.methods = {
//   async authenticate(plainTextPassword) {
//     try {
//       return await bcrypt.compare(plainTextPassword, this.password);
//     } catch (err) {
//       return false;
//     }
//   },
//   encryptPassword(password) {
//     return bcrypt.hash(password, 8);
//   },
// };


// export default mongoose.model('User', Schema);

//

import arangoose from 'arangoose';
import bcrypt from 'bcrypt-as-promised';

class Password {
  constructor(password){
    this.hash = bcrypt.hash(password, 8)
  }
  async compare(plainTextPassword){
    return await bcrypt.compare(plainTextPassword, this.hash);
  }
}

const Schema = new arangoose.Schema({
   name: {
    type: String,
    required: true,
  },
  password: {
    type: Password,
    hidden: true,
  },
  email: {
    type: String,
    required: false,
    index: true,
  },
  active: {
    type: Boolean,
    default: true,
  }
})

const User = class extends arangoose.Model{
  
  static schema = Schema;

  async authenticate(plainTextPassword) {
    try {
      return await this.password.compare(plainTextPassword);
    } catch (err) {
      return false
    }

    try {
      return await bcrypt.compare(plainTextPassword, this.password);
    } catch (err) {
      return false;
    }
  }

  encryptPassword(password) {
    return bcrypt.hash(password, 8);
  }
}

export default arangoose.model( User ,new Model)
