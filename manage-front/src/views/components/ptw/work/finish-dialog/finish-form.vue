<template>
  <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
    <el-row>
      <el-col :span="24">
        <el-form-item label="完工确认:">
          <el-row v-for="(item, index) in form.finishApplyList" :key="index">
            <el-col :span="20">
              <el-row>
                <el-col :span="1">
                  <span class="number-index number-index-fix">
                    {{ index + 1 }}
                  </span>
                </el-col>
                <el-col :span="23">
                  <span class="number-text">
                    {{ item.title }}
                  </span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :offset="1" :span="23">
                  <el-form-item label="现场照片上传:" label-width="105px">
                    <uploader
                      :ref="'uploader' + index"
                      :editable="type === 1"
                      @uploadCompletion="handleUploadCompletion($event, index)"
                    ></uploader>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="4" class="number-result">
              <el-form-item
                :prop="'finishApplyList.' + index + '.result'"
                :rules="[
                  {
                    required: true,
                    message: '请确认',
                    trigger: 'blur'
                  }
                ]"
                label-width="0"
              >
                <el-radio
                  v-model="item.result"
                  :label="1"
                  :disabled="type !== 1"
                  >确认</el-radio
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col v-if="type === 1" :span="24">
        <basis-process-form
          ref="basisProcessForm"
          :type="5"
          :labelWidth="labelWidth"
          :processable="false"
          :visible="visible"
        >
        </basis-process-form>
      </el-col>
      <el-col v-else-if="type === 2" :span="24">
        <el-form-item label="完工申请人:">
          {{ form.applyUser }}
        </el-form-item>
      </el-col>
      <template v-else>
        <el-col :span="24">
          <el-form-item label="完工申请人:">
            {{ form.applyUser }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="完工审批人:">
            {{ form.approveUser }}
          </el-form-item>
        </el-col>
      </template>
      <template v-if="!eliminate && type === 2">
        <el-col :span="24">
          <el-form-item label="审批结果:" prop="result">
            <el-radio-group
              v-model="form.result"
              :disabled="type !== 2"
              @change="handleResultChange"
            >
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="0">退回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="!form.result" :span="24">
          <el-form-item label="退回理由:" prop="backReason">
            <el-input
              v-model="form.backReason"
              :disabled="type !== 2"
              type="textarea"
              placeholder="请输入退回理由"
            />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script>
import { getEnd } from "@/api/modules/ptw/work";
import Uploader from "@/components/Uploader";
import BasisProcessForm from "../basis-dialog/basis-process-form";

export default {
  name: "FinishForm",
  components: { Uploader, BasisProcessForm },
  props: {
    // 弹出层类型1-作业票完工申请,2-作业票完工审批,3-展示详情
    type: {
      type: Number,
      default: 1
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
        finishApplyList: [],
        taskNodeModelList: [],
        applyUser: undefined,
        approveUser: undefined,
        result: 1,
        backReason: undefined
      },
      // 表单验证
      rules: {
        backReason: [
          { required: true, message: "退回理由不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  watch: {
    visible(val) {
      if (!val) {
        this.clearValidate();
        this.setupUploader(true);
      }
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
      getEnd(this.type, id).then(response => {
        const result = response.result;
        let finishApplyList;
        if (result) finishApplyList = result.finishApplyList || [];
        else finishApplyList = [];
        finishApplyList.forEach(item => {
          item.result = this.type === 1 ? undefined : 1;
        });
        this.form = { ...this.form, ...result, finishApplyList };
        this.setupUploader();
        if (this.type === 1) {
          this.$nextTick(() => {
            this.$refs.basisProcessForm.setup(this.form);
          });
        }
      });
    },
    setupUploader(clear = false) {
      const finishList = this.form.finishApplyList;
      this.$nextTick(() => {
        finishList.forEach((item, index) => {
          this.$refs["uploader" + index][0].setup(!clear ? item.photoList : []);
        });
      });
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList, index) {
      this.form.finishApplyList[index].photoList = fileList;
    },
    /** 结果切换 */
    handleResultChange(value) {
      if (value) this.form.backReason = undefined;
    },
    /** 验证表单 */
    validate() {
      const validList = [];
      const basisValid = this.validateBasis();
      validList.push(basisValid);
      if (this.type === 1) {
        validList.push(this.$refs.basisProcessForm.validate());
      }

      return new Promise((resolve, reject) => {
        Promise.all(validList)
          .then(([basis, process]) => {
            let data = {
              ticketId: basis.ticketId
            };
            if (this.type === 1) {
              data.finishApplyList = basis.finishApplyList;
              data.taskNodeModelList = process.taskNodeModelList;
            } else if (this.type === 2) {
              data.result = basis.result;
              data.backReason = basis.backReason;
            }
            resolve(data);
          })
          .catch(_ => {
            reject();
          });
      });
    },
    validateBasis() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const parseData = JSON.parse(JSON.stringify(this.form));
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
        ticketId: undefined,
        finishApplyList: [],
        taskNodeModelList: [],
        applyUser: undefined,
        approveUser: undefined,
        result: 1,
        backReason: undefined
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
</style>
