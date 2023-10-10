<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    >
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-form">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="类型：" prop="type">
            <el-radio-group v-model="form.type">
              <el-radio v-for="item in hazardSourceType" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="风险点名称：" prop="name">
            <el-input v-model="form.name" placeholder="请选择风险点名称" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="所在区域：" prop="areaId">
            <el-select
              v-model="form.areaId"
              placeholder="请选择所在区域"
              clearable
              :filterable="true"
              style="width: 100%"
              @change="areaSelect"
            >
              <el-option
                v-for="dict in areaList"
                :key="dict.id"
                :label="dict.area"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="责任部门:" prop="respDeptId">
            <treeselect
              v-model="form.respDeptId"
              :options="deptOptions"
              :normalizer="deptNormalizer"
              :show-count="true"
              :disable-branch-nodes="false"
              :clearable="false"
              :searchable="true"
              noResultsText="未找到结果..."
              placeholder="请选择部门"
              clearAllText="清除"
              :disabled="!editable"
              @select="deptSelect"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="可能造成的事故类型：" prop="accidentList">
            <el-checkbox-group v-model="form.accidentList">
              <el-checkbox v-for="(dict, index) in harmOptions" :label="dict.label" :key="index">{{ dict.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="主要作业活动：" prop="mainJob">
            <el-input v-model="form.mainJob" type="textarea" rows="3" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="备注：" prop="memo">
            <el-input v-model="form.memo" type="textarea" rows="3" :disabled="!editable"></el-input>
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
import { treeDept } from "@/api/modules/sys/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { add, update } from "@/api/modules/risk/hazardSource";
import { listArea } from "@/api/modules/risk/area";

export default {
  components: { 
    Treeselect
  },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "新增"
    },
    // 是否可编辑
    editable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否显示弹出层
      visible: false,
      // 表单参数
      form: this.initFormData(),
      // 部门数据字典
      deptOptions: [],
      // 自定义部门树节点key
      deptNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children
        };
      },
      // 区域列表
      areaList: [],
      rules: {
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '风险点名称不能为空', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '所在区域不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.form = this.initFormData();
        this.getDeptTree();
        this.getAreaList();
      }
    },
    visible(val) {
      this.$emit("input", val);
      if (!val) this.clearValidate();
    }
  },
  computed: {
    /** 风险源类型 */
    hazardSourceType() {
      return this.$store.state.common.hazardSourceType;
    },
    // 危害辨识数据字典
    harmOptions() {
      return this.$store.state.common.dangerHarms;
    }
  },
  created() {},
  methods: {
    setup(data) {
      this.form = data;
      this.form.accidentList = data.accidentList ? data.accidentList : [];
    },
    /** 查询区域列表 */
    getAreaList() {
      listArea(this.queryParams).then(response => {
        const result = response.result;
        this.areaList = result.list ? result.list : [];
      });
    },
    /** 选择区域 */
    areaSelect(val) {
      this.form.areaName = this.areaList.find(item => item.id === val).area;
    },
    /** 查询当前用户部门树 */
    getDeptTree() {
      let pm = { withoutTeam: 1 };
      if (this.$store.state.user.ifAdmin !==1) {
        pm.parentDeptId = this.$store.state.user.deptId
      }
      treeDept(pm).then(response => {
        this.deptOptions = this.formatTree(response.result);
      });
    },
    /** 部门选择 */
    deptSelect(node, instanceId) {
      if (this.form.respDeptId !== node.deptId) {
        this.form.respDeptId = node.deptId;
        this.form.respDeptName = node.name;
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let func = this.form.id ? update : add;
          func(this.form).then(res =>{
            this.visible = false;
            this.msgSuccess(this.form.id ? "编辑成功" : "新增成功");
            this.$emit("submitSuccess");
          })
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
      this.form = this.initFormData();
      this.resetForm("form");
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
    },
    initFormData() {
      return {
        type: undefined,
        name: undefined,
        areaId: undefined,
        areaName: undefined,
        respDeptId: undefined,
        respDeptName: undefined,
        accidentList: [],
        mainJob: undefined,
        memo: undefined
      }
    }
  }
}
</script>
