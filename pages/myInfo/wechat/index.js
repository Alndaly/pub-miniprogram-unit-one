// pages/myInfo/wechat/index.js
import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  data: {},

  inputWechat(e) {
    this.setData({
      wechat: e.detail.value,
    });
  },

  clearWechat(e) {
    this.setData({
      wechat: "",
    });
  },

  async submitChange(e) {
    wx.showLoading({
      title: "稍等哦...",
    });
    const { wechat } = this.data;
    const [res, err] = await to(userApi.changeMyWeChat(wechat));
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

  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage", (data) => {
      this.setData({
        wechat: data.data,
      });
    });
  },
});
