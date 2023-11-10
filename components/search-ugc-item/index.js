// components/search-ugc-item/index.js
import { emotionIcons } from "../../configs/emotion";
import { replaceEmotions, replaceHighLight } from "../../utils/util";
import postApi from "../../api/post";
import { to } from "../../utils/util";

const computedBehavior = require("miniprogram-computed").behavior;

Component({
  options: {
    multipleSlots: true,
  },
  behaviors: [computedBehavior],
  computed: {
    computedContent(data) {
      // 表情符号和对应图片URL的对象
      const emoticons = emotionIcons;
      return replaceHighLight(
        replaceEmotions(data.detail.content, emoticons),
        data.search_key
      );
    },
  },
  properties: {
    search_key: String,
    detail: Object,
  },

  data: {},

  methods: {
    showUserInfo(e) {
      // 否则弹出
      wx.$router.push(`/pages/userInfo/index`, {
        user_id: this.data.detail.userInfo.id,
      });
    },

    // 浏览ugc的图片
    viewImage(e) {
      const urls = this.data.detail.attachmentList.map((item) => item.url);
      wx.previewImage({
        urls,
        current: e.currentTarget.dataset.current,
      });
    },

    onClickComment(e) {
      wx.$router.push("/pages/wall/ugcDetail/index", {
        ugc_id: this.data.detail.id,
      });
    },

    toDetail(e) {
      const { detail } = this.data;
      wx.$router.push(`/pages/wall/ugcDetail/index`, { ugc_id: detail.id });
    },

    // 点赞ugc
    async onVote() {
      const { detail } = this.data;
      this.setData({
        "detail.isLike": !detail.isLike,
        "detail.likeCount": detail.isLike
          ? detail.likeCount - 1
          : detail.likeCount + 1,
      });
      if (detail.isLike) await to(postApi.likePost(detail.id));
      else await to(postApi.unLikePost(detail.id));
    },
  },
});
