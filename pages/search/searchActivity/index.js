// pages/search/searchActivity/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import activityApi from "../../../api/activity";
import cache from "../../../utils/cache";
import { to } from "../../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {
    page: 0,
    activity: {
      list: [],
      total_size: 0,
    },
    search_key: "",
  },

  clearSearch(e) {
    this.setData({
      search_key: "",
    });
  },

  goToActivity(e) {
    const { activity } = e.currentTarget.dataset;
    wx.$router.push(`/pages/activity/detail/index`, {
      activity_id: activity.id,
    });
  },

  async onSearch(e) {
    wx.showLoading({
      title: "加载中",
    });
    const [res, err] = await to(
      activityApi.getAllActivities(this.data.search_key, 0)
    );
    if (err) {
      wx.showToast({
        title: res_loss.data.message || err_loss.data.message,
        icon: "error",
      });
    } else {
      this.setData({
        activity: res.data.data,
      });
    }
    wx.hideLoading();
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.setData({
      options: options,
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
  async onPullDownRefresh(e) {
    wx.showLoading({
      title: "加载中",
    });
    const [res, err] = await to(
      activityApi.getAllActivities(this.data.search_key, 0)
    );
    if (err) {
      wx.showToast({
        title: res_loss.data.message || err_loss.data.message,
        icon: "error",
      });
    } else {
      this.setData({
        activity: res.data.data,
      });
    }
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * Called when page reach bottom
   */
  async onReachBottom(e) {
    this.setData({
      isLoading: true,
    });
    let [res, err] = await to(
      activityApi.getAllActivities(this.data.search_key, this.data.page + 1)
    );
    if (err) {
      this.setData({
        isLoading: false,
      });
      wx.showToast({
        title: err.data.message,
        icon: "err",
      });
      return;
    }
    const activityNext = res?.data?.data;
    this.setData({
      "activity.list": [...this.data.activity.list, ...activityNext.list],
      isLoading: false,
    });
    if (activityNext && activityNext.list.length > 0) {
      this.setData({
        page: this.data.page + 1,
      });
    }
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
