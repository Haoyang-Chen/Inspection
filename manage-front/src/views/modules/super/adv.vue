<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="图片名称" prop="fileTitle">
            <el-input
              v-model="queryParams.fileTitle"
              placeholder="请输入图片名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
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
            <span class="table-title">轮播图片列表</span>
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
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="bannerList"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="图片名称"
            align="center"
            prop="fileTitle"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="图片" align="center">
            <template slot-scope="scope">{{
              scope.row.file.fileOrignalName
            }}</template>
          </el-table-column>
          <el-table-column label="位置" align="center">
            <template slot-scope="scope">{{
              locationName(scope.row.location)
            }}</template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span v-bind:class="{ active: !scope.row.status }">{{
                !scope.row.status ? "隐藏" : "显示"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="置顶" align="center">
            <template slot-scope="scope">
              <span v-bind:class="{ active: !scope.row.top }">{{
                !scope.row.top ? "否" : "是"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="跳转链接"
            align="center"
            prop="linkUrl"
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
            <el-form-item label="图片名称:" prop="fileTitle">
              <el-input v-model="form.fileTitle" placeholder="请输入图片名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="图片上传:"
              prop="file"
              :rules="[
                {
                  required: true,
                  validator: validatePhotos,
                  trigger: 'blur'
                }
              ]"
            >
              <uploader
                ref="uploader"
                :multiple="false"
                :limit="1"
                @uploadCompletion="handleUploadCompletion"
              ></uploader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置:" prop="location">
              <el-select
                v-model="form.location"
                placeholder="请选择位置"
                style="width: 180px"
              >
                <el-option
                  v-for="dict in locationOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="置顶:" prop="top">
              <el-select
                v-model="form.top"
                placeholder="请选择是否置顶"
                size="small"
                style="width: 180px"
              >
                <el-option
                  v-for="dict in topOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择状态"
                style="width: 180px"
              >
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="跳转链接:" prop="linkUrl">
              <el-input v-model="form.linkUrl" placeholder="请输入跳转链接" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listBanner,
  addBanner,
  updateBanner,
  delBanner
} from "@/api/modules/super";
import Uploader from "@/components/Uploader";

export default {
  name: "BannerManagement",
  components: { Uploader },
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
      // 轮播图表格数据
      bannerList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 位置数据字典
      locationOptions: [
        {
          label: "APP首页轮播",
          value: "1"
        }
      ],
      // 置顶数据字典
      topOptions: [
        {
          label: "否",
          value: 0
        },
        {
          label: "是",
          value: 1
        }
      ],
      // 状态数据字典
      statusOptions: [
        {
          label: "隐藏",
          value: 0
        },
        {
          label: "显示",
          value: 1
        }
      ],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        fileTitle: undefined
      },
      // 表单校验
      rules: {
        fileTitle: [
          { required: true, message: "图片名称不能为空", trigger: "blur" }
        ],
        location: [
          { required: true, message: "位置不能为空", trigger: "blur" }
        ],
        top: [{ required: true, message: "置顶不能为空", trigger: "blur" }],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    }
  },
  watch: {
    open(val) {
      if (!val) this.setupUploader();
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      listBanner(this.queryParams).then(response => {
        const result = response.result;
        this.bannerList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
    },
    // 根据位置value获取位置label
    locationName(val) {
      return this.locationOptions.find(item => item.value === val).label;
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
        fileTitle: undefined,
        file: undefined,
        location: "1",
        status: 1,
        top: 1,
        linkUrl: undefined
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
      this.title = "添加轮播图";
    },
    /** 编辑按钮操作 */
    handleEdit(row) {
      this.reset();
      this.open = true;
      this.title = "修改轮播图";
      this.form = { ...row };
      this.setupUploader([row.file]);
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup([...fileList]);
      });
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList) {
      this.form.file = fileList && fileList.length ? fileList[0] : undefined;
    },
    /** 图片上传验证 */
    validatePhotos(rule, value, callback) {
      if (!this.form.file || this.form.file == {}) {
        return callback(new Error("图片上传不能为空"));
      }
      callback();
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.formRequest(addBanner, updateBanner, this.form).then(_ => {
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const bannerIds = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delBanner, bannerIds, "轮播图").then(_ => {
        this.getList();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.active {
  color: red;
}
</style>
