// pages/activity/home/index.js
import activityApi from "../../../api/activity";
import { getNowDate } from "../../../utils/util";
import { to } from "../../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {
    page: 0,
    currentTime: "",
  },

  goToActivity(e) {
    const { activity } = e.currentTarget.dataset;
    wx.$router.push(`/pages/activity/detail/index`, {
      activity_id: activity.activity_info.id,
    });
  },

  goActivityPage(e) {
    wx.$router.push("/pages/activity/home/index");
  },

  goLocation(e) {
    const { location } = e.currentTarget.dataset;
    wx.openLocation({
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
    });
  },

  async onPullDownRefresh(e) {
    wx.showLoading({
      title: "加载中",
    });
    const [res, err] = await to(activityApi.getMySubscribedActivities(0));
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

  goBackPage() {
    wx.$router.back();
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    setInterval(() => {
      this.setData({
        currentTime: getNowDate(),
      });
    }, 1000);
    // 获取右上角胶囊位置
    const res_head_btn = wx.getMenuButtonBoundingClientRect();
    this.setData({
      back_btn_top: res_head_btn.top,
      back_btn_left: wx.getSystemInfoSync().windowWidth - res_head_btn.right,
      back_btn_height: res_head_btn.height,
      back_btn_width: res_head_btn.width,
    });
    wx.showLoading({
      title: "加载中",
    });
    const [res, err] = await to(activityApi.getMySubscribedActivities(0));
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
      activityApi.getMySubscribedActivities(this.data.page + 1)
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
