// pages/labels/index.js
import labelApi from "../../api/label";
import { to } from "../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {
    isLoading: false,
    labelRefresherTriggered: false,
    labelKeyword: "",
    pageNum: 0,
    labels: null,
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
    });
    this.setData({
      labelRefresherTriggered: true,
    });
  },

  goLabelPage(e) {
    const { label } = e.currentTarget.dataset;
    wx.$router.push("/pages/wall/labelUgc/index", { label_id: label.id });
  },

  async onNextLabelPage() {
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
});
