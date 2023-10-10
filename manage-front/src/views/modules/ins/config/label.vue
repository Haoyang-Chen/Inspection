<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <!-- <el-form-item label="标签编码" prop="code">
            <el-input
              v-model="queryParams.code"
              placeholder="请输入标签编码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item> -->
          <el-form-item label="标签名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入标签名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
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
              style="width:200px;"
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
            <span class="table-title">标签管理列表</span>
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
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="labelList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="标签编码"
            align="center"
            prop="code"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="标签名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="绑定检点"
            align="center"
            prop="deviceName"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope" v-if="scope.row.deviceName">
              <div v-for="(item, index) in scope.row.deviceName.split(',')" :key="index">
                {{item}}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="位置" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.posX != null && scope.row.posX > 0"
                size="mini"
                type="primary"
                @click="handlePreview(scope.row)"
              >预览位置</el-button
              >
              <span v-else>--</span>
            </template>
          </el-table-column>
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
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="标签编码:"
              :required="version !== 2"
              :rules="[
                {
                  required: version !== 2,
                  message: '标签编码不能为空',
                  trigger: 'blur'
                }
              ]"
              prop="code"
            >
              <el-input v-model="form.code" placeholder="请输入标签编码" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标签名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入标签名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标签描述:" prop="descript">
              <el-input
                v-model="form.descript"
                type="textarea"
                placeholder="请输入标签描述"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
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
                @input="deptSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="位置:" :required="version === 2">
              <el-col :span="9">
                <el-form-item
                  :rules="[
                    {
                      required: version === 2,
                      message: '经度不能为空',
                      trigger: 'change'
                    }
                  ]"
                  prop="posX"
                >
                  <span>x:</span>
                  <el-input-number
                    v-model="form.posX"
                    :min="0"
                    :max="180"
                    :precision="6"
                    :step="0.01"
                    controls-position="right"
                    placeholder="请输入经度"
                    style="width:145px"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  :rules="[
                    {
                      required: version === 2,
                      message: '纬度不能为空',
                      trigger: 'change'
                    }
                  ]"
                  prop="posY"
                >
                  <span>y:</span>
                  <el-input-number
                    v-model="form.posY"
                    :min="0"
                    :max="90"
                    :precision="6"
                    :step="0.01"
                    controls-position="right"
                    placeholder="请输入纬度"
                    style="width:145px"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-button type="primary" @click="handleLocation"
              >重新定位</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="具体位置描述:" prop="posDescript">
              <el-input
                v-model="form.posDescript"
                type="textarea"
                placeholder="请输入具体位置描述"
              />
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
      actionUri="/ins-label/upload"
      :templateFunc="templateFunc"
      @uploadCompletion="handleUploadCompletion"
    ></upload-dialog>

    <!-- 地图对话框 -->
    <map-dialog
      ref="mapDialog"
      v-model="showMap"
      :editable="mapEditable"
      width="61.8vw"
      height="61.8vh"
      @completion="handleMapCompletion"
    ></map-dialog>
  </div>
</template>

<script>
  import {
    listLabel,
    addLabel,
    updateLabel,
    delLabel,
    templateLabel
  } from "@/api/modules/inspect/label";
  import UploadDialog from "@/components/UploadDialog";
  import MapDialog from "@/components/MapDialog";
  import { listTeam } from "@/api/modules/sys/dept";
  import { deptTree } from "@/api/modules";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "LabelManagement",
    components: { UploadDialog, MapDialog, Treeselect},
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
        // 标签表格数据
        labelList: null,
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
            children: node.children
          };
        },
        // 下载模板请求
        templateFunc: () => {
          this.templateRequest(templateLabel, "标签信息导入模板");
        },
        // 是否正在重新定位
        showMap: false,
        // 地图是否可点击选取经纬度
        mapEditable: false,
        // 表单参数
        form: {
          deptId: null
        },
        // 查询参数
        queryParams: {
          page: 1,
          limit: 10,
          code: undefined,
          name: undefined,
          searchDeptId: undefined
        },
        // 表单校验
        rules: {
          name: [{ required: true, message: "标签名称不能为空", trigger: "blur" }]
        }
      };
    },
    computed: {
      /** 软件版本 */
      version() {
        return this.$store.state.user.version;
      },
      /** 主表高度 */
      tableHeight() {
        return this.$store.state.common.tableHeight;
      }
    },
    created() {
      this.getList();
      this.getDeptTree();

    },
    methods: {
      /** 查询主列表 */
      getList() {
        this.loading = true;
        listLabel(this.queryParams).then(response => {
          const result = response.result;
          this.labelList = result.list;
          this.total = result.totalCount;
          this.loading = false;
        });
      },
      /** 查询当前用户部门树 */
      getDeptTree() {
        deptTree().then(response => {
          this.deptOptions = this.formatTree(response.result);
        });
      },
      /** 查询班组列表 */
      getTeamList(deptId, isDeptChange = false) {
        if (deptId != undefined) {
          listTeam(deptId).then(response => {
            const result = response.result.map(item => {
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
      deptSelect(node, instanceId) {
        // if (this.form.deptId !== node.deptId) {
        //   this.form.deptId = node.deptId;
        //   this.getTeamList(node.deptId, true);
        // }
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
          code: undefined,
          name: undefined,
          descript: undefined,
          posX: undefined,
          posY: undefined,
          posDescript: undefined,
          deptIdList: undefined
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
      /** 预览位置按钮操作 */
      handlePreview(row) {
        this.reset();
        this.mapEditable = false;
        this.showMap = true;
        this.setForm(row);
        this.setMapCenter();
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加标签";
      },
      /** 编辑按钮操作 */
      handleEdit(row) {
        this.reset();
        this.open = true;
        this.title = "修改标签";
        this.setForm(row);
        this.form.deptId = row.deptId !== 0 ? row.deptId : undefined
        // this.getTeamList(this.form.deptId);
      },

      /** 根据行数据设置表单 */
      setForm(row) {
        this.form = { ...row };
        if (!row.posX || row.posX.length <= 0) {
          this.form.posX = undefined;
        }
        if (!row.posY || row.posY.length <= 0) {
          this.form.posY = undefined;
        }
      },
      /** 重新定位按钮操作 */
      handleLocation() {
        this.mapEditable = true;
        this.showMap = true;
        this.setMapCenter();
      },
      /** 重新定位完成 */
      handleMapCompletion(point) {
        this.form.posX = point.lng;
        this.form.posY = point.lat;
      },
      /** 设置地图中心点 */
      setMapCenter() {
        this.$nextTick(() => {
          this.$refs.mapDialog.setup({
            lng: this.form.posX,
            lat: this.form.posY
          });
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.formRequest(addLabel, updateLabel, this.form).then(_ => {
              this.open = false;
              this.getList();
            });
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const labelIds = row.id != undefined ? [row.id] : this.ids;
        this.rowsOpRequest(delLabel, labelIds, "标签").then(_ => {
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
  /deep/ .vue-treeselect__control {
    line-height: 32px;
    height: 32px;
  }
  /deep/.vue-treeselect__placeholder, /deep/ .vue-treeselect__single-value {
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
</style>
