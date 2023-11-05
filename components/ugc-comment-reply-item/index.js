// components/ugc-comment-reply-item/index.js
import ugcApi from "../../api/post";
import userUtils from "../../utils/user";
import { to, replaceEmotions } from "../../utils/util";
const computedBehavior = require("miniprogram-computed").behavior;
import { emotionIcons } from "../../configs/emotion";
import timeUtils from "../../utils/time";

Component({
  behaviors: [computedBehavior],
  options: {
    multipleSlots: true,
  },
  computed: {
    differTime(data) {
      const differ = timeUtils.differTime(data.detail.create_time);
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
      if (!userUtils.hasSignUp()) {
        wx.showModal({
          title: "提醒",
          showCancel: false,
          content: "请先登陆哦",
        });
        return;
      }
      const _this = this;
      this.setData({
        "detail.is_vote": !_this.data.detail.is_vote,
        "detail.vote_num": _this.data.detail.is_vote
          ? _this.data.detail.vote_num - 1
          : _this.data.detail.vote_num + 1,
      });
      const comment = e.currentTarget.dataset.comment;
      const [res, err] = await to(
        ugcApi.voteComment(comment.id, this.data.detail.is_vote)
      );
      if (err) {
        this.setData({
          "detail.is_vote": !_this.data.detail.is_vote,
          "detail.vote_num": _this.data.detail.is_vote
            ? _this.data.detail.vote_num + 1
            : _this.data.detail.vote_num - 1,
        });
        wx.showToast({
          title: err.data.message,
          icon: "error",
        });
      }
    },
  },
});
