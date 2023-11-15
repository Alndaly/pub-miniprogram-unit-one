// components/commented-item/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import timeUtils from "../../utils/time";

Component({
  behaviors: [computedBehavior],
  computed: {
    poster(data) {
      let image = "";
      if (data.commented_item && data.commented_item.attachmentInfoList) {
        image = data.commented_item.attachmentInfoList[0].url;
      }
      return image;
    },
    differTime(data) {
      let differ = "";
      if (data.commented_item.comment.createTime) {
        differ = timeUtils.differTime(data.commented_item.comment.createTime);
      }
      return differ;
    },
  },
  /**
   * Component properties
   */
  properties: {
    commented_item: Object,
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
      const { commented_item } = this.data;
      wx.$router.push(
        `/pages/userInfo/index?user_id=${commented_item.comment.fromUserInfo.id}`
      );
    },
    goDetail(e) {
      const { commented_item } = this.data;
      if (commented_item.toType === "post") {
        wx.$router.push(`/pages/wall/ugcDetail/index`, {
          ugc_id: commented_item.post.id,
        });
      } else if (commented_item.toType === "comment") {
        wx.$router.push(`/pages/wall/ugcDetail/index`, {
          ugc_id: commented_item.post.id,
          topCommentId: commented_item.comment.id,
        });
      }
    },
  },
});
