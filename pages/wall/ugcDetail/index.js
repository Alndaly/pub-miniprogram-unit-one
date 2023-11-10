import postApi from "../../../api/post";
import { removeHtmlTag, to } from "../../../utils/util";
import { _ } from "../../../utils/underscore-min";

Page({
  data: {
    showCommentBox: false,
    commentInputFocusStatus: false,
    pageNum: 0,
    inputBottom: 0,
    commentContent: "",
    topComment: {
      id: -1,
    },
    currentComment: {
      id: -1,
    },
  },

  async onVote(e) {
    const { postDetail } = this.data;
    this.setData({
      "postDetail.isLike": !postDetail.isLike,
      "postDetail.likeCount": postDetail.isLike
        ? postDetail.likeCount - 1
        : postDetail.likeCount + 1,
    });
    if (postDetail.isLike) await to(postApi.likePost(this.data.postDetail.id));
    else await to(postApi.unLikePost(this.data.postDetail.id));
  },

  async onSendImageComment(e) {
    wx.showToast({
      title: "图片评论功能开发中...",
      icon: "none",
    });
  },

  // 点击ugc的评论的评论图标后聚焦到评论框
  async onFocusCommentToCommentInput(e) {
    this.setData({
      currentComment: e.detail.currentComment,
      topComment: e.detail.topComment,
      commentInputFocusStatus: true,
      showCommentBox: true,
    });
  },

  onComment(e) {
    this.setData({
      showCommentBox: true,
      commentInputFocusStatus: true,
    });
  },

  unFocusCommentInput() {
    this.setData({
      topComment: {
        id: -1,
      },
      currentComment: {
        id: -1,
      },
      showCommentBox: false,
      commentInputFocusStatus: false,
    });
  },

  // 提交评论
  async submitComment(e) {
    wx.showLoading({
      title: "提交中...",
    });
    if (this.data.topComment.id === -1) {
      // 评论帖子
      const [res_post_comment, err_post_comment] = await to(
        postApi.commentPost(this.data.postDetail.id, this.data.commentContent)
      );
      if (err_post_comment) {
        wx.showToast({
          title: err_post_comment,
          icon: "error",
        });
        return;
      }
    } else {
      // 评论评论
      const [res_comment_comment, err_comment_comment] = await to(
        postApi.commentPostComment(
          this.data.postDetail.id,
          this.data.topComment.id,
          this.data.currentComment.id,
          this.data.commentContent
        )
      );
      if (err_comment_comment) {
        wx.showToast({
          title: err_comment_comment,
          icon: "error",
        });
        return;
      }
    }
    wx.hideLoading();
    this.setData({
      topComment: {
        id: -1,
      },
      currentComment: {
        id: -1,
      },
      commentContent: "",
    });
    await this.onRefresh();
  },

  onClosePopUp(e) {
    this.setData({
      showSharePopUp: false,
    });
  },

  showUserInfo() {
    const { ugcDetail } = this.data;
    wx.$router.push(`/pages/userInfo/index`, {
      user_id: ugcDetail.user_info.id,
    });
  },

  async onShowSharePopup(e) {
    this.setData({
      showSharePopUp: true,
    });
  },

  // 点击ugc的「评论图标」后聚焦到评论框
  async focusCommentInput(e) {
    this.setData({
      focus_input: true,
    });
  },

  // 点击ugc的评论的评论图标后聚焦到评论框
  async focusCommentToCommentInput(e) {
    this.setData({
      currentComment: e.detail.currentComment,
      topComment: e.detail.topComment,
      focus_input: true,
    });
  },

  onShow(e) {
    wx.onKeyboardHeightChange((res) => {
      this.setData({ inputBottom: res.height });
    });
  },

  onReady() {
    wx.getSystemInfo({
      success: (e) => {
        let custom = wx.getMenuButtonBoundingClientRect();
        let CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.setData({
          CustomBar: CustomBar,
          StatusBar: e.statusBarHeight,
          Custom: custom,
        });
      },
    });
  },

  async onLoad(options) {
    this.setData({
      options,
      isLoading: true,
      refresherTriggered: true,
    });
  },

  goBack() {
    wx.$router.back();
  },

  async onNextPage(e) {
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(
      postApi.getComment(this.data.options.ugc_id, this.data.pageNum + 1)
    );
    if (err) {
      this.setData({
        isLoading: false,
      });
      wx.showToast({
        title: err,
        icon: "error",
      });
      return;
    }
    const ugcCommentListNext = res.data;
    this.setData({
      ugcCommentList: {
        ...ugcCommentListNext,
        content: [
          ...this.data.ugcCommentList.content,
          ...ugcCommentListNext.content,
        ],
      },
      pageNum:
        res.data.content.length > 0 ? this.data.pageNum + 1 : this.data.pageNum,
      isLoading: false,
    });
  },

  async onRefresh(e) {
    const { options } = this.data;
    const [resPostDetail, errPostDetail] = await to(
      postApi.getPostDetail(options.ugc_id)
    );
    const [resPostCommentList, errPostCommentList] = await to(
      postApi.getComment(options.ugc_id, 0)
    );
    this.setData({
      postDetail: resPostDetail.data,
      ugcCommentList: resPostCommentList.data,
      refresherTriggered: false,
      isLoading: false,
    });
  },

  onShareTimeline(e) {
    const { postDetail } = this.data;
    let title = removeHtmlTag(postDetail.content);
    let query = `ugc_id=${postDetail.id}&user_id=${postDetail.userInfo.user_id}`; // 分享后打开的页面
    return {
      title,
      query,
    };
  },

  onShareAppMessage() {
    const { postDetail } = this.data;
    const title = removeHtmlTag(postDetail.content);
    const imageUrl = postDetail.attachmentList[0].url;
    const path = `pages/wall/ugcDetail/index?ugc_id=${postDetail.id}`;
    return {
      imageUrl,
      title,
      path,
    };
  },
});
