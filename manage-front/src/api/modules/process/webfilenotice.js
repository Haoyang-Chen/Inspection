import request from "@/utils/request";

//通知查询
export function list_API(params) {
    return request({
        url: "/webfilenotice/list",
        method: "get",
        params
    });
}


//通知保存
export function save_API(params) {
    return request({
        url: "/webfilenotice/save",
        method: "post",
        data: params
    });
}


//通知更新
export function update_API(params) {
    return request({
        url: "/webfilenotice/update",
        method: "post",
        data: params
    });
}

//通知详情
export function info_API(params) {
    return request({
        url: "/webfilenotice/info",
        method: "get",
        params
    });
}


//通知删除
export function delete_API(params) {
    return request({
        url: "/webfilenotice/delete",
        method: "post",
        data:params
    });
}


//通知导出
export function export_API(params) {
    return request({
        url: "/webfilenotice/export",
        method: "get",
        responseType: 'blob',
        params
    });
}


//模板下载
export function template_API() {
    return request({
        url: "/webfilenotice/template",
        method: "get",
        responseType: 'blob',
    });
}