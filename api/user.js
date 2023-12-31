import { service } from "../utils/service";
import { BaseConfig } from "../configs/base";

export default {
  searchLikeMeLog(pageNum, pageSize = 10) {
    return service({
      url: BaseConfig.API_URL + "/user/liked",
      data: {
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
  searchCommentMeLog(pageNum, pageSize = 10) {
    return service({
      url: BaseConfig.API_URL + "/user/commented",
      data: {
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
  // 获取我关注的用户列表
  getMyFollowedUser(pageNum, pageSize = 20) {
    return service({
      url: BaseConfig.API_URL + "/user/myFollow",
      data: {
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
  // 获取关注我的用户列表
  getMyFans(pageNum, pageSize = 20) {
    return service({
      url: BaseConfig.API_URL + "/user/myFan",
      data: {
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
  // 根据用户ID获取用户的帖子列表
  getUserPost(id, keyword, pageNum, pageSize = 10) {
    return service({
      url: BaseConfig.API_URL + "/user/post",
      data: {
        id,
        keyword,
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
  // 关注某一个用户
  followUser(id) {
    return service({
      url: BaseConfig.API_URL + "/user/follow",
      data: {
        id,
      },
      method: "POST",
    });
  },
  // 取消关注某一个用户
  unFollowUser(id) {
    return service({
      url: BaseConfig.API_URL + "/user/unFollow",
      data: {
        id,
      },
      method: "POST",
    });
  },
  // 刷新token
  refreshUserToken(refreshToken) {
    return service({
      url: BaseConfig.API_URL + "/user/token/refresh",
      data: {
        refreshToken,
      },
      method: "POST",
    });
  },
  // 用户注册
  getUserToken(jsCode) {
    return service({
      url: BaseConfig.API_URL + "/user/token",
      data: {
        code: jsCode,
        loginMethod: 'wx_mini',
        appId: BaseConfig.UNIT_ONE_APP_ID
      },
      method: "POST",
    });
  },
  // 获取我的个人信息
  getMyUserInfo(e) {
    return service({
      url: BaseConfig.API_URL + "/user/myInfo",
      data: {},
      method: "POST",
    });
  },
  // 根据用户id获取用户个人信息
  getUserInfoById(id) {
    return service({
      url: BaseConfig.API_URL + "/user/detail",
      data: {
        id,
      },
      method: "POST",
    });
  },
  // 搜索用户
  searchUser(keyword, pageNum, pageSize = 10) {
    return service({
      url: BaseConfig.API_URL + "/user/search",
      data: {
        keyword,
        pageNum,
        pageSize,
      },
      method: "POST",
    });
  },
  changeMyBgImage(bgAttachment) {
    return service({
      url: BaseConfig.API_URL + "/user/update",
      data: {
        newUserData: {
          bgAttachment,
        },
      },
      method: "POST",
    });
  },
  // 更改个性签名
  changeMySignature(signature) {
    return service({
      url: BaseConfig.API_URL + "/user/update",
      data: {
        newUserData: {
          signature,
        },
      },
      method: "POST",
    });
  },
  changeMyLocation(longitude, latitude) {
    return service({
      url: BaseConfig.API_URL + "/user/update",
      data: {
        newUserData: {
          location: {
            longitude,
            latitude,
          },
        },
      },
      method: "POST",
    });
  },
  changeMyQq(qq) {
    return service({
      url: BaseConfig.API_URL + "/user/update",
      data: {
        newUserData: {
          qq,
        },
      },
      method: "POST",
    });
  },
  changeMyBirthday(birthday) {
    return service({
      url: BaseConfig.API_URL + "/user/update",
      data: {
        newUserData: {
          birthday,
        },
      },
      method: "POST",
    });
  },
  changeMyWeChat(wechat) {
    return service({
      url: BaseConfig.API_URL + "/user/update",
      data: {
        newUserData: {
          wechat,
        },
      },
      method: "POST",
    });
  },
  // 更改我的性别
  changeMyGender(gender) {
    return service({
      url: BaseConfig.API_URL + "/user/update",
      data: {
        newUserData: {
          gender,
        },
      },
      method: "POST",
    });
  },
  // 更改我的头像
  changeMyAvatar(avatar) {
    return service({
      url: BaseConfig.API_URL + "/user/update",
      data: {
        newUserData: {
          avatar,
        },
      },
      method: "POST",
    });
  },
  // 更改我的昵称
  changeMyNickname(nickname) {
    return service({
      url: BaseConfig.API_URL + "/user/update",
      data: {
        newUserData: {
          nickname,
        },
      },
      method: "POST",
    });
  },
  getUserPrivacy() {
    return service({
      url: BaseConfig.API_URL + "/user/privacy",
      data: {},
      method: "POST",
    });
  },
  updateUserPrivacyLocation(location) {
    return service({
      url: BaseConfig.API_URL + "/user/privacy/update",
      data: {
        newUserPrivacy: {
          location,
        },
      },
      method: "POST",
    });
  },
  updateUserPrivacyQq(qq) {
    return service({
      url: BaseConfig.API_URL + "/user/privacy/update",
      data: {
        newUserPrivacy: {
          qq,
        },
      },
      method: "POST",
    });
  },
  updateUserPrivacyWechat(wechat) {
    return service({
      url: BaseConfig.API_URL + "/user/privacy/update",
      data: {
        newUserPrivacy: {
          wechat,
        },
      },
      method: "POST",
    });
  },
  updateUserPrivacyBirthday(birthday) {
    return service({
      url: BaseConfig.API_URL + "/user/privacy/update",
      data: {
        newUserPrivacy: {
          birthday,
        },
      },
      method: "POST",
    });
  },
  updateUserPrivacyWechat(wechat) {
    return service({
      url: BaseConfig.API_URL + "/user/privacy/update",
      data: {
        newUserPrivacy: {
          wechat,
        },
      },
      method: "POST",
    });
  },
  updateUserPrivacyGender(gender) {
    return service({
      url: BaseConfig.API_URL + "/user/privacy/update",
      data: {
        newUserPrivacy: {
          gender,
        },
      },
      method: "POST",
    });
  },
};
