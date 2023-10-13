import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  // 获取热搜关键词
  getRecentSearch() {
    return service({
      url: URL.api_url + "/get/recent_search",
      data: {
        page: 1,
        offset: 8,
      },
    });
  },
};
