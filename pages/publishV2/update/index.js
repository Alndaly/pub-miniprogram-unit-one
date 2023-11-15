import { _ } from "../../../utils/underscore-min";
import postApi from "../../../api/post";
import labelApi from "../../../api/label";
import userApi from "../../../api/user";
import fileApi from "../../../api/file";
import { to } from "../../../utils/util";

Page({
  /**
   * Page initial data
   */
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

  async onShow(e) {
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

  async onLoad(options) {
    wx.showLoading({
      title: "加载中",
    });
    this.setData({
      options,
    });
    const [resPost, errPost] = await to(postApi.getPostDetail(options.id));
    if (errPost) {
      wx.showToast({
        title: errPost.data,
        icon: "error",
      });
      return;
    }
    const { title, attachmentInfoList, labelInfoList, content } = resPost.data;
    this.setData({
      title,
      attachmentInfoList,
      labelInfoList,
      content,
    });
    wx.createSelectorQuery()
      .select("#ugc-editor")
      .context(function (res) {
        res.context.setContents({
          html: content,
        });
      })
      .exec();
    wx.hideLoading();
  },

  // 输入内容
  inputPostContent(e) {
    this.setData({
      content: e.detail.html,
    });
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

  uploadOverSize(e) {
    wx.showToast({
      title: "图片大小不能超过20MB",
      icon: "none",
    });
  },

  async onUpdatePost(e) {
    this.setData({
      publishStatus: true,
    });
    const {
      options: { id },
      title,
      content,
      attachmentInfoList,
      labelInfoList,
    } = this.data;
    const [res, err] = await to(
      postApi.updatePost(id, title, content, attachmentInfoList, labelInfoList)
    );
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      this.setData({
        publishStatus: false,
      });
      return;
    }
    this.setData({
      publishStatus: false,
    });
    wx.showToast({
      title: '更新成功',
    })
  },
});
