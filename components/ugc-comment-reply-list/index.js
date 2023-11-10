// components/ugc-comment-reply-list/index.js
import { to } from "../../utils/util";
import postApi from "../../api/post";

Component({
  /**
   * Component properties
   */
  properties: {
    topComment: null,
    currentComment: null,
    replies: null,
  },

  /**
   * Component initial data
   */
  data: {
    showMore: false,
    pageNum: 0,
  },

  /**
   * Component methods
   */
  methods: {
    async showMoreComment(e) {
      const { pageNum, replies, topComment } = this.data;
      const [res, err] = await to(
        postApi.getCommentComment(topComment.id, pageNum + 1)
      );
      if (err) {
        wx.showToast({
          title: "出错啦",
          icon: "error",
        });
        return;
      }
      this.setData({
        replies: {
          ...res.data,
          content: [...replies.content, ...res.data.content],
          pageNum: res.data.content.length > 0 ? pageNum + 1 : pageNum,
        },
      });
    },
  },
});
