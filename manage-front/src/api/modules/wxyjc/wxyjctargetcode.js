import request from '@/utils/request'



//重大危险源-指标编码  根据设备ID,和设备类型 获取指标编码
export function targetCode_API(relationId, deviceType) {
    return request({
        url: `/wxyjctargetcode/targetCode/${relationId}/${deviceType}`,
        method: "get"
    });
}

export function update_API(params) {
    return request({
        url: "/wxyjctargetcode/update",
        method: "post",
        data: params
    });
}


//危险工艺监控查询明细"
export function apparatus_API(relationId) {
    return request({
        url: `/wxyjctargetcode/apparatus/${relationId}`,
        method: "get"
    });
}


//累计接入设备数量
export function deviceTotal_API() {
    return request({
        url: "/wxyjctargetcode/deviceTotal",
        method: "get"
    });
}
