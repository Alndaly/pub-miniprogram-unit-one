// pages/myInfo/wechat/index.js
import userApi from "../../../api/user";

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
    let newWechat = this.data.wechat;
    let res = await userApi.changeMyWeChat(newWechat);
    if (res.data.code != "20000") {
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
