// pages/myInfo/myInfo.js
import userApi from "../../../api/user";
import { _ } from "../../../utils/underscore-min";
import { to } from "../../../utils/util";
import locationUtils from "../../../utils/location";

Page({
  data: {},

  goUScore(e) {
    wx.$router.push("/pages/uScore/index/index");
  },

  toCommented(e) {
    wx.$router.push("/pages/myInfo/beCommented/index");
  },

  toVoted(e) {
    wx.$router.push("/pages/myInfo/beVoted/index");
  },

  goAuth(e) {
    if (this.data.myUserInfo.account_status === 2) {
      wx.showModal({
        title: "提醒",
        content: "已经认证过啦，确定要再次认证吗？",
        success(res) {
          if (res.confirm) {
            wx.$router.push("/pages/school/authentication/index");
          }
        },
      });
    } else {
      wx.$router.push("/pages/school/authentication/index");
    }
  },

  // 前往查看我关注的用户
  toFocusTo(e) {
    wx.$router.push("/pages/myInfo/myAttention/index");
  },

  // 前往查看关注我的用户
  toFocused(e) {
    wx.$router.push("/pages/myInfo/myFans/index");
  },

  goAboutUs(e) {
    wx.$router.push("/pages/protocols/introduction/introduction.js");
  },

  async onShow(options) {
    if (wx.canIUse("wx.getAccountInfoSync()")) {
      this.setData({ version: wx.getAccountInfoSync().miniProgram.version });
    }
    wx.getAccountInfoSync().miniProgram.version;
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
      });
    }
    const [res_myUserInfo, err_myUserInfo] = await to(userApi.getMyUserInfo());
    if (err_myUserInfo) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    const [res_location, err_location] = await to(locationUtils.getLocation());
    if (res_location) {
      this.setData({
        location: res_location,
      });
      userApi.updateUserLocation(res_location.longitude, res_location.latitude);
    }
    this.setData({
      myUserInfo: res_myUserInfo.data.data,
    });
  },
});
