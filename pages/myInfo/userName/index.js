// pages/myInfo/userName/index.js
import userApi from '../../../api/user'

Page({

  data: {},

  async submitChange(e) {
    wx.showLoading({
      title: '稍等哦...',
    })
    let newUserName = this.data.username
    let res = await userApi.changeMyUserName(newUserName)
    console.log('修改昵称: ', res)
    if (res.data.code != '20000') {
      return
    }
    wx.showToast({
      title: '更新成功',
    })
  },

  clearUserName(e) {
    this.setData({
      username: ''
    })
  },

  onLoad(options) {
    const _this = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      _this.setData({
        username: data.data
      })
    })
  },

})