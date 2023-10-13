import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  // 获取学院列表
  getCollegeList(school_id) {
    return service({
      url: URL.api_url + "/get/college",
      data: {
        school_id,
      },
    });
  },
  // 获取教师列表
  getTeacherList(school_id, college_id) {
    return service({
      url: URL.api_url + "/get/teacher",
      data: {
        school_id,
        college_id,
      },
    });
  },
  // 获取选课热搜
  getHotCourseList() {
    return service({
      url: URL.api_url + "/get/course/hot_search",
      data: {},
    });
  },
  // 获取课程的评论
  getCommentList(course_id, page, offset = 20) {
    return service({
      url: URL.api_url + "/get/course/comment",
      data: {
        page,
        offset,
        course_id,
      },
    });
  },
  // 获取课程的详细信息
  getCourseDetail(course_id) {
    return service({
      url: URL.api_url + "/get/course/detail",
      data: {
        course_id,
      },
    });
  },
  // 获取课程的老师列表
  getCourseTeacherList(course_id) {
    return service({
      url: URL.api_url + "/get/course/teacher",
      data: {
        course_id,
      },
    });
  },
  // 获取老师的课程列表
  getTeacherCourseList(teacher_id) {
    return service({
      url: URL.api_url + "/get/teacher/course",
      data: {
        teacher_id,
      },
    });
  },
  // 搜索选课
  searchCourse(key, page, offset = 10) {
    return service({
      url: URL.api_url + "/get/course/list",
      data: {
        key,
        page,
        offset,
        teacher: "",
        college: "",
        campus: "",
        school: "",
        order_by: "create_time desc",
      },
      method: "POST",
    });
  },
  // 评价课程
  commentCourse(params) {
    return service({
      url: URL.api_url + "/post/course/comment",
      data: {
        course_id: params.course_id,
        content: params.content,
        credit: params.credit,
        is_roll: params.is_roll,
        teacher_score: params.teacher_score,
        teacher_id: params.teacher_id,
        parent_id: params.parent_id,
        is_anonymous: params.is_anonymous,
      },
      method: "POST",
    });
  },

  // 新建选课
  addCourse(teacher_name, college_id, course_name, school_id) {
    return service({
      url: URL.api_url + "/post/course/add",
      data: {
        teacher_name,
        college_id,
        course_name,
        school_id,
      },
      method: "POST",
    });
  },

  // 新建老师
  addTeacher(teacher, college_id, school_id, course_id) {
    return service({
      url: URL.api_url + "/post/teacher/add",
      data: {
        teacher,
        college_id,
        school_id,
        course_id,
      },
      method: "POST",
    });
  },
};
