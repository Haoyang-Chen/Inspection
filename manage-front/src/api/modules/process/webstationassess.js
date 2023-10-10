import request from "@/utils/request";

//岗位考核
export function list_API(params) {
    return request({
        url: "/webstationassess/list",
        method: "get",
        params
    });
}


//岗位考核保存
export function save_API(params) {
    return request({
        url: "/webstationassess/save",
        method: "post",
        data: params
    });
}


//岗位考核更新
export function update_API(params) {
    return request({
        url: "/webstationassess/update",
        method: "post",
        data: params
    });
}

//岗位考核详情
export function info_API(params) {
    return request({
        url: "/webstationassess/info",
        method: "get",
        params
    });
}


//岗位考核删除
export function delete_API(params) {
    return request({
        url: "/webstationassess/delete",
        method: "post",
        data:params
    });
}


//岗位考核导出
export function export_API(params) {
    return request({
        url: "/webstationassess/export",
        method: "get",
        responseType: 'blob',
        params
    });
}

//岗位考核导入
export function import_API(params) {
    return request({
        url: "/webstationassess/import",
        method: "post",
        responseType: 'blob',
        data:params
    });
}


//模板下载
export function template_API() {
    return request({
        url: "/webstationassess/template",
        method: "get",
        responseType: 'blob',
    });
}