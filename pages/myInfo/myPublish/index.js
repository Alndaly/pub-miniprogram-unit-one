// pages/myInfo/myPublish/index.js
import postApi from "../../../api/post";
import { _ } from "../../../utils/underscore-min";
import { to } from "../../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {
    pageNum: 0,
    isLoading: false,
    posts: null,
  },

  async getNext() {
    const { pageNum, posts } = this.data;
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(postApi.searchMyPost("", pageNum + 1));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      return;
    }
    const postsNext = res.data;
    this.setData({
      posts: {
        ...postsNext,
        content: [...posts.content, ...postsNext.content],
      },
      pageNum: postsNext.content.length > 0 ? pageNum + 1 : pageNum,
      isLoading: false,
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    wx.showLoading({
      title: "加载中",
    });
    const [res, err] = await to(postApi.searchMyPost("", 0));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
    }
    this.setData({
      posts: res.data,
    });
    wx.hideLoading({
      success: (res) => {},
    });
  },

  async onReachBottom(options) {
    this.getNext();
  },

  async onFinishDleteUgc(e) {
    const { posts } = this.data;
    posts.content.splice(e.detail.index, 1);
    this.setData({
      posts,
    });
  },

  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中...",
    });
    const [res, err] = await to(postApi.searchMyPost("", 0));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
    }
    this.setData({
      posts: res.data,
    });
    wx.showToast({
      title: "刷新成功",
    });
    wx.stopPullDownRefresh();
  },
});
