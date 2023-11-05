// components/ugc-comment-item/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import { emotionIcons } from "../../configs/emotion";
import userUtils from "../../utils/user";
import timeUtils from "../../utils/time";
import ugcApi from "../../api/post";
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
      const differ = timeUtils.differTime(data.commentItem.create_time);
      return differ;
    },
    computedContent(data) {
      // 表情符号和对应图片URL的对象
      const emoticons = emotionIcons;
      return replaceEmotions(data?.commentItem?.content, emoticons);
    },
  },

  lifetimes: {},

  /**
   * Component initial data
   */
  data: {},

  /**
   * Component methods
   */
  methods: {
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
        "commentItem.is_vote": !_this.data.commentItem.is_vote,
        "commentItem.vote_num": _this.data.commentItem.is_vote
          ? _this.data.commentItem.vote_num - 1
          : _this.data.commentItem.vote_num + 1,
      });
      const comment = e.currentTarget.dataset.comment;
      const [res, err] = await to(
        ugcApi.voteComment(comment.id, this.data.commentItem.is_vote)
      );
      if (err) {
        this.setData({
          "commentItem.is_vote": !_this.data.commentItem.is_vote,
          "commentItem.vote_num": _this.data.commentItem.is_vote
            ? _this.data.commentItem.vote_num + 1
            : _this.data.commentItem.vote_num - 1,
        });
        wx.showToast({
          title: err.data.message,
          icon: "error",
        });
      }
    },
    showUserInfo(e) {
      // 如果是匿名发表那么不弹出用户信息
      if (this.properties.commentItem.anonymous) {
        return;
      }
      // 否则弹出
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
