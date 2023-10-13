import { service } from "../utils/service";
import { URL } from "../configs/base";

export default {
  getOrganizations(search_key, page_num, page_size) {
    return service({
      url: URL.api_url + "/organization/list",
      data: {
        search_key,
        page_num,
        page_size,
      },
      method: "POST",
    });
  },
  getOrganizationDetail(id) {
    return service({
      url: URL.api_url + "/organization/detail",
      data: {
        id,
      },
      method: "POST",
    });
  },
  addOrganization(
    parent_organization_id,
    name,
    description,
    in_school,
    email,
    phone
  ) {
    return service({
      url: URL.api_url + "/organization/add",
      data: {
        parent_organization_id,
        name,
        description,
        in_school,
        email,
        phone,
      },
      method: "POST",
    });
  },
  updateOrganization(
    id,
    parent_organization_id,
    name,
    description,
    in_school,
    email,
    phone
  ) {
    return service({
      url: URL.api_url + "/organization/update",
      data: {
        id,
        parent_organization_id,
        name,
        description,
        in_school,
        email,
        phone,
      },
      method: "POST",
    });
  },
};
