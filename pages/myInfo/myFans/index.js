// pages/myInfo/myFans/index.js
import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  data: {
    page: 0,
    fansList: [],
    isLoading: false,
  },

  toUserInfo(e) {
    const { id } = e.currentTarget.dataset.id;
    wx.$router.push("/pages/userInfo/index", { user_id: id });
  },

  async onShow() {
    wx.showLoading({
      title: "加载中...",
    });
    const [res, err] = await to(userApi.getMyFans(0));
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
      fansList: res.data.data,
      isLoading: false,
    });
    wx.hideLoading();
  },

  async onPullDownRefresh(e) {
    wx.showLoading({
      title: "刷新中",
    });
    const [res, err] = await to(
      userApi.getMyFans(
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
      fansList: res.data.data,
      isLoading: false,
    });
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  async onReachBottom() {
    // 显示加载中提高交互
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(userApi.getMyFans(this.data.page + 1));
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
    let fansListNext = res.data.data;
    this.setData({
      page: fansListNext.list.length > 0 ? this.data.page + 1 : this.data.page,
      "fansList.list": [...this.data.fansList.list, ...fansListNext.list],
      isLoading: false,
    });
  },
});
