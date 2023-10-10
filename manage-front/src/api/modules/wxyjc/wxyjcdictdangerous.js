import request from '@/utils/request'

//重大危险源-危化品信息字典表
export function name_API(name) {
    return request({
        url: `/wxyjcdictdangerous/${name}`,
        method: "get"
    });
}