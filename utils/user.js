export default {
  getSessionStatus(params) {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success(res) {
          resolve(true);
        },
        fail(err) {
          resolve(false);
        },
      });
    });
  },
};
