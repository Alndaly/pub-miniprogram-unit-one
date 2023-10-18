// pages/publishV2/activity/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import { _ } from "../../../utils/underscore-min";
import fileApi from "../../../api/file";
import activityApi from "../../../api/activity";
import { to } from "../../../utils/util";

Page({
  behaviors: [computedBehavior],
  computed: {},

  /**
   * Page initial data
   */
  data: {
    activity_title: "",
    activity_detail: "",
    keyboardHeight: 0,
    submitCondition: 0,
    activity_attachments: [],
    time_locations: [],
  },

  onAddLocation() {
    wx.$router.push("/pages/publishV2/activity/location-input");
  },

  onDeleteTimeLocation(e) {
    const { time_locations } = this.data;
    const { index } = e.currentTarget.dataset;
    time_locations.splice(index, 1);
    this.setData({
      time_locations,
    });
  },

  inputActivityContent(e) {
    this.setData({
      activity_detail: e.detail.html,
    });
  },

  uploadOverSize(e) {
    wx.showToast({
      title: "图片大小不能超过20MB",
      icon: "none",
    });
  },

  async afterRead(e) {
    let fileList = e.detail.file;
    const { activity_attachments } = this.data;
    fileList = fileList.map((item) => {
      return {
        ...item,
        status: "uploading",
      };
    });
    let uploadTasks = [];
    this.setData({
      activity_attachments: [...activity_attachments, ...fileList],
    });
    uploadTasks = fileList.map((item, index) => {
      return this.uploadImage(item, activity_attachments.length + index);
    });
    Promise.all(uploadTasks)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  // 删除附件
  delAttachment(e) {
    const { activity_attachments } = this.data;
    wx.showModal({
      title: "提醒",
      content: "确定要删除这张照片吗？",
      cancelText: "取消",
      confirmText: "确定",
      success: (res) => {
        if (res.confirm) {
          activity_attachments.splice(e.detail.index, 1);
          this.setData({
            activity_attachments,
          });
        }
      },
    });
  },

  viewImage(e) {
    const { activity_attachments } = this.data;
    let urls = [];
    urls = activity_attachments.map((item) => {
      item.url;
    });
    wx.previewImage({
      urls,
      current: activity_attachments[e.detail.index].url,
    });
  },

  async uploadImage(file, index) {
    const { activity_attachments } = this.data;
    const [res, err] = await to(fileApi.uploadImage(file));
    if (res) {
      activity_attachments[index].status = "success";
      activity_attachments[index].width = res.width;
      activity_attachments[index].height = res.height;
      activity_attachments[index].attachment_url = res.url;
      activity_attachments[index].attachment_type = res.type;
      this.setData({
        activity_attachments,
      });
    }
  },

  /**
   * Lifecycle function--Called when page show
   */
  async onShow() {
    wx.onKeyboardHeightChange((res) => {
      this.setData({ keyboardHeight: res.height });
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
  },
  async publishActivity(e) {
    wx.showLoading({
      title: "发布中",
    });
    const {
      activity_title,
      time_locations,
      activity_attachments,
      activity_detail,
    } = this.data;
    const [res, err] = await to(
      activityApi.addActivity(
        activity_title,
        activity_detail,
        activity_attachments,
        time_locations
      )
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
    } else {
      wx.showToast({
        title: "发布成功",
      });
    }
  },
});
