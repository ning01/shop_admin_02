<template>
  <div class="goods-add">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step :title="title1" description="基本信息"> </el-step>
      <el-step :title="title2" description="商品图片"></el-step>
      <el-step :title="title3" description="商品内容"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs @tab-click="change" v-model="activeName" tab-position="left">
      <el-tab-pane name="basic" label="基本信息">
        <el-form :model="addForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="options"
              :props="props"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next(2)">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="pic" label="商品图片">
        <el-upload
          class="upload-demo"
          action="http://127.0.0.1:8888/api/private/v1/upload"
          list-type="picture"
          :headers="headers"
          :on-success="headerSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>

        <el-button type="primary" @click="next(3)">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="content" label="商品内容">
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button type="primary">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      activeName: 'basic',
      title1: '进行中',
      title2: '步骤2',
      title3: '步骤3',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: true,
        pics: [],
        goods_introduce: ''
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      },
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    change (tab) {
      console.log(tab)
      this.active = +tab.index
      if (this.active === 0) {
        this.title1 = '进行中'
        this.title2 = '步骤2'
        this.title3 = '步骤3'
      } else if (this.active === 1) {
        this.title1 = '已完成'
        this.title2 = '进行中'
        this.title3 = '步骤3'
      } else if (this.active === 2) {
        this.title1 = '已完成'
        this.title2 = '已完成'
        this.title3 = '进行中'
      }
    },
    next (step) {
      if (step === 2) {
        this.active = 1
        this.title1 = '已完成'
        this.title2 = '进行中'
        this.title3 = '步骤3'
        this.activeName = 'pic'
      } else if (step === 3) {
        this.active = 2
        this.title1 = '已完成'
        this.title2 = '已完成'
        this.title3 = '进行中'
        this.activeName = 'content'
      }
    },
    headerSuccess (res) {
      // console.log(res)
      if (res.meta.status === 200) {
        this.addForm.pics.push({
          pic: res.data.tmp_path
        })
      }
    }
  },
  async created () {
    let res = await this.axios.get('categories?type=3')
    console.log(res)
    if (res.meta.status === 200) {
      this.options = res.data
    }

    // console.log(this.options)
  }
}
</script>

<style lang="less" scoped>
.quill-editor {
  background-color: #fff;
  margin-bottom: 20px;
  /deep/ .ql-editor {
    height: 300px;
  }
}
</style>
