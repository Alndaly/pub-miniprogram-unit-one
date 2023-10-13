// pages/userInfo/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import ugcApi from "../../api/ugc";
import userApi from "../../api/user";
import { to } from "../../utils/util";

Page({
  behaviors: [computedBehavior],
  data: {
    ugcRefresherTriggered: false,
    showPublishPopUp: false,
    page_num: 0,
    isLoading: false,
  },

  async onShowPublish(e) {
    const { user_info } = this.data;
    this.setData({
      showPublishPopUp: true,
    });
    const [res, err] = await to(
      ugcApi.getUserUgc(user_info.id, 0, 10, "create_time")
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      ugcs: res.data.data,
    });
  },

  async onUgcRefresh(e) {
    const { user_info } = this.data;
    this.setData({
      showPublishPopUp: true,
    });
    const [res, err] = await to(
      ugcApi.getUserUgc(user_info.id, 0, 10, "create_time")
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      ugcRefresherTriggered: false,
      ugcs: res.data.data,
      page_num: 0,
    });
  },

  async onNextUgcPage(e) {
    this.setData({
      isLoading: true,
    });
    const { user_info, page_num, ugcs } = this.data;
    const [res, err] = await to(
      ugcApi.getUserUgc(user_info.id, page_num + 1, 10, "create_time")
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      ugcs: {
        list: [...ugcs.list, ...res.data.data.list],
        total_size: res.data.data.total_size,
      },
      isLoading: false,
    });
  },

  async focusTa(e) {
    this.setData({
      focusLoading: true,
    });
    const [res, err] = await to(userApi.focusUser(this.data.user_info.id));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        focusLoading: false,
      });
      return;
    }
    this.setData({
      focusLoading: false,
      "user_info.is_focus": true,
    });
  },

  async unFocusTa(e) {
    this.setData({
      unFocusLoading: true,
    });
    const [res, err] = await to(userApi.unFocusUser(this.data.user_info.id));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        unFocusLoading: false,
      });
      return;
    }
    this.setData({
      unFocusLoading: false,
      "user_info.is_focus": false,
    });
  },

  async onLoad(options) {
    // 获取右上角胶囊位置
    const res_head_btn = wx.getMenuButtonBoundingClientRect();
    this.setData({
      back_btn_top: res_head_btn.top,
      back_btn_left: wx.getSystemInfoSync().windowWidth - res_head_btn.right,
      back_btn_height: res_head_btn.height,
      back_btn_width: res_head_btn.width,
    });
    this.setData({
      options: options,
    });
    const [res, err] = await to(userApi.getUserInfoById(options.user_id));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      user_info: res.data.data,
    });
  },

  goBack() {
    wx.$router.back();
  },

  onReady(e) {
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
});
