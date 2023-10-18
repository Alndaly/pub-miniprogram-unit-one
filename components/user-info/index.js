// components/user-info/index.js
Component({
  options: {
    multipleSlots: true,
  },

  properties: {
    userInfo: Object,
    anonymous: {
      type: Boolean,
      value: false,
    },
  },

  data: {},

  methods: {
    // 展示ugc的用户信息
    showUserInfo(e) {
      // 如果是匿名发表那么不弹出用户信息
      if (this.properties.anonymous) {
        return;
      }
      // 否则弹出
      wx.$router.push(`/pages/userInfo/index`, {
        user_id: this.properties.userInfo.user_id
          ? this.properties.userInfo.user_id
          : this.properties.userInfo.id,
      });
    },
  },
});
