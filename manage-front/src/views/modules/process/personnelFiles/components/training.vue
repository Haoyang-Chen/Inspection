<template>
  <el-dialog
    title="培训"
    :visible.sync="visible"
    :close-on-click-modal="false"
    append-to-body
    width="1000px"
    :before-close="handleCancel"
  >
    <div class="header-button flex justify-end items-center" v-if="!islock">
      <el-button
        type="primary"
        plain
        size="small"
        @click="addTableData()"
        v-if="isShow"
        >增加</el-button
      >
    </div>

    <el-table :data="tableData" style="width: 100%" size="small">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column label="培训日期" width="240">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.trainDate"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            :editable="false"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column label="培训单位">
        <template slot-scope="scope">
          <el-input v-model="scope.row.trainUnit"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="培训等级">
        <template slot-scope="scope">
          <el-input v-model="scope.row.trainLevel"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="培训结果">
        <template slot-scope="scope">
          <el-input v-model="scope.row.trainResult"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="160"
        label="操作"
        header-align="center"
        align="center"
        v-if="!islock"
      >
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            icon="el-icon-delete"
          >
            移除
          </el-button>
          <el-button
            @click.native.prevent="submitForm(scope.row)"
            type="text"
            icon="el-icon-plus"
          >
            保存
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel()">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  list_API,
  save_API,
  update_API,
  delete_API,
} from "@/api/modules/process/webdeparttrain";
export default {
  name:"training",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    islock: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    },
  },
  data() {
    return {
      isShow: true,
      visible: this.value,
      tableData: [],
      personId: undefined,
    };
  },
  methods: {
    init(params) {
      this.personId = params.personId;
      //获取历史记录
      list_API(params).then((res) => {
        this.tableData = res.result;
      });
    },
    handleCancel() {
      this.visible = false;
      this.reset();
    },
    //重置
    reset() {
      this.personId = undefined;
      this.isShow = true;
      this.tableData = [];
    },
    addTableData() {
      this.isShow = false;
      let arr = {
        trainUnit: undefined, //培训单位
        trainLevel: undefined, //培训等级
        trainDate: undefined, //培训日期
        trainResult: undefined, //培训结果
      };
      this.tableData.push(arr);
    },
    deleteRow(index, row, rows) {
      if (row.id) {
        let ids = [row.id];
        delete_API(ids).then((res) => {
          this.$message({
            message: "删除成功！",
            type: "success",
          });
          rows.splice(index, 1);
        });
      } else {
        this.isShow = true;
        rows.splice(index, 1);
      }
    },
    //提交
    submitForm(row) {
      let params = {
        personId: this.personId,
        ...row,
      };
      if (row.id) {
        update_API(params).then((res) => {
          this.$message({
            message: "修改成功！",
            type: "success",
          });
          this.saveSuccess();
        });
      } else {
        save_API(params).then((res) => {
          this.$message({
            message: "新增成功！",
            type: "success",
          });
          this.saveSuccess();
        });
      }
    },
    saveSuccess() {
      this.visible = false;
      this.$emit("closeView");
      this.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
.header-button {
  margin-bottom: 8px;
}
</style>