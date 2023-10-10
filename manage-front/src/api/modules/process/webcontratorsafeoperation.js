import request from "@/utils/request";

//企业安全运营时间 查询
export function list_API(params) {
    return request({
        url: "/webcontratorsafeoperation/list",
        method: "get",
        params
    });
}


//企业安全运营时间 保存
export function save_API(params) {
    return request({
        url: "/webcontratorsafeoperation/save",
        method: "post",
        data: params
    });
}


//企业安全运营时间 更新
export function update_API(params) {
    return request({
        url: "/webcontratorsafeoperation/update",
        method: "post",
        data: params
    });
}


//企业安全运营时间 删除
export function delete_API(params) {
    return request({
        url: "/webcontratorsafeoperation/delete",
        method: "post",
        data: params
    });
}


//企业安全运营时间 导出
export function export_API(params) {
    return request({
        url: "/webcontratorsafeoperation/export",
        method: "get",
        responseType: 'blob',
        params
    });
}


//企业安全运营时间 导入
export function import_API(params) {
    return request({
        url: "/webcontratorsafeoperation/import",
        method: "post",
        responseType: 'blob',
        data: params
    });
}


//模板下载
export function template_API() {
    return request({
        url: "/webcontratorsafeoperation/template",
        method: "get",
        responseType: 'blob',
    });
}

//企业安全运行最新信息 查询
export function currentInfo_API(params) {
    return request({
        url: "/webcontratorsafeoperation/currentInfo",
        method: "get",
        params
    });
}
