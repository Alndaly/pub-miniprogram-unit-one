export default {
  sleep(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  },
  getNextMonday() {
    const today = new Date();
    const day = today.getDay(); // 获取当前星期几（0-6，0代表星期日）

    // 计算距离下一个周一的天数差
    let daysUntilMonday;
    if (day <= 1) {
      daysUntilMonday = 1 - day;
    } else {
      daysUntilMonday = 1 - day + 7;
    }

    // 设置时间为下一个周一的零点
    const nextMonday = new Date();
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);

    return nextMonday.getTime(); // 返回时间戳
  },
  getNextSaturday() {
    const today = new Date();
    const day = today.getDay(); // 获取当前星期几（0-6，0代表星期日）

    // 计算距离下一个周六的天数差
    let daysUntilSaturday = 6 - day;
    if (day === 0) {
      daysUntilSaturday += 7;
    }

    // 设置时间为下一个周六的零点
    const nextSaturday = new Date();
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    nextSaturday.setHours(0, 0, 0, 0);

    return nextSaturday.getTime(); // 返回时间戳
  },
  // 计算时间差
  calculateTimeDifference(startTime, endTime) {
    var diff = endTime - startTime;

    var milliseconds = Math.floor((diff % 1000) / 100);
    var seconds = Math.floor((diff / 1000) % 60);
    var minutes = Math.floor((diff / (1000 * 60)) % 60);
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      milliseconds: milliseconds,
    };
  },
  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  },
  /**
   * 计算时间差
   * @param {*} timeStr
   */
  differTime(timeStr) {
    const timeStamp = new Date(timeStr.replace(/-/g, "/")).getTime();
    const nowTimeStamp = new Date().getTime();
    const differ = nowTimeStamp - timeStamp;
    const seconds = Math.floor(differ / 1000);
    if (seconds < 10) {
      return "刚刚";
    }
    if (seconds < 60) {
      return `${seconds}秒前`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}分钟前`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}小时前`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days}天前`;
    }
    const weeks = Math.floor(days / 7);
    if (weeks < 5) {
      return `${weeks}星期前`;
    }
    const months = Math.floor(weeks / 4);
    if (months < 12) {
      return `${months}月前`;
    }
    const years = Math.floor(months / 12);
    return `${years}年内`;
  },
};
