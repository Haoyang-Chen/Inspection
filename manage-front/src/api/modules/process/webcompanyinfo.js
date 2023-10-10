import request from "@/utils/request";

//企业基本信息-查询
export function info_API(params) {
  return request({
    url: "/webcompanyinfo/info",
    method: "get",
    params
  });
}

//企业基本信息编辑
export function info_update_API(params) {
  return request({
    url: "/webcompanyinfo/update",
    method: "post",
    data: params
  });
}

//组织架构图
export function organization_API(params) {
  return request({
    url: "/webcompanyinfo/organization",
    method: "post",
    data: params
  });
}


// 所属行业
export function cfgindustry_API(params) {
  return request({
    url: `/cfgindustry/prentCode/${params}`,
    method: "get",
  });
}
