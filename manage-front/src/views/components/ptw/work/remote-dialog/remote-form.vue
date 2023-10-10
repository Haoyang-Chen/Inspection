<template>
  <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
    <el-row>
      <!-- 现场固定检查项 -->
      <el-col :span="24">
        <el-form-item label="现场固定检查项:">
          <el-row v-for="(fixed, index) in form.fixeds" :key="index">
            <el-col :span="20">
              <el-row>
                <el-col :span="1">
                  <span class="number-index number-index-fix">
                    {{ index + 1 }}
                  </span>
                </el-col>
                <el-col :span="23">
                  <span class="number-text">
                    {{ fixed.item }}
                  </span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :offset="1" :span="23">
                  <span class="number-text">
                    现场图片:
                  </span>
                  <template v-if="fixed.photos && fixed.photos.length">
                    <image-viewer
                      :ref="'fxImageViewer' + index"
                      :images="fixed.photos"
                      style="display:inline-block"
                    ></image-viewer>
                    <el-button
                      class="number"
                      size="mini"
                      type="text"
                      @click="showImages('fxImageViewer' + index, false)"
                      >{{ fixed.photos.length }}</el-button
                    >
                  </template>
                  <span v-else>--</span>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4" class="number-result">
              <el-form-item
                :prop="'fixeds.' + index + '.result'"
                :rules="[
                  {
                    required: true,
                    message: '请确认',
                    trigger: 'blur'
                  }
                ]"
                label-width="0"
              >
                <el-radio v-model="fixed.result" :label="1" disabled
                  >确认</el-radio
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <!-- 现场确认 -->
      <el-col :span="24">
        <el-form-item label="现场确认:">
          <el-row v-for="(confirm, index) in form.confirms" :key="index">
            <el-col :span="20">
              <el-row>
                <el-col :span="1">
                  <span class="number-index number-index-fix">
                    {{ index + 1 }}
                  </span>
                </el-col>
                <el-col :span="23">
                  <span class="number-text">
                    {{ confirm.measures }}
                  </span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :offset="1" :span="23">
                  <span class="number-text">
                    现场图片:
                  </span>
                  <template v-if="confirm.photos && confirm.photos.length">
                    <image-viewer
                      :ref="'scImageViewer' + index"
                      :images="confirm.photos"
                      style="display:inline-block"
                    ></image-viewer>
                    <el-button
                      class="number"
                      size="mini"
                      type="text"
                      @click="showImages('scImageViewer' + index, false)"
                      >{{ confirm.photos.length }}</el-button
                    >
                  </template>
                  <span v-else>--</span>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4" class="number-result">
              <el-form-item
                :prop="'confirms.' + index + '.result'"
                :rules="[
                  {
                    required: true,
                    message: '请确认',
                    trigger: 'blur'
                  }
                ]"
                label-width="0"
              >
                <el-radio v-model="confirm.result" :label="1" disabled
                  >确认</el-radio
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <!-- 现场气体检测 -->
      <el-col v-if="form.SGinProcess" :span="24">
        <el-form-item label="现场气体检测:" prop="detects">
          <el-table
            v-loading="loading"
            :data="form.detects"
            style="margin-top:-11px"
          >
            <el-table-column label="序号" align="center" type="index" />
            <el-table-column
              label="检测时间"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ parseTime(scope.row.checkTime, "{y}-{m}-{d} {h}:{i}") }}
              </template>
            </el-table-column>
            <el-table-column
              label="可燃气体%LEL"
              align="center"
              prop="lel"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="有毒气体PPM"
              align="center"
              prop="ppm"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="氧气%"
              align="center"
              prop="oxygen"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="现场图片"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <template
                  v-if="scope.row.sceneImages && scope.row.sceneImages.length"
                >
                  <image-viewer
                    :ref="'tImageViewer' + scope.$index"
                    :images="scope.row.sceneImages"
                  ></image-viewer>
                  <el-button
                    class="number"
                    size="mini"
                    type="text"
                    @click="showImages('tImageViewer' + scope.$index, true)"
                    >{{ scope.row.sceneImages.length }}</el-button
                  >
                </template>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="检测人"
              align="center"
              prop="status"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span class="confirmer">{{ scope.row.checkUser }}</span>
                <template
                  v-if="scope.row.signImages && scope.row.signImages.length"
                >
                  <image-viewer
                    :ref="'tuImageViewer' + scope.$index"
                    :images="scope.row.signImages"
                  ></image-viewer>
                  <el-button
                    class="number"
                    size="mini"
                    type="text"
                    @click="showImages('tuImageViewer' + scope.$index, false)"
                    >签名</el-button
                  >
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-col>
      <!-- 安全培训交底 -->
      <el-col :span="24">
        <el-form-item label="安全培训交底:" class="training-container">
          <el-row v-for="(training, index) in form.trainings" :key="index">
            <el-col :span="20">
              <el-row>
                <el-col :span="1">
                  <span class="number-index number-index-fix">
                    {{ index + 1 }}
                  </span>
                </el-col>
                <el-col :span="23">
                  <span class="number-text">
                    {{ training.value }}
                  </span>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4" class="number-result">
              <el-form-item
                :prop="'trainings.' + index + '.result'"
                :rules="[
                  {
                    required: true,
                    message: '请确认',
                    trigger: 'blur'
                  }
                ]"
                label-width="0"
              >
                <el-radio v-model="training.result" :label="1" disabled
                  >确认</el-radio
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <!-- 现场拍照 -->
      <el-col :span="24">
        <el-form-item label="现场拍照:">
          <template v-if="form.photos && form.photos.length">
            <image-viewer
              ref="spImageViewer"
              :images="form.photos"
            ></image-viewer>
            <el-button
              class="number"
              size="mini"
              type="text"
              @click="showImages('spImageViewer')"
              >{{ form.photos.length }}</el-button
            >
          </template>
          <span v-else>--</span>
        </el-form-item>
      </el-col>
      <!-- 现场确认及交底人 -->
      <el-col :span="24">
        <el-form-item label="现场确认及交底人:">
          <span class="confirmer">{{ form.confirmer }}</span>
          <template v-if="form.confirmerSign && form.confirmerSign.length">
            <image-viewer
              ref="suImageViewer"
              :images="form.confirmerSign"
            ></image-viewer>
            <el-button
              class="number"
              size="mini"
              type="text"
              @click="showImages('suImageViewer')"
              >签名</el-button
            >
          </template>
        </el-form-item>
      </el-col>
      <!-- 远程签发人 -->
      <el-col v-if="form.remoter" :span="24">
        <el-form-item label="远程签发人:">
          <span class="confirmer">{{ form.remoter }}</span>
          <template v-if="form.remoterSign && form.remoterSign.length">
            <image-viewer
              ref="ruImageViewer"
              :images="form.remoterSign"
            ></image-viewer>
            <el-button
              class="number"
              size="mini"
              type="text"
              @click="showImages('ruImageViewer')"
              >签名</el-button
            >
          </template>
        </el-form-item>
      </el-col>
      <!-- 审批结果 -->
      <template v-if="!eliminate">
        <el-col :span="24">
          <el-form-item label="审批结果:" prop="result">
            <el-radio-group
              v-model="form.result"
              :disabled="!editable"
              @change="handleResultChange"
            >
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="!form.result" :span="24">
          <el-form-item label="关闭理由:" prop="reason">
            <el-input
              v-model="form.reason"
              :disabled="!editable"
              type="textarea"
              placeholder="请输入关闭理由"
            />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script>
