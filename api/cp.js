import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  getOtherUserFormInfo(user_id) {
    return service({
      url: URL.api_url + "/cp/other-user-form-info",
      data: {
        user_id,
      },
      method: "POST",
    });
  },
  getMyCpRes() {
    return service({
      url: URL.api_url + "/cp/my-cp-res",
      data: {},
      method: "POST",
    });
  },
  rematchMyCp() {
    return service({
      url: URL.api_url + "/cp/rematch",
      data: {},
      method: "POST",
    });
  },
};
