<template>
  <el-form ref="form" :model="form" :label-width="labelWidth">
    <el-row>
      <el-col
        v-for="(item, index) in form.diyAttributeList"
        :key="index"
        :span="24"
      >
        <el-form-item
          :label="item.label"
          :prop="'diyAttributeList.' + index + '.content'"
          :rules="[
            {
              required: item.required,
              validator: validateDynamic,
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-if="item.component === 'string'"
            v-model="item.content"
            :placeholder="editable ? item.placeholder : ''"
            :disabled="!editable"
          />
          <el-input
            v-else-if="item.component === 'text'"
            v-model="item.content"
            :placeholder="editable ? item.placeholder : ''"
            :disabled="!editable"
            type="textarea"
          />
          <el-select
            v-else-if="item.component === 'select'"
            v-model="item.content"
            :multiple="item.multiple"
            :placeholder="editable ? item.placeholder : ''"
            :collapse-tags="editable"
            :disabled="!editable"
            clearable
          >
            <el-option
              v-for="option in item.options"
              :key="option.label"
              :label="option.label"
              :value="option.label"
            ></el-option>
          </el-select>
          <uploader
            v-else-if="item.component === 'file'"
            :ref="'uploader' + index"
            :editable="editable"
            accept=""
            listType="text"
            @uploadCompletion="handleUploadCompletion($event, index)"
          ></uploader>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import Uploader from "@/components/Uploader";

export default {
  name: "BasisDynamicForm",
  components: { Uploader },
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
        diyAttributeList: []
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
    setup(data) {
      this.reset();
      if (data) {
        const parseData = JSON.parse(JSON.stringify(data));
        this.form.diyAttributeList = parseData.diyAttributeList || [];
        this.setupUploader();
      }
    },
    setupUploader(clear = false) {
      const dynamicList = this.form.diyAttributeList;
      this.$nextTick(() => {
        dynamicList.forEach((item, index) => {
          if (item.component === "file")
            this.$refs["uploader" + index][0].setup(!clear ? item.content : []);
        });
      });
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList, index) {
      this.form.diyAttributeList[index].content = fileList;
    },
    /** 验证表单 */
    validateDynamic(rule, value, callback) {
      const index = Number(rule.field.split(".")[1]);
      const item = this.form.diyAttributeList[index];
      const required = item.required;
      if (required && (!value || !value.length)) {
        return callback(new Error(item.label + "不能为空"));
      }
      callback();
    },
    validate() {
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
        diyAttributeList: []
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
