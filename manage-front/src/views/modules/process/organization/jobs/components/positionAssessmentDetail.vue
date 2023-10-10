<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="1000px"
    :before-close="handleCancel"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      size="small"
      :disabled="islock"
    >
      <el-form-item label="年份" prop="particularYear">
        <el-date-picker
          v-model="ruleForm.particularYear"
          type="year"
          placeholder="选择年"
          format="yyyy"
          value-format="yyyy"
          :editable="false"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="被考核人" prop="coverAssessPerson">
        <el-input v-model="ruleForm.coverAssessPerson"></el-input>
      </el-form-item>
      <el-form-item label="被考核人岗位" prop="coverAssessStationId">
        <el-select v-model="ruleForm.coverAssessStationId" placeholder="请选择">
          <el-option
            v-for="item in positionName"
            :key="item.id"
            :label="item.stationName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="被考核部门" prop="coverAssessDeptId">
        <Treeselect
          v-model="ruleForm.coverAssessDeptId"
          :options="deptOptions"
          :normalizer="deptNormalizer"
          :show-count="true"
          :disabled="islock"
          :disable-branch-nodes="false"
          :clearable="true"
          :searchable="true"
          noResultsText="未找到结果..."
          placeholder="请选择部门"
          clearAllText="清除"
          @change="deptSelect"
        />
      </el-form-item>
      <el-form-item label="考核人" prop="assessPerson">
        <el-input v-model="ruleForm.assessPerson"></el-input>
      </el-form-item>
      <el-form-item label="考核结果" prop="assessResult">
        <el-input v-model="ruleForm.assessResult"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input type="textarea" v-model="ruleForm.memo"></el-input>
      </el-form-item>
    </el-form>

    <div class="header-button flex justify-end items-center" v-if="!islock">
      <el-button type="primary" plain size="small" @click="addTableData()"
        >增加</el-button
      >
    </div>

    <el-table :data="tableData" size="small">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column label="考核内容" width="180" v-if="!islock">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.assessContent"
            :disabled="islock"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="考核说明" width="180">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.assessDesc"
            :disabled="islock"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="考核情况">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.assessState"
            :disabled="islock"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="考核分">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.assessScore"
            :disabled="islock"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="120" label="操作" v-if="!islock">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            icon="el-icon-delete"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">取 消</el-button>
      <el-button type="primary" v-if="!islock" @click="submitForm('ruleForm')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { deptTree } from "@/api/modules";
import { listTeam } from "@/api/modules/sys/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { mapGetters } from "vuex";
import { save_API, update_API } from "@/api/modules/process/webstationassess";

export default {
  name:"positionAssessmentDetail",
  components: {
    Treeselect,
  },
  computed: {
    ...mapGetters(["positionName"]),
  },
  name: "positionAssessmentDetail",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "",
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
      visible: this.value,
      ruleForm: {
        id: undefined,
        particularYear: undefined, //年份
        coverAssessPerson: undefined, //被考核人
        coverAssessStationId:undefined,//被考核人岗位
        coverAssessDeptId: undefined, //被考核人部门
        assessPerson: undefined, //考核人
        assessResult: undefined, //考核结果
        results: [],
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
      tableData: [],
      // options: [],
      rules: {
        particularYear: [
          { required: true, message: "请选择年份", trigger: "change" },
        ],
        coverAssessPerson: [
          { required: true, message: "请输入被考核人", trigger: "blur" },
        ],
        coverAssessStationId: [
          { required: true, message: "请输入被考核人岗位", trigger: "blur" },
        ],
        coverAssessDeptId: [
          { required: true, message: "请输入被考核人部门", trigger: "blur" },
        ],
        assessPerson: [
          { required: true, message: "请输入考核人", trigger: "blur" },
        ],
        assessResult: [
          { required: true, message: "请输入考核结果", trigger: "blur" },
        ],
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

    reset() {
      this.ruleForm.id = undefined;
      this.tableData = [];
      this.resetForm("ruleForm");
    },
    handleCancel() {
      this.visible = false;
      this.reset();
    },
    editTemp(params) {
      this.ruleForm = { ...params };
      if (this.ruleForm.results && this.ruleForm.results.length > 0) {
        this.tableData = this.ruleForm.results;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.results = this.tableData;
          this.formRequest(save_API, update_API, this.ruleForm).then((_) => {
            this.saveSuccess();
          });
        }
      });
    },
    saveSuccess() {
      this.visible = false;
      this.$emit("closeView");
      this.reset();
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    addTableData() {
      let arr = {
        assessContent: undefined,
        assessDesc: undefined,
        assessState: undefined,
        assessScore: undefined,
      };
      console.log(this.tableData);
      this.tableData.push(arr);
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