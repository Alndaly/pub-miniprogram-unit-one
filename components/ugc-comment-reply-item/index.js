// components/ugc-comment-reply-item/index.js
import postApi from "../../api/post";
import { to, replaceEmotions } from "../../utils/util";
import { emotionIcons } from "../../configs/emotion";
import timeUtils from "../../utils/time";

const computedBehavior = require("miniprogram-computed").behavior;

Component({
  behaviors: [computedBehavior],
  options: {
    multipleSlots: true,
  },
  computed: {
    differTime(data) {
      const differ = timeUtils.differTime(data.detail.createTime);
      return differ;
    },
    computedContent(data) {
      // 表情符号和对应图片URL的对象
      const emoticons = emotionIcons;
      return replaceEmotions(data?.commentItem?.content, emoticons);
    },
  },
  /**
   * Component properties
   */
  properties: {
    topComment: {
      type: Object,
      value: {},
    },
    detail: {
      type: Object,
      value: {},
    },
  },

  /**
   * Component initial data
   */
  data: {},

  /**
   * Component methods
   */
  methods: {
    showUserInfo(e) {
      const { user_id } = e.currentTarget.dataset;
      wx.$router.push(`/pages/userInfo/index`, { user_id });
    },
    onTapComment(e) {
      let myEventDetail = {
        currentComment: this.data.detail,
        topComment: this.data.topComment,
      }; // detail对象，提供给事件监听函数
      let myEventOption = { composed: true, bubbles: true }; // 触发事件的选项
      this.triggerEvent("tapComment", myEventDetail, myEventOption);
    },
    async onVoteComment(e) {
      const { detail } = this.data;
      this.setData({
        "detail.isLike": !detail.isLike,
        "detail.likeCount": detail.isLike
          ? detail.likeCount - 1
          : detail.likeCount + 1,
      });
      const comment = e.currentTarget.dataset.comment;
      if (detail.isLike) await to(postApi.likeComment(comment.id));
      else await to(postApi.unLikeComment(comment.id));
    },
  },
});
