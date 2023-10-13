import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  getNextLabelUgc(search_key = "", label_id, order_by, current_ugc_id) {
    return service({
      url: URL.api_url + "/get/label/ugc/next",
      data: {
        search_key,
        label_id,
        order_by,
        current_ugc_id,
      },
    });
  },
  // 点赞Ugc
  voteUgc(to_id, status) {
    return service({
      url: URL.api_url + "/post/ugc/vote",
      data: {
        to_id,
        status,
      },
      method: "POST",
    });
  },
  // 点赞评论
  voteComment(vote_to_id, status) {
    return service({
      url: URL.api_url + "/post/comment/vote",
      data: {
        vote_to_id,
        status,
      },
      method: "POST",
    });
  },
  // 分享Ugc
  shareUgc(to_id, status) {
    return service({
      url: URL.api_url + "/post/ugc/share",
      data: {
        to_id,
        status,
      },
      method: "POST",
    });
  },
  // 修改Ugc
  updateMyUgc(data) {
    return service({
      url: URL.api_url + "/post/ugc/update",
      data: data,
      method: "POST",
    });
  },

  // 收藏Ugc
  collectUgc(to_id, status) {
    return service({
      url: URL.api_url + "/post/ugc/collect",
      data: {
        to_id,
        status,
      },
      method: "POST",
    });
  },
  // 获取Ugc的评论列表
  getUgcComment(
    ugc_id,
    page,
    offset = 10,
    order_by = "create_time",
    desc = true
  ) {
    return service({
      url: URL.api_url + "/get/ugc/comment",
      data: {
        ugc_id,
        page,
        offset,
        order_by,
        desc,
      },
    });
  },

  // 评论Ugc的评论
  commentToComment(parent_id, reply_to_id, to_id, content) {
    return service({
      url: URL.api_url + "/post/ugc/comment",
      data: {
        to_id, //UGC的ID
        reply_to_id, //被评论的评论ID
        content, //评论具体内容
        parent_id, //父级评论ID
      },
      method: "POST",
    });
  },

  // 评论Ugc
  commentToUgc(to_id, content) {
    return service({
      url: URL.api_url + "/post/ugc/comment",
      data: {
        reply_to_id: -1, //评论的对象ID
        to_id, //ugcID
        content, //评论具体内容
        parent_id: -1, //顶级评论ID
      },
      method: "POST",
    });
  },

  // 获取热搜前十
  getHotUgc() {
    return service({
      url: URL.api_url + "/get/ugc/hot",
      data: {
        page: 0,
        offset: 10,
      },
    });
  },

  // 获取Ugc详情
  getUgcDetail(id) {
    return service({
      url: URL.api_url + "/get/ugc/detail",
      data: {
        id,
      },
    });
  },

  // 获取我点赞的Ugc
  getMyVote(page, offset = 10) {
    return service({
      url: URL.api_url + "/post/ugc/my/vote",
      data: {
        page,
        offset,
        order_by: "create_time",
      },
      method: "POST",
    });
  },

  // 获取我收藏的Ugc
  getMyCollect(page, offset = 10) {
    return service({
      url: URL.api_url + "/post/ugc/my/collect",
      data: {
        page,
        offset,
      },
      method: "POST",
    });
  },

  // 获取标签数据
  getLabelData(search_key, page_num, page_size = 10) {
    return service({
      url: URL.api_url + "/get/ugc/label",
      data: {
        search_key,
        page_num,
        page_size,
      },
    });
  },

  // 发布Ugc
  publishUgc(data) {
    return service({
      url: URL.api_url + "/post/ugc/create",
      data: data,
      method: "POST",
    });
  },

  // 获取我发布的Ugc列表
  getMyUgc(page, offset = 10) {
    return service({
      url: URL.api_url + "/post/ugc/my/publish",
      data: {
        page,
        offset,
        order_by: "create_time",
      },
      method: "POST",
    });
  },

  // 删除Ugc
  delUgc(id) {
    return service({
      url: URL.api_url + "/post/ugc/delete",
      data: {
        id: id,
      },
      method: "POST",
    });
  },

  // 根据用户id获取用户的ugc列表
  getUserUgc(user_id, page, offset = 10, order_by = "create_time") {
    return service({
      url: URL.api_url + "/get/ugc/user/publish",
      data: {
        user_id,
        page,
        offset,
        order_by,
      },
    });
  },
  
  // 根据关键字搜索Ugc
  searchUgc(key = "", page, offset = 10, order_by = "create_time") {
    return service({
      url: URL.api_url + "/get/ugc",
      data: {
        key,
        page,
        offset,
        order_by,
      },
    });
  },

  // 根据label话题搜索Ugc
  searchLabelUgc(search_key = "", label_id, order_by, page, offset = 10) {
    return service({
      url: URL.api_url + "/get/label/ugc",
      data: {
        search_key,
        label_id,
        order_by,
        page,
        offset,
      },
    });
  },

  // 获取我的对应label下的ugc列表
  searchMyLabelUgc(search_key = "", label_id, order_by, page, offset = 10) {
    return service({
      url: URL.api_url + "/get/label/ugc/mine",
      data: {
        search_key,
        label_id,
        order_by,
        page,
        offset,
      },
    });
  },

  // 根据用户id获取用户的点赞列表
  getUserVote(user_id, page, offset = 10, order_by = "create_time") {
    return service({
      url: URL.api_url + "/get/ugc/user/vote",
      data: {
        user_id,
        page,
        offset,
        order_by,
      },
    });
  },
};
