<template>
  <div class="login">
    <div class="loginBox">
      <div class="loginCenter">
        <h1 style="text-align:center;">管理后台</h1>
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout" @keyup.enter.native="submitForm('ruleForm')">
          <a-form-model-item has-feedback label="" prop="mobile">
            <a-input class="changebgInput" v-model="ruleForm.mobile" size="large" placeholder="请输入用户名">
              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item has-feedback label="" prop="password">
            <a-input class="changebgInput" v-model="ruleForm.password" size="large" type="password" autocomplete="off" placeholder="请输入密码">
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
            </a-input>
          </a-form-model-item>
          <div class="forget">
            <!-- <a-checkbox v-model="ruleForm.checked"> 1个月内免登陆 </a-checkbox> -->
            <!-- <router-link to="/forgetpwd">忘记密码</router-link> -->
          </div>
          <a-form-model-item :wrapper-col="{ span: 24, offset: 0 }">
            <a-button style="width:100%;margin-top:20px;" type="primary" size="large" @click="submitForm('ruleForm')">
              登录
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
// import { Login } from '@/api/account'
import md5 from 'md5'
export default {
  name: 'Login',
  data() {
    return {
      ruleForm: {
        mobile: '',
        password: '',
        checked: false,
      },
      rules: {
        mobile: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入正确手机号码',
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入密码',
          },
        ],
      },
      layout: {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 24,
        },
      },
    }
  },
  mounted() {
    // 在页面加载时从cookie获取登录信息
    let account = this.getCookie('account-admin')
    let password = this.getCookie('password-admin')
    // 如果存在赋值给表单，并且将记住密码勾选
    if (account) {
      this.ruleForm.mobile = account
      this.ruleForm.password = password
      this.ruleForm.checked = true
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let password = md5(this.ruleForm.password)
          // if (
          //   this.getCookie('password-admin') &&
          //   this.ruleForm.password == this.getCookie('password-admin')
          // ) {
          //   password = this.getCookie('password-admin')
          // }
          // Login(this.ruleForm.mobile, password).then((res) => {
          //   // this.$store.dispatch('userInfo',res.data)
          //   if (res.success) {
          //     let userInfo = JSON.stringify(res.data)
          //     localStorage.setItem('token', res.data.token)
          //     localStorage.setItem('userInfo', userInfo)
          //     this.setUserInfo()
              this.$router.push('/')
              this.$message.success('登录成功')
          //   } else {
          //     this.$message.warning(res.message)
          //     return false
          //   }
          // })
        } else {
          return false
        }
      })
    },
    // 储存表单信息
    setUserInfo: function () {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      // 如果没有勾选，储存的信息为空
      if (this.ruleForm.checked) {
        // 加密密码后再存入cookie
        if (
          !this.getCookie('password-admin') ||
          this.ruleForm.password != this.getCookie('password-admin')
        ) {
          this.setCookie('account-admin', '', -1)
          this.setCookie('password-admin', '', -1)
          const account = this.ruleForm.mobile
          const passWord = md5(this.ruleForm.password)
          this.setCookie('account-admin', account, 30)
          this.setCookie('password-admin', passWord, 30)
        }
      } else {
        this.setCookie('account-admin', '', -1)
        this.setCookie('password-admin', '', -1)
      }
    },
    // 获取cookie
    getCookie: function (key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + '=')
        if (start !== -1) {
          start = start + key.length + 1
          var end = document.cookie.indexOf(';', start)
          if (end === -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end))
        }
      }
      return ''
    },
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
  },
}
</script>

<style scoped>
.login {
  width: 600px;
  height: 500px;
  box-shadow: 0px 0px 12px #6a6a6a;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loginBox {
  width: 100%;
  height: 100%;
  position: relative;
}
.loginCenter {
  width: 380px;
  height: 280px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>