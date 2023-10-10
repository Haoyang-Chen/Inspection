<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--角色数据-->
      <el-col :span="12" :xs="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>角色选择</span>
          </div>
          <el-row :gutter="24" class="mb8">
            <el-col>
              <span class="table-title">角色列表</span>
              <div style="float:right;">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAdd"
                  >新增</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :disabled="multiple"
                  @click="handleDelete"
                  >删除</el-button
                >
              </div>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            :data="roleList"
            highlight-current-row
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            :height="tableHeight"
          >
            <el-table-column type="selection" width="45" align="center" />
            <el-table-column label="序号" align="center" type="index" />
            <el-table-column
              label="角色名称"
              align="center"
              prop="name"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="操作"
              align="center"
              width="160"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
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
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <!--菜单数据-->
      <el-col :span="12" :xs="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>菜单选择</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              icon="el-icon-document-checked"
              :disabled="!selectData"
              @click="submitPermission"
              >保存</el-button
            >
          </div>
          <menu-tree
            v-show="selectData"
            ref="menuTree"
            :webMenuSource="webMenuOptions"
            :appMenuSource="appMenuOptions"
            :checkedSource="checkedOptions"
            :height="treeHeight"
          ></menu-tree>
        </el-card>
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
            <el-form-item label="角色名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入角色名称" />
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
  listRole,
  addRole,
  updateRole,
  delRole,
  treeSource,
  treePermission,
  savePermission
} from "@/api/modules/sys/role";
import MenuTree from "@/components/MenuTree";

export default {
  name: "RoleManagement",
  components: { MenuTree },
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
      // 角色表格数据
      roleList: null,
      // 当前选中行数据
      selectData: null,
      // web菜单列表
      webMenuOptions: [],
      // app菜单列表
      appMenuOptions: [],
      // 有权限菜单id
      checkedOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }]
      },
      // 主表高度
      tableHeight: document.documentElement.scrollHeight - 240 + "px",
      // 树高度
      treeHeight: document.documentElement.scrollHeight - 232
    };
  },
  created() {
    this.getList();
    this.getMenuTree();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listRole().then(response => {
        const result = response.result;
        this.roleList = result;
        this.loading = false;
      });
    },
    /** 查询菜单树结构
     * type: 1-web 2-app
     */
    getMenuTree() {
      treeSource(1).then(response => {
        const result = response.result.map(item => {
          return { ...item, checked: false, open: true };
        });
        this.webMenuOptions = result;
      });
      treeSource(2).then(response => {
        const result = response.result.map(item => {
          return { ...item, checked: false, open: true };
        });
        this.appMenuOptions = result;
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
        roleId: undefined,
        name: undefined
      };
      this.resetForm("form");
    },
    // 选中行数据
    handleCurrentChange(selection) {
      if (!selection) return;
      this.selectData = selection;
      treePermission(selection.roleId).then(response => {
        const result = response.result;
        this.checkedOptions = result;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加角色";
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = "修改角色";
      this.form = { ...row };
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formRequest(addRole, updateRole, this.form, "roleId").then(_ => {
            this.selectData = null;
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId != undefined ? [row.roleId] : this.ids;
      this.rowsOpRequest(delRole, roleIds, "角色").then(_ => {
        this.selectData = null;
        this.getList();
      });
    },
    /** 保存按钮 */
    submitPermission: function() {
      const allChecked = this.$refs.menuTree.getAllChecked();
      savePermission(this.selectData.roleId, allChecked).then(response => {
        this.msgSuccess("修改成功");
      });
    }
  }
};
</script>
