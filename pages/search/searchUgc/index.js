// pages/search/searchUser/index.js
import postApi from "../../../api/post";
import { to } from "../../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {
    postList: null,
    pageNum: 0,
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
      await this.initPostPage();
      wx.hideLoading();
    }
  },

  // 初始化用户列表
  async initPostPage(e) {
    const [res, err] = await to(postApi.searchPost(this.data.options.key, 0));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      pageNum: 0,
      postList: res.data,
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
    const [res_post, err_post] = await to(postApi.searchPost(e.detail, 0));
    if (err_post) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      wx.hideLoading();
      return;
    }
    this.setData({
      postList: res_post.data,
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

  async refreshPostPage(e) {
    const [res, err] = await to(postApi.searchPost(this.data.options.key, 0));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      pageNum: 0,
      postList: res.data,
    });
  },

  /**
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中",
    });
    await this.refreshPostPage();
    wx.hideLoading({
      success: (res) => {},
    });
    wx.stopPullDownRefresh();
  },

  // 获取用户列表的下一页
  async getNextPostPage(e) {
    const { options, pageNum, postList } = this.data;
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(postApi.searchPost(options.key, pageNum + 1));
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
    const postListNext = res.data;
    this.setData({
      postList: {
        ...postListNext,
        content: [...postList.content, ...postListNext.content],
      },
      pageNum: postListNext.content.length > 0 ? pageNum + 1 : pageNum,
      isLoading: false,
    });
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {
    this.getNextPostPage();
  },
});
