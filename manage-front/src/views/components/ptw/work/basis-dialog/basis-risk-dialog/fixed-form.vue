<template>
  <el-form ref="form" :model="form" :label-width="labelWidth">
    <el-row>
      <el-col :span="24">
        <el-form-item label="现场固定检查项:" prop="fixedList">
          <el-row class="fixed-container">
            <el-col
              v-for="(fixed, index) in form.fixedList"
              :key="index"
              :span="24"
            >
              <el-form-item
                label-width="0"
                :prop="'fixedList.' + index + '.item'"
              >
                <el-input
                  v-model="fixed.item"
                  disabled
                  style="width:67.5%"
                ></el-input>
                <div style="display:inline-block;margin-left:10px">
                  <template v-if="fixed.photoList && fixed.photoList.length">
                    <el-button
                      type="text"
                      @click="
                        editable
                          ? showFiles(fixed.photoList, index)
                          : showImages('imageViewer' + index)
                      "
                      >已选:{{ fixed.photoList.length }}张</el-button
                    >
                    <image-viewer
                      v-if="!editable"
                      :ref="'imageViewer' + index"
                      :images="fixed.photoList"
                      style="display:inline-block;"
                    ></image-viewer>
                  </template>
                  <template v-else>
                    <uploader
                      v-if="editable"
                      listType="text"
                      size="mini"
                      :showFileList="false"
                      style="display:inline-block;"
                      @uploadCompletion="handleUploadCompletion($event, index)"
                    ></uploader>
                  </template>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 文件上传对话框 -->
    <uploader-dialog
      ref="uploaderDialog"
      v-model="open"
      @change="handleFilesChange"
    ></uploader-dialog>
  </el-form>
</template>

<script>
import UploaderDialog from "@/components/Uploader/uploader-dialog";
import Uploader from "@/components/Uploader";
import ImageViewer from "@/components/ImageViewer";

export default {
  name: "FixedForm",
  components: { UploaderDialog, Uploader, ImageViewer },
  props: {
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
      // 是否显示弹出层
      open: false,
      // 当前选现场固定检查项index
      fixedIndex: undefined,
      // 表单参数
      form: {
        // 现场固定检查项表格数据
        fixedList: []
      }
    };
  },
  computed: {},
  watch: {
    visible(val) {
      if (!val) this.clearValidate();
    }
  },
  created() {},
  methods: {
    /** 重置相关值 */
    setup(fixedList) {
      this.reset();
      if (fixedList && fixedList.length) {
        const data = JSON.parse(JSON.stringify(fixedList));
        this.form.fixedList = data;
      }
    },
    /** 非编辑模式-显示照片 */
    showImages(ref) {
      this.$refs[ref][0].show();
    },
    /** 编辑模式-显示、上传照片操作 */
    showFiles(fileList, index) {
      this.open = true;
      this.fixedIndex = index;
      this.$nextTick(() => {
        this.$refs.uploaderDialog.setup(fileList);
      });
    },
    handleFilesChange(fileList) {
      this.form.fixedList[this.fixedIndex].photoList = fileList;
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList, index) {
      this.form.fixedList[index].photoList = fileList;
    },
    /** 验证表单 */
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const parseData = JSON.parse(JSON.stringify(this.form.fixedList));
            resolve(parseData);
          } else {
            reject();
          }
        });
      });
    },
    /** 表单重置操作 */
    reset() {
      this.form = {
        fixedList: []
      };
      // this.resetForm("form");
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
    }
  }
};
</script>

<style lang="scss" scoped>
.fixed-container {
  .el-col {
    margin-bottom: 22px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
