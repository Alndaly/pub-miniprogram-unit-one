// pages/protocols/webView/index.js
import webPage from '../../configs/webView'

Page({

  data: {
    pageUrl: ''
  },

  onLoad: function (options) {
    console.log(options)
    this.setData({
      options
    })
    this.setData({
      pageUrl: webPage[options.id]
    })
  }
  
})