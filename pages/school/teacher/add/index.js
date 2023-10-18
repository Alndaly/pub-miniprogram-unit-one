import courseApi from '../../../../api/course'

Page({

  data: {
    collegeList: [],
    collegeIndex: 0
  },

  async onAddTeacher(e) {
    wx.showLoading({
      title: '稍等哦',
    })
    const {
      courseTeacher: teacher,
      courseId: course_id,
      college_id,
      school_id = 1,
    } = this.data
    if (!teacher) {
      wx.showToast({
        icon: 'error',
        title: '请输入完整信息'
      })
      return
    }
    const res = await courseApi.addTeacher(teacher, college_id, school_id, course_id)
    wx.showToast({
      title: '新增成功',
    })
  },

  async onLoad(options) {
    const _this = this
    const res = await courseApi.getCollegeList(1)
    this.setData({
      collegeList: res.data.data.list.map(item => item.name)
    })
    const eventChannel = this.getOpenerEventChannel()
    // 监听 acceptDataFromOpenerPage 事件，获取上一页面通过 eventChannel 传送到当前页面的数据
    eventChannel.on('courseDetailPage', function ({ data }) {
      _this.setData({
        courseName: data.courseDetail.name,
        courseId: data.courseDetail.id,
        college_id: data.courseDetail.college_id,
        school_id: data.courseDetail.school_id,
        college: data.courseDetail.college,
        collegeIndex: data.courseDetail.college_id.toString().indexOf(res.data.data.list.map(item => item.id)) + 1
      })
    })
  }

})