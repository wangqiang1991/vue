<template>
	<div class="gc-praiselist" id="goodsList_vue">
		<div v-show="state=='list'" class="gc-praiselist_title">
			<h1>商品列表</h1>
		</div>
		<div v-show="state=='list'" class="gc-praiselist_content">
			<el-row :gutter="20">
				<el-col :span="20">
					<div class="grid-content bg-purple">
						<el-select v-model="firstCategory" style="width:130px" clearable @change="onFirstCategoryChange" filterable placeholder="请选择一级分类">
							<el-option v-for="item in firstCategorys" :key="item.name" :label="item.name" :value="item.categoryId">
							</el-option>
						</el-select>

						<el-select @change="selectChanged()" v-model="secondCategory" style="width:130px" clearable filterable placeholder="请选择二级分类">
							<el-option v-for="item in secondCategorys" :key="item.name" :label="item.name" :value="item.categoryId">
							</el-option>
						</el-select>

						<el-select @change="selectChanged()" v-model="statusItem" style="width:130px" clearable filterable placeholder="上架/下架">
							<el-option v-for="item in statusItems" :key="item.name" :label="item.name" :value="item.value">
							</el-option>
						</el-select>

						<el-input @keyup.enter.native="keyEvent()" v-model="listQuery.keyword" style="width: 200px !important;" class="filter-item" placeholder="输入商品名称或编号">
						</el-input>
						<el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索
						</el-button>
						<el-button @click="onCreate" type="primary" icon="edit">新建商品</el-button>
					</div>
				</el-col>

			</el-row>
			<div class="gc-praiselist_content_list">
				<el-table v-loading="listQuery.loading" element-loading-text="努力加载中..." ref="multipleTable" :data="dataList" border style="width: 100%" @sort-change="sortChange" @selection-change="handleSelectionChange">
					<!-- <el-table-column
            type="selection"
            align="center"
            width="60">
        </el-table-column> -->
					<!--<el-table-column type="index" align="center" label="序号" width="65">-->
					<!--</el-table-column>-->
					<el-table-column prop="goods" label="商品封面" align="center" vertical="middle" width="120">
						<template scope="scope">
							<img style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
						</template>
					</el-table-column>
					<el-table-column prop="name" label="商品名称">
						<template scope="scope">
							<span class="link-type">{{scope.row.title}}</span>
						</template>
					</el-table-column>
					<el-table-column label="商品款式" width="320">
						<template scope="scope">
							<div v-for="(style,index) in scope.row.styleVos">
								<span>
                  {{index + 1}}、{{style.name}}
                </span>
								<span style="color: orangered;">
                  ￥{{style.price}}元
                </span>
								<span style="color: red;">
                  (剩余{{style.count}}件)
                </span>
							</div>
						</template>
					</el-table-column>

					<el-table-column label="优惠活动" width="200">
						<template scope="scope">
							<span v-for="coupon in scope.row.couponVos ">
                {{coupon.name}}<br>
              </span>
						</template>
					</el-table-column>

					<el-table-column prop="goodsNumber" label="商品编码" align="center">
						<template scope="scope">
							<span>{{scope.row.goodsNumber}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="firstCategory.name" label="一级分类" align="center">
					</el-table-column>
					<el-table-column prop="secondCategory.name" label="二级分类" align="center">
					</el-table-column>
					<!--<el-table-column-->
					<!--prop="viewCount"-->
					<!--label="浏览量"-->
					<!--sortable="custom"-->
					<!--align="center">-->
					<!--</el-table-column>-->
					<!--<el-table-column-->
					<!--prop="salesCount"-->
					<!--label="销量"-->
					<!--sortable="custom"-->
					<!--align="center">-->
					<!--</el-table-column>-->
					<!--<el-table-column-->
					<!--prop="totalCount"-->
					<!--label="库存"-->
					<!--align="center">-->
					<!--</el-table-column>-->
					<el-table-column prop="putaway" label="状态" align="center">
						<template scope="scope">
							<span>{{scope.row.putaway ? "已上架":"已下架"}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="sort" label="排序" align="center">
					</el-table-column>

					<el-table-column label="操作" align="center" width="340">
						<template scope="scope">
							<!-- <el-button-group> -->
							<el-button v-if="!scope.row.putaway" size="small" icon="circle-check" type="success" @click="putaway(scope.row)">上架
							</el-button>
							<el-button v-if="scope.row.putaway" size="small" icon="circle-close" type="warning" @click="pullGoods(scope.row)">下架
							</el-button>
							<el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="onEdit(scope.row)">编辑
							</el-button>
							<el-button size="small" icon="d-caret" type="info" @click="onSort(scope.row)">排序</el-button>
							<el-button icon="delete" size="small" type="danger" @click="deleteGoods(scope.row)">删除
							</el-button>
							<!-- </el-button-group> -->
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination-container">
					<el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
					 @current-change="handleCurrentChange" :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
					</el-pagination>
				</div>

			</div>
		</div>
		<save-goods ref="goods" @success="createSuccess()" v-on:cancel="state='list'" v-show="state=='create'">
		</save-goods>

		<el-dialog title="排序设置" :visible.sync="dialogFormVisible">
			<el-form>
				<el-form-item label="商品名称" :label-width="formLabelWidth">
					<span>{{currentGoods.title}}</span>
				</el-form-item>
				<el-form-item label="商品编号" :label-width="formLabelWidth">
					<span>{{currentGoods.goodsNumber}}</span>
				</el-form-item>
				<el-form-item label="排序" :label-width="formLabelWidth">
					<el-input-number class="el-number-cus" v-model="sortValue" :min="1" :max="100000"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmSort">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import SaveGoods from './saveGoods'
	import waves from '@/directive/waves/index.js' // 水波纹指令
	var vobj = null;
	export default {
		components: {
			SaveGoods
		},
		directives: {
			waves
		},
		data() {
			return {
				sortValue: "1",
				dialogFormVisible: false,
				currentGoods: {},
				formLabelWidth: '120px',
				listQuery: {
					loading: false,
					pageIndex: 1,
					pageSize: 15,
					total: 0,
					keyword: "",
					column: "",
					order: ""
				},
				dataList: [],
				multipleSelection: [],
				detail: null,
				state: "list", // list | create | edit
				categorys: [],
				firstCategorys: [],
				secondCategorys: [],
				firstCategory: null,
				secondCategory: null,
				statusItems: [{
						name: "上架",
						value: true
					},
					{
						name: "下架",
						value: false
					}
				],
				statusItem: null
			}
		},
		methods: {
			sortChange(column) {
				this.listQuery.column = column.prop;
				this.listQuery.order = column.order;
				console.log(column);
				this.findByPage();
			},
			/**
			 * 分页控件每页条数改变
			 */
			handleSizeChange(val) {
				this.listQuery.pageSize = val;
				this.findByPage();
			},
			/**
			 * 分页控件页码改变
			 */
			handleCurrentChange(val) {
				this.listQuery.pageIndex = val;
				this.findByPage();
			},
			doSearch() {
				this.listQuery.pageIndex = 1;
				this.findByPage();
			},
			findByPage() {
				var params = {
					pageSize: this.listQuery.pageSize,
					pageIndex: this.listQuery.pageIndex,
					reallyName: this.listQuery.condition,
					column: this.listQuery.column,
					order: this.listQuery.order,
					keyword: this.listQuery.keyword
				};
				if(this.firstCategory) {
					params.firstCategoryId = this.firstCategory;
				}
				if(this.secondCategory) {
					params.secondCategoryId = this.secondCategory;
				}
				if(this.statusItem != null) {
					params.putaway = this.statusItem;
				}
				this.listQuery.loading = true;
				this.http.get(this).url(this.config.goods.list_url).params(params).request(
					(response) => {
						if(response.data.code != 0) {
							this.$message({
								message: response.data.message ? response.data.message : "系统错误",
								type: 'error'
							});
							return;
						}
						console.log(response.data);
						this.dataList = response.data.data.data;
						this.listQuery.total = response.data.data.totalSize;
						this.listQuery.loading = false;
					},
					(error) => {

					}
				);
			},
			handleIconClick(ev) {
				console.log(ev);
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//			删除
			deleteGoods(goods) {			
				this.http.get(this).url(this.config.validateGoods.goodsData).restful({
					goodsId: goods.goodsId
				}).request(
					(response) => {
						if(response.data.code != 0) {
							this.$message({
								message: response.data.message ? response.data.message : "系统错误",
								type: 'error'
							});
							return;
						}
						let data = response.data.data;
						let message = data ? " " : "是否删除第三方发送到商品 " + goods.title + " ?";
						this.doDeleteGoods(message, goods, data);
					}, (error) => {}
				);
			},
			//			删除
			doDeleteGoods(message, goods, use) { 							
				if(use) {
					const h = this.$createElement;
					this.$confirm('提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						message: h('p', null, [
							h('span', null, null),
							h('span', {
								style: 'color: red'
							}, "该商品\"" + goods.title + "\"在首页推荐或首页置顶中存在使用，是否要继续删除？")
						]),
					}).then(() => {											
						this.http.delete(this).url(this.config.goods.batch_del_url).params({					
								goodsIds: goods.goodsId
							})
							.request((response) => {
								if(response.data.code != 0) {
									this.$message({
										message: response.data.message,
										type: 'error'
									});
									return;
								}
								this.$message({
									type: 'success',
									message: '删除成功!'
								});
								this.findByPage();
							}, (err) => {});
					}).catch(() => {});
				} else {										
					this.$confirm(message, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
				}).then(() => {
					this.http.delete(this).url(this.config.goods.batch_del_url).params({
							goodsIds: goods.goodsId

						})
						.request((response) => {
							if(response.data.code != 0) {
								this.$message({
									message: response.data.message,
									type: 'error'
								});
								return;
							}
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							this.findByPage();
						}, (err) => {});
				}).catch(() => {});
				}				
			},

			onCreate() {
				//this.$router.push({ path: '/goods/savePraiseGoods' })
				this.state = "create";
			},
			onEdit(goods) {
				this.http.get(this).url(this.config.goods.detail_url)
					.restful({
						goodsId: goods.goodsId
					}).request(
						(response) => {
							if(response.data.code != 0) {
								this.$message({
									message: response.data.message,
									type: 'error'
								});
								return;
							}
							this.detail = response.data.data;
							console.log(this.detail);
							this.state = "create";
							console.log(this.$refs.goods)
							this.$refs.goods.loadSource(this.detail);
						}, (err) => {});
			},
			createSuccess() {
				this.state = "list";
				this.findByPage();
			},
			/**
			 * 编辑列
			 */
			handleEdit(index, row) {
				console.log(index, row);
			},
			onFirstCategoryChange(categoryId) {
				this.secondCategorys = [];
				this.secondCategory = null;
				this.categorys.forEach((item) => {
					if(item.parentId === categoryId) {
						this.secondCategorys.push(item);
					}
				});
				this.doSearch();
			},
			findCategroy() {
				this.http.get(this).url(this.config.categroy.categroy_list_url)
					.request(
						(response) => {
							if(response.data.code != 0) {
								this.$message({
									message: response.data.message,
									type: 'error'
								});
								return;
							}
							this.categorys = response.data.data;
							this.categorys.forEach((item) => {
								if(!item.parentId) {
									this.firstCategorys.push(item);
								}
							});
						}, (err) => {});
			},
			//			下架
			pullGoods(goods) {
				this.http.get(this).url(this.config.validateGoods.goodsData).restful({
					goodsId: goods.goodsId
				}).request(
					(response) => {
						if(response.data.code != 0) {
							this.$message({
								message: response.data.message ? response.data.message : "系统错误",
								type: 'error'
							});
							return;
						}
						let data = response.data.data;
						let message = data ? "" : "是否下架商品 " + goods.title + " ?";
						this.doPullGoods(message, goods, data);
					}, (error) => {}
				);
			},
			//			下架
			doPullGoods(message, goods, use) {
				if(use) {
					const h = this.$createElement;
					this.$confirm('提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						message: h('p', null, [
							h('span', null, null),
							h('span', {
								style: 'color: red'
							}, "该商品\"" + goods.title + "\"在首页推荐或首页置顶中存在使用，是否要继续下架？  若继续，系统将会把首页推荐或首页置顶中的使用一并下架！！！")
						]),
					}).then(() => {
						this.http.post(this).url(this.config.goods.pulled_url).params({
								goodsIds: goods.goodsId
							})
							.request((response) => {
								if(response.data.code != 0) {
									this.$message({
										message: response.data.message,
										type: 'error'
									});
									return;
								}
								this.$message({
									type: 'success',
									message: '下架成功!'
								});
								this.findByPage();
							}, (err) => {});
					}).catch(() => {});
				} else {
					this.$confirm(message, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(() => {
						this.http.post(this).url(this.config.goods.pulled_url).params({
								goodsIds: goods.goodsId
							})
							.request((response) => {
								if(response.data.code != 0) {
									this.$message({
										message: response.data.message,
										type: 'error'
									});
									return;
								}
								this.$message({
									type: 'success',
									message: '下架成功!'
								});
								this.findByPage();
							}, (err) => {});
					}).catch(() => {});
				}
			},
			//			上架
			putaway(goods) {
				//			debugger;
				this.$confirm('是否要上架商品"' + goods.title + '"?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.http.post(this).url(this.config.goods.putaway_url).params({
							goodsIds: goods.goodsId
						})
						.request((response) => {
							if(response.data.code != 0) {
								this.$message({
									message: response.data.message,
									type: 'error'
								});
								return;
							}
							this.$message({
								type: 'success',
								message: '上架成功!'
							});
							this.findByPage();
						}, (err) => {});
				}).catch(() => {});
			},
			onSort(goods) {
				this.currentGoods = goods;
				this.sortValue = goods.sort;
				this.dialogFormVisible = true;
			},
			confirmSort() {
				this.listQuery.loading = true;
				this.http.post(this).url(this.config.goods.sort_url).params({
					goodsId: this.currentGoods.goodsId,
					secondCategoryId: this.currentGoods.secondCategory.categoryId,
					sort: this.sortValue
				}).request((response) => {
					if(response.data.code != 0) {
						this.$message({
							message: response.data.message,
							type: 'error'
						});
						return;
					}
					this.listQuery.loading = false;
					this.$message({
						type: 'success',
						message: '设置排序成功!'
					});
					this.findByPage();
					this.dialogFormVisible = false;
				}, (err) => {});
			},

			selectChanged() {
				this.doSearch();
			},
			keyEvent() {
				this.doSearch();
			}
		},
		mounted() {
			vobj = this;
			this.findByPage();
			this.findCategroy();
		}
	}
</script>
<style lang="scss">
	/*.bg-purple .el-input {
    width: 130px !important;
  }*/
	
	#goodsList_vue {
		.el-icon-warning+div {
			color: #48576a;
		}
		.el-message-box__message+div {
			color: red;
		}
	}
	
	.gc-praiselist {}
	
	.gc-praiselist_title {
		padding: 5px 15px 15px;
		border-bottom: 1px solid #dcdcdc;
	}
	
	.gc-praiselist h1 {
		font-size: 18px;
		color: #666;
		line-height: normal;
		margin: 0;
	}
	
	.gc-praiselist_content {
		margin-top: 10px;
		padding: 0 15px;
	}
	/*.el-input {
      width: 250px;
      margin-left:10px;
  }*/
	
	.gc-praiselist_content_list {
		margin-top: 15px;
	}
	
	.gc_praiselist_list_img {
		width: 100px;
		height: 100px;
		display: block;
		margin: 5px auto;
	}
	
	.gc-praiselist_pagination {
		margin-top: 15px;
	}
	
	.el-number-cus {}
	/*.el-number-cus .el-input {
    width: 181px !important;
    margin-left: 0px !important;
  }*/
</style>