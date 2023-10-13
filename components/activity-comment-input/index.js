const computedBehavior = require("miniprogram-computed").behavior;
import activityApi from "../../api/activity";
import cache from "../../utils/cache";
import userUtils from "../../utils/user";
import { isNull, to } from "../../utils/util";
import { emotionIcons } from "../../configs/emotion";
import { subscribeNotify } from "../../utils/subscribe";

Component({
  behaviors: [computedBehavior],
  properties: {
    showCommentIconAndNumber: {
      type: Boolean,
      value: true,
    },
    inputFocus: {
      type: Boolean,
      value: false,
    },
    inputBottom: {
      type: Number,
      value: 0,
    },
    activityDetail: {
      type: Object,
      value: {},
    },
    parentComment: {
      type: Object,
    },
  },

  computed: {
    emojiList: function (data) {
      return emotionIcons.map((item) => item.emoji);
    },
  },

  data: {
    placeHolderText: "说点儿什么吧～",
    commentContent: "",
    inputBottom: 0,
  },

  methods: {
    onInsertEmoji(e) {
      const emoji = e.currentTarget.dataset.emoji;
      let { commentContent } = this.data;
      commentContent = commentContent + emoji;
      this.setData({
        commentContent,
      });
    },
    // 显示emoji列表
    onShowEmojiBox(e) {
      this.setData({
        inputFocus: false,
        showEmojiBox: true,
      });
    },

    onInputFocus(e) {
      this.setData({
        inputFocus: true,
        showEmojiBox: false,
      });
    },

    // 显示键盘
    onShowJianPanBox(e) {
      this.setData({
        inputFocus: true,
        showEmojiBox: false,
      });
    },

    onInputBlur(e) {
      if (!this.data.showEmojiBox) {
        this.setData({
          parentComment: {
            id: -1,
          },
        });
      }
      this.setData({
        inputFocus: false,
      });
    },

    // 将父级评论重新置为activity本身
    clearParent(e) {
      this.setData({
        parentComment: {
          id: -1,
        },
      });
    },

    focusCommentInput(e) {
      this.setData({
        inputFocus: true,
      });
    },

    async onVote(e) {
      if (!userUtils.hasSignUp()) {
        wx.showModal({
          title: "提醒",
          showCancel: false,
          content: "请先登陆哦",
        });
        return;
      }
      const _this = this;
      this.setData({
        "activityDetail.is_vote": !_this.data.activityDetail.is_vote,
        "activityDetail.vote": _this.data.activityDetail.is_vote
          ? _this.data.activityDetail.vote - 1
          : _this.data.activityDetail.vote + 1,
      });
      const [res, err] = await to(
        activityApi.voteActivitt(
          this.data.activityDetail.id,
          this.data.activityDetail.is_vote
        )
      );
      // 如果接口返回结果不为20000，那么就重新将点赞恢复成原来的状态
      if (res.data.code != "20000" || err) {
        this.setData({
          "activityDetail.is_vote": !_this.data.activityDetail.is_vote,
          "activityDetail.vote": _this.data.activityDetail.is_vote
            ? _this.data.activityDetail.vote + 1
            : _this.data.activityDetail.vote - 1,
        });
        wx.showToast({
          title: res.data.message || err.data.message,
          icon: "error",
        });
      }
    },
    changeCommentContent(e) {
      this.setData({
        commentContent: e.detail.value,
      });
    },
    // 提交评论
    async submitComment(e) {
      if (!wx.$user.checkUserAbility("comment")) {
        wx.showModal({
          title: "提醒",
          content:
            "尚未通过校友认证，需要通过答题等方式获取评论等权限，现在去认证吗？",
          success(res) {
            if (res.confirm) {
              wx.$router.push("/pages/school/authentication/index");
            }
          },
        });
        return;
      }
      if (isNull(this.data.commentContent)) {
        wx.showModal({
          title: "提醒",
          showCancel: false,
          content: "评论内容不能为空哦",
        });
        return;
      }
      // 此处增加交互，防止多次重复发送评论
      wx.showLoading({
        title: "提交中...",
      });
      let myEventDetail = {};
      if (this.data.parentComment.id === -1) {
        // 评论帖子
        const [res_activity_comment, err_activity_comment] = await to(
          activityApi.commentToActivity(
            this.data.activityDetail.id,
            this.data.commentContent
          )
        );
        if (err_activity_comment) {
          wx.showToast({
            title: err_activity_comment.data.message,
            icon: "error",
          });
          return;
        }
        // detail对象，提供给事件监听函数
        myEventDetail = {
          type: "toActivity",
          res: res_activity_comment,
        };
      } else {
        // 评论评论
        const [res_comment_comment, err_comment_comment] = await to(
          activityApi.commentToActivityComment(
            this.data.activityDetail.id,
            this.data.commentContent,
            this.data.parentComment.id
          )
        );
        if (err_comment_comment) {
          wx.showToast({
            title: err_comment_comment.data.message,
            icon: "error",
          });
          return;
        }
        // detail对象，提供给事件监听函数
        myEventDetail = {
          type: "toComment",
          res: res_comment_comment,
        };
      }
      wx.hideLoading({
        success: (res) => {},
      });
      this.setData({
        parentComment: {
          id: -1,
        },
        commentContent: "",
        showEmojiBox: false,
      });
      var myEventOption = {}; // 触发事件的选项
      this.triggerEvent("submitCommentResult", myEventDetail, myEventOption);
      // 申请订阅通知权限
      const [res_subscribe, err_subscribe] = await subscribeNotify([
        "EC-BKxpWTEdEBLNdMCvphbJaqRLFl8Ehok6xX9g5ZxI",
      ]);
    },
  },
});
