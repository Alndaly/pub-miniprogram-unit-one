// pages/myInfo/myAttention.js
import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  data: {
    page: 0,
    focusList: [],
    isLoading: false,
  },

  toUserInfo(e) {
    const { id } = e.currentTarget.dataset.id;
    wx.$router.push("/pages/userInfo/index", { user_id: id });
  },

  async onLoad() {
    wx.showLoading({
      title: "加载中...",
    });
    const [res, err] = await to(userApi.getMyFocusedUser(0));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        isLoading: false,
      });
      wx.hideLoading();
      return;
    }
    this.setData({
      focusList: res.data.data,
      isLoading: false,
    });
    wx.hideLoading();
  },

  async onPullDownRefresh(e) {
    wx.showLoading({
      title: "刷新中",
    });
    const [res, err] = await to(
      userApi.getMyFocusedUser(
        0,
        this.data.page === 0 ? 10 : (this.data.page + 1) * 10
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
      wx.stopPullDownRefresh();
      return;
    }
    this.setData({
      focusList: res.data.data,
      isLoading: false,
    });
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  async onReachBottom() {
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(userApi.getMyFocusedUser(this.data.page + 1));
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
    const focusListNext = res.data.data;
    this.setData({
      page: focusListNext.list.length > 0 ? this.data.page + 1 : this.data.page,
      "focusList.list": [...this.data.focusList.list, ...focusListNext.list],
      isLoading: false,
    });
  },
});
