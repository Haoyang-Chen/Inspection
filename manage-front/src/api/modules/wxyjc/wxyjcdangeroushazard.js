import request from '@/utils/request'

//重大危险源-重大危险源表
export function list_API(params) {
    return request({
        url: "/wxyjcdangeroushazard/list",
        method: "get",
        params
    });
}


//重大危险源-重大危险源表
export function save_API(params) {
    return request({
        url: "/wxyjcdangeroushazard/save",
        method: "post",
        data: params
    });
}


//重大危险源-重大危险源表
export function update_API(params) {
    return request({
        url: "/wxyjcdangeroushazard/update",
        method: "post",
        data: params
    });
}


//重大危险源-重大危险源表
export function delete_API(params) {
    return request({
        url: "/wxyjcdangeroushazard/delete",
        method: "post",
        data: params
    });
}

//重大危险源-重大危险源表
export function info_API(id) {
    return request({
        url: `/wxyjcdangeroushazard/info/${id}`,
        method: "get"
    });
}

//下载模板
export function template_API() {
    return request({
        url: "/wxyjcdangeroushazard/template",
        method: "get",
        responseType: 'blob',
    });
}

//导出
export function excel_API(params) {
    return request({
        url: "/wxyjcdangeroushazard/excel",
        method: "get",
        responseType: 'blob',
        params
    });
}

//导入
export function import_API(params) {
    return request({
        url: "/wxyjcdangeroushazard/import",
        method: "post",
        responseType: 'blob',
        data: params
    });
}

//危化品信息名称校验-新增
export function check_API(hazardName) {
    return request({
        url: `/wxyjcdangeroushazard/check/${hazardName}`,
        method: "get"
    });
}

//危化品信息名称校验-编辑
export function check_edit_API(hazardName,id) {
    return request({
        url: `/wxyjcdangeroushazard/check/${hazardName}/${id}`,
        method: "get"
    });
}