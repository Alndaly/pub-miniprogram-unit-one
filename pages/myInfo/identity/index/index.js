// pages/myInfo/identity/index/index.js
import { to } from "../../../../utils/util";
import fileApi from "../../../../api/file";
import userApi from "../../../../api/user";
import timeUtils from "../../../../utils/time";
import user from "../../../../api/user";

Page({
  /**
   * Page initial data
   */
  data: {
    isLoading: false,
    page_num: 0,
    identityRefresherTriggered: false,
  },

  async onNextIdentityPage(e) {
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(userApi.getUserIdentity(page_num + 1, 10));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        identityRefresherTriggered: false,
      });
      return;
    }
    this.setData({
      identityRefresherTriggered: false,
      identities: {
        list: [...identities.list, ...res.data.data.list],
        total_size: res.data.data.total_size,
      },
      page_num: page_num + 1,
      isLoading: false,
    });
  },

  goIdentityDetail(e) {
    const { identity } = e.currentTarget.dataset;
    wx.$router.push(`/pages/myInfo/identity/detail/index`, { id: identity.id });
  },

  async onIdentityRefresh(e) {
    this.setData({
      identityRefresherTriggered: true,
    });
    const [res, err] = await to(userApi.getUserIdentity(0, 10));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        identityRefresherTriggered: false,
      });
      return;
    }
    this.setData({
      identityRefresherTriggered: false,
      identities: res.data.data,
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    wx.getSystemInfo({
      success: (e) => {
        let custom = wx.getMenuButtonBoundingClientRect();
        let CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.setData({
          CustomBar: CustomBar,
          StatusBar: e.statusBarHeight,
          Custom: custom,
        });
      },
      fail: (res) => {
        console.error("获取系统信息出错", res);
      },
    });
  },

  async onShow() {
    this.setData({
      identityRefresherTriggered: true,
    });
    const [res, err] = await to(user.getUserIdentity(0, 10));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        identityRefresherTriggered: false,
      });
      return;
    }
    this.setData({
      identityRefresherTriggered: false,
      identities: res.data.data,
    });
  },

  deleteIdentity(e) {
    const { identity } = e.currentTarget.dataset;
    const _this = this;
    wx.showModal({
      title: "提示",
      content: "确认删除该身份吗？",
      complete: async (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: "稍等",
          });
          const [res, err] = await to(
            userApi.deleteUserIdentity(identity.identity_info.id)
          );
          if (err) {
            wx.showToast({
              title: "出错啦",
              icon: "error",
            });
            return;
          }
          wx.showToast({
            title: "删除成功",
          });
          _this.setData({
            identityRefresherTriggered: true,
          });
        }
      },
    });
  },

  goIdentityVerify(e) {
    wx.$router.push("/pages/myInfo/identity/verify/index");
  },
});
