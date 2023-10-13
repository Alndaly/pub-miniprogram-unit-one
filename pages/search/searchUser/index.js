// pages/search/searchUser/index.js
import userApi from "../../../api/user";
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
    let res = await userApi.searchUser(this.data.options.key, 0);
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
    console.log("搜索关键词:", e.detail);
    wx.showLoading({
      title: "稍等哦",
    });
    this.setData({
      options: {
        key: e.detail,
      },
    });
    let res_user = await userApi.searchUser(e.detail, 0);
    console.log("搜索用户: ", res_user);
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
        console.log("获取系统信息出错", res);
      },
    });
  },

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

  async refreshUserPage(e) {
    let res = await userApi.searchUser(
      this.data.options.key,
      0,
      this.data.userList.length
    );
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
    let res = await userApi.searchUser(
      this.data.options.key,
      this.data.page + 1
    );
    console.log("搜索用户: ", res);
    if (res.data.code != "20000") {
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

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
