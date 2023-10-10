import request from '@/utils/request'

//重大危险源-气体泄漏检测点信息表
export function list_API(params) {
    return request({
        url: "/wxyjcdangerousgaspoint/list",
        method: "get",
        params
    });
}

//重大危险源-气体泄漏检测点信息表
export function save_API(params) {
    return request({
        url: "/wxyjcdangerousgaspoint/save",
        method: "post",
        data: params
    });
}


//重大危险源-气体泄漏检测点信息表
export function update_API(params) {
    return request({
        url: "/wxyjcdangerousgaspoint/update",
        method: "post",
        data: params
    });
}


//重大危险源-气体泄漏检测点信息表
export function delete_API(params) {
    return request({
        url: "/wxyjcdangerousgaspoint/delete",
        method: "post",
        data: params
    });
}

//重大危险源-气体泄漏检测点信息表
export function info_API(id) {
    return request({
        url: `/wxyjcdangerousgaspoint/info/${id}`,
        method: "get"
    });
}

//重大危险源-气体泄漏检测点信息表---可燃有毒气体监控-列表
export function gasPointMonitors_API(params) {
    return request({
        url: "/wxyjcdangerousgaspoint/gasPointMonitors",
        method: "get",
        params
    });
}


//下载模板
export function template_API() {
    return request({
        url: "/wxyjcdangerousgaspoint/template",
        method: "get",
        responseType: 'blob',
    });
}

//气体泄漏检测点信息-导出
export function excel_API(params) {
    return request({
        url: "/wxyjcdangerousgaspoint/excel",
        method: "get",
        responseType: 'blob',
        params
    });
}

//可燃有毒气体监控-导出
export function excel2_API() {
    return request({
        url: "/wxyjcdangerousgaspoint/excel2",
        method: "get",
        responseType: 'blob',
    });
}

//导入
export function import_API(params) {
    return request({
        url: "/wxyjcdangerousgaspoint/import",
        method: "post",
        responseType: 'blob',
        data: params
    });
}

//气体监控数据变化趋势图
export function HistoricalTrendChart_API(params) {
    return request({
        url: "/wxyjcdangerousgaspoint/monitor/HistoricalTrendChart",
        method: "get",
        params
    });
}



//设备编码编辑校验
export function check_edit_API(deviceNo,id) {
    return request({
        url: `/wxyjcdangerousgaspoint/check/${deviceNo}/${id}`,
        method: "get"
    });
}