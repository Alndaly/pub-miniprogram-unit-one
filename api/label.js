import { service } from "../utils/service";
import { BaseConfig } from "../configs/base";

export default {
  addNewLabel(title) {
    return service({
      url: BaseConfig.API_URL + "/label/add",
      data: {
        title,
      },
      method: "post",
    });
  },
  // 获取标签的信息
  getLabelInfo(id) {
    return service({
      url: BaseConfig.API_URL + "/label/info",
      data: {
        id,
      },
      method: "post",
    });
  },
  checkLabelExistStatus(keyword) {
    return service({
      url: BaseConfig.API_URL + "/label/exist",
      data: {
        keyword,
      },
      method: "post",
    });
  },
  getLabels(keyword, pageNum, pageSize = 20) {
    return service({
      url: BaseConfig.API_URL + "/label/list",
      data: {
        keyword,
        pageNum,
        pageSize,
      },
      method: "post",
    });
  },
  getTopLabels() {
    return service({
      url: BaseConfig.API_URL + "/label/top",
      data: {},
      method: "post",
    });
  },
};
