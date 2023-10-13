import courseApi from "../../../api/course";

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
    const res = await courseApi.searchCourse(this.data.search_key, 0);
    console.log("搜索选课: ", res);
    const courseList = {
      total: res.data.data.total,
      list: res.data.data.list.map((item) => ({
        ...item,
        avg_credit: item.avg_credit
          ? item.avg_credit.toString().slice(0, 4)
          : "暂无均绩",
      })),
    };
    if (res.data.code == "20000") {
      this.setData({
        courseList,
      });
    }
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

  onLoad: async function (options) {
    wx.showLoading({
      title: "加载中",
    });
    this.setData({
      options: options,
      search_key: options.search_key ? options.search_key : "",
    });
    const res = await courseApi.searchCourse(options.search_key, 0);
    console.log("搜索选课: ", res);
    const courseList = {
      total: res.data.data.total,
      list: res.data.data.list.map((item) => ({
        ...item,
        avg_credit: item.avg_credit
          ? item.avg_credit.toString().slice(0, 4)
          : "暂无均绩",
      })),
    };
    if (res.data.code == "20000") {
      this.setData({
        courseList,
      });
    }
    wx.hideLoading({
      success: (res) => {},
    });
  },

  async onPullDownRefresh() {
    wx.showLoading({
      title: "加载中...",
    });
    const res = await courseApi.searchCourse(
      this.data.search_key,
      0,
      this.data.page === 0 ? 10 : 10 * (this.data.page + 1)
    );
    console.log("获取选课：", res);
    const courseList = {
      total: res.data.data.total,
      list: res.data.data.list.map((item) => ({
        ...item,
        avg_credit: item.avg_credit
          ? item.avg_credit.toString().slice(0, 4)
          : "暂无均绩",
      })),
    };
    if (res.data.code == "20000") {
      this.setData({
        courseList,
      });
    }
    wx.hideLoading({
      success: (res) => {},
    });
    wx.stopPullDownRefresh();
  },

  async onReachBottom() {
    this.setData({
      isLoading: true,
    });
    const res = await courseApi.searchCourse(
      this.data.search_key,
      this.data.page + 1
    );
    console.log("获取下一页:", res);
    if (res.data.code != "20000") {
      this.setData({
        isLoading: true,
      });
      return;
    }
    const courseListNext = res.data.data;
    this.setData({
      "courseList.list": [...this.data.courseList.list, ...courseListNext.list],
      page: res.data.data.list.length > 0 ? this.data.page + 1 : this.data.page,
      isLoading: false,
    });
  },
});
