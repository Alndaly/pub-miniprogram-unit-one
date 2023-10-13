const computedBehavior = require("miniprogram-computed").behavior;
import treeHoleApi from "../../../api/treeHole";
import timeUtils from "../../../utils/time";
import { to } from "../../../utils/util";

Page({
  behaviors: [computedBehavior],
  options: {
    multipleSlots: true,
  },
  computed: {
    differTime(data) {
      let differ = "";
      if (data.tree_hole.update_time) {
        differ = timeUtils.differTime(data.tree_hole.update_time);
      }
      return differ;
    },
  },
  /**
   * Page initial data
   */
  data: {
    focus_comment_input: false,
    isLoading: false,
    tree_hole: {},
    tree_hole_comment: {
      list: [],
      total_size: 0,
    },
    page_num: 0,
    inputBottom: 0,
    topComment: {
      id: -1,
    },
    currentComment: {
      id: -1,
    },
  },

  onFocusCommentToCommentInput(e) {
    this.setData({
      topComment: e.detail.topComment,
      currentComment: e.detail.currentComment,
      focus_comment_input: true,
    });
  },

  async onSubmitCommentResult(e) {
    const { options } = this.data;
    const [res_tree_hole, err_tree_hole] = await to(
      treeHoleApi.getTreeHoleDetail(options.tree_hole_id)
    );
    const [res, err] = await to(
      treeHoleApi.getTreeHoleCommentList(
        options.tree_hole_id,
        0,
        10,
        "create_time"
      )
    );
    if (err || err_tree_hole) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      tree_hole: res_tree_hole.data.data,
      tree_hole_comment: res.data.data,
    });
  },

  viewImage(e) {
    const { tree_hole } = this.data;
    const { attachment } = e.currentTarget.dataset;
    wx.previewImage({
      urls: tree_hole.attachments.map((item) => item.link),
      current: attachment.link,
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
    const [res, err] = await to(
      treeHoleApi.getTreeHoleDetail(options.tree_hole_id)
    );
    const [res_comment, err_comment] = await to(
      treeHoleApi.getTreeHoleCommentList(
        options.tree_hole_id,
        0,
        10,
        "create_time"
      )
    );
    const [res_identity, err_identity] = await to(
      treeHoleApi.getAnonymousIdentity()
    );
    if (err_identity) {
      wx.showToast({
        title: err_identity.data.message,
        icon: "error",
      });
    } else {
      this.setData({
        identity: res_identity.data.data,
      });
    }
    if (err || err_comment) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    wx.hideLoading();
    this.setData({
      tree_hole: res.data.data,
      tree_hole_comment: res_comment.data.data,
    });
  },

  updatePosition(inputBottom) {
    this.setData({ inputBottom });
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    wx.onKeyboardHeightChange((res) => {
      this.updatePosition(res.height);
    });
  },

  /**
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    wx.showLoading({
      title: "加载中",
    });
    const { options } = this.data;
    const [res, err] = await to(
      treeHoleApi.getTreeHoleDetail(options.tree_hole_id)
    );
    const [res_comment, err_comment] = await to(
      treeHoleApi.getTreeHoleCommentList(
        options.tree_hole_id,
        0,
        10,
        "create_time"
      )
    );
    if (err || err_comment) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      page_num: 0,
      tree_hole: res.data.data,
      tree_hole_comment: res_comment.data.data,
    });
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * Called when page reach bottom
   */
  async onReachBottom() {
    this.setData({
      isLoading: true,
    });
    const { options, page_num, tree_hole_comment } = this.data;
    const [res, err] = await to(
      treeHoleApi.getTreeHoleCommentList(
        options.tree_hole_id,
        page_num + 1,
        10,
        "create_time"
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
      isLoading: false,
      page_num: page_num + 1,
      tree_hole_comment: {
        list: [...tree_hole_comment.list, ...res.data.data.list],
        total_size: res.data.data.total_size,
      },
    });
  },
});
