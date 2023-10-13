// pages/types/index.js
import ugcApi from "../../api/ugc";
import { to } from "../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {
    label_search_key: "",
    isLoading: false,
    labelRefresherTriggered: false,
    page_num: 0,
    label_list: {
      list: [],
      total_size: 0,
    },
  },

  onChangeLabelSearchKey(e) {
    const { label_search_key } = this.data;
    this.setData({
      labelRefresherTriggered: true,
    });
    ugcApi
      .getLabelData(label_search_key, 0, 20)
      .then((value) => {
        this.setData({
          label_list: value.data.data.label_list,
          labelRefresherTriggered: false,
          page_num: 0,
        });
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
        console.log("获取系统信息出错", res);
      },
    });
    wx.showLoading({
      title: "加载中",
    });
    let [res_label, err_label] = await to(ugcApi.getLabelData("", 0, 20));
    if (err_label) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      label_list: res_label.data.data.label_list,
    });
    wx.hideLoading();
  },

  goLabelPage(e) {
    const { label } = e.currentTarget.dataset;
    wx.$router.push("/pages/wall/labelUgc/index", { label_id: label.id });
  },

  async onLabelRefresh() {
    const { label_search_key } = this.data;
    let [res_label, err_label] = await to(
      ugcApi.getLabelData(label_search_key, 0, 20)
    );
    if (err_label) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      label_list: res_label.data.data.label_list,
      page_num: 0,
      labelRefresherTriggered: false,
    });
  },

  async onNextLabelPage() {
    const { page_num, label_list, label_search_key } = this.data;
    this.setData({
      isLoading: true,
    });
    let [res_label, err_label] = await to(
      ugcApi.getLabelData(label_search_key, page_num + 1, 20)
    );
    if (err_label) {
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
      label_list: {
        list: [...label_list.list, ...res_label.data.data.label_list.list],
        total_size: res_label.data.data.label_list.total_size,
      },
      page_num: page_num + 1,
      isLoading: false,
    });
  },
});
