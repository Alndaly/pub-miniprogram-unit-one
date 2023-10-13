import userApi from '../../../api/user'

Page({

  data: {},

  inputSignature(e) {
    this.setData({
      'signature': e.detail.value
    })
  },

  clearSignature(e) {
    this.setData({
      'signature': ''
    })
  },

  async submitChange(e) {
    wx.showLoading({
      title: '稍等哦...',
    })
    let newSignature = this.data.signature
    let res = await userApi.changeMySignature(newSignature)
    console.log('修改个性签名: ', res)
    if (res.data.code != '20000') {
      return
    }
    wx.showToast({
      title: '更新成功',
    })
  },

  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      this.setData({
        signature: data.data
      })
    })
  },

})