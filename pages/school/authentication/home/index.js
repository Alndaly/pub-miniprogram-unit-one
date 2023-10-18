import studentApi from "../../../../api/student";
import userUtil from "../../../../utils/user";
import userApi from "../../../../api/user";
import { to } from "../../../../utils/util";

Page({
  data: {},

  goBack(e) {
    if (!this.data.hasPhoneNumber || !this.data.verifyMethod) {
      wx.showModal({
        title: "提醒",
        content: "您还没完成认证哦，确认返回吗？",
        complete: (res) => {
          if (res.confirm) {
            wx.$router.back();
          }
        },
      });
    } else {
      wx.$router.back();
    }
  },

  goProtocolWebView(e) {
    wx.$router.push("/pages/webView/index", { id: 3 });
  },

  // 点击下方完成认证
  async finishAuth(e) {
    if (this.data.hasPhoneNumber && this.data.verifyMethod) {
      wx.showLoading({
        title: "稍等哦...",
      });
      let [res, err] = await to(studentApi.applyVerify());
      wx.hideLoading({
        success: (res) => {},
      });
      if (this.data.hasPhoneNumber && this.data.verifyMethod) {
        let res_update = await userUtil.updateLocalUserInfo();
        wx.$router.push("/pages/school/authentication/success/index");
      }
    } else {
      wx.showModal({
        title: "提示",
        content: "你还没有完成必填项哦",
        showCancel: false,
      });
    }
  },

  // 获取手机号码
  async getPhoneNumber(e) {
    wx.showLoading({
      title: "稍等哦",
    });
    let session_status = await userUtil.getSessionStatus();
    let [res, err] = [];
    if (session_status) {
      [res, err] = await to(studentApi.getPhoneNumber(e.detail));
    } else {
      const code = await wx.login();
      await userApi.updateUserSessionKey(code);
      [res, err] = await to(studentApi.getPhoneNumber(e.detail));
    }
    if (!res) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      hasPhoneNumber: true,
    });
    wx.showToast({
      title: "获取成功",
    });
  },

  async onShow(options) {
    let res = await studentApi.getVerifyMethod();
    const {
      data: { data },
    } = await userApi.getMyUserInfo();
    this.setData({
      authMethodList: res.data.data,
      verifyMethod: data.verify_method,
    });
  },
});
