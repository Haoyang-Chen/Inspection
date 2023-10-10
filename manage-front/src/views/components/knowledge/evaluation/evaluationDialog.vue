<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="150px" class="demo-form">
      <el-row :gutter="24">
        <el-col :span="12" v-if="form.createTime">
          <el-form-item label="评价时间：" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              :disabled="!editable"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="评价时间"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评价人：" prop="createBy">
            <el-input v-model="form.createBy" placeholder="请输入评价人" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否存在不符合性：" prop="isConformity">
            <el-radio-group
              v-model="form.isConformity"
              :disabled="!editable"
            >
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <template v-if="form.isConformity === 0">
          <el-col :span="24">
            <el-form-item label="原因分析：" prop="reason">
              <el-input v-model="form.reason" type="textarea" :rows="3" placeholder="请输入原因分析" :disabled="!editable"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划整改时间：" prop="rectifyTime">
              <el-date-picker
                v-model="form.rectifyTime"
                :disabled="!editable"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="计划整改时间"
                style="width:100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="整改措施：" prop="rectifyMeasure">
              <el-input v-model="form.rectifyMeasure" placeholder="请输入整改措施" :disabled="!editable"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传附件：" prop="filesList">
              <Uploader
                ref="uploader"
                listType="text"
                accept="*"
                :multiple="false"
                :limit="9"
                :editable="editable"
                @uploadCompletion="handleUploadCompletion"
              ></Uploader>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editable" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">{{ editable ? '取 消':'关 闭' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Uploader from "@/components/Uploader";
import { infoComment, saveComment, updateComment } from "@/api/modules/knowledge/evaluation";

export default {
  name: "LawDialog",
  components: { Uploader },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "800px"
    },
    // 弹出层标题
    title: {
      type: String,
      default: "符合性评价"
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    },
    // 知识库类型 0法律法规，1标准规范，2安全文件
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value,
      // 表单参数
      form: this.initForm(),
      // 表单校验
      rules: {
        createBy: [
          { required: true, message: '评价人不能为空', trigger: 'blur' }
        ],
        isConformity: [
          { required: true, message: '是否存在不符合性不能为空', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '原因分析不能为空', trigger: 'blur' }
        ],
        rectifyTime: [
          { required: true, message: '计划整改时间不能为空', trigger: 'blur' }
        ],
        rectifyMeasure: [
          { required: true, message: '整改措施不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    /** 法律效力位阶数据字典 */
    lawsTypeOptions() {
      return this.$store.state.common.lawTypes
    },
    /** 时效性数据字典 */
    lawStatusOptions() {
      return this.$store.state.common.lawStatus
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.reset();
      }
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  methods: {
    /** 重置 */
    setup(params) {
      if (params.relationId) {
        infoComment(params.id).then(response => {
          this.form = response.result;
          if (this.form.filesList) this.setupUploader(this.form.filesList);
        })
      } else {
        this.form.relationId = params.id;
        this.form.type = this.type;
      }
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    /** 文件上传回调 */
    handleUploadCompletion(fileList) {
      this.form.filesList = fileList;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let opFunc;
          opFunc = this.form.id ? updateComment : saveComment;
          opFunc(this.form).then(response => {
            this.msgSuccess(this.form.id ? "修改成功" : "评价成功");
            this.visible = false;
            this.$emit("submitSuccess");
          })
        } else {
          return false;
        }
      });
    },
    // 取消按钮
    cancel() {
      this.visible = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = this.initForm();
      this.resetForm("form");
      if (this.form.filesList) this.setupUploader();
    },
    initForm() {
      return {
        id: undefined,
        type: undefined,
        relationId: undefined,
        createTime: undefined,
        isConformity: undefined, // 是否存在不符合：0是 1否
        reason: undefined,
        rectifyTime: undefined,
        rectifyMeasure: undefined,
        filesList: undefined
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .tipsFont .el-input__inner{
  color:red
}
</style>