// pages/search/searchUser/index.js
import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {
    userList: null,
    pageNum: 0,
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    if (options.key) {
      wx.showLoading({
        title: "稍等哦",
      });
    }
    this.setData({
      options: options,
    });
    await this.initUserPage();
    wx.hideLoading();
  },

  // 初始化用户列表
  async initUserPage(e) {
    const [res, err] = await to(userApi.searchUser(this.data.options.key, 0));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
    }
    this.setData({
      pageNum: 0,
      userList: res.data,
    });
  },

  // 确认搜索时
  async onSearch(e) {
    wx.showLoading({
      title: "稍等哦",
    });
    this.setData({
      options: {
        key: e.detail,
      },
    });
    const [res_user, err_user] = await to(userApi.searchUser(e.detail, 0));
    if (err_user) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      userList: res_user.data,
    });
    wx.hideLoading();
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {
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
    });
  },

  async refreshUserPage(e) {
    const [res, err] = await to(userApi.searchUser(this.data.options.key, 0));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      pageNum: 0,
      userList: res.data.data,
    });
  },

  /**
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中",
    });
    await this.refreshUserPage();
    wx.hideLoading({
      success: (res) => {},
    });
    wx.stopPullDownRefresh();
  },

  // 获取用户列表的下一页
  async getNextUserPage(e) {
    const { pageNum, options } = this.data;
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(userApi.searchUser(options.key, pageNum + 1));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    const userListNext = res.data;
    this.setData({
      userList: {
        ...userListNext,
        content: [...userList.content, ...userListNext.content],
      },
      pageNum: userListNext.content.length > 0 ? pageNum + 1 : pageNum,
      isLoading: false,
    });
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {
    this.getNextUserPage();
  },
});
