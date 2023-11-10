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
    async followUser(e) {
      wx.showLoading({
        title: "稍等哦...",
      });
      const [res, err] = await to(userApi.followUser(this.data.detail.id));
      if (err) {
        wx.showToast({
          title: err.data,
          icon: "error",
        });
        return;
      }
      this.setData({
        "detail.isFollow": true,
      });
      wx.showToast({
        title: "关注成功",
      });
    },

    // 取消关注用户
    async unFollowUser(e) {
      wx.showLoading({
        title: "稍等哦...",
      });
      const [res, err] = await to(userApi.unFollowUser(this.data.detail.id));
      if (err) {
        wx.showToast({
          title: err.data,
        });
        return;
      }
      this.setData({
        "detail.isFollow": false,
      });
      wx.showToast({
        title: "取关成功",
      });
    },
  },
});
