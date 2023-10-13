export default {

  // 此处expire是分钟数
  set(key, val, expire) {
    try {
      let data
      let dataObj
      let curTime = data ? dataObj.saveTime : new Date().getTime()
      expire = expire ? (data ? dataObj.expire : (1000 * expire)) : null
      wx.setStorageSync(key, JSON.stringify({
        data: val,
        saveTime: curTime,
        expire
      }))
    } catch (e) {
      console.log(e)
    }
  },

  // 判断是否过期
  expired(key) {
    try {
      const data = wx.getStorageSync(key)
      if (data) {
        const dataObj = JSON.parse(data)
        if (dataObj.expire && new Date().getTime() - dataObj.saveTime > dataObj.expire) {
          return true
        } else {
          return false
        }
      }
    } catch (e) {
      console.err(e)
    }
  },

  // 直接获取，不做时间判断处理
  directGet(key) {
    try {
      const data = wx.getStorageSync(key)
      if (data) {
        const dataObj = JSON.parse(data)
        return dataObj
      }
      return null
    } catch (e) {
      console.err(e)
    }
  },

  get(key) {
    try {
      const data = wx.getStorageSync(key)
      if (data) {
        const dataObj = JSON.parse(data)
        if (dataObj.expire && new Date().getTime() - dataObj.saveTime > dataObj.expire) {
          return null
          // this.remove(key)
        } else {
          return dataObj.data
        }
      }
      return null
    } catch (e) {
      console.err(e)
    }
  },

  remove(key) {
    try {
      wx.removeStorageSync(key)
    } catch (e) {
      // error
    }
  },

  clear() {
    try {
      wx.clearStorage({
        success: (res) => {},
      })
    } catch (e) {
      // error
    }
  }

}