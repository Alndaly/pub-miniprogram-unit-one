import postApi from "../../../api/post";
import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  data: {},

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
    this.setData({
      options: {
        key: e.detail,
      },
    });
    wx.showLoading({
      title: "稍等哦",
    });
    const [res_ugc, err_ugc] = await to(postApi.searchPost(e.detail, 0, 5));
    const [res_user, err_user] = await to(userApi.searchUser(e.detail, 0, 5));
    if (err_ugc || err_user) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      postList: res_ugc.data,
      userList: res_user.data,
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

  // 初始化Post列表
  async initPostPage(e) {
    const [res, err] = await to(
      postApi.searchPost(this.data.options.key, 0, 5)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      postList: res.data,
    });
  },

  // 初始化用户列表
  async initUserPage(e) {
    const [res, err] = await to(
      userApi.searchUser(this.data.options.key, 0, 5)
    );
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      return;
    }
    this.setData({
      userList: res.data,
    });
  },

  async onLoad(options) {
    this.setData({
      options: options,
    });
    if (options.key) {
      wx.showLoading({
        title: "稍等哦",
      });
    }
    await this.initPostPage();
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
    });
  },
});
