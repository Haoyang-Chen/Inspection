<template>
  <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
    <el-row>
      <template v-if="fromRisk">
        <!-- <el-col v-if="form.id && editable" :span="24">
          <el-form-item label="构成隐患:" prop="examStatus">
            <el-radio-group v-model="form.examStatus">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="检查日期:" prop="checkDate">
            <el-date-picker
              v-model="form.checkDate"
              :disabled="!editable"
              type="date"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              placeholder="请选择检查日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="隐患描述:" prop="description">
            <el-input
              v-model="form.description"
              :disabled="!editable"
              placeholder="请输入隐患描述"
              style="width:80%"
            />
            <el-button
              :disabled="!editable"
              type="primary"
              icon="el-icon-search"
              style="margin-left:10px"
              @click="open = true"
            ></el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="隐患来源:" prop="source">
            <el-select
              v-model="form.source"
              :disabled="!editable"
              clearable
              placeholder="请选择隐患来源"
            >
              <el-option
                v-for="dict in sourceOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="检查人员:" prop="checkUserName">
            <el-input
              v-model="form.checkUserName"
              :disabled="!editable"
              placeholder="请输入检查人员"
              style="width:61.8%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="隐患地点:" prop="place">
            <el-input
              v-model="form.place"
              :disabled="!editable"
              :placeholder="editable ? '请输入隐患地点' : ''"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="隐患部位:" prop="position">
            <el-input
              v-model="form.position"
              :disabled="!editable"
              :placeholder="editable ? '请输入隐患部位' : ''"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="隐患大类:" prop="mainClass">
            <el-select
              v-model="form.mainClass"
              :disabled="!editable"
              :placeholder="editable ? '请选择隐患大类' : ''"
              clearable
              @change="form.subClass = ''"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="细分类别:" prop="subClass">
            <el-select
              v-model="form.subClass"
              :disabled="editable ? !form.mainClass : true"
              :placeholder="editable ? '请选择细分类别' : ''"
              clearable
            >
              <el-option
                v-for="dict in categoryOptions(form.mainClass)"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="隐患等级:" prop="level">
            <el-select
              v-model="form.level"
              :disabled="!editable"
              clearable
              placeholder="请选择隐患等级"
            >
              <el-option
                v-for="dict in levelOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
      <el-col v-if="!fromRisk" :span="24">
        <el-form-item
          label="存在问题:"
          prop="description"
          :rules="[
            {
              required: true,
              message: '存在问题不能为空',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="form.description"
            :disabled="!editable"
            :placeholder="editable ? '请输入存在问题' : ''"
            type="textarea"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="现场拍照:" prop="fileList">
          <uploader
            ref="uploader"
            :editable="editable"
            @uploadCompletion="handleUploadCompletion"
          ></uploader>
        </el-form-item>
      </el-col>
      <template v-if="fromRisk">
        <el-col :span="24">
          <el-form-item label="参考依据:" prop="reference">
            <el-input
              v-model="form.reference"
              :disabled="!editable"
              :placeholder="editable ? '请输入参考依据' : ''"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col v-if="!eliminate" :span="24">
          <el-form-item label="整改措施:" prop="rectification">
            <el-input
              v-model="form.rectification"
              :disabled="!editable"
              :placeholder="editable ? '请输入整改措施' : ''"
              type="textarea"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="整改责任部门:" prop="respDeptId">
            <treeselect
              v-model="form.respDeptId"
              :options="deptOptions"
              :normalizer="deptNormalizer"
              :show-count="true"
              :disable-branch-nodes="false"
              :clearable="true"
              :searchable="true"
              :disabled="!editable"
              :placeholder="editable ? '请选择整改责任部门' : ''"
              noResultsText="未找到结果..."
              clearAllText="清除"
              @select="selectRespDept"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="versionType === 2">
          <el-form-item label="整改责任人:" prop="reformUserId">
            <el-select
              v-model="form.reformUserId"
              :disabled="!editable"
              :placeholder="editable ? '请选择整改责任人' : ''"
              filterable
              clearable
            >
              <el-option
                v-for="item in userOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主要危害:" prop="harmList">
            <el-select
              v-model="form.harmList"
              :disabled="!editable"
              :collapse-tags="editable"
              :placeholder="editable ? '请选择主要危害' : ''"
              clearable
              multiple
            >
              <el-option
                v-for="dict in harmOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <!-- 隐患库对话框 -->
    <trouble-library
      v-model="open"
      @didSelectRow="handleLibrarySelect"
    ></trouble-library>
  </el-form>
</template>

<script>
import { treeDept } from "@/api/modules/sys/dept";
import { getTrouble, getSetting } from "@/api/modules/investigate/trouble";
import Uploader from "@/components/Uploader";
import TroubleLibrary from "./library";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listDeptUser } from "@/api/modules/sys/user";

