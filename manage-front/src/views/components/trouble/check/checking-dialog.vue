<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="labelWidth"
      disabled
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="检查表名称:" prop="formName">
            <el-input v-model="form.formName" placeholder="请输入检查表名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划检查日期:" prop="planCheckDate">
            <el-input
              v-model="form.planCheckDate"
              placeholder="请输入计划检查日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检查人:" prop="checkUserNames">
            <el-input
              v-model="form.checkUserNames"
              placeholder="请输入检查人"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检查要求:" prop="requirement">
            <el-input v-model="form.requirement" />
          </el-form-item>
        </el-col>
        <el-col v-if="!editable && form.checkDate" :span="12">
          <el-form-item label="检查日期:" prop="checkDate">
            <el-input v-model="form.checkDate" placeholder="请输入检查日期" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="安全检查签名:" prop="checkUserSignsFile">
            <Uploader
              ref="checkUserSignsFile"
              list-type="picture"
              :multiple="false"
              :limit="2"
              :size="size"
            ></Uploader>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb8">
          <span class="table-title">检查项列表</span>
        </el-col>
        <el-col :span="24">
          <el-form>
            <el-table
              v-loading="loading"
              :data="form.checkItemTaskList"
              :max-height="tableHeight"
              :disabled="false"
            >
              <el-table-column label="序号" align="center" type="index" />
              <el-table-column
                label="检查项内容"
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
                label="现场拍照"
                align="center"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <image-viewer
                    :ref="'imageViewer' + scope.$index"
                    :images="scope.row.photoList"
                  ></image-viewer>
                  <el-button
                    v-if="scope.row.photoList && scope.row.photoList.length"
                    class="number"
                    size="mini"
                    type="text"
                    @click="showImages(scope.$index)"
                    >{{ scope.row.photoList.length }}</el-button
                  >
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column
                v-if="editable"
                label="操作"
                align="center"
                width="255"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-form-item
                    label-width="0"
                    :prop="'checkItemTaskList.' + scope.$index + '.status'"
                    :rules="[
                      {
                        validator: validateResult,
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-radio-group v-model="scope.row.status">
                      <el-radio
                        :label="1"
                        @click.native="handleOperation($event, scope.$index, 1)"
                        >符合</el-radio
                      >
                      <el-radio
                        :label="0"
                        :disabled="false"
                        @click.native="handleOperation($event, scope.$index, 0)"
                        >不符合</el-radio
                      >
                      <el-radio
                        :label="-1"
                        @click.native="
                          handleOperation($event, scope.$index, -1)
                        "
                        >不适用</el-radio
                      >
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column v-else label="结果" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === 1">符合</span>
                  <el-button
                    v-else-if="scope.row.status === 0"
                    class="number"
                    type="text"
                    @click="showResult(scope.$index)"
                    >不符合</el-button
                  >
                  <span v-else>不适用</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        v-if="editable"
        type="primary"
        @click="
          temporary = true;
          submitForm();
        "
        >临时保存</el-button
      >
      <el-button
        type="primary"
        @click="
          temporary = false;
          submitForm();
        "
        >确 定</el-button
      >
      <el-button @click="cancel">取 消</el-button>
    </div>

    <!-- 添加或修改参数配置对话框 -->
    <register-dialog
      ref="registerDialog"
      v-model="troubleDialog.open"
      :fromRisk="fromRisk"
      :editable="editable"
      @submitSuccess="handleAddCompletion"
    ></register-dialog>
  </el-dialog>
</template>

<script>
import { listItem, submitCheck } from "@/api/modules/investigate/check";
import ImageViewer from "@/components/ImageViewer";
import RegisterDialog from "../register-dialog";
import Uploader from "@/components/Uploader";

export default {
  name: "CheckingDialog",
  components: { ImageViewer, RegisterDialog, Uploader },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false,
    },
    // 调用入口 false-隐患排查/检查管理,true-隐患排查/隐患管理
    fromRisk: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "安全检查",
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: "61.8%",
    },
    // 表单标题宽度
    labelWidth: {
      type: String,
      default: "125px",
    },
  },
  data() {
    return {
      size:'small',
      // 是否显示弹出层-内部
      visible: this.value,
      // 隐患弹出层相关
      troubleDialog: {
        open: false,
        relationIndex: undefined,
      },
      // 遮罩层
      loading: true,
      // 是否临时保存
      temporary: false,
      // 表单参数
      form: {
        id: undefined,
        formName: undefined,
        planCheckDate: undefined,
        checkDate: undefined,
        checkUserNames: undefined,
        requirement: undefined,
        checkItemTaskList: [],
      },
      // 表单校验
      rules: {
        formName: [
          { required: true, message: "检查表名称不能为空", trigger: "blur" },
        ],
        planCheckDate: [
          { required: true, message: "计划检查日期不能为空", trigger: "blur" },
        ],
        checkUserNames: [
          { required: true, message: "检查人不能为空", trigger: "blur" },
        ],
        checkDate: [
          { required: true, message: "检查日期不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
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
  methods: {
    /** 重置相关值 */
    setup(params) {
      this.form.id = params.id || undefined;
      this.form.formName = params.formName || undefined;
      this.form.planCheckDate = params.planCheckDate || undefined;
      this.form.checkDate = params.checkDate || undefined;
      this.form.checkUserNames = params.checkUserNames || undefined;
      this.form.requirement = params.requirement || "";
      this.form.checkItemTaskList = params.checkItemTaskList || undefined;
      this.form.checkUserSignsFile = params.checkUserSignsFile || undefined;
      if (this.form.checkUserSignsFile) {
        this.$nextTick(() => {
          this.$refs["checkUserSignsFile"].setup(this.form.checkUserSignsFile);
        });
      }
      this.getList();
    },
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listItem(this.form.id).then((response) => {
        const result = response.result;
        this.form.checkItemTaskList = result || [];
        this.loading = false;
      });
    },
    /** 显示现场图片 */
    showImages(index) {
      this.$refs["imageViewer" + index].show();
    },
    /** 不符合按钮 */
    showResult(index) {
      this.troubleDialog.open = true;
      this.troubleDialog.relationIndex = Number(index);
      // const taskId = this.form.checkItemTaskList[index].formTaskId;
      const trouble = {
        description: this.form.checkItemTaskList[index].description,
        fileList: this.form.checkItemTaskList[index].photoList,
      };
      this.$nextTick(() => {
        // this.$refs.registerDialog.setup(taskId);
        this.$refs.registerDialog.setup(undefined, trouble);
      });
    },
    handleOperation(ev, index, value) {
      if (ev.target.tagName === "INPUT") return;
      if (value === 0) {
        this.troubleDialog.open = true;
        this.troubleDialog.relationIndex = Number(index);
        // const trouble = this.form.checkItemTaskList[index].troubleRegister;
        const description = this.form.checkItemTaskList[index].description;
        const trouble =
          description && description.length
            ? {
                description,
                fileList: this.form.checkItemTaskList[index].photoList,
              }
            : undefined;
        this.$nextTick(() => {
          this.$refs.registerDialog.setup(undefined, trouble);
        });
      } else {
        // this.form.checkItemTaskList[index].troubleRegister = undefined;
        this.form.checkItemTaskList[index].description = undefined;
        this.form.checkItemTaskList[index].photoList = [];
      }
    },
    /** 隐患添加完成回调 */
    handleAddCompletion(trouble) {
      const index = this.troubleDialog.relationIndex;
      // this.form.checkItemTaskList[index].troubleRegister = trouble || undefined;
      if (trouble) {
        this.form.checkItemTaskList[index].description = trouble.description;
        this.form.checkItemTaskList[index].photoList = trouble.fileList;
      } else {
        this.form.checkItemTaskList[index].description = undefined;
        this.form.checkItemTaskList[index].photoList = [];
      }
    },
    /** 操作结果验证 */
    validateResult(rule, value, callback) {
      if (this.temporary) {
        return callback();
      }
      if (value == undefined || value == null) {
        return callback(new Error("检查结果不能为空"));
      }
      if (value === 0) {
        const index = Number(rule.field.split(".")[1]);
        // const trouble = this.form.checkItemTaskList[index].troubleRegister;
        // if (!trouble) {
        //   return callback(new Error("隐患不能为空"));
        // }
        const trouble = this.form.checkItemTaskList[index].description;
        if (!trouble || !trouble.length) {
          return callback(new Error("隐患不能为空"));
        }
      }
      callback();
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.editable) {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            submitCheck(this.form, this.temporary).then((response) => {
              this.msgSuccess("检查成功");
              this.$emit("checkSuccess");
              this.visible = false;
            });
          }
        });
      } else {
        this.visible = false;
      }
    },
    /** 取消按钮 */
    cancel() {
      this.visible = false;
      this.$nextTick(() => {
        this.$refs["checkUserSignsFile"].setup();
      });
      if (this.editable) this.$emit("checkCancel");
    },
  },
};
</script>

<style lang="scss" scoped>
.number {
  color: #1890ff;
}
</style>
