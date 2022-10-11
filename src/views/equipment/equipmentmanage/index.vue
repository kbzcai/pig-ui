<template>
  <div class="mod-config">
    <basic-container>
      <el-form :inline="true" :model="equipment">
        <el-form-item label="设备编号检索">
          <el-input v-model="equipment.equipmentNo" placeholder="请输入设备编号检索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <br>
        <el-form-item label="确认状态">
          <el-radio-group v-model="equipment.equipmentStatus">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button v-for="equipmentStatus in dict.type.equipment_status"
                             :label="equipmentStatus.value">{{equipmentStatus.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item style="float: right">
          <el-button
            class="filter-item"
            plain
            type="primary"
            size="small"
            icon="el-icon-download"
            @click="exportExcel"
          >导出
          </el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="permissions.equipment_equipmentmanage_add" icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
        <el-form-item style="float: right">
         <el-button type="primary" @click="batchDelect" :disabled="this.selectIds.length === 0" icon="el-icon-delete">删除</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="stopEquipment" :disabled="this.selectIds.length === 0" icon="el-icon-remove-outline">停用</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="startEquipment" :disabled="this.selectIds.length === 0" icon="el-icon-switch-button">启用</el-button>
        </el-form-item>
      </el-form>

      <div class="avue-crud" id="equipmenttable">
        <el-table
                :data="dataList"
                border
                v-loading="dataListLoading"
                @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
            <el-table-column
                    prop="id"
                    header-align="center"
                    align="center"
                    label="主键"
                    v-if="false"
            >
            </el-table-column>
            <el-table-column
                    prop="equipmentNo"
                    header-align="center"
                    align="center"
                    label="设备编号">
            </el-table-column>
            <el-table-column
                    prop="responsePeople"
                    header-align="center"
                    align="center"
                    label="责任人">
            </el-table-column>
            <el-table-column
                    prop="equipmentStatus"
                    header-align="center"
                    align="center"
                    label="设备状态">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.equipment_status" :value="scope.row.equipmentStatus"/>
              </template>
            </el-table-column>
            <el-table-column
                    prop="equipmentCh"
                    header-align="center"
                    align="center"
                    label="设备串号">
            </el-table-column>
            <el-table-column
                    prop="startTime"
                    header-align="center"
                    align="center"
                    label="启用日期">
            </el-table-column>
<!--            <el-table-column-->
<!--                    prop="stopTime"-->
<!--                    header-align="center"-->
<!--                    align="center"-->
<!--                    label="停用日期">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="createTime"-->
<!--                    header-align="center"-->
<!--                    align="center"-->
<!--                    label="创建时间">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="createBy"-->
<!--                    header-align="center"-->
<!--                    align="center"-->
<!--                    label="创建人">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="updateTime"-->
<!--                    header-align="center"-->
<!--                    align="center"-->
<!--                    label="修改时间">-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--                    prop="updateBy"-->
<!--                    header-align="center"-->
<!--                    align="center"-->
<!--                    label="更新人">-->
<!--            </el-table-column>-->
          <el-table-column
                  header-align="center"
                  align="center"
                  label="操作">
            <template slot-scope="scope">
              <el-button v-if="permissions.equipment_equipmentmanage_edit" type="text" size="small" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
              <el-button v-if="permissions.equipment_equipmentmanage_del" type="text" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="avue-crud__pagination">
        <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="totalPage"
                background
                layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <table-form v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></table-form>
    </basic-container>
  </div>
</template>

<script>
  import {fetchList,delObjs,delObj} from '@/api/equipmentmanage'
  import TableForm from './equipmentmanage-form'
  import {mapGetters} from 'vuex'
  import XLSX from "xlsx";
  import FileSaver from "file-saver";
  import {startEquipmentByIdList, stopEquipmentByIdList} from "../../../api/equipmentmanage";
  export default {
    dictTypes: ['equipment_status'],
    data () {
      return {
        tableData: [],//表格数据
        selectIds: [], //当前选框选中的值
        equipment: {
          equipmentNo:'',
          equipmentStatus:'',
        },
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      TableForm
    },
    created () {
      this.getDataList()
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      batchDelect() {
        // 删除前的提示
        this.$confirm("此操作将永久删除信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          // 确定执行 then 方法
          var idList = [];
          // 遍历数组得到每个 id 值，设置到 idList 里面
          for (var i = 0; i < this.selectIds.length; i++) {
            var obj = this.selectIds[i];
            var id = obj.id;
            idList.push(id);
          }
          // 调用接口
          delObjs(idList).then(response => {
            // 提示
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            // 刷新页面
            this.getDataList();
          });
        });
      },
      startEquipment() {
        // 启动前的提示
        this.$confirm("将启动所有已勾选的设备, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          // 确定执行 then 方法
          var idList = [];
          // 遍历数组得到每个 id 值，设置到 idList 里面
          for (var i = 0; i < this.selectIds.length; i++) {
            var obj = this.selectIds[i];
            var id = obj.id;
            idList.push(id);
          }
          // 调用接口
          startEquipmentByIdList(idList).then(response => {
            // 提示
            this.$message({
              type: "success",
              message: "启动成功!"
            });
            // 刷新页面
            this.getDataList();
          });
        });
      },
      stopEquipment() {
        // 删除前的提示
        this.$confirm("将停止所有已勾选的设备, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          // 确定执行 then 方法
          var idList = [];
          // 遍历数组得到每个 id 值，设置到 idList 里面
          for (var i = 0; i < this.selectIds.length; i++) {
            var obj = this.selectIds[i];
            var id = obj.id;
            idList.push(id);
          }
          // 调用接口
          stopEquipmentByIdList(idList).then(response => {
            // 提示
            this.$message({
              type: "success",
              message: "停止成功!"
            });
            // 刷新页面
            this.getDataList();
          });
        });
      },
      handleSelectionChange(selectIds) {
        this.selectIds = selectIds;
        console.log("选中的值",selectIds.map((item) => item.id));
      },
      onSubmit(){
        this.dataListLoading = true
        fetchList(Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
        },this.equipment)).then(response => {
          this.dataList = response.data.data.records
          this.totalPage = response.data.data.total
        })
        this.dataListLoading = false
      },
      exportExcel() {
        /* 从表生成工作簿对象 */
        var wb = XLSX.utils.table_to_book(document.querySelector(' #equipmenttable'))
        /* 获取二进制字符串作为输出 */
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          // Blob 对象表示一个不可变、原始数据的类文件对象。
          // Blob 表示的不一定是JavaScript原生格式的数据。
          // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          FileSaver.saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            // 设置导出文件名称
            'equipment.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        } return wbout
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        fetchList(Object.assign({
          current: this.pageIndex,
          size: this.pageSize
        },this.equipment)).then(response => {
          this.dataList = response.data.data.records
          this.totalPage = response.data.data.total
        })
        this.dataListLoading = false
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm('是否确认删除ID为' + id, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(id)
        }).then(data => {
          this.$message.success('删除成功')
          this.getDataList()
        }).catch(() => {})
      }
    }
  }
</script>
