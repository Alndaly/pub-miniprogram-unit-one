import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  getUserIdentityDetail(id) {
    return service({
      url: URL.api_url + "/post/user/identity/detail",
      data: {
        id,
      },
      method: "POST",
    });
  },
  updateUserLocation(longitude, latitude) {
    return service({
      url: URL.api_url + "/post/user/location/update",
      data: {
        latitude,
        longitude,
      },
      method: "POST",
    });
  },
  updateUserIdentity(id, organization_id, attachments, name, description) {
    return service({
      url: URL.api_url + "/post/user/identity/update",
      data: {
        id,
        organization_id,
        attachments,
        name,
        description,
      },
      method: "POST",
    });
  },
  addUserIdentity(organization_id, attachments, name, description) {
    return service({
      url: URL.api_url + "/post/user/identity/add",
      data: {
        organization_id,
        attachments,
        name,
        description,
      },
      method: "POST",
    });
  },
  deleteUserIdentity(id) {
    return service({
      url: URL.api_url + "/post/user/identity/delete",
      data: {
        id,
      },
      method: "POST",
    });
  },
  getUserIdentity(page_num, page_size) {
    return service({
      url: URL.api_url + "/post/user/identity",
      data: {
        page_num,
        page_size,
      },
      method: "POST",
    });
  },
  // 更新所在地
  changeMyLocation(newLocation) {
    const [province, city, district] = newLocation;
    return service({
      url: URL.api_url + "/post/user/info/change",
      data: {
        province,
        city,
        district,
      },
      method: "POST",
    });
  },

  changeMyQq(newQq) {
    return service({
      url: URL.api_url + "/post/user/info/change",
      data: {
        qq: newQq,
      },
      method: "POST",
    });
  },

  changeMyWeChat(newWeChat) {
    return service({
      url: URL.api_url + "/post/user/info/change",
      data: {
        wechat: newWeChat,
      },
      method: "POST",
    });
  },

  getUserProcess() {
    return service({
      url: URL.api_url + "/post/user/process",
      data: {},
      method: "POST",
    });
  },

  userUScoreRecord(page_num, page_size = 10) {
    return service({
      url: URL.api_url + "/post/user/we-score-record",
      data: {
        page_num,
        page_size,
      },
      method: "POST",
    });
  },

  getUserIndex() {
    return service({
      url: URL.api_url + "/post/user/index",
      data: {},
      method: "POST",
    });
  },

  // 更新背景
  changeMyBgImage(bg_image) {
    return service({
      url: URL.api_url + "/post/user/info/change",
      data: {
        bg_image,
      },
      method: "POST",
    });
  },

  // 更新生日
  changeMyBirthday(birthday) {
    return service({
      url: URL.api_url + "/post/user/info/change",
      data: {
        birthday,
      },
      method: "POST",
    });
  },

  // 获取我关注的用户列表
  getMyFocusedUser(page, offset = 20) {
    return service({
      url: URL.api_url + "/post/user/focus",
      data: {
        page: page,
        offset: offset,
      },
      method: "POST",
    });
  },

  // 获取关注我的用户列表
  getMyFans(page, offset = 20) {
    return service({
      url: URL.api_url + "/post/user/focused",
      data: {
        page: page,
        offset: offset,
      },
      method: "POST",
    });
  },

  checkIsNewUser(code) {
    return service({
      url: URL.api_url + "/post/user/isNewUser",
      data: {
        code,
      },
      method: "POST",
    });
  },

  // 更新用户session_key
  updateUserSessionKey(code) {
    return service({
      url: URL.api_url + "/post/user/session_key/update",
      data: {
        code,
      },
      method: "POST",
    });
  },

  // 用户注册
  initUser(jsCode) {
    return service({
      url: URL.api_url + "/post/user/create",
      method: "POST",
      data: {
        code: jsCode,
      },
      method: "POST",
    });
  },

  // 获取我的个人信息
  getMyUserInfo(e) {
    return service({
      url: URL.api_url + "/post/user/login",
      data: {},
      method: "POST",
    });
  },

  // 获取别人对我的收藏记录
  getCollectedMine(page, offset = 20) {
    return service({
      url: URL.api_url + "/post/user/my/collected",
      data: {
        page,
        offset,
      },
      method: "POST",
    });
  },

  // 获取别人对我的点赞记录
  getVotedMine(page_num, page_size = 10) {
    return service({
      url: URL.api_url + "/post/user/my/voted",
      data: {
        page_num: page_num - 1,
        page_size,
      },
      method: "POST",
    });
  },

  // 获取别人对我的评论记录
  getCommentedMine(page_num, page_size = 10) {
    return service({
      url: URL.api_url + "/post/user/my/commented",
      data: {
        page_num: page_num - 1,
        page_size,
      },
      method: "POST",
    });
  },

  // 关注某一个用户
  focusUser(user_id) {
    return service({
      url: URL.api_url + "/post/user/action/focus",
      data: {
        user_id,
        status: true,
      },
      method: "POST",
    });
  },

  // 取消关注某一个用户
  unFocusUser(user_id) {
    return service({
      url: URL.api_url + "/post/user/action/focus",
      data: {
        user_id,
        status: false,
      },
      method: "POST",
    });
  },

  // 根据用户id获取用户个人信息
  getUserInfoById(user_id) {
    return service({
      url: URL.api_url + "/get/user/info",
      data: {
        id: user_id,
      },
    });
  },

  // 更改我的性别
  changeMyGender(gender) {
    return service({
      url: URL.api_url + "/post/user/info/change",
      data: {
        gender,
      },
      method: "POST",
    });
  },

  changeMyInfo(avatar, nickname) {
    return service({
      url: URL.api_url + "/post/user/info/change",
      data: {
        avatar,
        nickname,
      },
      method: "POST",
    });
  },

  // 更改我的头像
  changeMyAvatar(avatar) {
    return service({
      url: URL.api_url + "/post/user/info/change",
      data: {
        avatar,
      },
      method: "POST",
    });
  },

  // 更改我的昵称
  changeMyUserName(nickname) {
    return service({
      url: URL.api_url + "/post/user/info/change",
      data: {
        nickname,
      },
      method: "POST",
    });
  },

  // 更改个性签名
  changeMySignature(signature) {
    return service({
      url: URL.api_url + "/post/user/info/change",
      data: {
        signature,
      },
      method: "POST",
    });
  },

  // 搜索用户
  searchUser(key, page, offset = 10) {
    return service({
      url: URL.api_url + "/get/user",
      data: {
        key,
        page,
        offset,
      },
    });
  },

  // 用户是否已关注公众号
  getFocusOfficialAccountStatus() {
    return service({
      url: URL.api_url + "/get/user/official_account/focus",
      data: {},
    });
  },

};
