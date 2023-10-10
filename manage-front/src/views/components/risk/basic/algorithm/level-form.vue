<template>
  <div>
    <el-table border :data="dataList" :cell-style="cellStyle">
      <el-table-column label="风险值" prop="second" align="center">
        <template slot-scope="scope" >
          <el-row v-if="scope.row.first === 4">
            <el-col :span="4" :offset="10">&ge;</el-col>
            <el-col :span="10">
              <el-input size="mini" v-model="scope.row.second" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" ></el-input>
            </el-col>
          </el-row>
          <el-row v-else-if="scope.row.first === 3">
            <el-col :span="10"><el-input size="mini" v-model="scope.row.second" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" ></el-input></el-col>
            <el-col :span="4">&le;</el-col>
            <el-col :span="10"><el-input size="mini" v-model="scope.row.third" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" ></el-input></el-col>
          </el-row>
          <el-row v-else-if="scope.row.first === 2">
            <el-col :span="10"><el-input size="mini" v-model="scope.row.second" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"></el-input></el-col>
            <el-col :span="4">&le;</el-col>
            <el-col :span="10"><el-input size="mini" v-model="scope.row.third" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" ></el-input></el-col>
          </el-row>
          <el-row v-else>
            <el-col :span="4" :offset="10">&le;</el-col>
            <el-col :span="10"><el-input size="mini" v-model="scope.row.third" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" ></el-input></el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="对应本标准中安全风险评估分级" prop="second" width="220px" align="center" style="background:#da0000">
        <template slot-scope="scope">
          <div>{{ levelName(scope.row.first) }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { levelName } from "@/views/components/risk/utils";
export default {
  props: {
    value: {
      type: Array
    }
  },
  data() {
    return {
      // 数据列表
      dataList: [],
      levelName
    }
  },
  watch: {
    value: {
      handler(val) {
        this.dataList = val;
      },
      immediate: true
    },
    dataList(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    /** 设置指定行、列、具体单元格颜色 */
    cellStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 1) { //指定坐标rowIndex ：行，columnIndex ：列
        var bgcolor = row.first === 1 ? '#409EFF' : row.first === 2 ? 'yellow' : row.first === 3 ? 'orange' : 'red';
        return 'background:' + bgcolor
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>