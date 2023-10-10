<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-row>
      <el-col v-for="(item, index) in users" :key="index" class="user-item">
        <div
          v-bind:style="{
            'margin-left':
              index != 0
                ? item.error
                  ? '110px'
                  : '60px'
                : item.error
                ? '60px'
                : '25px'
          }"
        >
          <div
            class="item-wrap"
            v-bind:style="{ background: index != 0 ? '#eb7676' : '#566b94' }"
          >
            <div class="content">
              <el-input
                class="node"
                v-model="item.taskName"
                placeholder="请输入节点名称"
                @input="handleChange(index, $event)"
              />
            </div>
            <div class="content">
              <treeselect
                class="user"
                v-model="item.value"
                :options="userOptions"
                :normalizer="userNormalizer"
                :show-count="true"
                :disable-branch-nodes="false"
                :clearable="true"
                :searchable="false"
                :multiple="multiple"
                valueFormat="object"
                value-consists-of="LEAF_PRIORITY"
                noResultsText="未找到结果..."
                placeholder="请选择人员"
                clearAllText="清除"
                @input="handleChange(index, $event)"
              />
            </div>
          </div>
          <div class="item-operate">
            <el-tooltip
              v-if="item.error"
              content="请确保审核节点信息填写完整"
              placement="top-end"
            >
              <el-button
                type="danger"
                icon="el-icon-warning-outline"
                circle
              ></el-button>
            </el-tooltip>
            <el-button
              v-if="index !== 0"
              type="primary"
              icon="el-icon-delete"
              circle
              @click="handleDelete(index)"
            ></el-button>
          </div>
        </div>
        <svg-icon
          v-if="index !== users.length - 1"
          icon-class="long-arrow"
          style="width:80px;height:86px"
        ></svg-icon>
        <el-button
          v-if="index === users.length - 1 && multipleApv"
          type="primary"
          icon="el-icon-plus"
          circle
          style="margin-top:20px"
          @click="handleAdd"
        ></el-button>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { treeUser } from "@/api/modules/sys/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "UserPickerDialog",
  components: { Treeselect },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    // 弹出层宽度
    width: {
      type: String,
      default: "600px"
    },
    // 弹出层标题
    title: {
      type: String,
      default: "选择人员"
    },
    // 是否允许多个审批节点
    multipleApv: {
      type: Boolean,
      default: true
    },
    // 是否允许多个审批人
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 是否显示弹出层-内部
      visible: this.value,
      // 审核人员列表
      users: [],
      // 人员数据
      userOptions: [],
      // 自定义人员树节点key
      userNormalizer(node) {
        return {
          id: node.deptId,
          label: node.name,
          children: node.children
        };
      }
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.visible = val;
      if (val) this.getTree();
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  methods: {
    /** 查询人员树 */
    getTree() {
      treeUser().then(response => {
        this.userOptions = this.formatTree(response.result);
      });
    },
    /** 重置相关值 */
    setup(params) {
      var taskName = params.nodeName || undefined;
      var tasks = params.approveTaskList || [];
      if (tasks.length) {
        tasks.forEach(item => {
          if (item.userIds && item.userIds.length) {
            item.value = item.userIds.map((id, index) => {
              return { deptId: id, name: item.userNames[index] };
            });
            item.error = item.taskName && item.taskName.length ? false : true;
          } else {
            item.value = [];
            item.error = true;
          }
        });
      } else {
        tasks.push({
          taskName,
          userIds: [],
          userNames: [],
          value: [],
          error: true
        });
      }
      this.users = tasks;
    },
    /** 节点名称、人员更改 */
    handleChange(index, value, instanceId) {
      this.users[index].error = this.isError(index);
    },
    /** 添加按钮 */
    handleAdd() {
      this.users.push({
        taskName: undefined,
        userIds: [],
        userNames: [],
        value: [],
        error: true
      });
    },
    /** 删除按钮 */
    handleDelete(index) {
      this.$confirm("是否确认删除所选审核节点？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.users.splice(index, 1);
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.hasError()) {
        this.msgError("请确保审核节点信息填写完整");
        return;
      }
      const data = this.users.map(item => {
        return {
          taskName: item.taskName,
          userIds: item.value.map(m => m.deptId),
          userNames: item.value.map(m => m.name)
        };
      });
      const parseData = JSON.parse(JSON.stringify(data));
      this.$emit("pickSuccess", parseData);
      this.msgSuccess("选择成功");
      this.visible = false;
    },
    // 取消按钮
    cancel() {
      this.$emit("pickCancel");
      this.visible = false;
    },
    /** 错误处理相关 */
    isError(index) {
      const taskName = this.users[index].taskName;
      const users = this.users[index].value;
      if (taskName && taskName.length && users && users.length) {
        return false;
      }
      return true;
    },
    hasError() {
      const errors = this.users.filter(item => item.error);
      if (errors && errors.length) return true;
      return false;
    }
  }
};
</script>

<style lang="scss">
.user-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.item-wrap {
  display: inline-block;
  border-radius: 5px;
  width: 240px;
  min-height: 90px;
  .content {
    padding: 0 20px;
    .node input {
      padding: 0 0;
      height: 45px;
      background: transparent;
      border-radius: 0;
      border: none;
      color: white;
      font-weight: 700;
      font-size: 15px;
      border-bottom: 1px solid white;
    }
    .user .vue-treeselect__control {
      margin-left: -5px;
      background: transparent;
      border: none;
      padding: 5px 0 0 0;
      color: white;
      font-weight: 700;
      font-size: 15px;
      width: auto;
      .vue-treeselect__multi-value {
        margin-left: 6px;
        margin-bottom: 10px;
      }
      .vue-treeselect__x-container {
        padding-right: 10px;
      }
      .vue-treeselect__menu-container {
        margin-top: -2px;
      }
    }
  }
}
.item-operate {
  display: inline-block;
  margin-left: 20px;
}
.item-arrow {
  width: 128px;
  height: 128px;
}
</style>
