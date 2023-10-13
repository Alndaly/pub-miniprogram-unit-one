// pages/myInfo/qq/index.js
import userApi from '../../../api/user'

Page({

  data: {},

  async submitChange(e) {
    wx.showLoading({
      title: '稍等哦...',
    })
    let newQq = this.data.qq
    let res = await userApi.changeMyQq(newQq)
    if (res.data.code != '20000') {
      return
    }
    wx.showToast({
      title: '更新成功',
    })
  },

  clearQq(e) {
    this.setData({
      qq: ''
    })
  },

  onLoad(options) {
    const _this = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      _this.setData({
        qq: data.data
      })
    })
  },

})