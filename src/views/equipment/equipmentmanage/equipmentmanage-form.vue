<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    append-to-body
    :close-on-click-modal="false"
    @close="closeDialog()"
    :visible.sync="visible">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="主键" prop="id" v-if="dataForm.id">
        <el-input v-model="dataForm.id" placeholder="主键" readonly></el-input>
    </el-form-item>
      <el-form-item label="设备编号" prop="equipmentNo" >
        <el-input v-model="dataForm.equipmentNo" placeholder="设备编号"></el-input>
      </el-form-item>
      <el-form-item label="责任人" prop="responsePeople" >
        <el-input v-model="dataForm.responsePeople" placeholder="责任人"></el-input>
      </el-form-item>
      <el-form-item label="设备状态" prop="equipmentStatus">
        <el-select v-model="dataForm.equipmentStatus">
          <el-option
            v-for="equipmentStatus in dict.type.equipment_status"
            :key="equipmentStatus.value"
            :label="equipmentStatus.label"
            :value="equipmentStatus.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备串号" prop="equipmentCh" >
        <el-input v-model="dataForm.equipmentCh" placeholder="设备串号"></el-input>
      </el-form-item>
      <el-form-item label="启用日期" prop="startTime">
        <el-date-picker v-model="dataForm.startTime" placeholder="启用日期" type="datetime"  :picker-options="pickerOptions"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
    <el-form-item label="创建时间" prop="createTime" v-if="dataForm.id">
        <el-input v-model="dataForm.createTime" placeholder="创建时间" readonly></el-input>
    </el-form-item>
    <el-form-item label="创建人" prop="createBy" v-if="dataForm.id">
        <el-input v-model="dataForm.createBy" placeholder="创建人" readonly></el-input>
    </el-form-item>
    <el-form-item label="修改时间" prop="updateTime" v-if="dataForm.id">
        <el-input v-model="dataForm.updateTime" placeholder="修改时间" readonly></el-input>
    </el-form-item>
    <el-form-item label="更新人" prop="updateBy" v-if="dataForm.id">
        <el-input v-model="dataForm.updateBy" placeholder="更新人" readonly></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="canSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import {getObj, addObj, putObj} from '@/api/equipmentmanage'

    export default {
      dictTypes: ['equipment_status'],
    data () {
      return {
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
          equipmentNo: '',
          responsePeople: '',
          equipmentStatus: '',
          equipmentCh: '',
          startTime: '',
          stopTime: '',
          createTime: '',
          createBy: '',
          updateTime: '',
          updateBy: '',
        },
        dataRule: {
          equipmentNo: [
            { required: true, message: '设备编号不能为空', trigger: 'blur' }
          ],

          responsePeople: [
            { required: true, message: '责任人不能为空', trigger: 'blur' }
          ],

          equipmentStatus: [
            { required: true, message: '设备状态不能为空', trigger: 'blur' }
          ],

          equipmentCh: [
            { required: true, message: '外出地点不能为空', trigger: 'blur' }
          ],

          startTime: [
            { required: true, message: '启用日期不能为空', trigger: 'blur' }
          ],

          stopTime: [
            { required: true, message: '停用日期不能为空', trigger: 'blur' }
          ],

        }
      }
    },
    methods: {
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
