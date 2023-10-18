// pages/organization/add/index.js
import { to } from "../../../utils/util";
import timeUtils from "../../../utils/time";
import organizationApi from "../../../api/organization";

Page({
  /**
   * Page initial data
   */
  data: {
    parent_organization: {
      id: -1,
    },
    name: "",
    description: "",
    organization_search_key: "",
    isLoading: false,
    organizations_page_num: 0,
    organizationRefresherTriggered: false,
    in_school: null,
    email: "",
    phone: "",
    showParentOrganizationPopUp: false,
    organizations: {
      list: [],
      total_size: 0,
    },
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

  onShowParentOrganizationPopUp(e) {
    this.setData({
      showParentOrganizationPopUp: true,
    });
  },

  choseParentOrganization(e) {
    const { organization } = e.currentTarget.dataset;
    this.setData({
      parent_organization: organization,
      showParentOrganizationPopUp: false,
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

  async addOrganization(e) {
    wx.showLoading({
      title: "提交中",
    });
    const {
      parent_organization,
      name,
      description,
      in_school,
      email,
      phone,
    } = this.data;
    const [res, err] = await to(
      organizationApi.addOrganization(
        parent_organization.id,
        name,
        description,
        in_school,
        email,
        phone
      )
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
    await timeUtils.sleep(500);
    wx.$router.back();
  },
});
