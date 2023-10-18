const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  /**
   * 组件的对外属性
   */
  properties: {
    customStyle: {
      type: String,
      value: "",
    },
    isShadow: {
      type: Boolean,
      default: true,
    },
    bgColor: {
      type: String,
      default: "bg-blblue",
    },
    isBack: {
      type: Boolean,
      default: false,
    },
  },
  lifetimes: {
    attached() {
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
  },
  /**
   * 组件的初始数据
   */
  data: {},
  /**
   * 组件的方法列表
   */
  methods: {
    async goBackPage() {
      try {
        await wx.$router.back();
      } catch (e) {
        console.warn("检测到返回页面不存在，直接返回首页。错误：", e);
      }
    },
    goHomePage() {
      wx.reLaunch({
        url: "/pages/home/index",
      });
    },
  },
});
