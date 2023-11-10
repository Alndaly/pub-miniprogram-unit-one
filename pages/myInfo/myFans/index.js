// pages/myInfo/myFans/index.js
import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  data: {
    pageNum: 0,
    fans: null,
    isLoading: false,
  },

  toUserInfo(e) {
    const { id } = e.currentTarget.dataset;
    wx.$router.push("/pages/userInfo/index", { user_id: id });
  },

  async onLoad(options) {
    wx.showLoading({
      title: "加载中...",
    });
    const [res, err] = await to(userApi.getMyFans(0));
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
    this.setData({
      fans: res.data,
      isLoading: false,
    });
    wx.hideLoading();
  },

  async onPullDownRefresh(e) {
    wx.showLoading({
      title: "刷新中",
    });
    const [res, err] = await to(userApi.getMyFans(0));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      this.setData({
        isLoading: false,
      });
      wx.stopPullDownRefresh();
      return;
    }
    this.setData({
      fans: res.data,
      isLoading: false,
      pageNum: 0,
    });
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  async onReachBottom() {
    const { pageNum, fans } = this.data;
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(userApi.getMyFans(pageNum + 1));
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
    const fansNext = res.data;
    this.setData({
      page: fansNext.content.length > 0 ? pageNum + 1 : pageNum,
      fans: {
        ...fansNext,
        content: [...fans.content, ...fansNext.content],
      },
      isLoading: false,
    });
  },
});
