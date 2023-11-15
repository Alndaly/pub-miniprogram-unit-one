// components/voted-item/index.js
import timeUtils from "../../utils/time";

const computedBehavior = require("miniprogram-computed").behavior;

Component({
  behaviors: [computedBehavior],
  computed: {
    poster(data) {
      if (data.voted_item && data.voted_item.attachmentInfoList) {
        const image = data.voted_item.attachmentInfoList[0].url;
        return image;
      }
      return null;
    },
    differTime(data) {
      let differ = "";
      if (data.voted_item) {
        differ = timeUtils.differTime(data.voted_item.createTime);
      }
      return differ;
    },
  },
  /**
   * Component properties
   */
  properties: {
    voted_item: Object,
  },

  /**
   * Component initial data
   */
  data: {},

  /**
   * Component methods
   */
  methods: {
    goUserInfo(e) {
      const { voted_item } = this.data;
      wx.$router.push(
        `/pages/userInfo/index?user_id=${voted_item.userInfo.id}`
      );
    },
    goDetail(e) {
      const { voted_item } = this.data;
      if (voted_item.toType === "post") {
        wx.$router.push(`/pages/wall/ugcDetail/index`, {
          ugc_id: voted_item.post.id,
        });
      } else if (voted_item.toType === "comment") {
        wx.$router.push(`/pages/wall/ugcDetail/index`, {
          ugc_id: voted_item.post.id,
          topCommentId: voted_item.comment.id,
        });
      }
    },
  },
});
