import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  // 获取学校信息
  getSchoolInfo(school_id) {
    return service({
      url: URL.api_url + "/school/info",
      data: { school_id },
    });
  },
};
