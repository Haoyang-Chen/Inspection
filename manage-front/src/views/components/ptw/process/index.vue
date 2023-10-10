<template>
  <div ref="container" class="process-container">
    <div class="process-reset">
      <el-select
        v-if="workLevel !== null && workLevel !== undefined"
        v-model="workLevel"
        @change="handleLevelChange"
      >
        <el-option
          v-for="item in levelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <div v-else style="width:1px;height:100%"></div>
      <div class="reset-btns">
        <el-button type="primary" icon="el-icon-check" @click="handleSave">保存</el-button>
        <el-button type="danger" icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </div>
    </div>
    <div class="process-wrap">
      <el-row :gutter="40" type="flex" justify="center">
        <el-col :span="5">
          <div
            ref="start"
            class="process-content"
            v-bind:style="{
              background: immutableColor
            }"
          >
            <div class="content-title">作业申请</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" type="flex" justify="center">
        <el-col :span="5" v-show="form.startApply.enable">
          <div class="process-wrap">
            <div
              ref="startApply"
              class="process-content"
              v-bind:style="{
                background:
                  form.startApply.setting === 2 ? immutableColor : variableColor
              }"
            >
              <div class="content-title title-fix">
                {{ form.startApply.nodeName }}
                <setting-popover
                  nodeProp="startApply"
                  :nodeData="form.startApply"
                  @approveChange="handleNodeApvChange"
                  @deleteSuccess="handleNodeDel"
                ></setting-popover>
              </div>
            </div>
            <el-tooltip
              v-if="
                !form.startApply.approveTaskList ||
                  !form.startApply.approveTaskList.length
              "
              content="请确保审核信息填写完整"
              placement="top-end"
            >
              <el-button
                type="danger"
                icon="el-icon-warning-outline"
                circle
                class="process-tips"
              ></el-button>
            </el-tooltip>
          </div>
        </el-col>
        <el-col
          v-if="!form.startApply.enable"
          :span="5"
          :offset="6"
          class="content-fix"
        >
          <el-button
            v-if="recoverable"
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            @click="handleReset('startApply')"
            >恢复</el-button
          >
        </el-col>
      </el-row>

      <el-row :gutter="40" type="flex" justify="space-around">
        <el-col :span="5">
          <div class="process-wrap">
            <div
              ref="sceneConfirm"
              class="process-content"
              v-bind:style="{
                background:
                  form.sceneConfirm.setting === 2
                    ? immutableColor
                    : variableColor
              }"
            >
              <div class="content-title title-fix">
                {{ form.sceneConfirm.nodeName }}
                <setting-popover
                  nodeProp="sceneConfirm"
                  :nodeData="form.sceneConfirm"
                  @approveChange="handleNodeApvChange"
                ></setting-popover>
              </div>
            </div>
            <el-tooltip
              v-if="
                !form.sceneConfirm.approveTaskList ||
                  !form.sceneConfirm.approveTaskList.length
              "
              content="请确保审核信息填写完整"
              placement="top-end"
            >
              <el-button
                type="danger"
                icon="el-icon-warning-outline"
                circle
                class="process-tips"
              ></el-button>
            </el-tooltip>
          </div>
        </el-col>
        <el-col v-show="form.sceneGas.enable" :span="5">
          <div class="process-wrap">
            <div
              ref="sceneGas"
              class="process-content"
              v-bind:style="{
                background:
                  form.sceneGas.setting === 2 ? immutableColor : variableColor
              }"
            >
              <div class="content-title title-fix">
                {{ form.sceneGas.nodeName }}
                <setting-popover
                  nodeProp="sceneGas"
                  :nodeData="form.sceneGas"
                  @approveChange="handleNodeApvChange"
                  @deleteSuccess="handleNodeDel"
                ></setting-popover>
              </div>
            </div>
            <el-tooltip
              v-if="
                !form.sceneGas.approveTaskList ||
                  !form.sceneGas.approveTaskList.length
              "
              content="请确保审核信息填写完整"
              placement="top-end"
            >
              <el-button
                type="danger"
                icon="el-icon-warning-outline"
                circle
                class="process-tips"
              ></el-button>
            </el-tooltip>
          </div>
        </el-col>
        <el-col v-if="!form.sceneGas.enable" :span="5">
          <el-button
            v-if="recoverable"
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            @click="handleReset('sceneGas')"
            >恢复</el-button
          >
        </el-col>
      </el-row>

      <el-row :gutter="40" type="flex" justify="center">
        <el-col :span="5">
          <div class="process-wrap">
            <div
              ref="remoteSign"
              class="process-content"
              v-bind:style="{
                background:
                  form.remoteSign.setting === 2 ? immutableColor : variableColor
              }"
            >
              <div class="content-title title-fix">
                {{ form.remoteSign.nodeName }}
                <setting-popover
                  nodeProp="remoteSign"
                  :nodeData="form.remoteSign"
                  @approveChange="handleNodeApvChange"
                ></setting-popover>
              </div>
            </div>
            <el-tooltip
              v-if="
                !form.remoteSign.approveTaskList ||
                  !form.remoteSign.approveTaskList.length
              "
              content="请确保审核信息填写完整"
              placement="top-end"
            >
              <el-button
                type="danger"
                icon="el-icon-warning-outline"
                circle
                class="process-tips"
              ></el-button>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="40" type="flex" justify="space-around">
        <el-col :span="5"></el-col>
        <el-col v-show="form.delayApply.enable" :span="5">
          <div
            ref="delayApply"
            class="process-content"
            v-bind:style="{
              background:
                form.delayApply.setting === 2 ? immutableColor : variableColor
            }"
          >
            <div class="content-title title-fix">
              {{ form.delayApply.nodeName }}
              <setting-popover
                nodeProp="delayApply"
                :nodeData="form.delayApply"
                @deleteSuccess="handleNodeDel"
              ></setting-popover>
            </div>
          </div>
        </el-col>
        <el-col
          v-if="
            !form.delayApply.enable && (form.endApply.enable || form.end.enable)
          "
          :span="5"
        >
          <el-button
            v-if="recoverable"
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            @click="handleReset('delayApply')"
            >恢复</el-button
          >
        </el-col>
      </el-row>

      <el-row :gutter="40" type="flex" justify="space-around">
        <el-col :span="5"></el-col>
        <el-col v-show="form.delaySign.enable" :span="5">
          <div class="process-wrap">
            <div
              ref="delaySign"
              class="process-content"
              v-bind:style="{
                background:
                  form.delaySign.setting === 2 ? immutableColor : variableColor
              }"
            >
              <div class="content-title title-fix">
                {{ form.delaySign.nodeName }}
                <setting-popover
                  nodeProp="delaySign"
                  :nodeData="form.delaySign"
                  @approveChange="handleNodeApvChange"
                  @deleteSuccess="handleNodeDel"
                ></setting-popover>
              </div>
            </div>
            <el-tooltip
              v-if="
                !form.delaySign.approveTaskList ||
                  !form.delaySign.approveTaskList.length
              "
              content="请确保审核信息填写完整"
              placement="top-end"
            >
              <el-button
                type="danger"
                icon="el-icon-warning-outline"
                circle
                class="process-tips"
              ></el-button>
            </el-tooltip>
          </div>
        </el-col>
        <el-col
          v-if="
            !form.delaySign.enable && (form.endApply.enable || form.end.enable)
          "
          :span="5"
        >
          <el-button
            v-if="recoverable"
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            @click="handleReset('delaySign')"
            >恢复</el-button
          >
        </el-col>
      </el-row>

      <el-row :gutter="40" type="flex" justify="center">
        <el-col v-show="form.endApply.enable" :span="5">
          <div
            ref="endApply"
            class="process-content"
            v-bind:style="{
              background:
                form.endApply.setting === 2 ? immutableColor : variableColor
            }"
          >
            <div class="content-title title-fix">
              {{ form.endApply.nodeName }}
              <setting-popover
                nodeProp="endApply"
                :nodeData="form.endApply"
                @deleteSuccess="handleNodeDel"
              ></setting-popover>
            </div>
          </div>
        </el-col>
        <el-col
          v-if="!form.endApply.enable"
          :span="5"
          :offset="6"
          class="content-fix"
        >
          <el-button
            v-if="recoverable"
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            @click="handleReset('endApply')"
            >恢复</el-button
          >
        </el-col>
      </el-row>

      <el-row :gutter="40" type="flex" justify="center">
        <el-col v-show="form.end.enable" :span="5">
          <div class="process-wrap">
            <div
              ref="end"
              class="process-content"
              v-bind:style="{
                background:
                  form.end.setting === 2 ? immutableColor : variableColor
              }"
            >
              <div class="content-title title-fix">
                {{ form.end.nodeName }}
                <setting-popover
                  nodeProp="end"
                  :nodeData="form.end"
                  @approveChange="handleNodeApvChange"
                  @deleteSuccess="handleNodeDel"
                ></setting-popover>
              </div>
            </div>
            <el-tooltip
              v-if="
                !form.end.approveTaskList || !form.end.approveTaskList.length
              "
              content="请确保审核信息填写完整"
              placement="top-end"
            >
              <el-button
                type="danger"
                icon="el-icon-warning-outline"
                circle
                class="process-tips"
              ></el-button>
            </el-tooltip>
          </div>
        </el-col>
        <el-col
          v-if="!form.end.enable"
          :span="5"
          :offset="6"
          class="content-fix"
        >
          <el-button
            v-if="recoverable"
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            @click="handleReset('end')"
            >恢复</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getProcess, saveProcess } from "@/api/modules/ptw/process";
