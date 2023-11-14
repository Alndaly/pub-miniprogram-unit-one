import { to } from "../../../utils/util";
import userApi from "../../../api/user";

const computedBehavior = require("miniprogram-computed").behavior;

Page({
  behaviors: [computedBehavior],
  /**
   * Page initial data
   */
  data: {
    isLoading: false,
    pageNum: 0,
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    const [res, err] = await to(userApi.searchCommentMeLog(0));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      return;
    }
    this.setData({
      list: res.data,
    });
  },

  /**
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中",
    });
    const [res, err] = await to(userApi.searchCommentMeLog(0));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      return;
    }
    this.setData({
      list: res.data,
      pageNum: 0,
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
    const { pageNum, list } = this.data;
    const [res, err] = await to(userApi.searchCommentMeLog(pageNum + 1));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      this.setData({
        isLoading: false,
      });
      return;
    }
    const listNext = res.data;
    this.setData({
      list: {
        ...listNext,
        content: [...list.content, ...listNext.content],
      },
      pageNum: listNext.content.length > 0 ? pageNum + 1 : pageNum,
      isLoading: false,
    });
  },
});
