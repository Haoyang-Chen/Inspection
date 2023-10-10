<template>
  <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
    <el-row>
      <template v-if="!eliminate">
        <el-col :span="24">
          <el-form-item label="隐患描述:">
            <el-input v-model="display.descript" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="检查频率:">
            <el-input-number
              v-model="display.rate"
              :min="1"
              :precision="0"
              disabled
              controls-position="right"
              style="width:165px"
            />
            (天/次)
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="整改情况描述:" prop="description">
            <el-input
              v-model="form.description"
              :disabled="!editable"
              type="textarea"
              placeholder="请输入整改情况描述"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="现场拍照:" prop="fileList">
            <uploader
              ref="uploader"
              :editable="editable"
              @uploadCompletion="handleUploadCompletion"
            ></uploader>
          </el-form-item>
        </el-col>
      </template>
      <el-col :span="24">
        <el-form-item label-width="0">
          <track-table
            ref="trackTable"
            :major="true"
            @latestRecordChange="handleLatest"
          ></track-table>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Uploader from "@/components/Uploader";
import TrackTable from "./track-reform-table";

export default {
  name: "TroubleTrackForm",
  components: { Uploader, TrackTable },
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
      // 顶部显示表单参数
      display: {
        descript: undefined,
        rate: undefined
      },
      // 表单参数-内部
      form: this.value || {
        id: undefined,
        taskId: undefined,
        description: undefined,
        fileList: []
      },
      // 表单校验
      rules: {
        description: [
          { required: true, message: "整改情况描述不能为空", trigger: "blur" }
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
      this.display.descript = params.description || undefined;
      this.display.rate = params.trackRate || undefined;
      this.$nextTick(() => {
        this.$refs.trackTable.setup(this.form.taskId);
      });
    },
    /** 获取整改列表第一条记录 */
    handleLatest(data) {
      if (!data.checkTime) this.$emit("disabledChange", false);
      else {
        const lastDate = Date.parse(data.checkTime);
        const rate = Number(this.display.rate);
        this.$emit(
          "disabledChange",
          Date.now() < lastDate + rate * 24 * 3600 * 1000
        );
      }
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        if (this.$refs.uploader) this.$refs.uploader.setup(fileList);
      });
    },
    /** 表单重置操作 */
    reset() {
      this.display = {
        descript: undefined,
        rate: undefined
      };
      this.form = {
        id: undefined,
        taskId: undefined,
        description: undefined,
        fileList: []
      };
      this.resetForm("form");
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList) {
      this.form.fileList = [...fileList];
    },
    /** 现场拍照验证 */
    validatePhotos(rule, value, callback) {
      if (!this.form.fileList || !this.form.fileList.length) {
        return callback(new Error("现场拍照不能为空"));
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
