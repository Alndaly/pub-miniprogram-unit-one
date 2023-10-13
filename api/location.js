import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  searchLocation(school_id, campus_id, search_key) {
    return service({
      url: URL.api_url + "/location/get",
      data: {
        search_key,
        school_id,
        campus_id,
      },
      method: "post",
    });
  },
};
