// components/user-item/index.js
import userApi from "../../api/user";
import { to } from "../../utils/util";

Component({
  options: {
    multipleSlots: true,
  },

  properties: {
    detail: Object,
  },

  methods: {
    // 展示ugc的用户信息
    showUserInfo(e) {
      wx.$router.push(`/pages/userInfo/index`, {
        user_id: this.data.detail.id,
      });
    },

    // 关注用户
    async focusTa(e) {
      wx.showLoading({
        title: "稍等哦...",
      });
      let [res, err] = await to(userApi.focusUser(this.data.detail.id));
      if (err) {
        wx.showToast({
          title: err.data.message,
        });
        return;
      }
      this.setData({
        "detail.is_focus": true,
      });
      wx.showToast({
        title: "关注成功",
      });
    },

    // 取消关注用户
    async unFocusTa(e) {
      wx.showLoading({
        title: "稍等哦...",
      });
      let [res, err] = await to(userApi.unFocusUser(this.data.detail.id));
      if (err) {
        wx.showToast({
          title: err.data.message,
        });
        return;
      }
      this.setData({
        "detail.is_focus": false,
      });
      wx.showToast({
        title: "取关成功",
      });
    },
  },
});
