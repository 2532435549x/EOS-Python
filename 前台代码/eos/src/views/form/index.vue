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
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item style="" label="">
					<el-input v-model="qureyList.username" placeholder="请输入账户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData()">搜索</el-button>
				</el-form-item>
			</el-form>
			<div class="" style=" margin-top: -21px;margin-left: 16px;margin-bottom: 15px;color: red;font-size: 12px;">
				{{errorInfo}}
			</div>
		</div>
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
				<el-form-item >
					<div class="block" >
    <el-date-picker style="width: 180px;"
      v-model="value5[0]"
      type="datetime"
	  :picker-options="pickerOptions1"
      placeholder="选择日期时间"
      align="right">
    </el-date-picker>
	--
    <el-date-picker style="width: 180px;"
      v-model="value5[1]"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </div>
				</el-form-item>
				<el-form-item>
					<el-select v-model="means" style="width: 150px;" placeholder="请选择交易方式">
						<el-option label="" value="" />
						<el-option label="" value="转入" />
						<el-option label="" value="转出" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="searchInfo.filtrate.othername" style="width: 140px;" placeholder="请输入交易对象"></el-input>
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
			<el-table-column label="Hash" width="140" >
				<template slot-scope="scope" ><a href="" target="_blank" style="width:140;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{scope.row.trx_id}}</a>
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
				<template slot-scope="scope">{{scope.row.memo}}
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
				date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', new Date());
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
            },{
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
				restaurants: [],
				min: 0,
				max: 0,
				means: "",
				sort: "按时间降序",
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
			    urlHash:"",
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
			}
		},
		methods: {
			query() {
				function format(time, format) {
					var t = new Date(time);
					var tf = function(i) {
						return (i < 10 ? '0' : '') + i
					};
					return format.replace(/yyyy|MM|dd|HH|mm|ss|ll/g, function(a)                       {
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
				console.log(this.searchInfo)
				this.searchInfo.page = this.currentPage
				if (this.means == "转入") {
					this.searchInfo.filtrate.transactionMeans = "transferIn"
				} else if (this.means == "转出") {
					this.searchInfo.filtrate.transactionMeans = "transferOut"
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
							that.listLoading = false
							that.errorInfo = ""
							that.pageCount = response.data.action_number
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
			// excel文件导出
             exportExcel () {
                    this.$nextTick(function () {
                        let wb = XLSX.utils.table_to_book(document.querySelector('#out-table'));
                        /* get binary string as output */
                        let wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});
						  
                        try {
							
                            FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '基本账务查询表.xlsx')
                        } catch (e) {
                            if (typeof console !== 'undefined') console.log(e, wbout)
                        }excelSetting.MultiSheet = false;
            excelSetting.Pagination = false;
                        this.pagesize = '10';//表格还原
                        return wbout
                    })
                },

			test() {
				alert(2)
			},
			fetchData() { //获取列表
				this.min = 0
				this.max = 0
				this.searchInfo.filtrate.transactionMeans = ""
				this.searchInfo.filtrate.symbol = ""
				this.searchInfo.filtrate.othername = ""
				this.means = ""
				this.sort = "按时间降序"
				this.value5 = [new Date(1970, 10, 10, 10, 10), new Date()]
				this.listLoading = true
				let that = this
				var obj = this.qureyList.username
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
							that.errorInfo = ""
							that.tokenData = response.data.token_data
							that.searchInfo.username = that.qureyList.username
							that.searchInfo.page = that.currentPage
							that.pageCount = response.data.action_number
							that.listLoading = false
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
			deep: true
		}, //监听搜索
		computed: {
			function() {
				this.searchInfo.status = 0
				this.searchInfo.filtrate.transactionMeans = ""
			}

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
