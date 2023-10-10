<template>
  <div>
    <el-dialog
      title="检查项管理"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="61.8%"
      append-to-body
    >
      <el-form
        ref="planForm"
        :model="planForm"
        :rules="planRules"
        :label-width="labelWidth"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="检查表名称:" prop="formName">
              <el-select
                v-model="planForm.formName"
                filterable
                placeholder="请输入搜索关键字"
                @change="handleCheckChange"
              >
                <el-option
                  v-for="item in checkOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划检查日期:" prop="planCheckDate">
              <el-date-picker
                v-model="planForm.planCheckDate"
                type="date"
                format="yyyy年MM月dd日"
                value-format="yyyy-MM-dd"
                :picker-options="expireTimeOption"
                placeholder="请选择计划检查日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查人:" prop="checkUserIdList">
              <el-select
                v-model="planForm.checkUserIdList"
                clearable
                multiple
                filterable
                collapse-tags
                placeholder="请选择检查人"
                @change="handleCheckerChange"
              >
                <el-option
                  v-for="dict in userOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查要求:" prop="requirement">
              <el-input
                v-model="planForm.requirement"
                placeholder="请输入检查要求"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mb8">
            <span class="table-title">检查项列表</span>
            <div style="float:right;">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                :disabled="!addItem"
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
          <el-col :span="24">
            <el-form-item label-width="0" prop="checkItemTaskList">
              <el-table
                v-loading="loading"
                :data="planForm.checkItemTaskList"
                :max-height="tableHeight"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="45" align="center" />
                <el-table-column label="序号" align="center" type="index" />
                <el-table-column
                  label="检查项名称"
                  align="center"
                  prop="itemName"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  label="检查依据"
                  align="center"
                  prop="basis"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  label="检查方式"
                  align="center"
                  prop="mode"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  label="操作"
                  align="center"
                  width="150"
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
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPlan">确 定</el-button>
        <el-button @click="cancelPlan">取 消</el-button>
      </div>
    </el-dialog>

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
            <el-form-item label="检查项名称:" prop="itemName">
              <el-input
                v-model="form.itemName"
                placeholder="请输入检查项名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查依据:" prop="basis">
              <el-input v-model="form.basis" placeholder="请输入检查依据" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查方式:" prop="mode">
              <el-input v-model="form.mode" placeholder="请输入检查方式" />
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
import { listCheck, listItem } from "@/api/modules/check";
import { listUser } from "@/api/modules/sys/user";
import {
  listItem as listPlanItem,
  addCheck,
  updateCheck
} from "@/api/modules/investigate/check";

