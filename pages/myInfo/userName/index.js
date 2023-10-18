// pages/myInfo/userName/index.js
import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  data: {},

  async submitChange(e) {
    wx.showLoading({
      title: "稍等哦...",
    });
    const newUserName = this.data.username;
    const [res, err] = await to(userApi.changeMyUserName(newUserName));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    wx.showToast({
      title: "更新成功",
    });
  },

  clearUserName(e) {
    this.setData({
      username: "",
    });
  },

  onLoad(options) {
    const _this = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage", function (data) {
      _this.setData({
        username: data.data,
      });
    });
  },
});
