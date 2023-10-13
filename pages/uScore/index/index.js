// pages/uScore/index/index.js
import { to } from "../../../utils/util";
import userApi from "../../../api/user";
import { _ } from "../../../utils/underscore-min";

Page({
  /**
   * Page initial data
   */
  data: {
    page_num: 0,
    current: 0,
    isLoading: false,
    refresherTriggered: false,
  },

  goTopUp(e) {
    wx.$router.push("/pages/uScore/topUp/index");
  },

  async onRefresh(e) {
    const [res, err] = await to(userApi.userUScoreRecord(0));
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
    }
    this.setData({
      refresherTriggered: false,
      we_score_record: res.data.data,
      page_num: 0,
    });
  },

  async onNextPage(e) {
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(
      userApi.userUScoreRecord(this.data.page_num + 1)
    );
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
    const { we_score_record } = this.data;
    we_score_record.list = we_score_record.list.concat(res.data.data.list);
    we_score_record.total_size = res.data.data.total_size;
    this.setData({
      we_score_record,
      page_num: this.data.page_num + 1,
      isLoading: false,
    });
  },

  showGetMethod(e) {
    this.setData({
      current: 0,
    });
  },

  // 去积分兑换
  goScoreExchange(e) {
    wx.showToast({
      title: "功能开发中，请稍后几日...",
      icon: "none",
    });
  },

  // 去抽奖
  goLucky(e) {
    wx.showToast({
      title: "功能开发中，请稍后几日...",
      icon: "none",
    });
  },

  showGetRecord(e) {
    this.setData({
      current: 1,
    });
  },

  showUseWay(e) {
    this.setData({
      current: 2,
    });
  },

  goPublish(e) {
    wx.$router.push("/pages/publish/index/index");
  },

  goComment(e) {
    wx.$router.push("/pages/home/index");
  },

  swiperChange: function (e) {
    this.setData({
      current: e.detail.current,
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    const [res, err] = await to(userApi.userUScoreRecord(0));
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
    }
    this.setData({
      we_score_record: res.data.data,
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
  onPullDownRefresh() {},

  /**
   * Called when page reach bottom
   */
  onReachBottom() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
