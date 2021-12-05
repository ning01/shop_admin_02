<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input
      placeholder="请输入内容"
      v-model="query"
      class="input-with-select"
    >
      <el-button slot="append" icon="el-icon-search" @click="search">
      </el-button>
    </el-input>
    <el-button type="success" plain @click="showAddDialog">添加用户</el-button>

    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="updateUser(scope.row)"
            size="mini"
            plain
          >
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delUser(scope.row.id)"
            size="mini"
            plain
          >
          </el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain>
            分配角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8, 10]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        :rules="rules"
        status-icon
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="addForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="addForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="addForm.email"
            placeholder="请输入邮箱地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="addForm.mobile"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="80px"
        :rules="rules"
        status-icon
      >
        <el-form-item label="用户名">
          <el-tag type="info"> {{ editForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="editForm.email"
            placeholder="请输入邮箱地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="editForm.mobile"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入axios

// import axios from 'axios'
export default {
  data () {
    return {
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 9, message: '用户名长度在3-9位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度在6-12位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入合法的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入合法的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getUserList () {
      this.axios({
        method: 'get',
        url: 'http://127.0.0.1:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
        // headers: {
        //   Authorization: localStorage.getItem('token')
        // }
      }).then(res => {
        // console.log(res)
        let {
          meta: { status },
          data: { users, total }
        } = res
        if (status === 200) {
          this.userList = users
          this.total = total

          // console.log(this.userList)
        }
      })
    },
    handleSizeChange (val) {
      // console.log(val)
      this.pageSize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      // console.log(val)
      this.currentPage = val
      this.getUserList()
    },
    search () {
      this.currentPage = 1
      this.getUserList()
    },
    delUser (id) {
      // console.log(id)
      this.$confirm('您确定要删除用户信息吗?', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          this.axios({
            method: 'delete',
            url: `http://127.0.0.1:8888/api/private/v1/users/${id}`,
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => {
            // console.log(res)
            if (res.meta.status === 200) {
              if (this.userList.length <= 1 && this.currentPage > 1) {
                this.currentPage--
              }
              this.getUserList()
              this.$message.success('恭喜你,删除成功了')
            }
          })
        })
        .catch(() => {
          this.$message.info('取消删除了')
        })
    },
    changeState ({ id, mg_state: mgState }) {
      // console.log(user)
      this.axios({
        method: 'put',
        url: `http://127.0.0.1:8888/api/private/v1/users/${id}/state/${mgState}`
        // headers: {
        //   Authorization: localStorage.getItem('token')
        // }
      }).then(res => {
        // console.log(res)
        if (res.meta.status === 200) {
          this.$message.success('修改状态成功了')
        } else {
          this.$message.error('修改状态失败了')
        }
      })
    },
    showAddDialog () {
      this.addDialogVisible = true
    },
    addUser () {
      this.$refs.addForm.validate(valid => {
        if (!valid) return false
        // 校验成功,发送axios
        this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        }).then(res => {
          let {
            meta: { status, msg }
          } = res
          if (status === 201) {
            this.total++
            this.currentPage = Math.ceil(this.total / this.pageSize)
            this.getUserList()
            this.$refs.addForm.resetFields()
            this.addDialogVisible = false
            this.$message.success('添加用户成功')
          } else {
            this.$message.error(msg)
          }
        })
      })
    },
    updateUser (row) {
      this.editDialogVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    editUser () {
      this.$refs.editForm.validate(valid => {
        if (!valid) return false
        // 发送ajax
        this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        }).then(res => {
          // console.log(res)
          let {
            meta: { status }
          } = res
          if (status === 200) {
            this.getUserList()
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.$message.success('恭喜你,修改用户成功')
          } else {
            this.$message.error('服务器请求失败')
          }
        })
      })
    }
  },
  created () {
    this.getUserList()
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  padding-left: 10px;
  line-height: 50px;
  font-size: 16px;
  background-color: #ccc;
}
.input-with-select {
  width: 300px;
}
</style>
