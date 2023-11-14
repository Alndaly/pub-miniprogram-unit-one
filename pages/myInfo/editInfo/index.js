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
        const [res_upload, err_upload] = await to(
          fileApi.uploadImage(file.url)
        );
        if (err_upload) {
          wx.showToast({
            title: err_upload.data,
            icon: "error",
          });
          return;
        }
        const [res_change, err_change] = await to(
          userApi.changeMyAvatar(res_upload)
        );
        if (err_change) {
          wx.showToast({
            title: err_change.data,
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
        title: err.data,
        icon: "error",
      });
      return;
    }
    this.setData({
      userInfo: res.data,
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
        const file = {
          url: res.tempFiles[0].tempFilePath,
        };
        const [res_upload, err_upload] = await to(
          fileApi.uploadImage(file.url)
        );
        if (err_upload) {
          wx.showToast({
            title: err_upload.data,
          });
          return;
        }
        const [res_change, err_change] = await to(
          userApi.changeMyBgImage(res_upload)
        );
        if (err_change) {
          wx.showToast({
            title: err_change.data,
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
    const date = new Date(e.detail.value);
    const timestamp = date.getTime();
    const [res, err] = await to(userApi.changeMyBirthday(timestamp));
    if (err) {
      wx.showToast({
        title: err.data,
        icon: "error",
      });
      return;
    }
    this.setData({
      userInfo: res.data,
    });
  },

  changeGender(e) {
    const _this = this;
    const itemList = ["男", "女", "不展示"];
    wx.showActionSheet({
      itemList,
      async success(res) {
        wx.showLoading({
          title: "稍等哦",
        });
        const [res_gender, err_gender] = await to(
          userApi.changeMyGender(itemList[res.tapIndex])
        );
        if (err_gender) {
          wx.showToast({
            title: err_gender.data,
            icon: "error",
          });
          return;
        }
        wx.hideLoading();
        _this.refreshUserInfo();
      },
    });
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
        title: err.data,
        icon: "error",
      });
      return;
    }
    this.setData({
      userInfo: res.data,
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
