import request from '@/utils/request'

//重大危险源-危险系数-储量



export function save_API(params) {
    return request({
        url: "/wxyjcriskfactorreserves/save",
        method: "post",
        data: params
    });
}

export function update_API(params) {
    return request({
        url: "/wxyjcriskfactorreserves/update",
        method: "post",
        data: params
    });
}

export function list_API(params) {
    return request({
        url: "/wxyjcriskfactorreserves/list",
        method: "get",
        params
    });
}

export function info_API(id) {
    return request({
        url: `/wxyjcriskfactorreserves/info/${id}`,
        method: "get",
    });
}


export function delete_API(params) {
    return request({
        url: "/wxyjcriskfactorreserves/delete",
        method: "post",
        data: params
    });
}