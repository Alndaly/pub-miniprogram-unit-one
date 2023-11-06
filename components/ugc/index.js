// components/ugc/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import timeUtils from "../../utils/time";
import postApi from "../../api/post";
import userApi from "../../api/user";
import { getPageUrl, to } from "../../utils/util";
const app = getApp();

Component({
  behaviors: [computedBehavior],
  options: {
    multipleSlots: true,
  },
  computed: {
    differTime(data) {
      let differ = "";
      if (data.detail) {
        differ = timeUtils.differTime(data.detail.createTime);
      } else if (data.ugcDetail) {
        differ = timeUtils.differTime(data.ugcDetail.createTime);
      }
      return differ;
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
    showBottom: {
      type: Boolean,
      default: true,
    },
    showTop: {
      type: Boolean,
      default: true,
    },
  },

  data: {
    showUserInfoPopUp: false,
    imageWidth: (app.globalData.sysWidth - 50) / 3,
  },

  methods: {
    showUserInfo(e) {
      const { user_info } = e.currentTarget.dataset;
      wx.$router.push(`/pages/userInfo/index`, { user_id: user_info.id });
    },
    nothing(e) {},
    goLabel(e) {
      const label_id = e.currentTarget.dataset.label.id;
      wx.$router.push(`/pages/wall/labelUgc/index`, { label_id: label_id });
    },
    // 浏览ugc的图片
    viewImage(e) {
      let urls = this.data.detail.attachmentList.map((item) => {
        if (item.type === "image") {
          return item.url;
        }
      });
      wx.previewImage({
        urls,
        current: e.currentTarget.dataset.current,
      });
    },

    // 点赞ugc
    async onVote() {
      const _this = this;
      this.setData({
        "detail.isLike": !_this.data.detail.isLike,
        "detail.vote": _this.data.detail.isLike
          ? _this.data.detail.vote - 1
          : _this.data.detail.vote + 1,
      });
      const [res, err] = await to(postApi.likePost(this.properties.detail.id));
      // 如果接口返回结果不为20000，那么就重新将点赞恢复成原来的状态
      if (err) {
        this.setData({
          "detail.isLike": !_this.data.detail.isLike,
          "detail.vote": _this.data.detail.isLike
            ? _this.data.detail.vote + 1
            : _this.data.detail.vote - 1,
        });
        wx.showToast({
          title: err,
          icon: "error",
        });
      }
    },

    // 触发父级页面的展示评论函数
    showComment(e) {
      wx.$router.push("/pages/wall/ugcDetail/index", {
        ugc_id: this.data.detail.id,
        to_location_id: "comment",
      });
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
              wx.$router.push("/pages/publishV2/update/index", { id: ugc.id });
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
                      postApi.deletePost(ugc.id)
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
              console.error("异常选项");
            }
          }
        },
      });
    },
  },
});
