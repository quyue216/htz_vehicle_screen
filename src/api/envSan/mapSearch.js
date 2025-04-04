import request from '@/utils/request';

const baseUrl = `/huanwei`;

/**
 *  获取车辆点位列表
 * @param {Object} data.deptId  100
 */
export function getCarList(data) {
  return request({
    url: baseUrl + '/dp/mapcar',
    method: 'post',
    data: data,
  });
}

/**
 *  获取中转站点位列表
 */
export function getZzzList() {
  return request({
    url: baseUrl + '/zzzxx/zzzList',
    method: 'get',
  });
}

/**
 *  获取压缩站点位列表
 */
export function getYszList() {
  return request({
    url: baseUrl + '/yszxx/yszList',
    method: 'get',
  });
}

/**
 *  获取公厕站点位列表
 */
export function getGcList(params) {
  return request({
    url: baseUrl + '/gcxx/gcList',
    method: 'get',
    params 
  });
}
