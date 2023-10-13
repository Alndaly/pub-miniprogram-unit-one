import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  getFormResData(form_id) {
    return service({
      url: URL.api_url + "/form/res",
      data: { form_id },
      method: "POST",
    });
  },
  getFormData(form_id) {
    return service({
      url: URL.api_url + "/form/data",
      data: { form_id },
      method: "POST",
    });
  },
  submitFormData(form_id, value) {
    return service({
      url: URL.api_url + "/form/submit",
      data: { form_id, value },
      method: "POST",
    });
  },
  updateFormResData(form_id, value) {
    return service({
      url: URL.api_url + "/form/update",
      data: { form_id, value },
      method: "POST",
    });
  },
};
