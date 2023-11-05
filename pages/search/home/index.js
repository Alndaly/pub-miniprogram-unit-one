import fileUtils from "../../../utils/file";
import { formatTime } from "../../../utils/util";

Page({
  data: {
    searchHistory: [],
  },

  searchOnHotKey(e) {
    let searchKey = e.currentTarget.dataset.key;
    if (!searchKey) {
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "请输入搜索关键词",
      });
      return;
    }
    wx.$router.push("/pages/search/result/index", { key: searchKey });
  },

  goSearchKindPage(e) {
    const { kind } = e.currentTarget.dataset;
    switch (kind) {
      case "ugc":
        wx.$router.push("/pages/search/searchUgc/index");
        break;
      case "user":
        wx.$router.push("/pages/search/searchUser/index");
        break;
      case "activity":
        wx.$router.push("/pages/search/searchActivity/index");
        break;
    }
  },
  searchByHistory(e) {
    let searchKey = e.currentTarget.dataset.content;
    if (!searchKey) {
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "请输入搜索关键词",
      });
      return;
    }
    wx.$router.push("/pages/search/result/index", { key: searchKey });
  },

  async searchByContent(e) {
    if (!this.data.searchContent) {
      wx.showModal({
        showCancel: false,
        title: "提示",
        content: "请输入搜索关键词",
      });
      return;
    }
    // 记录搜索内容到本地
    let time = formatTime(Date.now());
    let data = this.data.searchHistory;
    let item = {
      name: this.data.searchContent,
      time: time,
    };
    data.push(item);
    let search_file = "/search/history.json";
    let res = await fileUtils.writeFile(search_file, JSON.stringify(data));
    wx.$router.push("/pages/search/result/index", {
      key: this.data.searchContent,
    });
  },

  // 清空搜索记录
  async clearSearchHistory(e) {
    this.setData({
      searchHistory: [],
    });
    let search_file = "/search/history.json";
    let res = await fileUtils.writeFile(search_file, "[]");
  },

  clearSingleHistory(e) {
    const _this = this;
    let id = e.currentTarget.dataset.id;
    let search_file = "/search/history.json";
    wx.showModal({
      title: "提醒",
      content: "确定删除这条记录吗？",
      async success(res) {
        if (res.confirm) {
          let data = _this.data.searchHistory;
          data.splice(id, 1);
          let res_file = await fileUtils.writeFile(
            search_file,
            JSON.stringify(data)
          );
          _this.setData({
            searchHistory: data,
          });
        }
      },
    });
  },

  // 初始化搜索文件夹以及文件
  async initSearchFile() {
    // 获取搜索文件夹是否存在
    let search_directory = "/search/";
    let search_directory_exist = await fileUtils.hasFileOrPath(
      search_directory
    );
    //  如果搜索文件夹不存在就新建
    if (!search_directory_exist) {
      let res_make = await fileUtils.makeDir(search_directory);
    }
    // 获取搜索记录文件是否存在
    let search_file = "/search/history.json";
    let search_file_exist = await fileUtils.hasFileOrPath(search_file);
    // 如果搜索记录文件不存在就新建
    if (!search_file_exist) {
      let res_search_file = await fileUtils.openFile(search_file, "ax");
      let res_init_file = await fileUtils.writeFile(search_file, "[]");
    }
  },

  async onShow(options) {
    const _this = this;
    let search_file = "/search/history.json";
  },

  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中...",
    });
    await this.onShow();
    wx.showToast({
      title: "刷新成功",
    });
    wx.stopPullDownRefresh();
  },
});
