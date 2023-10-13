const chooseLocation = requirePlugin("chooseLocation");
const computedBehavior = require("miniprogram-computed").behavior;
import { _ } from "../../../utils/underscore-min";
import plugins from "../../../configs/plugins";
import locationUtil from "../../../utils/location";
import { subscribeNotify } from "../../../utils/subscribe";
import userApi from "../../../api/user";
import fileApi from "../../../api/file";
import treeHoleApi from "../../../api/treeHole";
import { to } from "../../../utils/util";

Page({
  behaviors: [computedBehavior],
  computed: {},
  /**
   * Page initial data
   */
  data: {
    reGenerating: false,
    identity: {},
    label_info: [],
    keyboardHeight: 0,
    showLabelList: false,
    showAddLabelButton: false,
    tree_hole_detail: "",
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
    tree_hole_attachments: [],
    use_gpt: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    const [res, err] = await to(treeHoleApi.getAnonymousIdentity());
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "none",
      });
      return;
    }
    this.setData({
      identity: res.data.data,
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
        console.log("获取系统信息出错", res);
      },
    });
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    location &&
      this.setData({
        location,
      });
    const myUserInfo = await userApi.getMyUserInfo();
    this.setData({
      myUserInfo: myUserInfo.data.data,
      isLabelLoading: false,
    });
  },

  inputTreeHoleContent(e) {
    this.setData({
      tree_hole_detail: e.detail.html,
    });
  },

  async uploadImage(file, index) {
    const { tree_hole_attachments } = this.data;
    const [res, err] = await to(fileApi.uploadImage(file));
    if (res) {
      tree_hole_attachments[index].status = "success";
      tree_hole_attachments[index].height = res.height;
      tree_hole_attachments[index].width = res.width;
      tree_hole_attachments[index].attachment_url = res.url;
      tree_hole_attachments[index].attachment_type = res.type;
      this.setData({
        tree_hole_attachments,
      });
    }
  },

  async afterRead(e) {
    let fileList = e.detail.file;
    const { tree_hole_attachments } = this.data;
    fileList = fileList.map((item) => {
      return {
        ...item,
        status: "uploading",
      };
    });
    let uploadTasks = [];
    this.setData({
      tree_hole_attachments: [...tree_hole_attachments, ...fileList],
    });
    uploadTasks = fileList.map((item, index) => {
      return this.uploadImage(item, tree_hole_attachments.length + index);
    });
    Promise.all(uploadTasks)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // 删除附件
  delAttachment(e) {
    const { tree_hole_attachments } = this.data;
    wx.showModal({
      title: "提醒",
      content: "确定要删除这张照片吗？",
      cancelText: "取消",
      confirmText: "确定",
      success: (res) => {
        if (res.confirm) {
          tree_hole_attachments.splice(e.detail.index, 1);
          this.setData({
            tree_hole_attachments,
          });
        }
      },
    });
  },

  viewImage(e) {
    const { tree_hole_attachments } = this.data;
    let urls = [];
    urls = tree_hole_attachments.map((item) => {
      item.url;
    });
    wx.previewImage({
      urls,
      current: tree_hole_attachments[e.detail.index].url,
    });
  },

  uploadOverSize(e) {
    wx.showToast({
      title: "图片大小不能超过20MB",
      icon: "none",
    });
  },

  async reGenerateIdentity(e) {
    if (this.data.reGenerating) {
      return;
    }
    this.setData({
      reGenerating: true,
    });
    const [res, err] = await to(treeHoleApi.reGenerateAnonymousIdentity());
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "none",
      });
      this.setData({
        reGenerating: false,
      });
      return;
    }
    this.setData({
      identity: res.data.data,
      reGenerating: false,
    });
  },

  changeIdentity(e) {
    this.setData({
      showChangeIdentityPopUp: true,
    });
  },

  /**
   * 发布树洞
   */
  async publishTreeHole() {
    const {
      tree_hole_detail,
      tree_hole_attachments,
      use_gpt,
      identity,
    } = this.data;
    if (this.submitCondition === 1) return;
    // 申请订阅通知权限
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
    let [res, err] = await to(
      treeHoleApi.addTreeHole(tree_hole_detail, tree_hole_attachments, use_gpt)
    );
    if (err) {
      wx.showToast({
        title: err?.data?.message || "出错啦",
        icon: "error",
      });
      return;
    }
    console.log("发布接口返回：", res);
    wx.showToast({
      title: "发布成功",
    });
    this.setData({
      submitCondition: 0,
    });
  },

  onTreeHoleEditorReady() {
    const _this = this;
    const query = wx.createSelectorQuery(); //创建节点查询器
    query.in(this).select("#tree-hole-editor").context(); //选择id=editor的节点，获取节点内容信息
    query.exec(function (res) {
      _this.editorCtx = res[0].context;
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

  onChangeAiStatus(e) {
    this.setData({
      use_gpt: e.detail,
    });
  },
});
