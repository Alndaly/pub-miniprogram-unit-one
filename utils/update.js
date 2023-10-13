import cache from "./cache";

function updateApp(e) {
  const updateManager = wx.getUpdateManager();
  updateManager.onCheckForUpdate(function (res) {

  });
  updateManager.onUpdateReady(function () {
    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
    updateManager.applyUpdate();
  });
  updateManager.onUpdateFailed(function () {
    // 新版本下载失败
    wx.showModal({
      title: "提醒",
      content: "微校新版本更新失败啦，重启尝试下哦。",
      showCancel: false,
    });
  });
}

module.exports = {
  updateApp,
};
