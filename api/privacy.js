import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  changePrivacySetting(new_data) {
    return service({
      url: URL.api_url + "/post/user/privacy/change",
      data: {
        ...new_data,
      },
      method: "POST",
    });
  },
  getUserPrivacySetting() {
    return service({
      url: URL.api_url + "/post/user/privacy",
      data: {},
      method: "POST",
    });
  },
};
