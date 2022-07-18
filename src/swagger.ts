import config from './config';

const swaggerAutogen = require('swagger-autogen');

const doc = {
  info: {
    title: 'Hous- API',
    description:
      '🥰🏠 우리 호미들 고생해써!! 뷰를 다 짜고 여기까지 온 너희는 천재야! 🏠🥰'
  },
  host: `http://${config.hostUri}:${config.port}`,
  schemes: ['http'],
  consumes: [],
  produces: [],
  tags: [
    {
      name: 'Auth',
      description: '인증 관련 api'
    },
    {
      name: 'User',
      description: '유저 관련 api'
    },
    {
      name: 'Room',
      description: '방 관련 api (규칙, 규칙 카테고리, 이벤트)'
    },
    {
      name: 'Type',
      description: '성향 관련 api'
    }
  ],
  securityDefinitions: {
    JWT: {
      type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      description: 'JWT를 입력해주세요.',
      in: 'header',
      bearerFormat: 'JWT'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/index.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(
  async () => {
    await import('./index'); // Your project's root file
  }
);
