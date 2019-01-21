<template>
	<div class="createPost-container">
		<el-form class="form-container">
			
			<sticky :className="'sub-navbar'">
	      <template>
	        <el-button @click="returnList">返 回</el-button>
	      </template>
	    </sticky>

			<div class="createPost-main-container" style="margin-top: -50px;">
				<el-row>
					<el-col :span="21">
						<p style="margin-bottom:20px;color: #48576A;font-weight: bold;font-size: 18px;">基本信息</p>
					</el-col>
					<el-col :span="21">
						<el-form-item label-width="100px" label="商品标题:">
							<span>{{goods.title}}</span>
						</el-form-item>

						<el-form-item label-width="100px" label="商品编码:">
							<span>{{goods.goodsNumber}}</span>
						</el-form-item>

						<!--封面-->
						<el-form-item label-width="80px" label="封面:">
							<el-progress v-show="materialsUpload.uploading" type="circle" :percentage="materialsUpload.percentage"></el-progress>
							<div v-show="goods.cover && !materialsUpload.uploading" class="el-upload el-upload--picture-card">
								<img id="puploadCover" title="点击修改图片" style="width:100%; height:100%" :src="goods.cover+config.imgtmb._200">
							</div>

							<div v-show="!goods.cover && !materialsUpload.uploading" style="display:inline-block; margin-left:8px">
								<div class="el-upload el-upload--picture-card" id="puploadCoverBtn">
									<i data-v-5b37d0d4="" class="el-icon-plus"></i>
								</div>
							</div>
						</el-form-item>

						<el-form-item label-width="80px" label="设计师:">
							<!--<el-select class="filter-item" style="width: 250px;" v-model="goods.designerId" placeholder="指定设计师">
								<el-option v-for="item in designers" :key="item.designerId" :label="item.nickName" :value="item.designerId">									
								</el-option>
							</el-select>-->
							<span>{{goods.designerName}}</span>
						</el-form-item>

						<el-form-item label-width="80px" label="商品简介:">
							<span>{{goods.description}}</span>
						</el-form-item>

						<el-form-item label-width="80px" label="点赞标签:">
							<span :key="tag" type="primary" v-for="tag in goods.tags" style="margin:3px" :closable="true" :close-transition="false" @close="handleClose(tag)">
								{{tag.title}}
							</span>
							<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" style="width:100px" placeholder="输入标签名称" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
							</el-input>
							<el-button v-else class="button-new-tag" size="small" @click="showInput" style="display: none;">新增标签</el-button>
						</el-form-item>
						<el-form-item>
							<el-col :span="21">
								<el-form-item label-width="100px" label="关联图片数:">
									<span>&nbsp;&nbsp;{{goods.relationCount}}</span>
								</el-form-item>
							</el-col>

							<el-col :span="21">
								<el-form-item label-width="100px" label="点赞数:">
									<span>&nbsp;&nbsp;{{goods.praiseCount}}</span>
								</el-form-item>
							</el-col>

							<el-col :span="21">
								<el-form-item label-width="100px" label="点击数:">
									<span>&nbsp;&nbsp;{{goods.clickCount}}</span>
								</el-form-item>
							</el-col>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="21">
						<h1 style="margin-bottom:20px;font-weight: bold; color: #48576A;font-size: 18px;">展示内容</h1>
					</el-col>
					<el-col :span="21">
						<el-form-item label-width="80px" label="banner图:">
						</el-form-item>

						<el-form-item>
							<!--<div v-for="banner in banners" class="el-upload el-upload--picture-card" style="margin-right:2px;">
								<img @click="removeBanner(banner)" title="点击移除图片" style="width:115%; height:100%" :src="banner+config.imgtmb._200">
							</div>-->

							<!--<el-progress style="display:inline-block" v-show="uploading" type="circle" :percentage="percentage"></el-progress>-->

							<!--<div v-show="!uploading" style="display:inline-block">
								<div class="el-upload el-upload--picture-card" id="uploadBtn">
									<i data-v-5b37d0d4="" class="el-icon-plus"></i>
								</div>
							</div>-->
							<!--<upload-image-view idPrefix="praise_" ref="detail" style="width:1000px;"></upload-image-view>-->
							<el-table :data="banners" border style="width: 100%">

								<el-table-column type="index" align="center" label="序号" width="65">
								</el-table-column>

								<el-table-column prop="goods" label="商品" align="center" vertical="middle" width="120">
									<template scope="scope">
										<img style="width:50px;height:50px;" :src="scope.row" class="gc_praiselist_list_img">
									</template>
								</el-table-column>

								<el-table-column prop="name" label="商品地址">
									<template scope="scope">
										<a :href="scope.row" target="_blank"><span class="link-type" @click="goodsAddress">{{scope.row}}</span></a>
									</template>
								</el-table-column>

							</el-table>
						</el-form-item>

						<el-form-item label-width="80px" label="详情描述:">
							<el-button type="text" @click="editDetailInfo">点击查看详情</el-button>
						</el-form-item>

					</el-col>
				</el-row>

			</div>
		</el-form>

	</div>
</template>

