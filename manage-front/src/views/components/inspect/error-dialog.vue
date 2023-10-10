<template>
  <el-dialog
    title="异常处理"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="800px">
    <el-form :model="form" ref="form" :rules="rules">
      <el-form-item label="处理结果" prop="processResult">
        <el-select
          v-model="form.processResult"
          placeholder="请选择处理结果"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in resultOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.label"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="dataList"
    >
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column
        label="提交时间"
        align="center"
        prop="createTime"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column label="标准值" align="center">
        <template slot-scope="scope">{{
          setValue(scope.row, false)
        }}</template>
      </el-table-column> -->
      <el-table-column label="实际值" align="center">
        <template slot-scope="scope">{{ setValue(scope.row, true) }}</template>
      </el-table-column>
      <el-table-column
        label="现场图片"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <image-viewer
            :ref="'imageViewer' + scope.$index"
            :images="scope.row.fileList"
          ></image-viewer>
          <el-button
            v-if="scope.row.fileList && scope.row.fileList.length"
            class="number"
            size="mini"
            type="text"
            @click="showImages('imageViewer' + scope.$index)"
            >{{ scope.row.fileList.length }}</el-button
          >
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        label="巡检人"
        align="center"
        prop="createUserName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-bind:class="{ active: !scope.row.processStatus }">{{
            !scope.row.processStatus ? "未处理" : "已处理"
          }}</span>
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
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listError, handleError } from "@/api/modules/inspect/error";
import ImageViewer from "@/components/ImageViewer";

export default {
  components: { ImageViewer },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      visible: false,
      // 处理结果列表
      resultOptions: [
        { label: '已处理', value: '1' },
        { label: '生成隐患', value: '2' }
      ],
      // 表单参数
      form: {
        processResult: undefined,
        pointSubitemId: undefined
      },
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        processStatus: 0, // 未处理
        pointId: undefined,
        patrolContent: undefined
      },
      total: 0,
      // 主数据
      dataList: [],
      rules: {
        processResult: [
          { required: true, message: "处理结果不能为空", trigger: "blur"}
        ]
      }
    }
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    /** 重置相关值 */
    setup(params) {
      this.form.processResult = undefined;
      this.form.pointSubitemId = params.pointSubitemId;
      this.queryParams.page = 1;
      this.queryParams.pointId = params.pointId;
      this.queryParams.patrolContent = params.patrolContent;
      this.getList();
    },
    getList() {
      this.loading = true;
      listError(this.queryParams).then(response => {
        const result = response.result;
        this.dataList = result.list;
        this.total = result.totalCount;
        this.loading = false;
      })
    },
    // 根据行数据获取标准值/实时值
    setValue(row, isReal) {
      if (isReal) {
        return row.value ? row.value + (row.unit || "") : "";
      } else {
        return row.stdValue ? row.stdValue + (row.unit || "") : "";
      }
    },
    /** 显示现场图片 */
    showImages(ref) {
      this.$refs[ref].show();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          handleError(this.form.pointSubitemId, this.form.processResult).then(response => {
            this.msgSuccess("处理成功");
            this.$emit("submitSuccess")
              this.visible = false;
          });
        } else {
          return false;
        }
      });
    },
    /** 取消按钮 */
    cancel() {
      this.visible = false;
    }
  }
}
</script>
