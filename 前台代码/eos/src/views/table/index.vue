<template>
  <div class="app-container">
		<el-row>
  <el-col :span="24"><div class="grid-content bg-purple-dark" style="font-size: 18px;font-weight: bold;">用户价格波动表</div></el-col>
</el-row>
<div class="filter-container" style="margin-top: 20px;">
      <el-input v-model="username" placeholder="请输入正确的账户名" style="width: 200px;" class="filter-item"/>
      <el-button  class="filter-item" @click="search()" type="primary" icon="el-icon-search" >搜索</el-button>
      
    </div>

<br>
    <el-table
      v-loading="listLoading"
      :data="info"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
			 style="margin-top: 10px;">
      <el-table-column align="center" label="序号" >
      	<template slot-scope="scope">
      		{{scope.$index+1}}
      	</template>
      </el-table-column>
      <el-table-column label="帐户名" >
        <template slot-scope="scope">
          {{ scope.row.account}}
        </template>
      </el-table-column>
      <el-table-column label="价格波动"  align="center">
        <template slot-scope="scope">
          {{scope.row.price}}
        </template>
      </el-table-column>
      <el-table-column label="时间"  align="center">
        <template slot-scope="scope">
         {{scope.row.time}}

        </template>
      </el-table-column>
			 <el-table-column align="center" prop="created_at" label="操作" >
			    <template slot-scope="scope">
			     <el-button type="primary"  @click="formVisible('edit',scope.row)">编辑</el-button>
			    </template>
			  </el-table-column>
			</el-table>
			<!-- 弹出编辑框 -->
			    <el-dialog title="设置" :visible.sync="dialogFormVisible">
			      <el-form :model="cateForm" ref="form" label-width="100px" class="demo-ruleForm">
			
			        <el-form-item label="账户名" prop="account">
			          <el-input  disabled v-model="cateForm.account" ></el-input>
			        </el-form-item>
			        
			         <el-form-item label="价格波动" prop="price">
			          <el-input v-model="cateForm.price"  placeholder="请填入价格波动标准"></el-input>
			        </el-form-item>
							<el-form-item label="时间" prop="time">
								<el-input v-model="cateForm.time"  placeholder="请填入监听时间间隔"></el-input>
							</el-form-item>
			        <el-form-item>
			          <el-button type="primary" @click="submitForm('form')">确定</el-button>
			          
			        </el-form-item>
			
			      </el-form>
			    </el-dialog> 
			<!-- 弹出编辑框结束 -->
    </el-table>
		<!-- 上下页的转换 -->
		<div class="pageQury" style="float: right;margin-top: 10px;">
			<el-button-group>
				<el-button type="primary" icon="el-icon-arrow-left" v-if="queryList.page>1" @click="pageLoad('pre')" >上一页</el-button>
				<el-button type="primary" @click="pageLoad('next')" v-if="length>=10" >下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
			</el-button-group>
		</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
			length:null,
			username:"",
			info: [{
				account:null,
				id:0,
				price:0,
				time:0
				}],
				cateForm:{
					account:null,
					id:0,
					price:0,
					time:0
				},
      listLoading: null,
			dialogTableVisible: false,
			dialogFormVisible: false,
			formLabelWidth: '120px',
	    queryList:{
				page:1
			}
    }
  },
	
	methods:{
		search(){
			this.listLoading = true
			this.info[0].account=this.username
			console.log(this.info[0].account)
			let that = this
			var url="http://192.168.100.187:8089/eos?account="+this.info[0].account
			console.log(666)
			this.$axios.get(url)
				.then(function(response) {
					console.log("获取数据成功")
					console.log(response)
					that.info=response.data
					
					that.listLoading = false
				})
				.catch(function(error) {
					console.log(error);
				})
		},
		pageLoad(type) { //分页加载
		if(type=="next"){
			++this.queryList.page
			console.log(this.queryList.page)
			this.queryData()
		}
		if(type=="pre"){
			--this.queryList.page
			console.log(this.queryList.page)
			this.queryData()
		}
		}, //pageLoad
		submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log(this.cateForm)
						//alert('submit!');
						this.fatchData(this.cateForm)
         this.dialogFormVisible = false;
						
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
		formVisible(statue,...rest){//显示弹框
				this.dialogFormVisible = true;
				switch (statue) {
					case 'add':
						this.info = {
								categoryName: '',
								sort: '',
								
						}
						break;
				
					default://编辑
						this.cateForm = rest[0];
						break;
				}
		},//FormVisible
		queryData(){
			this.listLoading = true
			let that = this
			console.log(666)
			var url="http://192.168.100.187:8089/eos?page="+this.queryList.page
			this.$axios.get(url)
				.then(function(response) {
					console.log("获取数据成功")
					console.log(response)
					that.info=response.data
					console.log(that.info.length)
					that.length=that.info.length
					that.listLoading = false
				})
				.catch(function(error) {
					console.log(error);
				})
			},
		fatchData(data){
			this.listLoading = true
			let that = this
			console.log(666)
			this.$axios.post("http://192.168.100.187:8089/update",data)
				.then(function(response) {
					console.log("修改数据成功")
					console.log(response.data[0].message)
					if(response.data[0].message=="成功"){
						that.dialogFormVisible = false;
						that.queryData()
						}
					that.listLoading = false
				})
				.catch(function(error) {
					console.log(error);
				})
		}
	},
	created() {
	this.queryData()
		
	
	},
  computed: {
    
  },
	
}
</script>