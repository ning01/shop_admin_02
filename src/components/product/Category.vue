<template>
  <div class="categories">
    <el-button type="success" plain size="small" @click="showAddDialog"
      >添加分类</el-button
    >
    <el-table
      :data="categoryList"
      style="width:100%"
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indent-size="30"
      >
      </el-table-tree-column>
      <el-table-column label="是否删除" prop="cat_deleted">
        <template slot-scope="{ row }">
          {{ row.cat_deleted ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            size="mini"
          ></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20, 25]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
    </el-pagination>
    <!-- 添加分类模态框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input
            v-model="addForm.cat_name"
            placeholder="请输入分类名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            v-model="addForm.cat_pid"
            :options="options"
            :props="props"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoryList: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      addDialogVisible: false,
      addForm: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', tirgge: 'brul' }
        ]
      },
      loading: false
    }
  },
  methods: {
    async getCategoryList () {
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // console.log(res)
      let {
        meta: { status },
        data: { result, total }
      } = res
      if (status === 200) {
        setTimeout(() => {
          this.categoryList = result
          this.total = total
          this.loading = false
          // console.log(this.categoryList)
        }, 500)
      }
    },
    async showAddDialog () {
      this.addDialogVisible = true
      let res = await this.axios.get('categories?type=2')
      // console.log(res)
      if (res.meta.status === 200) {
        this.options = res.data
      }
    },
    addCategory () {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        let { cat_name: catName, cat_pid: catPid } = this.addForm
        let res = await this.axios.post('categories', {
          cat_name: catName,
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_level: catPid.length
        })
        // console.log(res)
        if (res.meta.status === 201) {
          this.$refs.addForm.resetFields()
          this.getCategoryList()
          this.$message.success('添加成功')
          this.addDialogVisible = false
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getCategoryList()
    }
  },
  created () {
    this.getCategoryList()
  }
}
</script>

<style scoped></style>
