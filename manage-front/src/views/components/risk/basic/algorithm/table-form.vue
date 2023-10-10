<template>
  <div>
    <el-table :data="dataList" ref="singleTable" highlight-current-row border>
      <el-table-column label="" width="40" v-if="!editable">
        <template slot-scope="scope">
          <el-radio :label="scope.$index" v-model="radio" @change.native="getCurrentRow(scope.row)" style="color: #fff;padding-left: 5px; margin-right: -20px;"></el-radio>
        </template>
			</el-table-column>
      <el-table-column :label="columnName" prop="first" align="center">
        <template slot-scope="scope">
          <el-input v-if="editable" size="mini" v-model="scope.row.first" :editable="!editable"></el-input>
          <span v-else>{{ scope.row.first }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分值" prop="second" width="200px" align="center">
        <template slot-scope="scope">
          <el-input v-if="editable" size="mini" v-model="scope.row.second" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" ></el-input>
          <span v-else>{{ scope.row.second }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="editable" width="50px" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="handleDel(scope.$index)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <template v-if="editable">
      <div class="btn" @click="handleAdd"><el-button type="text" icon="el-icon-circle-plus-outline">新增</el-button></div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array
    },
    // 列名
    columnName: {
      type: String,
      default: '事故发生的可能性（L）'
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    // 1- 事故发生的可能性（L）
    // 2- 事件后果严重性（S）
    tableType: {
      type: Number,
      default: 1
    },
    // 选择的算法
    selectedAlgorithmModel: {
      type: Object
    }
  },
  watch: {
    value(val) {
      this.dataList = val ? val : [];
      if (this.selectedAlgorithmModel && this.selectedAlgorithmModel.first) {
        this.setCurrent();
      }
    },
    dataList(val) {
      this.$emit("input", val);
    }
  },
  data() {
    return {
      // 数据列表
      dataList: [],
      radio: undefined
    }
  },
  methods: {
    /** 新增操作 */
    handleAdd() {
      let base = { first: null, second: null };
      this.dataList.push(base);
    },
    /** 删除操作 */
    handleDel(index) {
      this.dataList.splice(index, 1);
    },
    /** 单选操作 */
    getCurrentRow(row) {
      this.$emit("singleChang", this.tableType, row);
    },
    /** 单选反选操作 */
    setCurrent() {
      var index = this.dataList.findIndex((value)=>value.first === this.selectedAlgorithmModel.first  && value.second === this.selectedAlgorithmModel.second);
      this.radio = index;
      this.$refs.singleTable.setCurrentRow(this.dataList[index]);
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-input__inner {
  text-align: center;
  height: 32px;
  line-height: 32px;
}
.btn {
  text-align: center;
  margin-bottom: 20px;
  background: #f8f8f9;
}
</style>
