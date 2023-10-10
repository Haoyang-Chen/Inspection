import request from "@/utils/request";

//岗位管理查询
export function list_API(params) {
    return request({
        url: "/webcompanystation/list",
        method: "get",
        params
    });
}


//岗位信息保存
export function save_API(params) {
    return request({
        url: "/webcompanystation/save",
        method: "post",
        data: params
    });
}


//岗位信息更新
export function update_API(params) {
    return request({
        url: "/webcompanystation/update",
        method: "post",
        data: params
    });
}

//岗位信息详情
export function info_API(id) {
    return request({
        url: `/webcompanystation/info/${id}`,
        method: "get"
    });
}


//岗位信息删除
export function delete_API(params) {
    return request({
        url: "/webcompanystation/delete",
        method: "post",
        data:params
    });
}



//模板下载
export function template_API() {
    return request({
        url: "/webcompanystation/template",
        method: "get",
        responseType: 'blob',
    });
}

//岗位信息导出
export function export_API(params) {
    return request({
        url: "/webcompanystation/export",
        method: "get",
        responseType: 'blob',
        params
    });
}


//岗位信息导入
export function import_API(params) {
    return request({
        url: "/webcompanystation/import",
        method: "post",
        responseType: 'blob',
        data:params
    });
}


