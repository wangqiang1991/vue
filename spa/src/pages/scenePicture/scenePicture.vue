<template>
	<div class="gc-praiselist">
		<div v-show="state=='list'" class="gc-praiselist_content">
			<el-row :gutter="24">
				<el-col :span="24"> 
					<div class="grid-content bg-purple">

						<el-input @keyup.enter.native="doSearch()" v-model="listQuery.name" style="width: 120px !important;" class="filter-item" placeholder="输入图片名称">
						</el-input>

						<el-select @change="doSearch()" v-model="listQuery.areaId" style="width:120px" clearable filterable placeholder="请选择区域">
							<el-option v-for="item in roomAreas" :key="item.name" :label="item.name" :value="item.areaId">
							</el-option>
						</el-select>

						<el-select @change="doSearch()" v-model="listQuery.styleId" style="width:120px" clearable filterable placeholder="请选择风格">
							<el-option v-for="item in imageStyles" :key="item.name" :label="item.name" :value="item.styleId">
							</el-option>
						</el-select>

					<!-- 	<el-select @change="doSearch()" v-model="listQuery.level" style="width:130px" clearable filterable placeholder="请选择优先级">
							<el-option v-for="item in levels" :key="item.name" :label="item.name" :value="item.value">
							</el-option>
						</el-select>
 -->
						<el-select @change="doSearch()" v-model="listQuery.tagType" style="width:110px" clearable filterable placeholder="标签类型">
							<el-option v-for="item in tagTypes" :key="item.name" :label="item.name" :value="item.value">
							</el-option>
						</el-select>

						<el-select @change="doSearch()" v-model="listQuery.topHome" style="width:120px" clearable filterable placeholder="是否上首页">
							<el-option v-for="item in statusItems" :key="item.name" :label="item.name" :value="item.value">
							</el-option>
						</el-select>

						<el-select @change="doSearch()" v-model="listQuery.putaway" style="width:110px" clearable filterable placeholder="上架/下架">
							<el-option v-for="item in pItems" :key="item.name" :label="item.name" :value="item.value">
							</el-option>
						</el-select>

						<el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索
						</el-button>
						<el-button @click="onCreate" type="primary" icon="plus">新建场景图</el-button>
					</div>
				</el-col>

			</el-row>
			<div class="gc-praiselist_content_list">
				<el-table v-loading="listQuery.loading" element-loading-text="努力加载中..." ref="multipleTable" :data="dataList" border style="width: 100%" @sort-change="sortChange">
					<el-table-column type="index" align="center" label="序号" width="65">
					</el-table-column>
					<el-table-column sortable="custom" prop="viewCount" label="浏览量" align="center" vertical="middle">
					</el-table-column>
					<el-table-column prop="name" label="图片名称">
					</el-table-column>
					<el-table-column label="图片" align="center" >
						<template scope="scope">
							<img style="width:50px;height:50px;" :src="scope.row.cover+'?imageView2/1/w/320/h/320'" class="gc_praiselist_list_img">
						</template>
					</el-table-column>
					<!-- <el-table-column label="优先级" align="center">
						<template scope="scope">
							<span>{{scope.row.level}}级</span>
						</template>
					</el-table-column> -->
					<el-table-column prop="roomNames" label="区域" align="center">
					</el-table-column>
					<el-table-column prop="styleNames" label="风格" align="center">
					</el-table-column>

					<el-table-column prop="tagType" label="标签类型" align="center">
						<template scope="scope">
							<span v-if="scope.row.tagType == 1">无</span>
							<span v-if="scope.row.tagType == 2">点赞标签</span>
							<span v-if="scope.row.tagType == 3">混合标签</span>
							<span v-if="scope.row.tagType == 4">购买标签</span>
						</template>
					</el-table-column>

					<el-table-column  label="购买商品数/点赞商品数" align="center">
						<template scope="scope">
								<span>{{scope.row.tagCount.goodsCount}} / {{scope.row.tagCount.praiseCount}}</span>
						</template>
					</el-table-column>

					<el-table-column label="首页" align="center">
						<template scope="scope">
							<span v-if="scope.row.homeTop">上</span>
							<span v-else>下</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="360">
						<template scope="scope">
							<!-- <el-button-group> -->
							<el-button v-if="!scope.row.putaway" size="small" icon="circle-check" type="success" @click="putaway(scope.row)">上架
							</el-button>
							<el-button v-if="scope.row.putaway" size="small" icon="circle-close" type="warning" @click="pullUndercarriage(scope.row)">下架
							</el-button>
							<el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="onEdit(scope.row)">编辑
							</el-button>
							<!-- <el-button size="small" icon="d-caret" type="info" @click="onLevel(scope.row)">优先级
							</el-button> -->
							<el-button icon="delete" size="small" type="danger" @click="deletePicture(scope.row)">删除
							</el-button>
							<el-button class="fontFamily"  type="info" size="small" @click='copyGoodsUrl(scope.row,$event)'> 复制链接 </el-button>
							<!-- </el-button-group> -->
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
		<save-picture ref="picture" @success="createSuccess()" v-on:cancel="state='list'" v-show="state=='create'">
		</save-picture>

		<el-dialog title="优先级设置" :visible.sync="dialogFormVisible">
			<el-form>
				<el-form-item label="图片名称" :label-width="formLabelWidth">
					<span>{{currentPicture.name}}</span>
				</el-form-item>
				<el-form-item label="优先级" :label-width="formLabelWidth">
					<el-select v-model="levelValue" style="width:130px" clearable filterable placeholder="请选择优先级">
						<el-option v-for="item in levels" :key="item.name" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmLevel">确 定</el-button>
			</div>
		</el-dialog>

    <el-dialog  title="复制图片链接" :visible.sync="qrcodeVisible">
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
  import clip from '@/utils/copyText'
	import SavePicture from './SavePicture'
	import waves from '@/directive/waves/index.js' // 水波纹指令
	export default {
		components: {
			SavePicture
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
					loading: false,
					pageIndex: 1,
					pageSize: 15,
					total: 0,
					keyword: "",
					column: "",
					order: "",
					areaId: "",
					styleId: "",
					level: null,
					tagType: null,
					topHome: null,
					putaway: null
				},
				dataList: [],
				detail: null,
				state: "list", // list | create | edit
				statusItems: [{
						name: "上首页",
						value: true
					},
					{
						name: "下首页",
						value: false
					}
				],
				tagTypes: [{
						name: "无",
						value: 1
					},
					{
						name: "点赞标签",
						value: 2
					},
					{
						name: "混合标签",
						value: 3
					},
					{
						name: "购买标签",
						value: 4
					}
				],
				levels: [{
						name: "1级",
						value: 1
					},
					{
						name: "2级",
						value: 2
					},
					{
						name: "3级",
						value: 3
					},
					{
						name: "4级",
						value: 4
					},
					{
						name: "5级",
						value: 5
					},
					{
						name: "6级",
						value: 6
					},
					{
						name: "7级",
						value: 7
					},
					{
						name: "8级",
						value: 8
					},
					{
						name: "9级",
						value: 9
					},
					{
						name: "10级",
						value: 10
					}
				],
				pItems: [{
						name: "上架",
						value: true
					},
					{
						name: "下架",
						value: false
					}
				],
				roomAreas: [],
				imageStyles: [],
				currentPicture: {},
				levelValue: null,
				dialogFormVisible: false
			}
		},
		methods: {
      copyGoodsUrl(data,event) {
        this.restCode(); 
        let url = "https://wx.goochao.com/scene.html?sceneId=" + data.sceneId;
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
        clip(qrcodeUrl,event,'图片链接');
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
				this.http.get(this).url(this.config.picture.list_url).params(this.listQuery).request(
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
			//          下架
			pullUndercarriage(picture) {
				this.http.get(this).url(this.config.validateGoods.scene_url).restful({
					sceneId: picture.sceneId
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
						let message = data ? " " : "是否要下架图片 " + picture.name + " ?";
						this.pulled(message, picture, data);
					}, (error) => {}
				);
			},
			//			下架
			pulled(message, picture, use) {
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
							}, "该场景图\"" + picture.name + "\"在首页推荐或首页置顶中存在使用，是否要继续下架？  若继续，系统将会把首页推荐或首页置顶中的使用一并下架！！！")
						]),
					}).then(() => {
						this.http.post(this).url(this.config.picture.pulled_url).params({
								sceneIds: picture.sceneId
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
						this.http.post(this).url(this.config.picture.pulled_url).params({
								sceneIds: picture.sceneId
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

			//删除
			deletePicture(picture) {				
				this.http.get(this).url(this.config.validateGoods.scene_url).restful({
					sceneId: picture.sceneId
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
						let message = data ? " " : "是否删除场景图 " + picture.name + " ?";
						this.deleteScene(message, picture,data);

					}, (error) => {}
				);
			},
			//			删除
			deleteScene(message,picture,use) {

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
							}, "该场景图\"" + picture.name + "\"在首页推荐或首页置顶中存在使用，是否要继续删除？")
						]),
					}).then(() => {
						this.http.delete(this).url(this.config.picture.delete_url).restful({
								 sceneId: picture.sceneId
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
						this.http.delete(this).url(this.config.picture.delete_url).restful({
                                sceneId: picture.sceneId
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
			onEdit(picture) {
				this.http.get(this).url(this.config.picture.detail_url)
					.restful({
						sceneId: picture.sceneId
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
							this.state = "create";
							console.log(this.$refs.picture)
							this.$refs.picture.loadSource(this.detail);
						}, (err) => {});
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
			},
			onLevel(picture) {
				this.currentPicture = picture;
				this.levelValue = picture.level;
				this.dialogFormVisible = true;
			},
			confirmLevel() {
				if(!this.levelValue) {
					this.$message({
						message: "请选择优先级",
						type: 'warning'
					});
					return;
				}
				this.listQuery.loading = true;
				this.http.post(this).url(this.config.picture.update_level_url)
					.restful({
						sceneId: this.currentPicture.sceneId
					})
					.params({
						level: this.levelValue
					})
					.request((response) => {
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
							message: '设置优先级成功!'
						});
						this.findByPage();
						this.dialogFormVisible = false;
					}, (err) => {
						this.listQuery.loading = false;
					});
			},

			//			上架
			putaway(picture) {
				this.$confirm('是否要上架图片"' + picture.name + '"?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.http.post(this).url(this.config.picture.putaway_url).params({
							sceneIds: picture.sceneId
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
			}
		},
		mounted() {
			this.findByPage();
			this.findRoomAreas();
			this.findImageStyles();
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
	
	.el-number-cus {}
	/*.el-number-cus .el-input {
    width: 181px !important;
    margin-left: 0px !important;
  }*/
</style>