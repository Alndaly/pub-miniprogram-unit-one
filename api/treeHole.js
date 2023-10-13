import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  getAnonymousIdentity() {
    return service({
      url: URL.api_url + "/tree-hole/anonymous/identity",
      data: {},
      method: "POST",
    });
  },
  reGenerateAnonymousIdentity() {
    return service({
      url: URL.api_url + "/tree-hole/anonymous/regenerate",
      data: {},
      method: "POST",
    });
  },
  // 增加树洞
  addTreeHole(detail, attachments, use_gpt) {
    return service({
      url: URL.api_url + "/tree-hole/add",
      data: { detail, attachments, use_gpt },
      method: "POST",
    });
  },
  // 获取树洞详情
  getTreeHoleDetail(id) {
    return service({
      url: URL.api_url + "/tree-hole/detail",
      data: { id },
      method: "POST",
    });
  },
  // 删除树洞
  deleteTreeHole(id) {
    return service({
      url: URL.api_url + "/tree-hole/delete",
      data: {
        id,
      },
      method: "POST",
    });
  },
  // 获取树洞列表
  getAllTreeHoleList(search_key, order_by, page_num, page_size) {
    return service({
      url: URL.api_url + "/tree-hole/list",
      data: {
        search_key,
        order_by,
        page_num,
        page_size,
      },
      method: "POST",
    });
  },
  // 更新树洞
  updateTreeHole(id, new_data) {
    return service({
      url: URL.api_url + "/tree-hole/list",
      data: {
        id,
        new_data,
      },
      method: "POST",
    });
  },
  // 评论
  addComment(id, detail, parent_id, reply_to_id) {
    return service({
      url: URL.api_url + "/tree-hole/comment/add",
      data: {
        id,
        detail,
        parent_id,
        reply_to_id,
      },
      method: "POST",
    });
  },
  // 获取树洞评论列表
  getTreeHoleCommentList(id, page_num, page_size, order_by) {
    return service({
      url: URL.api_url + "/tree-hole/comment/list",
      data: {
        id,
        page_num,
        page_size,
        order_by,
      },
      method: "POST",
    });
  },
  // 点赞树洞
  voteTreeHole(id, status) {
    return service({
      url: URL.api_url + "/tree-hole/vote",
      data: {
        id,
        status,
      },
      method: "POST",
    });
  },
  // 点赞树洞的评论
  voteTreeHoleComment(id, status) {
    return service({
      url: URL.api_url + "/tree-hole/comment/vote",
      data: {
        id,
        status: status,
      },
      method: "POST",
    });
  },
};
