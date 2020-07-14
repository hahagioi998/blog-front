<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="app-container">
        <el-col :span="24">
            <el-card shadow="hover">
                <el-form :inline="true" :model="formInline">
                    <el-form-item label="查找">
                        <el-input v-model="formInline.cateName" prop="cateName" placeholder="请输入栏目名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getData" icon="el-icon-search">
                            搜索
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-download" @click="handleDownload">
                            导出 Excel
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-upload
                                :show-file-list="false"
                                name="file"
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                :on-success="onSuccessUpload"
                                :on-error="onError"
                                :action="action">
                            <el-button type="primary" icon="el-icon-upload2">
                                导入 Excel
                            </el-button>
                        </el-upload>

                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>

        <el-col :span="24">
            <el-card shadow="hover">
                <edit-table
                        :tableData.sync="tableData"
                        :opts.sync="opts"
                        :showAddBtn="authority"
                        :showBatchDelBtn="authority"
                        height="565px"
                        :total="total"
                        :page="page"
                        @saveData="save"
                        @deleteRow="delRow"
                        @delBatch="delBatch"
                >
                </edit-table>
            </el-card>
        </el-col>
    </div>
</template>

<script>

  import editTable from '@/components/EditTable'
  import {
    getData,
    getDataByCdt,
    addCategory,
    updCategory,
    delCategory,
    delBatchCategory,
    IMPORT_CATEGORY
  } from '@/api/category' //

  export default {
    name: "category",
    components: {
      editTable
    },
    data() {
      return {
        tableData: [
          // {id: "1", cateName: "vue", date: "2020-03-03T00:58:45.000+0000"},
          // {id: "2", cateName: "java", date: "2020-03-03T02:07:16.000+0000"},
        ],
        opts: [
          {
            type: 'input',
            label: '栏目名称',
            prop: 'cateName'
          }, {
            type: 'date',
            label: '发布时间',
            prop: 'date',
            format: 'yyyy-MM-dd HH:mm:ss',
            dateType: 'datetime'
          }],
        formInline: {
          cateName: '',
        },
        //批量删除按钮
        objIds: [],
        batchBtn: true,
        //权限
        authority: true,
        //分页
        total: 0,
        page: {
          pageNum: 1,
          pageSize: 10,
        },
        filename: '栏目列表',
        autoWidth: true,
        bookType: 'xlsx',
        action: IMPORT_CATEGORY
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      handleDownload() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号(id)', '栏目名称(cateName)', '发布时间(date)']
          const filterVal = ['cateName', 'date']
          const list = this.tableData
          const data = this.formatJson(filterVal, list) // 自行洗数据 按序排序的一个array数组
          console.log(data);
          data.forEach((v, i) => v.unshift(i + 1))

          excel.export_json_to_excel({
            header: tHeader, //导出数据的表头
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType //导出文件类型
          })
        })
      },
      onSuccessUpload(res) {
        if (res.success) {
          this.$message.success("导入成功");
          setTimeout(() => {
            // 刷新子组件的数据。
            this.$router.go(0);
          }, 2 * 1000);
        } else {
          this.$message.error(res.message);
        }
      },
      onError(error) {
        this.$message.error(error.message)
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      formatJsonAddIndex(jsonData) {
        jsonData.forEach((v, i) => v.unshift(i + 1))
      },
      getData() {
        const params = {
          ...this.page,
          ...this.formInline
        };
        getData(params).then(res => {
          if (res.success) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
          } else {
            this.$message.error(res.message)
          }
        }).catch(e => {
          this.$message.error(e.message)
        })
      },
      save(data, done) {
        if (data.date === null || data.date === '' || data.date === undefined) {
          this.$message.warning("请选择日期")
          return;
        }
        //添加
        if (data.id === undefined) {
          done()
          addCategory(data).then(res => {
            if (res.success) {
              this.$message.success("添加成功")
              this.getData();
            }
          }).catch(e => {
            this.$message.error(e.message)
          })
        } else {
          done()
          updCategory(data).then(res => {
            if (res.success) {
              this.$message.success("修改成功")
            }
          }).catch(e => {
            this.$message.error(e.message)
          })
        }
      },
      delRow(id) {
        delCategory(id).then(res => {
          if (res.success) {
            this.$message.success("删除成功")
            this.getData();
          } else {
            this.$message.error(res.message)
          }
        }).catch(e => {
          this.$message.error(e.message)
        })
      },
      delBatch(ids) {
        delBatchCategory(ids).then(res => {
          if (res.success) {
            this.$message.success("批量删除成功")
            this.getData();
          } else {
            this.$message.error(res.message)
          }
        }).catch(e => {
          this.$message.error(e.message)
        })
      },
      handleClick(row) {
        console.log(row);
      },
      objSelection(objs) {
        this.objIds.length = 0;
        const _this = this;
        objs.forEach(element => {
          _this.objIds.push(element.id)
        });
        this.batchBtn = this.objIds.length === 0;
      },
    },
  }
</script>

<style scoped>
    .el-col-6 {
        margin-top: 10px;
    }
</style>
