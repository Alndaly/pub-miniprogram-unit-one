import ugcApi from "../../../api/post";
import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  data: {
    userList: {
      list: [],
    },
    ugcList: {
      list: [],
    },
    isLoading: false,
  },

  // 去往指定搜索类目
  goSearchKindPage(e) {
    const { key } = this.data.options;
    const { kind } = e.currentTarget.dataset;
    switch (kind) {
      case "ugc":
        wx.$router.push("/pages/search/searchUgc/index", { key });
        break;
      case "user":
        wx.$router.push("/pages/search/searchUser/index", { key });
        break;
    }
  },

  // 确认搜索时
  async onSearch(e) {
    if (!e.detail) {
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "请输入搜索关键词",
      });
      return;
    }
    wx.showLoading({
      title: "稍等哦",
    });
    this.setData({
      options: {
        key: e.detail,
      },
    });
    let res_ugc = await ugcApi.searchUgc(e.detail, 0, 5);
    let res_user = await userApi.searchUser(e.detail, 0, 5);
    this.setData({
      ugcList: res_ugc.data.data,
      userList: res_user.data.data,
    });
    wx.hideLoading();
  },

  // 清空搜索框
  clearSearch(e) {
    this.setData({
      options: {
        key: "",
      },
    });
  },

  // 初始化Ugc列表
  async initUgcPage(e) {
    let [res, err] = await to(ugcApi.searchUgc(this.data.options.key, 0, 5));
    if (err) {
      wx.showToast({
        title: err.data.message,
      });
      return;
    }
    this.setData({
      ugcList: res.data.data,
    });
  },

  // 初始化用户列表
  async initUserPage(e) {
    let [res, err] = await to(userApi.searchUser(this.data.options.key, 0, 5));
    if (err) {
      wx.showToast({
        title: err.data.message,
      });
      return;
    }
    this.setData({
      userList: res.data.data,
    });
  },

  async refreshUgcPage(e) {
    let [res, err] = await to(ugcApi.searchUgc(this.data.options.key, 0, 5));
    if (err) {
      wx.showToast({
        title: err.data.message,
      });
      return;
    }
    this.setData({
      ugcList: res.data.data,
    });
  },

  async refreshUserPage(e) {
    let [res, err] = await to(userApi.searchUser(this.data.options.key, 0, 5));
    if (err) {
      wx.showToast({
        title: err.data.message,
      });
      return;
    }
    this.setData({
      userList: res.data.data,
    });
  },

  async onLoad(options) {
    if (options.key) {
      wx.showLoading({
        title: "稍等哦",
      });
    }
    this.setData({
      options: options,
    });
    await this.initUgcPage();
    await this.initUserPage();
    wx.hideLoading();
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
        console.error("获取系统信息出错", res);
      },
    });
  },

  async onPullDownRefresh(e) {
    wx.showLoading({
      title: "刷新中",
    });
    await this.refreshUgcPage();
    await this.refreshUserPage();
    wx.hideLoading({
      success: (res) => {},
    });
    wx.stopPullDownRefresh();
  },
});
