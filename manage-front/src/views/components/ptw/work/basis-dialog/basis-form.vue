<template>
  <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
    <el-row>
      <el-col
        v-if="
          !eliminate &&
            form.status === 2 &&
            form.pgspBackReason &&
            form.pgspBackReason.length
        "
        :span="24"
      >
        <el-form-item label="退回理由:" prop="pgspBackReason">
          <el-input v-model="form.pgspBackReason" disabled type="textarea" />
        </el-form-item>
        <el-divider />
      </el-col>
      <el-col :span="24">
        <basis-top-form
          ref="basisTopForm"
          :editable="editable"
          :isParent="type !== 2"
          :labelWidth="labelWidth"
          :visible="visible"
          @typeChange="handleTypeChange"
          @levelChange="handleLevelChange"
        ></basis-top-form>
      </el-col>
      <el-col :span="24">
        <basis-worker-form
          ref="basisWorkerForm"
          :editable="editable"
          :labelWidth="labelWidth"
          :blindable="blindable"
          :visible="visible"
        >
        </basis-worker-form>
      </el-col>
      <!-- <el-col :span="24">
        <el-form-item label="施工使用工具:" prop="tool">
          <el-input
            v-model="form.tool"
            :disabled="!editable"
            :placeholder="editable ? '请输入施工使用工具' : ''"
          />
        </el-form-item>
      </el-col> -->
      <el-col :span="24">
        <basis-dynamic-form
          ref="basisDynamicForm"
          :editable="editable"
          :labelWidth="labelWidth"
          :visible="visible"
        ></basis-dynamic-form>
      </el-col>
      <el-col v-if="!eliminate" :span="24">
        <basis-risk-form
          ref="basisRiskForm"
          :editable="editable"
          :labelWidth="labelWidth"
          :visible="visible"
        ></basis-risk-form>
      </el-col>
      <el-col :span="24">
        <el-form-item label="监护人选择:" prop="guarderList">
          <el-select
            v-model="form.guarderList"
            :disabled="!editable || type === 2"
            :collapse-tags="editable"
            :placeholder="editable ? '请输入搜索关键字' : ''"
            filterable
            multiple
            clearable
          >
            <el-option
              v-for="item in userOptions"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="eliminate" :span="24">
        <el-form-item label="作业申请人:">
          {{ form.createUserName }}
        </el-form-item>
      </el-col>
      <el-col v-if="!eliminate" :span="24">
        <basis-process-form
          ref="basisProcessForm"
          :editable="editable"
          :type="type"
          :isParent="type !== 2"
          :gasable="true"
          :labelWidth="labelWidth"
          :visible="visible"
        >
        </basis-process-form>
      </el-col>
      <template v-if="!eliminate && type === 3">
        <el-col :span="24">
          <el-form-item label="审批结果:" prop="result">
            <el-radio-group
              v-model="form.result"
              :disabled="!editable"
              @change="handleResultChange"
            >
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="0">退回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="!form.result" :span="24">
          <el-form-item label="退回理由:" prop="backReason">
            <el-input
              v-model="form.backReason"
              :disabled="!editable"
              type="textarea"
              placeholder="请输入退回理由"
            />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script>
import { getWork } from "@/api/modules/ptw/work";
import { listDynamic } from "@/api/modules/ptw/dynamic";
import { listRisk } from "@/api/modules/risk";
import { listFixed } from "@/api/modules/sys/fixed";
import { listUser } from "@/api/modules/sys/user";
import { getProcess } from "@/api/modules/ptw/process";
import BasisTopForm from "./basis-top-form";
import BasisWorkerForm from "./basis-worker-form";
import BasisDynamicForm from "./basis-dynamic-form";
import BasisRiskForm from "./basis-risk-form";
import BasisProcessForm from "./basis-process-form";

