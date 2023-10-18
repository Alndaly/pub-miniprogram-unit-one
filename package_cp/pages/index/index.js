const dayjs = require("dayjs");
const computedBehavior = require("miniprogram-computed").behavior;
import attachmentApi from "../../../api/attachment";
import timeUtils from "../../../utils/time";
import cpApi from "../../../api/cp";
import userApi from "../../../api/user";
import { to } from "../../../utils/util";
import { subscribeNotify } from "../../../utils/subscribe";

Page({
  behaviors: [computedBehavior],
  computed: {
    locked(data) {
      if (data.weekDay) {
        if (dayjs().month() + 1 === 6 && dayjs().date() === 1) {
          return false;
        }
        if (data.weekDay > 0 && data.weekDay < 6) {
          return true;
        }
        return false;
      }
    },
    status_image(data) {
      let image_url = "";
      switch (data?.cp_res?.status) {
        case "匹配中":
          image_url = "https://oss.kinda.info/image/202305222020598.gif";
          break;
        case "待匹配":
          image_url = "https://oss.kinda.info/image/202305222027277.png";
          break;
        case "匹配成功":
          image_url = "https://oss.kinda.info/image/202305222023052.png";
          break;
        case "匹配失败":
          image_url = "https://oss.kinda.info/image/202305222032911.jpeg";
          break;
        default:
          break;
      }
      return image_url;
    },
  },
  /**
   * Page initial data
   */
  data: {
    showGroupModal: false,
    cp_res: null,
  },

  viewImage(e) {
    const { image } = e.currentTarget.dataset;
    wx.previewImage({
      urls: [image],
      current: image,
    });
  },

  showUserInfo(e) {
    const { cp_res } = this.data;
    if (!cp_res.to_user) return;
    wx.$router.push(`/pages/userInfo/index`, { user_id: cp_res.to_user.id });
  },

  async showOtherUserWeChatId(e) {
    wx.showLoading({
      title: "获取中",
    });
    const { cp_res } = this.data;
    const [res, err] = await to(cpApi.getOtherUserFormInfo(cp_res.to_user.id));
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
      return;
    }
    wx.hideLoading();
    wx.showModal({
      title: "对方微信号",
      content: res.data.data.wechat_id,
      showCancel: false,
    });
  },

  goBackPage() {
    wx.$router.back();
  },

  goEditForm(e) {
    const { weekDay, locked } = this.data;
    if (weekDay > 0 && weekDay < 6 && locked) {
      wx.showModal({
        title: "提示",
        content: "CP表单仅在周末/限定时间开放，是否订阅下次开启通知？",
        complete: async (res) => {
          if (res.confirm) {
            const [subscribe_res, subscribe_err] = await subscribeNotify([
              "-UVrmfTqul-ucQGxgDpuWXepymPhGZzRKKPgP7vt9L4",
            ]);
            if (subscribe_res) {
              wx.showToast({
                title: "订阅成功",
                icon: "success",
              });
            }
          }
        },
      });
      return;
    }
    wx.$router.push("/package_cp/pages/info/edit/index");
  },

  showCpGroupCode(e) {
    this.setData({
      showGroupModal: true,
    });
  },

  onReMatchCp(e) {
    const { myUserInfo } = this.data;
    wx.showModal({
      title: "提醒",
      content:
        "重新分配需消耗100U积分，并且原分配记录不可再找回哦～确定重新分配吗？",
      complete: async (res) => {
        if (res.confirm) {
          if (myUserInfo.we_score < 100) {
            wx.showModal({
              title: "提示",
              content: "U积分不足，前去获取吗？",
              complete: (res) => {
                if (res.confirm) {
                  wx.$router.push("/pages/uScore/index/index");
                }
              },
            });
            return;
          }
          wx.showLoading({
            title: "提交申请中...",
          });
          const [res, err] = await to(cpApi.rematchMyCp());
          if (err) {
            wx.showToast({
              title: err.data.message,
              icon: "error",
            });
            return;
          }
          const [res_cp_res, err_cp_res] = await to(cpApi.getMyCpRes());
          if (err_cp_res) {
            wx.showToast({
              title: err_cp_res.data.message,
              icon: "error",
            });
            return;
          }
          this.setData({
            cp_res: res_cp_res.data.data,
          });
          wx.showToast({
            title: "提交成功",
          });
        }
      },
    });
  },

  hideGroupModal(e) {
    this.setData({
      showGroupModal: false,
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // 获取右上角胶囊位置
    const res_head_btn = wx.getMenuButtonBoundingClientRect();
    this.setData({
      back_btn_top: res_head_btn.top,
      back_btn_left: wx.getSystemInfoSync().windowWidth - res_head_btn.right,
      back_btn_height: res_head_btn.height,
      back_btn_width: res_head_btn.width,
    });
    setInterval(() => {
      const nextMondayTimeStamp = timeUtils.getNextMonday();
      const nextSatudayTimeStamp = timeUtils.getNextSaturday();
      const nowTime = new Date();
      const differSaturdayTime = timeUtils.calculateTimeDifference(
        nowTime,
        nextSatudayTimeStamp
      );
      const differMondayTime = timeUtils.calculateTimeDifference(
        nowTime,
        nextMondayTimeStamp
      );
      this.setData({
        differMondayTime,
        differSaturdayTime,
        weekDay: nowTime.getDay(),
      });
    }, 1000);
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
  async onShow() {
    wx.showLoading({
      title: "加载中",
    });
    const [res, err] = await to(cpApi.getMyCpRes());
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
      return;
    }
    this.setData({
      cp_res: res.data.data,
    });
    const [res_image, err_image] = await to(attachmentApi.getAttachmentById(2));
    if (res_image?.data?.data?.link) {
      this.setData({
        group_code: res_image.data.data.link,
      });
    }
    const [res_my_user_info, err_my_user_info] = await to(
      userApi.getMyUserInfo()
    );
    this.setData({
      myUserInfo: res_my_user_info.data.data,
    });
    wx.hideLoading();
  },

  showTips(e) {
    wx.showModal({
      title: "提示",
      content: "鸭鸭匹配完成后会拉群，届时通过此随机码在群内找到那个TA哦～",
      showCancel: false,
    });
  },

  goUpdateForm(e) {
    const { weekDay, locked } = this.data;
    if (weekDay > 0 && weekDay < 6 && locked) {
      wx.showModal({
        title: "提示",
        content: "CP表单仅在周末/限定时间开放编辑，是否订阅下次开启通知？",
        complete: async (res) => {
          if (res.confirm) {
            const [subscribe_res, subscribe_err] = await subscribeNotify([
              "-UVrmfTqul-ucQGxgDpuWXepymPhGZzRKKPgP7vt9L4",
            ]);
            if (subscribe_res) {
              wx.showToast({
                title: "订阅成功",
                icon: "success",
              });
            }
          }
        },
      });
      return;
    }
    wx.$router.push(`/package_cp/pages/info/update/index`);
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {},

  /**
   * Called when page reach bottom
   */
  onReachBottom() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
