// pages/school/authentication/photo.js
import fileApi from "../../../api/file";
import { to } from "../../../utils/util";
import studentApi from "../../../api/student";

Page({
  data: {
    fileList: [],
  },

  async afterRead(event) {
    const { file } = event.detail;
    this.setData({
      uploadStatus: "稍等哦...",
    });
    let res = await fileApi.uploadImage(file);
    console.log("图片上传: ", res);
    const { fileList = [] } = this.data;
    fileList.push({
      ...res,
    });
    this.setData({
      fileList,
      uploadStatus: "",
    });
    wx.hideLoading();
  },

  deletePhoto(e) {
    this.setData({
      fileList: [],
    });
  },

  async finishPhotoAuth(e) {
    if (!this.data.fileList || this.data.fileList.length == 0) {
      wx.showToast({
        title: "请先上传图片",
        icon: "none",
      });
    }
    wx.showLoading({
      title: "上传中",
    });
    let [res, err] = await to(
      studentApi.verifyByPhoto(this.data.fileList[0].url)
    );
    console.log("照片方式学生认证: ", res);
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
    setTimeout(() => {
      wx.$router.back();
    }, 1000);
  },
});
