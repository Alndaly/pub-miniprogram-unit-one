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

  goSearchKindPage(e) {
    const { kind } = e.currentTarget.dataset;
    if (kind === "user") wx.$router.push("/pages/search/searchUser/index");
    else wx.$router.push("/pages/search/searchUgc/index");
  },
});
