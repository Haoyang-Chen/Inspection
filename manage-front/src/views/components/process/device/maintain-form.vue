<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-form">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="设备名称：" prop="deviceName">
            <el-select v-model="form.deviceName" placeholder="请选择设备名称" filterable :disabled="!editable" @change="changeDevice">
              <el-option v-for="item in deviceOptions" :key="item.id" :value="item.id">{{ item.name }}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="记录描述：" prop="description">
            <el-input v-model="form.description" placeholder="请输入记录描述" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用备件：" prop="sparePart">
            <el-input v-model="form.sparePart" placeholder="请输入使用备件" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="记录时间：" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              :disabled="!editable"
              type="datetime"
              placeholder="记录时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="记录人员：" prop="createUserName">
            <el-input v-model="form.createUserName" placeholder="请输入记录人员" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="现场照片：" prop="photoList">
            <uploader
              ref="uploader"
              :editable="editable"
              @uploadCompletion="handleUploadCompletion"
            ></uploader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="rowTitle">维护人员</div>
        </el-col>
        <el-col :span="24" v-if="form.maintainUserList.length > 0">
          <el-row :gutter="24" v-for="(item, index) in form.maintainUserList" :key="'user' + index">
            <el-col :span="10">
              <el-form-item label="维护人员：" :prop="'maintainUserList.' + index + '.first'" :rules="rules.first">
                <el-input v-model="item.first" placeholder="请输入维护人员" :disabled="!editable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="维护人员工号：" :prop="'maintainUserList.' + index + '.second'">
                <el-input v-model="item.second" placeholder="请输入维护人员工号" :disabled="!editable"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                circle
                @click="handleAdd()"
              ></el-button>
              <el-button
                v-if="form.maintainUserList.length > 1"
                type="danger"
                icon="el-icon-minus"
                size="mini"
                circle
                @click="handleDel(index)"
              ></el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="memo">
            <el-input v-model="form.memo" placeholder="请输入备注" type="textarea" :rows="3" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addMaintain, updateMaintain } from "@/api/modules/process/device/maintain";
import { deviceList } from "@/api/modules/process/device";
import Uploader from "@/components/Uploader";
import { getDateTime } from '@/utils';

export default {
  name: "MaintainForm",
  components: {
    Uploader
  },
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
      // 设备列表
      deviceOptions: [],
      rules: {
        deviceName: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '记录描述不能为空', trigger: 'blur' }
        ],
        createTime: [ 
          { required: true, message: '记录时间不能为空', trigger: 'blur' }
        ],
        first: [
          { required: true, message: '维护人员不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    /** 设备类型数据字典 */
    typeOptions() {
      return this.$store.state.common.deviceClass;
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.reset();
        this.getDeviceList();
      }
    },
    visible(val) {
      this.$emit("input", val);
      if (!val) this.clearValidate();
    }
  },
  created() {},
  methods: {
    /** 重置 */
    setup(params) {
      this.form = JSON.parse(JSON.stringify(params));
      this.setupUploader(this.form.photoList);
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    /** 获取设备列表 */
    getDeviceList() {
      deviceList({ page: 1, limit: 1000000 }).then(response => {
        const result = response.result;
        this.deviceOptions = result.list;
      });
    },
    /** 选择设备 */
    changeDevice(val) {
      var device = this.deviceOptions.find(item => item.id === val);
      this.form.deviceId = val;
      this.form.deviceName = device.name;
      this.form.deviceNumber = device.number;
    },
    /** 添加维护人员 */
    handleAdd() {
      var base = { first: undefined, second: undefined };
      this.form.maintainUserList.push(base);
    },
    /** 删除维护人员 */
    handleDel(index) {
      this.form.maintainUserList.splice(index, 1);
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList) {
      this.form.photoList = fileList;
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let opFunc;
          opFunc = this.form.id ? updateMaintain : addMaintain;
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
      this.setupUploader();
    },
    initForm() {
      return {
        id: undefined,
        deviceId: undefined,
        deviceName: undefined,
        deviceNumber: undefined,
        description: undefined,
        sparePart: undefined,
        createUserName: undefined,
        photoList: [],
        maintainUserList: [{
          first: undefined,
          second: undefined
        }],
        memo: undefined,
        createTime: getDateTime()
      }
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .tipsFont .el-input__inner{
  color:red
}
.el-icon-circle-plus {
  font-size: 26px;
  color: #1890ff;
  margin-right: 10px;
}
.el-icon-remove {
  font-size: 26px;
  color: red;
}
</style>