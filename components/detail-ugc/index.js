import { emotionIcons } from "../../configs/emotion";
import timeUtils from "../../utils/time";
import { replaceEmotions } from "../../utils/util";

const app = getApp();
const computedBehavior = require("miniprogram-computed").behavior;

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
        differ = timeUtils.differTime(data.detail.createTime);
      }
      return differ;
    },
  },

  properties: {
    detail: Object,
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
      wx.$router.push(`/pages/wall/labelUgc/index`, { label_id });
    },
    // 浏览ugc的图片
    viewImage(e) {
      const urls = this.data.detail.attachmentInfoList.map((item) => {
        if (item.type === "image") {
          return item.url;
        }
      });
      wx.previewImage({
        urls,
        current: e.currentTarget.dataset.current,
      });
    },
  },
});
