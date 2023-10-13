// pages/myInfo/beCommented/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import { to } from "../../../utils/util";
import userApi from "../../../api/user";

Page({
  behaviors: [computedBehavior],
  /**
   * Page initial data
   */
  data: {
    isLoading: false,
    page_num: 1,
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    const [res, err] = await to(userApi.getCommentedMine(1));
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
      return;
    }
    let commented = res.data.data;
    this.setData({
      commented,
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {},

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {},

  /**
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中",
    });
    const [res, err] = await to(userApi.getCommentedMine(1));
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
      return;
    }
    let commented = res.data.data;
    this.setData({
      commented,
      page_num: 1,
    });
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * Called when page reach bottom
   */
  async onReachBottom() {
    this.setData({
      isLoading: true,
    });
    const { page_num, commented } = this.data;
    const [res, err] = await to(userApi.getCommentedMine(page_num + 1));
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
      this.setData({
        isLoading: false,
      });
      return;
    }
    let commented_next = res.data.data;
    let newCommented = {
      list: [...commented.list, ...commented_next.list],
      total_size: commented_next.total_size,
    };
    this.setData({
      commented: newCommented,
      page_num: page_num + 1,
      isLoading: false,
    });
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
