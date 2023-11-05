import cache from "./cache";
import userApi from "../api/user";
import { to } from "../utils/util";

// 防止多次请求token获取接口
let tokenHasCheckTimes = 0;
// 刷新token计数
let refreshTokenTimes = 0;

function checkStatus(params) {
  updateToken();
  // 将当前的请求保存在观察者数组中
  const retryOriginalRequest = new Promise((resolve) => {
    addSubscriber(() => {
      resolve(
        service({
          ...params,
        })
      );
    });
  });
  return retryOriginalRequest;
}

function checkHasToken(params) {
  getToken();
  // 将当前的请求保存在观察者数组中
  const retryOriginalRequest = new Promise((resolve) => {
    addSubscriber(() => {
      resolve(
        service({
          ...params,
        })
      );
    });
  });
  return retryOriginalRequest;
}

// 观察者
let subscribers = [];

// 处理被缓存的请求
function onAccessTokenFetched() {
  subscribers.forEach((callback) => {
    callback();
  });
  // 处理完后清空缓存请求数组
  subscribers = [];
}

// 将请求缓存到请求数组中
function addSubscriber(callback) {
  subscribers.push(callback);
}

// 请求函数封装
export const service = function (args) {
  let header = {
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type": "application/json",
  };
  if (cache.directGet("access_token")) {
    header.Authorization = cache.directGet("access_token").data;
  }
  return new Promise((resolve, reject) => {
    console.log("req ==>", args);
    wx.request({
      header,
      ...args,
      success: (res) => {
        console.log("res <==", res);
        if (res.statusCode === 401) {
          if (cache.directGet("access_token")) {
            resolve(checkStatus(args));
          } else {
            resolve(checkHasToken(args));
          }
          return;
        }
        if (res.statusCode !== 200) {
          reject(res);
          return;
        }
        resolve(res);
      },
      fail: (err) => {
        console.error("error:", err);
        reject(err);
        wx.showToast({
          title: "网络出错",
          icon: "error",
        });
      },
    });
  });
};

async function getToken() {
  if (tokenHasCheckTimes >= 3) {
    wx.showToast({
      title: "出错啦",
      icon: "error",
    });
    return;
  }
  tokenHasCheckTimes++;
  const code = await wx.login();
  const [res, err] = await to(userApi.getUserToken(code.code));
  if (err) {
    getToken();
  } else {
    cache.set("access_token", res.data.access_token, res.data.expires_in);
    cache.set("refresh_token", res.data.refresh_token);
    // 并且将所有存储到观察者数组中的请求重新执行。
    onAccessTokenFetched();
  }
}

async function updateToken() {
  if (refreshTokenTimes >= 3) {
    wx.showToast({
      title: "出错啦",
      icon: "error",
    });
    return;
  }
  refreshTokenTimes++;
  const refreshToken = cache.get("refresh_token");
  const [res, err] = await to(userApi.refreshUserToken(refreshToken));
  if (err) {
    updateToken();
  } else {
    cache.set("access_token", res.data.access_token, res.data.expires_in);
    cache.set("refresh_token", res.data.refresh_token);
    onAccessTokenFetched();
  }
}
