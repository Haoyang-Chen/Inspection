import request from "@/utils/request";

//人员证书 查询
export function list_API(params) {
    return request({
        url: "/webcertificateperson/list",
        method: "get",
        params
    });
}


//人员证书保存
export function save_API(params) {
    return request({
        url: "/webcertificateperson/save",
        method: "post",
        data: params
    });
}


//人员证书更新
export function update_API(params) {
    return request({
        url: "/webcertificateperson/update",
        method: "post",
        data: params
    });
}

//换证
export function renewal_API(params) {
    return request({
        url: "/webcertificateperson/renewal",
        method: "post",
        data: params
    });
}

//人员证书详情
export function info_API(params) {
    return request({
        url: "/webcertificateperson/info",
        method: "get",
        params
    });
}


//人员证书删除
export function delete_API(params) {
    return request({
        url: "/webcertificateperson/delete",
        method: "post",
        data:params
    });
}


//人员证书导出
export function export_API(params) {
    return request({
        url: "/webcertificateperson/export",
        method: "get",
        responseType: 'blob',
        params
    });
}



//模板下载
export function template_API() {
    return request({
        url: "/webcertificateperson/template",
        method: "get",
        responseType: 'blob',
    });
}


//人员证书导入
export function import_API(params) {
    return request({
        url: "/webcertificateperson/import",
        method: "post",
        responseType: 'blob',
        data:params
    });
}