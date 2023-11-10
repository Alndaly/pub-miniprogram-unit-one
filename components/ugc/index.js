// components/ugc/index.js
import timeUtils from "../../utils/time";
import postApi from "../../api/post";
import { getPageUrl, to } from "../../utils/util";

const computedBehavior = require("miniprogram-computed").behavior;
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
      const { detail } = this.data;
      this.setData({
        "detail.isLike": !detail.isLike,
        "detail.likeCount": detail.isLike
          ? detail.likeCount - 1
          : detail.likeCount + 1,
      });
      if (detail.isLike) await to(postApi.likePost(this.data.detail.id));
      else await to(postApi.unLikePost(this.data.detail.id));
    },

    showComment(e) {
      wx.$router.push("/pages/wall/ugcDetail/index", {
        ugc_id: this.data.detail.id,
        to_location_id: "comment",
      });
    },

    toDetail(e) {
      wx.$router.push(`/pages/wall/ugcDetail/index`, { ugc_id: ugc.id });
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
                    const [res_del_post, err_del_post] = await to(
                      postApi.deletePost(ugc.id)
                    );
                    if (err_del_post) {
                      wx.showToast({
                        title: err_del_post,
                        icon: "error",
                      });
                      return;
                    }
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
