Page({
  data: {
    searchContent: "",
    searchHistory: [],
  },

  async searchByContent(e) {
    wx.$router.push("/pages/search/result/index", {
      key: this.data.searchContent,
    });
  },
});
