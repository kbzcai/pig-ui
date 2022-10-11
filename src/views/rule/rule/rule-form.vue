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
    <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="dataForm.ruleName" placeholder="规则名称"></el-input>
    </el-form-item>
    <el-form-item label="规则简要说明" prop="ruleDescription">
        <el-input v-model="dataForm.ruleDescription" placeholder="规则简要说明"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="ruleStatus">
      <el-select v-model="dataForm.ruleStatus">
        <el-option
          v-for="ruleStatus in dict.type.rule_status"
          :key="ruleStatus.value"
          :label="ruleStatus.label"
          :value="ruleStatus.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="生效日期" prop="startTime"  v-if="false">
      <el-date-picker v-model="dataForm.startTime" placeholder="生效日期" type="datetime"  :picker-options="pickerOptions"
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
    import {getObj, addObj, putObj} from '@/api/rule'

    export default {
      dictTypes: ['rule_status'],
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
          ruleName: '',
          ruleDescription: '',
          ruleStatus: '',
          startTime: '',
          stopTime: '',
          createTime: '',
          createBy: '',
          updateTime: '',
          updateBy: '',
        },
        dataRule: {
          ruleName: [
            { required: true, message: '规则名称不能为空', trigger: 'blur' }
          ],

          ruleDescription: [
            { required: true, message: '规则简要说明不能为空', trigger: 'blur' }
          ],

          ruleStatus: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ],

          startTime: [
            { required: true, message: '生效日期不能为空', trigger: 'blur' }
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
