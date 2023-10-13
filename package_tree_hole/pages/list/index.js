import treeHoleApi from "../../../api/treeHole";
import { to } from "../../../utils/util";
Page({
  /**
   * Page initial data
   */
  data: {
    showChangeIdentityPopUp: false,
    refresherTriggered: false,
    page_num: 0,
    isLoading: false,
    treeHole: {
      list: [],
      total_size: 0,
    },
  },

  async onNextPage(e) {
    this.setData({
      isLoading: true,
    });
    const { page_num, treeHole } = this.data;
    const [res, err] = await to(
      treeHoleApi.getAllTreeHoleList("", "create_time", page_num + 1, 10)
    );
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
    this.setData({
      treeHole: {
        list: [...treeHole.list, ...res.data.data.list],
        total_size: res.data.data.total_size,
      },
      page_num: page_num + 1,
      isLoading: false,
    });
  },

  goBack(e) {
    wx.$router.back();
  },

  async onRefresh(e) {
    this.setData({
      refresherTriggered: true,
    });
    const [res, err] = await to(
      treeHoleApi.getAllTreeHoleList("", "create_time", 0, 10)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        refresherTriggered: false,
      });
      return;
    }
    this.setData({
      page_num: 0,
      refresherTriggered: false,
      treeHole: res.data.data,
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    const [res, err] = await to(
      treeHoleApi.getAllTreeHoleList("", "create_time", 0, 10)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    const [res_identity, err_identity] = await to(
      treeHoleApi.getAnonymousIdentity()
    );
    if (err_identity) {
      wx.showToast({
        title: err_identity.data.message,
        icon: "none",
      });
      return;
    }
    this.setData({
      identity: res_identity.data.data,
      treeHole: res.data.data,
    });
  },

  onChangeIdentity(e) {
    this.setData({
      showChangeIdentityPopUp: true,
    });
  },

  async reGenerateIdentity(e) {
    if (this.data.reGenerating) {
      return;
    }
    this.setData({
      reGenerating: true,
    });
    const [res, err] = await to(treeHoleApi.reGenerateAnonymousIdentity());
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "none",
      });
      this.setData({
        reGenerating: false,
      });
      return;
    }
    this.setData({
      identity: res.data.data,
      reGenerating: false,
    });
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {
    // 获取右上角胶囊位置
    const res_head_btn = wx.getMenuButtonBoundingClientRect();
    this.setData({
      back_btn_top: res_head_btn.top,
      back_btn_left: wx.getSystemInfoSync().windowWidth - res_head_btn.right,
      back_btn_height: res_head_btn.height,
      back_btn_width: res_head_btn.width,
    });
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

  goToSendPage(e) {
    wx.$router.push("/pages/publishV2/treeHole/index");
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {},
});
