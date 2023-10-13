// pages/myInfo/myAttention.js
import userApi from '../../../api/user'

Page({

  data: {
    page: 0,
    focusList: [],
    isLoading: false
  },

  toUserInfo(e) {
    const { id } = e.currentTarget.dataset.id;
    wx.$router.push("/pages/userInfo/index", { user_id: id });
  },

  async onLoad() {
    wx.showLoading({
      title: '加载中...',
    })
    let res = await userApi.getMyFocusedUser(0)
    console.log('我关注的用户: ', res)
    if (res.data.code != '20000') {
      return
    }
    this.setData({
      focusList: res.data.data,
      isLoading: false
    })
    wx.hideLoading({
      success: (res) => {},
    })
  },

  async onPullDownRefresh(e) {
    wx.showLoading({
      title: '刷新中',
    })
    let res = await userApi.getMyFocusedUser(0, this.data.page === 0 ? 10 : (this.data.page + 1) * 10)
    console.log('我关注的用户: ', res)
    if (res.data.code != '20000') {
      return
    }
    this.setData({
      focusList: res.data.data,
      isLoading: false
    })
    wx.hideLoading({
      success: (res) => {},
    })
    wx.stopPullDownRefresh()
  },

  async onReachBottom() {
    this.setData({
      isLoading: true,
    })
    let res = await userApi.getMyFocusedUser(this.data.page + 1)
    console.log('我关注的用户: ', res)
    if (res.data.code != '20000') {
      return
    }
    let focusListNext = res.data.data
    this.setData({
      page: focusListNext.list.length > 0 ? this.data.page + 1 : this.data.page,
      'focusList.list': [...this.data.focusList.list, ...focusListNext.list],
      isLoading: false
    })
  },

})