export default {
  name: "TroubleRegisterForm",
  components: { Uploader, TroubleLibrary, Treeselect },
  props: {
    // 表单参数
    value: {
      type: Object
    },
    // 调用入口 false-隐患排查/检查管理,true-隐患排查/隐患管理
    fromRisk: {
      type: Boolean,
      default: false
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
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
      // 部门树数据
      deptOptions: [],
      // 自定义部门树节点key
      deptNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children
        };
      },
      // 是否显示弹出层
      open: false,
      // 人员数据
      userOptions: [],
      // 版本类型
      versionType: 1,
      // 表单参数-内部
      form: this.value || {
        id: undefined,
        // examStatus: undefined,
        checkDate: undefined,
        description: undefined,
        source: undefined,
        checkUserName: undefined,
        place: "",
        position: "",
        mainClass: "",
        subClass: "",
        level: undefined,
        fileList: [],
        reference: "",
        rectification: "",
        respDeptId: undefined,
        harmList: [],
        reformUserId: undefined
      },
      // 表单校验
      rules: {
        checkDate: [
          { required: true, message: "排查日期不能为空", trigger: "blur" }
        ],
        description: [
          { required: true, message: "隐患描述不能为空", trigger: "blur" }
        ],
        source: [
          { required: true, message: "隐患来源不能为空", trigger: "blur" }
        ],
        checkUserName: [
          { required: true, message: "检查人员不能为空", trigger: "blur" }
        ],
        level: [
          { required: true, message: "隐患等级不能为空", trigger: "blur" }
        ],
        respDeptId: [
          { required: true, message: "整改责任部门不能为空", trigger: "blur" }
        ],
        reformUserId: [
          { required: true, message: "整改责任人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    /** 隐患来源 */
    sourceOptions() {
      return this.$store.state.common.dangerSources;
    },
    accountName() {
      return this.$store.getters.name;
    },
    /** 隐患大类 */
    typeOptions() {
      return this.$store.state.common.dangerTypes;
    },
    /** 细分类别 */
    categoryOptions() {
      return function(value) {
        return value === "现场管理类"
          ? this.$store.state.common.sceneCategorys
          : this.$store.state.common.basisCategorys;
      };
    },
    /** 隐患等级 */
    levelOptions() {
      return this.$store.state.common.dangerLevels;
    },
    /** 主要危害 */
    harmOptions() {
      return this.$store.state.common.dangerHarms;
    }
  },
  watch: {
    value(val) {
      this.form = val;
    },
    form(val) {
      this.$emit("input", val);
    },
    visible(val) {
      if (!val) this.clearValidate();
    }
  },
  created() {
    this.getDeptTree();
    this.getTroubleSet();
  },
  methods: {
    /** 查询部门树 */
    getDeptTree() {
      treeDept({ withoutTeam: 1 }).then(response => {
        this.deptOptions = this.formatTree(response.result);
      });
    },
    /** 重置相关值 */
    setup(troubleId = undefined, temporary = undefined) {
      this.reset();
      this.form.id = troubleId;
      if (troubleId) {
        this.getData(troubleId);
      } else {
        if (temporary) {
          this.form = { ...temporary };
          this.setupUploader(this.form.fileList);
        } else {
          this.form.checkDate = this.parseTime(Date.now(), "{y}-{m}-{d}");
          this.form.checkUserName = this.accountName;
        }
      }
    },
    /** 查询当前隐患版本 1 正常流程 2 简易流程 */
    getTroubleSet() {
      getSetting().then(response => {
        this.versionType = response.result;
      })
    },
    getData(id) {
      getTrouble(id).then(response => {
        const result = response.result;
        result.respDeptId = result.respDeptId !== 0 ? result.respDeptId : undefined;
        this.form = { ...result };
        this.setupUploader(this.form.fileList);
        this.getUserList(this.form.respDeptId);
      });
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    /** 选择整改责任部门 */
    selectRespDept(node) {
      if (this.versionType === 2) {
        const deptId = node.deptId;
        if (deptId) this.getUserList(deptId);
        else this.userOptions = [];
      }
    },
    /** 查询人员列表 */
    getUserList(deptId) {
      if (!deptId) {
        this.userOptions = [];
        return;
      }
      listDeptUser(deptId, 1)
        .then(response => {
          const result = response.result.list;
          if (result && result.length) {
            this.userOptions = result.map(item => {
              return { value: item.userId, label: item.name };
            });
          } else {
            this.userOptions = [];
          }
        })
        .catch(_ => {
          this.userOptions = [];
        });
    },
    /** 表单重置操作 */
    reset() {
      this.form = {
        id: undefined,
        // examStatus: undefined,
        checkDate: undefined,
        description: undefined,
        source: undefined,
        checkUserName: undefined,
        place: "",
        position: "",
        mainClass: "",
        subClass: "",
        level: undefined,
        fileList: [],
        reference: "",
        rectification: "",
        respDeptId: undefined,
        harmList: []
      };
      this.resetForm("form");
    },
    /** 隐患库选中回调 */
    handleLibrarySelect(data) {
      this.form.description = data.description || undefined;
      this.form.mainClass = data.mainClass || "";
      this.form.subClass = data.subClass || "";
      this.form.level = data.level || undefined;
      this.form.reference = data.reference || "";
      this.form.rectification = data.rectification || "";
      this.form.harmList = data.harmList || [];
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList) {
      this.form.fileList = [...fileList];
    },
    /** 现场拍照验证 */
    validatePhotos(rule, value, callback) {
      if (!this.form.fileList || !this.form.fileList.length) {
        return callback(new Error("现场拍照不能为空"));
      }
      callback();
    },
    /** 验证表单 */
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
      this.setupUploader();
    }
  }
};
</script>

<style lang="scss">
.dept-user-picker {
  .vue-treeselect__single-value {
    color: #606266;
  }
  .vue-treeselect--disabled .vue-treeselect__single-value {
    color: #c0c4cc;
  }
}
</style>
