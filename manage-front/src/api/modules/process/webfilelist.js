import request from "@/utils/request";

//文件 查询
export function list_API(params) {
    return request({
        url: "/webfilelist/list",
        method: "get",
        params
    });
}


//文件 保存
export function save_API(params) {
    return request({
        url: "/webfilelist/save",
        method: "post",
        data: params
    });
}

//换版
export function versionChange_API(params) {
    return request({
        url: "/webfilelist/versionChange",
        method: "post",
        data: params
    });
}


//文件废止
export function cancel_API(params) {
    return request({
        url: "/webfilelist/cancel",
        method: "post",
        data: params
    });
}


//文件 更新
export function update_API(params) {
    return request({
        url: "/webfilelist/update",
        method: "post",
        data: params
    });
}

//文件详情
export function info_API(id) {
    return request({
        url: `/webfilelist/info/${id}`,
        method: "get",
    });
}


//文件删除
export function delete_API(params) {
    return request({
        url: "/webfilelist/delete",
        method: "post",
        data:params
    });
}


//文件导出
export function export_API(params) {
    return request({
        url: "/webfilelist/export",
        method: "get",
        responseType: 'blob',
        params
    });
}

//文件导入
export function import_API(params) {
    return request({
        url: "/webfilelist/import",
        method: "post",
        responseType: 'blob',
        data:params
    });
}


//模板下载
export function template_API() {
    return request({
        url: "/webfilelist/template",
        method: "get",
        responseType: 'blob',
    });
}