// components/ugc-comment/index.js
Component({
  properties: {
    activityCommentList: {
      type: Object,
      value: {},
    },
    ugc: {
      type: Object,
      value: {},
    },
  },

  data: {},

  methods: {
    // 对评论进行评论
    onFocusCommentToComment(e) {
      var myEventDetail = e.detail; // detail对象，提供给事件监听函数
      var myEventOption = {}; // 触发事件的选项
      this.triggerEvent("tapComment", myEventDetail, myEventOption);
    },
  },
});
