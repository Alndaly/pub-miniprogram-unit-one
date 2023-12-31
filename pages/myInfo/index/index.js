// pages/myInfo/myInfo.js
import userApi from "../../../api/user";
import { _ } from "../../../utils/underscore-min";
import { to } from "../../../utils/util";
import locationUtils from "../../../utils/location";

Page({
  data: {},

  toCommented(e) {
    wx.$router.push("/pages/myInfo/beCommented/index");
  },

  toVoted(e) {
    wx.$router.push("/pages/myInfo/beVoted/index");
  },

  // 前往查看我关注的用户
  toFocusTo(e) {
    wx.$router.push("/pages/myInfo/myAttention/index");
  },

  // 前往查看关注我的用户
  toFocused(e) {
    wx.$router.push("/pages/myInfo/myFans/index");
  },

  async onScanCode(e) {
    const [res, err] = await to(wx.scanCode());
    if (err) {
      wx.showToast({
        title: err.errMsg,
        icon: "none",
      });
      return;
    }
    const data = JSON.parse(res.result);
    if (data.action == "login") {
      wx.$router.push("/pages/common/loginAuth/index", { code: data.data });
    }
  },

  async onShow(options) {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
      });
    }
    const [res_location, err_location] = await to(locationUtils.getLocation());
    if (err_myUserInfo || err_location) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    const [res_myUserInfo, err_myUserInfo] = await to(userApi.getMyUserInfo());
    this.setData({
      location: res_location,
      myUserInfo: res_myUserInfo.data,
    });
    await userApi.changeMyLocation(
      res_location.longitude,
      res_location.latitude
    );
  },
});
