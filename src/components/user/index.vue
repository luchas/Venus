<template>
  <div class="container">
    <mainheader
      v-on:getSearchData="getSearchData"
      searchName="搜索用户ID或昵称"
    ></mainheader>
    <el-container class="body-container" v-loading="listLoading">
      <el-header class="body-head" style="height:47px;">
        <p :class="{ active: status == 0 }" @click="searchType(0)">被举报</p>
        <p :class="{ active: status == 2 }" @click="searchType(2)">已冻结</p>
      </el-header>
      <el-main class="body-content">
        <el-table
          :data="tableData"
          :height="500"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <!--  <el-table-column
            type="index"
            width="50"
          >
          </el-table-column> -->
          <el-table-column
            prop="createTime"
            label="举报时间"
            width="180"
            align="center"
            :formatter="dateFormat"
          ></el-table-column>
          <el-table-column
            prop="id"
            label="用户ID"
            width="180"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="昵称"
            align="center"
          ></el-table-column>
          <el-table-column label="举报原因" align="center">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{
                getTypeValue(scope.row.type)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="reportTimes"
            label="举报次数"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center" v-if="status == 0">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="userManageCheck(2, scope.$index, scope.row)"
                >冻结</el-button
              >
              <el-button
                size="mini"
                type="success"
                @click="userManageCheck(1, scope.$index, scope.row)"
                >无异常</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="status == 2">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="userManageCheck(1, scope.$index, scope.row)"
                >解冻</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[50, 100, 150, 200]"
          :page-size="50"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize"
        >
        </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import mainheader from "../mainheader.vue";
import moment from "moment";
import * as http from "../../components/utils/api";
export default {
  name: "certy",
  components: { mainheader },
  data() {
    return {
      searchData: "", //搜索的内容
      listLoading: true,
      status: 0, //0:待审核 1：无异常 2：冻结
      tableData: [],
      totalSize: 0,
      pageIndex: 1,
      pageSize: 50
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
    searchType(val) {
      this.status = val;
    },
    getData() {
      //console.log("request search:" + this.searchData)
      this.listLoading = true;
      // 由于已经导入了 Vue-resource这个包，所以 ，可以直接通过  this.$http 来发起数据请求
      http
        .userManageList(
          this.searchData,
          this.status,
          this.pageIndex,
          this.pageSize
        )
        .then(
          result => {
            this.listLoading = false;
            if (result.code == "200") {
              console.log("result :" + JSON.stringify(result));
              var dataList = result.data.info;
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

                // console.log("table data:" + JSON.stringify(this.tableData));
              }
            }
          },
          reject => {
            this.listLoading = false;
          }
        );

      /* var totalLen = this.tableData.length + 5;
      for(var i=this.tableData.length;i<totalLen;i++){
          this.tableData.push({
            id:i,
            date: "2016-05-02",
            userId: "45874854",
            name: "王小虎",
            photo: [
              'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2236173587,171293931&fm=11&gp=0.jpg', 
              'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=584194870,2568453151&fm=27&gp=0.jpg', 
              'http://imgtianqi.eastday.com/res/upload/ue/image/20181221/1545373514476501.jpg'
            ],
            video: "http://vjs.zencdn.net/v/oceans.mp4",
            //http://babylife.qiniudn.com/FtRVyPQHHocjVYjeJSrcwDkApTLQ
            money: 500
          });
      }
      this.totalSize = this.tableData.length; */
    },
    userManageCheck(checkStatus, index, rowItem) {
      //debugger;
      this.listLoading = true;
      //checkStatus 1:通过，2：不通过
      http.userManageCheck(rowItem.id, checkStatus).then(
        result => {
          this.listLoading = false;
          if (result.code == "200") {
            console.log("result :" + JSON.stringify(result));
            //刷新数据
            this.tableData.splice(index, 1);

            this.$notify({
              title: "成功",
              message: "操作成功",
              type: "success",
              duration: 2000
            });
            this.totalSize = this.totalSize - 1;
          }
        },
        reject => {
          this.listLoading = false;
        }
      );
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
    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  watch: {
    pageIndex(curVal, oldVal) {
      if (curVal != oldVal) {
        this.getData();
      }
    },
    status(curVal, oldVal) {
      if (curVal != oldVal) {
        this.getData();
      }
    },
    searchData(curVal, oldVal) {
      if (curVal != oldVal) {
        this.getData();
      }
    }
  },
  computed: {
    getTypeValue(o) {
      return function(o) {
        var returnValue;
        if (o == 1) {
          returnValue = "色情/暴力";
        } else if (o == 2) {
          returnValue = "广告";
        } else if (o == 3) {
          returnValue = "虚假信息";
        }
        return returnValue;
      };
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
