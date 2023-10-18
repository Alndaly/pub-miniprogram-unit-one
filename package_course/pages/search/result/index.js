import courseApi from "../../../../api/course";
import { to } from "../../../../utils/util";

Page({
  data: {
    page: 0,
    courseList: {},
    searchInputFocused: false,
  },

  focusSearchInput(e) {
    this.setData({
      searchInputFocused: true,
    });
  },

  blurSearchInput(e) {
    this.setData({
      searchInputFocused: false,
    });
  },

  async onSearch(e) {
    const [res, err] = await to(
      courseApi.searchCourse(this.data.search_key, 0)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
    }
    const courseList = {
      total: res.data.data.total,
      list: res.data.data.list.map((item) => ({
        ...item,
        avg_credit: item.avg_credit
          ? item.avg_credit.toString().slice(0, 4)
          : "暂无均绩",
      })),
    };
    this.setData({
      courseList,
    });
  },

  addCourse(e) {
    wx.$router.push("/package_course/pages/courses/add/index");
  },

  goCourseDetail(e) {
    const course = e.currentTarget.dataset.course;
    wx.$router.push(`/package_course/pages/detail/index`, {
      course_id: course.id,
    });
  },

  async onLoad(options) {
    wx.showLoading({
      title: "加载中",
    });
    this.setData({
      options: options,
      search_key: options.search_key ? options.search_key : "",
    });
    const [res, err] = await to(courseApi.searchCourse(options.search_key, 0));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "none",
      });
    }
    const courseList = {
      total: res.data.data.total,
      list: res.data.data.list.map((item) => ({
        ...item,
        avg_credit: item.avg_credit
          ? item.avg_credit.toString().slice(0, 4)
          : "暂无均绩",
      })),
    };
    this.setData({
      courseList,
    });
    wx.hideLoading();
  },

  async onPullDownRefresh() {
    wx.showLoading({
      title: "加载中...",
    });
    const [res, err] = await to(
      courseApi.searchCourse(
        this.data.search_key,
        0,
        this.data.page === 0 ? 10 : 10 * (this.data.page + 1)
      )
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      wx.hideLoading();
      wx.stopPullDownRefresh();
      return;
    }
    const courseList = {
      total: res.data.data.total,
      list: res.data.data.list.map((item) => ({
        ...item,
        avg_credit: item.avg_credit
          ? item.avg_credit.toString().slice(0, 4)
          : "暂无均绩",
      })),
    };
    this.setData({
      courseList,
    });
    wx.hideLoading();
    wx.stopPullDownRefresh();
  },

  async onReachBottom() {
    this.setData({
      isLoading: true,
    });
    const [res, err] = await to(
      courseApi.searchCourse(this.data.search_key, this.data.page + 1)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      erturn;
    }
    const courseListNext = res.data.data;
    this.setData({
      "courseList.list": [...this.data.courseList.list, ...courseListNext.list],
      page: res.data.data.list.length > 0 ? this.data.page + 1 : this.data.page,
      isLoading: false,
    });
  },
});
