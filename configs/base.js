// tips: 策略模式是一种比较不错的设计模式，你可以自行在version对象中补充test/prod环境等

const version = {
  // 本地开发 
  develop: {

    // UnitOne主服务
    // API_URL: "http://127.0.0.1:8001",
    // SIGNATURE_URL: "http://127.0.0.1:8010",
    UNIT_ONE_APP_ID: 6, // 改为你在UnitOne管理台中创建的应用的ID
    API_URL: "https://api.unit-one.top", // 此处不要动，是UnitOne的后端服务

    // 图片上传服务
    SIGNATURE_URL: "https://upload.unit-one.top",
    OSS_BUCKET: "unit-one",
    OSS_REGION: "oss-cn-beijing",

    // 海报生成服务
    // tips: 默认海报生成服务用的是https://www.imgrender.cn，此处的key仅作为测试使用，有限额，如果遇到超额的情况请自行注册配置，也可以直接联系我。 
    // 当然，海报生成也可以使用我自己搭建的服务，具体配置和开发详情见官网 https://uniapi.top/api-refrence/image.html#制作海报，但是因为个人服务器的关系，配置比较低，会比较卡啦～
    IMG_RENDER_API_KEY: "169914845695713274.1Rm1Nlo5frfNwTGHNfjK5eky2bfFLm1T",
    IMG_RENDER_URL: "https://api.imgrender.cn/open/v1/pics",

  },
  
  // 体验版
  trial: {

    // UnitOne主服务
    // API_URL: "http://127.0.0.1:8001",
    // SIGNATURE_URL: "http://127.0.0.1:8010",
    UNIT_ONE_APP_ID: 6, // 改为你在UnitOne管理台中创建的应用的ID
    API_URL: "https://api.unit-one.top", // 此处不要动，是UnitOne的后端服务

    // 图片上传服务
    SIGNATURE_URL: "https://upload.unit-one.top",
    OSS_BUCKET: "unit-one",
    OSS_REGION: "oss-cn-beijing",

    // 海报生成服务
    // tips: 默认海报生成服务用的是https://www.imgrender.cn，此处的key仅作为测试使用，有限额，如果遇到超额的情况请自行注册配置，也可以直接联系我。 
    // 当然，海报生成也可以使用我自己搭建的服务，具体配置和开发详情见官网 https://uniapi.top/api-refrence/image.html#制作海报，但是因为个人服务器的关系，配置比较低，会比较卡啦～
    IMG_RENDER_API_KEY: "169914845695713274.1Rm1Nlo5frfNwTGHNfjK5eky2bfFLm1T",
    IMG_RENDER_URL: "https://api.imgrender.cn/open/v1/pics",

  },
};

export const BaseConfig =
  version[wx.getAccountInfoSync().miniProgram.envVersion];
