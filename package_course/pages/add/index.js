import courseApi from "../../../api/course";
import { to } from "../../../utils/util";

Page({
  data: {
    collegeList: [],
    collegeIndex: 0,
  },

  onChangeCollege(e) {
    this.setData({
      collegeIndex: e.detail.value,
    });
    const { collegeList, collegeIndex } = this.data;
    const college_id = Number(e.detail.value) + 1;
    const college = collegeList[collegeIndex];
    this.setData({
      college,
      college_id,
    });
  },

  async onAddCourse(e) {
    wx.showLoading({
      title: "稍等哦",
    });
    const {
      courseTeacher: teacher_name,
      college_id,
      courseName: course_name,
      school_id = 1,
    } = this.data;
    if (!teacher_name || !college_id || !course_name) {
      wx.showToast({
        icon: "error",
        title: "请输入完整信息",
      });
      return;
    }
    const [res, err] = await to(
      courseApi.addCourse(teacher_name, college_id, course_name, school_id)
    );
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    wx.showToast({
      title: "新增成功",
    });
  },

  async onLoad(options) {
    const [res, err] = await to(courseApi.getCollegeList(1));
    if (err) {
      wx.showToast({
        title: "出错啦",
        icon: "error",
      });
      return;
    }
    this.setData({
      collegeList: res.data.data.list.map((item) => item.name),
    });
  },
});
