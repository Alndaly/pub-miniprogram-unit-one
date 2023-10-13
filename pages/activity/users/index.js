// pages/activity/users/index.js
import { to } from "../../../utils/util";
import activityApi from "../../../api/activity";

Page({
  /**
   * Page initial data
   */
  data: {
    isLoading: false,
    users: {
      list: [],
      total_size: 0,
    },
    page_num: 0,
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    this.setData({
      options,
    });
    const [res, err] = await to(
      activityApi.getActivityTimeLocationUser(options.activity_time_id, 0, 10)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      users: res.data.data,
    });
  },

  /**
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    const { options } = this.data;
    wx.showLoading({
      title: "刷新中",
    });
    const [res, err] = await to(
      activityApi.getActivityTimeLocationUser(options.activity_time_id, 0, 10)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      users: res.data.data,
    });
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  goUserInfo(e) {
    const { user } = e.currentTarget.dataset;
    wx.$router.push(`/pages/userInfo/index`, { user_id: user.id });
  },

  /**
   * Called when page reach bottom
   */
  async onReachBottom() {
    this.setData({
      isLoading: true,
    });
    const { options, users, page_num } = this.data;
    const [res, err] = await to(
      activityApi.getActivityTimeLocationUser(
        options.activity_time_id,
        page_num + 1,
        10
      )
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        isLoading: false,
      });
      return;
    }
    this.setData({
      isLoading: false,
      users: {
        list: [...user.list, ...res.data.data.list],
        total_size: res.data.data.total_size,
      },
      page_num: page_num + 1,
    });
  },
});
