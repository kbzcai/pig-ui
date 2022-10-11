<template>

  <el-dialog
    :title="查看"
    append-to-body
    :close-on-click-modal="false"
    @close="closeDialog()"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="立案时间" prop="caseTime">
        <el-input v-model="dataForm.caseTime" placeholder="立案时间" readonly></el-input>
      </el-form-item>
      <el-form-item label="案号" prop="caseNo">
        <el-input v-model="dataForm.caseNo" placeholder="案号" readonly></el-input>
      </el-form-item>
      <el-form-item label="案件名称" prop="caseName">
        <el-input v-model="dataForm.caseName" placeholder="案件名称" readonly></el-input>
      </el-form-item>
      <el-form-item label="案件类型" prop="caseType">
        <el-input v-model="dataForm.caseType" placeholder="案件类型" readonly></el-input>
      </el-form-item>
      <el-form-item label="立案机关" prop="caseOrgan">
        <el-input v-model="dataForm.caseOrgan" placeholder="立案机关" readonly></el-input>
      </el-form-item>
    <el-form-item label="所属单位" prop="orderby">
        <el-input v-model="dataForm.orderby" placeholder="所属单位" readonly></el-input>
    </el-form-item>
    <el-form-item label="责任人" prop="responsePeople">
        <el-input v-model="dataForm.responsePeople" placeholder="责任人" readonly></el-input>
    </el-form-item>
    <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="dataForm.deviceName" placeholder="设备名称" readonly></el-input>
    </el-form-item>
    <el-form-item label="外出地点" prop="outLocation">
        <el-input v-model="dataForm.outLocation" placeholder="外出地点" readonly></el-input>
    </el-form-item>
    <el-form-item label="违法时间" prop="illegalTime" >
        <el-date-picker v-model="dataForm.illegalTime" placeholder="违法时间" type="datetime"  :picker-options="pickerOptions"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" readonly
        ></el-date-picker >
    </el-form-item>
    <el-form-item label="视频文件" prop="videoFile">
        <el-input v-model="dataForm.videoFile" placeholder="视频文件" readonly></el-input>
         <el-button @click="playVideo"> 视频预览 </el-button>
      <el-dialog
        :visible.sync="videoVisible"
        width="80%"
        title="案例视频"
        @close="closeDialog"
      >
        <div style="height:500px;text-align:center">
          <!--需要弹出的内容部分-->
          <video
            width="100%"
            height="100%"
            autoplay="autoplay"
            :src="dataForm.videoFile"
            :poster="dataForm.videoFile"
            controls="controls"
            ref="video"
          ></video>
        </div>
      </el-dialog>
<!--      <el-upload :action="MixinUploadApi" :on-progress="uploadVideoProcess" :on-success="handleVideoSuccess"-->
<!--                 :on-error="handleVideoError" :before-upload="beforeUploadVideo" :show-file-list="false">-->
<!--      </el-upload>-->
<!--      <el-button size="small" type="primary">上传视频</el-button>-->
<!--      <div slot="tip" class="el-upload__tip">只能上传视频</div>-->
    </el-form-item>
    <el-form-item label="违法行为" prop="illegalAction">
<!--        <el-input v-model="dataForm.illegalAction" placeholder="违法行为"></el-input>-->
<!--      <el-select v-model="dataForm.illegalAction" placeholder="请选择">-->
<!--        <el-option-->
<!--          v-for="item in options"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value">-->
<!--        </el-option>-->
<!--      </el-select>-->
<!--    </el-form-item>-->
      <el-select v-model="dataForm.illegalAction" readonly>
        <el-option
          v-for="zfjdIllegalAction in dict.type.zfjd_illegal_action"
          :key="zfjdIllegalAction.value"
          :label="zfjdIllegalAction.label"
          :value="zfjdIllegalAction.value"
        ></el-option>
      </el-select>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>


</template>

<script>
    import {getObj, addObj, putObj} from '@/api/zfjd'

    export default {
      dictTypes: ['zfjd_illegal_action'],
    data () {
      return {
        //默认false 弹框隐藏状态
        videoVisible: false,
        // options: [{
        //   value: '违法搜身',
        //   label: '违法搜身'
        // }, {
        //   value: '未依法受案',
        //   label: '未依法受案'
        // }, {
        //   value: '出警不及时',
        //   label: '出警不及时'
        // }, {
        //   value: '出警不规范',
        //   label: '出警不规范'
        // }, {
        //   value: '未依法接收证据',
        //   label: '未依法接收证据'
        // },{
        //   value: '违法搜查',
        //   label: '违法搜查'
        // },{
        //   value: '违法辨认',
        //   label: '违法辨认'
        // },{
        //   value: '言行不规范',
        //   label: '言行不规范'
        // }],
        //点击按钮时,触发弹出效果
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        visible: false,
        canSubmit: false,
        dataForm: {
          id: '',
          orderby: '',
          responsePeople: '',
          deviceName: '',
          outLocation: '',
          illegalTime: '',
          videoFile: '',
          illegalAction: '1',
          createTime: '',
          createBy: '',
          updateTime: '',
          updateBy: '',
        },
        dataRule: {
          orderby: [
            { required: true, message: '所属单位不能为空', trigger: 'blur' }
          ],

          responsePeople: [
            { required: true, message: '责任人不能为空', trigger: 'blur' }
          ],

          deviceName: [
            { required: true, message: '设备名称不能为空', trigger: 'blur' }
          ],

          outLocation: [
            { required: true, message: '外出地点不能为空', trigger: 'blur' }
          ],

          illegalTime: [
            { required: true, message: '违法时间不能为空', trigger: 'blur' }
          ],

          videoFile: [
            { required: true, message: '视频文件不能为空', trigger: 'blur' }
          ],

          illegalAction: [
            { required: true, message: '违法行为不能为空', trigger: 'blur' }
          ],

        }
      }
    },
    methods: {
      playVideo() {
        //触发点击时,让其显示
        this.videoVisible = true
      },
      //事件操作 (表格、表单 同理 需要执行的事件 在此处)
      closeDialog() {
        //点击播放视频
        this.$refs.video.pause()
      },
      beforeUploadVideo(file) {
        const fileSize = file.size / 1024 / 1024 < 300
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].indexOf(file.type) === -1) {
          this.$message.error('请上传正确的视频格式')
          return false
        }
        if (!fileSize) {
          this.$message.error('视频大小不能超过300MB')
          return false
        }
      },
      init (id) {
        this.visible = true;
        this.canSubmit = true;
        this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            if (id) {
            getObj(id).then(response => {
                this.dataForm = response.data.data
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.canSubmit = false;
            if (this.dataForm.id) {
                putObj(this.dataForm).then(data => {
                    this.$notify.success('修改成功')
                    this.visible = false
                    this.$emit('refreshDataList')
                }).catch(() => {
                    this.canSubmit = true;
                });
            } else {
                addObj(this.dataForm).then(data => {
                    this.$notify.success('添加成功')
                    this.visible = false
                    this.$emit('refreshDataList')
                }).catch(() => {
                    this.canSubmit = true;
                });
            }
          }
        })
      },
      //重置表单
      closeDialog() {
          this.$refs["dataForm"].resetFields()
      }
    }
  }
</script>
