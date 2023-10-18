import userApi from "../../../api/user";

Page({
  data: {
    page: 1,
  },

  toDetail(e) {
    const id = e.currentTarget.dataset.item.to.id;
    wx.$router.push("/pages/wall/ugcDetail/index" + { ugc_id: id });
  },

  async onLoad(options) {
    wx.showLoading({
      title: "加载中...",
    });
    let res = await userApi.getCommentedMine(0);
    this.setData({
      comment: res.data.data,
    });
    wx.hideLoading({
      success: (res) => {},
    });
  },

  async onPullDownRefresh() {
    wx.showLoading({
      title: "刷新中...",
    });
    let res = await userApi.getCommentedMine(
      1,
      this.data.page === 0 ? 20 : 20 * this.data.page
    );
    let comment = res.data.data;
    this.setData({
      comment,
    });
    wx.hideLoading({
      success: (res) => {},
    });
    wx.stopPullDownRefresh({
      success: (res) => {},
    });
  },

  async onReachBottom() {
    this.setData({
      isLoading: true,
    });
    let res = await userApi.getCommentedMine(this.data.page + 1);
    let commentNext = res.data.data;
    this.setData({
      "comment.list": [...this.data.comment.list, ...commentNext.list],
      page: commentNext.list.length === 0 ? this.data.page : this.data.page + 1,
    });
    this.setData({
      isLoading: false,
    });
  },
});
