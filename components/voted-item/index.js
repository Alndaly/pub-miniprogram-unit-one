// components/voted-item/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import timeUtils from "../../utils/time";

Component({
  behaviors: [computedBehavior],
  computed: {
    poster(data) {
      let image = "";
      if (data.voted_item && data.voted_item.images) {
        image = data.voted_item.images.split(",")[0];
      }
      return image;
    },
    differTime(data) {
      let differ = "";
      if (data.voted_item) {
        differ = timeUtils.differTime(data.voted_item.update_time);
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
    goUgcDetail(e) {
      const { ugc_id } = e.currentTarget.dataset;
      wx.$router.push(`/pages/wall/ugcDetail/index`, { ugc_id: ugc_id });
    },
  },
});
