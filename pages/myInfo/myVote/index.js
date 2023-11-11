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

  async getNextPage() {
    const { pageNum, posts } = this.data;
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(postApi.getMyLiked("", pageNum + 1));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      this.setData({
        isLoading: false,
      });
      return;
    }
    const postsNext = res.data;
    this.setData({
      posts: {
        ...postsNext,
        content: [...posts.content, ...postsNext.content],
      },
      pageNm: postsNext.content.length > 0 ? pageNum + 1 : pageNum,
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
    const [res, err] = await to(postApi.getMyLiked("", 0));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      return;
    }
    this.setData({
      posts: res.data,
    });
    wx.hideLoading();
  },

  async onReachBottom(options) {
    this.getNextPage();
  },

  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中...",
    });
    const [res, err] = await to(postApi.getMyLiked("", 0));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      wx.stopPullDownRefresh();
      return;
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
