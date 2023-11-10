// components/ugc-comment-item/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import { emotionIcons } from "../../configs/emotion";
import userUtils from "../../utils/user";
import timeUtils from "../../utils/time";
import postApi from "../../api/post";
import { to } from "../../utils/util";
import { replaceEmotions } from "../../utils/util";
Component({
  /**
   * Component properties
   */
  properties: {
    commentItem: {
      type: Object,
      value: {},
    },
  },
  behaviors: [computedBehavior],
  options: {
    multipleSlots: true,
  },
  computed: {
    differTime(data) {
      const differ = timeUtils.differTime(data.commentItem.createTime);
      return differ;
    },
    computedContent(data) {
      // 表情符号和对应图片URL的对象
      const emoticons = emotionIcons;
      return replaceEmotions(data?.commentItem?.content, emoticons);
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
    async onVoteComment(e) {
      const { commentItem } = this.data;
      this.setData({
        "commentItem.isLike": !commentItem.isLike,
        "commentItem.likeCount": commentItem.isLike
          ? commentItem.likeCount - 1
          : commentItem.likeCount + 1,
      });
      const comment = e.currentTarget.dataset.comment;
      if (commentItem.isLike) {
        await to(postApi.likeComment(comment.id));
      } else {
        await to(postApi.unLikeComment(comment.id));
      }
    },
    showUserInfo(e) {
      const { id: user_id } = e.currentTarget.dataset;
      wx.$router.push(`/pages/userInfo/index`, { user_id });
    },
    onTapComment(e) {
      let myEventDetail = {
        currentComment: this.data.commentItem,
        topComment: this.data.commentItem,
      }; // detail对象，提供给事件监听函数
      let myEventOption = { composed: true, bubbles: true }; // 触发事件的选项
      this.triggerEvent("tapComment", myEventDetail, myEventOption);
    },
  },
});
