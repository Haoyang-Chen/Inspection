<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--搜索数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="摄像头编号" prop="no">
            <el-input
              v-model="queryParams.no"
              placeholder="请输入摄像头编号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="摄像头名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入摄像头名称"
              clearable
              size="small"
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
            <span class="table-title">摄像头管理</span>
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
                :disabled="ids.length <= 0"
                @click="handleDelete"
                >批量删除</el-button
              >
            </div>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="tableData"
          :max-height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column
            label="摄像头编号"
            align="center"
            prop="no"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="摄像头名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="位置描述"
            align="center"
            prop="location"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="摄像头IP地址"
            align="center"
            prop="url"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="厂商"
            align="center"
            prop="company"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="上线时间"
            align="center"
            prop="upDate"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="地图预览" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.lon"
                size="mini"
                type="primary"
                @click="handlePreview(scope.row)"
                >预览位置</el-button
              >
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.row, true)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleEdit(scope.row, false)"
                >查看</el-button
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
      append-to-body
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        class="demo-form"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="设备编号：" prop="no">
              <el-input
                v-model="form.no"
                :disabled="!editable"
                placeholder="请输入设备编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="摄像头名称：" prop="name">
              <el-input
                v-model="form.name"
                :disabled="!editable"
                placeholder="请输入摄像头名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="位置描述：" prop="location">
              <el-input
                v-model="form.location"
                :disabled="!editable"
                placeholder="请输入位置描述"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="厂商：" prop="company">
              <el-input
                v-model="form.company"
                :disabled="!editable"
                :placeholder="editable ? '请输入厂商' : ''"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上线时间：" prop="upDate">
              <el-date-picker
                v-model="form.upDate"
                type="date"
                :disabled="!editable"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :placeholder="editable ? '请选择上线时间' : ''"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地图绑定：" prop="lat">
              <el-button type="primary" size="small" @click="handleLocation">{{
                editable ? "绑 定" : "查看"
              }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="通信信息-设备IP地址：" prop="url">
              <el-input
                v-model="form.url"
                :disabled="!editable"
                placeholder="请输入通信信息-设备IP地址"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="editable" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 地图对话框 -->
    <f-map-dialog
      ref="fmapDialog"
      v-model="showMap"
      :editable="mapEditable"
      width="61.8vw"
      height="61.8vh"
      @completion="handleMapCompletion"
    >
    </f-map-dialog>
  </div>
</template>

<script>
import {
  cameraList,
  delCamera,
  addCamera,
  updateCamera,
} from "@/api/modules/video/camera";
import FMapDialog from "@/components/FMap/fmap-dialog";

export default {
  components: {
    FMapDialog,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 表格数据
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单是否可编辑
      editable: true,
      // 是否正在重新定位
      showMap: false,
      // 地图是否可点击选取经纬度
      mapEditable: false,
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        no: undefined,
        name: undefined,
      },
      // 表单参数
      form: this.initFormData(),
      rules: {
        no: [{ required: true, message: "设备编号不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "摄像头名称不能为空", trigger: "blur" },
        ],
        location: [
          { required: true, message: "位置描述不能为空", trigger: "blur" },
        ],
        lat: [{ required: true, message: "地图绑定未绑定", trigger: "blur" }],
        url: [
          { required: true, message: "设备IP地址不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
  },
  filters: {},
  created() {
    this.getList();
  },
  methods: {
    /** 查询主列表 */
    getList() {
      this.loading = true;
      cameraList(this.queryParams).then((response) => {
        const result = response.result;
        this.tableData = result.list;
        this.total = result.totalCount;
        this.loading = false;
      });
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
      this.open = true;
      this.reset();
      this.editable = true;
      this.title = "添加摄像头";
    },
    /** 编辑按钮操作 */
    handleEdit(row, editable) {
      this.open = true;
      this.form = { ...row };
      this.editable = editable;
      this.title = "修改摄像头";
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id != undefined ? [row.id] : this.ids;
      this.rowsOpRequest(delCamera, ids, "摄像头").then((_) => {
        this.getList();
      });
    },
    /** 预览位置按钮操作 */
    handlePreview(row) {
      this.mapEditable = false;
      this.showMap = true;
      this.$nextTick(() => {
        this.$refs.fmapDialog.setup([row.lon, row.lat]);
      });
    },
    /** 重新定位按钮操作 */
    handleLocation() {
      this.mapEditable = true;
      this.showMap = true;
      this.$nextTick(() => {
        this.$refs.fmapDialog.setup([this.form.lon, this.form.lat]);
      });
    },
    /** 重新定位完成 */
    handleMapCompletion(point) {
      this.form.lon = point[0];
      this.form.lat = point[1];
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          var func = this.form.id ? updateCamera : addCamera;
          func(this.form).then((res) => {
            this.open = false;
            this.msgSuccess(this.form.id ? "编辑成功" : "新增成功");
            this.getList();
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = this.initFormData();
      this.resetForm("form");
    },
    initFormData() {
      return {
        id: undefined,
        no: undefined,
        name: undefined,
        location: undefined,
        company: undefined,
        upDate: undefined,
        lat: undefined,
        lon: undefined,
        url: undefined,
      };
    },
  },
};
</script>
