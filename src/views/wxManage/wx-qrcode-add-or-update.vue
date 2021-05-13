<template>
  <a-modal :title="!dataForm.id ? '新增' : '修改'" :maskClosable="false" :visible.sync="visible">
    <a-form-model :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <a-form-model-item label="二维码类型" prop="isTemp">
        <a-radio-group v-model="dataForm.isTemp ">
          <a-radio :value="true">临时</a-radio>
          <a-radio :value="false">永久</a-radio>
        </a-radio-group>
        <div>
          <a class="text-warning" v-show="!dataForm.isTemp" target="_blank" href="https://developers.weixin.qq.com/doc/offiaccount/Account_Management/Generating_a_Parametric_QR_Code.html">注意永久二维码上限10万个，且暂时无法删除旧的二维码</a>
        </div>
      </a-form-model-item>

      <a-form-model-item label="场景值" prop="sceneStr">
        <a-input v-model="dataForm.sceneStr" placeholder="任意字符串" :maxLength="64"></a-input>
      </a-form-model-item>
      <a-form-model-item label="失效时间/秒" prop="expireSeconds" v-if="dataForm.isTemp">
        <a-input v-model="dataForm.expireSeconds" placeholder="单位：秒，最大2592000（30天）"></a-input>
        <div>最大30天，当前设置：<span class="text-warning">{{dataForm.expireSeconds/(24*3600)}}天</span></div>
      </a-form-model-item>
    </a-form-model>
    <span slot="footer" class="dialog-footer">
      <a-button @click="visible = false">取消</a-button>
      <a-button type="primary" @click="dataFormSubmit()">确定</a-button>
    </span>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        isTemp: true,
        sceneStr: '',
        expireSeconds: 2592000,
      },
      dataRule: {
        isTemp: [{ required: true, message: '二维码类型不能为空', trigger: 'blur' }],
        sceneStr: [{ required: true, message: '场景值ID不能为空', trigger: 'blur' }],
        expireSeconds: [{ required: true, message: '该二维码失效时间不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/manage/wxQrCode/createTicket`),
            method: 'post',
            data: this.$http.adornData(this.dataForm),
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                },
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
  },
}
</script>
