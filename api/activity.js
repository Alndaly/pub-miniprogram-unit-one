import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  deleteActivity(id) {
    return service({
      url: URL.api_url + "/activity/delete",
      data: {
        id,
      },
      method: "POST",
    });
  },
  getMyActivities(
    search_key,
    page_num,
    page_size = 10,
    order_by = "create_time"
  ) {
    return service({
      url: URL.api_url + "/activity/mine",
      data: {
        search_key,
        page_num,
        page_size,
        order_by,
      },
      method: "POST",
    });
  },
  // 增加活动
  addActivity(title, detail, attachments, time_locations) {
    return service({
      url: URL.api_url + "/activity/add",
      data: {
        title,
        detail,
        attachments,
        time_locations,
      },
      method: "POST",
    });
  },
  // 获取活动时间地点的参与人情况
  getActivityTimeLocationUser(id, page_num, page_size) {
    return service({
      url: URL.api_url + "/activity/detail/location-time-user",
      data: {
        id,
        page_num,
        page_size,
      },
      method: "POST",
    });
  },
  // 获取活动的时间和地点情况
  getActivityTimeLocation(type, id) {
    return service({
      url: URL.api_url + "/activity/detail/location-time",
      data: {
        type,
        id,
      },
      method: "POST",
    });
  },
  // 评论活动的评论
  commentToActivityComment(to_id, content, parent_id) {
    return service({
      url: URL.api_url + "/activity/comment/add",
      data: {
        to_id, //评论的对象ID，此处即活动的ID
        content, //评论具体内容
        parent_id, //父级评论ID
        to_type: "activity", //评论对象的类型
      },
      method: "POST",
    });
  },
  // 点赞评论
  voteComment(to_id, status) {
    return service({
      url: URL.api_url + "/activity/comment/vote",
      data: {
        to_id,
        status,
      },
      method: "POST",
    });
  },
  // 点赞评论
  voteActivity(to_id, status) {
    return service({
      url: URL.api_url + "/activity/vote",
      data: {
        to_id,
        status,
      },
      method: "POST",
    });
  },
  // 评论活动
  commentToActivity(to_id, content) {
    return service({
      url: URL.api_url + "/activity/comment/add",
      data: {
        to_id, //评论的对象ID
        content, //评论具体内容
        parent_id: -1, //父级评论ID
        to_type: "activity", //评论对象的类型
      },
      method: "POST",
    });
  },
  // 获取活动评论
  getActivityComment(
    activity_id,
    page,
    offset = 10,
    order_by = "create_time",
    desc = true
  ) {
    return service({
      url: URL.api_url + "/activity/comment",
      data: {
        activity_id,
        page_num: page,
        offset,
        page_size: offset,
        order_by: order_by,
        desc,
      },
      method: "POST",
    });
  },

  // 获取我订阅的所有活动
  getMySubscribedActivities(page_num, page_size = 10) {
    return service({
      url: URL.api_url + "/activity/my-subscribed",
      data: {
        page_num,
        page_size,
      },
      method: "POST",
    });
  },
  // 获取特定组织的所有活动
  getActivitiesByOrganization(organization_id, page_num, page_size = 10) {
    return service({
      url: URL.api_url + "/activity/all/by-organization",
      data: {
        organization_id,
        page_num,
        page_size,
      },
      method: "POST",
    });
  },
  // 获取活动列表
  getAllActivities(
    search_key,
    page_num,
    page_size = 10,
    order_by = "create_time"
  ) {
    return service({
      url: URL.api_url + "/activity/all",
      data: {
        search_key,
        page_num,
        page_size,
        order_by,
      },
      method: "POST",
    });
  },
  // 时间排序获取活动列表
  getAllActivitiesByTime(page_num, page_size = 10, order_by = "create_time") {
    return service({
      url: URL.api_url + "/activity/all/by-time",
      data: {
        page_num,
        page_size,
        order_by,
      },
      method: "POST",
    });
  },
  subscribeActivity(id, status) {
    return service({
      url: URL.api_url + "/activity/subscribe",
      data: {
        id,
        status,
      },
      method: "POST",
    });
  },
  // 获取活动详情
  getActivityDetail(id) {
    return service({
      url: URL.api_url + "/activity/detail",
      data: {
        id,
      },
      method: "POST",
    });
  },
};
