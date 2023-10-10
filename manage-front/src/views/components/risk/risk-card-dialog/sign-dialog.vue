<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="width"
    :close-on-click-modal="false"
    append-to-body
  >
    <sign-display v-model="selectSigns" @delete="handleDelete"></sign-display>
    <el-radio-group v-model="type">
      <el-radio :label="1">系统库图标</el-radio>
      <el-radio :label="2">自定义图标</el-radio>
    </el-radio-group>
    <div v-show="type === 1" style="margin-top:20px">
      <el-collapse v-model="selectTab" accordion>
        <el-collapse-item
          v-for="(item, index) in signList"
          :key="index"
          :title="item.name"
          :name="item.color"
        >
          <sign-picker
            v-model="item.icons"
            :editable="!disable"
            @change="handleSignChange"
          ></sign-picker>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-show="type === 2" style="margin-top:20px">
      <uploader
        ref="uploader"
        listType="text"
        :showFileList="false"
        @uploadCompletion="handleUploadCompletion"
      ></uploader>
      <sign-picker
        v-model="signUploads"
        :editable="!disable"
        @change="handleSignChange"
      ></sign-picker>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listSign } from "@/api/modules/risk/sign";
import SignDisplay from "./sign-display";
import SignPicker from "./sign-picker";
import Uploader from "@/components/Uploader";

export default {
  name: "SignDialog",
  components: { SignDisplay, SignPicker, Uploader },
  props: {
    // 是否打开弹出层
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "更改警示标志"
    },
    width: {
      type: String,
      default: "840px"
    },
    riskId: {},
    selects: {
      type: Array
    }
  },
  data() {
    return {
      // 警示标志展示数据
      signOpts: [
        { name: '指令标志', value: 'blue' },
        { name: '警告标志', value: 'yellow' },
        { name: '禁止标志', value: 'red' }
      ],
      // 警示标志上传数据
      signUploads: [],
      // 当前选中collapse
      selectTab: 'blue',
      // 是否显示弹出层-内部
      visible: this.value,
      // 警示标志类型
      type: 1,
      // 当前选中的警示标志
      selectSigns: [],
      // 警示标志源数据
      signList: []
    };
  },
  computed: {
    disable() {
      return this.selectSigns && this.selectSigns.length >= 6;
    }
  },
  watch: {
    value: {
      handler(val) {
        this.visible = val;
        if (val) {
          this.reset();
        }
      },
      immediate: true
    },
    visible(val) {
      this.$emit("input", val);
      if (!val) this.setupUploader();
    }
  },
  created() {},
  methods: {
    getSignData() {
      this.signList = [];
      this.signOpts.forEach(item => {
        listSign({color: item.value}).then(response => {
          const result = response.result || [];
          for (var i = 0; i < result.length; i++) {
            let selected;
            selected = this.selects.filter(items => items.name === result[i].name);
            result[i].checked = selected.length === 1;
          }
          this.signList.push({
            name: item.name,
            color: item.value,
            icons: result
          })
        });
      })
    },
    setupUploader(fileList = []) {
      this.$nextTick(() => {
        this.$refs.uploader.setup(fileList);
      });
    },
    handleDelete(src) {
      const data = this.selectSigns || [];
      let systems = [];
      let uploads = [];
      data.forEach(item => {
        if (item.name.includes("jsbz/")) systems.push(item);
        else uploads.push(item);
      });
      if (src.name.includes("jsbz/")) {
        this.changeSource(systems);
      } else {
        this.signUploads.forEach(item => {
          item.checked = uploads.includes(item.src.name);
        });
      }
    },
    /** 警示标志类型变动回调 */
    handleSignChange(value) {
      let systems = [];
      let uploads = [];
      if (this.type === 1) {
        systems = this.signList
          .map(item => item.icons)
          .flat()
          .filter(f => f.checked);
        uploads = this.selectSigns.filter(item => !item.name.includes("jsbz/"));
      } else {
        systems = this.selectSigns.filter(item => item.name.includes("jsbz/"));
        uploads = this.signUploads.filter(item => item.checked);
      }
      const temp = new Set([...systems, ...uploads]);
      this.selectSigns = Array.from(temp);
      // console.log('selectSigns', this.selectSigns)
    },
    changeSource(value) {
      // console.log('value', value)
      for (var i = 0; i < this.signList.length; i++){
        for(var j = 0; j < this.signList[i].icons.length; j++) {
          let selected;
          selected = value.filter(item => item.name === this.signList[i].icons[j].name);
          this.signList[i].icons[j].checked = selected.length === 1;
        }
      }
      // console.log('signList',  this.signList)
    },
    /** 上传完成回调 */
    handleUploadCompletion(fileList) {
      const uploads = this.signUploads.map(item => item.name);
      const data = fileList.map(item => {
        const name = item.name; 
        const fileOrignalName = item.fileOrignalName; 
        const checked = uploads.includes(name);
        return { fileOrignalName, name, checked };
      });
      this.signUploads = data;
    },
    /** 确定按钮操作 */
    submit() {
      const data = JSON.parse(JSON.stringify(this.selectSigns));
      this.$emit("change", data);
      this.visible = false;
    },
    // 重置相关数据
    reset() {
      this.getSignData();
      this.selectTab = this.signOpts[0].value;
      this.type = 1;
      let uploads = [];
      let uploaderSources = [];
      this.selects.forEach(src => {
        const exist = src.name.includes("jsbz/");
        if (!exist) {
          uploads.push({...src, checked: true });
          uploaderSources.push({ ...src });
        }
      });
      this.selectSigns = [...this.selects];
      // this.changeSource([...this.selects]);
      this.signUploads = uploads;
      this.setupUploader(uploaderSources);
      // this.selectTab = this.signList[0].color;
    }
  }
};
</script>
