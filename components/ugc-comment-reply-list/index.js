// components/ugc-comment-reply-list/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    topComment: {
      type: Object,
      value: {},
    },
    currentComment: {
      type: Object,
      value: {},
    },
    replies: {
      type: Object,
      value: [],
    },
  },

  /**
   * Component initial data
   */
  data: {
    showMore: false,
  },

  /**
   * Component methods
   */
  methods: {},
});
