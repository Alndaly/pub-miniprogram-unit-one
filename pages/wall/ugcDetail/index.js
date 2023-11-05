import postApi from "../../../api/post";
import { removeHtmlTag, to } from "../../../utils/util";
import { promisify } from "../../../utils/promisify";
import { generatePoster } from "../../../api/image";
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
    const _this = this;
    this.setData({
      "postDetail.isLike": !_this.data.postDetail.isLike,
      "postDetail.vote": _this.data.postDetail.isLike
        ? _this.data.postDetail.vote - 1
        : _this.data.postDetail.vote + 1,
    });
    const [res, err] = await to(
      postApi.voteUgc(this.data.postDetail.id, this.data.postDetail.isLike)
    );
    if (err) {
      this.setData({
        "postDetail.isLike": !_this.data.postDetail.isLike,
        "postDetail.vote": _this.data.postDetail.isLike
          ? _this.data.postDetail.vote + 1
          : _this.data.postDetail.vote - 1,
      });
      wx.showToast({
        title: err,
        icon: "error",
      });
    }
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
      const [res_ugc_comment, err_ugc_comment] = await to(
        postApi.commentToUgc(this.data.ugcDetail.id, this.data.commentContent)
      );
      if (err_ugc_comment) {
        wx.showToast({
          title: err_ugc_comment.data.message,
          icon: "error",
        });
        return;
      }
    } else {
      // 评论评论
      const [res_comment_comment, err_comment_comment] = await to(
        postApi.commentToComment(
          this.data.topComment.id,
          this.data.currentComment.id,
          this.data.ugcDetail.id,
          this.data.commentContent
        )
      );
      if (err_comment_comment) {
        wx.showToast({
          title: err_comment_comment.data.message,
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
    const { ugcDetail } = this.data;
    const qrcode_url = `https://weixiao.zuowu.cc/qr_code/?activity=photo&id=${ugcDetail.id}`;
    let poster_text = removeHtmlTag(ugcDetail.content);
    if (ugcDetail.content.length >= "100") {
      poster_text = removeHtmlTag(ugcDetail.content).slice(0, 100) + "...";
    }
    const data = {
      width: 600,
      height:
        (500 * ugcDetail.attachments[0].height) /
          ugcDetail.attachments[0].width +
        20 +
        130 +
        20 +
        1 +
        20 +
        20 +
        20,
      backgroundColor: "#f2f2f2",
      blocks: [],
      texts: [
        {
          x: 20,
          y:
            (500 * ugcDetail.attachments[0].height) /
              ugcDetail.attachments[0].width +
            20,
          text: poster_text,
          font: "SourceHanSerifCN-Regular",
          fontSize: 18,
          color: "#000",
          width: 400,
          textAlign: "left",
        },
        {
          x: 20 + 25 + 5,
          y:
            (500 * ugcDetail.attachments[0].height) /
              ugcDetail.attachments[0].width +
            100,
          text: ugcDetail.user_info.nickname,
          font: "SourceHanSerifCN-Regular",
          fontSize: 17,
          color: "#666",
          width: 400,
          textAlign: "left",
        },
        {
          x: 300,
          y:
            (500 * ugcDetail.attachments[0].height) /
              ugcDetail.attachments[0].width +
            20 +
            130 +
            20 +
            20,
          text: "Unit One，高校一站式社区",
          font: "SourceHanSerifCN-Regular",
          fontSize: 17,
          color: "#666",
          width: 560,
          textAlign: "center",
        },
      ],
      images: [
        {
          x: 0,
          y: 0,
          width: 600,
          height:
            (500 * ugcDetail.attachments[0].height) /
            ugcDetail.attachments[0].width,
          url: ugcDetail.attachments[0].link,
          zIndex: 1,
        },
        {
          x: 20,
          y:
            (500 * ugcDetail.attachments[0].height) /
              ugcDetail.attachments[0].width +
            100,
          width: 25,
          height: 25,
          url: ugcDetail.user_info.avatar,
          borderRadius: 50,
          zIndex: 1,
        },
      ],
      lines: [
        {
          startX: 20,
          startY:
            (500 * ugcDetail.attachments[0].height) /
              ugcDetail.attachments[0].width +
            20 +
            130 +
            20,
          endX: 580,
          endY:
            (500 * ugcDetail.attachments[0].height) /
              ugcDetail.attachments[0].width +
            20 +
            130 +
            20,
          width: 1,
          color: "#E1E1E1",
          zIndex: 1,
        },
      ],
      qrcodes: [
        {
          x: 450,
          y:
            (500 * ugcDetail.attachments[0].height) /
              ugcDetail.attachments[0].width +
            20,
          size: 130,
          content: qrcode_url,
          foregroundColor: "#000",
          backgroundColor: "#fff",
          zIndex: 1,
        },
      ],
    };
    const [res, err] = await to(generatePoster(data));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      poster_image: res.data.data.url,
    });
  },

  onShowPosterImage(e) {
    const { poster_image } = this.data;
    wx.previewImage({
      urls: [poster_image],
      current: poster_image,
    });
  },

  async onShareByPoster(e) {
    const { poster_image } = this.data;
    if (!poster_image) {
      wx.showToast({
        title: "海报正在生成中，请稍等候",
        icon: "none",
      });
      return;
    }
    const [res_download, err_download] = await to(
      promisify(wx.downloadFile)({
        url: poster_image,
      })
    );
    if (err_download) {
      console.error(err_download);
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    const [res_album, err_album] = await to(
      wx.saveImageToPhotosAlbum({
        filePath: res_download.tempFilePath,
      })
    );
    if (err_album) {
      wx.showToast({
        title: "出错啦",
        icon: "none",
      });
    }
    this.setData({
      poster_image: null,
      showSharePopUp: false,
    });
    wx.showToast({
      title: "海报已保存到本地相册",
      icon: "none",
    });
    postApi.shareUgc(this.data.ugcDetail.id, true);
  },

  showCommentOrder(e) {
    const _this = this;
    let itemList = ["热度排序", "时间正序", "时间逆序"];
    let value = ["exposure", "time", "time-reverse"];
    wx.showActionSheet({
      itemList,
      async success(res) {
        wx.showLoading({
          title: "稍等哦",
        });
        let order_by = "vote";
        let desc = true;
        // 排序选择
        switch (res.tapIndex) {
          case 0:
            order_by = "vote";
            desc = false;
            break;
          case 1:
            order_by = "create_time";
            desc = false;
            break;
          case 2:
            order_by = "create_time";
            desc = true;
            break;
        }
        _this.setData({
          order_by,
          desc,
          page: 0,
        });
        let [resUgcCommentList, errUgcCommentList] = await to(
          postApi.getUgcComment(_this.data.ugcDetail.id, 0, 10, order_by, desc)
        );
        _this.setData({
          ugcCommentList: resUgcCommentList.data.data,
        });
        wx.hideLoading();
      },
    });
  },

  // 点赞ugc
  async onVote() {
    const _this = this;
    this.setData({
      "ugcDetail.is_vote": !_this.data.ugcDetail.is_vote,
      "ugcDetail.vote": _this.data.ugcDetail.is_vote
        ? _this.data.ugcDetail.vote - 1
        : _this.data.ugcDetail.vote + 1,
    });
    const [res, err] = await to(
      postApi.voteUgc(this.data.ugcDetail.id, this.data.ugcDetail.is_vote)
    );
    // 如果接口返回结果不为20000，那么就重新将点赞恢复成原来的状态
    if (err) {
      this.setData({
        "ugcDetail.is_vote": !_this.data.ugcDetail.is_vote,
        "ugcDetail.vote": _this.data.ugcDetail.is_vote
          ? _this.data.ugcDetail.vote + 1
          : _this.data.ugcDetail.vote - 1,
      });
      wx.showToast({
        title: res.data.message || err.data.message,
        icon: "error",
      });
    }
  },

  // 接收到评论组件返回的成功信号
  async onSubmitCommentResult(e) {
    if (e.detail.res.data.code != "20000") {
      return;
    }
    let [resUgcCommentList, errUgcCommentList] = await to(
      postApi.getUgcComment(
        this.data.ugcDetail.id,
        0,
        10,
        this.data.order_by,
        this.data.desc
      )
    );
    this.setData({
      ugcCommentList: resUgcCommentList.data.data,
      "ugcDetail.comment": this.data.ugcDetail.comment + 1,
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

  async onLoad(options) {
    this.setData({
      options,
    });
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
      fail: (res) => {
        console.error("获取系统信息出错", res);
      },
    });
    this.setData({
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
      postApi.getUgcComment(
        this.data.options.ugc_id,
        this.data.page + 1,
        10,
        this.data.order_by,
        this.data.desc
      )
    );
    if (res.data.code != "20000" || err) {
      this.setData({
        isLoading: false,
      });
      wx.showToast({
        title: res.data.message || err.data.message,
        icon: "err",
      });
      return;
    }
    const ugcCommentListNext = res.data.data;
    this.setData({
      ugcCommentList: [...this.data.ugcCommentList, ...ugcCommentListNext],
      page: res.data.data.length > 0 ? this.data.page + 1 : this.data.page,
      isLoading: false,
    });
  },

  async onRefresh(e) {
    const { options } = this.data;
    const [resUgcDetail, errUgcDetail] = await to(
      postApi.getPostDetail(options.ugc_id)
    );
    const [resUgcCommentList, errUgcCommentList] = await to(
      postApi.getUgcComment(
        options.ugc_id,
        0,
        10,
        this.data.order_by,
        this.data.desc
      )
    );
    this.setData({
      ugcDetail: resUgcDetail.data.data,
      ugcCommentList: resUgcCommentList.data.data,
      refresherTriggered: false,
      isLoading: false,
    });
  },

  onShareTimeline(e) {
    postApi.shareUgc(this.data.ugcDetail.id, true);
    let title = removeHtmlTag(this.data.ugcDetail.content);
    let query = `ugc_id=${this.data.ugcDetail.id}&user_id=${this.data.ugcDetail.user_info.user_id}`; // 分享后打开的页面
    return {
      title,
      query,
    };
  },

  onShareAppMessage() {
    let title = removeHtmlTag(this.data.postDetail.content);
    let imageUrl = this.data.postDetail.attachments[0].link;
    let path = `pages/wall/ugcDetail/index?ugc_id=${this.data.ugcDetail.id}&user_id=${this.data.ugcDetail.user_info.user_id}`;
    return {
      imageUrl,
      title,
      path,
    };
  },
});
