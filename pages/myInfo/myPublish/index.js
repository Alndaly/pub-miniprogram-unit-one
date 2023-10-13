// pages/myInfo/myPublish/index.js
import ugcApi from "../../../api/ugc";
import { _ } from "../../../utils/underscore-min";

Page({
  /**
   * Page initial data
   */
  data: {
    pageDaily: 0,
    isLoading: false,
    myUgcList: [],
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

  async getNextDaily() {
    this.setData({
      isLoading: true,
    });
    const res = await ugcApi.getMyUgc(this.data.pageDaily + 1);
    if (res.data.code != "20000") {
      return;
    }
    const ugcListNext = res.data.data;
    this.setData({
      "myUgcList.list": [...this.data.myUgcList.list, ...ugcListNext.list],
      pageDaily:
        ugcListNext.list.length > 0
          ? this.data.pageDaily + 1
          : this.data.pageDaily,
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
    const myUgcList = await ugcApi.getMyUgc(0);
    console.log("我发布的Ugc：", myUgcList);
    this.setData({
      myUgcList: myUgcList.data.data,
    });
    wx.hideLoading({
      success: (res) => {},
    });
  },

  async onReachBottom(options) {
    this.getNextDaily();
  },

  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中...",
    });
    let myUgcList = await ugcApi.getMyUgc(
      0,
      this.data.pageDaily === 0 ? 10 : (this.data.pageDaily + 1) * 10
    );
    this.setData({
      myUgcList: myUgcList.data.data,
    });
    wx.showToast({
      title: "刷新成功",
    });
    wx.stopPullDownRefresh();
  },

});
