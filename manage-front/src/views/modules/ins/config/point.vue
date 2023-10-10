<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="检点类型" prop="pointType">
            <el-select
              v-model="queryParams.pointType"
              placeholder="请选择检点类型"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in pointTypeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="检点名称" prop="deviceName">
            <el-input
              v-model="queryParams.deviceName"
              placeholder="请输入检点名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceType">
            <el-select
              v-model="queryParams.deviceType"
              placeholder="请选择设备类型"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in deviceTypeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="管理部门" prop="searchDeptId">
            <treeselect
              v-model="queryParams.searchDeptId"
              :multiple="false"
              :options="deptOptions"
              :normalizer="deptNormalizer"
              :show-count="true"
              :disable-branch-nodes="false"
              :flat="true"
              :clearable="false"
              :searchable="true"
              noResultsText="未找到结果..."
              placeholder="请选择部门"
              clearAllText="清除"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="24" class="mb8">
          <el-col>
            <span class="table-title">检点管理列表</span>
            <div style="float: right">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                >新增</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                >删除</el-button
              >
              <el-button
                type="primary"
                icon="el-icon-upload2"
                size="mini"
                @click="handleImport"
                >从Excel导入</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="pointList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="检点类型" align="center">
            <template slot-scope="scope">{{
              pointTypeName(scope.row.pointType)
            }}</template>
          </el-table-column>
          <el-table-column
            label="绑定标签"
            align="center"
            prop="labelName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="检点名称"
            align="center"
            prop="deviceName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="设备类型" align="center">
            <template slot-scope="scope">{{
              deviceTypeName(scope.row.deviceType)
            }}</template>
          </el-table-column>
          <el-table-column
            label="检查内容"
            align="center"
            prop="checkNameStr"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="管理部门"
            align="center"
            prop="deptName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="900px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="检点类别:" prop="pointType">
              <el-radio-group v-model="form.pointType">
                <el-radio
                  v-for="dict in pointTypeOptions"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="需要巡检:" prop="requireFlag">
              <el-switch v-model="form.requireFlag"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="绑定标签:" prop="bindLabel">
              <el-radio v-model="form.bindLabel" :label="true">是</el-radio>
              <el-radio v-model="form.bindLabel" :label="false">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :rules="[
                {
                  required: form.bindLabel,
                  message: '标签名称不能为空',
                  trigger: 'change',
                },
              ]"
              label="绑定标签:"
              prop="labelName"
            >
              <el-select
                v-model="form.labelName"
                filterable
                placeholder="请输入搜索关键字"
                style="width: 240px"
                @input="handleLabelSelect"
              >
                <el-option
                  v-for="item in labelOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="form.pointType === 1 ? '设备名称:' : '检查项:'"
              :rules="[
                {
                  required: true,
                  message:
                    form.pointType === 1
                      ? '设备名称不能为空'
                      : '检查项不能为空',
                  trigger: 'blur',
                },
              ]"
              prop="deviceName"
            >
              <el-input
                v-model="form.deviceName"
                :placeholder="
                  form.pointType === 1 ? '请输入设备名称' : '请输入检查项'
                "
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理部门:" prop="deptIdList">
              <treeselect
                v-model="form.deptIdList"
                :multiple="true"
                :options="deptOptions"
                :normalizer="deptNormalizer"
                :show-count="true"
                :disable-branch-nodes="false"
                :flat="true"
                :clearable="false"
                :searchable="true"
                noResultsText="未找到结果..."
                placeholder="请选择部门"
                clearAllText="清除"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="form.pointType === 1" :span="12">
            <el-form-item label="设备类型:" prop="deviceType">
              <el-radio-group v-model="form.deviceType">
                <el-radio
                  v-for="dict in deviceTypeOptions"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(point, index) in form.insPointSubList" :key="index">
          <el-col :span="24">
            <hr style="margin-bottom: 20px; border: #d3d3d3 1px dashed" />
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="巡检内容:"
              :prop="'insPointSubList.' + index + '.name'"
              :rules="rules.checkName"
            >
              <el-input
                v-model="point.name"
                placeholder="请输入巡检内容"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="需要拍照:" prop="isPhoto">
              <el-radio :label="true" v-model="point.isPhoto">是</el-radio>
              <el-radio :label="false" v-model="point.isPhoto">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item
              label="  "
              label-width="10px"
              :prop="'insPointSubList.' + index + '.type'"
              :rules="rules.type"
            >
              <el-select
                v-model="point.type"
                style="width: 90px"
                @change="handleType(point, index)"
              >
                <el-option
                  label="数值"
                  :value="1"
                ></el-option>
                <el-option label="状态" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              circle
              style="margin-left: 15px; margin-top: 5px"
              @click="handleFormAdd()"
            ></el-button>
            <el-button
              v-if="form.insPointSubList.length > 1"
              type="danger"
              icon="el-icon-minus"
              size="mini"
              circle
              @click="handleFormDel(index)"
            ></el-button>
          </el-col>

          <el-col v-if="point.type === 1" :span="6">
            <el-form-item
              label="最小值:"
              label-width="75px"
              :prop="'insPointSubList.' + index + '.minValue'"
            >
              <el-input v-model="point.minValue" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="point.type === 1" :span="6">
            <el-form-item
              label="最大值:"
              label-width="75px"
              :prop="'insPointSubList.' + index + '.maxValue'"
            >
              <el-input v-model="point.maxValue" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col v-if="point.type === 1" :span="6">
            <el-form-item
              label="标准值:"
              :prop="'insPointSubList.' + index + '.stdValue'"
            >
              <el-input v-model="point.stdValue" size="mini"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col v-if="point.type === 1" :span="6">
            <el-form-item
              label="单位:"
              label-width="75px"
              :prop="'insPointSubList.' + index + '.unit'"
              :rules="rules.unit"
            >
              <el-select
                v-model="point.unit"
                size="mini"
                placeholder="请选择单位"
                style="width: 120px"
              >
                <el-option
                  v-for="item in unitOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="point.type === 2" :span="24">
            <el-form-item
              label="选择项:"
              :prop="'insPointSubList.' + index + '.value'"
              :rules="{
                required: true,
                message: '选择项不能为空',
                trigger: 'blur',
              }"
            >
              <el-input
                v-model="point.value"
                type="textarea"
                placeholder="多个用分号隔开，例如：正常;异常"
                autosize
                @change="handleFormChange(point, index)"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="point.type === 2" :span="12">
            <el-form-item
              label="标准值:"
              :prop="'insPointSubList.' + index + '.stdValue'"
            >
              <el-select v-model="point.stdValue" placeholder="请选择标准值">
                <el-option
                  v-for="item in point.stdValueOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="form.id == undefined"
          @click="submitContinue"
          >保存并继续</el-button
        >
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <upload-dialog
      v-model="uploading"
      actionUri="/ins-point/upload"
      :templateFunc="templateFunc"
      @uploadCompletion="handleCompletion"
    ></upload-dialog>
  </div>
