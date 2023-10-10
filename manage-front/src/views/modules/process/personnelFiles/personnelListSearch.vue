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
          <el-form-item label="学历" prop="highestEducation">
            <el-select
              v-model="queryParams.highestEducation"
              placeholder="请选择学历"
              :clearable="true"
              :filterable="true"
            >
              <el-option
                v-for="item in highestEducationList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="queryParams.state" placeholder="请选择状态">
              <el-option
                v-for="item in whetherJob"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
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
          <span class="title">部门人员查询</span>
          <div>
            <el-button
              type="success"
              icon="el-icon-s-finance"
              size="small"
              @click="handleExport()"
              >批量导出</el-button
            >
          </div>
        </div>
      </el-col>

      <el-col :span="24" :xs="24">
        <el-table
          :data="tableData"
          style="width: 100%"
          :max-height="tableHeight"
        >
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
          ></el-table-column>
          <el-table-column
            prop="idNo"
            label="身份证"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column label="性别" header-align="center" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.personSex == 1">男</span>
              <span v-else>女</span>
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
            width="200"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-refresh"
                @click="openTransferDetail(scope.row, (islock = true))"
                >转岗</el-button
              >
              <el-button
                type="text"
                icon="el-icon-reading"
                @click="openTrainingDetail(scope.row, (islock = true))"
                >培训</el-button
              >
              <el-button
                type="text"
                icon="el-icon-view"
                @click="handleEdit(scope.row, (islock = true))"
                >查看</el-button
              >
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
      :islock="islock"
      v-model="transferVisible"
      @closeView="getList()"
    ></Transfer>

    <!--培训-->
    <Training
      ref="Training"
      :islock="islock"
      v-model="trainingVisible"
      @closeView="getList()"
    ></Training>
  </div>
</template>

<script>
import { deptTree } from "@/api/modules";
import { listTeam } from "@/api/modules/sys/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { mapGetters } from "vuex";

import PersonnelListDetail from "./components/personnelListDetail";
//转岗
import Transfer from "./components/transfer";
//培训
import Training from "./components/training";

import {
  list_API,
  export_API,
} from "@/api/modules/process/webdepartperson";

export default {
  name:"personnelListSearch",
  computed: {
    ...mapGetters(["positionName", "highestEducationList", "whetherJob"]),
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  components: {
    PersonnelListDetail,
    Transfer,
    Training,
    Treeselect,
  },
  data() {
    return {
      dialogVisible: false,
      transferVisible: false,
      trainingVisible: false,
      islock: false,
      queryParams: {
        page: 1,
        limit: 10,
        personName:undefined,
        departId:undefined,
        stationId:undefined,
        highestEducation:undefined,
        state:undefined
      },
      tableData: [],
      total: 0,
      dialogTitle: "",
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
    //查看弹窗
    handleEdit(row, islock = false) {
      this.islock = islock;
      this.dialogTitle = "编辑";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["PersonnelListDetail"].editTemp(row);
      });
    },
    //弹出转岗
    openTransferDetail(row, islock = false) {
      this.islock = islock;
      this.transferVisible = true;
      this.$nextTick(() => {
        this.$refs["Transfer"].init({ personId: row.id });
      });
    },
    //弹出培训
    openTrainingDetail(row, islock = false) {
      this.islock = islock;
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
</style>