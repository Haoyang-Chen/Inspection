<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="作业票种类" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择作业票种类"
              clearable
              size="small"
              style="width: 165px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="24" class="mb8">
          <el-col>
            <span class="table-title">进行中作业票列表</span>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="workList"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="作业票编号"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.id !== scope.row.parentId" class="work-sub">
                从票
              </span>
              <span>{{ scope.row.number }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="作业票种类"
            align="center"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ typeName(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column
            label="作业级别"
            align="center"
            prop="levelName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="作业区域"
            align="center"
            prop="workArea"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="作业内容"
            align="center"
            prop="workContent"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="申请作业开始时间"
            align="center"
            prop="startTime"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.startTime, "{y}-{m}-{d} {h}:{i}") }}
            </template>
          </el-table-column>
          <el-table-column
            label="申请人"
            align="center"
            prop="createUserName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            align="center"
            width="100"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-timer"
                @click="handleDelay(scope.row)"
                >延期</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <delay-dialog
      ref="delayDialog"
      v-model="open"
      :type="2"
      @submitSuccess="getList"
    ></delay-dialog>
  </div>
</template>

<script>
import { listWork } from "@/api/modules/ptw/work";
import DelayDialog from "@/views/components/ptw/work/delay-dialog";

export default {
  name: "WorkDelaySign",
  components: { DelayDialog },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 作业票表格数据
      workList: null,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        delaySign: 1,
        type: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 作业票种类 */
    typeOptions() {
      return this.$store.state.common.workTypes;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listWork(this.queryParams).then(response => {
        const result = response.result;
        this.workList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据作业票种类value获取label
    typeName(val) {
      return this.typeOptions.find(item => item.value === val).label;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 延期按钮操作 */
    handleDelay(row) {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.delayDialog.setup(row.id);
      });
    }
  }
};
</script>

<style lang="scss">
.work-sub {
  color: #ff5918;
}
</style>
