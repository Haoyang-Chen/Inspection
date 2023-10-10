import request from '@/utils/request'

//重大危险源-危险系数-类别


export function save_API(params) {
    return request({
        url: "/wxyjcriskfactorcategory/save",
        method: "post",
        data: params
    });
}

export function update_API(params) {
    return request({
        url: "/wxyjcriskfactorcategory/update",
        method: "post",
        data: params
    });
}

export function list_API(params) {
    return request({
        url: "/wxyjcriskfactorcategory/list",
        method: "get",
        params
    });
}

export function info_API(id) {
    return request({
        url: `/wxyjcriskfactorcategory/info/${id}`,
        method: "get",
    });
}


export function delete_API(params) {
    return request({
        url: "/wxyjcriskfactorcategory/delete",
        method: "post",
        data: params
    });
}