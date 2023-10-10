<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          size="mini"
        >
          <el-form-item label="企业名称" prop="compName" v-if="ifGov == 1">
            <el-input v-model="queryParams.compName"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceCategory">
            <el-select v-model="deviceCategory" placeholder="请选择">
              <el-option
                v-for="item in equipmentTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称编号" prop="deviceNo">
            <el-input v-model="queryParams.deviceNo"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleQuery()"
              >搜索</el-button
            >
            <el-button
              type="primary"
              plain
              icon="el-icon-refresh"
              @click="resetQuery()"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <div class="header-title-buttons flex justify-between items-center">
          <div class="title">
            <i class="el-icon-s-operation"></i> 设备信息列表
          </div>
        </div>
        <el-table :data="tableData" :max-height="tableHeight">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          />
          <el-table-column
            v-if="ifGov == 1"
            label="企业名称"
            align="center"
            prop="compName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="设备类型"
            align="center"
            prop="deviceType"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="设备名称编号"
            align="center"
            prop="deviceNo"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="所属危险源"
            align="center"
            prop="hazardName"
            :show-overflow-tooltip="true"
          />
          <el-table-column fixed="right" label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.limit"
          @pagination="getList"
        />
      </el-col>
      <el-col :span="12">
        <transition>
          <Sbzbtb
            v-if="dialogVisible"
            @closeView="handleQuery()"
            ref="Sbzbtb"
          />
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { wxyjcdictindex_API } from "@/api/common/wxyjcdictindex";
import { list_API as cgckxx_API } from "@/api/modules/wxyjc/wxyjcdangeroustank";
import { list_API as zzxx_API } from "@/api/modules/wxyjc/wxyjcdangerousapparatus";
import { list_API as qtxljcdxx_API } from "@/api/modules/wxyjc/wxyjcdangerousgaspoint";
import Sbzbtb from "@/views/components/wxyjc/sbzbtb/sbzbtb";
import { mapState } from "vuex";
export default {
  components: {
    Sbzbtb,
  },
  computed: {
    tableHeight() {
      return this.$store.state.common.tableHeight;
    },
    ...mapState({
      ifGov: (state) => state.user.ifGov,
    }),
  },
  data() {
    return {
      dialogVisible: false,
      queryParams: {
        page: 1,
        limit: 10,
        compName: undefined,
        deviceNo: undefined,
      },
      deviceCategory: "罐",
      tableData: [],
      total: 0,
      equipmentTypeList: [],
    };
  },
  created() {
    wxyjcdictindex_API("device_category").then((res) => {
      let arr = res.result;
      this.equipmentTypeList = arr.filter(item=>{
        return item.value != '库'
      })
      //this.equipmentTypeList = res.result;
      this.getList();
    });
  },
  methods: {
    //搜索
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
      this.dialogVisible = false;
    },
    //重置
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
      this.tableData = [];
      this.total = 0;
    },
    //获取数据
    getList() {
      this.$refs["queryForm"].validate((valid) => {
        if (valid) {
          if (this.deviceCategory == "库") {
            cgckxx_API(this.queryParams).then((res) => {
              this.tableData = res.result.list;
              this.total = res.result.totalCount;
            });
          } else if (this.deviceCategory == "罐") {
            cgckxx_API(this.queryParams).then((res) => {
              this.tableData = res.result.list;
              this.total = res.result.totalCount;
            });
          } else if (this.deviceCategory == "装置") {
            zzxx_API(this.queryParams).then((res) => {
              this.tableData = res.result.list;
              this.total = res.result.totalCount;
            });
          } else if (this.deviceCategory == "气体检测") {
            qtxljcdxx_API(this.queryParams).then((res) => {
              this.tableData = res.result.list;
              this.total = res.result.totalCount;
            });
          }
        }
      });
    },
    handleEdit(row) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        let deviceType;
        if (this.deviceCategory == "库") {
          deviceType = "CG";
        }
        if (this.deviceCategory == "罐") {
          deviceType = "CG";
        }
        if (this.deviceCategory == "装置") {
          deviceType = "ZZ";
        }
        if (this.deviceCategory == "气体检测") {
          deviceType = "QT";
        }
        this.$refs["Sbzbtb"].editTemp(row.id, deviceType, row.deviceNo);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>