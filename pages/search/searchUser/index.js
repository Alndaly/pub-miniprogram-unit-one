// pages/search/searchUser/index.js
import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {
    userList: {
      list: [],
    },
    page: 0,
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
      page: 0,
      userList: res.data.data,
    });
  },

  // 确认搜索时
  async onSearch(e) {
    if (!e.detail) {
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "请输入搜索关键词",
      });
      return;
    }
    wx.showLoading({
      title: "稍等哦",
    });
    this.setData({
      options: {
        key: e.detail,
      },
    });
    let [res_user, err_user] = await to(userApi.searchUser(e.detail, 0));
    if (err_user) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      userList: res_user.data.data,
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
      fail: (res) => {
        console.error("获取系统信息出错", res);
      },
    });
  },

  async refreshUserPage(e) {
    let [res, err] = await to(
      userApi.searchUser(this.data.options.key, 0, this.data.userList.length)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
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
    const _this = this;
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(
      userApi.searchUser(this.data.options.key, this.data.page + 1)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    const userListNext = res.data.data;
    this.setData({
      "userList.list": [...this.data.userList.list, ...userListNext.list],
      page:
        userListNext.list.length > 0 ? _this.data.page + 1 : _this.data.page,
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
