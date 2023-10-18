// 一个全局的http请求拦截封装
// 注意更新TOKEN的请求优先级最高
// 注意获取TOKEN并存储本地的请求优先级最高
import cache from "./cache";
import userApi from "../api/user";
import { URL } from "../configs/base";

// 默认刷新状态，确保一旦遇到token过期的状况就能更新
let isRefreshing = true;
// 默认是否有Token状态
let hasToken = false;
// 防止多次请求token获取接口
let tokenHasCheckTimes = 1;

function checkStatus(params) {
  // 刷新token的函数，这需要添加一个开关，防止重复请求
  if (isRefreshing) {
    updateToken();
  }
  isRefreshing = false;
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
  // 本地没有token时获取token的函数,这需要添加一个开关，防止重复请求
  if (!hasToken && tokenHasCheckTimes === 1) {
    getToken();
  }
  hasToken = true;
  tokenHasCheckTimes += 1;
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
    Authorization: "Bearer " + cache.directGet("Authorization")?.data,
    "Accept-Encoding": "gzip, deflate, br",
    "content-type": "application/json",
  };
  // 注册第一步的接口由于后端Java框架，特殊处理
  if (args.url.endsWith("/post/user/create")) {
    delete header["Authorization"];
    header["content-type"] = "application/x-www-form-urlencoded";
  }
  return new Promise((resolve, reject) => {
    console.log("req ==>", args);
    wx.request({
      header,
      ...args,
      success: (res) => {
        console.log("res <==", res);
        if (res.data.code != 20000) {
          if (res.data.code === 20003 && res.data.message !== "请重新登录") {
            if (res.data.message === "不合法的token") {
              console.log("没有Token");
              // 如果前端传参中没有Token参数
              resolve(checkHasToken(args));
              return;
            } else {
              console.warn("token已过期");
              // 如果token已经过期则此处
              resolve(checkStatus(args));
              return;
            }
          } else if (
            res.data.code === 20003 &&
            res.data.message === "请重新登录"
          ) {
            wx.showModal({
              showCancel: false,
              title: "提醒",
              content: "请重新登录",
              success(res) {
                cache.clear();
                if (res.confirm) {
                  wx.$router.push("/pages/authPage/index");
                }
              },
            });
            return;
          }
          reject(res);
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

async function getToken(e) {
  console.log("token开始获取");
  try {
    const code = await wx.login();
    const res_token = await userApi.initUser(code.code);
    cache.set(
      "Authorization",
      res_token.data.data.access_token,
      res_token.data.data.expires_in
    );
    cache.set("refresh_token", res_token.data.data.refresh_token);
    console.log("Token获取完成: ", res_token.data.data);
    // 并且将所有存储到观察者数组中的请求重新执行。
    onAccessTokenFetched();
    hasToken = true;
  } catch (err) {
    console.error("Token获取失败", err);
  }
}

function updateToken(params) {
  console.log("token开始更新");
  if (cache.directGet("Authorization")) {
    const refreshToken = cache.get("refresh_token");
    wx.request({
      url: URL.api_url + "/post/refreshToken",
      data: {
        refreshToken,
      },
      method: "POST",
      success(res_token) {
        console.log("Token刷新结果:", res_token);
        if (
          res_token.data.code === 20003 &&
          res_token.data.message === "请重新登录"
        ) {
          try {
            wx.hideLoading({
              success: (res) => {},
            });
          } catch (error) {
            console.log(err);
          }
          wx.showModal({
            showCancel: false,
            title: "提醒",
            content: "账号信息已过期，请重新登录",
            success(res) {
              if (res.confirm) {
                cache.clear();
                wx.$router.push("/pages/authPage/index");
              }
            },
          });
        } else {
          try {
            cache.set(
              "Authorization",
              res_token.data.data.access_token,
              res_token.data.data.expires_in
            );
            cache.set("refresh_token", res_token.data.data.refresh_token);
            console.log("token更新完成");
            // 并且将所有存储到观察者数组中的请求重新执行。
            onAccessTokenFetched();
            // 纸条撕掉
            isRefreshing = true;
          } catch (error) {
            console.warn("token更新失败", error);
          }
        }
      },
      fail(err) {
        console.error(err);
      },
    });
  }
}
