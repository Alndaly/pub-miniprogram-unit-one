import cache from "../../../../utils/cache";

Page({
  data: {},

  onShow(options) {
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
      fail: (res) => {
        console.error("获取系统信息出错", res);
      },
    });
  },

  goPageBeforeVerify(e) {
    if (cache.get("pageBeforeVerify")) {
      wx.$router.push(cache.get("pageBeforeVerify"));
      cache.remove("pageBeforeVerify");
      return;
    }
    wx.$router.push("/pages/home/index");
  },
});
