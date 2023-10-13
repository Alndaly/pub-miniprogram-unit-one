import ugcApi from "../../../api/ugc";
import { to } from "../../../utils/util";
import { _ } from "../../../utils/underscore-min";
import labelApi from "../../../api/label";

Page({
  data: {
    inputBottom: 0,
    page: 0,
    label_info: {},
    // barOpacity是顶部的透明度
    barOpacity: 0,
    refresherTriggered: false,
  },

  // ugc成功删除事件
  onFinishDleteUgc(e) {
    console.log("删除的帖子在列表中的序号: ", e.detail);
    const list = this.data.ugcList.list;
    const delUgc = list.splice(e.detail.index, 1);
    console.log("删除的帖子: ", delUgc);
    this.setData({
      "ugcList.list": list,
    });
  },

  async goSearchPage() {
    await wx.$router.push("/pages/search/home/index");
  },

  onShow(options) {
    try {
      if (typeof this.getTabBar === "function" && this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0,
          show: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
    wx.onKeyboardHeightChange((res) => {
      this.updatePosition(res.height);
    });
  },

  goBack(e) {
    wx.$router.back();
  },

  updatePosition(inputBottom) {
    this.setData({ inputBottom });
  },

  async onLoad(options) {
    this.setData({
      options: options,
    });
    this.setData({
      refresherTriggered: true,
    });
  },

  async onRefresh(options) {
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(
      ugcApi.searchLabelUgc("", this.data.options.label_id, "create_time", 0)
    );
    const [res_label, err_label] = await to(
      labelApi.getLabelInfo(this.data.options.label_id)
    );
    this.setData({
      label_info: res_label.data.data,
      ugcList: res.data.data,
    });
    if (err || err_label) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
    }
    this.setData({
      isLoading: false,
      refresherTriggered: false,
    });
  },

  async onNextPage() {
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(
      ugcApi.searchLabelUgc(
        "",
        this.data.options.label_id,
        "create_time",
        this.data.page + 1
      )
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "none",
      });
      return;
    }
    const ugcListNext = res.data.data;
    this.setData({
      "ugcList.list": [...this.data.ugcList.list, ...ugcListNext.list],
      page: res.data.data.list.length > 0 ? this.data.page + 1 : this.data.page,
      isLoading: false,
    });
  },

  // 用户点击分享的时候
  onShareAppMessage(e) {
    const title = this.data.label_info.title;
    const imageUrl = this.data.label_info.image
      ? this.data.label_info.image
      : "";
    const path = `pages/wall/labelUgc/index?label_id=${this.data.label_info.id}`; // 分享后打开的页面
    return {
      imageUrl,
      title,
      path,
    };
  },

  /**
   * 分享到朋友圈
   * @param {*} e
   */
  onShareTimeline(e) {
    let title = `大家都在讨论#${this.data.label_info.title}, 快来一起参与吧`;
    let query = `label_id=${this.data.label_info.id}`; // 分享后打开的页面
    return {
      title,
      query,
    };
  },
});