import { getSC, getSG } from "@/api/modules/ptw/work";
import ImageViewer from "@/components/ImageViewer";

export default {
  name: "RemoteForm",
  components: { ImageViewer },
  props: {
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
      // 遮罩层
      loading: false,
      // 表单参数
      form: {
        ticketId: undefined,
        fixeds: [],
        confirms: [],
        SGinProcess: false,
        detects: [],
        trainings: [],
        photos: [],
        confirmer: undefined,
        confirmerSign: [],
        remoter: undefined,
        remoterSign: [],
        result: 1,
        reason: undefined
      },
      // 表单验证
      rules: {
        detects: [
          { required: true, message: "现场气体检测不能为空", trigger: "blur" }
        ],
        reason: [
          { required: true, message: "关闭理由不能为空", trigger: "blur" }
        ]
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
    setup(workId) {
      this.reset();
      this.form.ticketId = workId;
      this.getData(workId);
    },
    getData(id) {
      getSC(id).then(response => {
        const result = response.result;
        let fixeds = result.fixedItemList || [];
        fixeds = fixeds.map(m => {
          return { item: m.item, photos: m.photoList || [], result: 1 };
        });
        this.form.fixeds = fixeds;
        const confirms = [];
        result.factorList.forEach(f => {
          f.measuresList.forEach(m => {
            confirms.push(m);
          });
        });
        confirms.forEach(item => {
          item.photos = item.photoList || [];
          item.result = 1;
        });
        this.form.confirms = confirms;
        if (result.safetyTrainingList && result.safetyTrainingList.length)
          this.form.trainings = result.safetyTrainingList.map(item => {
            return { value: item, result: 1 };
          });
        else this.form.trainings = [];
        this.form.photos = result.xcqrPhotoList || [];
        this.form.confirmer = result.xcqrUser;
        this.form.confirmerSign = result.xcqrUserSign
          ? [result.xcqrUserSign]
          : [];
        this.form.remoter = result.ycqfUser;
        this.form.remoterSign = result.ycqfUserSign
          ? [result.ycqfUserSign]
          : [];
      });
      this.loading = true;
      getSG(id).then(response => {
        this.form.SGinProcess = response.needXcqtjc;
        const result = response.result || [];
        result.forEach(item => {
          var sceneImages = [];
          var signImages = [];
          if (item.photoList && item.photoList.length) {
            sceneImages = item.photoList;
          }
          if (item.checkUserSignPhoto) {
            signImages = [item.checkUserSignPhoto];
          }
          item.sceneImages = sceneImages;
          item.signImages = signImages;
        });
        this.form.detects = result;
        this.loading = false;
      });
    },
    /** 显示图片 */
    showImages(ref, single = true) {
      if (single) this.$refs[ref].show();
      else this.$refs[ref][0].show();
    },
    /** 结果切换 */
    handleResultChange(value) {
      if (value) this.form.reason = undefined;
    },
    /** 验证表单 */
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            resolve({
              ticketId: this.form.ticketId,
              result: this.form.result,
              reason: this.form.reason
            });
          } else {
            reject();
          }
        });
      });
    },
    /** 表单重置操作 */
    reset() {
      this.form = {
        ticketId: undefined,
        fixeds: [],
        confirms: [],
        SGinProcess: false,
        detects: [],
        trainings: [],
        photos: [],
        confirmer: undefined,
        confirmerSign: [],
        remoter: undefined,
        remoterSign: [],
        result: 1,
        reason: undefined
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
.number-index-fix {
  margin-top: 0;
  margin-left: 0;
  width: 20px;
  height: 20px;
  font-size: 12px;
}
.number-text {
  display: inline-block;
  padding-left: 5px;
  padding-right: 5px;
}
.training-container {
  .el-row {
    margin-bottom: 15px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.confirmer {
  display: inline-block;
  padding-right: 15px;
}
</style>
