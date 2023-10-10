import request from '@/utils/request'


//重大危险源-储罐仓库表
export function list_API(params) {
    return request({
        url: "/wxyjcdangeroustank/list",
        method: "get",
        params
    });
}


//重大危险源-储罐仓库表
export function save_API(params) {
    return request({
        url: "/wxyjcdangeroustank/save",
        method: "post",
        data: params
    });
}


//重大危险源-储罐仓库表
export function update_API(params) {
    return request({
        url: "/wxyjcdangeroustank/update",
        method: "post",
        data: params
    });
}


//重大危险源-储罐仓库表
export function delete_API(params) {
    return request({
        url: "/wxyjcdangeroustank/delete",
        method: "post",
        data: params
    });
}

//重大危险源-储罐仓库表
export function info_API(id) {
    return request({
        url: `/wxyjcdangeroustank/info/${id}`,
        method: "get"
    });
}

//重大危险源-储罐仓库表-现场实时监控-重大危险源实时监控查询
export function tankMonitor_API(params) {
    return request({
        url: "/wxyjcdangeroustank/tankMonitor",
        method: "get",
        params
    });
}

//下载模板
export function template_API() {
    return request({
        url: "/wxyjcdangeroustank/template",
        method: "get",
        responseType: 'blob',
    });
}


//导出
export function excel2_API() {
    return request({
        url: "/wxyjcdangeroustank/excel2",
        method: "get",
        responseType: 'blob',
    });
}


export function excel_API() {
    return request({
        url: "/wxyjcdangeroustank/excel",
        method: "get",
        responseType: 'blob',
    });
}


//政府导出
export function excel_government_API() {
    return request({
        url: "/wxyjcdangeroustank/excel2",
        method: "get",
        responseType: 'blob',
    });
}

//导入
export function import_API(params) {
    return request({
        url: "/wxyjcdangeroustank/import",
        method: "post",
        responseType: 'blob',
        data: params
    });
}


//设备编码编辑校验
export function check_edit_API(deviceNo,id) {
    return request({
        url: `/wxyjcdangeroustank/check/${deviceNo}/${id}`,
        method: "get"
    });
}