import routerUtils from "./router/router";
import userUtils from "./utils/user";
import { updateApp } from "./utils/update";

App({
  async onShow(options) {
    updateApp();
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
