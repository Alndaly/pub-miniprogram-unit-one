// package_map/pages/home/index.js
import { to } from "../../../utils/util";
import locationApi from "../../../api/location";
const computedBehavior = require("miniprogram-computed").behavior;
Page({
  behaviors: [computedBehavior],
  computed: {
    markers(data) {
      if (!data.locations?.list) return;
      return data.locations.list.map((item) => {
        return {
          id: item.id,
          latitude: item.latitude,
          longitude: item.longitude,
          width: 50,
          height: 50,
          address: item.address,
          iconPath: "/package_map/static/images/Location.png",
          customCallout: {
            display: "ALWAYS",
            anchorX: 0,
            anchorY: -5,
          },
        };
      });
    },
  },
  goSearchLocation(e){
    
  },
  /**
   * Page initial data
   */
  data: {
    inputBottom: 0,
    search_key: "",
    searchLocationRefreshStatus: false,
    showSearchPopUp: false,
    myLocation: {},
  },

  onTapCallout(e) {
    const { locations } = this.data;
    const { markerID } = e.detail;
    const location = locations.list.filter((item) => item.id === markerID)[0];
    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      scale: 13,
    });
  },
  onShowSearchPopUp(e) {
    this.setData({
      showSearchPopUp: true,
    });
  },
  goBack(e) {
    wx.$router.back();
  },
  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    // 获取右上角胶囊位置
    const res_head_btn = wx.getMenuButtonBoundingClientRect();
    this.setData({
      back_btn_top: res_head_btn.top,
      back_btn_left: wx.getSystemInfoSync().windowWidth - res_head_btn.right,
      back_btn_height: res_head_btn.height,
      back_btn_width: res_head_btn.width,
    });
    const [res, err] = await to(
      wx.getLocation({
        type: "wgs84",
      })
    );
    this.setData({
      myLocation: res,
    });
    const [res_location, err_location] = await to(
      locationApi.searchLocation(1, 1, "")
    );
    this.setData({
      locations: res_location.data.data,
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    wx.onKeyboardHeightChange((res) => {
      this.setData({ inputBottom: res.height });
    });
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {},

  /**
   * Called when page reach bottom
   */
  onReachBottom() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {},
});