<script>
	//	组件 显示图片  和地址
	import Sticky from '@/components/Sticky' // 粘性header组件
	import uploader from '@/utils/uploader'
	import { formatDate } from '@/commons/date.js'
	import UploadImageView from '@/pages/commons/UploadImageView.vue'

	export default {
		name: 'savePraiseGoods',
		components: {
			Sticky,
			UploadImageView
		},
		filters: {
			formatDate(time) {
				if(!time) {
					return "无";
				}
				let date = new Date(time);
				//此处formatDate是一个函数，将其封装在common/js/date.js里面，便于全局使用
				return formatDate(date, 'yyyy-MM-dd hh:mm');
			}
		},
		data() {
			return {
				percentage: 0,
				uploading: false,
				inputVisible: false,
				inputValue: '',
				loading: false,
				goods: {
					tags: [],
					designerId: '',
					cover: ''

				},
				banners: [],
				designers: [],
				styleUplaod: {
					uploading: false,
					percentage: 0,
					isInit: false
				},
				//				初始化封面
				materialsUpload: {
					uploading: false,
					isInit: false,
					percentage: 0,
					token: null
				}
			}
		},
		mounted: function() {
			this.findDesigners();
		},
		methods: {
			//			商品地址
			goodsAddress() {

			},
			//			返回
			returnList() {
				this.$emit("cancel");
			},

			reset() {
				this.goods.goodsId = null;
				this.goods.title = "";
				this.goods.goodsNumber = "";
				this.goods.description = "";
				this.goods.tags = [];
				this.goods.banner = "";
				this.goods.detailUrl = "";
				this.goods.designerId = "";
				this.banners = [];
				this.$refs.detail.setUrls([]);
			},
			loadSource(source) {
				this.goods = source;
				this.banners = source.banner.split(",");

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

			save() {
				let urls = this.$refs.detail.getUrls();
				this.banners = urls;
				//表单验证
				if(!this.goods.title || !this.goods.title.trim()) {
					this.$message({
						message: '商品标题不能为空',
						type: 'warning'
					});
					return;
				}
				if(!this.goods.goodsNumber || !this.goods.goodsNumber.trim()) {
					this.$message({
						message: '商品编号不能为空',
						type: 'warning'
					});
					return;
				}
				if(!this.goods.description || !this.goods.description.trim()) {
					this.$message({
						message: '商品简介不能为空',
						type: 'warning'
					});
					return;
				}
				if(!this.goods.tags || this.goods.tags.length == 0) {
					this.$message({
						message: '点赞标签不能为空',
						type: 'warning'
					});
					return;
				}
				if(!this.banners || this.banners.length == 0) {
					this.$message({
						message: 'banner图不能为空',
						type: 'warning'
					});
					return;
				}

				this.goods.banner = this.banners.join();
				console.log(this.goods);

				this.http.postJson(this).url(this.config.praise_goods.save_url).params(this.goods).request(
					(response) => {
						if(response.data.code != 0) {
							this.$message({
								message: response.data.message,
								type: 'error'
							});
							return;
						}
						this.$message({
							type: 'success',
							message: '保存成功!'
						});
						this.reset();
						this.$emit('success');
					},
					(error) => {}
				);
			},

			removeBanner(banner) {
				this.$confirm('是否要移除图片吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					confirmButtonClass: "el-button--danger"
				}).then(() => {
					let index = this.banners.indexOf(banner);
					if(index != -1) {
						this.banners.splice(index, 1);
					}
				}).catch(() => {});

			},
			handleClose(tag) {
				this.goods.tags.splice(this.goods.tags.indexOf(tag), 1);
			},
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			editDetailInfo() {
				if(!this.goods.detailUrl) {
					let params = {
						title: "点赞商品详情",
						type: 1
					};
					this.http.postJson(this).url(this.config.articles.save_url).params(params).request(
						(response) => {
							if(response.data.code != 0) {
								this.$message({
									message: response.data.message,
									type: 'error'
								});
								return;
							}
							this.goods.detailUrl = response.data.data.articleId;
							window.open("/editor/show.html?articleId=" + this.goods.detailUrl, "_blank");
						},
						(error) => {}
					);
				} else {
					window.open("/editor/show.html?articleId=" + this.goods.detailUrl, "_blank");
				}
			},
			handleInputConfirm() {
				let inputValue = this.inputValue;
				if(inputValue) {
					this.goods.tags.push({
						title: inputValue
					});
				}
				this.inputVisible = false;
				this.inputValue = '';
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";
	.title-prompt {
		position: absolute;
		right: 0px;
		font-size: 12px;
		top: 10px;
		color: #ff4949;
	}
	
	.createPost-container {
		position: relative;
		.createPost-main-container {
			padding: 40px 45px 20px 50px;
			.postInfo-container {
				position: relative;
				@include clearfix;
				margin-bottom: 10px;
				.postInfo-container-item {
					float: left;
				}
			}
			.editor-container {
				min-height: 500px;
				margin: 0 0 30px;
				.editor-upload-btn-container {
					text-align: right;
					margin-right: 10px;
					.editor-upload-btn {
						display: inline-block;
					}
				}
			}
		}
		.word-counter {
			width: 40px;
			position: absolute;
			right: -10px;
			top: 0px;
		}
	}
</style>