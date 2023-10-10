<template>
  <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
    <el-row>
      <el-col v-if="display.status === 2" :span="24">
        <el-form-item label="复查结果:">
          <el-input v-model="display.result" disabled style="width:200px" />
        </el-form-item>
      </el-col>
      <el-col v-if="display.status === 2" :span="24">
        <el-form-item label="退回理由:">
          <el-input v-model="display.reason" disabled type="textarea" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="整改情况:" prop="status">
          <el-select
            v-model="form.status"
            :disabled="!editable"
            clearable
            placeholder="请选择整改情况"
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
      <el-col :span="24">
        <el-form-item label="整改措施:" prop="rectification">
          <el-input v-model="form.rectification" type="textarea" :row="3" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="整改资金:" prop="price">
          <el-input v-model="form.price" type="input" oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="整改后图片:" prop="fileList">
          <uploader
            ref="uploader"
            :editable="editable"
            @uploadCompletion="handleUploadCompletion"
          ></uploader>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label-width="0">
          <reform-table ref="reformTable"></reform-table>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Uploader from "@/components/Uploader";
import ReformTable from "./track-reform-table";

export default {
  name: "TroubleReformForm",
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
          label: "已整改",
          value: 1
        },
        {
          label: "未整改",
          value: 0
        }
      ],
      // 顶部显示表单参数
      display: {
        status: undefined,
        result: undefined,
        reason: undefined
      },
      // 表单参数-内部
      form: this.value || {
        id: undefined,
        taskId: undefined,
        status: undefined,
        rectification: undefined,
        price: undefined,
        fileList: []
      },
      // 表单校验
      rules: {
        status: [
          { required: true, message: "整改情况不能为空", trigger: "blur" }
        ],
        rectification: [
          { required: true, message: "整改措施不能为空", trigger: "blur" }
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
      this.form.taskId = params.taskId || undefined;
      this.display.status = params.status || undefined;
      this.display.result = "退回";
      this.display.reason = params.reviewBackReason || undefined;
      this.$nextTick(() => {
        this.$refs.reformTable.setup(this.form.taskId);
      });
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    /** 表单重置操作 */
    reset() {
      this.display = {
        status: undefined,
        result: undefined,
        reason: undefined
      };
      this.form = {
        id: undefined,
        taskId: undefined,
        status: undefined,
        rectification: undefined,
        price: undefined,
        fileList: []
      };
      this.resetForm("form");
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList) {
      this.form.fileList = fileList;
    },
    /** 现场拍照验证 */
    validatePhotos(rule, value, callback) {
      if (!this.form.fileList || !this.form.fileList.length) {
        return callback(new Error("整改后图片不能为空"));
      }
      callback();
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
