<template>
  <div class>
    <el-row :gutter="20" style="padding: 5px">
      <el-col :span="11">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item prop="deviceName">
            <el-input
              v-model="queryParams.deviceName"
              placeholder="请输入检点名称"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table
          v-loading="loadingSource"
          :data="sourceList"
          @selection-change="handleSourceSelectionChange"
          height="450"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="检点类型" align="center">
            <template slot-scope="scope">{{ pointTypeName(scope.row.pointType) }}</template>
          </el-table-column>
          <el-table-column
            label="绑定标签"
            align="center"
            prop="labelName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检点名称"
            align="center"
            prop="deviceName"
            :show-overflow-tooltip="true"
          />
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.limit"
          layout="total, pager"
          @pagination="getSource"
        />
      </el-col>

      <el-col :span="2">
        <div class="container">
          <el-button :disabled="sourceSelections.length<=0" type="primary" @click="shuttleRight">
            <svg-icon icon-class="right"></svg-icon>
          </el-button>
          <el-button
            :disabled="targetSelections.length<=0"
            type="primary"
            style="margin-top:15px;margin-left:0;"
            @click="shuttleLeft"
          >
            <svg-icon icon-class="left"></svg-icon>
          </el-button>
        </div>
      </el-col>

      <el-col :span="11">
        <div class="select">已选择检点列表(共{{targetList.length}}条)</div>

        <el-table
          v-loading="loadingTarget"
          :data="targetList"
          @selection-change="handleTargetSelectionChange"
          height="450"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="检点类型" align="center">
            <template slot-scope="scope">{{ pointTypeName(scope.row.pointType) }}</template>
          </el-table-column>
          <el-table-column
            label="绑定标签"
            align="center"
            prop="labelName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检点名称"
            align="center"
            prop="deviceName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            v-if="lineType===1"
            label="排序"
            align="center"
            width="110"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-sort-up"
                @click="handleUpward(scope.$index)"
              >上移</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-sort-down"
                @click="handleDown(scope.$index)"
              >下移</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listPoint } from "@/api/modules/inspect/point";
import { getLine } from "@/api/modules/inspect/line";

export default {
  name: "TableTransfer",
  props: {
    // 加入线路的检点表格数据
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    // 线路类型
    lineType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 遮罩层
      loadingSource: true,
      loadingTarget: false,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        deviceName: undefined,
        hidePointIds: undefined
      },
      // 检点表格数据
      sourceList: [],
      // 检点表格选中数据
      sourceSelections: [],
      // 加入线路的检点表格数据-内部
      targetList: this.value || [],
      // 加入线路的检点表格选中数据
      targetSelections: []
    };
  },
  computed: {
    /** 检点类型 */
    pointTypeOptions() {
      return this.$store.state.common.pointTypes;
    }
  },
  watch: {
    value(val) {
      this.targetList = val || [];
    },
    targetList(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    /** 重置相关值 */
    setup(lindeId) {
      this.queryParams = {
        page: 1,
        limit: 10,
        deviceName: undefined,
        hidePointIds: undefined
      };
      this.sourceSelections = [];
      this.targetList = [];
      this.targetSelections = [];
      if (lindeId == undefined) {
        this.getSource();
      } else {
        this.getTarget(lindeId);
      }
    },
    /** 查询左侧列表 */
    getSource() {
      this.loadingSource = true;
      if (this.targetList.length > 0) {
        this.queryParams.hidePointIds = this.targetList
          .map(item => {
            return item.id;
          })
          .join(",");
      } else {
        this.queryParams.hidePointIds = undefined;
      }
      listPoint(this.queryParams).then(response => {
        const result = response.result;
        this.sourceList = result.list;
        this.total = result.totalCount;
        this.loadingSource = false;
      });
    },
    /** 查询右侧列表 */
    getTarget(lineId) {
      this.loadingTarget = true;
      getLine(lineId).then(response => {
        const result = response.result;
        this.targetList = result.insPointList;
        this.loadingTarget = false;
        this.getSource();
      });
    },
    // 根据版本value获取检点类型label
    pointTypeName(val) {
      return this.pointTypeOptions.find(item => item.value === val).label;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getSource();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSourceSelectionChange(selection) {
      this.sourceSelections = selection;
    },
    handleTargetSelectionChange(selection) {
      this.targetSelections = selection;
    },
    // 向右穿梭
    shuttleRight() {
      this.sourceSelections.forEach(item => {
        this.targetList.push(item);
      });
      this.getSource();
    },
    // 向左穿梭
    shuttleLeft() {
      this.targetList = this.targetList.filter(item => {
        return !this.targetSelections.includes(item);
      });
      this.getSource();
    },
    // 排序
    handleUpward($index) {
      if ($index === 0) {
        return;
      }
      this.swap(this.targetList, $index, $index - 1);
    },
    handleDown($index) {
      if ($index === this.targetList.length - 1) {
        return;
      }
      this.swap(this.targetList, $index, $index + 1);
    },
    swap(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.select {
  font-size: 16px;
  height: 60px;
  line-height: 60px;
}
</style>
