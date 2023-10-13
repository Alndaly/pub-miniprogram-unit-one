export default {
  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          resolve(res)
        },
        fail(res) {
          reject(res)
        }
      })
    })
  }
}