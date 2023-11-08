import postApi from "../../../api/post";
import { to } from "../../../utils/util";
import { _ } from "../../../utils/underscore-min";
import labelApi from "../../../api/label";

Page({
  data: {
    inputBottom: 0,
    pageNum: 0,
    label_info: {},
    refresherTriggered: false,
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
      this.setData({
        inputBottom: res.height,
      });
    });
  },

  goBack(e) {
    wx.$router.back();
  },

  async onLoad(options) {
    this.setData({
      options: options,
      refresherTriggered: true,
    });
  },

  async onRefresh(options) {
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(
      postApi.searchLabelPost(this.data.options.label_id, "", 0)
    );
    const [res_label, err_label] = await to(
      labelApi.getLabelInfo(this.data.options.label_id)
    );
    this.setData({
      label_info: res_label.data,
      postList: res.data,
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
      postApi.searchLabelPost(
        this.data.options.label_id,
        "",
        this.data.pageNum + 1
      )
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "none",
      });
      return;
    }
    const postListNext = res.data;
    this.setData({
      postList: {
        ...res.data,
        content: [...this.data.postList.content, ...postListNext.content],
      },
      pageNum:
        res.data.content.length > 0 ? this.data.pageNum + 1 : this.data.pageNum,
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
