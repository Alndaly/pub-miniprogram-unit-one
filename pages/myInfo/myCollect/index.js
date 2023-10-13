// pages/myInfo/myPublish/index.js
import ugcApi from "../../../api/ugc";
import { _ } from "../../../utils/underscore-min";

Page({
  /**
   * Page initial data
   */
  data: {
    parent: {
      id: -1,
    },
    pageDaily: 0,
    isLoading: false,
    myCollectList: [],
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
    const res = await ugcApi.getUgcComment(e.detail.id);
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

  async getNextCollect() {
    this.setData({
      isLoading: true,
    });
    const res = await ugcApi.getMyCollect(this.data.pageCollect + 1);
    if (res.data.code != "20000") {
      return;
    }
    const collectListNext = res.data.data;
    this.setData({
      "myCollectList.list": [
        ...this.data.myCollectList.list,
        ...collectListNext.list,
      ],
      pageCollect:
        collectListNext.list.length > 0
          ? this.data.pageCollect + 1
          : this.data.pageCollect,
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
    const myCollectList = await ugcApi.getMyCollect(0);
    console.log("我收藏的Ugc：", myCollectList);
    this.setData({
      myCollectList: myCollectList.data.data,
    });
    wx.hideLoading({
      success: (res) => {},
    });
  },

  async onReachBottom(options) {
    this.getNextCollect();
  },

  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中...",
    });
    let myCollectList = await ugcApi.getMyCollect(
      0,
      this.data.pageCollect === 0 ? 10 : (this.data.pageCollect + 1) * 10
    );
    this.setData({
      myCollectList: myCollectList.data.data,
    });
    wx.showToast({
      title: "刷新成功",
    });
    wx.stopPullDownRefresh();
  },

});
