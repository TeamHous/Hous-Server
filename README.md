![Server](https://user-images.githubusercontent.com/68772751/179411271-8b82ca9c-7c76-45bc-b5db-5fbca097f8a6.png)

<br/>

# 🏠 About Hous- 🧐

### **_우리의 House를 위한 How is - 💡_**

<br/>

SOPT 30th APPJAM

- 프로젝트 기간: 2022.06.18 ~
- [👉 API Docs](https://sugared-lemming-812.notion.site/API-Public-925cfbbf9fb549a8b76724c52479763a)
- [👉 Collection](https://sugared-lemming-812.notion.site/Collection-3845eeb105a14c42a79438aa3fa053e6)
- [👉 Code Convention](https://sugared-lemming-812.notion.site/Code-Convention-49e3f27b0863419b9b66a9899599440f)
- [👉 Git Convention](https://sugared-lemming-812.notion.site/Git-Convention-30dde5461edd437e8f033250ed753b96)

<br/>

# 🐉 Workflow

![hous_workflow](https://user-images.githubusercontent.com/74812188/180251210-2bfbf298-a8f6-4400-b14f-ea5b229e15e7.png)

<br/>

# 💡 Key Service

<br/>

**✨ 이벤트 등록**<br/><br/>
함께하는 일 혹은 룸메이트들이 알면 좋을 자신의 일정을 이벤트로 등록해 서로의 생활을 공유할 수 있도록 하며 당일 알림을 통해 잊지 않고 기억하게 해줌.<br/><br/>
**✨ 규칙 등록**<br/><br/>
공동 생활에 필요한 규칙을 등록하고 카테고리별 분류를 통해 쉽게 확인하도록 함. 설정한 담당자와 요일에 따라 알림을 받고 규칙을 지켰는지 체크할 수 있음.<br/><br/>
**✨ 성향 테스트**<br/><br/>
하루의 상황과 질문을 제시해 응답을 통해 생활 성향을 확인함. 그래프와 성향 카드를 통해 테스트 결과를 한 눈에 볼 수 있도록 하며, 이는 룸메이트간 서로에 대한 이해를 도움.

<br />

# 🛠 Tech Stack

<img src="https://img.shields.io/badge/TypeScript-2d79c7?style=flat-square&logo=TypeScript&logoColor=white"/> <img src="https://img.shields.io/badge/Node.js-339933?style=flat-sqaure&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/Express-000000?style=flat-sqaure&logo=Express&logoColor=white"> <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-sqaure&logo=MongoDB&logoColor=white"> <img src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=AmazonAWS&logoColor=white"/> <!-- <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=Firebase&logoColor=white"/> --> <img src="https://img.shields.io/badge/Github-181717?style=flat-sqaure&logo=Github&logoColor=white"> <img src="https://img.shields.io/badge/Github Actions-2088FF?style=flat-sqaure&logo=Github Actions&logoColor=white"> <img src="https://img.shields.io/badge/PM2-2B037A?style=flat-sqaure&logo=PM2&logoColor=white">

<br />

# 🌲 Git Branch Strategy

![gitConvention](https://user-images.githubusercontent.com/74812188/180296489-31276169-6a39-424f-910e-1de79a937a1b.png)

<br/>

# 🏗 Architecture

![hous_architecture](https://user-images.githubusercontent.com/74812188/180296601-9c5aed1d-1140-4d47-9d96-35902673ff31.png)

<br/>

# 🗂 Folder Structure

```
📦src
 ┣ 📂config
 ┃ ┣ 📜logger.ts
 ┃ ┗ 📜index.ts
 ┣ 📂controller
 ┃ ┣ 📜AuthController.ts
 ┃ ┣ 📜EventController.ts
 ┃ ┣ 📜RoomController.ts
 ┃ ┣ 📜RuleController.ts
 ┃ ┣ 📜TypeController.ts
 ┃ ┣ 📜UserController.ts
 ┃ ┗ 📜index.ts
 ┣ 📂errors
 ┃ ┣ 📜errorGenerator.ts
 ┃ ┗ 📜generalErrorHandler.ts
 ┣ 📂interface
 ┃ ┣ 📂auth
 ┃ ┣ 📂check
 ┃ ┣ 📂common
 ┃ ┣ 📂event
 ┃ ┣ 📂room
 ┃ ┣ 📂rule
 ┃ ┣ 📂ruleCategory
 ┃ ┣ 📂type
 ┃ ┗ 📂user
 ┣ 📂loaders
 ┃ ┗ 📜db.ts
 ┣ 📂middleware
 ┃ ┣ 📜auth.ts
 ┃ ┗ 📜slackAlarm.ts
 ┣ 📂models
 ┃ ┣ 📜Check.ts
 ┃ ┣ 📜Event.ts
 ┃ ┣ 📜Room.ts
 ┃ ┣ 📜Rule.ts
 ┃ ┣ 📜RuleCategory.ts
 ┃ ┣ 📜Type.ts
 ┃ ┣ 📜TypeTest.ts
 ┃ ┗ 📜User.ts
 ┣ 📂modules
 ┃ ┣ 📜checkIconType.ts
 ┃ ┣ 📜checkObjectIdValidation.ts
 ┃ ┣ 📜checkValidUtils.ts
 ┃ ┣ 📜iconType.ts
 ┃ ┣ 📜jwtHandler.ts
 ┃ ┣ 📜limitNum.ts
 ┃ ┣ 📜responseMessage.ts
 ┃ ┣ 📜statusCode.ts
 ┃ ┗ 📜util.ts
 ┣ 📂routes
 ┃ ┣ 📜AuthRouter.ts
 ┃ ┣ 📜RoomRouter.ts
 ┃ ┣ 📜TypeRouter.ts
 ┃ ┣ 📜UserRouter.ts
 ┃ ┗ 📜index.ts
 ┣ 📂service
 ┃ ┣ 📂auth
 ┃ ┃ ┗ 📜AuthService.ts
 ┃ ┣ 📂event
 ┃ ┃ ┣ 📜EventRetrieveService.ts
 ┃ ┃ ┣ 📜EventService.ts
 ┃ ┃ ┗ 📜EventServiceUtils.ts
 ┃ ┣ 📂room
 ┃ ┃ ┣ 📜RoomRetrieveService.ts
 ┃ ┃ ┣ 📜RoomService.ts
 ┃ ┃ ┗ 📜RoomServiceUtils.ts
 ┃ ┣ 📂rule
 ┃ ┃ ┣ 📜RuleRetrieveService.ts
 ┃ ┃ ┣ 📜RuleService.ts
 ┃ ┃ ┗ 📜RuleServiceUtils.ts
 ┃ ┣ 📂type
 ┃ ┃ ┣ 📜TypeRetrieveService.ts
 ┃ ┃ ┗ 📜TypeServiceUtils.ts
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📜UserRetrieveService.ts
 ┃ ┃ ┣ 📜UserService.ts
 ┃ ┃ ┗ 📜UserServiceUtils.ts
 ┃ ┗ 📜index.ts
 ┣ 📜swagger.ts
 ┣ 📜index.ts
 ┃
 📦test
 ┣ 📜AuthService.spec.ts
 ┣ 📜EventRetrieveService.spec.ts
 ┣ 📜EventService.spec.ts
 ┣ 📜RoomRetrieveService.spec.ts
 ┣ 📜RoomService.spec.ts
 ┣ 📜RuleRetrieveService.spec.ts
 ┣ 📜RuleService.spec.ts
 ┣ 📜TypeRetrieveService.spec.ts
 ┣ 📜UserRetrieveService.spec.ts
 ┣ 📜UserService.spec.ts
 ┗ 📜index.spec.ts
```

<br/>

# 💌 Commit Convention

|    제목    | 내용                                                             |
| :--------: | ---------------------------------------------------------------- |
|  **feat**  | **새로운 기능 추가**                                             |
|  **fix**   | **자잘한 수정**                                                  |
| **bugfix** | **버그 수정**                                                    |
|   chore    | config 및 라이브러리, 빌드 관련 파일 수정 (프로덕션 코드 수정 x) |
|    docs    | 문서 수정                                                        |
|  refactor  | 코드 리팩토링 시에만 사용                                        |
|    test    | 테스트 코드 작성                                                 |
|   rename   | 파일명, 변수명 수정                                              |
|  comment   | 주석 추가 및 수정                                                |
|   remove   | 기능 삭제 및 파일 삭제                                           |

<br/>

# 👨‍👧‍👦 Team

|                                  **[@hyejungg](https://github.com/hyejungg)**                                   |                                  **[@yjooooo](https://github.com/yjooooo)**                                   |                                **[@orijoon98](https://github.com/orijoon98)**                                 |
| :-------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: |
| ![kimhj](https://user-images.githubusercontent.com/68374234/178509877-0d6b6800-7306-46c9-bc83-f92f4940f03c.png) | ![syj](https://user-images.githubusercontent.com/68374234/178509896-edc8da92-e872-4ea8-a9c9-af8f7d4a3f33.png) | ![khj](https://user-images.githubusercontent.com/68374234/178509856-95101790-2a2d-46f9-bf06-42da0a1fbeff.png) |
|                                                   서버 개발자                                                   |                                                  서버 개발자                                                  |                                                  서버 개발자                                                  |

<br/>

# 📄 API

| Router | method   | end point                                | description                                                   | 담당자 |
| ------ | -------- | ---------------------------------------- | ------------------------------------------------------------- | ------ |
| auth   | `POST`   | /auth/signup                             | 회원가입                                                      | 공혁준 |
|        | `POST`   | /auth/login                              | 로그인                                                        | 공혁준 |
| room   | `GET`    | /room                                    | 들어간 방 id 조회하기                                         | 공혁준 |
|        | `POST`   | /room                                    | 방 생성하기                                                   | 공혁준 |
|        | `GET`    | /room/in?roomCode=                       | 방 입장하기 초대코드 입력 시                                  | 공혁준 |
|        | `POST`   | /room/:roomId/in                         | 방 입장하기                                                   | 공혁준 |
|        | `DELETE` | /room/:roomId/out                        | 방 퇴사하기                                                   | 공혁준 |
|        | `GET`    | /room/:roomId/home                       | 홈화면 조회하기                                               | 김혜정 |
|        | `POST`   | /room/:roomId/event                      | 이벤트 추가하기                                               | 김혜정 |
|        | `GET`    | /room/:roomId/event/:eventId             | 이벤트 조회하기                                               | 김혜정 |
|        | `PUT`    | /room/:roomId/event/:eventId             | 이벤트 수정하기                                               | 김혜정 |
|        | `DELETE` | /room/:roomId/event/:eventId             | 이벤트 삭제하기                                               | 김혜정 |
|        | `GET`    | /room/:roomId/rules                      | 규칙 홈화면 조회하기 (오늘의 to-do)                           | 김혜정 |
|        | `GET`    | /room/:roomId/rules/me                   | 규칙 홈화면 조회하기 (나의 to-do)                             | 공혁준 |
|        | `PUT`    | /room/:roomId/rule/:ruleId/check         | 오늘 나의 to-do 체크 상태 변경하기                            | 손연주 |
|        | `GET`    | /room/:roomId/rule/:ruleId/today         | 오늘의 임시 담당자 설정 시 룸메이트 리스트 조회하기           | 손연주 |
|        | `PUT`    | /room/:roomId/rule/:ruleId/today         | 오늘의 임시 담당자 설정하기                                   | 손연주 |
|        | `POST`   | /room/:roomId/rules/category             | 규칙 카테고리 추가하기                                        | 손연주 |
|        | `PUT`    | /room/:roomId/rules/category/:categoryId | 규칙 카테고리 수정하기                                        | 손연주 |
|        | `DELETE` | /room/:roomId/rules/category/:categoryId | 규칙 카테고리 삭제하기 (카테고리 삭제 시 안에 규칙들 다 삭제) | 손연주 |
|        | `GET`    | /room/:roomId/rule/new                   | 규칙 생성 시 조회 (규칙 카테고리 리스트, 참여자 리스트)       | 손연주 |
|        | `GET`    | /room/:roomId/category/:categoryId/rule  | 카테고리 별 규칙리스트 조회                                   | 손연주 |
|        | `POST`   | /room/:roomId/rule                       | 규칙 1개 추가하기                                             | 공혁준 |
|        | `GET`    | /room/:roomId/rule/:ruleId               | 규칙 1개 조회하기                                             | 공혁준 |
|        | `PUT`    | /room/:roomId/rule/:ruleId               | 규칙 1개 수정하기                                             | 공혁준 |
|        | `DELETE` | /room/:roomId/rule/:ruleId               | 규칙 1개 삭제하기                                             | 공혁준 |
| user   | `GET`    | /user/profile                            | 프로필 홈화면 조회하기                                        | 김혜정 |
|        | `GET`    | /user/profile/me                         | 나의 프로필 수정 시 정보 조회하기                             | 김혜정 |
|        | `PUT`    | /user/profile/me                         | 나의 프로필 수정하기                                          | 김혜정 |
|        | `GET`    | /user/me/type                            | 성향 상세 조회하기 - 나 (자세히 보기 버튼)                    | 손연주 |
|        | `DELETE` | /user                                    | 탈퇴하기                                                      | 김혜정 |
|        | `GET`    | /user/setting                            | 설정 조회하기                                                 | 손연주 |
|        | `PUT`    | /user/setting/notification               | 알림 여부 수정하기                                            | 손연주 |
|        | `GET`    | /user/:homieId                           | 룸메이트 조회하기                                             | 김혜정 |
|        | `GET`    | /user/:userId/type                       | 성향 상세 조회하기 - 룸메이트 (자세히 보기 버튼)              | 손연주 |
|        | `PUT`    | /user/type/test                          | 성향 테스트 점수 등록 및 수정                                 | 김혜정 |
| type   | `GET`    | /type/test                               | 성향 테스트 문제 조회                                         | 손연주 |

<br />

# 📦 Dependency Module

```json
"devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/express": "^4.17.13",
    "@types/jsonwebtoken": "^8.5.8",
    "@types/mocha": "^9.1.1",
    "@types/mongoose": "^5.11.97",
    "@types/morgan": "^1.9.3",
    "@types/node": "^18.0.3",
    "@types/swagger-ui-express": "^4.1.3",
    "@types/winston": "^2.4.4",
    "eslint": "^8.18.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-airbnb-typescript": "^17.0.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-prettier": "^4.1.0",
    "husky": "^8.0.1",
    "nodemon": "^2.0.15",
    "ts-node": "^10.8.2",
    "typescript": "^4.7.4"
},
"dependencies": {
    "@types/swagger-jsdoc": "^6.0.1",
    "axios": "^0.27.2",
    "bcryptjs": "^2.4.3",
    "chai": "^4.3.6",
    "dayjs": "^1.11.3",
    "dotenv": "^16.0.0",
    "express": "^4.17.3",
    "express-validator": "^6.14.0",
    "jsonwebtoken": "^8.5.1",
    "mocha": "^10.0.0",
    "mongoose": "^6.3.1",
    "morgan": "^1.10.0",
    "supertest": "^6.2.4",
    "swagger-autogen": "^2.21.5",
    "swagger-jsdoc": "^6.2.1",
    "swagger-ui-express": "^4.4.0",
    "winston": "^3.8.1",
    "winston-daily-rotate-file": "^4.7.1"
}
```
