<template>
  <div class="container">
    <mainheader v-on:getSearchData="getSearchData" searchName="搜索用户ID或昵称"></mainheader>  
    <el-container
      class="body-container"
      v-loading="listLoading"
    >
      <el-header
        class="body-head"
        style="height:47px;"
      >

        <p
          :class="{ active: status == 0 }"
          @click="searchType(0)"
        >待审核</p>
        <p
          :class="{ active: status == 1 }"
          @click="searchType(1)"
        >已通过</p>
        <p
          :class="{ active: status == 2 }"
          @click="searchType(2)"
        >未通过</p>
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
          <!-- <el-table-column
            prop="id"
            label="ID"
            width="80"
            align="center"
          ></el-table-column> -->
          <el-table-column
            prop="publishtime"
            label="时间"
            width="180"
            align="center"
            :formatter="dateFormat"
          ></el-table-column>
          <el-table-column
            prop="userid"
            label="用户ID"
            width="180"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="nickname"
            label="昵称"
            align="center"
          ></el-table-column>
          <el-table-column
            label="内容"
            align="center"
            width="280" 
           >
              <template slot-scope="scope">
                <div  v-if="isPhoto(scope.row.photo)" @click="showPhotoDialog(scope.row)">
                  <span style="color:#5e76ee">{{getText(scope.row.word)}}</span>
                  <img
                      src="../../assets/image.png"
                      width="20"
                      height="20"
                      style="vertical-align:middle"
                    >
                </div>
                <div  v-else  @click="showVideoDialog(scope.row)">
                  <span style="color:#5e76ee">{{getText(scope.row.word)}}</span>
                  <img
                      src="../../assets/video.png"
                      width="20"
                      height="20"
                      style="vertical-align:middle"
                    >
                </div>
                
              </template>
          </el-table-column>
          <!-- <el-table-column
            label="相册"
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.photo">
                <viewer
                  :images="scope.row.photo"
                  class="images"
                >
                  <img
                    v-for="src in scope.row.photo"
                    :src="src"
                    :key="src"
                    width="30"
                    height="30"
                    style="margin-left:2px;"
                  >
                </viewer>
              </div>
            </template>
          </el-table-column> -->

          <!-- <el-table-column
            label="视频"
            align="center"
            prop="video"
          >
            <template slot-scope="scope">
              <i
                class="el-icon-view"
                @click="showVideo(scope.row.video)"
                v-if="scope.row.video"
              ></i>
            </template>
          </el-table-column> -->
          <el-table-column
            label="操作"
            align="center"
            v-if="status==0"
          >
            <template
              slot-scope="scope"
            >
              <el-button
                type="primary"
                size="mini"
                @click="dynamiCheck(2,scope.$index, scope.row)"
              >屏蔽</el-button>
              <el-button
                size="mini"
                type="success"
                @click="dynamiCheck(1,scope.$index, scope.row)"
              >通过</el-button>
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
          :visible.sync="showPhotoDialogVisible"
          :before-close="closePhotoDialog"
          :modal-append-to-body="false"
        >
           <div style="padding:10px;">{{currentRow.word}}</div>
           <viewer
                :images="currentRow.photo"
                class="images"
              >
                  <img
                    v-for="src in currentRow.photo"
                    :src="src"
                    :key="src"
                    width="100"
                    height="100"
                    style="margin-left:10px;"
                  >
                </viewer>
        </el-dialog>

        <el-dialog
          :visible.sync="dialogVisible"
          :before-close="closePlay"
          :modal-append-to-body="false"
        >
          <div style="padding:10px;">{{currentRow.word}}</div>
          <player
            :video-url="nowVideoUrl"
            :state="state"
          ></player>
        </el-dialog>
      </el-main>
    </el-container>
  </div>

</template>

<script>
import player from "../player.vue";
import mainheader from "../mainheader.vue";
import moment from "moment";
import * as http from "../../components/utils/api";
export default {
  name: "certy",
  components: { player, mainheader },
  data() {
    return {
      searchData:'',//搜索的内容
      listLoading: true,
      status: 0, //0:待审核 1：已通过 2：未通过
      tableData: [],
      totalSize: 0,
      showPhotoDialogVisible: false,//图片预览窗口
      dialogVisible: false,
      nowVideoUrl: "",
      state: false,
      pageIndex: 1,
      pageSize: 50,
      currentRow:""
    };
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
    this.getData();
    setTimeout(() => {
      this.listLoading = false;
    }, 1.5 * 1000);
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  computed: {
    isPhoto(){
        return function(phone) {
          return phone?true:false;
        }
    },
    getText(){
      return function(value)
      {
        if(value)
        {
          var maxLen = 10;
          var words = value.length;
          if(words > maxLen){
              return value.slice(0,maxLen)+"...";
          }else{
            return value;
          }
        }else{
          return "";
        }
        
      }
    }
  },
  methods: {
    getSearchData(txt) {
      this.searchData = txt;
      console.log("父组件获取的值是："+txt);
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
      //this.searchData = "文杰";
      // 由于已经导入了 Vue-resource这个包，所以 ，可以直接通过  this.$http 来发起数据请求
      http.dynamicList(this.searchData,this.status, this.pageIndex, this.pageSize).then(
        result => {
          this.listLoading = false;
          if (result.code == "200") {
            // console.log("result :" + JSON.stringify(result));
            var dataList = result.data.info;
            if (dataList) {
              this.tableData = [];
              var length = dataList.length;
              for (var i = 0; i < length; i++) {
                var dataTemp = dataList[i];
                if (dataTemp) {
                  if (dataTemp.photos) {
                    dataTemp.photo = dataTemp.photos.split(",");
                  }
                  if (dataTemp.photo && dataTemp.photo.length == 0) {
                    delete dataTemp["photo"];
                  }
                  if (
                    !dataTemp.video ||
                    dataTemp.video == "" ||
                    dataTemp.video == "null" ||
                    dataTemp.video == "undefined"
                  ) {
                    delete dataTemp["video"];
                  }
                }
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
    },
    dynamiCheck(checkStatus, index, rowItem) {
      //debugger;
      this.listLoading = true;
      //checkStatus 1:通过，2：不通过
      http.dynamiCheck(rowItem.id, checkStatus).then(
        result => {
          this.listLoading = false;
          if (result.code == "200") {
            //console.log("result :" + JSON.stringify(result));
            //刷新数据
            this.tableData.splice(index, 1);

            this.$notify({
              title: "成功",
              message: "修改成功",
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
    closePlay() {
      this.nowVideoUrl = "";
      this.state = false; //停止播放
      this.dialogVisible = false;
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
    },
    showPhotoDialog(row)
    {
      this.currentRow = row;
      this. showPhotoDialogVisible = true;
    },
    closePhotoDialog()
    {
       this.showPhotoDialogVisible = false;
    },
    showVideoDialog(row)
    {
      this.currentRow = row;
      //console.log("video url:" + item);
      this.nowVideoUrl = this.currentRow.video;
      this.state = true; //正在播放
      this.dialogVisible = true;
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
    searchData(curVal,oldVal)
    {
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
