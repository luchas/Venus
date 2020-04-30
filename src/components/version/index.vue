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
          :class="{ active: phoneType == 0 }"
          @click="searchType(0)"
        >Android版本</p>
        <p
          :class="{ active: phoneType == 1 }"
          @click="searchType(1)"
        >IOS版本</p>
          <el-button
                size="mini"
                type="success"
                @click="publishApk()"
                style="float:right;margin:0 5px;"
                v-if="showPublish"
              >发布APK</el-button>
      </el-header>
      <el-main class="body-content">
        <el-table
          :data="currentNode"
          :height="500"
          style="width: 100%"
        >
          <!-- <el-table-column
            type="index"
            width="50"
          >
          </el-table-column> -->
          <el-table-column
            prop="createTime"
            label="发布时间"
            width="180"
            align="center"
            :formatter="dateFormat"
          ></el-table-column>
          <el-table-column
            prop="versionCode"
            label="版本号"
            width="180"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="versionName"
            label="版本名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="info"
            label="更新内容"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="url"
            label="下载地址"
            v-if="phoneType == 0 "
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template
              slot-scope="scope"
            >
              <el-button
                type="primary"
                size="mini"
                @click="modifyVersionInfor(scope.$index, scope.row)"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          :visible.sync="dialogVisible"
          :before-close="closeDialog"
          :modal-append-to-body="false"
          center>
         <el-form
            ref="addForm"
            :model="form"
            label-width="110px"
          >
            <el-form-item
              label="版本号"
              prop="versionCode"
              :rules="[
                { required: true, message: '请输入版本号', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.versionCode"></el-input>
            </el-form-item>
            <el-form-item
              label="版本名称"
              prop="versionName"
              :rules="[
                { required: true, message: '请输入版本名称', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.versionName"></el-input>
            </el-form-item>
            <el-form-item
              label="内容"
              prop="info"
              :rules="[
                { required: true, message: '请输入内容', trigger: 'blur' }
              ]"
            >
              <el-input v-model="form.info"></el-input>
            </el-form-item>
            <el-form-item
              label="是否更新">
                <el-switch
                  v-model="form.updateType"
                  active-color="#13ce66"
                  inactive-color="#eee"
                  style="margin-left:10px;">
                </el-switch>
              </el-form-item>
            <!-- https://www.cnblogs.com/SimonHu1993/p/8257075.html -->
            <!-- https://www.cnblogs.com/rogerwu/p/9274193.html -->
            <el-upload
              class="upload-demo"
              drag
              :limit=1
              action="#"
              :auto-upload="false"
              accept=".apk"
              style="text-align: center;margin-bottom: 20px;"
              :before-upload="beforeFileUpload"
              :on-change="fileChange"
              :on-remove="handleRemove"
              v-if="phoneType==0"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传apk文件，且不超过50MB</div>
            </el-upload>
            <el-form-item style="text-align:right;">
              <el-button @click="onCancel" size="mini">取消</el-button>
              <el-button type="warning" 
                @click="onSubmit"
                size="mini"
              >确定</el-button>
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
export default {
  name: "version_manage",
  components: { mainheader },
  data() {
    return {
      searchData: "", //搜索的内容
      listLoading: false,
      phoneType: 0, //0:android 1：ios
      tableData: [],//请求的数据
      dialogVisible: false,//是否显示弹框
      form: {
        id:'',
        url: "",
        file:"",
        versionName: "",
        versionCode: "",
        info: "",
        phoneType:"",
        updateType:false, //是否强制更新，0不强制  1强制
        isModify:false
      },
      fd : ''
    };
  },
  created() {
    this.getData();
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    getSearchData(txt) {
      this.searchData = txt;
    },
    searchType(val) {
       if (val != this.phoneType) {
        this.phoneType = val;
        this.getData();
      }
    },
    getData() {
      //console.log("request search:" + this.searchData)
      this.listLoading = true;
      // 由于已经导入了 Vue-resource这个包，所以 ，可以直接通过  this.$http 来发起数据请求
      http.versionList()
        .then(
          result => {
            this.listLoading = false;
            if (result.code == "200") {
              //console.log("result :" + JSON.stringify(result));
              var dataList = result.data.info;
              if (dataList) {
                this.tableData = [];
                var length = dataList.length;
                for (var i = 0; i < length; i++) {
                  var dataTemp = dataList[i];
                  this.tableData.push(dataTemp);
                }
                //console.log("table data:" + JSON.stringify(this.tableData));
              }
            }
          },
          reject => {
            this.listLoading = false;
          }
        );  
        
        /* this.tableData.push({
          "id": 16,
          "url": "http://nsimages.dadawh.com/yanzhigongshe.apk",
          "info": "上线ANDROID",
          "versionName": "女神在线",
          "versionCode": "001",
          "updateType": 0,
          "createTime": "2019-02-28T16:00:00.000+0000",
          "phoneType": 0
        });
        this.tableData.push({
          "id": 16,
          "url": "http://nsimages.dadawh.com/yanzhigongshe.apk",
          "info": "上线IOS",
          "versionName": "女神在线",
          "versionCode": "001",
          "updateType": 0,
          "createTime": "2019-02-28T16:00:00.000+0000",
          "phoneType": 1
        }); */
        this.listLoading = false;
    },
    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    publishApk: function(){
      this.dialogVisible = true;
      this.form.isModify = false;//新增
      this.resetDialog();
    },
    resetDialog:function(){
      this.form = {
              //重置数据
              "id": "",
              "url": "",
              "file":"",
              "info": "",
              "versionName": "",
              "versionCode": "",
              "updateType": false,
              "createTime": "",
              "phoneType": this.phoneType,
            };
    },
    closeDialog:function(){
      this.dialogVisible = false;
    },
    onSubmit() {
      //新增提交
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.newImport();
        }
      });
    },
    onCancel() {
      //新增取消
      this.dialogVisible = false;
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      this.form.file = file.raw
    },
    beforeFileUpload(file){
        if (this.phoneType == 1) {
          return;
        }

        //上传前文件校验
        var fileName=new Array()
        fileName = file.name.split('.');
        const extension = fileName[fileName.length-1] === 'apk'
        const isLt2M = file.size / 1024 / 1024 < 50
        if (!extension) {
            this.$message({
                message: '上传文件只能是apk格式!',
                type: 'warning'
            });
        }
        if (!isLt2M) {
            this.$message({
                message: '上传文件大小不能超过 50MB!',
                type: 'warning'
            });
        }
        if (!this.fd || this.fd == '') {
          this.fd =  new FormData();
        }
        if (extension && isLt2M == true) {
            //console.log(file)
            this.$notify({
                    title: "成功",
                    message: "apk上传成功",
                    type: "success",
                    duration: 2000
                  });
            // console.log(fd)
            return true
        }
        return extension && isLt2M
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.form.file = "";
    },
    newImport () {
        var dataParam = new FormData();
        dataParam.append("version_code", this.form.versionCode);
        dataParam.append("version_name", this.form.versionName);
        dataParam.append("phone_type", this.form.phoneType);
        dataParam.append("info", this.form.info);
        dataParam.append("update_type", this.form.updateType?"1":"0");
        dataParam.append("token", http.getSessionToken());

        if(this.form.id){
          dataParam.append("id", this.form.id);
        }
        if(this.form.file){
          dataParam.append("file", this.form.file);
        }

        const loading = this.$loading({
            lock: true,
            text: '正在提交数据...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          http.uploadApk(dataParam).then(
              result => {
                loading.close();
                this.dialogVisible = false;
                if (result.code == "200") {
                  this.$notify({
                    title: "成功",
                    message: this.form.isModify?"修改成功":"新增成功",
                    type: "success",
                    duration: 2000
                  });
                  //console.log("upload result :" + JSON.stringify(result));
                  this.getData();
                }
              },
              reject => {
                  this.dialogVisible = false;
                  loading.close();
              }
            ); 
    },
    modifyVersionInfor(index,rowData){
      this.dialogVisible = true;
      this.form = {
        "id": rowData.id,
        "url": rowData.url,
        "info": rowData.info,
        "versionName": rowData.versionName,
        "versionCode": rowData.versionCode,
        "updateType": rowData.updateType == 1,
        "createTime": rowData.createTime,
        "phoneType": this.phoneType,
        "isModify":true
      };      
    }
  },
  watch: {
    searchData(curVal, oldVal) {
      if (curVal != oldVal) {
        this.getData();
      }
    }
  },
  computed:{
    currentNode:function(){
      //debugger;
      if(this.tableData && this.tableData.length>0)
      {
        var selectedPhoneType = this.phoneType;
        return this.tableData.filter(function(element,index,array)
        {
          return element.phoneType == selectedPhoneType;
        })
        this.tableData[0].updateType = this.tableData[0].updateType == 1;
      }else{
        return [];

      }
    },
    showPublish:function(){
      //debugger;
      var flag = false;
      if(this.tableData && this.tableData.length>0)
      {
        var selectedPhoneType = this.phoneType;
        flag = this.tableData.some(function(currentValue,index,arr){
          return currentValue.phoneType == selectedPhoneType;
        });
      }
      return !flag;
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
  padding:20px;
  padding-top:10px;
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
