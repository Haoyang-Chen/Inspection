<template>
  <div>
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="隐患描述" prop="description">
            <el-input
              v-model="queryParams.description"
              placeholder="请输入隐患描述"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="隐患大类" prop="mainClass">
            <el-select
              v-model="queryParams.mainClass"
              placeholder="请选择隐患大类"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="隐患等级" prop="level">
            <el-select
              v-model="queryParams.level"
              placeholder="请选择隐患等级"
              clearable
              size="small"
              style="width: 145px"
            >
              <el-option
                v-for="dict in levelOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
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
            <span class="table-title">隐患基础库列表</span>
            <div style="float:right;">
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
              <el-button
                type="primary"
                icon="el-icon-download"
                size="mini"
                :disabled="total <= 0"
                @click="handleExport"
                >导出到Excel</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="troubleList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="隐患描述"
            align="center"
            prop="description"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="隐患大类"
            align="center"
            prop="mainClass"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="隐患等级"
            align="center"
            prop="level"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ levelName(scope.row.level) }}
            </template>
          </el-table-column>
          <el-table-column
            label="整改措施"
            align="center"
            prop="rectification"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="更新时间"
            align="center"
            prop="updateTime"
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
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="隐患描述:" prop="description">
              <el-input
                v-model="form.description"
                placeholder="请输入隐患描述"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="隐患大类:" prop="mainClass">
              <el-select
                v-model="form.mainClass"
                clearable
                placeholder="请选择隐患大类"
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
                :disabled="!form.mainClass"
                clearable
                placeholder="请选择细分类别"
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
          <el-col :span="24">
            <el-form-item label="参考依据:" prop="reference">
              <el-input
                v-model="form.reference"
                type="textarea"
                placeholder="请输入参考依据"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="整改措施:" prop="rectification">
              <el-input
                v-model="form.rectification"
                type="textarea"
                placeholder="请输入整改措施"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="主要危害:" prop="harmList">
              <el-select
                v-model="form.harmList"
                clearable
                multiple
                collapse-tags
                placeholder="请选择主要危害"
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
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <upload-dialog
      v-model="uploading"
      actionUri="/trouble/upload"
      :templateFunc="templateFunc"
      @uploadCompletion="handleUploadCompletion"
    ></upload-dialog>
  </div>
</template>

<script>
import {
  listTrouble,
  addTrouble,
  updateTrouble,
  delTrouble,
  templateTrouble,
  exportTrouble
} from "@/api/modules/trouble";
import UploadDialog from "@/components/UploadDialog";

export default {
  name: "TroubleBasis",
  components: { UploadDialog },
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
      // 隐患表格数据
      troubleList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示上传弹出层
      uploading: false,
      // 下载模板请求
      templateFunc: () => {
        this.templateRequest(templateTrouble, "隐患基础库信息导入模板");
      },
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        description: undefined,
        mainClass: undefined,
        level: undefined
      },
      // 表单校验
      rules: {
        description: [
          { required: true, message: "隐患描述不能为空", trigger: "blur" }
        ],
        mainClass: [
          { required: true, message: "隐患大类不能为空", trigger: "blur" }
        ],
        level: [
          { required: true, message: "隐患等级不能为空", trigger: "blur" }
        ],
        reference: [
          { required: true, message: "参考依据不能为空", trigger: "blur" }
        ],
        rectification: [
          { required: true, message: "整改措施不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
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
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listTrouble(this.queryParams).then(response => {
        const result = response.result;
        this.troubleList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据隐患等级value获取label
    levelName(val) {
      const level = this.levelOptions.find(item => item.value === val);
      return level ? level.label : "";
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
        description: undefined,
        mainClass: undefined,
        subClass: "",
        level: undefined,
        reference: undefined,
        rectification: undefined,
        harmList: []
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加隐患";
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = "修改隐患";
      this.form = { ...row };
    },
    /** 隐患库选中回调 */
    handleLibrarySelect(data) {
      this.form.description = data.description;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formRequest(addTrouble, updateTrouble, this.form).then(_ => {
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const troubleIds = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delTrouble, troubleIds, "隐患").then(_ => {
        this.getList();
      });
    },
    /** 导入按钮操作 */
    handleImport() {
      this.uploading = true;
    },
    // 文件上传完成处理
    handleUploadCompletion(response) {
      this.getList();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.exportRequest(
        exportTrouble,
        this.queryParams,
        "隐患基础库记录",
        "隐患基础库"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.tips {
  background: #fffadd;
  height: 60px;
  padding: 14px 14px;
  margin: 10px 0;
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
</style>
