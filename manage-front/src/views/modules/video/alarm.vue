<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="采集时间" prop="alarmTime">
            <el-date-picker
              v-model="queryParams.alarmTime"
              type="date"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              placeholder="请选择检查日期"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="报警类型" prop="alarmType">
            <el-select
              v-model="queryParams.alarmType"
              placeholder="请选择变更类型"
              clearable
              style="width: 100%"
              @keyup.enter.native="handleQuery"
            >
              <el-option
                v-for="dict in alarmTypeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="operStatus">
            <el-select
              v-model="queryParams.operStatus"
              placeholder="请选择状态"
              clearable
              size="small"
              style="width: 115px"
              @keyup.enter.native="handleQuery"
            >
              <el-option label="已销警" :value="1" />
              <el-option label="未销警" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="24" class="mb8">
          <el-col>
            <span class="table-title">监测报警管理</span>
            <div style="float:right;"></div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="tableData"
          :max-height="tableHeight"
        >
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="摄像头编号" align="center" prop="ipcSerialNum" :show-overflow-tooltip="true" />
          <el-table-column label="报警类型" align="center" prop="alarmType" :show-overflow-tooltip="true" />
          <el-table-column label="采集时间" align="center" prop="alarmTime" :show-overflow-tooltip="true" />
          <el-table-column label="设备IP" align="center" prop="ipcAddr" :show-overflow-tooltip="true" />
          <el-table-column label="报警图片" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
                <div v-if="scope.row.image" style="display: flex;align-items: center;">
                  <el-image 
                    fit="contain"
                    :src="'data:image/' + scope.row.imageType + ';base64,' + scope.row.image" 
                    @click="onpreview(scope.row)">
                  </el-image>
                </div>
              </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="operStatus" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.operStatus === 0 ? '未销警' : '已销警' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.operStatus === 0"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row, true)"
              >销警处理</el-button>
              <el-button
                v-else
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleEdit(scope.row, false)"
              >查看记录</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <alarm-form ref="alarmForm" v-model="open" :editable="editable" @submitSuccess="getList"></alarm-form>
    <!-- 图片预览 -->
    <el-image-viewer
      v-if="showviewer"
      :on-close="closeviewer"
      :url-list="urlList"
    />
  </div>
</template>

<script>
import AlarmForm from "@/views/components/video/alarm-form";
import { alarmList } from "@/api/modules/video/alarm";
import elImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  components: {
    AlarmForm,
    elImageViewer
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单是否可编辑
      editable: true,
      showviewer: false,
      urlList: [],
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        alarmTime: undefined,
        alarmType: undefined,
        operStatus: undefined
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 报警类型数据字典 */
    alarmTypeOptions() {
      return this.$store.state.common.alarmTypes;
    }
  },
  filters: {},
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      alarmList(this.queryParams).then(response => {
        const result = response.result;
        this.tableData = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
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
    /** 编辑按钮操作 */
    handleEdit(row, editable) {
      this.open = true;
      this.editable = editable;
      this.$nextTick(() => {
        this.$refs.alarmForm.setup({ ...row });
      })
    },
     // 关闭查看器
    closeviewer() {
      this.showviewer = false;
      this.urlList = [];
    },
    onpreview(row) {
      var src = 'data:image/' + row.imageType + ';base64,' + row.image;
      this.urlList = [src];
      this.showviewer = true;
    }
  }
};
</script>
