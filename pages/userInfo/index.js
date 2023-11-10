// pages/userInfo/index.js
import userApi from "../../api/user";
import { to } from "../../utils/util";

const computedBehavior = require("miniprogram-computed").behavior;

Page({
  behaviors: [computedBehavior],
  data: {
    postRefresherTriggered: false,
    showPublishPopUp: false,
    pageNum: 0,
    isLoading: false,
  },

  async onShowPublish(e) {
    this.setData({
      postRefresherTriggered: true,
    });
    const { user_info } = this.data;
    this.setData({
      showPublishPopUp: true,
    });
    const [res, err] = await to(userApi.getUserPost(user_info.id, "", 0));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      return;
    }
    this.setData({
      posts: res.data,
      postRefresherTriggered: false,
    });
  },

  async onPostRefresh(e) {
    const { user_info } = this.data;
    this.setData({
      showPublishPopUp: true,
    });
    const [res, err] = await to(userApi.getUserPost(user_info.id, "", 0));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      return;
    }
    this.setData({
      postRefresherTriggered: false,
      posts: res.data,
      pageNum: 0,
    });
  },

  async onNextPostPage(e) {
    this.setData({
      isLoading: true,
    });
    const { user_info, pageNum, posts } = this.data;
    const [res, err] = await to(
      userApi.getUserPost(user_info.id, "", pageNum + 1)
    );
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      return;
    }
    this.setData({
      posts: {
        ...res.data,
        content: [...posts.content, ...res.data.content],
      },
      isLoading: false,
    });
  },

  async focusTa(e) {
    this.setData({
      focusLoading: true,
    });
    const [res, err] = await to(userApi.followUser(this.data.user_info.id));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      this.setData({
        focusLoading: false,
      });
      return;
    }
    this.setData({
      focusLoading: false,
      "user_info.isFollow": true,
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
      "user_info.isFollow": false,
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
      user_info: res.data,
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
    });
  },
});
