<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
    @close="handleClose"
  >
    <uploader
      ref="uploader"
      :editable="editable"
      :action="action"
      :fieldName="fieldName"
      :accept="accept"
      :multiple="multiple"
      :limit="limit"
      :autoUpload="autoUpload"
      :listType="listType"
      :showFileList="showFileList"
      :previewUri="previewUri"
      :downloadUri="downloadUri"
      :size="size"
      @uploadCompletion="handleUploadCompletion"
    >
    </uploader>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Uploader from "./index";

export default {
  name: "UploaderDialog",
  components: { Uploader },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    // 上传的地址
    action: {
      type: String,
      default: process.env.VUE_APP_BASE_API + "/file/uploadFiles"
    },
    // 上传的文件字段名
    fieldName: {
      type: String,
      default: "files"
    },
    // 接受上传的文件类型
    accept: {
      type: String,
      default: "image/*"
    },
    // 是否支持多选文件
    multiple: {
      type: Boolean,
      default: true
    },
    // 最大允许上传个数
    limit: {
      type: Number,
      default: undefined
    },
    // 是否在选取文件后立即进行上传
    autoUpload: {
      type: Boolean,
      default: true
    },
    // 文件列表的类型
    listType: {
      type: String,
      default: "picture-card"
    },
    // 是否显示已上传文件列表
    showFileList: {
      type: Boolean,
      default: true
    },
    // 文件预览标识符
    previewUri: {
      type: String,
      default: "/file/show/"
    },
    // 文件下载标识符
    downloadUri: {
      type: String,
      default: "/file/down/"
    },
    // 按钮尺寸medium / small / mini
    size: {
      type: String,
      default: "medium"
    },
    width: {
      type: String,
      default: "665px"
    }
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value,
      // 文件列表
      fileList: []
    };
  },
  computed: {
    // 标题
    title() {
      if (this.editable) return "文件上传";
      else return "文件查看";
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
  created() {},
  methods: {
    /** 重置相关值 */
    setup(data) {
      const parseData = JSON.parse(JSON.stringify(data));
      this.fileList = parseData;
      this.setupUploader(parseData);
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList) {
      this.fileList = fileList;
    },
    /** 提交按钮 */
    submit: function() {
      if (this.editable) {
        const parseData = JSON.parse(JSON.stringify(this.fileList));
        this.$emit("change", parseData);
      }
      this.visible = false;
    },
    handleClose() {
      this.setupUploader();
    }
  }
};
</script>
