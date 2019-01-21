<template>
	<div class="gc-praiselist">
		<div v-show="state=='list'" class="gc-praiselist_content">
			<el-row :gutter="20">
				<el-col :span="20">
					<div class="grid-content bg-purple">
						<el-input @keyup.enter.native="doSearch()" v-model="listQuery.title" style="width: 200px !important;" class="filter-item" placeholder="输入期刊名称"></el-input>
						<el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">筛选</el-button>
						<el-button @click="onCreate" type="primary" icon="plus">新建期刊</el-button>
					</div>
				</el-col>
			</el-row>
			<div class="gc-praiselist_content_list " id="subject_table_box">
				<el-table v-loading="listQuery.loading" element-loading-text="努力加载中..." ref="multipleTable" :data="dataList" border style="width: 100%" @sort-change="sortChange">
					<el-table-column type="index" align="center" label="序号" width="65">
					</el-table-column>
					<el-table-column prop="createdAt" label="创建时间" sortable="custom" align="center" width="110">
						<template scope="scope">
							<span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="viewAmount" label="浏览量"  sortable="custom" align="center">
						<template scope="scope">
							<span style="color:orangered">{{scope.row.viewAmount}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="期刊名称">
						<template scope="scope">
							<span>{{scope.row.title}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="期刊封面" vertical="middle" width="120">
						<template scope="scope">
							<img style="width:90px;height:50px;" :src="scope.row.cover+'?imageView2/1/w/498/h/276'" class="gc_praiselist_list_img">
						</template>
					</el-table-column>
					<el-table-column align="center" label="点赞数">
						<template scope="scope">
							<span>{{scope.row.praiseAmount}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="评论数">
						<template scope="scope">
							<span>{{scope.row.commentAmount}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="上首页" >
						<template scope="scope">
							<span v-if="scope.row.homeTop">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column>
					<el-table-column prop="publish" align="center" label="状态">
						<template scope="scope">
							<span>{{scope.row.status == '1' ? "已发布":"未发布"}}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="346">
						<template scope="scope">
							<el-button v-if="scope.row.status == '2'"  size="small" icon="circle-check" type="success" @click="publish(scope.row)">发布
							</el-button>
							<el-button v-if="scope.row.status == '1'"  size="small" icon="circle-close" type="warning" @click="cancel(scope.row)">取消发布
							</el-button>
							<el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="onEdit(scope.row)">编辑
							</el-button>
							<el-button icon="delete" size="small" type="danger" @click="deleteSubject(scope.row,'del')">删除</el-button>
							

							<el-dropdown trigger="click">
                <el-button type="primary" size="small">
                  更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>

                <el-dropdown-menu slot="dropdown" style="text-align:center;">
                  <el-dropdown-item>
										<el-button @click="showComment(scope.row)" type="primary" size="small">查看评论</el-button>
                  </el-dropdown-item>

                  <el-dropdown-item>           
                    <el-button class="fontFamily"  type="info" size="small" @click='copyGoodsUrl(scope.row,$event)'> 复制期刊链接 </el-button>
                  </el-dropdown-item>

                </el-dropdown-menu>

              </el-dropdown>


						</template>
					</el-table-column>
				</el-table>
				<div  class="pagination-container">
					<el-pagination @size-change="handleSizeChange" :current-page="listQuery.pageIndex"
					@current-change="handleCurrentChange" :page-sizes="[10,15,20,30]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total">
					</el-pagination>
				</div>
			</div>
		</div>
		<add-subject ref="subject" @success="createSuccess()" v-on:cancel="state='list'" v-show="state=='create'">
		</add-subject>

		<el-dialog title="期刊评论" :visible.sync="subjeCommentVisible" >
     	<subject-article-comments ref="subjectComment" :loadData="true"></subject-article-comments>
    </el-dialog>

    <el-dialog  title="复制期刊链接" :visible.sync="qrcodeVisible">
      <el-tabs v-model="qrcodeActive" >
        <el-tab-pane label="链接地址" name="1">
          <el-input v-model="qrcodeUrl" :disabled="true" placeholder="请输入内容" style="width:50%;"/>
          <el-button type="primary" icon="el-icon-document" @click="handleCopy(qrcodeUrl,$event)">复制</el-button>       
        </el-tab-pane>
        <el-tab-pane label="地址二维码" name="2">
          <div id="qrcodeBox" style="text-align: center;"></div>
          <p style="color:#343434;text-align:center;">右键点击二维码，选择‘图片另存为’，保存到本地</p>         
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

	</div>
</template>
<script>
	import AddSubject from './addSubject'
  import clip from '@/utils/copyText'
	import subjectArticleComments from "../comments/subjectArticleComments";
	import waves from '@/directive/waves/index.js' // 水波纹指令
	export default {
		components: {
			AddSubject,
			subjectArticleComments
		},
		directives: {
			waves
		},
		data() {
			return {
        qrcodeActive:'1',
        qrcodeVisible:false,
        qrcodeUrl:null,
				listQuery: {
					title: "",
					loading: false,
					pageIndex: 1,
					pageSize: 15,
					total: 0,
					column: "",
					order: ""
				},
				subjeCommentVisible:false,
				dataList: [],
				detail: null,
				state: "list", // list | create | edit
			}
		},
		methods: {
      copyGoodsUrl(data,event) {
        this.restCode(); 
        let url = "https://wx.goochao.com/article.html?subjectArticleId=" + data.subjectArticleId;
        let params = {};
        params.url = url;
        this.http.get(this).url(this.config.toShortUrl).params(params).request((response) => {
          if (response.data.code != 0) {
            this.$message({message: response.data.message, type: 'error'});
            return;
          }
          this.qrcodeVisible = true;
          this.qrcodeUrl = response.data.data;
          setTimeout(()=>{
            this.setCode(response.data.data);
          },20)

          }, (err) => {console.log(err)}
        );
      },
      restCode() {
        this.qrcodeActive = '1';
        jQuery('#qrcodeBox').html("");
        this.qrcodeUrl= null;
      },
      handleCopy(qrcodeUrl,event) {
        clip(qrcodeUrl,event,'期刊链接');
      },
      setCode(url) {
        jQuery('#qrcodeBox').qrcode({
          render: "canvas", //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
          text: url, //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
          width: "160", //二维码的宽度
          height: "160", //二维码的高度
          typeNumber: -1, //计算模式
          correctLevel: 2, //二维码纠错级别
          background: "#ffffff", //二维码的后景色
          foreground: "#000000", //二维码的前景色
          imgWidth: 80,
          imgHeight: 80
        })
      },
			showComment(subject) {
				this.subjeCommentVisible = true;
				setTimeout(()=>{
					this.$refs.subjectComment.loadComment(subject.subjectArticleId);
				},200)	
			},

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
				console.log(this.listQuery);
				this.listQuery.loading = true;
				this.http.get(this).url(this.config.subject.list_url).params(this.listQuery).request(
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
			publish(subject) {
				this.$confirm('是否要发布期刊"' + subject.title + '"?', '提示', {

          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.put(this).url(this.config.subject.publish_url).restful({subjectArticleId:subject.subjectArticleId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
								return;
              }
              this.$message({type: 'success', message: '发布成功!'});
              this.findByPage();
            }, (err) => { });
        }).catch(() => {
        });
			},
			//			 取消发布
			cancel(subject) {
				this.http.get(this).url(this.config.validateGoods.article).restful({
					subjectArticleId: subject.subjectArticleId
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
						let message = data ? " " : "是否取消发布期刊" + subject.title + "?";
						this.cancelPublish(message, subject, data);
					}, (error) => {}
				);
			},

			//			取消发布
			cancelPublish(message,subject,use) {
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
							}, "该期刊\"" + subject.title + "\"在首页推荐或首页置顶中存在使用，是否要继续取消发布？  若继续，系统将会把首页推荐或首页置顶中的使用一并取消发布！！！")
						]),
					}).then(() => {
						this.http.put(this).url(this.config.subject.cancelPublish_url).restful({
								subjectArticleId: subject.subjectArticleId
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
									message: '取消发布成功!'
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
						this.http.put(this).url(this.config.subject.cancelPublish_url).restful({
								subjectArticleId: subject.subjectArticleId
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
									message: '取消发布成功!'
								});
								this.findByPage();
							}, (err) => {});
					}).catch(() => {});
				}
			},

			//			删除
			deleteSubject(subject) {
				this.http.get(this).url(this.config.validateGoods.article).restful({
					subjectArticleId: subject.subjectArticleId
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
						let message = data ? " " : "是否删除期刊 " + subject.title + " ?";
						this.articleDel(message, subject, data);
					}, (error) => {}
				);
			},

			//			删除
			articleDel(message, subject, use) {
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
							}, "该期刊\"" + subject.title + "\"在首页推荐或首页置顶中存在使用，是否要继续删除？")
						]),
					}).then(() => {
						this.http.delete(this).url(this.config.subject.delete_url).restful({
								subjectArticleId: subject.subjectArticleId
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
						this.http.delete(this).url(this.config.subject.delete_url).restful({
								subjectArticleId: subject.subjectArticleId
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
				//this.$router.push({ path: '/subject/savePraisesubject' })
				this.state = "create";
				this.$refs.subject.reset();
			},
			onEdit(subject) {
				this.state = "create";
				this.$refs.subject.loadSource(subject);
			},
			createSuccess() {
				this.state = "list";
				this.findByPage();
			},
			findRoomAreas() {
				this.http.get(this).url(this.config.room_area.list_url)
					.request(
						(response) => {
							if(response.data.code != 0) {
								this.$message({
									message: response.data.message,
									type: 'error'
								});
								return;
							}
							this.roomAreas = response.data.data;
						}, (err) => {});
			},
			findImageStyles() {
				this.http.get(this).url(this.config.image_style.list_url)
					.request(
						(response) => {
							if(response.data.code != 0) {
								this.$message({
									message: response.data.message,
									type: 'error'
								});
								return;
							}
							this.imageStyles = response.data.data;
						}, (err) => {});
			}
		},
		mounted() {
			this.findByPage();
		}
	}
</script>
<style>
	/*.bg-purple .el-input {
		width: 130px !important;
	}*/
	
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
	#subject_table_box button{
		margin-left: 0;
	}
	.el-number-cus {}
	/*.el-number-cus .el-input {
		width: 181px !important;
		margin-left: 0px !important;
	}*/
</style>