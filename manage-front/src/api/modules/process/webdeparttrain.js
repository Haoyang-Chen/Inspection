import request from "@/utils/request";


//部门人员-培训岗查询
export function list_API(params) {
    return request({
        url: "/webdeparttrain/list",
        method: "get",
        params
    });
}


//部门人员-培训保存
export function save_API(params) {
    return request({
        url: "/webdeparttrain/save",
        method: "post",
        data: params
    });
}


//部门人员-培训更新
export function update_API(params) {
    return request({
        url: "/webdeparttrain/update",
        method: "post",
        data: params
    });
}


//部门人员导出
export function export_API(params) {
    return request({
        url: "/webdeparttrain/export",
        method: "get",
        responseType: 'blob',
        params
    });
}



//模板下载
export function template_API() {
    return request({
        url: "/webdepartperson/template",
        method: "get",
        responseType: 'blob',
    });
}