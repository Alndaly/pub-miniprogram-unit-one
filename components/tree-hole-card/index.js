// components/tree-hole-card/index.js
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
      if (data.tree_hole) {
        differ = timeUtils.differTime(data.tree_hole.update_time);
      }
      return differ;
    },
  },
  /**
   * Component properties
   */
  properties: {
    tree_hole: Object,
  },

  /**
   * Component initial data
   */
  data: {},

  /**
   * Component methods
   */
  methods: {
    goTreeHoleDetail(e) {
      const { tree_hole } = this.data;
      wx.$router.push(`/package_tree_hole/pages/index/index`, {
        tree_hole_id: tree_hole.id,
      });
    },
  },
});
