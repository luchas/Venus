<template>
  <div class="container">
    <mainheader v-on:getSearchData="getSearchData" searchName="输入客服账号或姓名"></mainheader>
    <el-container
      class="body-container"
      v-loading="listLoading"
    >
      <el-main class="body-content">
        <el-button
          size="mini"
          type="success"
          style="float:right;"
          @click="addService()"
        >新增</el-button>
        <el-table
          :data="tableData"
          :height="500"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <!-- <el-table-column
            type="index"
            width="50"
          >
          </el-table-column> -->
          <el-table-column
            prop="name"
            label="客服名称"
            width="180"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="account"
            label="账号"
            width="180"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="pwd"
            label="密码"
            align="center"
          ></el-table-column>
          <el-table-column
            label="是否管理员"
            align="center"
          >
            <template slot-scope="scope">
              <div v-text="scope.row.isAdmin ==1 ?'是':'否'"></div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="deleteService(scope.$index, scope.row)"
              >删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[50, 100, 150,200]"
          :page-size="50"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize"
        >
        </el-pagination>
        <el-dialog
          :visible.sync="dialogShow"
          :modal-append-to-body="false"
        >
          <el-form
            ref="addForm"
            :model="form"
            :rules="rules"
            label-width="80px"
          >
            <el-form-item
              label="客服姓名"
              prop="name"
              required
            >
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item
              label="账号"
              prop="account"
              required
            >
              <el-input v-model="form.account"></el-input>
            </el-form-item>
            <el-form-item
              label="密码"
              prop="pwd"
              required
            >
              <el-input v-model="form.pwd"></el-input>
            </el-form-item>
            <el-form-item
            label="管理员">
              <el-switch
                v-model="form.isAdmin"
                active-color="#13ce66"
                inactive-color="#eee"
                style="margin-left:10px;">
              </el-switch>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit"
              >立即创建</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-main>
    </el-container>
  </div>

</template>

<script>
import mainheader from "../mainheader.vue";
import moment from "moment";
import * as http from "../../components/utils/api";
import md5 from 'js-md5';
export default {
  name: "service",
  components: { mainheader },
  data() {
    return {
      searchData: "", //搜索的内容
      listLoading: true,
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 50,
      dialogShow: false,
      form: {
        userId:"",
        name: "",
        account: "",
        pwd: "",
        isAdmin:false
      },
      rules: {
        name: [{ required: true, message: "请输入客户姓名", trigger: "change" }],
        account: [
          { required: true, message: "请输入账号", trigger: "change" }
        ],
        pwd: [{ required: true, message: "请输入密码", trigger: "change" }]
      }
    };
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
    this.getData();
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    getSearchData(txt) {
      this.searchData = txt;
      //console.log("父组件获取的值是："+txt);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getData();
    },
    handleCurrentChange(val) {
      //console.log("当前页: ${val}");
      //this.$message("当前页:" + val);
    },
    getData() {
      //console.log("request data:" + this.searchData+" "+ this.status)
      this.listLoading = true;
      // 由于已经导入了 Vue-resource这个包，所以 ，可以直接通过  this.$http 来发起数据请求
      http.serviceList(this.searchData, this.pageIndex, this.pageSize).then(
        result => {
          this.listLoading = false;
          if (result.code == "200") {
            //console.log("result :" + JSON.stringify(result));
            var dataList = result.data;
            if (dataList) {
              this.tableData = [];
              var length = dataList.length;
              for (var i = 0; i < length; i++) {
                var dataTemp = dataList[i];
                this.tableData.push(dataTemp);
              }
              this.totalSize = result.count
                ? result.count
                : this.tableData.length;

              //console.log("table data:" + JSON.stringify(this.tableData));
            }
          }
        },
        reject => {
          this.listLoading = false;
        }
      );
    },
    deleteService(index, rowItem) {
      this.$confirm("确认删除此客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //checkStatus 1:通过，2：不通过
          http.deleteService(rowItem.userId).then(
            result => {
              this.listLoading = false;
              if (result.code == "200") {
                //console.log("result :" + JSON.stringify(result));
                //刷新数据
                this.tableData.splice(index, 1);

                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.totalSize = this.totalSize - 1;
              }
            },
            reject => {
              this.listLoading = false;
            }
          );
        })
        .catch(() => {
          /* this.$message({
            type: "info",
            message: "已取消删除"
          }); */
        });
    },
    //设置表格第一行的颜色
    tableRowClassName({ row, rowIndex }) {
      /* if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex % 2 === 0) {
        return "success-row";
      } */
      return "";
    },
    addService() {
      this.dialogShow = true;
      this.form = {
        //重置数据
        userId:"",
        name: "",
        account: "",
        pwd: "",
        isAdmin:false
      };
    },
    onSubmit() {
      //新增提交
      //debugger;
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.form.isAdmin = this.form.isAdmin?"1":"0";
          //console.log("form :" + JSON.stringify(this.form));
          http.addService(this.form.name,this.form.account, md5(this.form.pwd),this.form.isAdmin).then(
            result => {
              this.listLoading = false;
              if (result.code == "200") {
                //console.log("result :" + JSON.stringify(result));
                //刷新数据
                this.form.userId = result.data.costomer_id;
                this.tableData.push(this.form);

                this.$notify({
                  title: "成功",
                  message: "新增成功",
                  type: "success",
                  duration: 2000
                });
                this.dialogShow = false;
              }
            },
            reject => {
              this.listLoading = false;
            }
          );
        }
      });
    },
    onCancel() {
      //新增取消
      this.dialogShow = false;
    }
  },
  watch: {
    pageIndex(curVal, oldVal) {
      if (curVal != oldVal) {
        this.getData();
      }
    },
    searchData(curVal, oldVal) {
      if (curVal != oldVal) {
        this.getData();
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.body-container {
  padding: 20px;
  .body-head {
    padding: 15px 0 0 20px;
    background: #5967d9;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    p {
      display: inline-block;
      color: white;
      padding: 8px 20px;
      font-size: 14px;
      margin: 0;
      cursor: pointer;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    p.active {
      background-color: #3342be;
    }
  }
  .body-content {
    background-color: white;
    .el-pagination {
      margin-left: 20px;
    }
  }
}
</style>
