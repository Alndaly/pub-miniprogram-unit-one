import { service } from "../utils/service";
import { BaseConfig } from "../configs/base";

export default {
  // 点赞Ugc
  likePost(id) {
    return service({
      url: BaseConfig.API_URL + "/post/like",
      data: {
        id,
      },
      method: "POST",
    });
  },
  unLikePost(id) {
    return service({
      url: BaseConfig.API_URL + "/post/unLike",
      data: {
        id,
      },
      method: "POST",
    });
  },
  // 获取Ugc详情
  getPostDetail(id) {
    return service({
      url: BaseConfig.API_URL + "/post/detail",
      data: {
        id,
      },
      method: "POST",
    });
  },
  // 根据关键字搜索某个Label下的Ugc
  searchLabelPost(id, keyword, pageNum, pageSize = 10) {
    return service({
      url: BaseConfig.API_URL + "/label/post",
      data: {
        id,
        keyword,
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
  // 根据关键字搜索Ugc
  searchPost(keyword = "", pageNum, pageSize = 10) {
    return service({
      url: BaseConfig.API_URL + "/post/search",
      data: {
        keyword,
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
  // 点赞帖子
  likeComment(id) {
    return service({
      url: BaseConfig.API_URL + "/post/comment/like",
      data: {
        id,
      },
      method: "POST",
    });
  },
  // 取消点赞帖子
  unLikeComment(id) {
    return service({
      url: BaseConfig.API_URL + "/post/comment/unLike",
      data: {
        id,
      },
      method: "POST",
    });
  },
  // 获取帖子的评论列表
  getComment(id, pageNum, pageSize = 10) {
    return service({
      url: BaseConfig.API_URL + "/post/comment/list",
      data: {
        id,
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
  // 获取帖子的评论的评论列表
  getCommentComment(parentId, pageNum, pageSize = 10) {
    return service({
      url: BaseConfig.API_URL + "/post/comment/comment/list",
      data: {
        parentId,
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
  // 评论Ugc
  commentPost(postId, content) {
    return service({
      url: BaseConfig.API_URL + "/post/comment/add",
      data: {
        postId,
        content,
      },
      method: "POST",
    });
  },
  // 评论Ugc的评论
  commentPostComment(postId, parentId, replyToId, content) {
    return service({
      url: BaseConfig.API_URL + "/post/comment/comment/add",
      data: {
        postId,
        parentId,
        replyToId,
        content,
      },
      method: "POST",
    });
  },
  // 发布帖子
  addPost(title, content, attachmentInfoList, labelInfoList) {
    return service({
      url: BaseConfig.API_URL + "/post/add",
      data: {
        title,
        content,
        attachmentInfoList,
        labelInfoList,
      },
      method: "POST",
    });
  },
  // 修改帖子
  updatePost(id, title, content, attachmentInfoList, labelInfoList) {
    return service({
      url: BaseConfig.API_URL + "/post/update",
      data: {
        id,
        title,
        content,
        attachmentInfoList,
        labelInfoList,
      },
      method: "POST",
    });
  },
  // 删除帖子
  deletePost(id) {
    return service({
      url: BaseConfig.API_URL + "/post/delete",
      data: {
        id,
      },
      method: "POST",
    });
  },
  // 获取我发布的Ugc列表
  searchMyPost(keyword, pageNum, pageSize = 10) {
    return service({
      url: BaseConfig.API_URL + "/post/mine",
      data: {
        keyword,
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
  getPostCommentDetailWithParent(id) {
    return service({
      url: BaseConfig.API_URL + "/post/comment/detail",
      data: {
        id,
      },
      method: "POST",
    });
  },
  getPostCommentExceptComment(id, topId, pageNum, pageSize = 10) {
    return service({
      url: BaseConfig.API_URL + "/post/comment/list/top",
      data: {
        id,
        topId,
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
  // 获取我点赞的Ugc
  getMyLiked(keyword, pageNum, pageSize = 10) {
    return service({
      url: BaseConfig.API_URL + "/post/liked",
      data: {
        keyword,
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
};
