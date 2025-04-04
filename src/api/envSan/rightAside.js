import request from '@/utils/request';

const baseUrl = '/huanwei';

// 清运率
export function getqyzyData(data) {
  return request({
    url: baseUrl + '/czljcz/clean/finishRate',
    method: 'post',
    data: data,
    // timeout: 20000
  });
}

//清运总量
export function getqyzlData() {
  return request({
    url: baseUrl + '/dp/getQyInfo',
    method: 'get',
  });
}

// 中转总量
export function getzzzlData() {
  return request({
    url: baseUrl + '/dp/getZzInfo',
    method: 'get',
  });
}
// 压缩总量
export function getyszlData() {
  return request({
    url: baseUrl + '/dp/getYsInfo',
    method: 'get',
  });
}

// 获取收运点位列表
export function getSydwList() {
  return request({
    url: baseUrl + '/dp/getQydwInfo',
    method: 'get',
  });
}
