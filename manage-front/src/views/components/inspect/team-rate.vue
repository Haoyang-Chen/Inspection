<template>
  <el-table :data="rateList">
    <el-table-column label="序号" align="center" type="index" />
    <el-table-column label="班次名称" align="center" width="200">
      <template slot-scope="scope">
        <el-input
          v-model="scope.row.className"
          :disabled="disabled"
          placeholder="请输入班次名称"
          style="width:170px"
        />
      </template>
    </el-table-column>
    <el-table-column label="时间段" align="center" width="280">
      <template slot-scope="scope">
        <el-time-picker
          v-model="scope.row.startTime"
          :disabled="disabled"
          format="HH:mm"
          value-format="HH:mm:ss"
          placeholder="开始时间"
          style="width:120px"
        ></el-time-picker>
        <span> - </span>
        <el-time-picker
          v-model="scope.row.endTime"
          :disabled="disabled"
          format="HH:mm"
          value-format="HH:mm:ss"
          placeholder="结束时间"
          style="width:120px"
        ></el-time-picker>
      </template>
    </el-table-column>
    <el-table-column v-if="!disabled" align="center">
      <template slot-scope="scope">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          circle
          @click="addRate(scope.$index)"
        ></el-button>
        <el-button
          v-if="rateList.length > 1"
          type="danger"
          icon="el-icon-minus"
          size="mini"
          circle
          @click="delRate(scope.$index)"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { baseRateLine } from "@/api/modules/inspect/task";

export default {
  name: "TeamRate",
  props: {
    // 巡检班次表格数据
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    // 状态 1-可编辑
    status: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 巡检班次表格数据-内部
      rateList: this.value || []
    };
  },
  computed: {
    /** 是否可编辑 */
    disabled() {
      // return this.status !== 1;
      return false;
    }
  },
  watch: {
    value(val) {
      this.rateList = val || [];
    },
    rateList(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    // 新增巡检班次
    addRate(index) {
      this.rateList.splice(index + 1, 0, { ...baseRateLine });
    },
    // 删除巡检班次
    delRate(index) {
      this.$confirm("是否确认删除所选巡检班次？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.rateList.splice(index, 1);
      });
    }
  }
};
</script>
