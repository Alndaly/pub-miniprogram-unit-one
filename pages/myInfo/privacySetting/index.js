// pages/myInfo/privacy-setting/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import { to } from "../../../utils/util";
import userApi from "../../../api/user";
import privacyApi from "../../../api/privacy";

Page({
  behaviors: [computedBehavior],
  computed: {},
  /**
   * Page initial data
   */
  data: {
    chat_privacy: ["未回复仅三条", "无限", "禁止私聊"],
  },

  async bindChatPrivacyChange(e) {
    const { chat_privacy } = this.data;
    this.setData({
      chat_privacy_index: e.detail.value,
    });
    const [res, err] = await to(
      privacyApi.changePrivacySetting({
        ...this.data,
        chat: chat_privacy[e.detail.value],
      })
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
  },

  async onChange(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      [type]: e.detail.value,
    });
    const [res, err] = await to(
      privacyApi.changePrivacySetting({ ...this.data })
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    const { chat_privacy } = this.data;
    const [res, err] = await to(privacyApi.getUserPrivacySetting());
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      ...res.data.data,
      chat_privacy_index: chat_privacy.findIndex(
        (item) => item === res.data.data.chat
      ),
    });
  },
});
