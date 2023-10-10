import request from "@/utils/request";

//承包商人员 查询
export function list_API(params) {
    return request({
        url: "/webcontratorperson/list",
        method: "get",
        params
    });
}


//承包商人员 保存
export function save_API(params) {
    return request({
        url: "/webcontratorperson/save",
        method: "post",
        data: params
    });
}


//承包商人员 更新
export function update_API(params) {
    return request({
        url: "/webcontratorperson/update",
        method: "post",
        data: params
    });
}


//承包商人员 删除
export function delete_API(params) {
    return request({
        url: "/webcontratorperson/delete",
        method: "post",
        data:params
    });
}


//承包商人员 导出
export function export_API(params) {
    return request({
        url: "/webcontratorperson/export",
        method: "get",
        responseType: 'blob',
        params
    });
}



//模板下载
export function template_API() {
    return request({
        url: "/webcontratorperson/template",
        method: "get",
        responseType: 'blob',
    });
}


//资质证书
export function certificateList_API(params) {
    return request({
        url: "/webcontratorperson/certificateList",
        method: "get",
        params
    });
}

//培训提醒查询
export function train_list_API(params) {
    return request({
        url: "/webcontratorperson/train_list",
        method: "get",
        params
    });
}