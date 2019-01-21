<template>
	<div class="gc-praiselist app-container calendar-list-container">
		<!--<div v-show="state=='list'" class="gc-praiselist_title">
		</div>-->
		<!--列表-->
		<div v-show="state=='list'" class="gc-praiselist_content">
			<el-row :gutter="20">
				<el-col :span="20">
					<div class="grid-content bg-purple">
						<el-input @keyup.enter.native="keyEvent()" v-model="listQuery.keyword" style="width: 200px !important;" class="filter-item" placeholder="输入商品名称或编号">
						</el-input>

						<el-select @change="doSearch()" filterable clearable class="filter-item" style="width: 200px;" v-model="listQuery.designerId" placeholder="按设计师搜索">
							<el-option v-for="item in designers" :key="item.designerId" :label="item.nickName" :value="item.designerId">
							</el-option>
						</el-select>

						<el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索
						</el-button>
						<el-button @click="onCreate" type="primary" icon="plus">新建商品</el-button>
					</div>
				</el-col>

			</el-row>
			<div class="gc-praiselist_content_list" style="margin-top:15px;">
				<el-table v-loading="listQuery.loading" element-loading-text="努力加载中..." ref="multipleTable" :data="dataList" border style="width: 100%" @sort-change="sortChange" @selection-change="handleSelectionChange">
					<!-- <el-table-column
            type="selection"
            align="center"
            width="60">
        </el-table-column> -->
					<el-table-column type="index" align="center" label="序号" width="65">
					</el-table-column>
					<el-table-column prop="goods" label="商品" align="center" vertical="middle" width="120">
						<template scope="scope">
							<img style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
						</template>
					</el-table-column>
					<el-table-column prop="name" label="商品名称">
						<template scope="scope">
							<span class="link-type" @click="detailsList(scope.row)">{{scope.row.title}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="goodsNumber" label="商品编码" align="center">
						<template scope="scope">
							<span>{{scope.row.goodsNumber}}</span>
						</template>
					</el-table-column>

					<el-table-column prop="designerName" label="设计师" align="center">
					</el-table-column>

					<el-table-column prop="relationCount" label="关联图片数" align="center">
					</el-table-column>
					<el-table-column prop="praiseCount" label="点赞数" sortable="custom" align="center">
					</el-table-column>
					<el-table-column prop="clickCount" label="点击数" sortable="custom" align="center">
					</el-table-column>
					<el-table-column label="操作" align="center" width="280">
						<template scope="scope">
              <el-button icon="view" size="small" @click="showComment(scope.row)">集赞内容
							</el-button>
							<el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="onEdit(scope.row)">编辑
							</el-button>
							<el-button icon="delete" size="small" type="danger" @click="deleteGoods(scope.row)">删除
							</el-button>
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
		<!--编辑组件-->
		<save-praise-goods ref="praise_goods" @success="createSuccess()" v-on:cancel="state='list'" v-show="state=='create'">
		</save-praise-goods>
		<!--详情组件-->
		<save-Goods-Details ref="detail" v-on:cancel="state='list'" v-show="state=='detail'">
		</save-Goods-Details>

    <praise-comment ref="comment" :show="showCommentWindow" @cancel="showCommentWindow=false"></praise-comment>

	</div>
</template>
<script>
	import saveGoodsDetails from './saveGoodsDetails.vue'
	import SavePraiseGoods from './savePraiseGoods'
  import PraiseComment from './praiseComment'
	import waves from '@/directive/waves/index.js' // 水波纹指令
	var vobj = null;
	export default {
		components: {
			saveGoodsDetails,
			SavePraiseGoods,
      PraiseComment
		},
		directives: {
			waves
		},
		data() {
			return {
				listQuery: {
					loading: false,
					pageIndex: 1,
					pageSize: 15,
					total: 0,
					keyword: "",
					designerId: '',
					column: "",
					order: ""
				},
				designers: [],
				searchText: '',
				dataList: [],
				multipleSelection: [],
				currentPage4: 1,
				detail: null,
				state: "list", // list | create | edit
        showCommentWindow: false
			}
		},
		methods: {
      showComment(goods) {
        this.$refs.comment.loadCommentByGoodsId(goods.goodsId);
        this.showCommentWindow = true;
      },
			sortChange(column) {
				this.listQuery.column = column.prop;
				this.listQuery.order = column.order;
				console.log(column);
				this.findByPage();
			},
			//			详情
			detailsList(goods) {
				this.http.get(this).url(this.config.praise_goods.detail_url)
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
							this.state = "detail";
							console.log(this.$refs.praise_goods)
							this.$refs.detail.loadSource(this.detail);
						}, (err) => {});
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

			findDesigners() {
				var params = {
					pageSize: 1000,
					pageIndex: 1
				};
				this.http.get(this).url(this.config.designer.praise_list_url).params(params).request(
					(response) => {
						if(response.data.code != 0) {
							this.$message.error(response.data.message);
						} else {
							this.designers = response.data.data.data;
						}
					},
					(error) => {
						this.$message.error("服务器繁忙,请稍后再试");
					}
				);
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
				if(this.listQuery.designerId) {
					params.designerId = this.listQuery.designerId;
				}
				this.http.get(this).url(this.config.praise_goods.list_url).params(params).request(
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
				this.http.get(this).url(this.config.givGoods.givGoods_goods).restful({
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
						let message = data ? " " : "是否删除点赞商品 " + goods.title + " ?";
						this.doDeleteGoods(message, goods, data);
					}, (error) => {}
				);
			},
			//    删除
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
							}, "该点赞商品\"" + goods.title + "\"在场景图推荐或场景图置顶中存在使用，是否要继续删除？")
						]),
					}).then(() => {
						this.http.delete(this).url(this.config.praise_goods.batch_del_url).params({
								goodsId: goods.goodsId
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
						this.http.delete(this).url(this.config.praise_goods.batch_del_url).params({
								goodsId: goods.goodsId
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
				this.http.get(this).url(this.config.praise_goods.detail_url)
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
							console.log(this.$refs.praise_goods)
							this.$refs.praise_goods.loadSource(this.detail);
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
			onSubmit() {
				//查询检验
				if(this.searchText.length <= 0) {
					this.$message({
						type: "warning",
						message: "查询内容不能为空"
					});
					return;
				}
				//调用查询
			},
			formatter(row, column) {
				return row.address;
			},

			keyEvent() {
				this.doSearch();
			}
		},
		mounted() {
			vobj = this;
			this.findByPage();
			this.findDesigners();
		}
	}
</script>
<style>
	/*.gc-praiselist{

  }
  .gc-praiselist_title{
    padding:5px 15px 15px;
    border-bottom: 1px solid #dcdcdc;
  }
  .gc-praiselist h1{
    font-size: 18px;
    color:#666;
    line-height: normal;
    margin:0;
  }
  .gc-praiselist_content{
    margin-top:10px;
    padding:0 15px;
  }
  .el-input {
      width: 250px;
      margin-left:10px;
  }
  .gc-praiselist_content_list{
    margin-top:15px;
  }
  .gc_praiselist_list_img{
    width:100px;
    height: 100px;
    display: block;
      margin: 5px auto;
  }
  .gc-praiselist_pagination{
    margin-top:15px;
  }*/
</style>
