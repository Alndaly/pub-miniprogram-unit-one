import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  // 下载附件（此处仅做记录，实际操作用别的函数）
  downLoadImage(attachment_id) {
    return service({
      url: URL.api_url + "/attachment/download",
      data: { attachment_id },
      method: "POST",
    });
  },
  // 根据ID获取附件
  getAttachmentById(attachment_id) {
    return service({
      url: URL.api_url + "/attachment/",
      data: { attachment_id },
      method: "POST",
    });
  },
};
