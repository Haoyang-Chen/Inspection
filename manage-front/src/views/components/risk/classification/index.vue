<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="800px"
    >
    <el-form :model="formData" :rules="rules" ref="formData" label-width="160px" class="demo-formData">
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="类型：" prop="type">
            <el-radio-group v-model="formData.type" @change="chagneType" :disabled="!editable">
              <el-radio v-for="item in hazardSourceType" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="风险点名称：" prop="hazardId">
            <el-select
              v-model="formData.hazardId"
              placeholder="请选择风险点"
              clearable
              size="small"
              :filterable="true"
              :disabled="!editable"
              style="width: 180px"
              @change="changeHazard"
            >
              <el-option
                v-for="dict in hazardSourceOptions"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="所在区域：" prop="area">
            <el-input v-model="formData.area" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="工作场所：" prop="place">
            <el-input v-model="formData.place" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="可能造成的事故类型：" prop="accidentList">
            <div class="tag-group">
              <el-tag
                v-for="(item, index) in formData.accidentList"
                :key="index"
                type="info"
                effect="plain">
                {{ item }}
              </el-tag>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
     <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="风险评估：" prop="level">
            <div class="riskLevelCon" v-if="formData.level || formData.score"><span class="riskLevel" v-if="formData.level">{{ levelName(formData.level) }}</span><span>当前评估分值: {{ formData.score }}</span></div>
            <el-button v-if="editable" @click="handleRisk" type="primary" round size="small" style="width:120px;">风险评估</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-show="risk && editable">
        <el-col :span="24">
          <el-form-item label="请选择风险评估算法：" prop="algorithmType">
            <el-radio-group v-model="formData.algorithmType" @change="changeAlgorithmType">
              <el-radio v-for="item in algorithmTypeOptions" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <ls-from v-if="formData.algorithmType === 'ls'"
            ref="algorithmFrom" :editable="false"
            :selectedModel="formData.algorithmType === curAlgorithmType ? selectedModel : {}"
            @getAlgorithmModel="getAlgorithmModel"
          ></ls-from>
          <lec-from v-if="formData.algorithmType === 'lec'"
            ref="algorithmFrom" :editable="false"
            :selectedModel="formData.algorithmType === curAlgorithmType ? selectedModel : {}"
            @getAlgorithmModel="getAlgorithmModel">
          </lec-from>
          <mes-from v-if="formData.algorithmType === 'mes'"
            ref="algorithmFrom" :editable="false"
            :selectedModel="formData.algorithmType === curAlgorithmType ? selectedModel : {}"
            @getAlgorithmModel="getAlgorithmModel">
          </mes-from>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="主要管控措施：" prop="mainMeasureList">
            <el-row
              v-for="(item, index) in formData.mainMeasureList"
              :key="index"
            >
              <el-col :span="24">
                <el-form-item
                  label-width="0"
                  :prop="'mainMeasureList.' + index"
                  :rules="[
                    {
                      required: true,
                      message: '管控措施不能为空',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model="formData.mainMeasureList[index]"
                    :disabled="!editable"
                    placeholder="请输入管控措施"
                    style="width: 86%;margin-bottom: 10px;"
                  />
                  <template v-if="editable">
                    <span style="margin-left: 10px; margin-top: 5px">
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        circle
                        @click="handleAdd()"
                      ></el-button>
                      <el-button
                        v-if="formData.mainMeasureList.length > 1"
                        type="danger"
                        icon="el-icon-minus"
                        size="mini"
                        circle
                        @click="handleDel(index)"
                      ></el-button>
                    </span>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应急处置措施：" prop="emerMeasure">
            <el-input v-model="formData.emerMeasure" type="textarea" rows="3" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="管控层级：" prop="controlLevel">
            <el-select
              v-model="formData.controlLevel"
              placeholder="请选择管控层级"
              clearable
              size="small"
              disabled
              style="width: 180px"
            >
              <el-option
                v-for="dict in controlLevels"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="责任部门:" prop="respDeptId">
            <treeselect
              v-model="formData.respDeptId"
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
          <el-form-item label="警示标识：" prop="warnSignList">
            <sign-widget
              ref="warnSignList"
              v-model="formData.warnSignList"
              @getWarnSignList="getWarnSignList"
              :editable="editable"
            ></sign-widget>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="memo">
            <el-input v-model="formData.memo" type="textarea" rows="3" :disabled="!editable"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="editable" type="primary" @click="submitformData">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { treeDept } from "@/api/modules/sys/dept";
import { listHazardSource } from "@/api/modules/risk/hazardSource";
import { algorithm } from "@/api/modules/risk/algorithm";
import { add, update, detail } from "@/api/modules/risk/classification";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import LsFrom from "@/views/components/risk/basic/algorithm/ls";
import LecFrom from "@/views/components/risk/basic/algorithm/lec";
import MesFrom from "@/views/components/risk/basic/algorithm/mes";
import SignWidget from "./sign-widget";
import Uploader from "@/components/Uploader";
import { numFilter, calcRiskLevel } from "../utils";
import { levelName } from "@/views/components/risk/utils";

export default {
  components: { 
    Treeselect,
    LsFrom,
    LecFrom,
    MesFrom,
    SignWidget,
    Uploader
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
      formData: this.initformData(),
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
      // 风险源列表
      hazardSourceOptions: [],
      // 是否显示风险评估
      risk: false,
      // LS算法
      lsAlgorithm: undefined,
      lecAlgorithm: undefined,
      mesAlgorithm: undefined,
      levelList: [],
      // 当前算法类型
      curAlgorithmType: undefined,
      // 选择的算法
      selectedModel: {},
      levelName,
      rules: {
        type: [
          { required: true, message: '类型不能为空', trigger: 'change' }
        ],
        hazardId: [
          { required: true, message: '风险点名称不能为空', trigger: 'change' }
        ],
        area: [
          { required: true, message: '所在区域不能为空', trigger: 'change' }
        ],
        level: [
          { required: true, message: '风险评估不能为空', trigger: 'change' }
        ],
        place: [
          { required: true, message: '工作场所不能为空', trigger: 'blur' }
        ],
        controlLevel: [
          { required: true, message: '管控层级不能为空', trigger: 'change' }
        ],
        warnSignList: [
          { required: true, message: '警示标识不能为空', trigger: 'change' }
        ],
        photoList: [
          { required: true, message: '现场照片不能为空', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val;
      if (val) {
        this.reset();
        this.getDeptTree();
        this.getAlgorithm();
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
    /** 管控层级 */
    controlLevels() {
      return this.$store.state.common.controlLevels;
    },
    /** 算法类型 */
    algorithmTypeOptions() {
      return this.$store.state.common.algorithmTypes;
    }
  },
  created() {},
  methods: {
    setup(id) {
      this.getData(id);
    },
    getData(id) {
      detail(id).then(res => {
        var result = res.result;
        result.warnSignList = result.warnSignList ? result.warnSignList : [];
        this.formData = result;
        if (this.formData.type) {
          this.getHazardSource(this.formData.type);
        }
        this.formData.photoList = this.formData.photoList ? this.formData.photoList : []
        this.setupUploader(this.formData.photoList);
        this.selectedModel = this.formData.algorithmModel;
        this.curAlgorithmType = this.formData.algorithmType;
        this.$nextTick(()=> {
          this.$refs.warnSignList.handleSignChange(this.formData.warnSignList);
          this.changeAlgorithmType();
        })
      })
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    getWarnSignList(val) {
      this.formData.warnSignList = val;
    },
    /** 获取算法 */
    getAlgorithm() {
      algorithm().then(res => {
        var result = res.result;
        if (result) {
          this.lsAlgorithm = result.lsAlgorithmModel;
          this.lecAlgorithm = result.lecAlgorithmModel;
          this.mesAlgorithm = result.mesAlgorithmModel;
        }
      })
    },
    /** 算法切换 */
    changeAlgorithmType() {
      this.formData.level = undefined;
      this.formData.score = undefined;
      this.setAlgorithmType();
    },
    /** 设置算法 */
    setAlgorithmType() {
      var algorithmModel = this.lsAlgorithm;
      if (this.formData.algorithmType === 'lec') {
        algorithmModel = this.lecAlgorithm;
      } else if (this.formData.algorithmType === 'mes') {
        algorithmModel = this.mesAlgorithm;
      }
      if (algorithmModel && algorithmModel.levelList) {
        this.levelList = algorithmModel.levelList;
      }
      this.$nextTick(() => {
        this.$refs.algorithmFrom.setup(algorithmModel);
      })
      if ((this.curAlgorithmType === this.formData.algorithmType) && this.selectedModel) {
        var algorithmTemp = algorithmModel; // 当前算法模板
        var algorithmTypeTemp = this.curAlgorithmType.split(""); // 算法
        for (var i = 0; i < algorithmTypeTemp.length; i++) {
          var typeStrTemp = algorithmTypeTemp[i] + 'modeList'; // 当前算法中对应的模板字段
          var typeStr = algorithmTypeTemp[i] + 'mode'; // 已选择的算法对应的模板字段
          var modeList = algorithmTemp[typeStrTemp]; // 当前算法模板列表
          var index = modeList.findIndex((value)=>value.first === this.selectedModel[typeStr].first && value.second === this.selectedModel[typeStr].second); // 判断算法模板中是否都存在已选择的算法
          if (index === -1) { // 若有一项不存在则退出
            this.formData.score = undefined;
            this.formData.level = undefined;
            return
          }
        }
        this.calcScore(this.selectedModel);
      }
    },
    /** 获取选择的算法信息 */
    getAlgorithmModel(val) {
      if (this.curAlgorithmType === this.formData.algorithmType) {
        this.formData.algorithmModel = { ...this.selectedModel, ...val };
      } else {
        this.formData.algorithmModel = val;
      }
      this.calcScore(this.formData.algorithmModel);
    },
    /** 根据选择的算法计算得分和风险等级 */ 
    calcScore(algorithm) {
      if (this.formData.algorithmType === 'ls' && algorithm && algorithm.lmode && algorithm.smode) {
        var lmodeScore = algorithm.lmode.second ? algorithm.lmode.second : 0;
        var smodeScore = algorithm.smode.second ? algorithm.smode.second : 0;
        this.formData.score = numFilter(Number(lmodeScore) * Number(smodeScore));
      } else if (this.formData.algorithmType === 'lec' && algorithm && algorithm.lmode && algorithm.emode && algorithm.cmode) {
        var lmodeScore = algorithm.lmode.second ? algorithm.lmode.second : 0;
        var emodeScore = algorithm.emode.second ? algorithm.emode.second : 0;
        var cmodeScore = algorithm.cmode.second ? algorithm.cmode.second : 0;
        this.formData.score = numFilter(Number(lmodeScore) * Number(emodeScore) * Number(cmodeScore));
      } else if (this.formData.algorithmType === 'mes' && algorithm && algorithm.mmode && algorithm.emode && algorithm.smode) {
        var mmodeScore = algorithm.mmode.second ? algorithm.mmode.second : 0;
        var emodeScore = algorithm.emode.second ? algorithm.emode.second : 0;
        var smodeScore = algorithm.smode.second ? algorithm.smode.second : 0;
        this.formData.score = numFilter(Number(mmodeScore) * Number(emodeScore) * Number(smodeScore));
      } else {
        this.formData.score = undefined;
        this.formData.level = undefined;
      }
      if (this.formData.score > 0) {
        this.formData.level = calcRiskLevel(this.formData.score, this.levelList);
        this.formData.controlLevel = this.formData.level; // 关联管控级别 重大风险→公司、较大风险→车间、一般风险→班组、低风险→岗位
      }
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
    /** 上传完成回调 */
    handleUploadCompletion(fileList) {
      this.formData.photoList = fileList;
    },
    /** 部门选择 */
    deptSelect(node, instanceId) {
      if (this.formData.respDeptId !== node.deptId) {
        this.formData.respDeptId = node.deptId;
        this.formData.respDeptName = node.name;
      }
    },
    /** 选择类别 */
    chagneType(val) {
      this.getHazardSource(val);
      this.formData.hazardId = undefined;
      this.formData.hazardName = undefined;
      this.formData.accidentList = undefined;
      this.formData.area = undefined;
    },
    /** 根据类型查询风险点列表 */
    getHazardSource(val) {
      var params = { type: val, page: 1, limit: 1000000 };
      listHazardSource(params).then(response => {
        const result = response.result;
        this.hazardSourceOptions = result.list;
      });
    },
    /** 选择的风险点 */
    changeHazard(val) {
      var hazard = this.hazardSourceOptions.find(item => item.id === val);
      this.formData.hazardName = hazard.name;
      this.formData.accidentList = hazard.accidentList;
      this.formData.area = hazard.areaName;
    },
    // 显示/隐藏风险评估
    handleRisk() {
      this.risk = !this.risk;
      if (this.risk && this.formData.algorithmType) {
        this.$nextTick(() => {
          this.changeAlgorithmType();
        })
      }
    },
    /** 添加主要管控措施按钮 */
    handleAdd() {
      const baseLine = '';
      this.formData.mainMeasureList.push(baseLine);
    },
    /** 添加主要管控措施按钮 */
    handleDel(index) {
      this.$confirm("是否确认删除所选管控措施？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.formData.mainMeasureList.splice(index, 1);
      });
    },
    /** 提交按钮 */
    submitformData: function() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.formData.warnSignList.map(item => {
            this.$delete(item,'checked')
          });
          this.formData.algorithmDetail = JSON.stringify(this.formData.algorithmModel);
          let func = !this.formData.id ? add : update;
          func(this.formData).then(res => {
            this.visible = false;
            this.msgSuccess(this.formData.id ? "编辑成功" : "新增成功");
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
      this.formData = this.initformData();
      this.setupUploader([]);
      this.selectedModel = {};
      this.risk = false;
      this.resetForm("formData");
    },
    /** 清空验证 */
    clearValidate() {
      this.$refs["formData"].clearValidate();
    },
    initformData() {
      return {
        id: undefined,
        type: undefined,
        hazardId: undefined, // 风险点id
        hazardName: undefined,
        area: undefined, // 所在区域
        place: undefined, // 工作场所
        accidentList: [],
        level: undefined, // 等级
        score: undefined, // 评估分值
        algorithmType: undefined, // 算法类型 ls lec mes
        algorithmModel: undefined, // 算法详情
        mainMeasureList: [''], // 主要管控措施
        emerMeasure: undefined, // 应急措施
        controlLevel: undefined, // 管控层级
        respDeptId: undefined, // 责任部门
        respDeptName: undefined,
        photoList: [], // 现场照片
        warnSignList: [], // 警示标识
        memo: undefined // 备注
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-group /deep/.el-tag{
  margin-right: 10px;
}
</style>
