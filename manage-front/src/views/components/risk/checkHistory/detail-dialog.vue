<template>
  <el-dialog
    title="查看详情"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="700px"
    >
    <div class="checkInfo">
      <span>检查人：{{ rowData.checkUser || '' }}</span>
      <span>检查时间：{{ rowData.checkDate || ''}}</span>
      <span>检查结果：{{ rowData.result === 1 ? '正常' : '异常' }}</span>
    </div>
    <el-row :gutter="24" class="mb8">
      <el-col>
        <span class="table-title">危险因素列表</span>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="rowData.checkModelList"
      :max-height="tableHeight"
    >
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column
        label="名称"
        align="center"
        prop="title"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="检查结果" align="center" prop="result" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.result === 1 ? '正常' : '异常' }}
        </template>
      </el-table-column>
      <el-table-column label="隐患描述" align="center" prop="reason" :show-overflow-tooltip="true" />
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      // 是否显示弹出层
      visible: false,
      loading: false,
      tableData: [],
      tableHeight: 300,
      rowData: {}
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  methods: {
    setup(params) {
      console.log('rowData', params)
      this.rowData = params;
    },
    // 取消按钮
    cancel() {
      this.visible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.checkInfo {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
</style>
