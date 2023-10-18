// components/kinda-input/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import fileApi from "../../api/file";
import { to } from "../../utils/util";

Component({
  behaviors: ["wx://form-field", computedBehavior],
  computed: {
    font_count(data) {
      if (data.type === "textarea") {
        return data?.value?.length;
      }
      return;
    },
  },
  /**
   * Component properties
   */
  properties: {
    title: String,
    is_required: Boolean,
    label: String,
    place_holder: String,
    type: String,
    answer_list: { type: Object, default: [] },
    answer_index: { type: Number, default: 0 },
    default_value: null,
  },

  /**
   * Component initial data
   */
  data: {
    error: false,
    value: [],
  },

  lifetimes: {
    ready: function () {
      const { default_value, type } = this.data;
      if (default_value) {
        this.setData({
          value: default_value,
        });
      }
      if (type === "radio" && default_value) {
        this.setData({
          answer_index: default_value.list_index,
        });
      }
    },
  },

  /**
   * Component methods
   */
  methods: {
    changeAnswerByCheckBox(e) {
      this.setData({
        value: e.detail,
      });
    },
    toggleCheckBox(e) {
      const { index } = e.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkbox-${index}`);
      checkbox.toggle();
    },
    delImage(e) {
      const { value } = this.data;
      wx.showModal({
        title: "提醒",
        content: "确定要删除这张照片吗？",
        cancelText: "取消",
        confirmText: "确定",
        success: (res) => {
          if (res.confirm) {
            value.splice(e.detail.index, 1);
            this.setData({
              value,
            });
          }
        },
      });
    },
    async afterReadImages(e) {
      let fileList = e.detail.file;
      let { value } = this.data;
      if (!value) {
        value = [];
      }
      fileList = fileList.map((item) => {
        return {
          ...item,
          status: "uploading",
        };
      });
      value = [...value, ...fileList];
      this.setData({
        value,
      });
      const uploadImagesTasks = value.map((file, index) => {
        return fileApi.uploadImage(file, index);
      });
      let [uploadImageRes, uploadImageErr] = await to(
        Promise.all(uploadImagesTasks)
      );
      value = uploadImageRes.map((item) => {
        return {
          url: item.url,
          type: item.type,
        };
      });
      this.setData({
        value,
      });
    },
    viewImage(e) {
      const { value } = this.data;
      const urls = value.map((item) => {
        item.attachment_url;
      });
      wx.previewImage({
        urls,
        current: value[e.detail.index].attachment_url,
      });
    },
    changeAnswer(e) {
      const { value } = e.detail;
      this.setData({
        value: value,
      });
    },
    changeAnswerByRadio(e) {
      const { answer_list } = this.data;
      let { answer_index } = this.data;
      answer_index = e.detail.value;
      this.setData({
        answer_index,
        value: answer_list[answer_index],
      });
    },
  },
});
