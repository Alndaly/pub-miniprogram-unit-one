// pages/uScore/top-up/index.js
import { to } from "../../../utils/util";
import uScoreApi from "../../../api/uScore";

Page({
  /**
   * Page initial data
   */
  data: {
    page_num: 0,
    isLoading: false,
  },

  async goTopUpUScore(e) {
    wx.showLoading({
      title: "请稍等",
    });
    const time = Date.now();
    const { score } = e.currentTarget.dataset;
    const [res, err] = await to(uScoreApi.topUpScorePre(score.id));
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
      return;
    }
    wx.hideLoading();
    const {
      packageVal,
      paySign,
      nonceStr,
      signType,
      timeStamp,
    } = res.data.data;
    wx.requestPayment({
      nonceStr: nonceStr,
      package: packageVal,
      paySign: paySign,
      timeStamp: timeStamp,
      signType: signType,
      success(res) {
        console.log(res);
        wx.showToast({
          title: "支付成功",
        });
        uScoreApi.topUpScore(score.id);
      },
      fail(err) {
        console.log(err);
        wx.showToast({
          title: "支付失败",
          icon: "error",
        });
      },
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    const [res, err] = await to(uScoreApi.getScoreTopUpList(0, 10));
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
      return;
    }
    this.setData({
      score_list: res.data.data,
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
    const [res, err] = await to(uScoreApi.getScoreTopUpList(0, 10));
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
      wx.hideLoading();
      return;
    }
    this.setData({
      score_list: res.data.data,
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
    const { page_num, score_list } = this.data;
    const [res, err] = await to(uScoreApi.getScoreTopUpList(page_num + 1, 10));
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
      this.setData({
        isLoading: true,
      });
      return;
    }
    new_score_list = {
      list: [...score_list.list, ...res.data.data.list],
      total_size: res.data.data.total_size,
    };
    this.setData({
      score_list: new_score_list,
      isLoading: false,
    });
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
