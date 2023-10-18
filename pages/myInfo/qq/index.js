// pages/myInfo/qq/index.js
import userApi from "../../../api/user";
import { to } from "../../../utils/util";

Page({
  data: {},

  async submitChange(e) {
    wx.showLoading({
      title: "稍等哦...",
    });
    const { qq } = this.data;
    const [res, err] = await to(userApi.changeMyQq(qq));
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

  clearQq(e) {
    this.setData({
      qq: "",
    });
  },

  onLoad(options) {
    const _this = this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage", function (data) {
      _this.setData({
        qq: data.data,
      });
    });
  },
});
