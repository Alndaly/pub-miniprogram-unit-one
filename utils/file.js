import cache from "cache";

export default {
  // 将临时文件存储为本地文件（注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用）
  saveTempFile(tempFilePath) {
    return Promise((resolve, reject) => {
      wx.saveFile({
        tempFilePath: tempFilePath,
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 删除本地缓存文件
  removeSavedFile(filePath) {
    return Promise((resolve, reject) => {
      wx.removeSavedFile({
        filePath: filePath,
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 新页面打开文件
  openDocumentInNewPage(filePath, fileType) {
    return new Promise((resolve, reject) => {
      wx.openDocument({
        filePath: filePath,
        fileType: fileType,
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 获取本地已经缓存的文件的列表
  getSaveFileList() {
    return Promise(() => {
      wx.getSavedFileList({
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 打开文件（返回文件描述符）
  // flag:（默认情况下用于读取和追加）
  // a	打开文件用于追加。 如果文件不存在，则创建该文件
  // ax	类似于 'a'，但如果路径存在，则失败
  // a+	打开文件用于读取和追加。 如果文件不存在，则创建该文件
  // ax+	类似于 'a+'，但如果路径存在，则失败
  // as	打开文件用于追加（在同步模式中）。 如果文件不存在，则创建该文件
  // as+	打开文件用于读取和追加（在同步模式中）。 如果文件不存在，则创建该文件
  // r	打开文件用于读取。 如果文件不存在，则会发生异常
  // r+	打开文件用于读取和写入。 如果文件不存在，则会发生异常
  // w	打开文件用于写入。 如果文件不存在则创建文件，如果文件存在则截断文件
  // wx	类似于 'w'，但如果路径存在，则失败
  // w+	打开文件用于读取和写入。 如果文件不存在则创建文件，如果文件存在则截断文件
  // wx+	类似于 'w+'，但如果路径存在，则失败
  openFile(filePath, flag = "a+") {
    const fs = wx.getFileSystemManager();
    return new Promise((resolve, reject) => {
      fs.open({
        filePath: `${wx.env.USER_DATA_PATH}` + filePath,
        flag: flag,
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 关闭文件（fd：文件描述符）
  closeFile(fd) {
    return new Promise(() => {
      fs.close({
        fd: res.fd,
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 获取本地文件的文件信息。（只能用于获取已保存到本地的文件）
  // 会返回文件大小和文件保存时的时间戳，从1970/01/01 08:00:00 到该时刻的秒数
  getSavedFileList() {
    return Promise((resolve, reject) => {
      wx.getSavedFileList({
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 获取文件信息（此接口可以获取临时文件的信息，但是返回的结果中不含时间）
  // 只能返回文件大小和按照传入的 digestAlgorithm 计算得出的的文件摘要
  getFileInfo() {
    return Promise((resolve, reject) => {
      wx.getFileInfo({
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 查看是否存在对应文件（此处默认在用户目录wx.env.USER_DATA_PATH下搜索）
  hasFileOrPath(path) {
    const fs = wx.getFileSystemManager();
    return new Promise((resolve, reject) => {
      fs.access({
        path: `${wx.env.USER_DATA_PATH}` + path,
        success(res) {
          // 文件存在
          resolve(true);
        },
        fail(res) {
          resolve(false);
        },
      });
    });
  },

  // 下载文件封装
  downloadFile(args) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        header: {
          version: "1.0.0",
          Authorization: cache.get("Authorization"),
          "content-type": "application/json",
        },
        ...args,
        success: (res) => resolve(res),
        fail: (err) => {
          reject(err);
          wx.showToast({
            title: "网络出错",
            icon: "error",
          });
        },
      });
    });
  },

  // 上传文件封装
  uploadFile(args) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        header: {
          version: "1.0.0",
          Authorization: cache.get("Authorization"),
          "content-type": "application/json",
        },
        ...args,
        success: (res) => resolve(res),
        fail: (err) => {
          reject(err);
          wx.showToast({
            title: "网络出错",
            icon: "error",
          });
        },
      });
    });
  },

  // 获取文件的状态信息
  // （fd）文件描述符
  fstatFile(fd) {
    const fs = wx.getFileSystemManager();
    return new Promise(() => {
      fs.fstat({
        fd: fd,
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 读取目录下的文件列表
  readDir(path) {
    const fs = wx.getFileSystemManager();
    return new Promise((resolve, reject) => {
      fs.readdir({
        dirPath: `${wx.env.USER_DATA_PATH}/` + path,
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 读取文件内容
  readFile(path, encoding = "utf8") {
    const fs = wx.getFileSystemManager();
    return new Promise((resolve, reject) => {
      // 打开文件
      fs.readFile({
        filePath: `${wx.env.USER_DATA_PATH}` + path,
        encoding: encoding,
        position: 0,
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 保存图片到本地相册
  // filePath 图片文件路径，可以是临时文件路径或永久文件路径 (本地路径) ，不支持网络路径
  saveImageToPhotosAlbum(filePath) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: filePath,
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 保存视频到本地相册
  saveVideoToPhotosAlbum(filePath) {
    return new Promise((resolve, reject) => {
      wx.saveVideoToPhotosAlbum({
        filePath: filePath,
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 创建目录
  makeDir(path) {
    const fs = wx.getFileSystemManager();
    return new Promise((resolve, reject) => {
      fs.mkdir({
        dirPath: `${wx.env.USER_DATA_PATH}` + path,
        // 默认如果父级目录不存在就报错
        recursive: false,
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  },

  // 追加文件内容
  appendFile(path, data) {
    const fs = wx.getFileSystemManager();
    return new Promise((resolve, reject) => {
      fs.open({
        filePath: `${wx.env.USER_DATA_PATH}` + path,
        flag: "a+",
        success(res) {
          // 写入文件
          fs.write({
            fd: res.fd,
            data: data,
            success(res) {
              resolve(res);
            },
            fail(res) {
              reject(res);
            },
          });
        },
      });
    });
  },

  // 文件追加
  appendFile(path, data) {
    const fs = wx.getFileSystemManager();
    return new Promise((resolve, reject) => {
      fs.appendFile({
        filePath: `${wx.env.USER_DATA_PATH}` + path,
        encoding: "utf8",
        data: data,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  },

  // 写文件
  writeFile(path, data) {
    const fs = wx.getFileSystemManager();
    return new Promise((resolve, reject) => {
      fs.open({
        filePath: `${wx.env.USER_DATA_PATH}` + path,
        flag: "w+",
        success(res) {
          // 写入文件
          fs.write({
            fd: res.fd,
            data: data,
            success(res) {
              resolve(res);
            },
            fail(res) {
              reject(res);
            },
          });
        },
      });
    });
  },
};
