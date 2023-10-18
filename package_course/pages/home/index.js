import courseApi from "../../../api/course";
import { flatten, randomNum, to } from "../../../utils/util";

Page({
  data: {
    inputFocus: false,
    search_key: "",
    hotCourse: [],
  },

  toDetail(e) {
    const course = e.currentTarget.dataset.course;
    wx.$router.push(`/package_course/pages/detail/index`, {
      course_id: course.id,
    });
  },

  onLoad: async function (options) {
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
    wx.showLoading({
      title: "加载中",
    });
    try {
      const res = await courseApi.getHotCourseList();
      const list = await Promise.all(
        Array.from(
          new Set(
            flatten(
              res.data.data.list
                .map((item) => {
                  return item.split(":")[1]?.split(",");
                })
                .filter((item) => item ?? item)
            )
          )
        ).map(async (item) => {
          const [res_data, err_data] = await to(
            courseApi.getCourseDetail(item)
          );
          return {
            name: res_data.data.data.name
              ? res_data.data.data.name
              : "课程已被删除",
            id: res_data.data.data.id
              ? res_data.data.data.id
              : randomNum(1000, 9999),
            is_delete: res_data.data.data.name ? false : true,
          };
        })
      );
      const hotCourse = {
        list,
        total: list.length,
      };
      this.setData({
        hotCourse: hotCourse,
      });
    } catch {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
    } finally {
      wx.hideLoading();
    }
  },

  onFocusInput(e) {
    this.setData({
      inputFocus: true,
    });
  },

  onUnFocusInput(e) {
    this.setData({
      inputFocus: false,
    });
  },

  goSearch(e) {
    wx.$router.push(`/package_course/pages/search/result/idnex`, {
      search_key: this.data.search_key,
    });
  },

  async onPullDownRefresh(e) {
    wx.showLoading({
      title: "加载中",
    });
    const [res, err] = await to(courseApi.getHotCourseList());
    const list = await Promise.all(
      Array.from(
        new Set(
          flatten(
            res.data.data.list
              .map((item) => {
                return item.split(":")[1]?.split(",");
              })
              .filter((item) => item ?? item)
          )
        )
      ).map(async (item) => {
        const [res_data, err_data] = await to(courseApi.getCourseDetail(item));
        return {
          name: res_data.data.data.name
            ? res_data.data.data.name
            : "课程已被删除",
          id: res_data.data.data.id
            ? res_data.data.data.id
            : randomNum(1000, 9999),
          is_delete: res_data.data.data.name ? false : true,
        };
      })
    );
    const hotCourse = {
      list,
      total: list.length,
    };
    this.setData({
      hotCourse: hotCourse,
    });
    wx.hideLoading();
    wx.stopPullDownRefresh({
      success: (res) => {},
    });
  },
});
