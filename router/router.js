// 路由统一封装，方便统一管理拦截
import { urlEncode } from "../utils/util";

export default {
  back() {
    return new Promise((resolve, reject) => {
      wx.navigateBack({
        delta: 0,
        success(res) {
          resolve(res);
        },
        fail(err) {
          wx.reLaunch({
            url: "/pages/home/index",
          });
          reject(err);
        },
      });
    });
  },

  push(path, params = {}) {
    console.log("跳转页面: ", path, "传参: ", params);
    const suffix = urlEncode(params);
    // 防止某些情况下页面路径不带有/前缀
    if (!path.startsWith("/")) path = "/" + path;
    // 底部tabPage的路径列表
    const tabPage = [
      "/pages/home/index",
      "/pages/publish/index/index",
      "/pages/myInfo/index/index",
    ];
    // 暂时不开通的功能页
    const notOnlinePage = [];
    return new Promise((resolve, reject) => {
      // 如果页面还未上线，就弹窗提醒等候几日
      if (notOnlinePage.indexOf(path) !== -1) {
        wx.showToast({
          title: "功能即将上线，请稍等候几日哦～",
          icon: "none",
        });
        return;
      }
      // 如果页面是tab级别的
      if (tabPage.indexOf(path) !== -1) {
        wx.switchTab({
          url: path,
          success(res) {
            resolve(res);
          },
          fail(res) {
            console.error("页面跳转出错:", res);
            reject(res);
          },
        });
      } else {
        // 如果页面不是tab级别
        wx.navigateTo({
          url: `${path}?${suffix}`,
          success(res) {
            resolve(res);
          },
          fail(res) {
            console.error("页面跳转出错:", res);
            reject(res);
          },
        });
      }
    });
  },
};
