import config from './config';

const swaggerAutogen = require('swagger-autogen')();

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
      name: 'User',
      description: '유저 관련 api'
    },
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
      description: '방 관련 api'
    },
    {
      name: 'Rule',
      description: '규칙 관련 api'
    },
    {
      name: 'RuleCategory',
      description: '규칙 카테고리 관련 api'
    },
    {
      name: 'Event',
      description: '이벤트 관련 api'
    },
    {
      name: 'Type',
      description: '성향 관련 api'
    }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/index.ts'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, … */

swaggerAutogen(outputFile, endpointsFiles, doc);
