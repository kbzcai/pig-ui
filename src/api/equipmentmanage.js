/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/equipment/equipmentmanage/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/equipment/equipmentmanage',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/equipment/equipmentmanage/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/equipment/equipmentmanage/' + id,
    method: 'delete'
  })
}

export function delObjs(idList) {
  return request({
    url: '/equipment/equipmentmanage/batchRemove',
    method: 'delete',
    data: idList
  })
}

export function putObj(obj) {
  return request({
    url: '/equipment/equipmentmanage',
    method: 'put',
    data: obj
  })
}

export function startEquipmentByIdList(idList) {
  return request({
    url: '/equipment/equipmentmanage/startEquipmentByIds',
    method: 'put',
    data: idList
  })
}

export function stopEquipmentByIdList(idList) {
  return request({
    url: '/equipment/equipmentmanage/stopEquipmentByIds',
    method: 'put',
    data: idList
  })
}