export default {
  name: "PlaningDialog",
  components: {},
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    // 表单标题宽度
    labelWidth: {
      type: String,
      default: "125px"
    }
  },
  data() {
    return {
      // 是否显示列表弹出层
      visible: this.value,
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 弹出层标题
      title: "",
      // 是否新增检查项
      addItem: false,
      // 是否显示弹出层
      open: false,
      // 检查表数据字典
      checkOptions: [],
      // 检查人数据字典
      userOptions: [],
      // 是否显示上传弹出层
      uploading: false,
      // 检查计划表单参数
      planForm: {
        id: undefined,
        formName: undefined,
        planCheckDate: undefined,
        checkUserIdList: undefined,
        checkUserNameList: undefined,
        requirement: undefined,
        checkItemTaskList: []
      },
      // 检查计划表单校验
      planRules: {
        formName: [
          { required: true, message: "检查表名称不能为空", trigger: "blur" }
        ],
        planCheckDate: [
          { required: true, message: "计划检查日期不能为空", trigger: "blur" }
        ],
        checkUserIdList: [
          { required: true, message: "检查人不能为空", trigger: "blur" }
        ],
        checkItemTaskList: [
          { required: true, message: "检查项不能为空", trigger: "blur" }
        ]
      },
      // 检查项表单参数
      form: {},
      // 检查项表单校验
      rules: {
        itemName: [
          { required: true, message: "检查项名称不能为空", trigger: "blur" }
        ]
      },
      // 当日之前的日期不可选
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
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
  created() {
    this.getCheckList();
    this.getUserList();
  },
  methods: {
    /** 重置相关值 */
    setup(params) {
      this.addItem = params.id ? true : false;
      this.planForm.id = params.id || undefined;
      this.planForm.formName = params.formName || undefined;
      this.planForm.planCheckDate = params.planCheckDate || undefined;
      this.planForm.checkUserIdList = params.checkUserIdList || undefined;
      this.planForm.checkUserNameList = params.checkUserNameList || undefined;
      this.planForm.requirement = params.requirement || "";
      this.planForm.checkItemTaskList = params.checkItemTaskList || undefined;
      if (this.planForm.id) {
        this.getPlanItems();
      }
    },
    /** 查询检查表列表 */
    getCheckList() {
      listCheck({ page: 1, limit: 1000000 }).then(response => {
        const result = response.result.list;
        if (result && result.length) {
          this.checkOptions = result.map(item => {
            return { value: item.id, label: item.formName };
          });
        }
      });
    },
    /** 查询检查人列表 */
    getUserList() {
      listUser({ page: 1, limit: 1000000 }).then(response => {
        const result = response.result.list;
        if (result && result.length) {
          this.userOptions = result.map(item => {
            return { value: item.userId, label: item.name };
          });
        }
      });
    },
    /** 修改状态下初始查询主列表 */
    getPlanItems() {
      this.loading = true;
      listPlanItem(this.planForm.id).then(response => {
        const result = response.result;
        this.planForm.checkItemTaskList = result || [];
        this.resetItems();
        this.loading = false;
      });
    },
    /** 检查表切换后查询主列表 */
    getItems(checkId) {
      this.loading = true;
      listItem({ formId: checkId }).then(response => {
        const result = response.result;
        this.planForm.checkItemTaskList = result || [];
        this.resetItems();
        this.addItem = true;
        this.loading = false;
      });
    },
    /** 检查表切换操作 */
    handleCheckChange(val) {
      const checkId = this.checkOptions.find(item => item.label === val).value;
      this.getItems(checkId);
    },
    /** 检查人切换操作 */
    handleCheckerChange(val) {
      this.planForm.checkUserNameList = [];
      val.forEach(res => {
        this.planForm.checkUserNameList.push(this.userOptions.find(
          item => item.value === res
        ).label)
      })
    },
    /** 多选操作 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.index);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 表单重置操作 */
    reset() {
      this.form = {
        formTaskId: this.planForm.id,
        id: undefined,
        index: undefined,
        itemName: undefined,
        basis: "",
        mode: "现场检查"
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.addItem = true;
      this.open = true;
      this.title = "添加检查项";
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.addItem = false;
      this.open = true;
      this.title = "修改检查项";
      this.form = { ...row };
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const itemIds = row && row.index != undefined ? [row.index] : this.ids;
      this.$confirm("是否确认删除所选检查项？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delItems(itemIds);
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    delItems(ids) {
      this.planForm.checkItemTaskList = this.planForm.checkItemTaskList.filter(
        item => {
          return !ids.includes(item.index);
        }
      );
      this.resetItems();
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (!this.addItem) {
            const index = Number(this.form.index);
            this.planForm.checkItemTaskList.splice(index, 1, { ...this.form });
            this.msgSuccess("修改成功");
            this.open = false;
            this.addItem = true;
          } else {
            this.planForm.checkItemTaskList.splice(0, 0, { ...this.form });
            this.resetItems();
            this.msgSuccess("添加成功");
            this.open = false;
          }
        }
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.addItem = true;
      this.reset();
    },
    /** 检查计划提交按钮 */
    submitPlan: function() {
      this.$refs["planForm"].validate(valid => {
        if (valid) {
          this.formRequest(addCheck, updateCheck, this.planForm).then(_ => {
            this.$emit("planSuccess");
            this.visible = false;
          });
        }
      });
    },
    /** 安检查计划取消按钮 */
    cancelPlan() {
      this.visible = false;
      this.$emit("planCancel");
    },
    /** 重置检查项列表Id */
    resetItems() {
      this.planForm.checkItemTaskList.forEach((item, index) => {
        item.index = index;
      });
    }
  }
};
</script>
