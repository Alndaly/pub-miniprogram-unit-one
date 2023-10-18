// pages/home/index.js
import { subscribeNotify } from "../../utils/subscribe";
import { to } from "../../utils/util";
import ugcApi from "../../api/ugc";
import { _ } from "../../utils/underscore-min";

Page({
  /**
   * Page initial data
   */
  data: {
    deltaY: 0,
    topTips: "松手刷新",
    scrollTop: 0,
    isLoading: false,
    refresherTriggered: false,
    chosedTab: {
      id: 1,
      label_id: null,
      title: "新帖",
      order_by: "create_time",
    },
    ugcList: {
      list: [],
      total_size: 0,
    },
    tabs: [
      {
        id: 1,
        label_id: null,
        title: "新帖",
        order_by: "create_time",
      },
      {
        id: 2,
        label_id: null,
        title: "热帖",
        order_by: "exposure",
      },
      {
        id: 3,
        label_id: 63,
        title: "游记",
        order_by: "create_time",
      },
      {
        id: 4,
        label_id: 58,
        title: "新生",
        order_by: "create_time",
      },
      {
        id: 5,
        label_id: 4,
        title: "闲置",
        order_by: "create_time",
      },
      {
        id: 6,
        label_id: 7,
        title: "捞人",
        order_by: "create_time",
      },
    ],
    page: 0,
  },

  onGoCpPage(e) {
    wx.$router.push("/package_cp/pages/index/index");
  },

  onGoMapPage(e) {
    wx.showToast({
      title: "开发中，请稍后几日",
      icon: "none",
    });
    return;
    wx.$router.push("/package_map/pages/home/index");
  },

  onGoTreeHolePage() {
    wx.$router.push("/package_tree_hole/pages/list/index");
  },

  goPhotoPage(e) {
    wx.$router.push("/package_photo/pages/home/index");
  },

  onRefresherPulling: _.throttle(function (e) {
    this.setData({
      refresherTop: e.detail.dy,
    });
  }, 50),

  async goSearchPage() {
    await wx.$router.push("/pages/search/home/index");
  },

  onShowTypes(e) {
    wx.$router.push("/pages/types/index");
  },

  async onChangeTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab.id === this.data.chosedTab.id) {
      return;
    }
    this.setData({
      chosedTab: tab,
      page: 0,
      ugcList: {
        list: [],
        total_size: 0,
      },
    });
    wx.showLoading({
      title: "加载中",
    });
    const { chosedTab } = this.data;
    let [res_ugc, err_ugc] = [];
    if (chosedTab.label_id) {
      [res_ugc, err_ugc] = await to(
        ugcApi.searchLabelUgc("", chosedTab.label_id, chosedTab.order_by, 0, 10)
      );
    } else {
      [res_ugc, err_ugc] = await to(
        ugcApi.searchUgc("", 0, 10, chosedTab.order_by)
      );
    }
    if (err_ugc) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    wx.hideLoading();
    this.setData({
      ugcList: res_ugc.data.data,
    });
  },

  async onSubscribeNewUgc(e) {
    await subscribeNotify(["LzeRLb2idVMGSMygd0YcCe2hz2bEBlrVneoJlj6c3Vw"]);
    wx.showToast({
      title: "订阅成功",
      icon: "none",
    });
  },

  showNewUgcTipcs(e) {
    wx.showModal({
      title: "提醒",
      content: "订阅后当社区有优质新帖时会通过微信发你消息哦",
      showCancel: false,
    });
  },

  onGoCoursePage(e) {
    wx.$router.push("/package_course/pages/home/index");
  },

  // 下拉刷新
  async onRefresh(e) {
    const { chosedTab } = this.data;
    let [res_ugc, err_ugc] = [];
    if (chosedTab.label_id) {
      [res_ugc, err_ugc] = await to(
        ugcApi.searchLabelUgc("", chosedTab.label_id, chosedTab.order_by, 0, 10)
      );
    } else {
      [res_ugc, err_ugc] = await to(
        ugcApi.searchUgc("", 0, 10, chosedTab.order_by)
      );
    }
    if (err_ugc) {
      wx.showToast({
        title: err_ugc?.data?.message,
        icon: "error",
      });
      this.setData({
        refresherTriggered: false,
      });
      return;
    }
    wx.hideLoading();
    this.setData({
      ugcList: res_ugc.data.data,
    });
    this.setData({
      refresherTriggered: false,
    });
  },

  // 下一页
  async onNextPage(e) {
    this.setData({
      isLoading: true,
    });
    const { chosedTab } = this.data;
    let [res_ugc, err_ugc] = [];
    if (chosedTab.label_id) {
      [res_ugc, err_ugc] = await to(
        ugcApi.searchLabelUgc(
          "",
          chosedTab.label_id,
          chosedTab.order_by,
          this.data.page + 1,
          10
        )
      );
    } else {
      [res_ugc, err_ugc] = await to(
        ugcApi.searchUgc("", this.data.page + 1, 10, chosedTab.order_by)
      );
    }
    if (err_ugc) {
      this.setData({
        isLoading: false,
      });
      wx.showToast({
        title: err_ugc.data.message,
        icon: "error",
      });
      return;
    }
    const ugcListNext = res_ugc.data.data;
    this.setData({
      "ugcList.list": [...this.data.ugcList.list, ...ugcListNext.list],
      page:
        res_ugc.data.data.list.length > 0 ? this.data.page + 1 : this.data.page,
    });
    this.setData({
      isLoading: false,
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
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
    // 获取页面数据
    const { chosedTab } = this.data;
    let [res_ugc, err_ugc] = [];
    if (chosedTab.label_id) {
      [res_ugc, err_ugc] = await to(
        ugcApi.searchLabelUgc("", chosedTab.label_id, chosedTab.order_by, 0, 10)
      );
    } else {
      [res_ugc, err_ugc] = await to(
        ugcApi.searchUgc("", 0, 10, chosedTab.order_by)
      );
    }
    if (err_ugc) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      refresherTriggered: false,
      ugcList: res_ugc.data.data,
      isLoading: false,
    });
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

  /**
   * Lifecycle function--Called when page show
   */
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
    wx.onKeyboardHeightChange((res) => {
      this.updatePosition(res.height);
    });
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {
    ugcApi.shareUgc(e.target.dataset.detail.id, true);
    let imageUrl =
      "https://oss.weixiao.zuowu.cc/image/76b592c87157493aaf4471b1cd313328.jpeg";
    if (e.target.dataset.detail.attachments.length > 0) {
      imageUrl = e.target.dataset.detail.attachments[0].link;
    }
    let title = removeHtmlTag(e.target.dataset.detail.content);
    let path = `pages/wall/ugcDetail/index?ugc_id=${e.target.dataset.detail.id}&user_id=${e.target.dataset.detail.user_info.user_id}`; // 分享后打开的页面
    return {
      imageUrl,
      title,
      path,
    };
  },
});
