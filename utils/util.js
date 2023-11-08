import cache from "./cache";

const formatTime = (time) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [year, month, day].join("-") + " " + [hour, minute, second].join(":");
};

/**
 *获取当前星期几
 *
 */
function getWeekDate() {
  let now = new Date();
  let day = now.getDay();
  let weeks = new Array(
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  );
  let week = weeks[day];
  return week;
}

function getNowDate() {
  var myDate = new Date();
  var year = myDate.getFullYear(); //获取当前年
  var mon = myDate.getMonth() + 1; //获取当前月
  var date = myDate.getDate(); //获取当前日
  var hours = myDate.getHours(); //获取当前小时
  var minutes = myDate.getMinutes(); //获取当前分钟
  var seconds = myDate.getSeconds(); //获取当前秒
  var now =
    year + "-" + mon + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  return now;
}

const getParamsFromURL = (url) => {
  let params = {};
  let parts = url.split("?");
  if (parts.length > 1) {
    let query = parts[1];
    let pairs = query.split("&");
    pairs.forEach((pair) => {
      let [key, value] = pair.split("=");
      params[key] = decodeURIComponent(value);
    });
  }
  return params;
};

const checkMyUgc = (ugc) => {
  if (cache.get("user_id") == ugc.user_info.id) {
    return true;
  }
  return false;
};

const removeHtmlTag = (e) => {
  // 正则匹配删除富文本的标头
  return e.replace(/<[^>]*>|<\/[^>]*>/gm, "").replace(/&.*?;/gm, "");
};

const isNull = (e) => {
  let str = e.replace(/<[^<>]+>/g, "").replace(/&nbsp;/gi, "");
  if (str == "") return true;
  var regu = "^[ ]+$";
  var re = new RegExp(regu);
  return re.test(str);
};

function getPageUrl() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = `/${currentPage.route}`;
  return url;
}

/*获取当前页参数*/
function getCurrentPageParam() {
  let pages = getCurrentPages(); //获取加载的页面
  let currentPage = pages[pages.length - 1]; //获取当前页面的对象
  let options = currentPage.options; //如果要获取url中所带的参数可以查看options
  return options;
}

function uuid(len, radix) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  var uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
}

/**
 * 将promise对象返回函数转为数组
 * @param promise
 * @returns []
 */
const to = (promise) => {
  return new Promise((resolve) => {
    promise.then(
      (res) => {
        return resolve([res, null]);
      },
      (err) => {
        return resolve([null, err]);
      }
    );
  });
};

// 将文本中的表情符号替换为对应的图片
function replaceEmotions(text = "", emotion_icons) {
  for (const [index, value] of emotion_icons.entries()) {
    const regex = new RegExp(value.name, "g");
    let newData = "";
    if (value.type === "text") {
      newData = value.html_content;
    } else if (value.type === "url") {
      newData = `<img src="${emotion_icons[emotion_icon]}" alt="${emotion_icon}" />`;
    }
    text = text.replace(regex, newData);
  }
  return text;
}

const urlEncode = (obj) => {
  let params = Object.keys(obj)
    .filter((key) => obj[key] !== null && obj[key] !== undefined)
    .map((key) => {
      // 此处暂时不需要urlencode
      // return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
      return key + "=" + obj[key];
    })
    .join("&");
  return params;
};

function replaceHighLight(content = "", search_key) {
  const regex = new RegExp(search_key, "g");
  let newData = "";
  newData = `<div style="display: inline; font-weight: bold; color: #ff8c31;">${search_key}</div>`;
  const text = content.replace(regex, newData);
  return text;
}

module.exports = {
  replaceHighLight,
  removeHtmlTag,
  formatTime,
  isNull,
  urlEncode,
  checkMyUgc,
  getPageUrl,
  uuid,
  getCurrentPageParam,
  getNowDate,
  to,
  replaceEmotions,
  getWeekDate,
  getParamsFromURL,
};
