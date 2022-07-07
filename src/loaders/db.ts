import mongoose from 'mongoose';
import config from '../config';
import { logger } from '../config/logger';
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

    logger.info('Mongoose Connected ...');

    User.createCollection().then(function (collection) {
      logger.info('User Collection is created!');
    });
    Type.createCollection().then(function (collection) {
      logger.info('Type Collection is created!');
    });
    RuleCategory.createCollection().then(function (collection) {
      logger.info('RuleCategory Collection is created!');
    });
    Rule.createCollection().then(function (collection) {
      logger.info('Rule Collection is created!');
    });
    Room.createCollection().then(function (collection) {
      logger.info('Room Collection is created!');
    });
    Event.createCollection().then(function (collection) {
      logger.info('Event Collection is created!');
    });
    Check.createCollection().then(function (collection) {
      logger.info('Check Collection is created!');
    });
  } catch (err: any) {
    logger.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
