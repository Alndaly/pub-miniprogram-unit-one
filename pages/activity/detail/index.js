// pages/activity/detail/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import activityApi from "../../../api/activity";
import { _ } from "../../../utils/underscore-min";
import timeUtils from "../../../utils/time";
import { to } from "../../../utils/util";

Page({
  data: {
    order_by: "create_time",
    page: 0,
    inputBottom: 0,
    parent: {
      id: -1,
    },
    activityLocationTimeUser: { list: [], total_size: 0 },
    joinLocationTimeUser: { list: [], total_size: 0 },
  },
  behaviors: [computedBehavior],
  computed: {
    differTime(data) {
      if (data?.activity?.update_time) {
        return timeUtils.differTime(data.activity.update_time);
      }
    },
    barBlur(data) {
      if (data.scrollTop) {
        return data.scrollTop / 200 >= 20 ? 20 : data.scrollTop / 200;
      } else {
        return 0;
      }
    },
  },

  viewImage(e) {
    const { activity } = this.data;
    const { current } = e.currentTarget.dataset;
    wx.previewImage({
      urls: activity.attachments.map((item) => item.link),
      current: current,
    });
  },

  goUserInfo(e) {
    const { activity } = this.data;
    wx.$router.push(`/pages/userInfo/index`, {
      user_id: activity.user_info.id,
    });
  },

  updatePosition(inputBottom) {
    this.setData({ inputBottom });
  },

  async onSubscribeResult(e) {
    const { options } = this.data;
    const { type } = e.detail;
    if (type === "join") {
      const [
        res_join_location_time_user,
        err_join_location_time_user,
      ] = await to(
        activityApi.getActivityTimeLocation("join", options.activity_id)
      );
      if (err_join_location_time_user) {
        wx.showToast({
          title: "出错啦",
          icon: "error",
        });
        return;
      }
      this.setData({
        joinLocationTimeUser: res_join_location_time_user.data.data,
      });
    } else if (type === "activity") {
      const [
        res_activity_location_time_user,
        err_activity_location_time_user,
      ] = await to(
        activityApi.getActivityTimeLocation("activity", options.activity_id)
      );
      if (err_activity_location_time_user) {
        wx.showToast({
          title: "出错啦",
          icon: "error",
        });
        return;
      }
      this.setData({
        activityLocationTimeUser: res_activity_location_time_user.data.data,
      });
    }
    wx.hideLoading();
  },

  // 接收到评论组件返回的成功信号
  async onSubmitCommentResult(e) {
    if (e.detail.res.data.code != "20000") {
      return;
    }
    let [resActivityCommentList, errActivityCommentList] = await to(
      activityApi.getActivityComment(this.data.activity.id, 0)
    );
    this.setData({
      activityCommentList: resActivityCommentList.data.data,
      "activity.comment": this.data.activity.comment + 1,
    });
  },

  toLocation(e) {
    const { location } = e.currentTarget.dataset;
    wx.openLocation({
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
    });
  },

  // 点击ugc的「评论图标」后聚焦到评论框
  async focusCommentInput(e) {
    this.setData({
      focus_input: true,
    });
  },

  // 点击ugc的评论的评论图标后聚焦到评论框
  async focusCommentToCommentInput(e) {
    this.setData({
      parent: e.detail,
      focus_input: true,
    });
  },

  // 根据页面滑动情况改变顶部栏透明度
  // 此处增加防抖和节流以提升性能
  onPageScroll: _.throttle(function (options) {
    this.setData({
      scrollTop: options.scrollTop,
    });
  }, 50),

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    // 获取右上角胶囊位置
    const res_head_btn = wx.getMenuButtonBoundingClientRect();
    this.setData({
      back_btn_top: res_head_btn.top,
      back_btn_left: wx.getSystemInfoSync().windowWidth - res_head_btn.right,
      back_btn_height: res_head_btn.height,
      back_btn_width: res_head_btn.width,
    });
    this.setData({
      options,
    });
    wx.showLoading({
      title: "加载中",
    });
    let [res, err] = await to(
      activityApi.getActivityDetail(options.activity_id)
    );
    let [res_list, err_list] = await to(activityApi.getAllActivities("", 0));
    let [res_comment, err_comment] = await to(
      activityApi.getActivityComment(options.activity_id, 0)
    );
    let [res_join_location_time_user, err_join_location_time_user] = await to(
      activityApi.getActivityTimeLocation("join", options.activity_id)
    );
    let [
      res_activity_location_time_user,
      err_activity_location_time_user,
    ] = await to(
      activityApi.getActivityTimeLocation("activity", options.activity_id)
    );
    if (
      err ||
      err_list ||
      err_comment ||
      err_join_location_time_user ||
      err_activity_location_time_user
    ) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      activity: res.data.data,
      moreActivity: res_list.data.data,
      activityCommentList: res_comment.data.data,
      activityLocationTimeUser: res_activity_location_time_user.data.data,
      joinLocationTimeUser: res_join_location_time_user.data.data,
    });
    wx.hideLoading();
  },

  goActivity(e) {
    const { activity } = e.currentTarget.dataset;
    wx.$router.push(`/pages/activity/detail/index`, {
      activity_id: activity.id,
    });
  },

  showMoreActivity(e) {
    wx.$router.push("/pages/activity/home/index");
  },

  goBack() {
    wx.$router.back();
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {
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
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow(e) {
    wx.onKeyboardHeightChange((res) => {
      this.updatePosition(res.height);
    });
  },

  /**
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    const { options } = this.data;
    wx.showLoading({
      title: "刷新中",
    });
    let [res, err] = await to(
      activityApi.getActivityDetail(options.activity_id)
    );
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
    } else {
      this.setData({
        activity: res.data.data,
      });
    }
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {
    let title = this.data.activity.title;
    let imageUrl = this.data.activity.bg_image;
    let path = `pages/activity/detail/index?activity_id=${this.data.activity.id}`; // 分享后打开的页面
    return {
      imageUrl,
      title,
      path,
    };
  },
  
  onShareTimeline(e) {
    let title = this.data.activity.title;
    let query = `activity_id=${this.data.activity.id}`; // 分享后打开的页面
    return {
      title,
      query,
    };
  },
});
