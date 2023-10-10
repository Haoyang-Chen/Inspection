<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          size="small"
        >
          <el-form-item label="姓名" prop="personName">
            <el-input v-model="queryParams.personName"></el-input>
          </el-form-item>
          <!-- <el-form-item label="身份证" prop="idNo">
            <el-input v-model="queryParams.idNo"></el-input>
          </el-form-item> -->
          <el-form-item label="部门" prop="departId">
            <Treeselect
              style="width: 200px"
              v-model="queryParams.departId"
              :options="deptOptions"
              :normalizer="deptNormalizer"
              :show-count="true"
              :disable-branch-nodes="false"
              :clearable="false"
              :searchable="true"
              noResultsText="未找到结果..."
              placeholder="请选择部门"
              clearAllText="清除"
              @change="deptSelect"
            ></Treeselect>
          </el-form-item>
          <el-form-item label="岗位" prop="stationId">
            <el-select
              v-model="queryParams.stationId"
              placeholder="请选择"
              :clearable="true"
              :filterable="true"
            >
              <el-option
                v-for="item in positionName"
                :key="item.id"
                :label="item.stationName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="电话" prop="phoneNumber">
            <el-input v-model="queryParams.phoneNumber"></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleQuery()"
              >搜索</el-button
            >
            <el-button
              type="primary"
              plain
              icon="el-icon-refresh"
              @click="resetQuery()"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" :xs="24">
        <div class="header-button flex justify-between items-center">
          <span class="title">部门人员列表</span>
          <div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="add((islock = false))"
              >新增</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-upload2"
              size="small"
              @click="handleImport()"
              >批量导入</el-button
            >
            <el-button
              type="success"
              icon="el-icon-s-finance"
              size="small"
              @click="handleExport()"
              >批量导出</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              :disabled="multiple"
              @click="batchDelete()"
              >删除</el-button
            >
          </div>
        </div>
      </el-col>

      <el-col :span="24" :xs="24">
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :max-height="tableHeight"
        >
          <el-table-column
            type="selection"
            width="44"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            header-align="center"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="personName"
            label="姓名"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="idNo"
            label="身份证"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="personSex"
            label="性别"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.personSex | personSexFilter }}
            </template>
          </el-table-column>
          <el-table-column
            prop="personDepart"
            label="部门"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="personStation"
            label="岗位"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="phoneNumber"
            label="电话"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="320"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.row, (islock = false))"
                type="text"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-popconfirm
                title="这条信息确定删除吗？"
                @onConfirm="handleDelete(scope.$index, scope.row, tableData)"
              >
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  slot="reference"
                  class="button-delete"
                  >删除</el-button
                >
              </el-popconfirm>
              <el-button
                type="text"
                icon="el-icon-refresh"
                @click="openTransferDetail(scope.row)"
                >转岗</el-button
              >
              <el-button
                type="text"
                icon="el-icon-reading"
                @click="openTrainingDetail(scope.row)"
                >培训</el-button
              >
              <!-- <el-button
                type="text"
                icon="el-icon-view"
                @click="handleEdit(scope.row, (islock = true))"
                >查看</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <PersonnelListDetail
      :dialogTitle="dialogTitle"
      :islock="islock"
      v-model="dialogVisible"
      @closeView="getList()"
      ref="PersonnelListDetail"
    ></PersonnelListDetail>

    <!--转岗-->
    <Transfer
      ref="Transfer"
      v-model="transferVisible"
      @closeView="getList()"
    ></Transfer>

    <!--培训-->
    <Training
      ref="Training"
      v-model="trainingVisible"
      @closeView="getList()"
    ></Training>
    <UploadDialog
      v-model="uploading"
      actionUri="/webdepartperson/import"
      :templateFunc="templateFunc"
      @uploadCompletion="handleUploadCompletion"
    ></UploadDialog>
  </div>
</template>


<script>
import { deptTree } from "@/api/modules";
import { listTeam } from "@/api/modules/sys/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { mapGetters } from "vuex";

import {
  list_API,
  delete_API,
  export_API,
  template_API,
} from "@/api/modules/process/webdepartperson";

