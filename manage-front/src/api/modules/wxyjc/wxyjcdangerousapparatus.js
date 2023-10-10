import request from '@/utils/request'

//重大危险源-装置信息表
export function list_API(params) {
    return request({
        url: "/wxyjcdangerousapparatus/list",
        method: "get",
        params
    });
}

//重大危险源-装置信息表
export function save_API(params) {
    return request({
        url: "/wxyjcdangerousapparatus/save",
        method: "post",
        data: params
    });
}


//重大危险源-装置信息表
export function update_API(params) {
    return request({
        url: "/wxyjcdangerousapparatus/update",
        method: "post",
        data: params
    });
}


//重大危险源-装置信息表
export function delete_API(params) {
    return request({
        url: "/wxyjcdangerousapparatus/delete",
        method: "post",
        data: params
    });
}

//重大危险源-装置信息表
export function info_API(id) {
    return request({
        url: `/wxyjcdangerousapparatus/info/${id}`,
        method: "get"
    });
}

//下载模板
export function template_API() {
    return request({
        url: "/wxyjcdangerousapparatus/template",
        method: "get",
        responseType: 'blob',
    });
}

//导出
export function excel_API(params) {
    return request({
        url: "/wxyjcdangerousapparatus/excel",
        method: "get",
        responseType: 'blob',
        params
    });
}

//导入
export function import_API(params) {
    return request({
        url: "/wxyjcdangerousapparatus/import",
        method: "post",
        responseType: 'blob',
        data: params
    });
}


//工艺数据变化趋势图
export function HistoricalTrendChart_API(params) {
    return request({
        url: "/wxyjcdangerousapparatus/monitor/HistoricalTrendChart",
        method: "get",
        params
    });
}


//设备编码新增校验
export function check_API(deviceNo) {
    return request({
        url: `/wxyjcdangerousapparatus/check/${deviceNo}`,
        method: "get"
    });
}

//设备编码编辑校验
export function check_edit_API(deviceNo,id) {
    return request({
        url: `/wxyjcdangerousapparatus/check/${deviceNo}/${id}`,
        method: "get"
    });
}