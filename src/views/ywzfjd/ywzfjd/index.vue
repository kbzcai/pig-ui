<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->
<template>
    <div class="execution">
        <basic-container>
          <el-form :inline="true" :model="zfjd">
            <el-form-item label="案号检索">
              <el-input v-model="zfjd.caseNo" placeholder="请输入案号检索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <br>
            <!--        <el-form-item label="违法行为">-->
            <!--          <el-select v-model="zfjd.illegalAction">-->
            <!--            <el-option label="全部" value=""></el-option>-->
            <!--          <el-option-->
            <!--            v-for="dict in dict.type.zfjd_illegal_action"-->
            <!--            :key="dict.value"-->
            <!--            :label="dict.label"-->
            <!--            :value="dict.value"-->
            <!--          ></el-option>-->
            <!--        </el-select>-->
            <!--        </el-form-item>-->
            <el-form-item label="违法行为">
              <el-radio-group v-model="zfjd.illegalAction">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button v-for="zfjdIllegalAction in dict.type.zfjd_illegal_action"
                                 :label="zfjdIllegalAction.value"
                >{{zfjdIllegalAction.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <br>
            <el-form-item label="确认状态">
              <!--          <el-select v-model="zfjd.status">-->
              <!--            <el-option label="全部" value=""></el-option>-->
              <!--            <el-option-->
              <!--              v-for="dict in dict.type.zfjd_status"-->
              <!--              :key="dict.value"-->
              <!--              :label="dict.label"dict-tag-->
              <!--              :value="dict.value"-->
              <!--            ></el-option>-->
              <!--          </el-select>-->
              <el-radio-group v-model="zfjd.status">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button v-for="zfjdStatus in dict.type.zfjd_status"
                                 :label="zfjdStatus.value">{{zfjdStatus.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
<!--            <el-form-item style="float: right">-->
<!--              <el-button-->
<!--                class="filter-item"-->
<!--                plain-->
<!--                type="primary"-->
<!--                size="small"-->
<!--                icon="el-icon-download"-->
<!--                @click="exportExcel"-->
<!--              >导出-->
<!--              </el-button>-->
<!--            </el-form-item>-->
          </el-form>
            <avue-crud ref="crud"
                       :page.sync="page"
                       :data="tableData"
                       :permission="permissionList"
                       :table-loading="tableLoading"
                       :option="tableOption"
                       @on-load="getList"
                       @search-change="searchChange"
                       @refresh-change="refreshChange"
                       @size-change="sizeChange"
                       @current-change="currentChange"
                       @row-update="handleUpdate"
                       @row-save="handleSave"
                       @row-del="rowDel">
            </avue-crud>

        </basic-container>
    </div>
</template>

<script>
    import {fetchList, getObj, addObj, putObj, delObj} from '@/api/zfjd'
    import {tableOption} from '@/const/crud/ywzfjd'
    import {mapGetters} from 'vuex'

    export default {
        dictTypes: ['zfjd_illegal_action','zfjd_status'],
        name: 'ywzfjd',
        data() {
            return {
                zfjd: {
                  caseNo:'',
                  illegalAction:'',
                  status:''
                },
                searchForm: {},
                tableData: [],
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                tableLoading: false,
                tableOption: tableOption
            }
        },
        computed: {
            ...mapGetters(['permissions']),
            permissionList() {
                return {
                    addBtn: this.vaildData(this.permissions.zfjd_zfjd_add, false),
                    delBtn: this.vaildData(this.permissions.zfjd_zfjd_del, false),
                    editBtn: this.vaildData(this.permissions.zfjd_zfjd_edit, false),
                };
            }
        },
        methods: {
          onSubmit(page){
            fetchList(Object.assign({
              current: page.currentPage,
              size: page.pageSize
            }, this.zfjd,this.searchForm )).then(response => {
              this.tableData = response.data.data.records
              this.page.total = response.data.data.total
              this.tableLoading = false
            }).catch(() => {
              this.tableLoading=false
            })
          },
            getList(page, params) {
                this.tableLoading = true
                fetchList(Object.assign({
                    current: page.currentPage,
                    size: page.pageSize
                }, this.zfjd,this.searchForm),).then(response => {
                    this.tableData = response.data.data.records
                    this.page.total = response.data.data.total
                    this.tableLoading = false
                }).catch(() => {
                    this.tableLoading=false
                })
            },
            rowDel: function (row, index) {
                this.$confirm('是否确认删除ID为' + row.id, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    return delObj(row.id)
                }).then(data => {
                    this.$message.success('删除成功')
                    this.getList(this.page)
                }).catch(cancelorerror=>{})
            },
            handleUpdate: function (row, index, done,loading) {
                putObj(row).then(data => {
                    this.$message.success('修改成功')
                    done()
                    this.getList(this.page)
                }).catch(() => {
                    loading();
                });
            },
            handleSave: function (row, done,loading) {
                addObj(row).then(data => {
                    this.$message.success('添加成功')
                    done()
                    this.getList(this.page)
                }).catch(() => {
                    loading();
                });
            },
            sizeChange(pageSize){
                this.page.pageSize = pageSize
            },
            currentChange(current){
                this.page.currentPage = current
            },
            searchChange(form, done) {
                this.searchForm = form
                this.page.currentPage = 1
                this.getList(this.page, form)
                done()
            },
            refreshChange() {
                this.getList(this.page)
            }
        }
    }
</script>
