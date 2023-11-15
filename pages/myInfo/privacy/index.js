// pages/myInfo/privacy/index.js
import { to } from "../../../utils/util";
import userApi from "../../../api/user";

Page({
  /**
   * Page initial data
   */
  data: {},

  async onLoad(options) {
    const [res, err] = await to(userApi.getUserPrivacy());
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      return;
    }
    this.setData({
      ...res.data,
    });
  },

  async onChange(e) {
    const { type } = e.currentTarget.dataset;
    let [res, err] = [];
    switch (type) {
      case "gender":
        [res, err] = await to(userApi.updateUserPrivacyGender(e.detail.value));
        break;
      case "wechat":
        [res, err] = await to(userApi.updateUserPrivacyWechat(e.detail.value));
        break;
      case "qq":
        [res, err] = await to(userApi.updateUserPrivacyQq(e.detail.value));
        break;
      case "birthday":
        [res, err] = await to(
          userApi.updateUserPrivacyBirthday(e.detail.value)
        );
        break;
    }
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      return;
    }
    this.setData({
      [type]: e.detail.value,
    });
  },
});
