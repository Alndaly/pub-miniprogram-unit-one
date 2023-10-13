// custom-tab-bar/index.js
Component({
  /**
   * Component properties
   */
  properties: {},

  /**
   * Component initial data
   */
  data: {
    showPublishPopUp: false,
    show: true,
    selected: 0,
    color: "#000000",
    list: [
      {
        pagePath: "/pages/home/index",
        text: "新鲜事",
        iconPath: "/static/images/home.png",
        selectedIconPath: "/static/images/home_sel.png",
      },
      {
        pagePath: "/pages/publishV2/ugc/index",
        switch: false,
        text: "发布",
        iconPath: "/static/images/publish.png",
        selectedIconPath: "/static/images/publish.png",
      },
      {
        pagePath: "/pages/myInfo/index/index",
        text: "我的",
        iconPath: "/static/images/wode.png",
        selectedIconPath: "/static/images/wode_sel.png",
      },
    ],
    position: "bottom",
    borderStyle: "white",
    selectedColor: "#770000",
  },

  /**
   * Component methods
   */
  methods: {
    hidePublishPopUp(e) {
      this.setData({
        showPublishPopUp: false,
      });
    },
    goPublishTreeHole(e) {
      wx.navigateTo({
        url: "/pages/publishV2/treeHole/index",
      });
      this.setData({
        showPublishPopUp: false,
      });
    },
    goPublishActivity(e) {
      wx.navigateTo({
        url: "/pages/publishV2/activity/index",
      });
      this.setData({
        showPublishPopUp: false,
      });
    },
    goPublishUgc(e) {
      wx.navigateTo({
        url: "/pages/publishV2/ugc/index",
      });
      this.setData({
        showPublishPopUp: false,
      });
    },
    switchTab(e) {
      const data = e.currentTarget.dataset;
      if (data.switch === false) {
        this.setData({
          showPublishPopUp: true,
        });
      } else {
        wx.$router.push(data.path);
      }
    },
  },
});
