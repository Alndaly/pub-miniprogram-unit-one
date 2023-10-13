// pages/myInfo/identity/detail/index.js
import { to } from "../../../../utils/util";
import userApi from "../../../../api/user";

Page({
  /**
   * Page initial data
   */
  data: {},

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    wx.getSystemInfo({
      success: (e) => {
        let custom = wx.getMenuButtonBoundingClientRect();
        let CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.setData({
          CustomBar: CustomBar,
          StatusBar: e.statusBarHeight,
          Custom: custom,
        });
      },
      fail: (res) => {
        console.log("获取系统信息出错", res);
      },
    });
    this.setData({
      options,
    });
    const { id } = options;
    const [res, err] = await to(userApi.getUserIdentityDetail(id));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({ identity: res.data.data });
  },

  onReSubmit(e) {
    const { identity } = this.data;
    wx.$router.push(`/pages/myInfo/identity/reSend/index`, { id: identity.id });
  },

  onChange(e) {
    const { identity } = this.data;
    wx.$router.push(`/pages/myInfo/identity/reSend/index`, {
      id: identity.id,
    });
  },

  /**
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中",
    });
    const {
      options: { id },
    } = this.data;
    const [res, err] = await to(userApi.getUserIdentityDetail(id));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({ identity: res.data.data });
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },
});
