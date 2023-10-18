import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  data: {},

  inputSignature(e) {
    this.setData({
      signature: e.detail.value,
    });
  },

  clearSignature(e) {
    this.setData({
      signature: "",
    });
  },

  async submitChange(e) {
    wx.showLoading({
      title: "稍等哦...",
    });
    let newSignature = this.data.signature;
    const [res, err] = await to(userApi.changeMySignature(newSignature));
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
        signature: data.data,
      });
    });
  },
});
