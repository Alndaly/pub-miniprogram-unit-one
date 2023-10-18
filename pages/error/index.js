// pages/error/index.js
import userApi from "../../api/user";
import cache from "../../utils/cache";
import { to } from "../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {
    process_list: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    const [res, err] = await to(userApi.getUserProcess());
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      process_list: res.data.data,
    });
  },

  async refresh(e) {
    wx.showLoading({
      title: "刷新中",
    });
    await wx.$user.updateLocalUserInfo();
    wx.hideLoading();
    if (cache.get("account_status") < 100) {
      wx.$router.push("/pages/home/index");
    }
  },
  
});
