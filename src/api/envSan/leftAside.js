import request from '@/utils/request'

const baseUrl = '/huanwei'

// 环卫人员
export function gethwryList() {
    return request({
        url: baseUrl + '/dp/getRyInfo',
        method: 'get',
    })
}
// 环卫车辆
export function gethwclList() {
    return request({
        url: baseUrl + '/dp/getClcqInfo',
        method: 'get',
    })
}

// 环卫设施
export function gethwssList() {
    return request({
        url: baseUrl + '/dp/getSsInfo',
        method: 'get',
    })
}

// 中转拥堵情况
export function getzzYdList() {
    return request({
        url: baseUrl + '/jam/list',
        method: 'get',
    })
}