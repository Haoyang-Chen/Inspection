import request from "@/utils/request";

//部门人员查询
export function list_API(params) {
    return request({
        url: "/webdepartperson/list",
        method: "get",
        params
    });
}


//部门人员保存
export function save_API(params) {
    return request({
        url: "/webdepartperson/save",
        method: "post",
        data: params
    });
}


//部门人员更新
export function update_API(params) {
    return request({
        url: "/webdepartperson/update",
        method: "post",
        data: params
    });
}


//部门人员删除
export function delete_API(params) {
    return request({
        url: "/webdepartperson/delete",
        method: "post",
        data:params
    });
}


//部门人员导出
export function export_API(params) {
    return request({
        url: "/webdepartperson/export",
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