const chooseLocation = requirePlugin("chooseLocation");
const computedBehavior = require("miniprogram-computed").behavior;
import { _ } from "../../../utils/underscore-min";
import plugins from "../../../configs/plugins";
import locationUtil from "../../../utils/location";
import { subscribeNotify } from "../../../utils/subscribe";
import ugcApi from "../../../api/ugc";
import labelApi from "../../../api/label";
import userApi from "../../../api/user";
import fileApi from "../../../api/file";
import { to } from "../../../utils/util";
import timeUtils from "../../../utils/time";

Page({
  behaviors: [computedBehavior],
  computed: {},
  /**
   * Page initial data
   */
  data: {
    keyboardHeight: 0,
    submitCondition: 0,
    showLabelList: false,
    showAddLabelButton: false,
    labelData: {
      label_list: {
        list: [],
        total_size: 0,
      },
      name_exist: true,
    },
    isLabelLoading: false,
    label_search_key: "",
    label_page: 0,
    labelRefresherTriggered: false,
  },

  deleteLabel(e) {
    const _this = this;
    const { label, index } = e.currentTarget.dataset;
    wx.showModal({
      title: "提醒",
      content: "确认删除这一标签吗？",
      complete: (res) => {
        if (res.cancel) {
        }
        if (res.confirm) {
          const { ugc } = _this.data;
          ugc.label_info.splice(index, 1);
          _this.setData({
            ugc,
          });
        }
      },
    });
  },

  onUgcEditorReady() {
    const _this = this;
    const query = wx.createSelectorQuery(); //创建节点查询器
    query.in(this).select("#ugc-editor").context(); //选择id=editor的节点，获取节点内容信息
    query.exec(function (res) {
      _this.editorCtx = res[0].context;
    });
  },

  async showLabelPopup(e) {
    this.setData({
      showLabelList: true,
      labelSearchInputFocus: true,
    });
  },

  async addNewLabel(e) {
    wx.showLoading({
      title: "稍等哦",
    });
    const { label_search_key } = this.data;
    const [res, err] = await to(labelApi.addNewLabel(label_search_key));
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

  onCloseLabel(e) {
    this.setData({
      showLabelList: false,
    });
  },

  async getLocation(e) {
    const key = plugins.PLUGIN_MAP_KEY; //使用在腾讯位置服务申请的key
    const referer = "校嘟嘟"; //调用插件的app的名称
    let [res, err] = await to(locationUtil.getLocation());
    if (err) {
      wx.showToast({
        title: "请先通过右上角三点，选取【设置】打开地理权限",
        icon: "none",
      });
      return;
    }
    const location = JSON.stringify({
      latitude: res.latitude,
      longitude: res.longitude,
    });
    wx.$router.push(`plugin://chooseLocation/index`, {
      key,
      referer,
      location,
    });
  },

  // 输入内容
  inputUgcContent(e) {
    const { ugc } = this.data;
    ugc.content = e.detail.html;
    this.setData({
      ugc,
    });
  },

  onChangeAiStatus(e) {
    const { ugc } = this.data;
    ugc.use_gpt = e.detail;
    this.setData({
      ugc,
    });
  },

  async uploadImage(file, index) {
    const { ugc } = this.data;
    const [res, err] = await to(fileApi.uploadImage(file));
    ugc.attachments[index].status = "success";
    ugc.attachments[index].height = res.height;
    ugc.attachments[index].width = res.width;
    ugc.attachments[index].attachment_url = res.url;
    ugc.attachments[index].attachment_type = res.type;
    this.setData({
      ugc,
    });
  },

  async afterRead(e) {
    let fileList = e.detail.file;
    const { ugc } = this.data;
    const origin_attachments_length = ugc.attachments.length;
    fileList = fileList.map((item) => {
      return {
        ...item,
        status: "uploading",
      };
    });
    let uploadTasks = [];
    ugc.attachments = [...ugc.attachments, ...fileList];
    this.setData({
      ugc,
    });
    uploadTasks = fileList.map((item, index) => {
      return this.uploadImage(item, origin_attachments_length + index);
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
    const { ugc } = this.data;
    wx.showModal({
      title: "提醒",
      content: "确定要删除这张照片吗？",
      cancelText: "取消",
      confirmText: "确定",
      success: (res) => {
        if (res.confirm) {
          ugc.attachments.splice(e.detail.index, 1);
          this.setData({
            ugc,
          });
        }
      },
    });
  },

  viewImage(e) {
    const { ugc } = this.data;
    let urls = [];
    urls = ugc.attachments.map((item) => {
      item.url;
    });
    wx.previewImage({
      urls,
      current: ugc.attachments[e.detail.index].url,
    });
  },

  uploadOverSize(e) {
    wx.showToast({
      title: "图片大小不能超过20MB",
      icon: "none",
    });
  },

  /**
   * Lifecycle function--Called when page show
   */
  async onShow() {
    wx.onKeyboardHeightChange((res) => {
      this.setData({ keyboardHeight: res.height });
    });
    this.setData({
      isLabelLoading: true,
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
    const { label_search_key } = this.data;
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    location &&
      this.setData({
        location,
      });
    let res_label = await ugcApi.getLabelData(label_search_key, 0, 20);
    const myUserInfo = await userApi.getMyUserInfo();
    this.setData({
      myUserInfo: myUserInfo.data.data,
      labelData: res_label.data.data,
      isLabelLoading: false,
    });
  },

  async onLabelRefresh() {
    const { label_search_key } = this.data;
    this.setData({
      showAddLabelButton: false,
      labelRefresherTriggered: true,
      label_page: 0,
    });
    const [res_label, err_label] = await to(
      ugcApi.getLabelData(label_search_key, 0, 20)
    );
    if (err_label) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        labelRefresherTriggered: false,
      });
      return;
    }
    this.setData({
      labelData: res_label.data.data,
      labelRefresherTriggered: false,
    });
    if (res_label.data.data.total_size === 0) {
      this.setData({
        showAddLabelButton: true,
      });
    }
  },

  onChangeLabelSearchKey: _.throttle(function (options) {
    const { label_search_key } = this.data;
    this.setData({
      labelRefresherTriggered: true,
      showAddLabelButton: false,
    });
    ugcApi
      .getLabelData(label_search_key, 0)
      .then((value) => {
        this.setData({
          labelData: value.data.data,
          labelRefresherTriggered: false,
        });
        if (value.data.data.total_size === 0) {
          // 如果搜索不到标签，那么允许用户增加新标签
          this.setData({
            showAddLabelButton: true,
          });
        }
      })
      .catch((err) => {
        wx.showToast({
          title: "出错啦",
          icon: "error",
        });
        this.setData({
          labelRefresherTriggered: false,
        });
      });
  }, 500),

  addLabel(e) {
    const { ugc } = this.data;
    let findSame = false;
    ugc.label_info.forEach((item, index) => {
      if (item.id == e.currentTarget.dataset.label.id) {
        findSame = true;
        return;
      }
    });
    if (findSame) {
      this.onCloseLabel();
      return;
    }
    ugc.label_info.push(e.currentTarget.dataset.label);
    this.setData({
      ugc,
    });
    this.onCloseLabel();
  },

  finishLabelChoose(e) {
    this.setData({
      showLabelList: false,
      labelSearchInputFocus: false,
    });
  },

  async onNextLabelPage() {
    this.setData({
      isLabelLoading: true,
    });
    const { labelData, label_page, label_search_key } = this.data;
    const [res_label, err_label] = await to(
      ugcApi.getLabelData(label_search_key, label_page + 1, 20)
    );
    if (err_label) {
      this.setData({
        isLabelLoading: false,
      });
      return;
    }
    this.setData({
      labelData: {
        label_list: {
          list: [
            ...labelData.label_list.list,
            ...res_label.data.data.label_list.list,
          ],
          total_size: res_label.data.data.label_list.total_size,
        },
        name_exist: res_label.data.data.name_exist,
      },
      label_page: label_page + 1,
      isLabelLoading: false,
    });
  },

  inputUgcTitle(e) {
    const { ugc } = this.data;
    ugc.title = e.detail.value;
    this.setData({
      ugc,
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    wx.showLoading({
      title: "加载中",
    });
    this.setData({
      options,
    });
    const [res_ugc_detail, err_ugc_detail] = await to(
      ugcApi.getUgcDetail(options.id)
    );
    if (err_ugc_detail) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      ugc: {
        ...res_ugc_detail.data.data,
        attachments: res_ugc_detail.data.data.attachments.map((item) => {
          return {
            ...item,
            url: item.link,
            attachment_type: item.type,
            attachment_url: item.link,
          };
        }),
      },
      location: res_ugc_detail.data.data.location,
    });
    wx.createSelectorQuery()
      .select("#ugc-editor")
      .context(function (res) {
        res.context.setContents({
          html: res_ugc_detail.data.data.content,
        });
      })
      .exec();
    wx.hideLoading();
  },

  async onUpdate(e) {
    if (this.submitCondition === 1) return;
    await subscribeNotify([
      "EC-BKxpWTEdEBLNdMCvphbJaqRLFl8Ehok6xX9g5ZxI",
      "LzeRLb2idVMGSMygd0YcCeVs-zQDENaqM7-RrTgGcpk",
    ]);
    wx.showLoading({
      title: "提交中",
    });
    this.setData({
      submitCondition: 1,
    });
    const { ugc, location } = this.data;
    const [res, err] = await to(
      ugcApi.updateMyUgc({
        ...ugc,
        location,
      })
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        submitCondition: 0,
      });
      return;
    }
    wx.showToast({
      title: "更新成功",
    });
    await timeUtils.sleep(500);
    wx.$router.push("/pages/home/index");
  },
});
