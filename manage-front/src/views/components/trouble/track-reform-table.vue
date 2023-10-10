<template>
  <el-table v-loading="loading" :data="reformList" :max-height="tableHeight">
    <el-table-column label="序号" align="center" type="index" />
    <el-table-column
      :label="major ? '整改情况描述' : '整改情况'"
      align="center"
      :show-overflow-tooltip="true"
    >
      <template slot-scope="scope">
        {{
          major
            ? scope.row.description
            : scope.row.status === 1
            ? "已整改"
            : "未整改"
        }}
      </template>
    </el-table-column>
    <el-table-column
      label="现场拍照"
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
          @click="showImages(scope.$index)"
          >{{ scope.row.fileList.length }}</el-button
        >
        <span v-else>--</span>
      </template>
    </el-table-column>
    <template v-if="!major">
      <el-table-column
        label="整改措施"
        align="center"
        prop="rectification"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="整改资金"
        align="center"
        prop="price"
        :show-overflow-tooltip="true"
      />
    </template>
    <el-table-column
      :label="major ? '检查时间' : '提交时间'"
      align="center"
      :show-overflow-tooltip="true"
    >
      <template slot-scope="scope">
        {{ parseTime(scope.row.checkTime, major ? "{y}-{m}-{d} {h}:{i}:{s}": "{y}-{m}-{d}") }}
      </template>
    </el-table-column>
    <el-table-column
      :label="major ? '检查人' : '整改人'"
      align="center"
      prop="checkUserName"
      :show-overflow-tooltip="true"
    />
  </el-table>
</template>

<script>
import { listTrack, listReform } from "@/api/modules/investigate/trouble";
import ImageViewer from "@/components/ImageViewer";

export default {
  name: "TrackReformTable",
  components: { ImageViewer },
  props: {
    // 是否重大隐患
    major: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 整改记录表格数据
      reformList: null
    };
  },
  computed: {
    /** 主表高度 */
    tableHeight() {
      return this.$store.state.common.tableHeight;
    }
  },
  watch: {},
  created() {},
  methods: {
    /** 重置相关值 */
    setup(taskId) {
      this.loading = true;
      const listFunc = this.major ? listTrack : listReform;
      listFunc(taskId).then(response => {
        const result = response.result;
        this.reformList = result;
        this.loading = false;
        this.$emit(
          "latestRecordChange",
          this.reformList && this.reformList.length ? this.reformList[0] : {}
        );
      });
    },
    /** 显示现场图片 */
    showImages(index) {
      this.$refs["imageViewer" + index].show();
    }
  }
};
</script>
