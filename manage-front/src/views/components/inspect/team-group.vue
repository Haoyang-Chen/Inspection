<template>
  <el-table :data="groupList" class="team-group">
    <el-table-column label="序号" align="center" type="index" />
    <el-table-column label="班组" align="center">
      <template slot-scope="scope">
        <treeselect
          v-model="scope.row.teamId"
          :options="deptOptions"
          :normalizer="deptNormalizer"
          :show-count="true"
          :disable-branch-nodes="false"
          :clearable="false"
          :searchable="true"
          :disabled="disabled"
          noResultsText="未找到结果..."
          placeholder="请选择班组"
          clearAllText="清除"
          style="max-width:240px;"
          @select="deptSelect(scope.$index, $event)"
        />
      </template>
    </el-table-column>
    <el-table-column label="人员" align="center">
      <template slot-scope="scope">
        <el-select
          :value="getSelectUser(scope.row)"
          :disabled="disabled"
          multiple
          filterable
          collapse-tags
          placeholder="请选择人员"
          @click.native="getUserList(scope.$index, scope.row.teamId)"
          @input="handleUserChange(scope.$index, $event)"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userName"
            :label="item.userName"
            :value="item.userName"
          ></el-option>
        </el-select>
      </template>
    </el-table-column>
    <!-- <el-table-column label="排序" align="center" width="90">
      <template slot-scope="scope">
        <el-input-number
          v-model="scope.row.sort"
          :min="1"
          :precision="0"
          :disabled="disabled || type !== 1"
          controls-position="right"
          style="width:80px"
        ></el-input-number>
      </template>
    </el-table-column> -->
    <el-table-column v-if="!disabled && type === 1" align="center" width="90">
      <template slot-scope="scope">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          circle
          @click="addGroup(scope.$index)"
        ></el-button>
        <el-button
          v-if="groupList.length > 1"
          type="danger"
          icon="el-icon-minus"
          size="mini"
          circle
          @click="delGroup(scope.$index)"
        ></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { baseGroupLine } from "@/api/modules/inspect/task";
import { treeDept } from "@/api/modules/sys/dept";
import { listDeptUser } from "@/api/modules/sys/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "TeamGroup",
  components: { Treeselect },
  props: {
    // 巡检班组表格数据
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    // 状态 1-可编辑
    status: {
      type: Number,
      default: 1
    },
    // 类型 1-可添加
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 巡检班组表格数据-内部
      groupList: this.value || [],
      // 部门树数据
      deptOptions: [],
      // 用户数据
      userOptions: [],
      // 自定义部门树节点key
      deptNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children
        };
      }
    };
  },
  computed: {
    /** 是否可编辑 */
    disabled() {
      // return this.status !== 1;
      return false;
    }
  },
  watch: {
    value(val) {
      this.groupList = val || [];
    },
    groupList(val) {
      this.$emit("input", val);
    }
  },
  created() {
    this.getTree();
  },
  methods: {
    /** 查询当前用户部门树 */
    getTree() {
      treeDept().then(response => {
        this.deptOptions = this.formatTree(response.result);
      });
    },
    /** 部门选择 */
    deptSelect(index, node, instanceId) {
      console.log(111)
      this.groupList[index].teamName = node.name;
      if (node.deptId !== this.groupList[index].teamId) {
        this.groupList[index].users = [];
      }
    },
    getSelectUser(row) {
      return row.users.map(item => {
        return item.userName;
      });
    },
    /** 查人员列表 */
    getUserList(index, deptId) {
      if (deptId) {
        listDeptUser(deptId)
          .then(response => {
            const result = response.result;
            this.userOptions = result.list.map(item => {
              return { userId: item.userId, userName: item.name };
            });
          })
          .catch(_ => {
            this.userOptions = [];
          });
      } else {
        this.userOptions = [];
      }
    },
    handleUserChange(index, users) {
      this.groupList[index].users = this.userOptions.filter(item => {
        return users.includes(item.userName);
      });
    },
    // 新增巡检班组
    addGroup(index) {
      this.groupList.splice(index + 1, 0, { ...baseGroupLine });
    },
    // 删除巡检班组
    delGroup(index) {
      this.$confirm("是否确认删除所选巡检班组？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.groupList.splice(index, 1);
      });
    }
  }
};
</script>

<style lang="scss">
.team-group .el-table__body-wrapper {
  overflow: visible;
}
.team-group {
  overflow: visible;
  .cell {
    overflow: visible;
  }
  .vue-treeselect__single-value {
    color: #606266;
  }
  .vue-treeselect--disabled .vue-treeselect__single-value {
    color: #c0c4cc;
  }
}
</style>
