// pages/common/loginAuth/index.js
import cache from "../../../utils/cache";
import timeUtils from "../../../utils/time";
import {BaseConfig} from "../../../configs/base";

Page({
  /**
   * Page initial data
   */
  data: {
    socketTask: null,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.setData({
      options,
    });
    const socketTask = wx.connectSocket({
      url: `${BaseConfig.WS_URL}/ws/login`,
    });
    socketTask.onMessage(async (res) => {
      console.log("socket连接接收到消息:", res);
      const data = JSON.parse(res.data);
      if (data.action === "result" && data.data === "success") {
        wx.showToast({
          title: "授权成功，即将返回【我的】页面",
          icon: "none",
        });
        await timeUtils.sleep(1000);
        wx.$router.back();
      }
    });
    socketTask.onOpen((res) => {
      console.log("socket连接成立", res);
      this.setData({
        socketTask,
      });
      const data = {
        action: "scan",
        data: options.code,
      };
      const message = JSON.stringify(data);
      socketTask.send({
        data: message,
        success: (res) => {
          console.log(res);
        },
        fail: (err) => {
          console.error(err);
        },
      });
    });
  },

  onConfirmAuth(e) {
    const { options, socketTask } = this.data;
    const access_token = cache.get("access_token");
    if (socketTask.OPEN) {
      const data = {
        action: "auth",
        data: {
          token: access_token,
          code: options.code,
        },
      };
      const message = JSON.stringify(data);
      socketTask.send({
        data: message,
        success: (res) => {
          console.log(res);
        },
        fail: (err) => {
          console.error(err);
        },
      });
    }
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {
    const { socketTask } = this.data;
    if (socketTask.OPEN) {
      socketTask.close();
    }
  },
});
