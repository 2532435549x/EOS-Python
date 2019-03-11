<template>
	<div class="app-container">
		<div class="filter-container">
			<!-- 回到顶部 -->
			<div id="app">
				<el-tooltip placement="top" content="回到顶部">
					<back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade" />
				</el-tooltip>
			</div>
			<!-- 账号搜索表单 -->
			<el-form :inline="true" autocomplete="on" class="demo-form-inline">
				<el-form-item style="" label="">

					<el-autocomplete popper-class="my-autocomplete" v-model="qureyList.username" :fetch-suggestions="querySearch"
					 placeholder="请输入账号名" @select="handleSelect" @keyup.enter.native="fetchData()">
						<template slot-scope="{ item }">
							<div class="name">{{ item.value }}</div>
						</template>
					</el-autocomplete>
				</el-form-item>
				<el-form-item>
					<el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData()">搜索</el-button>
				</el-form-item>
				<el-form-item class="tableInfo">
					<el-popover placement="right" width="300" trigger="hover">
						<div class="tableInfoBox">
							<span>使用文档：</span><br>
							<span> 1、本项目是将获取到的数据显示到页面上，其他数据须使用其他工具查询。</span><br>
							<span> 2、输入金额区间没有操作时默认为0-0</span><br>
							<span> 3、功能尚未完全，后面根据需求补充</span><br>
							<span> 4、数据随时更新</span><br>
						</div>
						<i class="el-icon-info" slot="reference"></i>
					</el-popover>
				</el-form-item>
			</el-form>
			<div class="" style=" margin-top: -21px;margin-left: 16px;margin-bottom: 15px;color: red;font-size: 12px;">
				{{errorInfo}}
			</div>
		</div>
		<!-- 账号信息显示 -->
		<el-row>
			<el-col :span="6">
				<div class="asset">
					<el-button type="warning" icon="el-icon-star-off" circle></el-button>
					<span id="" style="font-weight: bold;">资产</span>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="80">
			<el-col :span="6">
				<div class="" style="position: relative;">
					<span>EOS可用余额</span><span style="position: absolute;right: 0px;">{{top[0].balance}} EOS</span>
				</div>
			</el-col>
			<el-col :span="5">
				<span>CPU</span>
				<span>
					<el-progress :text-inside="true" :stroke-width="18" :percentage="Number((top[0].cpu_available*100/top[0].cpu_max).toFixed(2))"
					 color="#409EFF"></el-progress>
				</span>
			</el-col>
			<el-col :span="5">
				<span>NET</span>
				<el-progress :text-inside="true" :stroke-width="18" :percentage="Number((top[0].net_available*100/top[0].net_max).toFixed(2))"
				 color="#8e71c7"></el-progress>
			</el-col>
			<el-col :span="5">
				<span>RAM</span>
				<el-progress :text-inside="true" :stroke-width="18" :percentage="Number((((top[0].ram_available-top[0].ram_used)*100)/(top[0].ram_available)).toFixed(2))"
				 status="success"></el-progress>
			</el-col>
		</el-row>
		<el-row :gutter="80">
			<el-col :span="6">
				<div class="" style="position: relative;">
					<span>总抵押</span><span style="margin-left: 10px; color: #77A9FF">#</span><span style="position: absolute;right: 0px;">{{top[0].stake_to_self}}
						EOS</span>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="">
					<span>剩余：</span><span>{{(top[0].cpu_available/1000).toFixed(2)}}<small style="color:#77A9FF ;margin-left: 5px;">ms</small>
						/ </span>
					<span>{{(top[0].cpu_max/1000).toFixed(2)}}<small style="color:#77A9FF ;margin-left: 5px;">ms</small></span>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="">
					<span>剩余：</span><span>{{(top[0].net_available/1024).toFixed(2)}}<small style="color:#77A9FF ;margin-left: 5px;">kb</small></span>
					/ </span>
					<span>{{(top[0].net_max/1024).toFixed(2)}}<small style="color:#77A9FF ;margin-left: 5px;">kb</small></span>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="">
					<span>剩余：</span><span>{{((top[0].ram_available-top[0].ram_used)/1024).toFixed(2)}}<small style="color:#77A9FF ;margin-left: 5px;">kb</small></span>
					/ <span>{{(top[0].ram_available/1024).toFixed(2)}}<small style="color:#77A9FF ;margin-left: 5px;">kb</small></span>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="80">
			<el-col :span="6">
				<div class="" style="position: relative;">
					<span>抵押给他人</span><span style="margin-left: 10px; color: #77A9FF">#</span><span style="position: absolute;right: 0px;">{{top[0].stake_to_others}}
						EOS</span></div>
			</el-col>
			<el-col :span="5">
				<div class="">
					<span>总抵押：</span><span>{{top[0].staked_cpu_weight}}</span>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="">
					<span>总抵押：</span><span>{{top[0].staked_net_weight}}</span>
				</div>
			</el-col>
		</el-row>

		<el-row :gutter="80">
			<el-col :span="6">
				<div class="" style="position: relative;">
					<span>正在赎回</span><span style="margin-left: 10px; color: #77A9FF">#</span><span style="position: absolute;right: 0px;">{{top[0].unstake}}
						EOS</span>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="">
					<span>正在赎回：</span><span>{{top[0].unstake_cpu_amount}} EOS</span>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="">
					<span>正在赎回：</span><span>{{top[0].unstake_net_amount}} EOS</span>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="80">
			<el-col :span="6">
				<div class="" style="border-bottom: 1px dotted gray;">
				</div>
			</el-col>
			<el-col :span="5">
				<div class="" style="border-bottom: 1px dotted gray;">
				</div>
			</el-col>
			<el-col :span="5">
				<div class="" style="border-bottom: 1px dotted gray;">
				</div>
			</el-col>
			<el-col :span="5">
				<div class="" style="border-bottom: 1px dotted gray;">
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="80">
			<el-col :span="6">
				<div class="" style="position: relative;">
					<span>EOS总余额</span><span style="position: absolute;right: 0px;">{{Number((parseFloat(top[0].balance)+parseFloat(top[0].stake_to_self)+parseFloat(top[0].stake_to_others)+parseFloat(top[0].unstake)).toFixed(4))}}
						EOS</span>
				</div>
			</el-col>

		</el-row>
		<br>
		<!-- 账号信息显示完 -->
		<el-row :gutter="400">
			<el-col :span="15">
				<div class="asset">
					<el-button type="warning" icon="el-icon-star-off" circle></el-button>
					<span id="" style="font-weight: bold;">
						持有代币
					</span>
				</div>
			</el-col>
			<el-col :span="6">
				<div>
					<el-button @click=" develop()" v-if="indexMax==3" icon="el-icon-arrow-down">展开</el-button>
					<el-button @click=" develop()" v-else icon="el-icon-arrow-up">收起</el-button>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="30">
			<div id="whole" v-for="(item,index) in tokenData" v-if="index<=indexMax">
				<el-col :span="5">
					<div class="grid-content bg-purple" style="height: 100px; border: 1px solid #E9EBEE;margin-bottom: 10px;">
						<!-- <img src="../../icons/image/weibiaoti1.png" > -->
						<div class="" style="font-family: Helvetica Neue;margin-left: 20px;margin-top: 10px;">
							<span style="color: #1890FF;">币种：</span><span style="">{{item.symbol}}</span>
						</div>
						<div class="" style="font-family: Helvetica Neue;margin-left: 20px;margin-top: 10px;">
							合约：<span style="color: #1890FF;">{{item.code}}</span>
						</div>
						<div class="" style="font-family: Helvetica Neue; margin-left: 20px;margin-top: 10px;">数量：
							<span style="color: #1890FF;">{{item.balance}}</span> <span style="color:#80A2CE;font-size: 14px;">{{item.symbol}}</span>
						</div>


					</div>

				</el-col>
			</div>
		</el-row>
		<br>
		<!-- 筛选条件框 -->
		<el-row>
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item class="tableInfo">
					<el-popover placement="right" width="600" trigger="hover">
						<div class="tableInfoBox">
							< img src="" alt="">
						</div>
					</el-popover>
				</el-form-item>
				<el-form-item>
					<el-select v-model="sort" style="width: 150px;" placeholder="请选择排序方式">

						<el-option label="" value="按时间升序" />
						<el-option label="" value="按时间降序" />
						<el-option label="" value="按金额升序" />
						<el-option label="" value="按金额降序" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<div class="block">
						<el-date-picker style="width: 200px;" v-model="value5[0]" type="datetime" :picker-options="pickerOptions1"
						 placeholder="选择日期时间" align="right">
						</el-date-picker>
						--
						<el-date-picker style="width: 200px;" v-model="value5[1]" type="datetime" placeholder="选择日期时间">
						</el-date-picker>
					</div>
				</el-form-item>
				<el-form-item>
					<el-select v-model="means" style="width: 150px;" placeholder="请选择交易方式">
						<el-option label="" value="全部" />
						<el-option label="" value="转入" />
						<el-option label="" value="转出" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="searchInfo.filtrate.othername" style="width: 130px;" placeholder="请输入交易对象"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="searchInfo.filtrate.symbol" style="width: 120px;" placeholder="请输入币种"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input style="width: 100px;" v-model="min" placeholder="金额区间"></el-input>--<el-input style="width: 100px;"
					 v-model="max" placeholder="金额区间"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button class="filter-item" type="primary" icon="el-icon-search" @click="query()">查询</el-button>
				</el-form-item>
				<!-- 弹出下载汇总信息 -->
				<el-form-item>
					<el-popover placement="left" width="600" trigger="click">
						<el-table style="height: 450px;overflow: scroll;" id="summaryTable" :data="summary">
							<el-table-column property="style" label="币种类型">
								<template slot-scope="scope">{{scope.row.symbol}}
								</template>
							</el-table-column>
							<el-table-column property="in" label="转入总额">
								<template slot-scope="scope">{{scope.row.amount_in}}
								</template>
							</el-table-column>
							<el-table-column property="out" label="转出总额">
								<template slot-scope="scope">{{scope.row.amount_out}}
								</template>
							</el-table-column>
						</el-table>
						<el-button style="float: right;margin-top: 10px;" type="primary" @click="exportExcelSummary()">导出excel<i class="el-icon-upload el-icon--right"></i></el-button>
						<el-button type="primary" slot="reference">查看汇总</el-button>
					</el-popover>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="exportExcel()">导出excel<i class="el-icon-upload el-icon--right"></i></el-button>
				</el-form-item>
			</el-form>
			</el-form>
		</el-row>
		<!-- 按照各种条件查询 -->
		<el-table v-loading="listLoading" :data="info" element-loading-text="Loading" border fit highlight-current-row id="out-table">
			<el-table-column align="center" label="序号" width="80">
				<template slot-scope="scope">
					{{scope.$index + 1 + (searchInfo.page - 1) * 100}}
				</template>
			</el-table-column>
			<el-table-column label="hash" width="140">
				<template slot-scope="scope"><a id="test" target="_blank" :href="'https://eospark.com/tx/'+scope.row.trx_id" :title="scope.row.trx_id"
					 style="width:140;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{scope.row.trx_id}}</a>
				</template>
			</el-table-column>
			<el-table-column label="交易时间" width="190">
				<template slot-scope="scope">{{scope.row.timestamp}}
				</template>
			</el-table-column>

			<el-table-column label="交易币种" width="100">
				<template slot-scope="scope">{{scope.row.symbol}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="状态" width="60">
				<template slot-scope="scope">
					<i v-if="scope.row.status=='executed'" style="color: #83B871;" class="el-icon-circle-check"></i>
					<i v-else class="el-icon-error"></i>
				</template>
			</el-table-column>

			<el-table-column label="转账金额" width="120">
				<template slot-scope="scope">{{scope.row.quantity}}
				</template>
			</el-table-column>

			<el-table-column label="转账对象(From)" width="140">
				<template slot-scope="scope">{{scope.row.sender}}

				</template>

			</el-table-column>
			<el-table-column label="转账对象(To)" width="140">
				<template slot-scope="scope">{{scope.row.receiver}}
				</template>
			</el-table-column>

			<el-table-column class="data" label="memo">
				<template slot-scope="scope"><span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" :title="scope.row.memo">{{scope.row.memo}}</span>
				</template>
			</el-table-column>

		</el-table> <!-- 上下页的转换 -->
		<div class="block" style="float: right; margin-top: 20px;">

			<el-pagination @current-change="queryData" :current-page.sync="currentPage" :page-size="100" layout="prev, pager, next"
			 :total="pageCount">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import FileSaver from 'file-saver';
	import XLSX from 'xlsx';
	import BackToTop from '../../components/public/AppToTop.vue';
	export default {
		name: 'app',
		components: {
			BackToTop
		},
		filters: {},
		data() {
			return {
				myBackToTopStyle: { //回到顶部
					right: '50px',
					bottom: '105px',
					width: '40px',
					height: '40px',
					borderRadius: '4px',
					lineHeight: '45px', // 请保持与高度一致以垂直居中
					background: '#e7eaf1', // 按钮的背景颜色
					'z-index': '9999',
				},
				value5: [new Date(1970, 10, 10, 10, 10), new Date()],
				pickerOptions1: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', date);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', date);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', date);
						}
					}, {
						text: '最近一年',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 365);
							picker.$emit('pick', date);
						}
					}]
				},
				input: [{
					type: ""
				}],
				transferForExcel: null,
				restaurants: [],
				summary: [{}],
				min: 0,
				max: 0,
				means: "",
				url: "",
				sort: "按时间降序",
				indexMax: 3,
				tokenData: [{
					symbol: "-",
					code: "-",
					balance: "-"
				}],
				currentPage: null,
				pageCount: 100,
				list: null,
				listLength: '',
				listLoading: false,
				cateArr: '', //分类列表
				categoryId: '', //当前分类id
				qureyList: {
					username: "",
					data: ""
				},
				searchInfo: {
					status: 0,
					username: "",
					page: 1,
					filtrate: {
						time: {
							startTime: "",
							endTime: ""
						},
						symbol: "",
						transactionMeans: "",
						transactionPrice: {
							min: 0,
							max: 0
						},
						sortType: "",
						othername: ""
					}
				},
				errorInfo: "",
				info: [{
					time: "",
					token: "",
				}],
				top: [{
					stake_to_self: 0,
					ram_available: 1,
					net_available: 0,
					cpu_available: 0,
					cpu_max: 1,
					net_max: 1,
					cpu_used: 0,
					net_used: 0,
					ram_used: 1,
					staked_cpu_weight: 0,
					staked_net_weight: 0,
					stake_to_others: 0,
					unstake: 0,
					balance: 0,
					unstake_cpu_amount: 0,
					unstake_net_amount: 0,
				}],
				List: [{
						value: "starteos.io"
					},
					{
						value: "games.eos"
					},
					{
						value: "ac.eos"
					},
					{
						value: "bidname.eos"
					},
					{
						value: "bank"
					},
				]
			}
		},
		methods: {
			query() {
				function format(time, format) {
					var t = new Date(time);
					var tf = function(i) {
						return (i < 10 ? '0' : '') + i
					};
					return format.replace(/yyyy|MM|dd|HH|mm|ss|ll/g, function(a) {
						switch (a) {
							case 'yyyy':
								return tf(t.getFullYear());
								break;
							case 'MM':
								return tf(t.getMonth() + 1);
								break;
							case 'mm':
								return tf(t.getMinutes());
								break;
							case 'dd':
								return tf(t.getDate());
								break;
							case 'HH':
								return tf(t.getHours());
								break;
							case 'HH':
								return " ";
								break;
							case 'ss':
								return tf(t.getSeconds());
								break;
						}
					})
				}
				this.searchInfo.filtrate.time.startTime = format(this.value5[0], "yyyy-MM-dd" + " " + "HH:mm:ss")
				this.searchInfo.filtrate.time.endTime = format(this.value5[1], "yyyy-MM-dd" + " " + "HH:mm:ss")
				this.searchInfo.filtrate.transactionPrice.min = parseFloat(this.min)
				this.searchInfo.filtrate.transactionPrice.max = parseFloat(this.max)
				this.searchInfo.status = 1
				this.searchInfo.page = 1
				console.log(this.searchInfo)
				this.currentPage = 1
				this.info = [{}]
				if (this.means == "转入") {
					this.searchInfo.filtrate.transactionMeans = "transferIn"
				} else if (this.means == "转出") {
					this.searchInfo.filtrate.transactionMeans = "transferOut"
				} else {
					this.searchInfo.filtrate.transactionMeans = ""
				}
				if (this.sort == "按时间升序") {
					this.searchInfo.filtrate.sortType = "dateUp"
				} else if (this.sort == "按时间降序") {
					this.searchInfo.filtrate.sortType = "dateDown"
				} else if (this.sort == "按金额升序") {
					this.searchInfo.filtrate.sortType = "priceUp"
				} else if (this.sort == "按金额降序") {
					this.searchInfo.filtrate.sortType = "priceDown"
				}
				this.listLoading = true
				let that = this
				// console.log(obj)
				this.$axios.post("/api/filtrate", that.searchInfo)
					.then(function(response) {
						if (response.data.errno == 0) {
							console.log("获取数据成功")
							console.log(response)
							that.info = response.data.transfer
							console.log(that.info)
							that.transferForExcel = response.data.transferForExcel
							that.listLoading = false
							that.errorInfo = ""
							that.pageCount = response.data.action_number
							that.summary = response.data.token_in_out_list
						} else {
							that.errorInfo = response.data.errorInfo
							that.listLoading = false
							that.info = [{}]
							that.top = [{}]
							that.tokenData = [{}]
						}
					})
					.catch(function(error) {
						console.log(error);
					})
			},
			develop() {
				this.indexMax = this.indexMax == 3 ? 100000 : 3;
			},
			exportExcel() {
// 				this.$notify({
// 					title: '提示',
// 					message: '正在导出中，此窗口须手动关闭',
// 					duration: 0
// 				});
				this.$nextTick(function() {
					var table = document.createElement("table")
					console.log(this.transferForExcel)
					for (let i = 0; i < this.transferForExcel.length; i++) {
						var tr = document.createElement("tr")
						var td1 = document.createElement("td")
						var td2 = document.createElement("td")
						var td3 = document.createElement("td")
						var td4 = document.createElement("td")
						var td5 = document.createElement("td")
						var td6 = document.createElement("td")
						var td7 = document.createElement("td")
						var td8 = document.createElement("td")
						td1.innerHTML = this.transferForExcel[i].trx_id
						td2.innerHTML = this.transferForExcel[i].timestamp
						td3.innerHTML = this.transferForExcel[i].symbol
						td4.innerHTML = this.transferForExcel[i].status
						td5.innerHTML = this.transferForExcel[i].quantity
						td6.innerHTML = this.transferForExcel[i].sender
						td7.innerHTML = this.transferForExcel[i].receiver
						td8.innerHTML = this.transferForExcel[i].memo
						tr.appendChild(td1)
						tr.appendChild(td2)
						tr.appendChild(td3)
						tr.appendChild(td4)
						tr.appendChild(td5)
						tr.appendChild(td6)
						tr.appendChild(td7)
						tr.appendChild(td8)
						for (let j = 0; j <= i; j++) {
							table.appendChild(tr)
						}
					} //生成表格
					this.makeTable(table)
				})
			},
			exportExcelSummary() {
				var tableTwo = document.querySelector("#summaryTable")
				this.makeTable(tableTwo)
			},
			makeTable(table) {
				let wb = XLSX.utils.table_to_book(table);
				/* get binary string as output */
				let wbout = XLSX.write(wb, {
					bookType: 'xlsx',
					bookSST: true,
					type: 'array'
				});
				try {
					FileSaver.saveAs(new Blob([wbout], {
						type: 'application/octet-stream'
					}), '基本账务查询表.xlsx')
				} catch (e) {
					if (typeof console !== 'undefined') console.log(e, wbout)
				}
				this.pagesize = '10'; //表格还原
				return wbout
			},
			// 输入自动匹配
			querySearch(queryString, callback) {
				var list = this.List
				callback(list)
			},

			handleSelect(item) {
				console.log(item);
				//do something
			},
			queryData() {
				console.log("修改页码成功")
				console.log(this.currentPage)
				console.log(this.searchInfo)
				this.searchInfo.filtrate.transactionPrice.min = parseFloat(this.min)
				this.searchInfo.filtrate.transactionPrice.max = parseFloat(this.max)
				this.searchInfo.page = this.currentPage
				this.listLoading = true
				let that = this
				// console.log(obj)
				this.$axios.post("/api/page", that.searchInfo)
					.then(function(response) {
						if (response.data.errno == 0) {
							console.log("获取数据成功")
							console.log(response)
							that.info = response.data.transfer
							console.log(that.info)
							that.listLoading = false
							that.errorInfo = ""
						} else {
							that.errorInfo = response.data.errorInfo
							that.listLoading = false
							that.info = [{}]
							that.top = [{}]
							that.tokenData = [{}]
						}
					})
					.catch(function(error) {
						console.log(error);
					})
			}, //queryData
			fetchData() { //获取列表
				this.min = 0
				this.max = 0
				this.searchInfo.filtrate.transactionMeans = ""
				this.searchInfo.filtrate.symbol = ""
				this.searchInfo.filtrate.othername = ""
				this.means = ""
				this.errorInfo = ""
				this.currentPage=1
				this.searchInfo.page=1
				this.info = [{}]
				this.sort = "按时间降序"
				this.value5 = [new Date(1970, 10, 10, 10, 10), new Date()]
				this.listLoading = true
				let that = this
				var obj = this.qureyList.username
				var name = {
					value: obj
				}
				var url = "/api/search?username=" + obj
				console.log(obj)
				this.$axios.get(url)
					.then(function(response) {
						if (response.data.errno == 0) {
							console.log("获取数据成功")
							that.info = response.data.transfer
							console.log(that.info)
							that.top = response.data.resource_data
							console.log(response.data.resource_data)
							console.log(that.info.trx_id)
							that.transferForExcel = response.data.transferForExcel
							that.errorInfo = ""
							that.tokenData = response.data.token_data
							that.searchInfo.username = that.qureyList.username
							that.searchInfo.page = that.currentPage
							that.pageCount = response.data.action_number
							that.summary = response.data.token_in_out_list
							that.listLoading = false
							if (JSON.stringify(that.List).indexOf(JSON.stringify(name)) == -1) {
								console.log("之前没有")
								that.List.unshift(name)
								that.List.length = 5
							} else {
								console.log("已经存在")
							}
						} else {
							that.errorInfo = response.data.errorInfo
							that.listLoading = false
							that.info = [{}]
							that.top = [{}]
							that.tokenData = [{}]
						}
					})
					.catch(function(error) {
						console.log(error);
					})

			}, //fetchData
			//input输入后匹配输入建议
		},
		watch: {

			"searchInfo": function() {
				this.searchInfo.status = 1
			},
			immediate: true,
			deep: true,


		}, //监听搜索
		computed: {
			function() {
				this.searchInfo.status = 0
				this.searchInfo.filtrate.transactionMeans = ""
			},

		}


	}
</script>
<style scope>
	.icon img {
		width: 20px;
		height: 20px;
		opacity: 0.7;
		vertical-align: middle;
		cursor: pointer;
	}

	.icon.type2 img {
		opacity: 0.2;
	}

	.description {
		white-space: nowrap;
	}

	.data {
		text-align: center;
	}

	/* 账号显示 */
	.el-row {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}

		.el-col {
			border-radius: 4px;
		}

		.bg-purple-dark {
			background-color: #99a9bf;
		}

		.bg-purple {
			background-color: #d3dce6;
		}

		.bg-purple-light {
			background-color: #e5e9f2;
		}

		.grid-content {
			border-radius: 4px;
			min-height: 36px;
		}

		.row-bg {
			padding: 10px 0;
			background-color: #f9fafc;
		}

		.asset {
			background-color: pink;
			position: relative;
		}

		.asset span {
			padding-left: 10px;
			position: absolute;
			left: 10px;
		}

	}
</style>
