// pages/myInfo/editInfo.js

import userApi from "../../../api/user";
import fileApi from "../../../api/file";
import { to } from "../../../utils/util";

Page({
  data: {},

  // 选取图片
  changeAvatar() {
    const _this = this;
    wx.chooseMedia({
      count: 1, //默认9
      mediaType: ["image"],
      sizeType: ["compressed"], //可以指定是原图还是压缩图,此处考虑到服务器内存默认选择压缩状态
      sourceType: ["album", "camera"], //从相册选择或者相机拍摄
      success: async function (res) {
        wx.showLoading({
          title: "稍等哦...",
        });
        const file = {
          url: res.tempFiles[0].tempFilePath,
        };
        const [res_upload, err_upload] = await to(fileApi.uploadImage(file));
        if (err_upload) {
          wx.showToast({
            title: err_upload.data.message,
          });
          return;
        }
        const [res_change, err_change] = await to(
          userApi.changeMyAvatar(res_upload.url)
        );
        if (err_change) {
          wx.showToast({
            title: err_change.data.message,
            icon: "error",
          });
        }
        await _this.refreshUserInfo();
        wx.showToast({
          title: "修改成功",
        });
      },
    });
  },

  async refreshUserInfo(e) {
    const [res, err] = await to(userApi.getMyUserInfo());
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      userInfo: res.data.data,
      "userInfo.gender": userUtils.getGender(res.data.data.gender),
    });
  },

  goUserName(e) {
    wx.navigateTo({
      url: "/pages/myInfo/userName/index",
      success: (res) => {
        res.eventChannel.emit("acceptDataFromOpenerPage", {
          data: this.data.userInfo.nickname,
        });
      },
    });
  },

  // 更换所在地
  async onChangeRegion(e) {
    const [res, err] = await to(userApi.changeMyLocation(e.detail.value));
    if (err) {
      return;
    }
    this.setData({
      userInfo: res.data.data,
      "userInfo.gender": userUtils.getGender(res.data.data.gender),
    });
  },

  goBack() {
    wx.$router.back();
  },

  async changeBgImage(e) {
    const _this = this;
    wx.chooseMedia({
      count: 1, //默认9
      mediaType: ["image"],
      sizeType: ["compressed"], //可以指定是原图还是压缩图,此处考虑到服务器内存默认选择压缩状态
      sourceType: ["album", "camera"], //从相册选择或者相机拍摄
      success: async function (res) {
        wx.showLoading({
          title: "稍等哦...",
        });
        let file = {
          url: res.tempFiles[0].tempFilePath,
        };
        let [res_upload, err_upload] = await to(fileApi.uploadImage(file));
        if (err_upload) {
          wx.showToast({
            title: err_upload.data.message,
          });
          return;
        }
        let [res_change, err_change] = await to(
          userApi.changeMyBgImage(res_upload.url)
        );
        if (err_change) {
          wx.showToast({
            title: err_change.data.message,
            icon: "error",
          });
        }
        await _this.refreshUserInfo();
        wx.showToast({
          title: "修改成功",
        });
      },
    });
    this.refreshUserInfo();
  },

  onLoad(options) {
    // 获取右上角胶囊位置
    const res_head_btn = wx.getMenuButtonBoundingClientRect();
    this.setData({
      back_btn_top: res_head_btn.top,
      back_btn_left: wx.getSystemInfoSync().windowWidth - res_head_btn.right,
      back_btn_height: res_head_btn.height,
      back_btn_width: res_head_btn.width,
    });
  },

  // 更新生日
  async onChangeBirthday(e) {
    let [res, err] = await to(userApi.changeMyBirthday(e.detail.value));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      userInfo: res.data.data,
      "userInfo.gender": userUtils.getGender(res.data.data.gender),
    });
  },

  // 更换收货地址
  getAddress(e) {
    wx.chooseAddress({
      success: async function (res) {
        wx.showLoading({
          title: "稍等哦...",
        });
        const [res_address, err_address] = await to(
          userApi.changeMyAddress(res)
        );
        if (err_address) {
          wx.showToast({
            title: "出错啦",
            icon: "error",
          });
          return;
        }
        wx.showToast({
          title: "更新成功",
        });
      },
    });
  },

  changeGender(e) {
    const _this = this;
    let itemList = ["男", "女", "不展示"];
    let value = ["1", "2", "0"];
    wx.showActionSheet({
      itemList,
      async success(res) {
        let [res_gender, err_gender] = await to(
          userApi.changeMyGender(value[res.tapIndex])
        );
        if (err_gender) {
          wx.showToast({
            title: "出错啦",
            icon: "error",
          });
          return;
        }
        _this.setData({
          "userInfo.gender": userUtils.getGender(res_gender.data.data.gender),
        });
      },
      fail(err) {
        console.error(err);
      },
    });
    this.refreshUserInfo();
  },

  goSignature(e) {
    wx.navigateTo({
      url: "/pages/myInfo/signature/index",
      success: (res) => {
        res.eventChannel.emit("acceptDataFromOpenerPage", {
          data: this.data.userInfo.signature,
        });
      },
    });
  },

  goWechat(e) {
    wx.navigateTo({
      url: "/pages/myInfo/wechat/index",
      success: (res) => {
        res.eventChannel.emit("acceptDataFromOpenerPage", {
          data: this.data.userInfo.wechat,
        });
      },
    });
  },

  goQQ(e) {
    wx.navigateTo({
      url: "/pages/myInfo/qq/index",
      success: (res) => {
        res.eventChannel.emit("acceptDataFromOpenerPage", {
          data: this.data.userInfo.qq,
        });
      },
    });
  },

  async onShow(options) {
    const [res, err] = await to(userApi.getMyUserInfo());
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      userInfo: res.data.data,
      "userInfo.gender": userUtils.getGender(res.data.data.gender),
    });
  },

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
    });
  },

  async onPullDownRefresh(options) {
    wx.showLoading({
      title: "刷新中...",
    });
    this.refreshUserInfo();
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },
});
