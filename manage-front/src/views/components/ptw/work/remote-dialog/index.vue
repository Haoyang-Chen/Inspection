<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <remote-form
      ref="remoteForm"
      labelWidth="145px"
      :visible="visible"
    ></remote-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { rsiWork } from "@/api/modules/ptw/work";
import RemoteForm from "./remote-form";

export default {
  name: "RemoteDialog",
  components: { RemoteForm },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "900px"
    }
  },
  data() {
    return {
      // 标题
      title: "作业票远程签发",
      // 是否显示弹出层-内部
      visible: this.value
    };
  },
  computed: {},
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
        this.$refs.remoteForm.setup(workId);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs.remoteForm
        .validate()
        .then(data => {
          rsiWork(data).then(response => {
            this.$emit("submitSuccess", data);
            this.msgSuccess("远程签发成功");
            this.visible = false;
          });
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
