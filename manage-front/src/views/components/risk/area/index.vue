<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    >
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-form">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="作业区域：" prop="area">
            <el-input v-model="form.area" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="风险评估：" prop="level">
            <div class="riskLevelCon" v-if="form.level || form.score "><span class="riskLevel" v-if="form.level">{{ levelName(form.level) }}</span><span>当前评估分值: {{ form.score }}</span></div>
            <el-button v-if="editable" @click="handleRisk" type="primary" round size="small" style="width:120px;">风险评估</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 风险评估 -->
      <el-row :gutter="24" v-if="risk && editable">
        <el-col :span="24">
          <el-table :data="lsAlgorithm.lmodeList" ref="singleTableL" highlight-current-row border style="margin-bottom:15px;">
            <el-table-column label="" width="40">
              <template slot-scope="scope">
                <el-radio :label="scope.$index" v-model="radioL" @change.native="getCurrentRowL(scope.row)" style="color: #fff;padding-left: 5px; margin-right: -20px;"></el-radio>
              </template>
            </el-table-column>
            <el-table-column label="事故发生的可能性（L）" prop="first" align="center"></el-table-column>
            <el-table-column label="分值" prop="second" width="200px" align="center"></el-table-column> 
          </el-table>
          <el-table :data="lsAlgorithm.smodeList" ref="singleTableS" highlight-current-row border style="margin-bottom:15px;">
            <el-table-column label="" width="40">
              <template slot-scope="scope">
                <el-radio :label="scope.$index" v-model="radioS" @change.native="getCurrentRowS(scope.row)" style="color: #fff;padding-left: 5px; margin-right: -20px;"></el-radio>
              </template>
            </el-table-column>
            <el-table-column label="事件后果严重性（S）" prop="first" align="center"></el-table-column>
            <el-table-column label="分值" prop="second" width="200px" align="center"></el-table-column> 
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="工作岗位：" prop="station">
            <el-input v-model="form.station" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="关键设备：" prop="device">
            <el-input v-model="form.device" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="主要作业活动：" prop="mainJob">
            <el-input v-model="form.mainJob" :disabled="!editable"></el-input>
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
        <el-col :span="12">
          <el-form-item label="责任人：" prop="respUserId">
            <el-select
              v-model="form.respUserId"
              :disabled="!editable"
              :placeholder="editable ? '请选择责任人' : ''"
              filterable
              clearable
              @change="userSelect"
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
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="区域描述：" prop="areaDesc">
            <el-input v-model="form.areaDesc" type="textarea" rows="3" :disabled="!editable"></el-input>
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
import { listDeptUsers } from "@/api/modules/sys/user";
import { addArea, updateArea } from "@/api/modules/risk/area";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import LsFrom from "@/views/components/risk/basic/algorithm/ls";
import { algorithm } from "@/api/modules/risk/algorithm";
import { numFilter, calcRiskLevel } from "../utils";
import { levelName } from "@/views/components/risk/utils";

