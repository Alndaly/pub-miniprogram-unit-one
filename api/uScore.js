import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  getScoreTopUpList(page_num, page_size) {
    return service({
      url: URL.api_url + "/we-score/top-up-list",
      data: {
        page_num,
        page_size,
      },
      method: "POST",
    });
  },
  topUpScore(id) {
    return service({
      url: URL.api_url + "/we-score/top-up",
      data: {
        id,
      },
      method: "POST",
    });
  },
  topUpScorePre(id) {
    return service({
      url: URL.api_url + "/we-score/top-up-pre",
      data: {
        id,
      },
      method: "POST",
    });
  },
};
