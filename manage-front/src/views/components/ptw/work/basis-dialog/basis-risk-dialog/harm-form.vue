<template>
  <el-form ref="form" :model="form" :label-width="labelWidth">
    <el-row>
      <el-col :span="24">
        <el-form-item label="危害辨识:" prop="harmList">
          <el-checkbox-group v-model="form.harmList" :disabled="!editable">
            <el-checkbox
              v-for="(item, index) in harmOptions"
              :key="index"
              :label="item.label"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: "HarmForm",
  components: {},
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
      // 表单参数
      form: {
        harmList: []
      }
    };
  },
  computed: {
    // 危害辨识数据字典
    harmOptions() {
      return this.$store.state.common.dangerHarms;
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
    setup(harmList) {
      this.reset();
      if (harmList && harmList.length) {
        const parseData = JSON.parse(JSON.stringify(harmList));
        this.form.harmList = harmList;
      }
    },
    /** 验证表单 */
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            const parseData = JSON.parse(JSON.stringify(this.form.harmList));
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
        harmList: []
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
