<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="450px"
    append-to-body
  >
    <div>温馨提示:</div>
    <div class="tips">
      <div>1.下载模板填写。</div>
      <div>2.导入会覆盖相同编码或者名称，在导出表格里进行修改。</div>
    </div>
    <div style="padding-bottom:5px;">
      <el-link type="info" @click="templateFunc">
        <i class="el-icon-download" style="color:#1890ff;">下载模板</i>
      </el-link>
    </div>
    <el-upload
      ref="upload"
      class="upload"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="headers"
      :action="action"
      :disabled="uploading"
      :data="param"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" style="color:red" slot="tip">
        提示：仅允许导入“xls”或“xlsx”格式的文件！
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitFile">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  name: "UploadDialog",
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: "导入"
    },
    // 上传地址
    actionUri: {
      type: String,
      required: true
    },
    // 额外参数
    param: {
      type: Object,
      required: false
    },
    // 模板文件下载方法
    templateFunc: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      // 是否显示弹出层
      visible: this.value,
      // 是否正在上传
      uploading: false,
      // 设置上传的请求头部
      headers: { token: getToken() }
    };
  },
  computed: {
    // 上传的地址
    action() {
      return process.env.VUE_APP_BASE_API + this.actionUri;
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
  methods: {
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.uploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.visible = false;
      this.uploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.$emit("uploadCompletion", response);
    },
    // 提交上传文件
    submitFile() {
      this.$refs.upload.submit();
    }
  }
};
</script>

<style lang="scss" scoped>
.tips {
  background: #fffadd;
  height: 60px;
  padding: 14px 14px;
  margin: 10px 0;
}
</style>
<style lang="scss">
.upload {
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: auto;
    }
  }
}
</style>
