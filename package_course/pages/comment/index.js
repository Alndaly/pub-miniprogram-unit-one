import courseApi from "../../../api/course";
import { to } from "../../../utils/util";

Page({
  data: {
    is_roll: false,
    content: "",
    teacher_score: "",
    teacher_id: "",
    parent_id: -1,
    teacher_index: 0,
    is_anonymous: false,
  },

  onChangeTeacher(e) {
    this.setData({
      teacher_index: e.detail.value,
      teacher: this.data.teacher_list[e.detail.value],
      teacher_id: this.data.teacher_id_list[e.detail.value],
    });
  },

  onChangeTeacherScore(e) {
    this.setData({
      teacher_score: e.detail,
    });
  },

  async onSubmit(e) {
    wx.showLoading({
      title: "提交中",
    });
    const {
      teacher_id,
      parent_id,
      course_id,
      is_roll,
      content,
      credit,
      is_anonymous,
      teacher_score,
    } = this.data;
    if (!content || !credit || !teacher_score) {
      wx.showToast({
        icon: "error",
        title: "请输入完整信息",
      });
      return;
    }
    const [res, err] = await to(
      courseApi.commentCourse({
        teacher_id,
        parent_id,
        course_id,
        is_roll: false,
        content,
        credit,
        is_anonymous,
        teacher_score,
      })
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    wx.showToast({
      title: "提交成功",
    });
  },

  async onLoad(options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage", async (data) => {
      this.setData({
        course_info: data.data,
        course_id: data.data.courseDetail.id,
      });
      const [res, err] = await to(
        courseApi.getCourseTeacherList(this.data.course_info.courseDetail.id)
      );
      if (err) {
        wx.showToast({
          title: "出错啦",
          icon: "error",
        });
        return;
      }
      const teacher_list = res.data.data.list.map((item) => item.name);
      const teacher_id_list = res.data.data.list.map((item) => item.id);
      this.setData({
        teacher_list: teacher_list,
        teacher_id_list: teacher_id_list,
      });
    });
  },
});
