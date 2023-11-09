// pages/home/index.js
import { to } from "../../utils/util";
import postApi from "../../api/post";
import { _ } from "../../utils/underscore-min";

Page({
  /**
   * Page initial data
   */
  data: {
    topTips: "松手刷新",
    isLoading: false,
    refresherTriggered: false,
    chosedTabId: null,
    postList: {
      content: [],
    },
    pageNum: 0,
  },

  async goSearchPage() {
    await wx.$router.push("/pages/search/home/index");
  },

  onShowLabels(e) {
    wx.$router.push("/pages/labels/index");
  },

  async onChangeTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab.id === this.data.chosedTab.id) {
      return;
    }
    this.setData({
      chosedTab: tab.id,
      pageNum: 0,
      postList: {
        content: [],
      },
    });
    this.setData({
      refresherTriggered: true,
    });
  },

  // 下拉刷新
  async onRefresh(e) {
    // 再获取帖子
    const { chosedTabId } = this.data;
    let [res, err] = [];
    if (chosedTabId) {
      [res, err] = await to(postApi.searchLabelPost(chosedTabId, "", 0));
    } else {
      [res, err] = await to(postApi.searchPost("", 0, 10));
    }
    if (err) {
      wx.showToast({
        title: err,
        icon: "error",
      });
      this.setData({
        refresherTriggered: false,
      });
      return;
    }
    wx.hideLoading();
    this.setData({
      postList: res.data,
    });
    this.setData({
      isLoading: false,
      refresherTriggered: false,
    });
  },

  // 下一页
  async onNextPage(e) {
    this.setData({
      isLoading: true,
    });
    const { chosedTabId } = this.data;
    let [res, err] = [];
    if (chosedTabId) {
      [res, err] = await to(postApi.searchLabelUgc(chosedTabId, "", 0));
    } else {
      [res, err] = await to(postApi.searchPost("", this.data.pageNum + 1));
    }
    if (err) {
      this.setData({
        isLoading: false,
      });
      wx.showToast({
        title: err,
        icon: "error",
      });
      return;
    }
    const postListNext = res.data;
    this.setData({
      "postList.content": [
        ...this.data.postList.content,
        ...postListNext.content,
      ],
      pageNum:
        res.data.content.length > 0 ? this.data.pageNum + 1 : this.data.pageNum,
    });
    this.setData({
      isLoading: false,
    });
  },

  async onLoad(options) {
    this.setData({ isLoading: true, refresherTriggered: true });
    // 获取右上角胶囊位置
    const res_head_btn = wx.getMenuButtonBoundingClientRect();
    this.setData({
      back_btn_top: res_head_btn.top,
      back_btn_left: wx.getSystemInfoSync().windowWidth - res_head_btn.right,
      back_btn_height: res_head_btn.height,
      back_btn_width: res_head_btn.width,
    });
  },

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

  onShow() {
    try {
      if (typeof this.getTabBar === "function" && this.getTabBar()) {
        this.getTabBar().setData({
          show: true,
          selected: 0,
        });
      }
    } catch (err) {
      console.error(err);
    }
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {
    let title = removeHtmlTag(e.target.dataset.detail.content);
    let path = `pages/wall/ugcDetail/index?ugc_id=${e.target.dataset.detail.id}&user_id=${e.target.dataset.detail.user_info.user_id}`; // 分享后打开的页面
    return {
      title,
      path,
    };
  },
});
