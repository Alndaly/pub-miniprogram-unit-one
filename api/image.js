import { IMG_RENDER_API_KEY, IMG_RENDER_URL } from "../configs/base";

export const generatePoster = (data) => {
  let header = {
    "X-API-Key": IMG_RENDER_API_KEY,
    "content-type": "application/json",
  };
  return new Promise((resolve, reject) => {
    wx.request({
      url: IMG_RENDER_URL,
      header: header,
      method: "POST",
      data: data,
      success(res) {
        if (res.data.code !== 0) {
          reject(res);
        } else {
          resolve(res);
        }
      },
      fail(err) {
        reject(err);
      },
    });
  });
};
