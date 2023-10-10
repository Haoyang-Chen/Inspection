import request from '@/utils/request'

//重大危险源-企业信息表-企业名称下拉选择
export function list_API(params) {
    return request({
        url: "/wxyjcenterpriseinfo/list",
        method: "get",
        params
    });
}

//重大危险源-企业信息表-企业名称下拉选择
export function getCompanyName_API(params) {
    return request({
        url: "/wxyjcenterpriseinfo/getCompanyName",
        method: "get",
        params
    });
}

//重大危险源-企业信息表-信息
export function companyInfo_API(companyId) {
    return request({
        url: `/wxyjcenterpriseinfo/companyInfo/${companyId}`,
        method: "get"
    });
}


//重大危险源-企业信息表-首页地图企业查询
export function mapList_API(params) {
    return request({
        url: "/wxyjcenterpriseinfo/mapList",
        method: "get",
        params
    });
}

//重大危险源-企业信息表-固有云图地图查询
export function mapPtgList_API(params) {
    return request({
        url: "/wxyjcenterpriseinfo/mapPtgList",
        method: "get",
        params
    });
}

//重大危险源-企业信息表-保存
export function save_API(params) {
    return request({
        url: "/wxyjcenterpriseinfo/save",
        method: "post",
        data: params
    });
}


//重大危险源-企业信息表-修改
export function update_API(params) {
    return request({
        url: "/wxyjcenterpriseinfo/update",
        method: "post",
        data: params
    });
}


//导出
export function excel_API(params) {
    return request({
        url: "/wxyjcenterpriseinfo/excel",
        method: "get",
        responseType: 'blob',
        params
    });
}
