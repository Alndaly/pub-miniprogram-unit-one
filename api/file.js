// import fileUtils from '../utils/file'
import { BaseConfig } from "../configs/base";
import { uuid, to } from "../utils/util";
import { service } from "../utils/service";
import cache from "../utils/cache";

// 获取上传密钥
function getUploadKey() {
  return service({
    url: BaseConfig.SIGNATURE_URL + "/getPostObjectParams",
    method: "POST",
  });
}

async function updateLocalUploadKey(params) {
  // 如果本地缓存的上传密钥已经过期了那么就刷新
  if (!cache.get("OSSAccessKeyId")) {
    const [res, err] = await to(getUploadKey());
    if (err) {
      wx.showToast({
        title: "刷新oss签名出错",
        icon: "error",
      });
      return;
    }
    const { OSSAccessKeyId, policy, signature } = res.data;
    cache.set("OSSAccessKeyId", OSSAccessKeyId, 3600);
    cache.set("policy", policy, 3600);
    cache.set("signature", signature, 3600);
  }
}

export default {
  // 上传图片
  async uploadImage(file, ...params) {
    await updateLocalUploadKey();
    file.name = `${new Date().getTime()}${uuid(12, 16)}${
      params.index ? params.index : ""
    }.${file.url.split(".")[1]}`;
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: `https://${BaseConfig.OSS_BUCKET}.${BaseConfig.OSS_REGION}.aliyuncs.com`,
        filePath: file.url,
        name: "file", // 必须填file。
        formData: {
          key: file.name,
          policy: cache.get("policy"),
          OSSAccessKeyId: cache.get("OSSAccessKeyId"),
          signature: cache.get("signature"),
        },
        success: (res) => {
          if (res.statusCode == "204") {
            resolve(
              `https://${BaseConfig.OSS_BUCKET}.${BaseConfig.OSS_REGION}.aliyuncs.com/${file.name}`
            );
          } else {
            reject("failed");
          }
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  },
};
