<template>
	<div class="app-container calendar-list-container" id="space_vue">
		<div v-show="state=='list'" class="gc-praiselist_content">
			<div class="filter-container">
				<el-input @keyup.enter.native="doSearch()" v-model="listQuery.keyword" style="width: 200px;" class="filter-item" placeholder="空间名称">
				</el-input>
				<el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索
				</el-button>
				<el-button @click="onCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="plus">添加
				</el-button>
			</div>

			<div class="gc-praiselist_content_list table_box">
				<el-table v-loading="listQuery.loading" element-loading-text="努力加载中..." ref="multipleTable" :data="dataList" border style="width: 100%" @sort-change="sortChange">

					<el-table-column prop="goods" label="空间" align="center" vertical="middle" >
						<template scope="scope">
							<img style="width:50px;height:50px;" :src="scope.row.cover+config.imgtmb._200" class="gc_praiselist_list_img">
						</template>
					</el-table-column>

					<el-table-column prop="name" label="空间名称">
						<template scope="scope">
							<span >{{scope.row.name}}</span>
						</template>
					</el-table-column>

					<el-table-column prop="viewAmount" label="浏览量" sortable="custom" align="center">
						<template scope="scope">
							<span style="color:orangered">{{scope.row.viewAmount}}</span>
						</template>
					</el-table-column>

					<el-table-column align="center" label="栏目数量" >
						<template scope="scope">
							<span>{{scope.row.itemCount}}</span>
						</template>
					</el-table-column>

					<el-table-column align="center" label="图片数量" >
						<template scope="scope">
							<span>{{scope.row.picCount}}</span>
						</template>
					</el-table-column>

					<el-table-column align="center" label="商品数量" >
						<template scope="scope">
							<span>{{scope.row.goodsCount}}</span>
						</template>
					</el-table-column>

					<el-table-column align="center" label="风格" >
						<template scope="scope">
							<span>{{scope.row.styleNames}}</span>
						</template>
					</el-table-column>

					<el-table-column align="center" label="创建时间" >
						<template scope="scope">
							<span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
						</template>
					</el-table-column>

					<el-table-column align="center" label="是否发布" >
						<template scope="scope">
							<span v-if="scope.row.push == 1">未发布</span>
							<span v-else>已发布</span>
						</template>
					</el-table-column>

					<el-table-column label="操作" align="center" width="350" class="space_operate">
						<template scope="scope">

						  <el-button size="small" v-if="scope.row.push == 1" icon="circle-check" type="success" @click="putaway(scope.row)">发布 </el-button>
              <el-button size="small" v-if="scope.row.push == 2" icon="circle-close" type="warning" @click="pulled(scope.row)">取消发布</el-button>
							
							<el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="onEdit(scope.row)">编辑
							</el-button>

							<el-button icon="delete" size="small" type="danger" @click="deleteSpace(scope.row)">删除
							</el-button>

							<el-dropdown trigger="click">
                <el-button type="primary" size="small">
                  更多操作<i class="el-icon-caret-bottom el-icon--right"></i>
                </el-button>

                <el-dropdown-menu slot="dropdown" style="text-align:center;">
                  <el-dropdown-item>
										<el-button icon="search" size="small" @click="viewGoods(scope.row)">查看商品</el-button>
                  </el-dropdown-item>
                <!--   
                  <el-dropdown-item>
                    <el-button icon="document" size="small" @click="getQrCode(scope.row)">生成二维码</el-button>
                  </el-dropdown-item> -->

                  <el-dropdown-item>           
                    <el-button class="fontFamily"  type="info" size="small" @click='copyGoodsUrl(scope.row,$event)'> 复制空间链接 </el-button>
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
				<el-dialog :before-close="handleClose" :visible.sync="dialogFormVisible">
					<div id="qrcodeBox" style="text-align: center;"></div>
					<p style="text-align: center;font-size: 18px;color: #1f2d3d;font-weight: bold;">{{name}}</p>
					<!-- <div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="confirmBtn">确 定</el-button>
					</div> -->
				</el-dialog>
			</div>
		</div>

		<save-space ref="spaces" @success="createSuccess()" @cancel="state='list'" v-show="state=='create'">
		</save-space>

		<space-goods ref="spaceGoods" :spaceGoodsFormVisible="spaceGoodsFormVisible" @cancel="spaceGoodsFormVisible = false">
		</space-goods>



    <el-dialog  title="复制空间链接" :visible.sync="qrcodeVisible">
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
	import waves from '@/directive/waves/index.js' // 水波纹指令
	import { parseTime } from '@/utils'
	import config from '@/commons/config'
	import { Loading } from 'element-ui'
	import SaveSpace from './saveSpace.vue'
	import SpaceGoods from './spaceGoods.vue'
	import logo from '@/assets/logo/logo.png'
  import clip from '@/utils/copyText'
	export default {
		components: {
			SaveSpace,
			SpaceGoods
		},
		directives: {
			waves
		},
		data() {
			return {
        qrcodeActive:'1',
        qrcodeVisible:false,
        qrcodeUrl:null,
				dialogFormVisible: false,
				cover: "",
				name: "",
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
				state: "list", // list | create | edit
				spaceGoodsFormVisible: false
			}
		},
		mounted: function() {
			this.findByPage();
		},
		methods: {
      copyGoodsUrl(data,event) {
        this.restCode(); 
        let url = "https://wx.goochao.com/shopwindowdetail2.html?spaceId=" + data.spaceId;
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
        clip(qrcodeUrl,event,'空间链接');
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
			doSearch() {
				this.listQuery.pageIndex = 1;
				this.findByPage();
			},
			getQrCode(item) {
				this.dialogFormVisible = true;
				this.$nextTick(function() {
					console.log(item)
					console.log(logo)
					this.name = item.name;
					var url;
					if(process.env.NODE_ENV == "production") {
						//线上url
						url = 'https://wx.goochao.com/shopwindowdetail2.html?spaceId=' + item.spaceId  + '&source=qrcode';
					} else if(process.env.NODE_ENV == "test") {
						url = 'http://test.wx.goochao.com/shopwindowdetail2.html?spaceId=' + item.spaceId  + '&source=qrcode';
					} else {
						//本地url
						url = 'http://wxtest.goochao.com:8080/shopwindowdetail2.html?spaceId=' + item.spaceId + '&source=qrcode';
					}

					console.log(url)
					jQuery('#qrcodeBox').qrcode({
						render: "canvas", //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
						text: url, //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
						width: "350", //二维码的宽度
						height: "350", //二维码的高度
						typeNumber: -1, //计算模式
						correctLevel: 2, //二维码纠错级别
						background: "#ffffff", //二维码的后景色
						foreground: "#000000", //二维码的前景色
						src: logo, //中间的logo
						imgWidth: 80,
						imgHeight: 80
					})
				})
			},
			handleClose(done) {
				done();
				jQuery('#qrcodeBox').html("");
			},
			confirmBtn() {
				this.dialogFormVisible = false;
				jQuery('#qrcodeBox').html("");
			},

			findByPage() {
				this.listQuery.loading = true;
				var params = {};
				params.pageSize = this.listQuery.pageSize;
				params.pageIndex = this.listQuery.pageIndex;
				params.name = this.listQuery.keyword.trim();
				params.order = this.listQuery.order;
				params.column = this.listQuery.column;

				this.http.get(this).url(config.space.list_url).params(
					params
				).request(function(response) {
					this.listQuery.loading = false;
					console.log(response);
					if(response.data.code == 0) {
						this.dataList = response.data.data.data;
						this.listQuery.total = response.data.data.totalSize;
					} else {
						this.$message.error(response.data.message);
					}
				}, function(error) {
					this.listQuery.loading = false;
					this.$message.error(error);
				});
			},
			//发布空间
			putaway(space) {
        this.$confirm('是否要发布空间"' + space.name + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.post(this).url(this.config.space.put_space).restful({spaceId: space.spaceId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '发布成功!'});
              this.findByPage();
            }, (err) => {
            });
        }).catch(() => {
        });
      },
      //取消发布空间
      pulled(space) {
        this.$confirm('是否要取消发布空间"' + space.name + '"?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: "el-button--danger"
        }).then(() => {
          this.http.post(this).url(this.config.space.pull_space).restful({spaceId: space.spaceId})
            .request((response) => {
              if (response.data.code != 0) {
                this.$message({message: response.data.message, type: 'error'});
                return;
              }
              this.$message({type: 'success', message: '已取消发布!'});
              this.findByPage();
            }, (err) => {
            });
        }).catch(() => {});
      },
			/**
			 * 删除空间
			 */
			deleteSpace(space) {
				this.http.get(this).url(this.config.validateGoods.space).restful({
					spaceId: space.spaceId
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

						let message = data ? " " : "是否删除商品 " + space.name + " ?";
						this.submitDelete(message, space, data);
					}, (error) => {}
				);
			},
			//   删除
			submitDelete(message, space, use) {
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
							}, "该空间\"" + space.name + "\"在首页推荐或首页置顶中存在使用，是否要继续删除？")
						]),
					}).then(() => {
						this.http.delete(this).url(this.config.space.delete_url).restful({
								spaceId: space.spaceId
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
						this.http.delete(this).url(this.config.space.delete_url).restful({
								spaceId: space.spaceId
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
			sortChange(column) {
				this.listQuery.column = column.prop;
				this.listQuery.order = column.order;
				console.log(this.listQuery.column);
				console.log(this.listQuery.order);

				this.findByPage();
			},
			onCreate() {
				this.state = "create";
			},

			createSuccess() {
				this.state = "list";
				this.findByPage();
			},

			onEdit(item) {
				var loadingInstance = Loading.service({
					text: '加载空间详细数据中...'
				});
				this.http.get(this).url(config.space.detail_url).restful({
					spaceId: item.spaceId
				}).request(function(response) {
					loadingInstance.close();
					console.log(response.data);
					if(response.data.code == 0) {
						this.state = "create";
						this.$refs.spaces.loadSource(response.data.data);
					} else {
						this.$message.error(response.data.message);
					}

				}, function(error) {
					loadingInstance.close();
					this.$message.error(error);
				});
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
			/**
			 * 查看商品
			 * @param space
			 */
			viewGoods(space) {
				this.spaceGoodsFormVisible = true;
				this.$refs.spaceGoods.loadSource(space);
			},

		}

	}
</script>

<style lang="scss">
  #space_vue{
		.table_box{
			button{
				margin-left:0;
			}
		}

	.el-dropdown-menu__item{
    text-align: center;
  }
  }
</style>  