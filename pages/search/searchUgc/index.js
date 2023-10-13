// pages/search/searchUser/index.js
import ugcApi from "../../../api/ugc";
Page({
  /**
   * Page initial data
   */
  data: {
    ugcList: {
      list: [],
    },
    page: 0,
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    this.setData({
      options: options,
    });
    if (options.key) {
      wx.showLoading({
        title: "稍等哦",
      });
      await this.initUgcPage();
      wx.hideLoading();
    }
  },

  // 初始化用户列表
  async initUgcPage(e) {
    let res = await ugcApi.searchUgc(this.data.options.key, 0);
    this.setData({
      page: 0,
      ugcList: res.data.data,
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
    let res_ugc = await ugcApi.searchUgc(e.detail, 0);
    console.log("搜索用户: ", res_ugc);
    this.setData({
      ugcList: res_ugc.data.data,
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

  async refreshUgcPage(e) {
    let res = await ugcApi.searchUgc(
      this.data.options.key,
      0,
      this.data.ugcList.length
    );
    this.setData({
      ugcList: res.data.data,
    });
  },

  /**
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中",
    });
    await this.refreshUgcPage();
    wx.hideLoading({
      success: (res) => {},
    });
    wx.stopPullDownRefresh();
  },

  // 获取用户列表的下一页
  async getNextUgcPage(e) {
    const _this = this;
    this.setData({
      isLoading: true,
    });
    let res = await ugcApi.searchUgc(this.data.options.key, this.data.page + 1);
    if (res.data.code != "20000") {
      return;
    }
    const ugcListNext = res.data.data;
    this.setData({
      "ugcList.list": [...this.data.ugcList.list, ...ugcListNext.list],
      page: ugcListNext.list.length > 0 ? _this.data.page + 1 : _this.data.page,
      isLoading: false,
    });
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {
    this.getNextUgcPage();
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
