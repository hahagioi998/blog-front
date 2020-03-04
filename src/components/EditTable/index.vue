<template>
  <div :style="{'width': '100%','height':height} ">
    <header>
      <slot name="header"></slot>
    </header>
    <div>
      <span v-if="title" class="edit-table-title">{{title}}</span>
      <el-button v-if="showAddBtn" class="showBatchDelBtn" type="primary" @click="addRow" icon="el-icon-plus">新增</el-button>
      <el-button v-if="showBatchAddBtn" type="primary" @click="batchSave" icon="el-icon-check">保存</el-button>
    </div>
    <el-table
        stripe
        border
        :data="data"
        style="width: 100%;"
        :highlight-current-row="highlightRow"
        @row-click="rowClick"
        :height="(showAddBtn && total>-1) || title ? 'calc(100% - 80px)' : 'calc(100% - 32px)'"
        @selection-change="objSelection"
    >
      <el-table-column v-if="showSelectBtn" fixed align="center" type="selection" min-width="60"></el-table-column>
      <el-table-column v-if="showIndexBtn" fixed align="center"  type="index" width="60" label="序号"></el-table-column>
      <template v-for="(column, index) in opts">
        <el-table-column
            :label="column.label"
            :prop="column.prop"
            :min-width="column.width"
            :key="index"
        >
          <template v-slot="scope">
            <span v-if="column.type === 'input'">
              <el-input v-model="scope.row[column.prop]" v-if="scope.row.seen"></el-input>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </span>
            <span v-else-if="column.type === 'date'">
              <el-date-picker
                  v-model="scope.row[column.prop]"
                  v-if="scope.row.seen"
                  :type="column.dateType"
                  :format="column.format"
                  :value-format="column.format"
                  default-time="00:00:00"
                  placeholder="选择日期时间"
              ></el-date-picker>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </span>
            <span v-else-if="column.type === 'time'">
              <el-time-picker
                  v-model="scope.row[column.prop]"
                  v-if="scope.row.seen"
                  :format="column.format"
                  :value-format="column.format"
                  default-time="00:00:00"
                  placeholder="选择日期时间"
              ></el-time-picker>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </span>
            <span v-else-if="column.type === 'select'">
              <el-select
                  v-model="scope.row[column.prop]"
                  v-if="scope.row.seen"
                  filterable
                  placeholder="请选择"
              >
                <el-option
                    v-for="item in column.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
              <span v-else>{{ formatDataMap(column.options, scope.row[column.prop]) }}</span>
            </span>
            <span v-else-if="column.type === 'specialSelect'">
              <el-select
                  v-model="scope.row[column.prop]"
                  v-if="scope.row.seen"
                  filterable
                  placeholder="请选择"
              >
                <el-option
                    v-for="item in scope.row['options']"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
              </el-select>
              <span v-else>{{ formatDataMap(scope.row.options, scope.row[column.prop]) }}</span>
            </span>
            <span v-else>
              <span>{{ scope.row[column.prop] }}</span>
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column v-if="showOptBtn" align="center" label="操作" :width="optWidth">
        <template v-slot="scope">
          <template v-if="!scope.row.visibleCancel">
            <slot name="customizeOpt" :scope="scope"></slot>
          </template>
          <el-button
              type="text"
              v-if="!scope.row.visibleCancel  && scope.row.visibleOptBtn"
              size="small"
              @click.stop="edit(scope)"
          >更新
          </el-button>
          <el-button
              type="text"
              v-if="scope.row.id && !scope.row.visibleCancel && scope.row.visibleOptBtn && showDelBtn"
              size="small"
              @click.stop="deleteRow(scope.row.id)"
          >删除
          </el-button>
          <el-button
              type="text"
              v-if="scope.row.visibleCancel  && scope.row.visibleOptBtn"
              size="small"
              @click.stop="save(scope.row)"
          >保存
          </el-button>
          <el-button
              type="text"
              v-if="scope.row.visibleCancel  && scope.row.visibleOptBtn"
              size="small"
              @click.stop="cancel(scope.row)"
          >取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <slot name="footer"></slot>
    </footer>
    <el-row>
      <el-col :span="6">
        <el-button v-if="showBatchDelBtn" :disabled="!batchDelBtn" type="danger" @click="delBatch" icon="el-icon-delete">多选删除</el-button>
      </el-col>
      <Pagination
          v-if="total > -1"
          :total="total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          :pageSizes="pageSizes"
          @pagination="pageChange"
      />
    </el-row>

  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import {isEmptyArray} from "@/utils";

  export default {
    name: "EditTable",
    components: {
      Pagination
    },
    props: {
      //表内容
      tableData: {
        type: Array,
        required: true,
        default: () => []
      },
      // 表头
      opts: {
        type: Array,
        required: true,
        default: () => []
      },
      /**
       * 分页参数
       * {
       *  pageNum: 当前页数
       *  pageSize：分页大小
       * }
       */
      page: {
        type: Object
      },
      // 总条数
      total: {
        type: Number,
        default: -1
      },
      // 显示的可分页数组
      pageSizes: {
        type: Array
      },
      // 是否显示新增按钮
      showAddBtn: {
        type: Boolean,
        default: false
      },
      // 是否显示操作栏
      showOptBtn: {
        type: Boolean,
        default: true
      },
      // 是否显示多选按钮
      showSelectBtn: {
        type: Boolean,
        default: true
      },
      // 是否显示序号
      showIndexBtn: {
        type: Boolean,
        default: true
      },
      // 是否显示批量保存按钮
      showBatchAddBtn: {
        type: Boolean,
        default: false
      },
      // 是否显示批量删除按钮
      showBatchDelBtn: {
        type: Boolean,
        default: false
      },
      //删除按钮
      showDelBtn: {
        type: Boolean,
        default: true
      },
      // 组件高度
      height: {
        type: String,
        default: "auto"
      },
      // 操作栏宽度
      optWidth: {
        type: String,
        default: "120px"
      },
      // 首次加载时是否展示为可编辑状态
      firstLoadEdit: {
        type: Boolean,
        default: false
      },
      // 分页触发事件
      pageChangeAction: {
        type: Function,
        default: null
      },
      // 复选框选择改变回调方法
      // selectionChange: {
      //   type: Function,
      //   default: ()=>{
      //
      //   }
      // },
      // 标题
      title: {
        type: String,
        default: ''
      },
      highlightRow: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        data: [],
        //批量删除按钮
        batchDelBtn:false,
        objIds: [],
        editCancelObj:{},
        editCancelIndex:0,
        // addBtnFlag : false,
      };
    },
    watch: {
      tableData() {
        this.formatData();
      }
    },
    mounted() {
      this.formatData();
    },
    methods: {
      getData() {
        this.$emit("getData");
      },
      formatData() {
        this.data = this.tableData.map(v => {
          this.$set(v, "visibleCancel", this.firstLoadEdit);
          this.$set(v, "seen", this.firstLoadEdit);
          if (!v.hasOwnProperty('visibleOptBtn')) {
            this.$set(v, "visibleOptBtn", true);
          }
          return v;
        });
      },
      edit(scope) {

        this.editCancelIndex = scope.$index;

        // 深度拷贝
        this.editCancelObj = Object.assign({}, scope.row);

        scope.row.visibleCancel = true;
        scope.row.seen = true;
      },
      cancel(row) {
        /*if(this.addBtnFlag){ //如果是true，那么就是点击了新增，再点击取消
          this.data.shift();
        }*/
        this.data.splice(this.editCancelIndex,1,this.editCancelObj);

        row.visibleCancel = false;
        row.seen = false;
        // this.$emit("getData");
      },
      save(row) {
        let flag = false;
        // 深度拷贝
        const data = Object.assign({}, row);
        // 删除额外添加的属性
        delete data.seen;
        delete data.visibleCancel;
        delete data.visibleOptBtn;
        const done = () => {
          flag = true;
        };
        this.$emit("saveData", data, done);
        if (flag) {
          row.visibleCancel = false;
          row.seen = false;
        }
        // this.addBtnFlag = false; //新增后保存flag设置，则为false
      },
      delBatch(){
        this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$emit("delBatch", this.objIds);
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
      },
      addRow() {
        // this.addBtnFlag = true;
        const row = {
          seen: true,
          visibleCancel: true,
          visibleOptBtn: true
        };
        this.data.unshift(row);
      },
      deleteRow(id) {
        this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$emit("deleteRow", id);
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
      },
      objSelection(objs) {
        this.objIds.length = 0;
        const _this = this;
        objs.forEach(element => {
          _this.objIds.push(element.id)
        });
        this.batchDelBtn = this.objIds.length !== 0;
      },
      formatDataMap(options, id) {
        let r = options.find(e => {
          return e.value == id;
        });
        return r == null ? null : r.label;
      },
      rowClick(data) {
        this.$emit("jc-row-click", data);
      },
      pageChange(val) {
        if (this.pageChangeAction) {
          this.pageChangeAction(val);
        } else {
          this.getData();
        }
      },
      batchSave() {
        let changeData = [];
        let el = null;
        for (const e of this.data) {
          if (e.visibleCancel) {
            el = Object.assign({}, e);
            // 删除额外添加的属性
            delete el.seen;
            delete el.visibleCancel;
            changeData.push(el);
          }
        }
        if (!isEmptyArray(changeData)) {
          this.$emit("batchSave", changeData);
        }
      }
    }
  };
</script>

<style>
  .is-scrolling-none {
    height: 100%;
  }
</style>
<style lang='scss' scoped>
  div .edit-table-class {
    position: relative;
    top: 4px;
    left: 12px;
  }

  .el-table {
    position: relative;
    .el-table-column {
      position: absolute;
      right: 0;
    }
  }

  .btn-add {
    position: relative;
    top: 8px;
    left: 8px;
    vertical-align: middle;
  }

  .edit-table-title {
    display: inline-block;
    line-height: 32px;
    font-size: 1.17em;
    font-weight: bold;
    vertical-align: middle;
  }
  .el-col-6 {
    margin-top: 10px;
  }

  .showBatchDelBtn
  {
    margin-bottom: 8px;
    left: 0px;
  }
</style>
