<template>
  <div class="goods">
    <el-button type="success" plain @click="addGoods">添加商品</el-button>
    <el-table :data="goodList">
      <el-table-column
        type="index"
        :index="indexMethod"
        label="#"
      ></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"> </el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间" prop="add_time">
        <template slot-scope="{ row }">
          {{ row.add_time | dataFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button
          type="primary"
          icon="el-icon-edit"
          plain
          size="mini"
        ></el-button>
        <el-button
          type="danger"
          icon="el-icon-delete"
          plain
          size="mini"
        ></el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodList: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      query: ''
    }
  },
  methods: {
    async getGoodList () {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // console.log(res)
      let {
        meta: { status },
        data: { total, goods }
      } = res
      if (status === 200) {
        this.goodList = goods
        this.total = total
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getGoodList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getGoodList()
    },
    indexMethod (index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize
    },
    addGoods () {
      this.$router.push('/goods-add')
    }
  },
  created () {
    this.getGoodList()
  }
}
</script>

<style scoped></style>
