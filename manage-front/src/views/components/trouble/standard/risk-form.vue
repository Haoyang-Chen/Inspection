<template>
  <el-form ref="form" :model="form" :label-width="labelWidth">
    <el-row>
      <el-col :span="24">
        <el-form-item label="风险辨识:">
          <el-button
            v-if="editable && multiple"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            circle
            @click="handleIdentifyAdd"
          ></el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label-width="subLabelWidth" class="risk-container">
          <el-row v-for="(fItem, fIndex) in form.identifyList" :key="fIndex">
            <el-col v-if="multiple" :span="1">
              <span class="number-index">
                {{ fIndex + 1 }}
              </span>
            </el-col>
            <el-col :span="multiple ? 23 : 24">
              <el-row>
                <el-col :span="24">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item
                        label="风险因素:"
                        label-width="90px"
                        :prop="'identifyList.' + fIndex + '.factor'"
                        :rules="[
                          {
                            required: true,
                            message: '风险因素不能为空',
                            trigger: 'blur'
                          }
                        ]"
                      >
                        <el-input
                          v-model="fItem.factor"
                          :disabled="!editable"
                          placeholder="请输入风险因素"
                          style="width:80%"
                        ></el-input>
                        <el-button
                          v-if="editable && form.identifyList.length > 1"
                          type="danger"
                          icon="el-icon-minus"
                          size="mini"
                          circle
                          style="margin-left:10px"
                          @click="handleIdentifyDel(fIndex)"
                        ></el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item
                        label="安全措施:"
                        label-width="90px"
                        required
                      >
                        <el-row class="measure-container">
                          <el-col
                            v-for="(mItem, mIndex) in fItem.measuresList"
                            :key="mIndex"
                          >
                            <el-form-item
                              label-width="0"
                              :prop="
                                'identifyList.' +
                                  fIndex +
                                  '.measuresList.' +
                                  mIndex +
                                  '.measures'
                              "
                              :rules="[
                                {
                                  required: true,
                                  message: '安全措施不能为空',
                                  trigger: 'blur'
                                }
                              ]"
                            >
                              <el-input
                                v-model="mItem.measures"
                                :disabled="!editable"
                                placeholder="请输入安全措施"
                                v-bind:style="{
                                  width: pickerable ? '65%' : '80%'
                                }"
                              ></el-input>
                              <div
                                v-if="uploadable"
                                style="display:inline-block;margin-left:10px"
                              >
                                <template
                                  v-if="
                                    mItem.photoList && mItem.photoList.length
                                  "
                                >
                                  <el-button
                                    type="text"
                                    @click="
                                      editable
                                        ? showFiles(
                                            mItem.photoList,
                                            fIndex,
                                            mIndex
                                          )
                                        : showImages(
                                            'imageViewer' +
                                              '-' +
                                              fIndex +
                                              '-' +
                                              mIndex
                                          )
                                    "
                                    >已选:{{
                                      mItem.photoList.length
                                    }}张</el-button
                                  >
                                  <image-viewer
                                    v-if="!editable"
                                    :ref="
                                      'imageViewer' +
                                        '-' +
                                        fIndex +
                                        '-' +
                                        mIndex
                                    "
                                    :images="mItem.photoList"
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
                                    @uploadCompletion="
                                      handleUploadCompletion(
                                        $event,
                                        fIndex,
                                        mIndex
                                      )
                                    "
                                  ></uploader>
                                </template>
                              </div>
                              <el-button
                                v-if="editable"
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                circle
                                style="margin-left:10px"
                                @click="handleMeasureAdd(fIndex, mIndex)"
                              ></el-button>
                              <el-button
                                v-if="editable && fItem.measuresList.length > 1"
                                type="danger"
                                icon="el-icon-minus"
                                size="mini"
                                circle
                                @click="handleMeasureDel(fIndex, mIndex)"
                              ></el-button>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
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
  name: "RiskForm",
  components: { UploaderDialog, Uploader, ImageViewer },
  props: {
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    // 是否支持多条数据
    multiple: {
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
      default: "100px"
    },
    // 是否需要格式化
    formatRequired: {
      type: Boolean,
      default: false
    },
    // 是否能上传图片
    uploadable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 当前选中风险辨识index
      factorIndex: undefined,
      // 当前选中安全措施index
      measuresIndex: undefined,
      // 表单参数-内部
      form: {
        identifyList: [
          {
            factor: undefined,
            measuresList: [{ measures: undefined, photoList: [] }]
          }
        ]
      }
    };
  },
  computed: {
    subLabelWidth() {
      const diff = this.multiple ? 0 : 20;
      return Number(this.labelWidth.replace("px", "")) - 72 + diff + "px";
    },
    // 是否能上传图片-内部
    pickerable() {
      return this.editable ? this.uploadable : false;
    }
  },
  watch: {
    visible(val) {
      if (!val) this.clearValidate();
    }
  },
  created() {},
  methods: {
    /** 重置相关值 */
    setup(identifyList) {
      this.reset();
      if (identifyList && identifyList.length) {
        const parseData = JSON.parse(JSON.stringify(identifyList));
        this.form.identifyList = parseData.map(item => {
          let measuresList;
          if (!this.formatRequired)
            measuresList = item.measuresList.map(m => {
              return { measures: m };
            });
          else
            measuresList = item.measuresList.map(m => {
              return { measures: m.measures, photoList: m.photoList };
            });
          return {
            factor: item.factor,
            measuresList
          };
        });
      }
    },
    /** 表单重置操作 */
    reset() {
      this.form = {
        identifyList: [
          {
            factor: undefined,
            measuresList: [{ measures: undefined, photoList: [] }]
          }
        ]
      };
      this.resetForm("form");
    },
    /** 添加风险辨识按钮操作 */
    handleIdentifyAdd() {
      if (this.form.identifyList == undefined) {
        this.form.identifyList = [];
      }
      this.form.identifyList.push({
        factor: undefined,
        measuresList: [{ measures: undefined, photoList: [] }]
      });
    },
    /** 删除风险辨识按钮操作 */
    handleIdentifyDel(index) {
      this.$confirm("是否确认删除所选风险辨识？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.form.identifyList.splice(index, 1);
      });
    },
    /** 添加安全措施按钮操作 */
    handleMeasureAdd(fIndex, mIndex) {
      this.form.identifyList[fIndex].measuresList.splice(mIndex + 1, 0, {
        measures: undefined,
        photoList: []
      });
    },
    /** 删除安全措施按钮操作 */
    handleMeasureDel(fIndex, mIndex) {
      this.$confirm("是否确认删除所选安全措施？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.form.identifyList[fIndex].measuresList.splice(mIndex, 1);
      });
    },
    /** 非编辑模式-显示照片 */
    showImages(ref) {
      this.$refs[ref][0].show();
    },
    /** 编辑模式-显示、上传照片操作 */
    showFiles(fileList, fIndex, mIndex) {
      this.open = true;
      this.factorIndex = fIndex;
      this.measuresIndex = mIndex;
      this.$nextTick(() => {
        this.$refs.uploaderDialog.setup(fileList);
      });
    },
    handleFilesChange(fileList) {
      this.form.identifyList[this.factorIndex].measuresList[
        this.measuresIndex
      ].photoList = fileList;
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList, fIndex, mIndex) {
      this.form.identifyList[fIndex].measuresList[mIndex].photoList = fileList;
    },
    /** 验证表单 */
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const data = this.form.identifyList.map(item => {
              let measuresList;
              if (!this.formatRequired)
                measuresList = item.measuresList.map(m => m.measures);
              else
                measuresList = item.measuresList.map(m => {
                  return { measures: m.measures, photoList: m.photoList };
                });
              return {
                factor: item.factor,
                measuresList
              };
            });
            const parseData = JSON.parse(JSON.stringify(data));
            resolve(parseData);
          } else {
            reject();
          }
        });
      });
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
    }
  }
};
</script>

<style lang="scss" scoped>
.risk-container {
  .el-row {
    margin-bottom: 22px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.measure-container {
  .el-col {
    margin-bottom: 22px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
