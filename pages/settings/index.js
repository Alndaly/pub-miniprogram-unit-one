// pages/settings/index.js
import userUtils from "../../utils/user";
import cache from "../../utils/cache";

Page({
  data: {
    themeList: [
      {
        name: "夜间",
        en: "dark",
      },
      {
        name: "日间",
        en: "light",
      },
      {
        name: "跟随系统",
        en: "follow_system",
      },
    ],
  },
  cleanMemory(e) {
    wx.showModal({
      title: "提示",
      content: "确定清空吗？",
      complete: (res) => {
        if (res.cancel) {
        }
        if (res.confirm) {
          wx.showLoading({
            title: "清理中",
          });
          cache.clear();
          wx.showToast({
            title: "清理成功",
            icon: "success",
          });
        }
      },
    });
  },
  changeTheme(e) {
    const _this = this;
    let itemList = this.data.themeList.map((item) => item.name);
    wx.showActionSheet({
      itemList,
      success(res) {
        _this.setData({
          chosedThemeIndex: res.tapIndex,
        });
      },
      fail(err) {
        console.log(err);
      },
    });
  },
});
