// pages/myInfo/myPublish/index.js
import ugcApi from "../../../api/ugc";
import { _ } from "../../../utils/underscore-min";
import { to } from "../../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {
    parent: {
      id: -1,
    },
    pageVote: 0,
    isLoading: false,
    myVoteList: [],
  },
  // 关闭用户评论弹窗
  onCloseUgcCommentAction(e) {
    this.setData({
      showUgcCommentAction: false,
      ugcDetailOfCommentList: null,
    });
    setTimeout(() => {
      if (typeof this.getTabBar === "function" && this.getTabBar()) {
        this.getTabBar().setData({
          show: true,
        });
      }
    }, 300);
  },

  onFocusCommentToCommentInput(e) {
    this.setData({
      parent: e.detail,
      focus_input: true,
    });
  },

  // 显示用户评论
  async onShowUgcCommentAction(e) {
    const [res, err] = await to(ugcApi.getUgcComment(e.detail.id));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
    }
    this.setData({
      showUgcCommentAction: true,
      ugcCommentList: res.data.data,
      ugcDetailOfCommentList: e.detail,
    });
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        show: false,
      });
    }
  },

  async getNextVote() {
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(ugcApi.getMyVote(this.data.pageVote + 1));
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
    const voteListNext = res.data.data;
    this.setData({
      "myVoteList.list": [...this.data.myVoteList.list, ...voteListNext.list],
      pageVote:
        voteListNext.list.length > 0
          ? this.data.pageVote + 1
          : this.data.pageVote,
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
    const [res, err] = await to(ugcApi.getMyVote(0));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      myVoteList: res.data.data,
    });
    wx.hideLoading();
  },

  async onReachBottom(options) {
    this.getNextVote();
  },

  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中...",
    });
    const [res, err] = await to(
      ugcApi.getMyVote(
        0,
        this.data.pageVote === 0 ? 10 : (this.data.pageVote + 1) * 10
      )
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      wx.stopPullDownRefresh();
      return;
    }
    this.setData({
      myVoteList: res.data.data,
    });
    wx.showToast({
      title: "刷新成功",
    });
    wx.stopPullDownRefresh();
  },
});
