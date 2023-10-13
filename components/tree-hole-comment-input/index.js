// components/tree-hole-comment-input/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import treeHoleApi from "../../api/treeHole";
import userUtils from "../../utils/user";
import { isNull, to } from "../../utils/util";
import { emotionIcons } from "../../configs/emotion";
import { subscribeNotify } from "../../utils/subscribe";

Component({
  behaviors: [computedBehavior],
  properties: {
    identity: {
      type: Object,
      value: {},
    },
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
    treeHole: {
      type: Object,
      value: {},
    },
    topComment: {
      type: Object,
    },
    currentComment: {
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
    reGenerating: false,
    showChangeIdentityPopUp: false,
  },

  /**
   * Component methods
   */
  methods: {
    async reGenerateIdentity(e) {
      if (this.data.reGenerating) {
        return;
      }
      this.setData({
        reGenerating: true,
      });
      const [res, err] = await to(treeHoleApi.reGenerateAnonymousIdentity());
      if (err) {
        wx.showToast({
          title: err.data.message,
          icon: "none",
        });
        this.setData({
          reGenerating: false,
        });
        return;
      }
      this.setData({
        identity: res.data.data,
        reGenerating: false,
      });
    },
    onChangeIdentity(e) {
      this.setData({
        showChangeIdentityPopUp: true,
      });
    },
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
          currentComment: {
            id: -1,
          },
          topComment: {
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
        topComment: {
          id: -1,
        },
        currentComment: {
          id: -1,
        },
      });
    },

    focusCommentInput(e) {
      this.setData({
        inputFocus: true,
      });
    },

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
      if (this.data.topComment.id === -1) {
        // 评论帖子
        const [res_comment, err_comment] = await to(
          treeHoleApi.addComment(
            this.data.treeHole.id,
            this.data.commentContent,
            this.data.topComment.id,
            this.data.currentComment.id
          )
        );
        if (err_comment) {
          wx.showToast({
            title: "出错啦",
            icon: "error",
          });
          return;
        }
        // detail对象，提供给事件监听函数
        myEventDetail = {
          type: "toTreeHole",
          res: res_comment,
        };
      } else {
        // 评论评论
        const [res_comment, err_comment] = await to(
          treeHoleApi.addComment(
            this.data.treeHole.id,
            this.data.commentContent,
            this.data.topComment.id,
            this.data.currentComment.id
          )
        );
        if (err_comment) {
          wx.showToast({
            title: "出错啦",
            icon: "error",
          });
          return;
        }
        // detail对象，提供给事件监听函数
        myEventDetail = {
          type: "toComment",
          res: res_comment,
        };
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
        showEmojiBox: false,
      });
      const myEventOption = {}; // 触发事件的选项
      this.triggerEvent("submitCommentResult", myEventDetail, myEventOption);
      // 申请订阅通知权限
      const [res_subscribe, err_subscribe] = await subscribeNotify([
        "91KokNHW0DYqU7EE5f3ggsnE11QAE9LP9-oyhJnijeE",
      ]);
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
      const { treeHole } = this.data;
      this.setData({
        treeHole: {
          ...treeHole,
          is_vote: !treeHole.is_vote,
          vote: treeHole.is_vote ? treeHole.vote - 1 : treeHole.vote + 1,
        },
      });
      const [res, err] = await to(
        treeHoleApi.voteTreeHole(treeHole.id, !treeHole.is_vote)
      );
      if (err) {
        this.setData({
          treeHole: {
            ...treeHole,
            is_vote: treeHole.is_vote,
            vote: treeHole.is_vote,
          },
        });
        wx.showToast({
          title: "出错啦",
          icon: "error",
        });
      }
    },

    changeCommentContent(e) {
      this.setData({
        commentContent: e.detail.value,
      });
    },
  },
});
