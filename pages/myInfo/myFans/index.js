// pages/myInfo/myFans/index.js
import userApi from "../../../api/user";

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
    let res = await userApi.getMyFans(0);
    console.log("我的粉丝: ", res);
    if (res.data.code != "20000") {
      this.setData({
        isLoading: false,
      });
      return;
    }
    this.setData({
      fansList: res.data.data,
      isLoading: false,
    });
    wx.hideLoading({
      success: (res) => {},
    });
  },

  async onPullDownRefresh(e) {
    wx.showLoading({
      title: "刷新中",
    });
    let res = await userApi.getMyFans(
      0,
      this.data.page === 0 ? 10 : (this.data.page + 1) * 10
    );
    console.log("我的粉丝: ", res);
    if (res.data.code != "20000") {
      return;
    }
    this.setData({
      fansList: res.data.data,
      isLoading: false,
    });
    wx.hideLoading({
      success: (res) => {},
    });
    wx.stopPullDownRefresh();
  },

  async onReachBottom() {
    // 显示加载中提高交互
    this.setData({
      isLoading: true,
    });
    let res;
    res = await userApi.getMyFans(this.data.page + 1);
    console.log("我的粉丝: ", res);
    if (res.data.code != "20000") {
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
