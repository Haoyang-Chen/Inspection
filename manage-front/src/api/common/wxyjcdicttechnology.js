import request from "@/utils/request";

//重大危险源-危化品信息字典表
export function wxyjcdicttechnology_API(type) {
    return request({
        url: `/wxyjcdicttechnology/${type}`,
        method: "get"
    });
}
