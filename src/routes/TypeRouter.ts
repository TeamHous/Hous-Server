import { Router } from 'express';
import auth from '../middleware/auth';
import { TypeController } from '../controllers';

const router: Router = Router();

router.get(
  '/test',
  auth,
  TypeController.getTypeTestInfo
  // #swagger.summary = '성향 테스트 문제 조회'
  // #swagger.security = [{"JWT": []}]
  /*
  #swagger.responses[200] = {
        schema: {
          status: 200,
          success: true,
          message: "사용자 성향 테스트 조회 성공입니다.",
          data: {
              typeTests: [
                  {
                      _id: "62d298e3cc1d0ea0fc0c4b57",
                      testNum: 1,
                      question: "알람 소리에 눈을 뜬 당신\n방 안은 어떤가요?",
                      questionType: "LIGHT",
                      answers: [
                          "스탠드를 키고 자 방이 매우 밝다",
                          "햇빛이 비춰 자연스럽게 방을 밝힌다",
                          "암막 커튼이 쳐져있어, 완전히 어둡다"
                      ],
                      questionImg: "https://team-hous.s3.ap-northeast-2.amazonaws.com/Type/test/type_test_1.png"
                  }
              ]
          }
      }
    }
  */
);

export default router;
