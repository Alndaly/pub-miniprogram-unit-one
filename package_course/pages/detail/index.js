import courseApi from "../../../api/course";
import { to } from "../../../utils/util";

Page({
  /**
   * Page initial data
   */
  data: {
    page: 0,
    courseDetail: {},
    teacherList: {},
    commentList: {},
  },

  async onLoad(options) {
    wx.showLoading({
      title: "加载中",
    });
    this.setData({
      options: options,
    });
    const [res_detail, err_detail] = await to(
      courseApi.getCourseDetail(options.course_id)
    );
    const [res_comment, err_comment] = await to(
      courseApi.getCommentList(options.course_id, 0)
    );
    const [res_teacher, err_teacher] = await to(
      courseApi.getCourseTeacherList(options.course_id)
    );
    if (err_comment || err_detail || err_teacher) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      courseDetail: res_detail.data.data,
      commentList: res_comment.data.data,
      teacherList: res_teacher.data.data,
    });
    wx.hideLoading();
  },

  goComment(e) {
    const _this = this;
    wx.navigateTo({
      url: "/package_course/pages/comment/index",
      success(res) {
        res.eventChannel.emit("acceptDataFromOpenerPage", {
          data: _this.data,
        });
      },
    });
  },

  // 接收到评论组件返回的成功信号
  async onSubmitCommentResult(e) {
    if (e.detail.res.data.code != "20000") {
      return;
    }
    const commentList = await ugcApi.getUgcComment(this.data.ugcDetail.id);
    this.setData({
      commentList: commentList.data.data,
    });
  },

  addTeacher() {
    const _this = this;
    wx.navigateTo({
      url: "/pages/school/teacher/add/index",
      success(res) {
        // 通过 eventChannel 向被打开页面传送数据
        res.eventChannel.emit("courseDetailPage", {
          data: {
            courseDetail: {
              ..._this.data.courseDetail,
            },
          },
        });
      },
      fail(err) {
        console.error(err);
      },
    });
  },

  async onPullDownRefresh(e) {
    wx.showLoading({
      title: "刷新中",
    });
    const { options } = this.data;
    const [res_detail, err_detail] = await to(
      courseApi.getCourseDetail(options.course_id)
    );
    const [res_comment, err_comment] = await to(
      courseApi.getCommentList(options.course_id, 0)
    );
    const [res_teacher, err_teacher] = await to(
      courseApi.getCourseTeacherList(options.course_id)
    );
    if (err_detail || err_comment || err_teacher) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      courseDetail: res_detail.data.data,
      commentList: res_comment.data.data,
      teacherList: res_teacher.data.data,
    });
    wx.hideLoading();
    wx.stopPullDownRefresh({
      success: (res) => {},
    });
  },

  onReady() {
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

  onReachBottom: async function () {
    this.setData({
      isLoading: true,
    });
    const { options, page, commentList } = this.data;
    const [res, err] = await to(
      courseApi.getCommentList(options.course_id, page + 1)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      this.setData({
        isLoading: false,
      });
      return;
    }
    this.setData({
      commentList: {
        list: [...commentList.list, ...res.data.data.list],
        total: res.data.data.total,
      },
      page: page + 1,
      isLoading: false,
    });
  },

  // 用户点击分享的时候
  onShareAppMessage(e) {
    let title = e.target.dataset.detail.name;
    let path = `package_course/pages/detail/index?course_id=${e.target.dataset.detail.id}`; // 分享后打开的页面
    return {
      title,
      path,
    };
  },
});
