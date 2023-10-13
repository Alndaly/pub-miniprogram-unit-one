import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  getPhoneNumber(data) {
    return service({
      url: URL.api_url + "/post/student/phone",
      data,
      method: "POST",
    });
  },

  // 完成回答问题方式认证
  finishQuestionVerify() {
    return service({
      url: URL.api_url + "/post/student/verify/finish/question",
      method: "POST",
    });
  },

  // 获取认证方式
  getVerifyMethod() {
    return service({
      url: URL.api_url + "/get/student/verify",
      data: {},
    });
  },

  //完成认证请求
  applyVerify() {
    return service({
      url: URL.api_url + "/post/student/verify/status",
      data: {},
      method: "POST",
    });
  },

  // 做题方式的题目以及答案
  getQuestions() {
    return service({
      url: URL.api_url + "/post/student/verify/question",
      data: {},
      method: "POST",
    });
  },

  // 照片方式认证
  verifyByPhoto(photo) {
    return service({
      url: URL.api_url + "/post/student/verify/photo",
      data: {
        photo,
      },
      method: "POST",
    });
  },
};
