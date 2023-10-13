// pages/activity/home/index.js
import activityApi from "../../../api/activity";
import { to } from "../../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {
    page: 0,
  },

  goToActivity(e) {
    const { activity } = e.currentTarget.dataset;
    wx.$router.push(`/pages/activity/detail/index`, {
      activity_id: activity.id,
    });
  },

  async onPullDownRefresh(e) {
    wx.showLoading({
      title: "加载中",
    });
    const [res, err] = await to(activityApi.getAllActivities("", 0));
    if (err) {
      wx.showToast({
        title: res_loss.data.message || err_loss.data.message,
        icon: "error",
      });
    } else {
      this.setData({
        page: 0,
        activity: res.data.data,
      });
    }
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    wx.showLoading({
      title: "加载中",
    });
    const [res, err] = await to(activityApi.getAllActivities("", 0));
    if (err) {
      wx.showToast({
        title: err.data.message || "出错啦",
        icon: "error",
      });
    }
    wx.hideLoading();
    this.setData({
      activity: res.data.data,
    });
  },

  /**
   * Called when page reach bottom
   */
  async onReachBottom(e) {
    this.setData({
      isLoading: true,
    });
    let [res, err] = await to(
      activityApi.getAllActivities("", this.data.page + 1)
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
  
});
