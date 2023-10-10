<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="是否发起：" prop="ifStart">
            <el-select
              v-model="form.ifStart"
              placeholder="请选择是否发起"
              :disabled="!editable"
              clearable
            >
              <el-option v-for="item in startOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故名称：" prop="name">
            <el-input v-model="form.name" placeholder="请输入事故名称" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故部门：" prop="dept">
            <el-input v-model="form.dept" placeholder="请输入事故部门" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生地点：" prop="place">
            <el-input v-model="form.place" :placeholder="editable ? '请输入发生地点' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生时间：" prop="happenDate">
            <el-date-picker
              v-model="form.happenDate"
              :disabled="!editable"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="事故原因：" prop="reason">
            <el-select v-model="form.reason" placeholder="请选择事故原因" :disabled="!editable" style="width:100%">
              <el-option v-for="item in accidentReasonOptions" :key="item.label" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上报人：" prop="upUser">
            <el-input v-model="form.upUser" :placeholder="editable ? '请输入上报人' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="事故原因分析：" prop="analysis">
            <el-input v-model="form.analysis" type="textarea" :rows="3" :placeholder="editable ? '请输入事故原因分析' : ''" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="事故描述：" prop="description">
            <el-input v-model="form.description" :placeholder="editable ? '请输入事故描述' : ''" type="textarea" :rows="3" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="快报附件：" prop="fileList">
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
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editable" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">{{ editable ? "取 消" : "关 闭" }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addNews, updateNews } from "@/api/modules/process/accident/news";
import Uploader from "@/components/Uploader";

export default {
  name: "ChangeForm",
  components: { Uploader },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "900px"
    },
    // 弹出层标题
    title: {
      type: String,
      default: "添加"
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value,
      // 表单参数
      form: this.initForm(),
      rules: {
        ifStart: [
          { required: true, message: '是否发起不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '事故名称不能为空', trigger: 'blur' }
        ],
        dept: [
          { required: true, message: '事故部门不能为空', trigger: 'blur' }
        ],
        happenDate: [
          { required: true, message: '发生时间不能为空', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '事故原因不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 是否发起 */
    startOptions() {
      return [
        { label: '否', value: 0 },
        { label: '是', value: 1 }
      ]
    },
    /** 事故原因数据字典 */
    accidentReasonOptions() {
      return this.$store.state.common.accidentReasons;
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
      this.form = JSON.parse(JSON.stringify(params));
      this.setupUploader(this.form.fileList);
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    //文件上传回调
    handleUploadCompletion(fileList) {
      this.form.fileList = fileList;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let opFunc;
          opFunc = this.form.id ? updateNews : addNews;
          opFunc(this.form).then(response => {
            this.msgSuccess(this.form.id ? "修改成功" : "新增成功");
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
      this.setupUploader();
    },
    initForm() {
      return {
        id: undefined,
        ifStart: undefined,
        name: undefined,
        name: undefined,
        dept: undefined,
        happenDate: undefined,
        reason: undefined,
        place: undefined,
        upUser: undefined,
        analysis: undefined,
        description: undefined,
        fileList: []
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