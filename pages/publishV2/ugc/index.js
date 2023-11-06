import { _ } from "../../../utils/underscore-min";
import postApi from "../../../api/post";
import labelApi from "../../../api/label";
import fileApi from "../../../api/file";
import { to } from "../../../utils/util";

Page({
  data: {
    keyboardHeight: 0,
    content: null,
    title: "",
    showLabelPopup: false,
    showAddLabelButton: false,
    isLabelLoading: false,
    labelRefresherTriggered: false,
    attachmentInfoList: [],
    labelPageNum: 0,
    labels: null,
    labelInfoList: [],
    publishStatus: false,
  },

  onHideLabelPopup() {
    this.setData({
      showLabelPopup: false,
    });
  },

  onShowLabelPopup(e) {
    this.setData({
      showLabelPopup: true,
      labelSearchInputFocus: true,
    });
  },

  // 输入内容
  inputPostContent(e) {
    this.setData({
      content: e.detail.html,
    });
  },

  async uploadImage(file, index) {
    const { attachmentInfoList } = this.data;
    return new Promise((resolve, reject) => {
      fileApi
        .uploadImage(file.thumb)
        .then((res) => {
          wx.getImageInfo({
            src: file.thumb,
          })
            .then((res_image) => {
              attachmentInfoList[index].status = "success";
              attachmentInfoList[index].url = res;
              attachmentInfoList[index].width = res_image.width;
              attachmentInfoList[index].height = res_image.height;
              this.setData({
                attachmentInfoList,
              });
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => reject(err));
    });
  },

  async afterRead(e) {
    let fileList = e.detail.file;
    const { attachmentInfoList } = this.data;
    fileList = fileList.map((item) => {
      return {
        ...item,
        status: "uploading",
      };
    });
    let uploadTasks = [];
    this.setData({
      attachmentInfoList: [...attachmentInfoList, ...fileList],
    });
    uploadTasks = fileList.map((item, index) => {
      return this.uploadImage(item, attachmentInfoList.length + index);
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
    const { attachmentInfoList } = this.data;
    wx.showModal({
      title: "提醒",
      content: "确定要删除这张照片吗？",
      cancelText: "取消",
      confirmText: "确定",
      success: (res) => {
        if (res.confirm) {
          attachmentInfoList.splice(e.detail.index, 1);
          this.setData({
            attachmentInfoList,
          });
        }
      },
    });
  },

  viewImage(e) {
    const { attachmentInfoList } = this.data;
    let urls = [];
    urls = attachmentInfoList.map((item) => {
      item.thumb;
    });
    wx.previewImage({
      urls,
      current: attachmentInfoList[e.detail.index].thumb,
    });
  },

  uploadOverSize(e) {
    wx.showToast({
      title: "图片大小不能超过20MB",
      icon: "none",
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    // 获取右上角胶囊位置
    const res_head_btn = wx.getMenuButtonBoundingClientRect();
    this.setData({
      back_btn_top: res_head_btn.top,
      back_btn_left: wx.getSystemInfoSync().windowWidth - res_head_btn.right,
      back_btn_height: res_head_btn.height,
      back_btn_width: res_head_btn.width,
    });
  },

  onDeleteLabel(e) {
    const _this = this;
    const { label, index } = e.currentTarget.dataset;
    wx.showModal({
      title: "提醒",
      content: `确认删除标签${label.title}吗？`,
      complete: (res) => {
        if (res.confirm) {
          const { labelInfoList } = _this.data;
          labelInfoList.splice(index, 1);
          _this.setData({
            labelInfoList,
          });
        }
      },
    });
  },

  onAddLabel(e) {
    const { labelInfoList } = this.data;
    labelInfoList.push(e.currentTarget.dataset.label);
    this.setData({ labelInfoList, showLabelPopup: false });
  },

  async onPublishPost(e) {
    this.setData({
      publishStatus: true,
    });
    const { labelInfoList, attachmentInfoList, title, content } = this.data;
    const [res, err] = await to(
      postApi.addPost(title, content, attachmentInfoList, labelInfoList)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        sendingStatus: false,
      });
      return;
    }
    this.setData({
      publishStatus: true,
    });
    wx.showToast({
      title: "发布成功",
    });
  },

  async onAddNewLabel(e) {
    wx.showLoading({
      title: "稍等哦",
    });
    const { labelKeyword } = this.data;
    const [res, err] = await to(labelApi.addNewLabel(labelKeyword));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    wx.showToast({
      title: "增加成功",
    });
    this.setData({
      labelRefresherTriggered: true,
    });
  },

  async onNextLabelPage(e) {
    this.setData({
      isLabelLoading: true,
    });
    const { labels, labelPageNum, labelKeyword } = this.data;
    const [res, err] = await to(
      labelApi.getLabels(labelKeyword, labelPageNum + 1)
    );
    if (err) {
      this.setData({
        isLabelLoading: false,
      });
      return;
    }
    this.setData({
      labels: {
        ...res.data,
        content: [...labels.content, ...res.data.content],
      },
      labelPageNum:
        res.data.content.length > 0 ? labelPageNum + 1 : labelPageNum,
      isLabelLoading: false,
    });
  },

  onReady() {
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
    });
  },

  /**
   * Lifecycle function--Called when page show
   */
  async onShow() {
    wx.onKeyboardHeightChange((res) => {
      this.setData({ keyboardHeight: res.height });
    });
    const [res_labels, err_labels] = await to(labelApi.getLabels("", 0));
    const [res_label_exist, err_label_exist] = await to(
      labelApi.checkLabelExistStatus("", 0)
    );
    if (err_labels || err_label_exist) {
      wx.showToast({
        title: "获取标签失败",
        icon: "error",
      });
      return;
    }
    this.setData({
      labelKeywordExistStatus: res_label_exist.data,
      labels: res_labels.data,
    });
  },

  onChangeLabelSearchKey() {
    this.setData({
      labelRefresherTriggered: true,
    });
  },

  async onLabelRefresh() {
    const { labelKeyword } = this.data;
    this.setData({
      labelRefresherTriggered: true,
      labelPageNum: 0,
    });
    const [res_labels, err_labels] = await to(
      labelApi.getLabels(labelKeyword, 0)
    );
    const [res_label_exist, err_label_exist] = await to(
      labelApi.checkLabelExistStatus(labelKeyword, 0)
    );
    if (err_labels || err_label_exist) {
      wx.showToast({
        title: "获取标签失败",
        icon: "error",
      });
      this.setData({
        labelRefresherTriggered: false,
      });
      return;
    }
    this.setData({
      labelRefresherTriggered: false,
      labelKeywordExistStatus: res_label_exist.data,
      labels: res_labels.data,
    });
  },
});
