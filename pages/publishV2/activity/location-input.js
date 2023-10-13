const chooseLocation = requirePlugin("chooseLocation");
const computedBehavior = require("miniprogram-computed").behavior;
const dayjs = require("dayjs");
import { to } from "../../../utils/util";
import plugins from "../../../configs/plugins";
import locationUtil from "../../../utils/location";
Page({
  behaviors: [computedBehavior],
  /**
   * Page initial data
   */
  data: {
    types: ["活动时间", "报名时间"],
    chosedTypeIndex: null,
    showTimePicker: false,
    name: "",
    location: null,
    years: [2023, 2024, 2025, 2026, 2027, 2028, 2029],
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    chosedTimeType: null,
    time_hour: "00",
    time_minute: "00",
    time_second: "00",
  },

  computed: {},

  bindTypeChange(e) {
    this.setData({
      chosedTypeIndex: e.detail.value,
    });
  },

  isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  },

  onChooseStartTime(e) {
    this.setData({
      showTimePicker: true,
      chosedTimeType: "start_time",
    });
  },

  onChooseEndTime(e) {
    this.setData({
      showTimePicker: true,
      chosedTimeType: "end_time",
    });
  },

  onConfirmTime(e) {
    const {
      time_hour,
      time_minute,
      time_second,
      chosedTimeType,
      years,
      months,
      days,
      timePickerIndex,
    } = this.data;
    if (chosedTimeType === "start_time") {
      this.setData({
        start_time: `${years[timePickerIndex[0]]}-${
          months[timePickerIndex[1]]
        }-${
          days[timePickerIndex[2]]
        } ${time_hour}:${time_minute}:${time_second}`,
      });
    } else {
      this.setData({
        end_time: `${years[timePickerIndex[0]]}-${months[timePickerIndex[1]]}-${
          days[timePickerIndex[2]]
        } ${time_hour}:${time_minute}:${time_second}`,
      });
    }
    this.setData({
      showTimePicker: false,
      chosedTimeType: null,
    });
  },

  onCancelTime(e) {
    this.setData({
      showTimePicker: false,
      chosedTimeType: null,
    });
  },

  bindTimeChange(e) {
    const { years, months } = this.data;
    const year = years[e.detail.value[0]];
    const month = months[e.detail.value[1]];
    const bigMonths = [1, 3, 5, 7, 8, 10, 12];
    if (bigMonths.includes(month)) {
      const days = Array.from({ length: 31 }, (_, index) => index + 1);
      this.setData({
        days,
      });
    } else {
      if (month === 2) {
        if (this.isLeapYear(year)) {
          const days = Array.from({ length: 29 }, (_, index) => index + 1);
          this.setData({
            days: days,
          });
        } else {
          const days = Array.from({ length: 28 }, (_, index) => index + 1);
          this.setData({
            days: days,
          });
        }
      } else {
        const days = Array.from({ length: 30 }, (_, index) => index + 1);
        this.setData({
          days,
        });
      }
    }
    this.setData({
      timePickerIndex: e.detail.value,
    });
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    const now = dayjs();
    let day = now.date();
    const year = now.year();
    const month = now.month() + 1;
    const bigMonths = [1, 3, 5, 7, 8, 10, 12];
    if (bigMonths.includes(month)) {
      const days = Array.from({ length: 31 }, (_, index) => index + 1);
      this.setData({
        days,
      });
    } else {
      if (month === 2) {
        if (this.isLeapYear(year)) {
          const days = Array.from({ length: 29 }, (_, index) => index + 1);
          this.setData({
            days: days,
          });
        } else {
          const days = Array.from({ length: 28 }, (_, index) => index + 1);
          this.setData({
            days: days,
          });
        }
      } else {
        const days = Array.from({ length: 30 }, (_, index) => index + 1);
        this.setData({
          days,
        });
      }
    }
    this.setData({
      timePickerIndex: [year - 2023, month - 1, day - 1],
    });
  },

  async onChooseMap() {
    const key = plugins.PLUGIN_MAP_KEY; //使用在腾讯位置服务申请的key
    const referer = "Unit One"; //调用插件的app的名称
    let [res, err] = await to(locationUtil.getLocation());
    if (err) {
      wx.showToast({
        title: "请先通过右上角三点，选取【设置】打开地理权限",
        icon: "none",
      });
      return;
    }
    const location = JSON.stringify({
      latitude: res.latitude,
      longitude: res.longitude,
    });
    wx.$router.push(
      `plugin://chooseLocation/index`,
      {
        key,
        referer,
        location,
      }
    );
  },

  onShow() {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    location &&
      this.setData({
        location,
      });
  },
  onSubmit(e) {
    const { start_time, end_time, location, name, chosedTypeIndex } = this.data;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    const { time_locations } = prevPage.data;
    let time_location = {
      start_time,
      end_time,
      location,
      name,
    };
    if (chosedTypeIndex == 0) time_location.type = "activity";
    if (chosedTypeIndex == 1) time_location.type = "join";
    time_locations.push(time_location);
    prevPage.setData({
      time_locations,
    });
    chooseLocation.setLocation(null);
    wx.$router.back();
  },
});
