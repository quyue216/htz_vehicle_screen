import request from '@/utils/request';

const baseUrl = `/huanwei`;

// 查询部门下拉树结构
export function getdeptTree(data) {
  return request({
    url: baseUrl + '/dp/mapssTree',
    method: 'post',
    data: data,
  });
}
// 获取车辆和其他信息
export function getcarData(data) {
  return request({
    url: baseUrl + '/dp/mapssLonLat',
    method: 'post',
    data: data,
  });
}

// 树数据
export function getTree(data) {
  return request({
    url: baseUrl + '/dp/mapMhcx',
    method: 'post',
    data: data,
  });
}

// 获取公厕列表
export function getToiletList(params) {
  return request({
    url: baseUrl + '/dp/getGcList',
    method: 'get',
    params,
  });
}
// 获取压缩站站点列表
export function getReduceVolSites(params) {
  return request({
    url: baseUrl + '/dp/getYszList',
    method: 'get',
    params,
  });
}

// 获取车辆信息 tx 0 车辆信息 1 中转信息
export function getCarList(data) {
  return request({
    url: baseUrl + '/dp/mapcar',
    method: 'post',
    data: data,
  });
}

/**
 * 车辆基本信息
 * @param {string} data.cphm
 */
export function getCarInfo(data) {
  return request({
    url: baseUrl + '/dp/mapCarInfo',
    method: 'post',
    data: data,
  });
}

/**
 * 获取某车牌号的驾驶员的考勤信息 暂无,带实现
 * @param {string} cphm 车牌号码
 */
export function getCarKqInfo(cphm) {
  return request({
    url: baseUrl + '/kqdk/getRyByCphmLast/' + cphm,
    method: 'get',
  });
}

// 获取车辆轨迹
export function getCarTrack(data) {
  return request({
    url: baseUrl + '/access/vehicle/workProcess',
    method: 'post',
    data: data,
  });
}

/**
 * 获取flv流车辆视频
 * @param {Object} params.cphm  车牌号码
 * @param {Number} params.channel 第几通道
 */
export function getCarVideoUrl(params) {
  return request({
    url: baseUrl + '/clxx/getRealVideoUrl',
    method: 'get',
    params: params,
    timeout: 4000,
  });
}

/**
 * 获取收运点位列表
 * 1 已收运 0 未收运
 */
export function getSydwList() {
  return request({
    // url: baseUrl + '/sydw/getSydwsDp',
    url: baseUrl + '/sydwxx/getSydwsDp',
    method: 'get',
  });
}

/**
 * 获取中转站位置列表及当年转运量
 * @returns 中转站列表 包含转运量
 */
export function getZzZylList() {
  return request({
    url: baseUrl + '/dp/getZzzList',
    method: 'get',
  });
}

/**
 * 获取末端站点列表
 */
export function getMdzdList() {
  return request({
    url: baseUrl + '/dp/getMdzdList',
    method: 'get',
  });
}

/* 获取公厕信息 */
export function getToiletInfo(id) {
  return request({
    url: baseUrl + '/dp/gcxx/' + id,
    method: 'get',
  });
}

/* 获取压缩站信息 */
export function getRedeVolInfo(id) {
  return request({
    url: baseUrl + '/dp/yszxx/' + id,
    method: 'get',
  });
}

/**
 * 获取中转站信息
 * @param {Number} id 中转站id
 */
export function getZzzInfo(id) {
  return request({
    url: baseUrl + '/dp/getZzInfoById/' + id,
    method: 'get',
  });
}

/* 获取中转站信息 */
export function getTransferPointInfo(id) {
  return request({
    url: baseUrl + '/dp/zzzxx/' + id,
    method: 'get',
  });
}
