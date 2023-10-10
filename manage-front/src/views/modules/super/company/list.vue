<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="公司名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入公司名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="版本选择" prop="version">
            <el-select
              v-model="queryParams.version"
              placeholder="请选择平台版本"
              clearable
              size="small"
              style="width: 160px"
            >
              <el-option
                v-for="dict in versionOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="账户类型:" prop="ifGov">
            <el-select
              size="small"
              v-model="queryParams.ifGov"
              placeholder="请选择账户类型"
            >
              <el-option label="政府" value="1"></el-option>
              <el-option label="企业" value="0"></el-option>
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
            <div style="float: right">
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
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="企业名称"
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
            label="企业联系人"
            align="center"
            prop="userName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="联系电话"
            align="center"
            prop="mobile"
            width="120"
          />
          <el-table-column label="版本选择" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.version">
                {{ versionName(scope.row.version) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
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
                @click="handleRowOp(scope.row.deptId, 0)"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleRowOp(scope.row.deptId, 4)"
                >重置</el-button
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
    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="750px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账户类型:" prop="ifGov">
              <el-select
                v-model="form.ifGov"
                placeholder="请选择账户类型"
                :disabled="form.deptId != undefined"
              >
                <el-option label="政府" :value="1"></el-option>
                <el-option label="企业" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.ifGov == 1">
            <el-form-item label="政府名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入政府名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-else>
            <el-form-item label="企业名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入企业名称" />
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
                :disabled="!!form.workNo"
                placeholder="请输入密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人:" prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="请输入企业联系人"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话:" prop="mobile">
              <el-input
                v-model="form.mobile"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.ifGov != 1">
            <el-form-item label="版本选择:" prop="version">
              <el-select
                v-model="form.version"
                placeholder="请选择平台版本"
                style="width: 256px"
              >
                <el-option
                  v-for="dict in versionOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <AreaPicker v-model="form" />
          </el-col>
          <el-col :span="24">
            <el-form-item label="企业位置:" required>
              <el-col :span="9">
                <el-form-item prop="posX">
                  <span>x:</span>
                  <el-input-number
                    v-model="form.posX"
                    :min="0"
                    :max="180"
                    :precision="6"
                    :step="0.01"
                    controls-position="right"
                    placeholder="请输入经度"
                    style="width: 145px"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item prop="posY">
                  <span>y:</span>
                  <el-input-number
                    v-model="form.posY"
                    :min="0"
                    :max="90"
                    :precision="6"
                    :step="0.01"
                    controls-position="right"
                    placeholder="请输入纬度"
                    style="width: 145px"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-button type="primary" @click="handleLocation"
                >手动定位</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 地图对话框 -->
    <map-dialog
      ref="mapDialog"
      v-model="showMap"
      :editable="true"
      width="61.8vw"
      height="61.8vh"
      @completion="handleCompletion"
    ></map-dialog>
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
  resetUserPwd,
} from "@/api/modules/super/enterprise";
import MapDialog from "@/components/MapDialog";
import AreaPicker from "@/views/components/common/area-picker01";
export default {
  name: "EnterpriseUser",
  components: { MapDialog, AreaPicker },
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
      // 是否正在手动定位
      showMap: false,
      // 默认密码
      initPassword: "123456",
      // 表单参数
      form: {
        provinceId: undefined, //注册所在省,
        cityId: undefined, //注册所在市,
        areaId: undefined, //注册所在区县代码,
        streetId: undefined, //注册所在街镇代码
      },
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        name: undefined,
        version: undefined,
        ifGov: undefined,
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "企业名称不能为空", trigger: "blur" },
        ],
        workNo: [
          { required: true, message: "登录账号不能为空", trigger: "blur" },
        ],
        mobile: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        version: [
          { required: true, message: "版本选择不能为空", trigger: "blur" },
        ],
        posX: [{ required: true, message: "经度不能为空", trigger: "change" }],
        posY: [{ required: true, message: "纬度不能为空", trigger: "change" }],
        ifGov: [{ required: true, message: "账户类型", trigger: "change" }],
        provinceId: [{ required: true, message: "所在省", trigger: "change" }],
        // cityId: [{ required: true, message: "所在市", trigger: "change" }],
        // areaId: [{ required: true, message: "所在区", trigger: "change" }],
        // streetId: [{ required: true, message: "所在乡镇", trigger: "change" }],
      },
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 版本数据字典 */
    versionOptions() {
      return this.$store.state.common.systemVersions;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
        const result = response.result;
        console.log(result);
        this.userList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据版本value获取版本label
    versionName(val) {
      return this.versionOptions.find((item) => item.value === val).label;
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === 1 ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.workNo + '"用户吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return row.status === 1
            ? enableUser([row.deptId])
            : disableUser([row.deptId]);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
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
        provinceId: undefined,
        cityId: undefined,
        areaId: undefined,
        streetId: undefined,
        deptId: undefined,
        name: undefined,
        workNo: undefined,
        password: this.initPassword,
        userName: undefined,
        mobile: undefined,
        version: undefined,
        posX: undefined,
        posY: undefined,
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
      this.ids = selection.map((item) => item.deptId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
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
      this.rowsOpRequest(opFunc, userIds, tips, op).then((_) => {
        this.getList();
      });
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = "修改用户";
      this.form = { ...row };
      if (!row.posX || row.posX.length <= 0) {
        this.form.posX = undefined;
      }
      if (!row.posY || row.posY.length <= 0) {
        this.form.posY = undefined;
      }
    },
    /** 手动定位按钮操作 */
    handleLocation() {
      this.mapEditable = true;
      this.showMap = true;
      this.$nextTick(() => {
        this.$refs.mapDialog.setup({
          lng: this.form.posX,
          lat: this.form.posY,
        });
      });
    },
    /** 手动定位完成 */
    handleCompletion(point) {
      this.form.posX = point.lng;
      this.form.posY = point.lat;
    },
    /** 提交按钮 */
    submitForm: function () {
      console.log(this.form, "this.form");
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.formRequest(addUser, updateUser, this.form, "deptId").then(
            (_) => {
              this.open = false;
              this.getList();
            }
          );
        }
      });
    },
  },
};
</script>
