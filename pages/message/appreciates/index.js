import userApi from '../../../api/user'

Page({

  data: {
    page: 0,
    isLoading: false
  },

  toDetail(e) {
    const id = e.currentTarget.dataset.item.to.id
    wx.$router.push("/pages/wall/ugcDetail/index" + { ugc_id: id });
  },

  async onLoad(options) {
    wx.showLoading({
      title: '加载中...',
    })
    let res = await userApi.getVotedMine(1)
    console.log('获取点赞我的记录: ', res)
    this.setData({
      vote: res.data.data
    })
    wx.hideLoading({
      success: (res) => {},
    })
  },

  async onPullDownRefresh() {
    wx.showLoading({
      title: '刷新中...',
    })
    let res = await userApi.getVotedMine(1, 20 * this.data.page)
    console.log('点赞我的:', res)
    let vote = res.data.data
    this.setData({
      vote
    })
    wx.hideLoading({
      success: (res) => {},
    })
    wx.stopPullDownRefresh({
      success: (res) => {},
    })
  },

  async onReachBottom() {
    this.setData({
      isLoading: true
    })
    let res = await userApi.getVotedMine(this.data.page + 1)
    console.log('点赞我的: ', res)
    let voteNext = res.data.data
    this.setData({
      'vote.list': [...this.data.vote.list, ...voteNext.list]
    })
    this.setData({
      isLoading: false
    })
  },

})