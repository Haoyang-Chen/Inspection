import request from '@/utils/request'

//重大危险源-危化品信息表
export function list_API(params) {
    return request({
        url: "/wxyjcdangerousinfo/list",
        method: "get",
        params
    });
}


//重大危险源-危化品信息表
export function save_API(params) {
    return request({
        url: "/wxyjcdangerousinfo/save",
        method: "post",
        data: params
    });
}


//重大危险源-危化品信息表
export function update_API(params) {
    return request({
        url: "/wxyjcdangerousinfo/update",
        method: "post",
        data: params
    });
}


//重大危险源-重大危险源表
export function info_API(id) {
    return request({
        url: `/wxyjcdangerousinfo/info/${id}`,
        method: "get"
    });
}

//重大危险源-危化品信息表
export function delete_API(params) {
    return request({
        url: "/wxyjcdangerousinfo/delete",
        method: "post",
        data: params
    });
}



//下载模板
export function template_API() {
    return request({
        url: "/wxyjcdangerousinfo/template",
        method: "get",
        responseType: 'blob',
    });
}

//导入模板
export function import_API(params) {
    return request({
        url: "/wxyjcdangerousinfo/import",
        method: "post",
        responseType: 'blob',
        data: params
    });
}


//导出
export function excel_API(params) {
    return request({
        url: "/wxyjcdangerousinfo/excel",
        method: "get",
        responseType: 'blob',
        params
    });
}


//企业物料实时储量--物料类别
export function category_API(params) {
    return request({
        url: "/wxyjcdangerousinfo/monitor/category",
        method: "get",
        params
    });
}

//企业物料实时储量--物料名称
export function materialName_API(params) {
    return request({
        url: "/wxyjcdangerousinfo/monitor/materialname",
        method: "get",
        params
    });
}

//物料储罐历史趋势图
export function HistoricalTrendChart_API(params) {
    return request({
        url: "/wxyjcdangerousinfo/monitor/HistoricalTrendChart",
        method: "get",
        params
    });
}



//危化品信息名称校验-新增
export function check_API(dangerName) {
    return request({
        url: `/wxyjcdangerousinfo/check/${dangerName}`,
        method: "get"
    });
}

//危化品信息名称校验-编辑
export function check_edit_API(dangerName,id) {
    return request({
        url: `/wxyjcdangerousinfo/check/${dangerName}/${id}`,
        method: "get"
    });
}