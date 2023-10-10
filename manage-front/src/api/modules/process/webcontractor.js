import request from "@/utils/request";

//在厂承包商 查询
export function list_API(params) {
    return request({
        url: "/webcontractor/list",
        method: "get",
        params
    });
}


//在厂承包商 保存
export function save_API(params) {
    return request({
        url: "/webcontractor/save",
        method: "post",
        data: params
    });
}


//在厂承包商 更新
export function update_API(params) {
    return request({
        url: "/webcontractor/update",
        method: "post",
        data: params
    });
}


//在厂承包商 删除
export function delete_API(params) {
    return request({
        url: "/webcontractor/delete",
        method: "post",
        data:params
    });
}


//在厂承包商 导出
export function export_API(params) {
    return request({
        url: "/webcontractor/export",
        method: "get",
        responseType: 'blob',
        params
    });
}

//资质证书导出
export function certificatesExport_API(params) {
    return request({
        url: "/webcontractor/certificatesExport",
        method: "get",
        responseType: 'blob',
        params
    });
}


//模板下载
export function template_API() {
    return request({
        url: "/webcontractor/template",
        method: "get",
        responseType: 'blob',
    });
}



export function certificates_list_API(params) {
    return request({
        url: "/webcontractor/certificates_list",
        method: "get",
        params
    });
}
