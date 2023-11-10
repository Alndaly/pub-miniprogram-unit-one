// pages/myInfo/myAttention.js
import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  data: {
    pageNum: 0,
    follows: null,
    isLoading: false,
  },

  toUserInfo(e) {
    const { id } = e.currentTarget.dataset;
    wx.$router.push("/pages/userInfo/index", { user_id: id });
  },

  async onLoad() {
    wx.showLoading({
      title: "加载中...",
    });
    const [res, err] = await to(userApi.getMyFollowedUser(0));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      this.setData({
        isLoading: false,
      });
      wx.hideLoading();
      return;
    }
    this.setData({
      follows: res.data,
      isLoading: false,
    });
    wx.hideLoading();
  },

  async onPullDownRefresh(e) {
    wx.showLoading({
      title: "刷新中",
    });
    const [res, err] = await to(userApi.getMyFollowedUser(0));
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
      follows: res.data,
      isLoading: false,
      pageNum: 0,
    });
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  async onReachBottom() {
    const { pageNum, follows } = this.data;
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(userApi.getMyFollowedUser(pageNum + 1));
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
    const followsNext = res.data;
    this.setData({
      pageNum: followsNext.content.length > 0 ? pageNum + 1 : pageNum,
      follows: {
        ...followsNext,
        content: [...follows.content, ...followsNext.content],
      },
      isLoading: false,
    });
  },
});
