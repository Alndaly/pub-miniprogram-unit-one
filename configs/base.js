const version = {
  // 本地开发
  develop: {
    ws_url: "ws://127.0.0.1:8991/ws/message",
    api_url: "http://127.0.0.1:8991",
  },
  trial: {
    ws_url: "wss://prod.weixiao.zuowu.cc/xcx/ws/message",
    api_url: "https://prod.weixiao.zuowu.cc/xcx",
  },
};

const BASE_IMG_URL = "image/"; //图片上传OSS的路径

// https://www.imgrender.cn 海报生成服务的apikey
// 海报生成也可以使用我搭建的服务（需要修改很多代码，官网文档比较详细，这里就不做范例了） 详情见官网 https://uniapi.top 但是因为服务器的关系 比较不稳定
const IMG_RENDER_API_KEY =
  "169914845695713274.1Rm1Nlo5frfNwTGHNfjK5eky2bfFLm1T";

const OSS_URL = "https://oss.weixiao.zuowu.cc";
const IMG_RENDER_URL = "https://api.imgrender.cn/open/v1/pics";

const URL = version[wx.getAccountInfoSync().miniProgram.envVersion];

export { URL, BASE_IMG_URL, OSS_URL, IMG_RENDER_API_KEY, IMG_RENDER_URL };
