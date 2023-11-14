// pages/myInfo/userName/index.js
import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  data: {},

  async submitChange(e) {
    wx.showLoading({
      title: "稍等哦...",
    });
    const { nickname } = this.data;
    const [res, err] = await to(userApi.changeMyNickname(nickname));
    if (err) {
      wx.showToast({
        title: err.data,
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
      nickname: "",
    });
  },

  onLoad(options) {
    const _this = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage", function (data) {
      _this.setData({
        nickname: data.data,
      });
    });
  },
});
