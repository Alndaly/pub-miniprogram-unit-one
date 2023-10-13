import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  addNewLabel(title) {
    return service({
      url: URL.api_url + "/post/label/add",
      data: {
        title,
      },
      method: "post",
    });
  },
  // 获取标签的信息
  getLabelInfo(label_id) {
    return service({
      url: URL.api_url + "/get/label/info",
      data: {
        label_id,
      },
    });
  },
};
