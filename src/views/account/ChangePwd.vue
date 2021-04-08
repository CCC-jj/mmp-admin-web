<template>
  <div class="changePwd">
    <h1 class="title">修改密码</h1>
    <a-list itemLayout="horizontal">
      <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="原密码" prop="oldPwd" required>
          <a-input v-model="ruleForm.oldPwd" type="password" autocomplete="off" size="large" placeholder="请输入原密码" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="新密码" prop="pass" required>
          <a-input v-model="ruleForm.pass" type="password" autocomplete="off" size="large" placeholder="请输入新密码" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="再次输入" prop="checkPass" required>
          <a-input v-model="ruleForm.checkPass" type="password" autocomplete="off" size="large" placeholder="请再次输入新密码" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="submitForm('ruleForm')" size="large">
            确定修改
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-list>
  </div>
</template>

<script>
import { changePassword } from '@/api/account'
import md5 from 'md5'
export default {
  name: 'ChangePwd',
  data() {
    let checkOldPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入原密码'))
      }
      callback()
    }
    let validatePass = (rule, value, callback) => {
      // const reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)
      if (value === '' || value.length < 6) {
        callback(new Error('密码需在六位数及以上'))
      }
      //  else if (!reg.test(value)) {
      //   callback(new Error('密码必须包含数字和字母'))
      // }
      else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
        oldPwd: '',
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }],
        oldPwd: [{ validator: checkOldPwd, trigger: 'change' }],
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 10 },
      },
    }
  },
  methods: {
    // 保存cookie
    setCookie: function (cName, value, expiredays) {
      var exdate = new Date()
      exdate.setDate(exdate.getDate() + expiredays)
      document.cookie =
        cName +
        '=' +
        decodeURIComponent(value) +
        (expiredays == null ? '' : ';expires=' + exdate.toGMTString())
    },
    clearCookie() {
      // eslint-disable-next-line no-useless-escape
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
      console.log(keys)
      if (keys) {
        for (var i = keys.length; i--; )
          document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changePassword(md5(this.ruleForm.pass), md5(this.ruleForm.oldPwd)).then((res) => {
            if (res.success) {
              this.$notification.success({
                message: '提示',
                description: '修改成功,请重新登录',
              })
              this.$refs[formName].resetFields()
              localStorage.removeItem('token')
              this.clearCookie()
              // this.setCookie('account-admin', '', -1)
              // this.setCookie('password-admin', '', -1)
              this.$router.push('/login')
            } else {
              this.$message.warning(res.message)
            }
          })
          // alert('修改成功')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>

<style scoped>
.title {
  font-size: 24px;
  margin-bottom: 30px;
}
.changePwd {
  width: 100%;
}
</style>