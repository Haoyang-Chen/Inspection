<template>
  <div>
    <el-upload
      ref="upload"
      :headers="headers"
      :action="action"
      :name="fieldName"
      :accept="accept"
      :multiple="multiple"
      :limit="limit"
      :auto-upload="autoUpload"
      :file-list="fileList"
      :list-type="listType"
      :show-file-list="showFileList"
      :disabled="disabled"
      :on-preview="handlePreview"
      :before-remove="handleBeforeRemove"
      :on-remove="handleRemove"
      :before-upload="handleBeforeUpload"
      :on-change="handleChange"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      v-bind:class="{ 'uploader-disabled': !editable }"
    >
      <i v-if="listType === 'picture-card'" class="el-icon-plus"></i>
      <el-button v-else type="primary" :size="size" :disabled="disabled" icon="el-icon-upload"
        >选择文件</el-button
      >
      <div v-if="listType === 'picture-card'" slot="file" slot-scope="{ file }">
        <el-image
          style="width:148px;height:148px"
          :src="thumbnail(file)"
          fit="contain"
        >
        </el-image>
        <span class="el-upload-list__item-actions">
          <span
            v-if="isImage(file)"
            class="el-upload-list__item-preview"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleBeforeRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <image-viewer
      ref="imageViewer"
      :images="viewerImages"
      v-bind:uri="previewUri"
    ></image-viewer>
  </div>
</template>

<script>
import ImageViewer from "@/components/ImageViewer";
import { getToken } from "@/utils/auth";
import { urlOfFileName, fileNameOfUrl, isImageFile } from "@/utils/zipdownload";

export default {
  name: "Uploader",
  components: { ImageViewer },
  props: {
    // 是否可上传
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
    }
  },
  data() {
    return {
      // 设置上传的请求头部
      headers: { token: getToken() },
      // 上传文件列表
      fileList: [],
      // 是否正在上传
      uploading: false,
      // 预览图片地址数组
      viewerImages: []
    };
  },
  computed: {
    // 组件是否不可用
    disabled() {
      return !this.editable ? true : this.uploading;
    },
    // 文件预览标识符-内部
    pUri() {
      return this.previewUri && this.previewUri.length ? this.previewUri : "/";
    },
    // 文件下载标识符-内部
    dUri() {
      return this.downloadUri && this.downloadUri.length
        ? this.downloadUri
        : "/";
    }
  },
  watch: {},
  methods: {
    /** 重置相关值 */
    setup(fileList = undefined) {
      this.$refs.upload.clearFiles();
      this.uploading = false;
      if (fileList && fileList.length > 0) {
        this.fileList = this.filesForDisplay(fileList);
      }
    },
    // 预览处理
    handlePreview(file) {
      const isImage = isImageFile(file.name);
      if (file.response && file.response.code) {
        const tips = isImage ? "预览" : "下载";
        this.$message.error(`请确保文件上传成功后，再尝试${tips}！`);
        return;
      }
      if (isImage) {
        const formatFiles = this.filesForSubmit([file]);
        this.viewerImages = formatFiles;
        this.$nextTick(() => {
          this.$refs.imageViewer.show();
        });
      } else {
        this.$confirm("暂不支持此格式文件的预览，是否下载后查看?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(_ => {
            this.download(file.url, file.name);
          })
          .catch(function() {});
      }
    },
    // 下载处理
    handleDownload(file) {
      if (file.response && file.response.code) {
        this.$message.error("请确保文件上传成功后，再尝试下载文件！");
        return;
      }
      let url;
      if (isImageFile(file.name))
        url = urlOfFileName(fileNameOfUrl(file.url, this.previewUri));
      else url = file.url;
      this.download(url, file.name);
    },
    // 文件移除前处理
    handleBeforeRemove(file, fileList) {
      if (file && file.status==="success") {
        return this.$confirm(`确定移除 ${file.name}？`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          if (this.listType === "picture-card") {
            this.fileList = this.fileList.filter(item => item.uid !== file.uid);
            this.$emit("uploadCompletion", this.filesForSubmit(this.fileList));
          }
        }).catch(error=>{
          console.log(error)
        });
      }
    },
    // 文件移除处理
    handleRemove(file, fileList) {
      this.$emit("uploadCompletion", this.filesForSubmit(fileList));
    },
    // 文件开始上传处理
    handleBeforeUpload(file) {
      // const fileName = file.name;
      // const ext = fileName.substr(fileName.lastIndexOf('.') + 1);
      // const accept = ['jpg', 'jpeg', 'png', 'gif']; // 限制上传格式jpg,jpeg,png,gif
      // if (!accept.includes(ext)) {
      //   this.$message.error('文件格式上传错误');
      //   return false
      // }
      var isLt2M = file.size / 1024 / 1024 <= 10;
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 10MB!')
        return false
      }
      this.uploading = true;
    },
    // 文件状态改变处理
    handleChange(file, fileList) {
      const tempFiles = fileList.map(item => {
        if (item.response && !item.response.code) {
          const result = item.response.result[0];
          const uri = isImageFile(result.name) ? this.pUri : this.dUri;
          const url = urlOfFileName(result.name, uri);
          return {
            name: item.name,
            status: "success",
            uid: item.uid,
            url
          };
        } else {
          if (!item.url || !item.url.length) return item;
          else {
            if (item.url.includes("blob")) return { ...item, url: "" };
            else return item;
          }
        }
      });
      const unfinishFiles = tempFiles.filter(
        item => !item.url || !item.url.length
      );
      if (!unfinishFiles || !unfinishFiles.length) {
        this.fileList = tempFiles;
        this.$emit("uploadCompletion", this.filesForSubmit(this.fileList));
      }
    },
    // 文件上传成功处理
    handleUploadSuccess(response, file, fileList) {
      this.uploading = false;
    },
    // 文件上传失败处理
    handleUploadError(err, file, fileList) {
      this.$message.error(err.msg);
    },
    // 超过最大可上传数量
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    // 格式化组件需要数据
    filesForDisplay(fileList) {
      return fileList.map(item => {
        const uri = isImageFile(item.name) ? this.pUri : this.dUri;
        return {
          name: item.fileOrignalName,
          url: urlOfFileName(item.name, uri)
        };
      });
    },
    // 格式化后端需要数据
    filesForSubmit(fileList) {
      return fileList.map(item => {
        const url = item.url || "";
        const uri = isImageFile(item.name) ? this.pUri : this.dUri;
        const name = fileNameOfUrl(url, uri);
        return {
          name,
          fileOrignalName: item.name
        };
      });
    },
    // 是否图片文件
    isImage(file) {
      return isImageFile(file.name);
    },
    // 缩略图
    thumbnail(file) {
      if (isImageFile(file.name)) return file.url;
      else {
        const index = file.url.lastIndexOf(".");
        const suffix = file.url.substr(index + 1);
        const common = [
          "doc",
          "docx",
          "pdf",
          "ppt",
          "pptx",
          "xls",
          "xlsx"
        ].includes(suffix);
        let thumb;
        if (common) thumb = `${suffix}.png`;
        else thumb = "file.png";
        return require(`@/assets/image/thumbnail/${thumb}`);
      }
    }
  }
};
</script>

<style lang="scss">
.uploader-disabled {
  .el-upload--text:first-child {
    display: none;
  }
  .el-upload--picture:first-child {
    display: none;
  }
  .el-upload--picture-card:last-child {
    display: none;
  }
}
</style>
