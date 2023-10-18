// pages/myInfo/identity/verify/index.js
import { to } from "../../../../utils/util";
import fileApi from "../../../../api/file";
import userApi from "../../../../api/user";
import { _ } from "../../../../utils/underscore-min";
import organizationApi from "../../../../api/organization";
import timeUtils from "../../../../utils/time";
import { subscribeNotify } from "../../../../utils/subscribe";
import user from "../../../../api/user";

Page({
  /**
   * Page initial data
   */
  data: {
    isLoading: false,
    submitting: false,
    name: "",
    organizations_page_num: 0,
    organizationSearchInputFocus: false,
    organization_search_key: "",
    description: "",
    attachments: [],
    showOrganizationPopUp: false,
    organization: null,
    organizations: {
      list: [],
      total_size: 0,
    },
    organizationRefresherTriggered: false,
  },

  onShowOrganizationPopUp() {
    this.setData({
      showOrganizationPopUp: true,
    });
  },

  onChangeOrganizationSearchKey(e) {
    const { organization_search_key } = this.data;
    this.setData({
      organizationRefresherTriggered: true,
      organizations_page_num: 0,
    });
    organizationApi
      .getOrganizations(organization_search_key, 0, 10)
      .then((res) => {
        this.setData({
          organizationRefresherTriggered: false,
          organizations: res.data.data,
        });
      })
      .catch((err) => {
        wx.showToast({
          title: "出错啦",
          icon: "error",
        });
        this.setData({
          organizationRefresherTriggered: false,
        });
      });
  },

  async onOrganizationRefresh(e) {
    const { organization_search_key } = this.data;
    this.setData({
      organizationRefresherTriggered: true,
    });
    const [res, err] = await to(
      organizationApi.getOrganizations(organization_search_key, 0, 10)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        organizationRefresherTriggered: false,
      });
      return;
    }
    this.setData({
      organizations_page_num: 0,
      organizations: res.data.data,
      organizationRefresherTriggered: false,
    });
  },

  addOrganization(e) {
    wx.$router.push("/pages/organization/add/index");
  },

  choseOrganization(e) {
    const { organization } = e.currentTarget.dataset;
    this.setData({
      organization,
      showOrganizationPopUp: false,
    });
  },

  async onNextOrganizationPage(e) {
    const {
      organizations_page_num,
      organizations,
      organization_search_key,
    } = this.data;
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(
      organizationApi.getOrganizations(
        organization_search_key,
        organizations_page_num + 1,
        10
      )
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        isLoading: false,
      });
      return;
    }
    this.setData({
      organizations: {
        list: [...organizations.list, ...res.data.data.list],
        total_size: res.data.data.total_size,
      },
      isLoading: false,
      organizations_page_num: organizations_page_num + 1,
    });
  },

  async uploadImage(file, index) {
    const { attachments } = this.data;
    const [res, err] = await to(fileApi.uploadImage(file));
    attachments[index].status = "success";
    attachments[index].attachment_url = res.url;
    attachments[index].attachment_type = res.type;
    this.setData({
      attachments,
    });
  },

  async afterRead(e) {
    const { attachments } = this.data;
    let fileList = e.detail.file;
    fileList = fileList.map((item) => {
      return {
        ...item,
        status: "uploading",
      };
    });
    let uploadTasks = [];
    this.setData({
      attachments: [...attachments, ...fileList],
    });
    uploadTasks = fileList.map((item, index) => {
      return this.uploadImage(item, attachments.length + index);
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
    const { attachments } = this.data;
    wx.showModal({
      title: "提醒",
      content: "确定要删除这张照片吗？",
      cancelText: "取消",
      confirmText: "确定",
      success: (res) => {
        if (res.confirm) {
          attachments.splice(e.detail.index, 1);
          this.setData({
            attachments,
          });
        }
      },
    });
  },

  viewImage(e) {
    const { attachments } = this.data;
    const urls = attachments.map((item) => {
      item.url;
    });
    wx.previewImage({
      urls,
      current: attachments[e.detail.index].url,
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
    const { organization_search_key } = this.data;
    const [res, err] = await to(
      organizationApi.getOrganizations(organization_search_key, 0, 10)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      organizations: res.data.data,
    });
  },
  async onSubmit(e) {
    const {
      submitting,
      attachments,
      name,
      description,
      organization,
    } = this.data;
    if (submitting) {
      return;
    }
    this.setData({
      submitting: true,
    });
    const [res_subscribe, err_subscribe] = await subscribeNotify([
      "8oVc2ynsF7tZJAklFWqSe6jGOrPMcq3B1N_xyo_Udys",
    ]);
    wx.showLoading({
      title: "提交中",
    });
    const [res, err] = await to(
      userApi.addUserIdentity(organization.id, attachments, name, description)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    wx.showToast({
      title: "提交成功",
    });
    this.setData({
      submitting: false,
      showOrganizationPopUp: false,
    });
    await timeUtils.sleep(500);
    wx.$router.push("/pages/myInfo/identity/index/index");
  },
});
