// pages/myInfo/myActivity/index.js
import activityApi from "../../../api/activity";
import { to } from "../../../utils/util";
Page({
  /**
   * Page initial data
   */
  data: {
    page_num: 0,
    activities: {
      list: [],
      total_size: 0,
    },
  },

  async showOperate(e) {
    const { activity } = e.currentTarget.dataset;
    const [action_res, action_err] = await to(
      wx.showActionSheet({
        itemList: ["删除"],
      })
    );
    if (action_res.tapIndex === 0) {
      wx.showModal({
        title: "提示",
        content: "确认删除吗？",
        complete: async (res) => {
          if (res.confirm) {
            const [res_delete, err_delete] = await to(
              activityApi.deleteActivity(activity.id)
            );
            if (err_delete) {
              wx.showToast({
                title: "出错啦",
                icon: "error",
              });
            } else {
              wx.showToast({
                title: "删除成功",
              });
              this.onPullDownRefresh();
            }
          }
        },
      });
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    const [res, err] = await to(activityApi.getMyActivities("", 0));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
    }
    this.setData({
      activities: res.data.data,
    });
  },

  goActivityDetail(e) {
    const { activity } = e.currentTarget.dataset;
    wx.$router.push(`/pages/activity/detail/index`, {
      activity_id: activity.id,
    });
  },

  /**
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中",
    });
    const [res, err] = await to(activityApi.getMyActivities("", 0));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
    }
    this.setData({
      activities: res.data.data,
      page_num: 0,
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
    const { page_num, activities } = this.data;
    const [res, err] = await to(activityApi.getMyActivities("", page_num + 1));
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
      activities: {
        list: [...activities.list, ...res.data.data.list],
        total_size: res.data.data.total_size,
      },
      page_num: page_num + 1,
      isLoading: false,
    });
  },
});