import PersonnelListDetail from "./components/personnelListDetail";
//转岗
import Transfer from "./components/transfer";
//培训
import Training from "./components/training";
import UploadDialog from "@/components/UploadDialog";
export default {
  name:"personnelList",
  computed: {
    ...mapGetters(["positionName"]),
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  components: {
    PersonnelListDetail,
    Transfer,
    Training,
    UploadDialog,
    Treeselect,
  },
  filters:{
    personSexFilter(val) {
      if (val == 0) {
        return "女";
      } else if (val == 1) {
        return "男";
      } else {
        return "未知";
      }
    },
  },
  data() {
    return {
      // 是否显示上传弹出层
      uploading: false,
      dialogVisible: false,
      transferVisible: false,
      trainingVisible: false,
      islock: true,
      multiple: true,
      queryParams: {
        page: 1,
        limit: 10,
        personName:undefined,
        departId:undefined,
        stationId:undefined
      },
      ids: [],
      tableData: [],
      total: 0,
      dialogTitle: undefined,
      // 下载模板请求
      templateFunc: () => {
        this.templateRequest(template_API, "部门人员导入模板");
      },
      // 部门数据字典
      deptOptions: [],
      // 自定义部门树节点key
      deptNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children,
        };
      },
    };
  },
  created() {
    this.getList();
    this.getDeptTree();
  },
  methods: {
    /** 查询当前用户部门树 */
    getDeptTree() {
      deptTree().then((response) => {
        this.deptOptions = this.formatTree(response.result);
      });
    },
    /** 查询班组列表 */
    getTeamList(deptId, isDeptChange = false) {
      if (deptId != undefined) {
        listTeam(deptId).then((response) => {
          const result = response.result.map((item) => {
            return { teamId: item.deptId, name: item.name };
          });
          this.teamOptions = result;
          if (isDeptChange) {
            this.form.teamId = undefined;
          }
        });
      } else {
        this.teamOptions = [];
      }
    },
    /** 部门选择 */
    deptSelect(node, instanceId) {
      if (this.form.deptId !== node.deptId) {
        this.form.deptId = node.deptId;
        this.getTeamList(node.deptId, true);
      }
    },
    /** 导入按钮操作 */
    handleImport() {
      this.uploading = true;
    },
    // 文件上传完成处理
    handleUploadCompletion(response) {
      this.getList();
    },
    //导出
    handleExport() {
      this.exportRequest(
        export_API,
        this.queryParams,
        "部门人员列表",
        "部门人员列表"
      );
    },
    //查询
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    //重置搜索
    resetQuery() {
      this.queryParams.deptId = undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //获取数据
    getList() {
      list_API(this.queryParams).then((res) => {
        this.tableData = res.result.list;
        this.total = res.result.totalCount;
      });
    },
    //单个删除
    handleDelete(index, row, rows) {
      this.ids = [row.id];
      delete_API(this.ids).then((res) => {
        this.$message({
          message: "删除成功！",
          type: "success",
        });
        rows.splice(index, 1);
      });
    },
    //批量删除-删除
    batchDelete() {
      delete_API(this.ids).then((res) => {
        this.$message({
          message: "批量删除成功！",
          type: "success",
        });
        this.handleQuery();
      });
    },
    //新增弹窗
    add(islock) {
      this.islock = islock;
      this.dialogTitle = "新增";
      this.dialogVisible = true;
    },
    //修改弹窗
    handleEdit(row, islock) {
      this.islock = islock;
      this.islock == true
        ? (this.dialogTitle = "查看")
        : (this.dialogTitle = "编辑");
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["PersonnelListDetail"].editTemp(row);
      });
    },
    //删除按钮处理
    handleSelectionChange(val) {
      this.ids = val.map((item) => item.id);
      this.multiple = !val.length;
    },
    //弹出转岗
    openTransferDetail(row) {
      this.transferVisible = true;
      this.$nextTick(() => {
        this.$refs["Transfer"].init({ personId: row.id, departId: row.departId, stationId: row.stationId });
      });
    },
    //弹出培训
    openTrainingDetail(row) {
      this.trainingVisible = true;
      this.$nextTick(() => {
        this.$refs["Training"].init({ personId: row.id });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.header-button {
  border-top: 1px solid #dcdfe6;
  padding-top: 18px;
  margin-bottom: 8px;
}
.button-delete {
  margin-left: 10px;
  margin-right: 10px;
}
</style>