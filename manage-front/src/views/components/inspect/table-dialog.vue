<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
    @closed="handleClosed"
  >
    <el-row :gutter="24" class="mb8">
      <el-col>
        <div style="float:right;">
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            :disabled="total <= 0"
            @click="handleExport"
            >导出到Excel</el-button
          >
        </div>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="detailList" height="400">
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="检点类型" align="center">
        <template slot-scope="scope">{{
          typeName(scope.row.pointType)
        }}</template>
      </el-table-column>
      <el-table-column
        label="检点名称"
        align="center"
        prop="deviceName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="巡检内容"
        align="center"
        prop="patrolContent"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="标准值" align="center">
        <template slot-scope="scope">{{
          valueName(scope.row, false)
        }}</template>
      </el-table-column>
      <el-table-column label="实际值" align="center">
        <template slot-scope="scope">{{ valueName(scope.row, true) }}</template>
      </el-table-column>
      <el-table-column
        label="状态描述"
        align="center"
        prop="statusDescription"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="现场照片" align="center">
        <template slot-scope="scope">
          <viewer
            v-if="scope.row.fileList"
            :ref="'imageViewer' + scope.$index"
            :options="{ zIndex: 9999 }"
            :images="scope.row.sceneImages"
          >
            <img
              v-for="src in scope.row.sceneImages"
              :src="src"
              :key="src"
              style="display:none"
            />
          </viewer>
          <el-button
            v-if="scope.row.fileList"
            class="number"
            size="mini"
            type="text"
            @click="showImages(scope.$index)"
            >{{ scope.row.fileList.length }}</el-button
          >
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检时间" align="center">
        <template slot-scope="scope">
          <span v-bind:class="{ active: !scope.row.signTime }">{{
            scope.row.signTime ? scope.row.signTime : "未签到"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="memo"
        :show-overflow-tooltip="true"
      />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />
  </el-dialog>
</template>

<script>
import { listQueryDetail, exportQueryDetail } from "@/api/modules/inspect/task";
import Viewer from "v-viewer/src/component.vue";
import "viewerjs/dist/viewer.css";

export default {
  name: "TableDialog",
  components: { Viewer },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    // 弹出层标题
    title: {
      type: String,
      default: "查看记录"
    },
    width: {
      type: String,
      default: "1080px"
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 是否显示弹出层-内部
      visible: this.value,
      // 总条数
      total: 0,
      // 问题表格数据
      detailList: null,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        stepId: undefined,
        pointId: undefined
      }
    };
  },
  computed: {
    /** 检点类型 */
    typeOptions() {
      return this.$store.state.common.pointTypes;
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
  methods: {
    /** 重置相关值 */
    setup(stepId, pointId) {
      this.queryParams = { ...this.queryParams, stepId, pointId };
      this.getList();
    },
    /** 根据id查询详情列表 */
    getList() {
      this.loading = true;
      listQueryDetail(this.queryParams).then(response => {
        const result = response.result;
        const details = [];
        result.list.forEach(item => {
          let sceneImages = [];
          if (item.fileList) {
            sceneImages = item.fileList.map(item => {
              return process.env.VUE_APP_BASE_API + "/file/show/" + item.name;
            });
          }
          details.push({ ...item, sceneImages });
        });
        this.detailList = details;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据版本value获取检点类型label
    typeName(val) {
      return this.typeOptions.find(item => item.value === val).label;
    },
    // 根据行数据获取标准值/实时值
    valueName(row, isReal) {
      if (isReal) {
        return row.value ? row.value + (row.unit || "") : "";
      } else {
        return row.stdValue ? row.stdValue + (row.unit || "") : "";
      }
    },
    /** 显示现场照片 */
    showImages(index) {
      this.$refs["imageViewer" + index].$viewer.show();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        exportQueryDetail,
        this.queryParams,
        "任务查询详情记录",
        "任务查询详情"
      );
    },
    /** Dialog关闭动画结束时的回调 */
    handleClosed() {
      this.loading = true;
      this.total = 0;
      this.detailList = null;
      this.queryParams = {
        page: 1,
        limit: 10,
        stepId: undefined
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.number {
  color: #1890ff;
}
.active {
  color: red;
}
</style>
