// components/commented-item/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import timeUtils from "../../utils/time";

Component({
  behaviors: [computedBehavior],
  computed: {
    poster(data) {
      let image = "";
      if (data.commented_item && data.commented_item.images) {
        image = data.commented_item.images.split(",")[0];
      }
      return image;
    },
    differTime(data) {
      let differ = "";
      if (data.commented_item) {
        differ = timeUtils.differTime(data.commented_item.create_time);
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
    goUgcDetail(e) {
      const { ugc_id } = e.currentTarget.dataset;
      wx.$router.push(`/pages/wall/ugcDetail/index`, { ugc_id });
    },
  },
});
