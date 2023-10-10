<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    label-width="120px"
    size="small"
  >
    <el-form-item label="资质证书">
      <div
        class="flex justify-between items-start"
        v-for="(item, index) in ruleForm.specialCertificates"
        :key="index"
      >
        <div style="width: 600px">
          <el-row>
            <el-col :span="15">
              <el-form-item label="资质证书名称">
                <el-input
                  v-model="item.specialOperationType"
                  style="width: 220px"
                ></el-input>
              </el-form-item>
              <el-form-item label="有效期至">
                <el-date-picker
                  v-model="item.validUntil"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :editable="false"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="证书编号">
                <el-input
                  v-model="item.certificateCode"
                  style="width: 220px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="2">
              <el-form-item>
                <Uploader
                  :ref="index"
                  listType="text"
                  :multiple="false"
                  :limit="2"
                  :size="size"
                  @uploadCompletion="handleFileUploadList(index, $event)"
                ></Uploader>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="flex justify-between items-center">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd()"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-minus"
            @click="handleDelete(index)"
            v-if="ruleForm.specialCertificates && ruleForm.specialCertificates.length > 1"
          ></el-button>
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import Uploader from "@/components/Uploader";
export default {
  name:"CertificationsCBS",
  components: { Uploader },
  props: {
    ruleForm: {
      type: Object,
      default: {},
    },
    labelTitle:{
      type:String,
      default:""
    },
    labelTitle01:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      size: "small"
    };
  },
  methods: {
    reset(arr) {
      if (arr && arr.length > 0) {
        arr.forEach((item, index) => {
          this.$refs[index][0].setup();
        });
      }
      this.resetForm("ruleForm");
    },
    init(arr) {
      if (arr && arr.length > 0) {
        arr.forEach((item, index) => {
          if(item.fileUploadList?.length>0){
             this.$refs[index][0].setup(item.fileUploadList);
          }
        });
      }
    },
    handleFileUploadList(index, fileList) {
      this.ruleForm.specialCertificates[index].fileUploadList = fileList;
    },
    handleAdd() {
      let arr = {
        specialOperationType: undefined,
        validUntil: undefined,
        certificateCode: undefined,
        fileUploadList: [],
      };
      this.ruleForm.specialCertificates.push(arr);
    },
    handleDelete(index) {
      this.ruleForm.specialCertificates.splice(index, 1);
      this.init(this.ruleForm.specialCertificates); //重置图片
    },
  },
};
</script>
