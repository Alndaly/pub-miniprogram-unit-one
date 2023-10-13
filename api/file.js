import {
  URL,
  OSS_URL,
  BASE_IMG_URL,
} from "../configs/base";
import { uuid, to } from "../utils/util";
import { service } from "../utils/service";
import cache from "../utils/cache";

// 获取上传密钥
function getUploadKey() {
  return service({
    url: URL + "/upload/getPostObjectParams",
    method: "POST",
  });
}

async function updateLocalUploadKey(params) {
  // 如果本地缓存的上传密钥已经过期了那么就刷新
  if (!cache.get("OSSAccessKeyId")) {
    let res = await getUploadKey();
    console.log(res);
    const { OSSAccessKeyId, policy, signature } = res.data;
    cache.set("OSSAccessKeyId", OSSAccessKeyId, 3600);
    cache.set("policy", policy, 3600);
    cache.set("signature", signature, 3600);
  }
}

export default {
  // 上传视频
  async uploadVideo(file, ...params) {
    await updateLocalUploadKey();
    file.name = `${new Date().getTime()}${uuid(12, 16)}${
      params.index ? params.index : ""
    }.${file.url.split(".")[1]}`;
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: "https://xiaododo.oss-cn-hangzhou.aliyuncs.com",
        filePath: file.url,
        name: "file", // 必须填file。
        formData: {
          key: BASE_IMG_URL + file.name,
          policy: cache.get("policy"),
          OSSAccessKeyId: cache.get("OSSAccessKeyId"),
          signature: cache.get("signature")
        },
        success: (res) => {
          if (res.statusCode == "204") {
            resolve({
              url: OSS_URL + "/" + baseVideoUrl + file.name,
              type: "video",
            });
          } else {
            reject("failed");
          }
        },
        fail: (err) => {
          reject({
            err: err,
          });
        },
      });
    });
  },
  // 上传图片
  async uploadImage(file, ...params) {
    // 如果已经上传过的ugc图片，再重新编辑时直接返回
    if (
      (file?.attachment_url && file?.attachment_url.indexOf("//tmp") === -1) ||
      (file?.url && file?.url.indexOf("//tmp") === -1)
    ) {
      return new Promise((resolve, reject) => {
        resolve({
          url: file.attachment_url || file?.url,
          height: file.height,
          width: file.width,
          type: "image",
        });
      });
    }
    await updateLocalUploadKey();
    file.name = `${new Date().getTime()}${uuid(12, 16)}${
      params.index ? params.index : ""
    }.${file.url.split(".")[1]}`;
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: "https://xiaododo.oss-cn-hangzhou.aliyuncs.com",
        filePath: file.url,
        name: "file", // 必须填file。
        formData: {
          key: BASE_IMG_URL + file.name,
          policy: cache.get("policy"),
          OSSAccessKeyId: cache.get("OSSAccessKeyId"),
          signature: cache.get("signature"),
        },
        success: async (res) => {
          if (res.statusCode == "204") {
            const [res, err] = await to(
              wx.getImageInfo({
                src: file.url,
              })
            );
            resolve({
              url: OSS_URL + "/" + BASE_IMG_URL + file.name,
              height: res.height,
              width: res.width,
              type: "image",
            });
          } else {
            reject("failed");
          }
        },
        fail: (err) => {
          reject({
            err: err,
          });
        },
      });
    });
  },
};
