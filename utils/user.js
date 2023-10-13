import cache from "./cache";
import userApi from "../api/user";
import { auth } from "../configs/user";
import { to } from "../utils/util";

export default {
  loginOut() {
    wx.clearStorage({
      success: (res) => {
        console.log("缓存清除成功");
      },
    });
  },

  async updateLocalUserInfo() {
    const res_info = await userApi.getMyUserInfo();
    console.log("状态符更新后的用户信息：", res_info);
    // 将用户id和账户状态保存在缓存供之后使用，借此判断用户登陆情况
    cache.set("user_id", res_info.data.data.id);
    cache.set("nickname", res_info.data.data.nickname);
    cache.set("avatar", res_info.data.data.avatar);
    cache.set("account_status", res_info.data.data.account_status);
  },

  getGender(gender_code) {
    let gender_cn;
    switch (gender_code) {
      case 1:
        gender_cn = "男";
        break;
      case 2:
        gender_cn = "女";
        break;
      case 0:
        gender_cn = "未知";
        break;
      default:
        break;
    }
    return gender_cn;
  },

  // 是否已注册，并绑定信息
  hasSignUp() {
    let res = cache.get("account_status");
    // 防止js对0为false的判断
    if (res == "0") {
      return true;
    }
    if (!res) {
      return false;
    }
    return true;
  },

  // 是否正常打开小程序（用户Authorization信息是否已唯一）
  hasAuthorization() {
    let res = cache.get("Authorization");
    if (!res) {
      return false;
    }
    return true;
  },

  async checkUserInfoExists() {
    let res_nickname = cache.get("nickname");
    let res_avatar = cache.get("avatar");
    if (!res_nickname || !res_avatar) {
      const res_info = await userApi.getMyUserInfo();
      // 将用户id和账户状态保存在缓存供之后使用，借此判断用户登陆情况
      cache.set("user_id", res_info.data.data.id);
      cache.set("nickname", res_info.data.data.nickname);
      cache.set("avatar", res_info.data.data.avatar);
      cache.set("account_status", res_info.data.data.account_status);
      if (!res_info.data.data.avatar || !res_info.data.data.nickname) {
        return false;
      }
    }
    return true;
  },

  checkUserAbility(ability) {
    let account_status = cache.get("account_status");
    console.log("账户状态:", account_status);
    if (auth[account_status].indexOf(ability) != -1) {
      return false;
    }
    return true;
  },

  async checkIsNew() {
    if (cache.get("new_user")) {
      return cache.get("new_user");
    } else {
      const code = await wx.login();
      const [res_is_new, err_is_new] = await to(
        userApi.checkIsNewUser(code.code)
      );
      if (res_is_new.data.data === false) {
        cache.set("new_user", res_is_new.data.data);
      }
      return res_is_new.data.data;
    }
  },

  getSessionStatus(params) {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success(res) {
          resolve(true);
        },
        fail(err) {
          resolve(false);
        },
      });
    });
  },
};
