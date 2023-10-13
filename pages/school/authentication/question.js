// pages/school/authentication/question.js
import studentApi from "../../../api/student";
import cache from "../../../utils/cache";

Page({
  data: {
    showRule: false,
    questionIndex: 0,
    questionList: [],
  },

  chooseAnswer(e) {
    let chosedAnswerId = e.currentTarget.dataset.id;
    let chosedAnswerIndex = e.currentTarget.dataset.index;
    const { questionList } = this.data;
    questionList[this.data.questionIndex].chosedAnswerIndex = chosedAnswerIndex;
    questionList[this.data.questionIndex].chosedAnswerId = chosedAnswerId;
    this.setData({
      questionList: questionList,
    });
  },

  async finishQuestion(e) {
    console.log("题目以及选择的答案：", this.data.questionList);
    const _this = this;
    const { questionList } = this.data;
    let right_num = 0;
    for (let item of questionList) {
      if (item.chosedAnswerId == item.right_answer_id) {
        right_num++;
      }
    }
    console.log("正确题目/总共题目:", right_num / questionList.length);
    if (right_num / questionList.length < 0.6) {
      wx.showModal({
        title: "提示",
        content: `错了${
          questionList.length - right_num
        }题，分数不够哦，重新开始答题吗？`,
        success(res) {
          if (res.confirm) {
            console.log("点击确定", res);
            wx.showLoading({
              title: "加载中",
            });
            _this.initQuestion();
            wx.hideLoading({
              success: (res) => {},
            });
          } else {
            console.log("点击拒绝", err);
          }
        },
      });
    } else {
      await studentApi.finishQuestionVerify();
      wx.showToast({
        title: "通过啦🎉",
        success() {
          const pages = getCurrentPages();
          const currPage = pages[pages.length - 1]; //当前页面
          const prevPage = pages[pages.length - 2]; //上一个页面
          //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
          prevPage.setData({
            verifyMethod: "question",
          });
          cache.remove("temp_answer_page_data");
          setTimeout(() => {
            wx.$router.back();
          }, 1000);
        },
      });
    }
  },

  onUnload(e) {
    const data = this.data;
    cache.set("temp_answer_page_data", JSON.stringify(data));
  },

  onShowRule(e) {
    this.setData({
      showRule: true,
    });
  },

  onCloseRule(e) {
    this.setData({
      showRule: false,
    });
  },

  goNext(e) {
    // if (this.data.questionIndex >= 19) return
    this.setData({
      questionIndex: this.data.questionIndex + 1,
    });
  },

  goPrev(e) {
    if (this.data.questionIndex <= 0) return;
    this.setData({
      questionIndex: this.data.questionIndex - 1,
    });
  },

  async initQuestion() {
    let res = await studentApi.getQuestions();
    console.log("问题和答案: ", res);
    this.setData({
      questionList: res.data.data,
      questionIndex: 0,
    });
  },

  loadTempData() {
    const { questionIndex, questionList, showRule } = JSON.parse(
      cache.get("temp_answer_page_data")
    );
    this.setData({
      questionIndex: questionIndex,
      questionList: questionList,
      showRule: showRule,
    });
  },

  async onLoad(options) {
    wx.showLoading({
      title: "加载中",
    });
    // 如果之前答题过，那么缓存这部分已经答过的题目
    if (cache.get("temp_answer_page_data")) {
      this.loadTempData();
      cache.remove("temp_answer_page_data");
    } else {
      await this.initQuestion();
    }
    wx.hideLoading({
      success: (res) => {},
    });
  },
});
