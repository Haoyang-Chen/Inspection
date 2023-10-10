<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <finish-form
      ref="finishForm"
      labelWidth="145px"
      :type="type"
      :visible="visible"
    ></finish-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { eapvWork, endWork } from "@/api/modules/ptw/work";
import FinishForm from "./finish-form";

export default {
  name: "FinishDialog",
  components: { FinishForm },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    // 弹出层类型1-作业票完工申请,2-作业票完工审批,3-展示详情
    type: {
      type: Number,
      default: 1
    },
    width: {
      type: String,
      default: "900px"
    }
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value
    };
  },
  computed: {
    // 标题
    title() {
      return this.type === 1 ? "作业票完工申请" : "作业票完工审批";
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
    setup(workId) {
      this.$nextTick(() => {
        this.$refs.finishForm.setup(workId);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.type === 1 || this.type === 2)
        this.$refs.finishForm
          .validate()
          .then(data => {
            const opFunc = this.type === 1 ? eapvWork : endWork;
            opFunc(data).then(response => {
              this.$emit("submitSuccess", data);
              const msg = this.title.replace("作业票", "") + "成功";
              this.msgSuccess(msg);
              this.visible = false;
            });
          })
          .catch(function() {});
      else this.visible = false;
    },
    // 取消按钮
    cancel() {
      this.$emit("submitCancel");
      this.visible = false;
    }
  }
};
</script>
