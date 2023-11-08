// components/search-ugc-item/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import { emotionIcons } from "../../configs/emotion";
import { replaceEmotions, replaceHighLight } from "../../utils/util";
import ugcApi from "../../api/post";
import { getPageUrl } from "../../utils/util";

Component({
  options: {
    multipleSlots: true,
  },
  behaviors: [computedBehavior],
  computed: {
    computedContent(data) {
      // 表情符号和对应图片URL的对象
      const emoticons = emotionIcons;
      return replaceHighLight(
        replaceEmotions(data.detail.content, emoticons),
        data.search_key
      );
    },
  },
  properties: {
    search_key: String,
    detail: Object,
  },

  data: {},

  methods: {
    showUserInfo(e) {
      // 否则弹出
      wx.$router.push(`/pages/userInfo/index`, {
        user_id: this.data.detail.userInfo.id
      });
    },

    // 浏览ugc的图片
    viewImage(e) {
      const urls = this.data.detail.attachmentList.map((item) => item.url);
      wx.previewImage({
        urls,
        current: e.currentTarget.dataset.current,
      });
    },

    onClickComment(e) {
      wx.$router.push("/pages/wall/ugcDetail/index", {
        ugc_id: this.data.detail.id,
      });
    },

    toDetail(e) {
      const currentPageUrl = getPageUrl();
      if (currentPageUrl == "/pages/wall/ugcDetail/index") {
        return;
      }
      let ugc = this.data.detail;
      wx.$router.push(`/pages/wall/ugcDetail/index`, { ugc_id: ugc.id });
    },

    // 点赞ugc
    async onVote() {
      this.setData({
        "detail.is_vote": !this.data.detail.is_vote,
        "detail.vote": this.data.detail.is_vote
          ? this.data.detail.vote - 1
          : this.data.detail.vote + 1,
      });
      const [res, err] = await to(
        ugcApi.voteUgc(this.properties.detail.id, this.data.detail.is_vote)
      );
      // 如果接口返回结果不为20000，那么就重新将点赞恢复成原来的状态
      if (err) {
        this.setData({
          "detail.is_vote": !this.data.detail.is_vote,
          "detail.vote": this.data.detail.is_vote
            ? this.data.detail.vote - 1
            : this.data.detail.vote + 1,
        });
        wx.showToast({
          title: res.data.message,
          icon: "error",
        });
      }
    },
  },
});