</template>

<script>
import {
  listPoint,
  getPoint,
  addPoint,
  updatePoint,
  delPoint,
  templatePoint,
} from "@/api/modules/inspect/point";
import { listLabel } from "@/api/modules/inspect/label";
import { listUnit } from "@/api/modules/super/dict";
import UploadDialog from "@/components/UploadDialog";
import { listTeam } from "@/api/modules/sys/dept";
import { deptTree } from "@/api/modules";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "PointManagement",
  components: { UploadDialog, Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 检点表格数据
      pointList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示上传弹出层
      uploading: false,
      // 部门数据字典
      deptOptions: [],
      // 自定义部门树节点key
      deptNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children,
        };
      },
      // 下载模板请求
      templateFunc: () => {
        this.templateRequest(templatePoint, "检点信息导入模板");
      },
      // 数值单位
      unitOptions: null,
      // 绑定标签
      labelOptions: null,
      // 表单参数
      form: {
        deptId: undefined,
      },
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        pointType: undefined,
        deviceName: undefined,
        deviceType: undefined,
        searchDeptId: undefined,
      },
      // 表单校验
      rules: {
        pointType: [
          { required: true, message: "检点类别不能为空", trigger: "blur" },
        ],
        deviceType: [
          { required: true, message: "设备类型不能为空", trigger: "blur" },
        ],
        checkName: [
          { required: true, message: "巡检内容不能为空", trigger: "blur" },
        ],
        type: [
          {
            required: true,
            message: "巡检内容类型不能为空",
            trigger: "change",
          },
        ],
        unit: [{ required: true, message: "单位不能为空", trigger: "blue" }],
      },
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    /** 检点类型 */
    pointTypeOptions() {
      return this.$store.state.common.pointTypes;
    },
    /** 设备类型 */
    deviceTypeOptions() {
      return this.$store.state.common.deviceTypes;
    },
  },
  watch: {
    "form.labelName": function (val) {
      if (val == undefined || val.length <= 0) {
        this.form.labelId = undefined;
      }
    },
  },
  created() {
    this.getList();
    this.getLabels();
    this.getUnits();
    this.getDeptTree();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listPoint(this.queryParams).then((response) => {
        const result = response.result;
        this.pointList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    /** 查询当前用户部门树 */
    getDeptTree() {
      deptTree().then((response) => {
        this.deptOptions = this.formatTree(response.result);
      });
    },
    /** 查询班组列表 */
    getTeamList(deptId, isDeptChange = false) {
      if (deptId != undefined) {
        listTeam(deptId).then((response) => {
          const result = response.result.map((item) => {
            return { teamId: item.deptId, name: item.name };
          });
          this.teamOptions = result;
          if (isDeptChange) {
            this.form.teamId = undefined;
          }
        });
      } else {
        this.teamOptions = [];
      }
    },
    /** 部门选择 */
    // deptSelect(node, instanceId) {
    //   if (this.form.deptId !== node.deptId) {
    //     this.form.deptId = node.deptId;
    //     this.getTeamList(node.deptId, true);
    //   }
    // },
    /** 查询标签 */
    getLabels() {
      listLabel({ limit: 100000 }).then((response) => {
        const result = response.result;
        this.labelOptions = result.list;
      });
    },
    /** 查询数值单位 */
    getUnits() {
      listUnit({ limit: 1000000 }).then((response) => {
        const result = response.result;
        this.unitOptions = result.list;
      });
    },
    // 根据版本value获取检点类型label
    pointTypeName(val) {
      return this.pointTypeOptions.find((item) => item.value === val).label;
    },
    // 根据版本value获取设备类型label
    deviceTypeName(val) {
      return this.deviceTypeOptions.find((item) => item.value === val).label;
    },
    /** */
    handleType(point, index) {
      if (point.type === 1) {
        this.form.insPointSubList[index].stdValue = undefined;
        this.form.insPointSubList[index].value = undefined;
        this.form.insPointSubList[index].stdValueOptions = undefined;
      } else {
        this.form.insPointSubList[index].maxValue = undefined;
        this.form.insPointSubList[index].minValue = undefined;
        this.form.insPointSubList[index].unit = undefined;
        this.form.insPointSubList[index].stdValue = "正常";
        this.form.insPointSubList[index].value = "正常;异常";
        this.form.insPointSubList[index].stdValueOptions = ["正常", "异常"];
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        pointType: 1,
        requireFlag: true,
        bindLabel: true,
        labelId: undefined,
        labelName: undefined,
        deviceName: undefined,
        deviceType: 1,
        insPointSubList: undefined,
        deptIdList: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加检点";
      this.handleFormAdd();
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = "修改检点";
      getPoint(row.id).then((response) => {
        const result = response.result;
        result.deptId = result.deptId !== 0 ? result.deptId : undefined;
        this.form = { ...result, bindLabel: row.labelId ? true : false };
        for (var i = 0; i < result.insPointSubList.length; i++) {
          this.form.insPointSubList[i].stdValueOptions =
            result.insPointSubList[i].valueList;
        }
      });
    },
    /** 选择项修改 */
    handleFormChange(point, index) {
      if (point.value.indexOf("；") !== -1) {
        point.stdValueOptions = point.value.split("；");
      } else {
        point.stdValueOptions = point.value.split(";");
      }
      this.form.insPointSubList[index].stdValueOptions = point.stdValueOptions;
      if (
        point.stdValueOptions.indexOf(
          this.form.insPointSubList[index].stdValue
        ) < 0
      ) {
        this.form.insPointSubList[index].stdValue = "";
      }
    },
    /** 添加巡检内容 */
    handleFormAdd() {
      if (this.form.insPointSubList == undefined) {
        this.form.insPointSubList = [];
      }
      this.form.insPointSubList.push({
        name: undefined,
        type: undefined,
        maxValue: undefined,
        minValue: undefined,
        value: "正常;异常",
        unit: undefined,
        isPhoto: true,
        stdValue: "正常",
        stdValueOptions: ["正常", "异常"],
      });
    },
    /** 删除巡检内容 */
    handleFormDel(index) {
      this.$confirm("是否确认删除所选巡检内容？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.form.insPointSubList.splice(index, 1);
      });
    },
    /** 选择标签 */
    handleLabelSelect(name) {
      this.form.deviceName = name;
      var labelObject = this.labelOptions.find((item) => item.name === name);
      this.form.labelId = labelObject.id;
      this.form.deptIdList = labelObject.deptIdList;
    },
    /** 保存并继续按钮 */
    submitContinue: function () {
      this.handleSubmit(false);
    },
    /** 提交按钮 */
    submitForm: function () {
      this.handleSubmit();
    },
    handleSubmit(isFinish = true) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const data = { ...this.form };
          if (!this.form.bindLabel) {
            data.labelId = undefined;
            data.labelName = undefined;
          }
          console.log(data);
          // if (data.deptIdList && data.deptIdList.length > 0) {
          //   let arr;
          //   let newArr = [];
          //   data.deptIdList.forEach(deptId => {
          //     arr = this.deptOptions.filter(s=>{
          //       return s.deptId == deptId
          //     })
          //     newArr = newArr.concat(arr);
          //   });
          //   console.log(newArr)
          // }
          
          //return false;
          this.formRequest(addPoint, updatePoint, data).then((_) => {
            if (!isFinish) {
              this.reset();
              this.handleFormAdd();
            }
            this.open = !isFinish;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const pointIds = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delPoint, pointIds, "检点").then((_) => {
        this.getList();
      });
    },
    /** 导入按钮操作 */
    handleImport() {
      this.uploading = true;
    },
    // 文件上传完成处理
    handleCompletion(response) {
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.tips {
  background: #fffadd;
  height: 60px;
  padding: 14px 14px;
  margin: 10px 0;
}
/deep/ .vue-treeselect__control {
  line-height: 32px;
  height: 32px;
}
/deep/.vue-treeselect__placeholder,
/deep/ .vue-treeselect__single-value {
  line-height: 32px;
}
</style>
<style lang="scss">
.upload {
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: auto;
    }
  }
}
/deep/ .vue-treeselect__control {
  line-height: 32px;
  height: 32px;
}
/deep/.vue-treeselect__placeholder,
/deep/ .vue-treeselect__single-value {
  line-height: 32px;
}
</style>
