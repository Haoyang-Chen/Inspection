import request from '@/utils/request'

//重大危险源-告警信息实时表
export function list_API(params) {
    return request({
        url: "/wxyjcwarninginformopt/list",
        method: "get",
        params
    });
}

//重大危险源-告警信息实时表
export function home_list_API(params) {
    return request({
        url: "/wxyjcwarninginformopt/home/list",
        method: "get",
        params
    });
}


//重大危险源-告警信息实时表
export function info_API(id) {
    return request({
        url: `/wxyjcwarninginformopt/info/${id}`,
        method: "get"
    });
}

//查看报警记录
export function detailList_API(params) {
    return request({
        url: '/wxyjcwarninginformopt/detailList',
        method: "get",
        params
    });
}

//导出
export function excel_API(params) {
    return request({
        url: "/wxyjcwarninginformopt/excel",
        method: "get",
        responseType: 'blob',
        params
    });
}


//重大危险源-告警信息实时表-报警状态处理
export function update_API(params) {
    return request({
        url: "/wxyjcwarninginformopt/update",
        method: "post",
        data: params
    });
}

//报警数量统计
export function HistoricalTrendChart_API(params) {
    return request({
        url: "/wxyjcwarninginformopt/monitor/HistoricalTrendChart",
        method: "get",
        params
    });
}
