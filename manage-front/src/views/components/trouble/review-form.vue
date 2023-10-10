<template>
  <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
    <el-row>
      <template v-if="!eliminate">
        <el-col :span="24">
          <el-form-item label="提交整改时间:">
            <el-input
              v-model="display.checkTime"
              disabled
              style="width:200px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="整改部门:">
            <el-input
              v-model="display.checkDept"
              disabled
              style="width:200px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="整改人:">
            <el-input
              v-model="display.checkUser"
              disabled
              style="width:200px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="整改情况:">
            <el-input
              v-model="display.checkStatus"
              disabled
              style="width:200px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="整改后图片:">
            <uploader ref="uploader" :editable="false"></uploader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="复查结果:" prop="status">
            <el-select
              v-model="form.status"
              :disabled="!editable"
              clearable
              placeholder="请选择复查结果"
              @change="handleStatusChange"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.status === 2" :span="24">
          <el-form-item label="退回理由:" prop="reviewBackReason">
            <el-input
              v-model="form.reviewBackReason"
              :disabled="!editable"
              type="textarea"
              placeholder="请输入退回理由"
            />
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="24">
        <el-form-item label-width="0">
          <reform-table
            ref="reformTable"
            @latestRecordChange="handleLatest"
          ></reform-table>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Uploader from "@/components/Uploader";
import ReformTable from "./track-reform-table";

export default {
  name: "TroubleReviewForm",
  components: { Uploader, ReformTable },
  props: {
    // 表单参数
    value: {
      type: Object
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    // 隐藏冗余
    eliminate: {
      type: Boolean,
      default: false
    },
    // 是否可见
    visible: {
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
      // 整改情况
      statusOptions: [
        {
          label: "通过",
          value: 3
        },
        {
          label: "退回",
          value: 2
        }
      ],
      // 顶部显示表单参数
      display: {
        checkTime: undefined,
        checkDept: undefined,
        checkUser: undefined,
        checkStatus: undefined,
        checkImages: undefined
      },
      // 表单参数-内部
      form: this.value || {
        id: undefined,
        status: undefined,
        reviewBackReason: undefined
      },
      // 表单校验
      rules: {
        status: [
          { required: true, message: "复查结果不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.form = val;
    },
    form(val) {
      this.$emit("input", val);
    },
    visible(val) {
      if (!val) this.clearValidate();
    }
  },
  created() {},
  methods: {
    /** 重置相关值 */
    setup(params) {
      this.reset();
      this.form.id = params.taskId || undefined;
      this.display.checkDept = params.reformDeptName || undefined;
      this.$nextTick(() => {
        this.$refs.reformTable.setup(this.form.id);
      });
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        if (this.$refs.uploader) this.$refs.uploader.setup(fileList);
      });
    },
    /** 状态切换 */
    handleStatusChange(value) {
      if (value !== 2) this.form.reviewBackReason = undefined;
    },
    /** 获取整改列表第一条记录 */
    handleLatest(data) {
      this.display.checkTime = data.checkTime || undefined;
      this.display.checkUser = data.checkUserName || undefined;
      this.display.checkStatus = "已整改";
      this.display.checkImages = data.fileList || [];
      this.setupUploader(this.display.checkImages);
    },
    /** 表单重置操作 */
    reset() {
      this.display = {
        checkTime: undefined,
        checkDept: undefined,
        checkUser: undefined,
        checkStatus: undefined,
        checkImages: undefined
      };
      this.form = {
        id: undefined,
        status: undefined,
        reviewBackReason: undefined
      };
      this.resetForm("form");
    },
    /** 验证表单 */
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
      this.setupUploader();
    }
  }
};
</script>
