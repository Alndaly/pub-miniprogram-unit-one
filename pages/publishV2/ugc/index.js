const chooseLocation = requirePlugin("chooseLocation");
const computedBehavior = require("miniprogram-computed").behavior;
import cache from "../../../utils/cache";
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
    go_top: false,
    keyboardHeight: 0,
    ugc_detail: null,
    submitCondition: 0,
    ugc_title: "",
    label_info: [],
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
    ugc_attachments: [],
    use_gpt: false,
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
          const { label_info } = _this.data;
          label_info.splice(index, 1);
          _this.setData({
            label_info,
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
    const referer = "Unit One"; //调用插件的app的名称
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
    this.setData({
      ugc_detail: e.detail.html,
    });
  },

  onChangeAiStatus(e) {
    this.setData({
      use_gpt: e.detail,
    });
  },

  async uploadImage(type, file, index) {
    const { ugc_attachments } = this.data;
    const [res, err] = await to(fileApi.uploadImage(file));
    if (res) {
      ugc_attachments[index].height = res.height;
      ugc_attachments[index].width = res.width;
      ugc_attachments[index].status = "success";
      ugc_attachments[index].attachment_url = res.url;
      ugc_attachments[index].attachment_type = res.type;
      this.setData({
        ugc_attachments,
      });
    }
  },

  async afterRead(e) {
    let fileList = e.detail.file;
    const { ugc_attachments } = this.data;
    fileList = fileList.map((item) => {
      return {
        ...item,
        status: "uploading",
      };
    });
    let uploadTasks = [];
    this.setData({
      ugc_attachments: [...ugc_attachments, ...fileList],
    });
    uploadTasks = fileList.map((item, index) => {
      return this.uploadImage("ugc", item, ugc_attachments.length + index);
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
    const { ugc_attachments } = this.data;
    wx.showModal({
      title: "提醒",
      content: "确定要删除这张照片吗？",
      cancelText: "取消",
      confirmText: "确定",
      success: (res) => {
        if (res.confirm) {
          ugc_attachments.splice(e.detail.index, 1);
          this.setData({
            ugc_attachments,
          });
        }
      },
    });
  },

  viewImage(e) {
    const { ugc_attachments } = this.data;
    let urls = [];
    urls = ugc_attachments.map((item) => {
      item.url;
    });
    wx.previewImage({
      urls,
      current: ugc_attachments[e.detail.index].url,
    });
  },

  uploadOverSize(e) {
    wx.showToast({
      title: "图片大小不能超过20MB",
      icon: "none",
    });
  },

  onSaveDraft() {
    const data = {
      ugc_title: this.data.ugc_title,
      ugc_detail: this.data.ugc_detail,
      location: this.data.location,
      label_info: this.data.label_info,
      ugc_attachments: this.data.ugc_attachments,
      anonymous: false,
      use_gpt: this.data.use_gpt,
    };
    cache.set("temp_publish", JSON.stringify(data));
    wx.showToast({
      title: "保存成功，下次进入发布页会自动加载当前内容。",
      icon: "none",
    });
  },

  /**
   * 发布帖子
   */
  async publishUgc() {
    if (this.submitCondition === 1) return;
    await subscribeNotify([
      "EC-BKxpWTEdEBLNdMCvphbJaqRLFl8Ehok6xX9g5ZxI",
      "LzeRLb2idVMGSMygd0YcCeVs-zQDENaqM7-RrTgGcpk",
    ]);
    wx.showLoading({
      title: "发布中",
    });
    this.setData({
      submitCondition: 1,
    });
    let data = {
      title: this.data.ugc_title,
      content: this.data.ugc_detail,
      location: this.data.location,
      attachments: this.data.ugc_attachments,
      anonymous: false,
      go_top: this.data.go_top,
      use_gpt: this.data.use_gpt,
      label_info: this.data.label_info,
    };
    let [res, err] = await to(ugcApi.publishUgc(data));
    if (err) {
      wx.showToast({
        title: err?.data?.message || "出错啦",
        icon: "error",
      });
      this.setData({
        submitCondition: 0,
      });
      return;
    }
    wx.showToast({
      title: "发布成功",
    });
    this.setData({
      submitCondition: 0,
    });
    cache.remove("temp_publish");
    await timeUtils.sleep(500);
    wx.$router.push("/pages/home/index");
    await timeUtils.sleep(500);
    var pages = getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    currentPage.setData({
      refresherTriggered: true,
    });
  },

  async onPublish() {
    await this.publishUgc();
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    // 如果暂存了发布，那么读取暂存的数据
    if (cache.get("temp_publish")) {
      this.loadTempPublush();
    }
    // 获取右上角胶囊位置
    const res_head_btn = wx.getMenuButtonBoundingClientRect();
    this.setData({
      back_btn_top: res_head_btn.top,
      back_btn_left: wx.getSystemInfoSync().windowWidth - res_head_btn.right,
      back_btn_height: res_head_btn.height,
      back_btn_width: res_head_btn.width,
    });
  },

  loadTempPublush(e) {
    const {
      ugc_attachments,
      label_info,
      ugc_title,
      location,
      ugc_detail,
      use_gpt,
    } = JSON.parse(cache.get("temp_publish"));
    this.setData({
      ugc_attachments,
      label_info,
      ugc_title,
      ugc_detail,
      location,
      use_gpt,
    });
    wx.createSelectorQuery()
      .select("#ugc-editor")
      .context(function (res) {
        res.context.setContents({
          html: ugc_detail,
        });
      })
      .exec();
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
    const { label_info } = this.data;
    let findSame = false;
    label_info.forEach((item, index) => {
      if (item.id == e.currentTarget.dataset.label.id) {
        findSame = true;
        return;
      }
    });
    if (findSame) {
      this.onCloseLabel();
      return;
    }
    label_info.push(e.currentTarget.dataset.label);
    this.setData({
      label_info,
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
});