import LeaderLine from "leader-line";
import SettingPopover from "./setting-popover";
import { deepClone } from "@/utils";
import { workLevels } from "../work/utils";

export default {
  name: "WorkProcess",
  components: { SettingPopover },
  props: {
    // 线条颜色
    lineColor: {
      type: String,
      default: "#ccc"
    },
    // 线条大小
    lineSize: {
      type: Number,
      default: 2.5
    },
    // 固定节点颜色
    immutableColor: {
      type: String,
      default: "#eb7676"
    },
    // 可选节点颜色
    variableColor: {
      type: String,
      default: "#566b94"
    }
  },
  data() {
    return {
      creating: false,
      lines: [],
      otherLines: [],
      SToSALine: undefined,
      SAToSCLine: undefined,
      SAToSGLine: undefined,
      SCToRSLine: undefined,
      SGToRSLine: undefined,
      RSToEALine: undefined,
      RSToDALine: undefined,
      DAToDSLine: undefined,
      DSToEALine: undefined,
      EAToELine: undefined,
      workLevel: 1,
      workType: 1,
      recoverable: false,
      original: {},
      form: {
        startApply: {
          enable: true,
          setting: 1,
          multipleApv: true,
          nodeName: "评估审批",
          approveTaskList: undefined
        },
        sceneConfirm: {
          enable: true,
          setting: 2,
          multipleApv: false,
          nodeName: "现场确认",
          approveTaskList: undefined
        },
        sceneGas: {
          enable: true,
          setting: 1,
          multipleApv: false,
          nodeName: "现场气体检测",
          approveTaskList: undefined
        },
        remoteSign: {
          enable: true,
          setting: 2,
          multipleApv: true,
          nodeName: "远程签发",
          approveTaskList: undefined
        },
        delayApply: {
          enable: true,
          setting: 3,
          multipleApv: true,
          nodeName: "延期申请",
          approveTaskList: undefined
        },
        delaySign: {
          enable: true,
          setting: 1,
          multipleApv: true,
          nodeName: "延期签发",
          approveTaskList: undefined
        },
        endApply: {
          enable: true,
          setting: 3,
          multipleApv: true,
          nodeName: "完工申请",
          approveTaskList: undefined
        },
        end: {
          enable: true,
          setting: 1,
          multipleApv: true,
          nodeName: "完工审批",
          approveTaskList: undefined
        }
      }
    };
  },
  computed: {
    /** 作业级别 */
    levelOptions() {
      return workLevels(this.workType);
    },
    // 线条属性配置
    lineOptions() {
      return {
        color: this.lineColor,
        size: this.lineSize,
        hide: true
      };
    }
  },
  watch: {},
  created() {
    this.creating = true;
    this.original = deepClone(this.form);
  },
  destroyed() {
    this.handleLines(this.lines, 3);
    this.lines = [];
  },
  methods: {
    /** 重置相关值 */
    setup(workType, workLevel) {
      this.workType = workType;
      this.workLevel = workLevel;
      this.getData(workType, workLevel);
    },
    getData(type, level) {
      getProcess(type, level).then(response => {
        const result = response.result;
        if (result && result.length) {
          const nodes = [];
          for (let key in this.form) {
            nodes.push({ nodeKey: key, nodeName: this.form[key].nodeName });
          }
          nodes.forEach(node => {
            const exist = result.find(f => f.nodeName === node.nodeName);
            if (exist) {
              this.form[node.nodeKey].approveTaskList = exist.approveTaskList;
            } else {
              this.form[node.nodeKey].approveTaskList = undefined;
            }
            this.form[node.nodeKey].enable = exist ? true : false;
          });
          this.loadComplete();
        } else {
          this.loadComplete(false);
        }
      });
    },
    loadComplete(success = true) {
      if (this.creating) {
        this.creating = false;
        this.$nextTick(() => {
          this.initLines();
          this.sizeMonitor();
          let that = this;
          setTimeout(function() {
            if (success) that.resetLines();
            else that.handleReset();
          }, 1000 * 0.4);
        });
      } else {
        if (success) this.resetLines();
        else this.handleReset();
      }
    },
    /** 保存按钮操作 */
    handleSave() {
      if (this.hasError()) {
        this.msgError("请确保节点相关信息填写完整");
        return;
      }
      const keys = Object.keys(this.form);
      const taskNodeModelList = [];
      keys.forEach(key => {
        const node = this.form[key];
        if (node.enable)
          taskNodeModelList.push({
            nodeName: node.nodeName,
            approveTaskList: node.approveTaskList
          });
      });
      const data = { ticketType: this.workType, level: this.workLevel, taskNodeModelList };
      saveProcess(data).then(response => {
        this.msgSuccess("保存成功");
      });
    },
    hasError() {
      const results = [];
      Object.keys(this.form).forEach(key => {
        const node = this.form[key];
        if (node.enable) {
          if (node.setting !== 3) {
            if (node.approveTaskList && node.approveTaskList.length) {
              results.push(false);
            } else {
              results.push(true);
            }
          } else {
            results.push(false);
          }
        } else {
          results.push(false);
        }
      });
      const errors = results.filter(item => item === true);
      if (errors && errors.length) return true;
      return false;
    },
    /** 重置按钮操作 */
    handleReset(node) {
      if (node && node.length) {
        this.form[node] = deepClone(this.original)[node];
      } else {
        this.form = deepClone(this.original);
      }
      this.resetLines();
    },
    /** 人员设置按钮回调 */
    handleNodeApvChange(node, users) {
      this.form[node].approveTaskList = [...users];
    },
    /** 删除按钮操作 */
    handleNodeDel(node) {
      const nodeData = this.form[node];
      this.$confirm(`是否确认删除节点"${nodeData.nodeName}"？`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteNode(node);
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    deleteNode(node) {
      this.form[node].enable = false;
      this.resetLines();
    },
    /** 作业等级切换操作 */
    handleLevelChange(level) {
      this.getData(this.workType, level);
    },
    //-------------------------------------------------------------//
    /** 初始化🧵 */
    initLines() {
      this.SToSALine = new LeaderLine(
        this.$refs.start,
        this.$refs.startApply,
        this.lineOptions
      );
      this.SAToSCLine = new LeaderLine(
        this.$refs.startApply,
        this.$refs.sceneConfirm,
        {
          ...this.lineOptions,
          startSocket: "bottom",
          endSocket: "top",
          path: "grid"
        }
      );
      this.SAToSGLine = new LeaderLine(
        this.$refs.startApply,
        this.$refs.sceneGas,
        {
          ...this.lineOptions,
          startSocket: "bottom",
          endSocket: "top",
          path: "grid"
        }
      );
      this.SCToRSLine = new LeaderLine(
        this.$refs.sceneConfirm,
        this.$refs.remoteSign,
        {
          ...this.lineOptions,
          startSocket: "bottom",
          endSocket: "top",
          path: "grid"
        }
      );
      this.SGToRSLine = new LeaderLine(
        this.$refs.sceneGas,
        this.$refs.remoteSign,
        {
          ...this.lineOptions,
          startSocket: "bottom",
          endSocket: "top",
          path: "grid"
        }
      );
      this.RSToEALine = new LeaderLine(
        this.$refs.remoteSign,
        this.$refs.endApply,
        this.lineOptions
      );
      this.RSToDALine = new LeaderLine(
        this.$refs.remoteSign,
        this.$refs.delayApply,
        {
          ...this.lineOptions,
          startSocket: "bottom",
          endSocket: "left",
          path: "grid"
        }
      );
      this.DAToDSLine = new LeaderLine(
        this.$refs.delayApply,
        this.$refs.delaySign,
        this.lineOptions
      );
      this.DSToEALine = new LeaderLine(
        this.$refs.delaySign,
        this.$refs.endApply,
        {
          ...this.lineOptions,
          startSocket: "bottom",
          endSocket: "right",
          path: "grid"
        }
      );
      this.EAToELine = new LeaderLine(
        this.$refs.endApply,
        this.$refs.end,
        this.lineOptions
      );
      this.lines = [];
      this.lines.push(this.SToSALine);
      this.lines.push(this.SAToSCLine);
      this.lines.push(this.SAToSGLine);
      this.lines.push(this.SCToRSLine);
      this.lines.push(this.SGToRSLine);
      this.lines.push(this.RSToEALine);
      this.lines.push(this.RSToDALine);
      this.lines.push(this.DAToDSLine);
      this.lines.push(this.DSToEALine);
      this.lines.push(this.EAToELine);
    },
    /** 界面尺寸变化监听 */
    sizeMonitor() {
      var elementResizeDetectorMaker = require("element-resize-detector");
      var erd = elementResizeDetectorMaker();
      var that = this;
      erd.listenTo(this.$refs.container, function(element) {
        that.handleLines(that.lines, 2);
      });
    },
    /** 重置线操作
     * @param {Number} type 类型 1-常规逻辑，2-业务逻辑
     */
    resetLines(type = 2) {
      this.$nextTick(() => {
        const SA = this.form.startApply;
        const SAEnable = SA.enable;
        const SG = this.form.sceneGas;
        const SGEnable = SG.enable;
        if (SAEnable) {
          this.handleLine(this.SToSALine, 1);
          this.SAToSCLine.start = this.$refs.startApply;
          this.SAToSGLine.start = this.SAToSCLine.start;
          if (SGEnable) {
            this.handleLines([this.SAToSGLine, this.SGToRSLine], 1);
          } else {
            this.handleLines([this.SAToSGLine, this.SGToRSLine], 0);
          }
        } else {
          this.handleLine(this.SToSALine, 0);
          this.SAToSCLine.start = this.$refs.start;
          this.SAToSGLine.start = this.SAToSCLine.start;
          if (SGEnable) {
            this.handleLines([this.SAToSGLine, this.SGToRSLine], 1);
          } else {
            this.handleLines([this.SAToSGLine, this.SGToRSLine], 0);
          }
        }

        this.handleLines([this.SAToSCLine, this.SCToRSLine], 1);

        const EA = this.form.endApply;
        const EAEnable = EA.enable;
        const E = this.form.end;
        const EEnable = E.enable;
        if (EAEnable) {
          this.RSToEALine.end = this.$refs.endApply;
          this.DSToEALine.endSocket = "right";
          this.DSToEALine.end = this.$refs.endApply;
          this.handleLine(this.RSToEALine, 1);
          this.handleLine(this.EAToELine, EEnable ? 1 : 0);
        } else {
          if (type === 1) {
            if (EEnable) {
              this.RSToEALine.end = this.$refs.end;
              this.DSToEALine.endSocket = "top";
              this.DSToEALine.end = this.$refs.end;
              this.handleLine(this.RSToEALine, 1);
              this.handleLine(this.EAToELine, 0);
            } else {
              this.handleLines(
                [
                  this.RSToEALine,
                  this.RSToDALine,
                  this.DAToDSLine,
                  this.DSToEALine,
                  this.EAToELine
                ],
                0
              );
              this.form.delayApply.enable = false;
              this.form.delaySign.enable = false;
            }
          } else {
            this.handleLines(
              [
                this.RSToEALine,
                this.RSToDALine,
                this.DAToDSLine,
                this.DSToEALine,
                this.EAToELine
              ],
              0
            );
            this.form.delayApply.enable = false;
            this.form.delaySign.enable = false;
            this.form.end.enable = false;
          }
        }

        const DA = this.form.delayApply;
        const DAEnable = DA.enable;
        const DS = this.form.delaySign;
        const DSEnable = DS.enable;
        if (DAEnable) {
          this.RSToDALine.end = this.$refs.delayApply;
          if (DSEnable) {
            this.DSToEALine.start = this.$refs.delaySign;
            this.handleLines(
              [this.RSToDALine, this.DAToDSLine, this.DSToEALine],
              1
            );
          } else {
            this.DSToEALine.start = this.$refs.delayApply;
            this.handleLines([this.RSToDALine, this.DSToEALine], 1);
            this.handleLine(this.DAToDSLine, 0);
          }
        } else {
          if (type === 1) {
            this.handleLine(this.DAToDSLine, 0);
            if (DSEnable) {
              this.DSToEALine.start = this.$refs.delaySign;
              this.RSToDALine.end = this.$refs.delaySign;
              this.handleLines([this.RSToDALine, this.DSToEALine], 1);
            } else {
              this.handleLines([this.RSToDALine, this.DSToEALine], 0);
            }
          } else {
            this.handleLines(
              [this.DAToDSLine, this.RSToDALine, this.DSToEALine],
              0
            );
            this.form.delaySign.enable = false;
          }
        }
        this.handleLines(this.lines, 2);
      });
    },
    /** 🧵相关操作 */
    handleLines(lines, operate) {
      //0-隐藏，1-显示，2-位置调整，3-删除
      lines.forEach(line => {
        this.handleLine(line, operate);
      });
    },
    handleLine(line, operate) {
      if (operate === 0) {
        line.hide("none");
      } else if (operate === 1) {
        line.show("draw", {
          animOptions: {
            duration: 500,
            timing: [0.58, 0, 0.42, 1]
          }
        });
      } else if (operate === 2) {
        line.position();
      } else if (operate === 3) {
        line.remove();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.process-container {
  .el-row {
    margin-bottom: 60px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.process-reset {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  .reset-btns {
    display: inline-block;
  }
}
.process-wrap {
  min-width: 285px;
}
.process-content {
  display: inline-block;
  border-radius: 5px;
  min-width: 200px;
  min-height: 40px;
  font-weight: 700;
  font-size: 15px;
  color: white;
}
.process-tips {
  display: inline-block;
  margin-left: 15px;
}
.content-fix {
  margin-top: -45px;
}
.content-title {
  padding: 12px 12px;
  text-align: center;
}
.title-fix {
  padding-left: 27px;
}
.content-setting {
  float: right;
  margin-top: 2px;
}
</style>
