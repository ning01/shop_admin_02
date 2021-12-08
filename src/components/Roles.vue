<template>
  <div class="role">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <span class="span1" v-if="row.children.length === 0">暂无权限</span>
          <!-- {{ row }} -->
          <!-- <span v-for="l1 in row.children" :key="l1.id">{{ l1.authName }}</span> -->
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag size="medium" @close="delRight(row, l1.id)" closable>{{
                l1.authName
              }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag
                    size="medium"
                    type="success"
                    @close="delRight(row, l2.id)"
                    closable
                    >{{ l2.authName }}</el-tag
                  >
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <span v-for="l3 in l2.children" :key="l3.id">
                    <el-tag
                      size="medium"
                      class="l3"
                      type="warning"
                      @close="delRight(row, l3.id)"
                      closable
                    >
                      {{ l3.authName }}</el-tag
                    >
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName" width="200px">
      </el-table-column>
      <el-table-column label="描述" prop="roleDesc" width="200px">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            @click="showEditRole(row)"
            plain
            icon="el-icon-edit"
            size="mini"
          >
          </el-button>
          <el-button
            type="danger"
            @click="delRole(row.id)"
            plain
            icon="el-icon-delete"
            size="mini"
          >
          </el-button>
          <el-button
            type="success"
            plain
            icon="el-icon-check"
            @click="showAssignDialog(row)"
            size="mini"
          >
            分配权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 展示分配权限模态框-->
    <el-dialog title="角色授权" :visible.sync="assignDialogVisible" width="40%">
      <el-tree
        :data="data"
        show-checkbox
        :props="defaultProps"
        node-key="id"
        default-expand-all
        ref="tree"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色模态框 -->
    <el-dialog
      :title="this.addForm.id ? '修改角色' : '添加角色'"
      :visible.sync="addDialogVisible"
      width="40%"
    >
      <el-form
        ref="addForm"
        :rules="rules"
        :model="addForm"
        label-width="80px"
        status-icon
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请输入角色名称">
          </el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" placeholder="请输入描述信息">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="saveRole">确 定</el-button> -->
        <el-button type="primary" @click="saveRole">{{
          this.addForm.id ? '修改' : '添加'
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      assignDialogVisible: false,

      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      addDialogVisible: false,
      addForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getRoleList () {
      let res = await this.axios.get('roles')
      // console.log(res)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.roleList = data
        // console.log(this.roleList)
      }
    },
    async delRight (role, rightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        role.children = data
        this.$message.success('删除权限成功')
      } else {
        this.$message.info('删除失败了')
      }
    },
    async showAssignDialog (role) {
      this.roleId = role.id
      this.assignDialogVisible = true
      let res = await this.axios.get(`rights/tree`)
      // console.log(res)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.data = data
      }
      // console.log(role)
      let ids = []
      role.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    async assignRight () {
      // 1.获取到所有选中的Id
      // 2.发送ajax
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      let rids = checkedKeys.concat(halfCheckedKeys).join()
      // console.log(ids)
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids
      })
      let {
        meta: { status }
      } = res
      if (status === 200) {
        this.getRoleList()
        this.assignDialogVisible = false
        this.$message.success('角色授权成功')
      } else {
        this.$message.warning('服务器异常')
      }
    },
    showAddDialog () {
      this.addDialogVisible = true
      this.addForm.roleName = ''
      this.addForm.roleDesc = ''
      this.addForm.id = ''
    },
    saveRole () {
      // 1.表单校验
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 2.发送ajax
        //            修改           添加
        // method    put            post
        // url       roles /:id     roles
        // status    200             201
        let id = this.addForm.id
        let method = id ? 'put' : 'post'
        let url = id ? `roles/${id}` : `roles`
        let status = id ? 200 : 201
        let res = await this.axios({
          method,
          url,
          data: this.addForm
        })

        if (res.meta.status === status) {
          this.$refs.addForm.resetFields()
          this.addDialogVisible = false
          this.getRoleList()
          this.$message.success('操作成功')
        } else {
          this.$message.error('操作失败了')
        }
      })
    },
    showEditRole (role) {
      this.addDialogVisible = true
      this.addForm.roleName = role.roleName
      this.addForm.roleDesc = role.roleDesc
      this.addForm.id = role.id
    },
    async delRole (id) {
      // 1.显示提示框
      try {
        await this.$confirm('你确定要删除该角色吗?', '温馨提示', {
          type: 'warning'
        })
        // 发送ajax
        let res = await this.axios.delete(`roles/${id}`)
        if (res.meta.status === 200) {
          this.getRoleList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    }
  },
  created () {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.span1 {
  margin: 0 40px;
}
.l1 {
  margin: 0 40px;
  border-bottom: 1px dotted #ccc;
  margin-bottom: 5px;
}
.l2 {
  margin-bottom: 8px;
}
.l3 {
  margin-left: 5px;
  margin-bottom: 5px;
}
</style>
