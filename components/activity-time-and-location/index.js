// components/activity-time-and-location/index.js
const computedBehavior = require("miniprogram-computed").behavior;
import userUtils from "../../utils/user";
import { subscribeNotify } from "../../utils/subscribe";
import activityApi from "../../api/activity";
import { to } from "../../utils/util";

Component({
  behaviors: [computedBehavior],
  computed: {
    mapCovers(data) {
      if (!data?.detail) {
        return;
      }
      const coverList = data.detail.list.map((item) => {
        return {
          title: item.address,
          id: item.id,
          latitude: item.location_info.latitude,
          longitude: item.location_info.longitude,
        };
      });
      return coverList;
    },
  },
  /**
   * Component properties
   */
  properties: {
    detail: { type: Object, value: null },
    mapWidth: { type: String, value: "300px" },
    type: String,
  },

  /**
   * Component initial data
   */
  data: {},

  /**
   * Component methods
   */
  methods: {
    showUserList(e) {
      const { type, detail } = this.data;
      wx.$router.push("/pages/activity/users/index", {
        activity_time_id: detail.id,
      });
    },
    showUserInfo(e) {
      const { user } = e.currentTarget.dataset;
      wx.$router.push("/pages/userInfo/index", { user_id: user.id });
    },
    toLocation(e) {
      const { location } = e.currentTarget.dataset;
      wx.openLocation({
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
      });
    },

    async subscribeActivity(e) {
      if (!userUtils.hasSignUp()) {
        wx.showModal({
          title: "提醒",
          showCancel: false,
          content: "请点击下方打开小程序预约",
        });
        return;
      }
      const { type } = this.data;
      const { item } = e.currentTarget.dataset;
      if (!item.is_subscribed) {
        // 申请订阅通知权限
        const [res_subscribe, err_subscribe] = await subscribeNotify([
          "YwzrvvXS7GrA_rl4p6Mq9SBQJ7-TvvABeoxuuPRVZyg",
          "oar2bIMaiIaQ8j6sfT8498Qqp6I0-eKRTDsde8In12c",
          "vBftiAfoay9vpcQzjtIEucv4CAb2f94zziQkc6jZsb8",
        ]);
      }
      wx.showLoading({
        title: "提交中",
      });
      const [res, err] = await to(
        activityApi.subscribeActivity(item.id, !item.is_subscribed)
      );
      if (err) {
        wx.showToast({
          title: "出错啦",
          icon: "error",
        });
        return;
      }
      const myEventDetail = { type: type, res: res };
      const myEventOption = {};
      this.triggerEvent("subscribeResult", myEventDetail, myEventOption);
    },
  },
});
