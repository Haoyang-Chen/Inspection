<template>
  <el-dialog
    title="转岗"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="1200px"
    :before-close="handleCancel"
  >
    <div class="header-button flex justify-end items-center" v-if="!islock">
      <el-button
        type="primary"
        plain
        size="small"
        @click="addTableData()"
        v-if="isShow"
        >增加</el-button
      >
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      size="small"
      :disabled="islock"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column label="转岗日期" width="240">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.transferDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :editable="false"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="转岗前部门">
        <template slot-scope="scope">
          <Treeselect
            style="z-index:99999"
            v-model="scope.row.departBeforeId"
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
        </template>
      </el-table-column>
      <el-table-column label="转岗前岗位">
        <template slot-scope="scope">
          <el-select v-model="scope.row.stationBeforeId" placeholder="请选择">
            <el-option
              v-for="item in positionName"
              :key="item.id"
              :label="item.stationName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="转岗后部门">
        <template slot-scope="scope">
          <Treeselect
            v-model="scope.row.departAfterId"
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
        </template>
      </el-table-column>
      <el-table-column label="转岗后岗位">
        <template slot-scope="scope">
          <el-select v-model="scope.row.stationAfterId" placeholder="请选择">
            <el-option
              v-for="item in positionName"
              :key="item.id"
              :label="item.stationName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="160"
        label="操作"
        header-align="center"
        align="center"
        v-if="!islock"
      >
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="
              deleteRow(scope.$index, scope.row, tableData)
            "
            type="text"
            icon="el-icon-delete"
          >
            移除
          </el-button>
          <el-button
            @click.native.prevent="submitForm(scope.row)"
            type="text"
            icon="el-icon-plus"
          >
            保存
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deptTree } from "@/api/modules";
import { listTeam } from "@/api/modules/sys/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { mapGetters } from "vuex";
import {
  list_API,
  save_API,
  update_API,
  delete_API,
} from "@/api/modules/process/webdeparttransfer";
export default {
  name:"transfer",
  computed: {
    ...mapGetters(["positionName"]),
  },
  components: { Treeselect },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    islock: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    },
  },
  data() {
    return {
      test: "",
      isShow: true,
      visible: this.value,
      tableData: [],
      personId: undefined, //部门人员ID
      departBeforeId: undefined, // 转岗前部门ID
      stationBeforeId: undefined, // 转岗前岗位ID
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
    init(params) {
      this.personId = params.personId;
      this.departBeforeId = params.departId;
      this.stationBeforeId = params.stationId;
      //获取历史记录
      list_API(params).then((res) => {
        this.tableData = res.result;
      });
    },
    //取消
    handleCancel() {
      this.visible = false;
      this.reset();
    },
    //重置
    reset() {
      this.personId = undefined;
      this.isShow = true;
      this.tableData = [];
    },
    //添加数据
    addTableData() {
      this.isShow = false;
      let arr = {
        transferDate: undefined, //转岗日期
        departBeforeId: this.departBeforeId, //转岗前部门
        stationBeforeId: this.stationBeforeId, //转岗前岗位,
        departAfterId: undefined, //转岗后部门
        stationAfterId: undefined, //转岗后岗位
      };
      this.tableData.push(arr);
    },
    deleteRow(index, row, rows) {
      if (row.id) {
        let ids = [row.id];
        delete_API(ids).then((res) => {
          this.$message({
            message: "删除成功！",
            type: "success",
          });
          rows.splice(index, 1);
        });
      } else {
        this.isShow = true;
        rows.splice(index, 1);
      }
    },
    submitForm(row) {
      let params = {
        personId: this.personId,
        ...row,
      };
      if (row.id) {
        update_API(params).then((res) => {
          this.$message({
            message: "修改成功！",
            type: "success",
          });
          this.saveSuccess();
        });
      } else {
        save_API(params).then((res) => {
          this.$message({
            message: "新增成功！",
            type: "success",
          });
          this.saveSuccess();
        });
      }
    },
    saveSuccess() {
      this.visible = false;
      this.$emit("closeView");
      this.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
.header-button {
  margin-bottom: 8px;
}
/deep/ .el-table{
  overflow: visible !important;
}

/deep/ .el-table .cell{
  overflow: visible !important;
}

/deep/ .el-table__body-wrapper{
  overflow: visible !important;
}

</style>