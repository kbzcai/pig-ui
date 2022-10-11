<template>
  <div class="mod-config">
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
          <el-button v-if="permissions.zfjd_zfjd_add" icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>

        </el-form-item>
<!--        <el-form-item label="工位名称">-->
<!--          <el-autocomplete-->
<!--            class="inline-input"-->
<!--            v-model="stationCondition.stationName"-->
<!--            :fetch-suggestions="querySearch1"-->
<!--            placeholder="请输入工位名称查询"-->
<!--            :trigger-on-focus="false"-->
<!--            @select="handleSelect"-->
<!--            clearable-->
<!--          ></el-autocomplete>-->
<!--        </el-form-item>-->
      </el-form>


      <div class="avue-crud" id="zfjdtable">
        <el-table
                :data="dataList"
                border
                v-loading="dataListLoading">
            <el-table-column
                    prop="id"
                    header-align="center"
                    align="center"
                    label="主键">
            </el-table-column>
            <el-table-column
                    prop="orderby"
                    header-align="center"
                    align="center"
                    label="所属单位">
            </el-table-column>
            <el-table-column
                    prop="responsePeople"
                    header-align="center"
                    align="center"
                    label="责任人">
            </el-table-column>
            <el-table-column
                    prop="deviceName"
                    header-align="center"
                    align="center"
                    label="设备名称">
            </el-table-column>
            <el-table-column
                    prop="outLocation"
                    header-align="center"
                    align="center"
                    label="外出地点">
            </el-table-column>
            <el-table-column
                    prop="illegalTime"
                    header-align="center"
                    align="center"
                    label="违法时间">
            </el-table-column>
            <el-table-column
                    prop="videoFile"
                    header-align="center"
                    align="center"
                    label="视频文件">
              <template slot-scope="scope">
                <div class="video">
                  <el-dialog
                    title="视频预览"
                    width="72%"
                    append-to-body
                    top="20px"
                    :visible.sync="dialogVisible"
                    @closed="closeDialog"
                  >
                    <h3>{{ videoFile }}</h3>
                    <video
                      width="100%"
                      autoplay="autoplay"
                      :src="playvideo"
                      :poster="playvideo"
                      controls="controls"
                      id="video"
                      preload
                    ></video>
                  </el-dialog>
                  <!-- 页面table显示的video标签 -->
                  <button v></button>
                  <video
                    :src="scope.row.videoFile"
                    width="100"
                    preload
                  ></video>
                  <i
                    class="el-icon-video-play playIcon"
                    @click="handleCheck(scope.row)"
                  ></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="illegalAction"
                    header-align="center"
                    align="center"
                    label="违法行为">
              <template slot-scope="scope">
              <dict-tag :options="dict.type.zfjd_illegal_action" :value="scope.row.illegalAction"/>
            </template>
            </el-table-column>
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
                <el-button v-if="permissions.zfjd_zfjd_get" type="text" size="small" icon="el-icon-search" @click="getHandle(scope.row.id)">查看</el-button>
<!--              <el-button v-if="permissions.zfjd_zfjd_edit" type="text" size="small" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>-->
<!--              <el-button v-if="permissions.zfjd_zfjd_del" type="text" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>-->
              <el-button v-if="permissions.zfjd_zfjd_edit" type="text" size="small" icon="el-icon-edit" @click="clHandle(scope.row.id)">处理</el-button>
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
      <ZfjdGetForm v-if="getVisible" ref="get" @refreshDataList="getDataList"></ZfjdGetForm>
      <ZfjdClForm v-if="clVisible" ref="cl" @refreslhDataList="getDataList"></ZfjdClForm>
    </basic-container>
  </div>
</template>

<script>
  import {fetchList,delObj} from '@/api/zfjd'
  import TableForm from './zfjd-form'
  import ZfjdGetForm from './zfjd-get-form'
  import ZfjdClForm from './zfjd-cl-form'
  import {mapGetters} from 'vuex'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    dictTypes: ['zfjd_illegal_action','zfjd_status'],
    data () {
      return {
        dialogVisible: false, // 视频播放弹窗
        playvideo: null, // 存储用户点击的视频播放链接
        playvideoName: null, // 存储正在播放视频的名称
        dataForm: {
          key: ''
        },
        zfjd: {
          caseNo:'',
          illegalAction:'',
          status:''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        getVisible: false,
        clVisible: false
      }
    },
    components: {
      ZfjdGetForm,
      TableForm,
      ZfjdClForm
    },
    created () {
      this.getDataList()
      // this.zfjd.illegalAction.push(this.dict.type.zfjd_illegal_action[0])
      this.
      console.log('this.zfjd.illegalAction',this.dict.type.zfjd_illegal_action[0].value);
    },
    computed: {
      ...mapGetters(['permissions'])
    },
    methods: {
      closeDialog(){
        this.$refs.video.pause()
      },
      handleCheck(row) {
        this.playvideo = row.videoFile // 存储用户点击的视频播放链接
        this.playvideoName = row.videoFile // 存储用户点击的视频播放链接
        this.dialogVisible = true
        console.log(row.videoFile)
      },
      onSubmit(){
        this.dataListLoading = true
        fetchList(Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
        },this.zfjd)).then(response => {
          this.dataList = response.data.data.records
          this.totalPage = response.data.data.total
        })
        this.dataListLoading = false
      },
      exportExcel() {
        /* 从表生成工作簿对象 */
        var wb = XLSX.utils.table_to_book(document.querySelector(' #zfjdtable'))
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
            'zfjd.xlsx')
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
        },this.zfjd)).then(response => {
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
      clHandle (id) {
        this.clVisible = true
        this.$nextTick(() => {
          this.$refs.cl.init(id)
        })
      },
      getHandle (id) {
        this.getVisible = true
        this.$nextTick(() => {
          this.$refs.get.init(id)
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
