import request from "@/utils/request";


//部门人员-转岗查询
export function list_API(params) {
    return request({
        url: "/webdeparttransfer/list",
        method: "get",
        params
    });
}


//部门人员-转岗保存
export function save_API(params) {
    return request({
        url: "/webdeparttransfer/save",
        method: "post",
        data: params
    });
}


//部门人员-转岗更新
export function update_API(params) {
    return request({
        url: "/webdeparttransfer/update",
        method: "post",
        data: params
    });
}

//删除，转岗删除
export function delete_API(params) {
    return request({
        url: "/webdeparttransfer/delete",
        method: "post",
        data:params
    });
}

//导出
export function export_API(params) {
    return request({
        url: "/webdeparttransfer/export",
        method: "get",
        responseType: 'blob',
        params
    });
}


//模板下载
export function template_API() {
    return request({
        url: "/webdeparttransfer/template",
        method: "get",
        responseType: 'blob',
    });
}