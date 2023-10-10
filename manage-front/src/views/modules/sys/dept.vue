<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" :offset="7">
        <el-input class="dept-title" v-model="filterText" placeholder="组织架构"></el-input>
      </el-col>
      <el-col :span="24" :offset="7">
        <el-tree
          ref="deptTree"
          class="tree"
          :data="deptTree"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
        >
          <span class="tree-node" slot-scope="{ node, data }">
            <span>
              <i :class="data.type!==2?'el-icon-files':'el-icon-paperclip'"></i>
              {{ node.label }}
            </span>
            <span>
              <el-button
                v-if="data.type!==2"
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click.stop="append(node,data)"
              >添加</el-button>
              <el-button
                v-if="data.parentId!==0"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click.stop="edit(node,data)"
              >编辑</el-button>
              <el-button
                v-if="data.parentId!==0"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="remove(node, data)"
              >删除</el-button>
            </span>
          </span>
        </el-tree>
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
          <el-col v-show="!editing" :span="24">
            <el-form-item label="父节点名称:" prop="parentName">
              <el-input v-model="form.parentName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类型:" prop="type">
              <el-radio-group v-model="form.type" :disabled="editing">
                <el-radio
                  v-for="dict in typeOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入部门或组名称" />
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
import { treeDept, addDept, updateDept, delDept } from "@/api/modules/sys/dept";

export default {
  name: "DeptManagement",
  data() {
    return {
      // 查询参数
      filterText: "",
      // 部门树数据
      deptTree: [],
      // 树参数映射
      defaultProps: {
        children: "children",
        label: "name",
        id: "deptId"
      },
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否编辑状态
      editing: false,
      // 类型数据字典
      typeOptions: [
        { label: "部门", value: 1 },
        { label: "组", value: 2 }
      ],
      // 当前选中节点
      selectedNode: undefined,
      // 当前选中节点数据
      selectedData: undefined,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [{ required: true, message: "类型不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "部门或组名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    filterText(val) {
      this.$refs.deptTree.filter(val);
    }
  },
  created() {
    this.getTree();
  },
  methods: {
    /** 查询当前用户部门树 */
    getTree() {
      treeDept().then(response => {
        this.deptTree = response.result;
      });
    },
    /** 筛选部门树 */
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    /** 增加节点按钮 */
    append(node, data) {
      this.reset();
      this.open = true;
      this.editing = false;
      this.title = "添加部门或组";
      this.form.type = 1;
      this.form.parentName = data.name;
      this.selectedNode = node;
      this.selectedData = data;
    },
    /** 编辑节点按钮 */
    edit(node, data) {
      this.reset();
      this.open = true;
      this.editing = true;
      this.title = "修改部门或组";
      this.form = {
        parentName: undefined,
        type: data.type,
        name: data.name
      };
      this.selectedNode = node;
      this.selectedData = data;
    },
    /** 删除节点按钮 */
    remove(node, data) {
      this.$confirm("是否删除: " + data.name + "?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delDept(data.deptId);
        })
        .then(() => {
          this.msgSuccess("删除成功");
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.deptId === data.deptId);
          children.splice(index, 1);
          // this.getTree();
        })
        .catch(function() {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.editing) {
            const newData = { ...this.selectedData, name: this.form.name };
            updateDept(newData).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.selectedNode.data.name = this.form.name;
            });
          } else {
            const newChild = {
              parentId: this.selectedData.deptId,
              name: this.form.name,
              type: this.form.type,
              children: []
            };
            addDept(newChild).then(response => {
              this.msgSuccess("添加成功");
              this.open = false;
              this.getTree();
              // if (!this.selectedData.children) {
              //   this.$set(this.selectedData, "children", []);
              // }
              // this.selectedData.children.push(newChild);
            });
          }
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
      this.form = {
        parentName: undefined,
        type: undefined,
        name: undefined
      };
      this.resetForm("form");
    }
  }
};
</script>
<style lang="scss" scoped>
.dept-title {
  width: 40%;
  padding-bottom: 10px;
}
.tree {
  width: 40%;
  overflow-y: auto;
}
.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
