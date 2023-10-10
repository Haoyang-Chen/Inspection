<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <basis-form
      ref="basisForm"
      labelWidth="145px"
      :type="type"
      :visible="visible"
    ></basis-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addWork, updateWork, apvWork } from "@/api/modules/ptw/work";
import BasisForm from "./basis-form";

export default {
  name: "WorkBasisDialog",
  components: { BasisForm },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    // 弹出层类型1-作业票申请,2-从票添加,3-作业票评估审批
    type: {
      type: Number,
      default: 1
    },
    // 弹出层宽度
    width: {
      type: String,
      default: "820px"
    }
  },
  data() {
    return {
      // 作业票id
      workId: undefined,
      // 是否显示弹出层-内部
      visible: this.value
    };
  },
  computed: {
    // 弹出层标题
    title() {
      if (!this.workId) {
        if (this.type === 2) return "从票添加";
        else if (this.type === 3) return "作业票评估审批";
        else return "作业票添加";
      } else {
        if (this.type === 2) return "从票修改";
        else if (this.type === 3) return "作业票评估审批";
        else return "作业票修改";
      }
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
    setup(workId = undefined, parentId = undefined) {
      this.workId = workId || undefined;
      this.$nextTick(() => {
        this.$refs.basisForm.setup(workId, parentId);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs.basisForm
        .validate()
        .then(data => {
          console.log('data', data)
          let opFunc;
          if (this.type !== 3)
            opFunc = this.formRequest(addWork, updateWork, data);
          else
            opFunc = apvWork({
              ticketInfo: data,
              result: data.result,
              backReason: data.backReason
            });
          return opFunc;
        })
        .then(response => {
          this.$emit("submitSuccess", response);
          if (this.type === 3) this.msgSuccess("评估审批成功");
          this.visible = false;
        })
        .catch(function() {});
    },
    // 取消按钮
    cancel() {
      this.$emit("submitCancel");
      this.visible = false;
    }
  }
};
</script>
