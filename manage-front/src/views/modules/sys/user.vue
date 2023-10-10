<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="用户名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入用户名"
              clearable
              size="small"
              style="width: 180px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="部门" prop="deptName">
            <el-input
              v-model="queryParams.deptName"
              placeholder="请输入部门"
              clearable
              size="small"
              style="width: 180px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select
              v-model="queryParams.roleId"
              placeholder="请选择角色"
              clearable
              size="small"
              style="width: 180px"
            >
              <el-option
                v-for="dict in roleOptions"
                :key="dict.roleId"
                :label="dict.name"
                :value="dict.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              size="small"
              style="width: 120px"
            >
              <el-option
                v-for="dict in statusOptions"
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
            <span class="table-title">企业用户列表</span>
            <div style="float:right;">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                >新增</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-refresh-right"
                size="mini"
                :disabled="multiple"
                @click="handleRowOp(undefined, 4)"
                >重置</el-button
              >
              <el-button
                type="info"
                icon="el-icon-lock"
                size="mini"
                :disabled="multiple"
                @click="handleRowOp(undefined, 3)"
                >禁用</el-button
              >
              <el-button
                type="success"
                icon="el-icon-unlock"
                size="mini"
                :disabled="multiple"
                @click="handleRowOp(undefined, 2)"
                >启用</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleRowOp(undefined, 0)"
                >删除</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column :selectable="checkSelect" type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="用户名"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="登录账号"
            align="center"
            prop="workNo"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部门"
            align="center"
            prop="deptName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="班组"
            align="center"
            prop="teamName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="角色"
            align="center"
            prop="roleName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(scope.row)"
                :disabled="scope.row.ifAdmin === 1 ? true : false"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="最近登录时间"
            align="center"
            prop="lastLoginDate"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            align="center"
            width="140"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.ifAdmin !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleRowOp(scope.row.userId, 0)"
                >删除</el-button
              >
              <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleRowOp(scope.row.userId, 4)"
              >重置</el-button>-->
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
    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户名:" prop="name">
              <el-input v-model="form.name" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录账号:" prop="workNo">
              <el-input v-model="form.workNo" placeholder="请输入登录账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码:" prop="password">
              <el-input
                v-model="form.password"
                :disabled="Boolean(form.workNo)"
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="部门选择:" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                :normalizer="deptNormalizer"
                :show-count="true"
                :disable-branch-nodes="false"
                :clearable="false"
                :searchable="true"
                noResultsText="未找到结果..."
                placeholder="请选择部门"
                clearAllText="清除"
                @select="deptSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班组选择:" prop="teamId">
              <el-select
                v-model="form.teamId"
                placeholder="请选择班组"
                clearable
                style="width: 180px"
              >
                <el-option
                  v-for="dict in teamOptions"
                  :key="dict.teamId"
                  :label="dict.name"
                  :value="dict.teamId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否班长:" prop="teamLeader">
              <el-radio-group v-model="form.teamLeader" style="width: 180px">
                <el-radio :key="1" :label="1">是</el-radio>
                <el-radio :key="0" :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色选择:" prop="roleId">
              <el-select
                v-model="form.roleId"
                placeholder="请选择角色"
                style="width: 180px"
              >
                <el-option
                  v-for="dict in roleOptions"
                  :key="dict.roleId"
                  :label="dict.name"
                  :value="dict.roleId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  addUser,
  updateUser,
  delUser,
  disableUser,
  enableUser,
  resetUserPwd
} from "@/api/modules/sys/user";
import { listTeam, treeDept } from "@/api/modules/sys/dept";
import { listRole } from "@/api/modules/sys/role";
import { deptTree } from "@/api/modules";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "UserManagement",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 默认密码
      initPassword: "123456",
      // 部门数据字典
      deptOptions: [],
      // 自定义部门树节点key
      deptNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children
        };
      },
      // 角色数据字典
      roleOptions: [],
      // 班组数据字典
      teamOptions: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        name: undefined,
        deptId: null,
        deptName: undefined,
        roleId: undefined,
        status: undefined
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        workNo: [
          { required: true, message: "登录账号不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "部门选择不能为空", trigger: "blur" }
        ],
        roleId: [
          { required: true, message: "角色选择不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 状态数据字典 */
    statusOptions() {
      return this.$store.state.common.userStatus;
    }
  },
  created() {
    this.departmentId();
    this.getList();
    this.getDeptTree();
    this.getRoleList();
  },
  methods: {
    /**匹配部门 */
    departmentId(){
      if(this.$store.state.user.ifAdmin !==1){
        this.queryParams.deptId = this.$store.state.user.deptId
      }
    },
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then(response => {
        const result = response.result;
        this.userList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    /** 查询当前用户部门树 */
    getDeptTree() {
      let pm={withoutTeam:1}
      if(this.$store.state.user.ifAdmin !==1){
        pm.parentDeptId = this.$store.state.user.deptId
      }
      treeDept(pm).then(response => {
        this.deptOptions = this.formatTree(response.result);
      });
    },
    /** 查询班组列表 */
    getTeamList(deptId, isDeptChange = false) {
      if (deptId != undefined) {
        listTeam(deptId).then(response => {
          const result = response.result.map(item => {
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
    /** 查询角色列表 */
    getRoleList() {
      listRole().then(response => {
        const result = response.result.map(item => {
          return {
            roleId: item.roleId,
            name: item.name
          };
        });
        this.roleOptions = result;
      });
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === 1 ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.workNo + '"用户吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return row.status === 1
            ? enableUser([row.userId])
            : disableUser([row.userId]);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.status = row.status === 0 ? 1 : 0;
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        name: undefined,
        workNo: undefined,
        password: this.initPassword,
        deptId: undefined,
        teamId: undefined,
        teamLeader: 0,
        roleId: undefined
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
      this.teamOptions = [];
      if(this.$store.state.user.ifAdmin !==1){
        this.flag = true
        this.form.deptId = this.$store.state.user.deptId
        this.getTeamList(this.$store.state.user.deptId)
      }
    },
    /** 删除、启用、禁用、重置按钮操作 */
    handleRowOp(id, op) {
      const userIds = id ? [id] : this.ids;
      const tips = op === 4 ? "用户密码" : "用户";
      let opFunc;
      if (op === 0) opFunc = delUser;
      else if (op === 2) opFunc = enableUser;
      else if (op === 3) opFunc = disableUser;
      else if (op === 4) opFunc = resetUserPwd;
      this.rowsOpRequest(opFunc, userIds, tips, op).then(_ => {
        this.getList();
      });
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.getTeamList(row.deptId);
      this.open = true;
      this.title = "修改用户";
      this.form = { ...row };
      if (row.teamId === 0) {
        this.form.teamId = undefined;
      }
    },
    /** 部门选择 */
    deptSelect(node, instanceId) {
      if (this.form.deptId !== node.deptId) {
        this.form.deptId = node.deptId;
        this.getTeamList(node.deptId, true);
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formRequest(addUser, updateUser, this.form, "userId").then(_ => {
            this.open = false;
            this.getList();
          });
        }
      });
    },
    checkSelect (row) {
      let isChecked = true;
      if (row.ifAdmin === 1) {
        isChecked = false
      } else {
         isChecked = true
      }
    return isChecked
    }
  }
};
</script>
