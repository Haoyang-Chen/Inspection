import request from "@/utils/request";

//企业证书 查询
export function list_API(params) {
    return request({
        url: "/webcertificatedepart/list",
        method: "get",
        params
    });
}


//企业证书保存
export function save_API(params) {
    return request({
        url: "/webcertificatedepart/save",
        method: "post",
        data: params
    });
}


//企业证书更新
export function update_API(params) {
    return request({
        url: "/webcertificatedepart/update",
        method: "post",
        data: params
    });
}

//换证
export function renewal_API(params) {
    return request({
        url: "/webcertificatedepart/renewal",
        method: "post",
        data: params
    });
}

//企业证书详情
export function info_API(params) {
    return request({
        url: "/webcertificatedepart/info",
        method: "get",
        params
    });
}


//企业证书删除
export function delete_API(params) {
    return request({
        url: "/webcertificatedepart/delete",
        method: "post",
        data:params
    });
}


//企业证书导出
export function export_API(params) {
    return request({
        url: "/webcertificatedepart/export",
        method: "get",
        responseType: 'blob',
        params
    });
}

//模板下载
export function template_API() {
    return request({
        url: "/webcertificatedepart/template",
        method: "get",
        responseType: 'blob',
    });
}


//企业证书导入
export function import_API(params) {
    return request({
        url: "/webcertificatedepart/import",
        method: "post",
        responseType: 'blob',
        data:params
    });
}