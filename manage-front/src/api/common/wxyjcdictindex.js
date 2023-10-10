import request from "@/utils/request";

//重大危险源-危化品信息字典表
export function wxyjcdictindex_API(type) {
    return request({
        url: `/wxyjcdictindex/${type}`,
        method: "get"
    });
}