export default {
  name: "WorkBasisForm",
  components: {
    BasisTopForm,
    BasisWorkerForm,
    BasisDynamicForm,
    BasisRiskForm,
    BasisProcessForm
  },
  props: {
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
    // 弹出层类型1-作业票申请,2-从票添加,3-作业票评估审批
    type: {
      type: Number,
      default: 1
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
      // 人员数据字典
      userOptions: [],
      // 是否是盲板抽堵作业
      blindable: false,
      // 表单参数
      form: {
        id: undefined,
        parentId: undefined,
        tool: "",
        diyAttributeList: [],
        ticketRisk: {
          factorList: [],
          fixedItemList: [],
          harmList: []
        },
        guarderList: [],
        taskNodeModelList: [],
        result: 1,
        backReason: undefined
      },
      // 表单验证
      rules: {
        backReason: [
          { required: true, message: "退回理由不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    rateOptions() {
      return this.$store.state.common.gasCheckRates;
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
    setup(workId = undefined, parentId = undefined) {
      this.reset();
      this.getUserList();
      this.form.parentId = parentId || undefined;
      if (workId) this.getData(workId);
      else {
        if (parentId) this.getData(parentId, true);
        else this.setupForms();
      }
    },
    getData(id, parent = false) {
      getWork(id).then(response => {
        const result = response.result;
        this.form = { ...this.form, ...result };
        if (parent) {
          this.form.id = undefined;
          this.form.type = undefined;
          this.form.level = undefined;
          this.form.diyAttributeList = [];
          this.form.ticketRisk = {
            factorList: [],
            fixedItemList: [],
            harmList: []
          };
          this.form.taskNodeModelList = [];
        }
        this.setupForms();
        this.$emit("loadSuccess", result);
      });
    },
    setupForms() {
      this.$nextTick(() => {
        this.$refs.basisTopForm.setup(this.form);
        this.$refs.basisWorkerForm.setup(this.form);
        this.$refs.basisDynamicForm.setup(this.form);
        if (!this.eliminate) {
          this.$refs.basisRiskForm.setup(this.form);
          this.$refs.basisProcessForm.setup(this.form);
        }
      });
    },
    /** 查询动态表单列表 */
    getDynamicList(ticketType) {
      listDynamic(ticketType).then(response => {
        const result = response.result;
        if (
          result &&
          result.diyAttributeList &&
          result.diyAttributeList.length
        ) {
          this.form.diyAttributeList = result.diyAttributeList;
        } else {
          this.form.diyAttributeList = [];
        }
        this.$nextTick(() => {
          this.$refs.basisDynamicForm.setup(this.form);
        });
      });
    },
    /** 查询现场固定检查项列表 */
    getFixedList(ticketType) {
      listFixed({ ticketType, page: 1, limit: 1000000 }).then(response => {
        const result = response.result;
        const fixeds = result.list.map(item => {
          return {
            ...item,
            photoList: item.photoList || []
          };
        });
        this.form.ticketRisk.fixedItemList = fixeds || [];
        if (!this.eliminate)
          this.$nextTick(() => {
            this.$refs.basisRiskForm.setup(this.form);
          });
      });
    },
    /** 查询风险辨识列表 */
    getRiskList(ticketType) {
      listRisk({ ticketType, page: 1, limit: 1000000 }).then(response => {
        const result = response.result;
        const risks = result.list.map(item => {
          return {
            factor: item.factor,
            measuresList: item.measuresList.map(m => {
              return { measures: m };
            })
          };
        });
        this.form.ticketRisk.factorList = risks || [];
        if (!this.eliminate)
          this.$nextTick(() => {
            this.$refs.basisRiskForm.setup(this.form);
          });
      });
    },
    /** 查询人员列表 */
    getUserList() {
      listUser({ page: 1, limit: 1000000 }).then(response => {
        const result = response.result.list;
        if (result && result.length) {
          this.userOptions = result.map(item => {
            return { value: item.userId, label: item.name };
          });
        }
      });
    },
    /** 查询审批流程列表 */
    getProcessList() {
      if (!this.form.type) {
        this.form.taskNodeModelList = [];
        return;
      }
      if ([1, 3, 4].includes(this.form.type)) {
        if (this.form.level != null && this.form.level != undefined)
          this.getProcess();
        else this.form.taskNodeModelList = [];
      } else this.getProcess();
    },
    getProcess() {
      getProcess(this.form.type, this.form.level).then(response => {
        const result = response.result;
        this.form.taskNodeModelList = result || [];
        if (!this.eliminate)
          this.$nextTick(() => {
            this.$refs.basisProcessForm.setup(this.form);
          });
      });
    },
    /** 作业票种类切换 */
    handleTypeChange(value) {
      this.form.type = value;
      this.blindable = value === 8;
      if (value) {
        this.getDynamicList(value);
        this.getRiskList(value);
        this.getFixedList(value);
        this.getProcessList();
      } else {
        this.form.diyAttributeList = [];
        this.form.ticketRisk.factorList = [];
        this.form.ticketRisk.fixedItemList = [];
        this.form.taskNodeModelList = [];
        this.$nextTick(() => {
          this.$refs.basisDynamicForm.setup(this.form);
          if (!this.eliminate) {
            this.$refs.basisRiskForm.setup(this.form);
            this.$refs.basisProcessForm.setup(this.form);
          }
        });
      }
    },
    /** 作业级别切换 */
    handleLevelChange(value) {
      this.form.level = value;
      this.$emit("levelChange", value);
      this.getProcessList();
    },
    /** 结果切换 */
    handleResultChange(value) {
      if (value) this.form.backReason = undefined;
    },
    /** 验证表单 */
    validate() {
      const validList = [];
      const basisValid = this.validateBasis();
      validList.push(basisValid);
      const topValid = this.$refs.basisTopForm.validate();
      validList.push(topValid);
      const workerValid = this.$refs.basisWorkerForm.validate();
      validList.push(workerValid);
      const dynamicValid = this.$refs.basisDynamicForm.validate();
      validList.push(dynamicValid);
      if (!this.eliminate) {
        validList.push(this.$refs.basisRiskForm.validate());
        validList.push(this.$refs.basisProcessForm.validate());
      }

      return new Promise((resolve, reject) => {
        Promise.all(validList)
          .then(([basis, top, worker, dynamic, risk, process]) => {
            let data = { ...basis, ...top, ...worker, ...dynamic };
            if (!this.eliminate) data = { ...data, ...risk, ...process };
            const parseData = JSON.parse(JSON.stringify(data));
            resolve(parseData);
          })
          .catch(_ => {
            reject();
          });
      });
    },
    validateBasis() {
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
        id: undefined,
        parentId: undefined,
        tool: "",
        diyAttributeList: [],
        ticketRisk: {
          factorList: [],
          fixedItemList: [],
          harmList: []
        },
        guarderList: [],
        taskNodeModelList: [],
        result: 1,
        backReason: undefined
      };
      this.blindable = false;
      // this.resetForm("form");
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
    }
  }
};
</script>
