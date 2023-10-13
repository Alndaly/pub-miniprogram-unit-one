import { subscribeNotify } from "../../../../utils/subscribe";
import formApi from "../../../../api/form";
import { to } from "../../../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {},

  async submitForm(e) {
    const { form_data } = this.data;
    wx.showLoading({
      title: "上传中",
    });
    // TODO 触发表单校验
    const [res, err] = await to(
      formApi.submitFormData(form_data.id, e.detail.value)
    );
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
      return;
    }
    wx.showToast({
      title: "上传成功",
    });
    // 申请订阅通知权限
    const [res_subscribe, err_subscribe] = await subscribeNotify([
      "8FgWxjig7giKz0PMr71bwEP2RYS5N2fNBuu8SIC0Y9U",
      "VRrVgAiYiqo5niYzw9kpY2-RWNqcLBCqHJbj2BsxELw",
      "VRrVgAiYiqo5niYzw9kpY-KlBrsvGus3nO3rziChR_I"
    ]);
    wx.$router.back();
  },

  goBackPage(e) {
    wx.$router.back();
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    wx.showLoading({
      title: "加载中",
    });
    // 获取右上角胶囊位置
    const res_head_btn = wx.getMenuButtonBoundingClientRect();
    this.setData({
      back_btn_top: res_head_btn.top,
      back_btn_left: wx.getSystemInfoSync().windowWidth - res_head_btn.right,
      back_btn_height: res_head_btn.height,
      back_btn_width: res_head_btn.width,
    });
    const [res, err] = await to(formApi.getFormData(1));
    if (err) {
      wx.showToast({
        title: err.data.message,
        icon: "error",
      });
      wx.hideLoading();
      return;
    }
    this.setData({
      form_data: res.data.data,
    });
    wx.hideLoading();
  },
});
