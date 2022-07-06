import mongoose from 'mongoose';
import config from '../config';
import Check from '../models/Check';
import Event from '../models/Event';
import Room from '../models/Room';
import Rule from '../models/Rule';
import RuleCategory from '../models/RuleCategory';
import Type from '../models/Type';
import User from '../models/User';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);

    mongoose.set('autoCreate', true);

    console.log('Mongoose Connected ...');

    User.createCollection().then(function (collection) {
      console.log('User Collection is created!');
    });
    Type.createCollection().then(function (collection) {
      console.log('Type Collection is created!');
    });
    RuleCategory.createCollection().then(function (collection) {
      console.log('RuleCategory Collection is created!');
    });
    Rule.createCollection().then(function (collection) {
      console.log('Rule Collection is created!');
    });
    Room.createCollection().then(function (collection) {
      console.log('Room Collection is created!');
    });
    Event.createCollection().then(function (collection) {
      console.log('Event Collection is created!');
    });
    Check.createCollection().then(function (collection) {
      console.log('Check Collection is created!');
    });
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
