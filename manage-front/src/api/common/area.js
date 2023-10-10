import request from "@/utils/request";

//根据上级获取下级区域
export function listByParentId_API(params) {
    return request({
        url: "/cfgarea/listByParentId",
        method: "get",
        params
    });
}

//根据省市区id获取本树
export function selfDetailList_API(params) {
    return request({
        url: "/cfgarea/selfDetailList",
        method: "get",
        params
    });
}