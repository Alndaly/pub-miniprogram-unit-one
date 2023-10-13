// components/tree-hole-comment-item/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import { emotionIcons } from "../../configs/emotion";
import timeUtils from "../../utils/time";
import userUtils from "../../utils/user";
import treeHoleApi from "../../api/treeHole";
import { to } from "../../utils/util";
import { replaceEmotions } from "../../utils/util";

Component({
  behaviors: [computedBehavior],
  options: {
    multipleSlots: true,
  },
  computed: {
    differTime(data) {
      const differ = timeUtils.differTime(data.comment.create_time);
      return differ;
    },
    computedContent(data) {
      // 表情符号和对应图片URL的对象
      const emoticons = emotionIcons;
      return replaceEmotions(data?.comment?.detail, emoticons);
    },
  },
  /**
   * Component properties
   */
  properties: {
    comment: Object,
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
      if (!userUtils.hasSignUp()) {
        wx.showModal({
          title: "提醒",
          showCancel: false,
          content: "请先登陆哦",
        });
        return;
      }
      const { comment } = this.data;
      this.setData({
        "comment.is_vote": !comment.is_vote,
        "comment.vote": comment.is_vote ? comment.vote - 1 : comment.vote + 1,
      });
      const [res, err] = await to(
        treeHoleApi.voteTreeHoleComment(
          comment.id,
          comment.is_vote
        )
      );
      if (err) {
        this.setData({
          "comment.is_vote": comment.is_vote,
          "comment.vote": comment.vote,
        });
        wx.showToast({
          title: "出错啦",
          icon: "error",
        });
        return;
      }
    },
    onTapComment(e) {
      const { comment } = this.data;
      let myEventDetail = {
        currentComment: comment,
        topComment: comment,
      }; // detail对象，提供给事件监听函数
      let myEventOption = {}; // 触发事件的选项
      this.triggerEvent("tapComment", myEventDetail, myEventOption);
    },
  },
});
