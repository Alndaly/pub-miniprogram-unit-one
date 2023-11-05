const version = {
  // 本地开发
  develop: {
    SIGNATURE_URL: "http://127.0.0.1:8010",
    API_URL: "http://127.0.0.1:8001",
    OSS_BUCKET: "unit-one",
    OSS_REGION: "oss-cn-beijing",
    // https://www.imgrender.cn 海报生成服务的apikey
    // 海报生成也可以使用我搭建的服务（需要修改很多代码，官网文档比较详细，这里就不做范例了） 详情见官网 https://uniapi.top 但是因为服务器的关系 比较不稳定
    IMG_RENDER_API_KEY: "169914845695713274.1Rm1Nlo5frfNwTGHNfjK5eky2bfFLm1T",
    IMG_RENDER_URL: "https://api.imgrender.cn/open/v1/pics",
  },
};

export const BaseConfig =
  version[wx.getAccountInfoSync().miniProgram.envVersion];
