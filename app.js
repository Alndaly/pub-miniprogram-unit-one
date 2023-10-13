import routerUtils from "./router/router";
import { getPageUrl } from "./utils/util";
import userUtils from "./utils/user";
import { updateApp } from "./utils/update";
import cache from "./utils/cache";

App({
  async onShow(options) {
    updateApp();
    userUtils.updateLocalUserInfo();
    setTimeout(() => {
      this.checkUser();
    }, 1000);
  },

  /**
   * 检查用户的一些状态
   */
  async checkUser() {
    if (cache.get("account_status") >= 100) {
      if (getPageUrl() === "/pages/error/index") {
        return;
      }
      wx.reLaunch({
        url: "/pages/error/index",
      });
      return;
    }
  },

  async onLaunch(options) {
    // 全局注册路由
    wx.$router = routerUtils;
    wx.$user = userUtils;
  },

  globalData: {
    sysWidth: wx.getSystemInfoSync().windowWidth,
  },
});
