import config from '../src/config';
import connectDB from '../src/loaders/db';

describe('Test Start', () => {
  if (config.env !== 'test') {
    throw Error('test 환경이 아닙니다.');
  }
  connectDB();
});
