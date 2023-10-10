import request from '@/utils/request'

//累计巡检任务/累计异常巡检记录/累计漏检点位/巡检点数量----//巡检任务
export function mxxjy_API(params) {
    return request({
        url: "/home/mxxjy/mainCount",
        method: "get",
        params
    });
}


//异常巡检统计
export function errorReportByMonth_API(params) {
    return request({
        url: "/home/mxxjy/errorReportByMonth",
        method: "get",
        params
    });
}

//隐患细分类别统计
export function subClassCount_API(params) {
    return request({
        url: "/home/mxxjy/analysis/subClassCount",
        method: "get",
        params
    });
}

//作业票统计-各类作业票占比
export function countByType_API(params) {
    return request({
        url: "/home/mxxjy/analysis/countByType",
        method: "get",
        params
    });
}

//页面中间统计
export function statistics_API(params) {
    return request({
        url: "/home/mxxjy/statistics",
        method: "get",
        params
    });
}


//人员证书
export function expirationReminder_API(params) {
    return request({
        url: "/home/mxxjy/expirationReminder",
        method: "get",
        params
    });
}

//企业证书到期提醒
export function enterpriseReminder_API(params) {
    return request({
        url: "/home/mxxjy/enterpriseReminder",
        method: "get",
        params
    });
}


// 查询隐患统计
export function troubleReport_API(query) {
    return request({
        url: '/home/report/troubleReport',
        method: 'get',
        params: query
    })
}