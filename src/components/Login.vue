<template>
  <div class="login">
    <el-form
      ref="form"
      status-icon
      :rules="rules"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="用户户名" prop="username">
        <img src="@/assets/头像图1.jpg" alt="" />
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// 导入axios
import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    login () {
      this.$refs.form.validate(valid => {
        if (valid) {
          axios({
            method: 'post',
            url: 'http://127.0.0.1:8888/api/private/v1/login',
            data: this.form
          }).then(res => {
            console.log(res.data)
            if (res.data.meta.status === 200) {
              // alert('登录成功')
              this.$message.success('登录成功')
              localStorage.setItem('token', res.data.data.token)
              this.$router.push('./users')
            } else {
              this.$message({
                message: res.data.meta.msg,
                type: 'error',
                duration: 1000
              })
              // alert(res.data.meta.msg)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-color: #000;
  position: relative;
}
.el-form {
  width: 400px;
  background-color: #fff;
  margin: 200px auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 75px 40px 15px;
  border-radius: 10px;
}
img {
  width: 100px;
  height: 100px;
  left: 50%;
  transform: tralateXns(-50%);
  margin: -120px;
  position: absolute;
  border: 10px solid #fff;
  border-radius: 50%;
}
</style>