export default {
  components: { 
    Treeselect,
    LsFrom
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
      // 人员数据字典
      userOptions: [],
      // 自定义部门树节点key
      deptNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children
        };
      },
      lsAlgorithm: null,
      radioL: null,
      radioS: null,
      levelName,
      // 是否显示风险评估
      risk: false,
      rules: {
        area: [
          { required: true, message: '作业区域不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '风险评估不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.reset();
        this.getAlgorithm();
        this.getDeptTree();
      }
    },
    visible(val) {
      this.$emit("input", val);
      if (!val) this.clearValidate();
    }
  },
  created() {},
  methods: {
    setup(data) {
      this.form = data;
      if (this.form.respDeptId) {
        this.getUserList(this.form.respDeptId);
      }
    },
    /** 获取算法 */
    getAlgorithm() {
      algorithm().then(res => {
        var result = res.result;
        if (result) {
          this.lsAlgorithm = result.lsAlgorithmModel;
          this.setAlgorithm();
        }
      })
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
        this.getUserList(node.deptId);
      }
    },
    /** 查询人员列表 */
    getUserList(deptId) {
      listDeptUsers(deptId)
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
    /** 选择责任人 */ 
    userSelect(val) {
      this.form.respUserName = this.userOptions.find(item => item.value === val).label;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          var func = this.form.id ? updateArea : addArea;
          func(this.form).then(res => {
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
      this.risk = false;
      this.radioS = false;
      this.radioL = false;
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["form"].clearValidate();
    },
    /** 单选操作 */
    getCurrentRowL(row) {
      var base = { lmode: row };
      this.form.lsSelectedModel = { ...this.form.lsSelectedModel, ...base };
      this.calc();
    },
    getCurrentRowS(row) {
      var base = { smode: row };
      this.form.lsSelectedModel = { ...this.form.lsSelectedModel, ...base };
      this.calc();
    },
    /** 单选反选操作 */
    setCurrent() {
      var indexL = this.lsAlgorithm.lmodeList.findIndex((value)=>value.first === this.form.lsSelectedModel.lmode.first && value.second === this.form.lsSelectedModel.lmode.second);
      var indexS = this.lsAlgorithm.smodeList.findIndex((value)=>value.first === this.form.lsSelectedModel.smode.first && value.second === this.form.lsSelectedModel.smode.second);
      this.radioL = indexL;
      this.radioS = indexS;
      this.$nextTick(() => {
        this.$refs.singleTableL.setCurrentRow(this.lsAlgorithm.lmodeList[indexL]);
        this.$refs.singleTableS.setCurrentRow(this.lsAlgorithm.smodeList[indexS]);
      })
    },
    /** 计算风险等级 得分 */
    calc() {
      var lsSelectedModel = this.form.lsSelectedModel;
      if (lsSelectedModel && lsSelectedModel.lmode && lsSelectedModel.smode) {
        this.form.score = numFilter(Number(this.form.lsSelectedModel.lmode.second) * Number(this.form.lsSelectedModel.smode.second));
        this.form.level = calcRiskLevel(this.form.score, this.lsAlgorithm.levelList);
        // if (this.form.score > 0 && (this.form.score <= Number(this.lsAlgorithm.levelList[3].third))) {
        //   this.form.level = 1;
        // } else if (this.form.score <= Number(this.lsAlgorithm.levelList[2].third)) {
        //   this.form.level = 2;
        // } else if (this.form.score <= Number(this.lsAlgorithm.levelList[1].third)) {
        //   this.form.level = 3;
        // } else if (this.form.score >= Number(this.lsAlgorithm.levelList[0].second)) {
        //   this.form.level = 4;
        // } else {
        //   this.$message('无法评估,请修改算法');
        // }
      }
    },
    // 显示/隐藏风险评估
    handleRisk() {
      this.risk = !this.risk;
      if (this.risk && this.form.lsSelectedModel && this.form.lsSelectedModel.lmode && this.form.lsSelectedModel.smode) {
        this.setCurrent();
      }
    },
    setAlgorithm() {
      if (this.form.lsSelectedModel && this.form.lsSelectedModel.lmode && this.form.lsSelectedModel.smode) {
        var algorithmTemp = this.lsAlgorithm; // 当前算法模板
        var curAlgorithmType = "ls";
        var algorithmTypeTemp = curAlgorithmType.split(""); // 算法
        for (var i = 0; i < algorithmTypeTemp.length; i++) {
          var typeStrTemp = algorithmTypeTemp[i] + 'modeList'; // 当前算法中对应的模板字段
          var typeStr = algorithmTypeTemp[i] + 'mode'; // 已选择的算法对应的模板字段
          var modeList = algorithmTemp[typeStrTemp]; // 当前算法模板列表
          var index = modeList.findIndex((value)=> value.first === this.form.lsSelectedModel[typeStr].first && value.second === this.form.lsSelectedModel[typeStr].second); // 判断算法模板中是否都存在已选择的算法
          if (index === -1) { // 若有一项不存在则退出
            this.form.score = undefined;
            this.form.level = undefined;
            return
          }
        }
        this.calc();
      } else {
        this.form.score = undefined;
        this.form.level = undefined;
      }
    },
    initFormData() {
      return {
        id: undefined,
        area: undefined,
        level: undefined,
        score: undefined,
        lsSelectedModel: {
          lmode: undefined,
          smode: undefined
        },
        station: undefined,
        device: undefined,
        mainJob: undefined,
        respDeptId: undefined,
        respDeptName: undefined,
        respUserId: undefined,
        respUserName: undefined,
        areaDesc: undefined,
        memo: undefined
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
