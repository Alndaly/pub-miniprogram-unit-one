import { promisify } from "./promisify";
import { to } from "./util";

export const subscribeNotify = async (tamplateIdList) => {
  const func = promisify(wx.requestSubscribeMessage);
  const [res, err] = await to(
    func({
      tmplIds: tamplateIdList,
      success(res) {
        console.log("订阅成功", res);
      },
      fail(err) {
        console.error("订阅失败", err);
      },
    })
  );
  return [res, err];
};
