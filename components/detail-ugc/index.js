// components/ugc/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import { emotionIcons } from "../../configs/emotion";
import timeUtils from "../../utils/time";
import ugcApi from "../../api/ugc";
import userApi from "../../api/user";
import cache from "../../utils/cache";
import userUtils from "../../utils/user";
import { replaceEmotions } from "../../utils/util";
import { isNull, getPageUrl, checkMyUgc, to } from "../../utils/util";
const app = getApp();

Component({
  behaviors: [computedBehavior],
  options: {
    multipleSlots: true,
  },
  computed: {
    computedContent(data) {
      // 表情符号和对应图片URL的对象
      const emoticons = emotionIcons;
      return replaceEmotions(data?.detail?.content, emoticons);
    },
    differTime(data) {
      let differ = "";
      if (data.detail) {
        differ = timeUtils.differTime(data.detail.create_time);
      } else if (data.ugcDetail) {
        differ = timeUtils.differTime(data.ugcDetail.create_time);
      }
      return differ;
    },
    isMy(data) {
      return data.detail?.user_info?.id === cache.get("user_id");
    },
  },

  properties: {
    listIndex: Number,
    detail: Object,
    // 当有userInfo数据传输进来时，所有的ugc的发布人信息都改为这个用户（为了方便查看单一用户的ugc列表）
    userInfo: Object,
    isShowTime: {
      type: Boolean,
      default: false,
    },
    showBottom: { type: Boolean, default: true },
    showTop: {
      type: Boolean,
      default: true,
    },
  },

  data: {
    imageWidth: (app.globalData.sysWidth - 50) / 3,
  },

  methods: {
    showUserInfo(e) {
      const { user_info } = e.currentTarget.dataset;
      wx.$router.push(`/pages/userInfo/index`, { user_id: user_info.id });
    },
    nothing(e) {},
    contentLinkTaped(e) {
      console.log(e);
    },
    goLabel(e) {
      const label_id = e.currentTarget.dataset.label.id;
      wx.$router.push(`/pages/wall/labelUgc/index`, { label_id });
    },
    async onComment(e) {
      if (!wx.$user.checkUserAbility("comment")) {
        wx.showModal({
          title: "提醒",
          content:
            "尚未通过校友认证，需要通过答题等方式获取评论等权限，现在去认证吗？",
          success(res) {
            if (res.confirm) {
              wx.$router.push("/pages/school/authentication/home/index");
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
      const [res_comment, err_comment] = await to(
        ugcApi.commentToUgc(this.data.detail.id, this.data.commentContent)
      );
      if (res_comment) {
        wx.showToast({
          title: "提交成功",
        });
      } else {
        wx.showToast({
          title: err_comment.data.message,
          icon: "error",
        });
      }
      wx.hideLoading({
        success: (res) => {},
      });
      this.setData({
        commentContent: "",
      });
    },
    // 浏览ugc的图片
    viewImage(e) {
      let urls = this.data.detail.attachments.map((item) => {
        if (item.type === "image") {
          return item.link;
        }
      });
      wx.previewImage({
        urls,
        current: e.currentTarget.dataset.current,
      });
    },

    // 打开内置地图查看位置
    onOpenLocation() {
      wx.openLocation({
        latitude: this.data.detail.location.latitude,
        longitude: this.data.detail.location.longitude,
        scale: 13,
      });
    },

    // 点赞ugc
    async onVote() {
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
        "detail.is_vote": !_this.data.detail.is_vote,
        "detail.vote": _this.data.detail.is_vote
          ? _this.data.detail.vote - 1
          : _this.data.detail.vote + 1,
      });
      const [res, err] = await to(
        ugcApi.voteUgc(this.properties.detail.id, this.data.detail.is_vote)
      );
      // 如果接口返回结果不为20000，那么就重新将点赞恢复成原来的状态
      if (err) {
        this.setData({
          "detail.is_vote": !_this.data.detail.is_vote,
          "detail.vote": _this.data.detail.is_vote
            ? _this.data.detail.vote + 1
            : _this.data.detail.vote - 1,
        });
        wx.showToast({
          title: res.data.message || err.data.message,
          icon: "error",
        });
      }
    },

    // 触发父级页面的展示评论函数
    showComment(e) {
      wx.$router.push("/pages/wall/ugcDetail/index", {
        ugc_id: this.data.detail.id,
      });
      // var myEventDetail = this.data.detail; // detail对象，提供给事件监听函数
      // var myEventOption = {}; // 触发事件的选项
      // this.triggerEvent("tapCommentIcon", myEventDetail, myEventOption);
    },

    toDetail(e) {
      const currentPageUrl = getPageUrl();
      if (currentPageUrl == "/pages/wall/ugcDetail/index") {
        return;
      }
      let ugc = this.data.detail;
      if (this.data.detail.category == "activity") {
        wx.$router.push("/pagesGroup/pages/group/groupDetail", { id: ugc.id });
      } else {
        wx.$router.push(`/pages/wall/ugcDetail/index`, { ugc_id: ugc.id });
      }
    },

    async onFocusUser(e) {
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
        "detail.user_info.focus": !_this.data.detail.user_info.focus,
      });
      if (this.data.detail.user_info.focus) {
        const [res, err] = await to(
          userApi.focusUser(this.data.detail.user_info.id)
        );
        if (err) {
          this.setData({
            "detail.user_info.focus": !_this.data.detail.user_info.focus,
          });
        }
      } else {
        const [res, err] = await to(
          userApi.unFocusUser(this.data.detail.user_info.id)
        );
        if (err) {
          this.setData({
            "detail.user_info.focus": !_this.data.detail.user_info.focus,
          });
        }
      }
    },

    moreOperate(e) {
      const _this = this;
      let ugc = this.data.detail;
      let itemList = [];
      // 如果是我发布的ugc
      if (checkMyUgc(ugc)) {
        itemList = itemList.concat(["编辑", "删除"]);
      }
      wx.showActionSheet({
        itemList: itemList,
        success: async function (res) {
          switch (itemList[res.tapIndex]) {
            case "编辑": {
              wx.$router.push("/pages/publishV2/update/index", {
                id: ugc.id,
              });
              break;
            }
            case "删除": {
              wx.showModal({
                title: "提示",
                content: "确认删除吗？（此操作不可撤销）",
                success: async function (res) {
                  if (res.confirm) {
                    wx.showLoading({
                      title: "稍等哦",
                    });
                    let [res_del_ugc, err_del_ugc] = await to(
                      ugcApi.delUgc(ugc.id)
                    );
                    if (res_del_ugc.data.code == "20000") {
                      wx.showToast({
                        title: "删除成功",
                      });
                      if (getPageUrl() === "/pages/wall/ugcDetail/index") {
                        setTimeout(() => {
                          wx.$router.back();
                        }, 1000);
                      } else {
                        _this.triggerEvent("onDeleteUgc", {
                          index: _this.data.listIndex,
                        });
                      }
                    } else {
                      wx.showToast({
                        title:
                          res_del_ugc.data.message || err_del_ugc.data.message,
                      });
                    }
                  }
                },
              });
              break;
            }
            default: {
              console.warn("异常选项");
            }
          }
        },
      });
    },
  },
});
