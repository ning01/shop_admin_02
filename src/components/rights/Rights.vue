<template>
  <div class="right">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格组件显示权限数据 -->
    <el-table :data="rightList" style="width:100%">
      <!-- 每一列 -->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级" prop="level">
        <template slot-scope="scope">
          <span v-if="+scope.row.level">一级</span>
          <span v-else-if="+scope.row.level === 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    // 获取权限列表数据
    async getRightList () {
      let res = await this.axios.get('rights/list')
      // console.log(res)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.rightList = data
      }
    }
  },
  created () {
    this.getRightList()
  }
}
</script>

<style scoped></style>
