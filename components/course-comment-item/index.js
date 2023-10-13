// components/course-comment-item/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import timeUtils from "../../utils/time";

Component({
  behaviors: [computedBehavior],
  options: {
    multipleSlots: true,
  },
  computed: {
    differTime(data) {
      let differ = "";
      if (data.comment) {
        differ = timeUtils.differTime(data.comment.time);
      }
      return differ;
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
  methods: {},
});
