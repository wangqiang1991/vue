<template>
	<div id="afterSaleInformation_Vue">
		<div class="orderNumberArea">
			<p id="orderNumber_p" class="orderNumberTitle" style="height: 0.2rem;">订单编号:
				<input readonly type="text" :value="productArray.orderNumber" id="copy_content">
				<span data-clipboard-target="#copy_content" id="copy_btn" @click='copyOrderNumber()'>
          <img src="../../assets/img/copy_image_btn.png" >
        </span>
			</p>
			<p class="sureBtn" @click="tocustomerService">联系客服</p>
		</div>
		<div class="process">
			<div class="content" v-for="record in records">
				<p class="line">
					<span class="line_top"></span>
					<i></i>
					<span class="line_bottom"></span>
				</p>
				<div>
					<p>{{record.title}}</p>
					<time>{{record.date | parseTime('{y}-{m}-{d} {h}:{i}')}}</time>
				</div>
			</div>
		</div>
		<div class="productBox" @click="goDetal(n)">
			<div class="productPicBox">
				<img :src="productArray.detail.cover + '?imageView2/0/w/500/h/500|imageslim'"/>
			</div>
			<div class="productRight" style="overflow:hidden;">
				<p class="productTitle">{{productArray.detail.title}}</p>
				<p class="productSize" style="width:5rem;max-width:5rem;"> <span>{{productArray.detail.styleName}}</span><span v-if="productArray.detail.subName">{{productArray.detail.subName}}</span> </p>
				<p class="productPrice" style="margin-top:0.18rem;"><span> ¥{{productArray.detail.money}} {{productArray.detail.expressMoney ? "(含运费 ¥"+productArray.detail.expressMoney+")" : "(免运费)"}} </span><span>X{{productArray.detail.amount}}</span></p>
			</div>
		</div>

		<!-- 售后类型 -->
		<div class="returnPriceArea">
			<p class="returnPriceTitle">售后类型:</p>
			<p class="returnPrice"  v-show="productArray.detail.afterSaleType == 1">退款</p>
			<p class="returnPrice" v-show="productArray.detail.afterSaleType == 2">换货</p>
			<p class="returnPrice"  v-show="productArray.detail.afterSaleType == 3">退款退货</p>
		</div>

		<!-- 申请数量 -->
		<div class="returnPriceArea">
			<p class="returnPriceTitle">申请数量:</p>
			<p class="returnPrice">{{productArray.applyCount}}</p>
		</div>

		<!-- 原因 -->
		<div class="returnPriceArea">
			<p class="returnPriceTitle" v-show="productArray.detail.afterSaleType == 1">退款原因:</p>
			<p class="returnPriceTitle" v-show="productArray.detail.afterSaleType == 2">换货原因:</p>
			<p class="returnPriceTitle" v-show="productArray.detail.afterSaleType == 3">退货原因:</p>
			<p class="returnPrice" >{{productArray.refundReason}}</p>
		</div>

		<!-- 显示退款金额 -->
		<div class="returnPriceArea" v-show="showPrice">
			<p class="returnPriceTitle" style="width:auto;">退款金额:</p>
			<p class="returnPrice" style="color:#343434;">¥{{productArray.refundMoney}}</p>
		</div>

		<!-- 我的备注 -->
		<!-- <div class="returnPriceArea " v-show='productArray.remark != "" && productArray.remark != null'>
			<p class="returnPriceTitle returnover">备注信息: {{productArray.remark}}</p>
		</div> -->
		<p class="message_box" v-show='productArray.remark != "" && productArray.remark != null'>备注信息: {{productArray.remark}}</p>

		<!--退货图片-->
		<div id="imges" v-show="images.length != 0">
			<p>问题图片</p>
			<div id='returnPicture'>
				<img v-for="image in images" :src="image+ '?imageView2/0/w/500/h/500|imageslim'" @click="imgEnlarge(image)" />
			</div>
		</div>

		<!-- 商家退款理由 -->
		<!-- <div class="returnPriceArea" v-show="productArray.rejectReason != null && productArray.rejectReason != '' ">
			<p class="returnPriceTitle returnover">拒退理由: {{productArray.rejectReason}}</p>
		</div> -->
		
		<p class="message_box" style="border-bottom:none;border-top:1px solid #F2F2F2;" v-show="productArray.rejectReason != null && productArray.rejectReason != '' ">拒退理由: {{productArray.rejectReason}}</p>


    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>


	</div>
</template>

<script>

  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';
	export default {
		name: 'afterSaleInformation',

		components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
		data() {
			return {
				firstLoad:true,
				loadFailed:false,
				productArray: {
					detail: {
						cover: ''
					}
				},
				records: [],
				showPrice: false,
				showReason: false,
				images: []
			}
		},
		created() {
			document.title = "售后"
		},
		mounted: function() {
			this.loadData();
		},
		methods: {
			reload() {
				this.loadData();
			},
			copyOrderNumber() {
				var clipboard = new Clipboard('#copy_btn');
				clipboard.on('success', (e) => {
					this.showMessage('订单号复制成功')
					e.clearSelection();
					clipboard.destroy();
				});
				clipboard.on('error', (e) => {
					this.showError('订单号复制失败,请手动复制')
					clipboard.destroy();
				});

			},
			tocustomerService() {
				this.goToRobot({
					'customField1': this.getParam('orderNumber'),
					'customField2': this.productArray.detail.title,
					'customField3': this.productArray.workNumber,
					'customField4': this.productArray.detail.goodsNumber
				});
			},
			goDetal(e) {
				console.log(this)
				this.keep.go('/goods_detail.html', true, {
					goodsid: this.productArray.detail.goodsId,showGoHome:'1'
				});
			},
			loadData() {
				var relationId = this.getParam('relationId');
				this.http.get(this).url('/app/api/work/:relationId').restful({
					relationId: relationId
				}).request(function(response) {
					this.firstLoad =false;
					//      console.log(response)	
					var data = response.data.data;

					if(!data.images) {
						this.images = [];
					} else {
						this.images = data.images.split(",")
					}

					this.productArray = data;
					console.log(this.productArray);
					this.loadRecords();

				}, function(err) {
					this.firstLoad = false;
					this.loadFailed = true;
					//this.showError("服务器繁忙")
				}, function(response) {
					this.firstLoad =false;
					this.loadFailed = true;
					//this.showError(response.data.message);
				})
			},
			//   点击图放大
			imgEnlarge(image) {
				var images = this.images;
        console.log(images, image);
				this.wx.previewImage({
					current: image, // 当前显示图片的http链接
					urls: images // 需要预览的图片http链接列表
				});
			},
			loadRecords() {
				// 直接退款
				if(this.productArray.workType == 1) {
					this.showPrice = true;
					this.showReason = false;
					this.records.push({
						title: "已申请退款",
						date: this.productArray.createdAt
					});
					console.log('退款')
					if(this.productArray.applyStatus == 2) {
						this.records.push({
							title: "商家拒绝退款",
							date: this.productArray.rejectDate
						});
						return;
					}
					if(this.productArray.applyStatus >= 3) {
						this.records.push({
							title: "退款中",
							date: this.productArray.refundingDate
						});
					}
					if(this.productArray.applyStatus == 4) {
						this.records.push({
							title: "退款成功",
							date: this.productArray.refundDate
						});
						return;
					}
					if(this.productArray.applyStatus == 5) {
						this.records.push({
							title: "退款失败",
							date: this.productArray.refundFailureDate
						});
					}
				} else if(this.productArray.workType == 2) {
					this.showPrice = false;
					this.showReason = true;
					// 换货
					console.log('换货')
					this.records.push({
						title: "已申请换货",
						date: this.productArray.createdAt
					});
					if(this.productArray.applyStatus == 2) {
						this.records.push({
							title: "商家拒绝换货",
							date: this.productArray.rejectDate
						});
						return;
					}
					if(this.productArray.applyStatus >= 3) {
						this.records.push({
							title: "商家待收货",
							date: this.productArray.deliveredDate
						});
					}
					if(this.productArray.applyStatus == 4) {
						this.records.push({
							title: "商家拒绝换货",
							date: this.productArray.deliveryRejectDate
						});
						return;
					}
					if(this.productArray.applyStatus >= 5) {
						this.records.push({
							title: "商家已确认收货",
							date: this.productArray.deliveryCompleteDate
						});
					}
					if(this.productArray.applyStatus >= 6) {
						this.records.push({
							title: "客户待收货",
							date: this.productArray.clientDeliveredDate
						});
					}
					if(this.productArray.applyStatus == 7) {
						this.records.push({
							title: "客户已确认收货",
							date: this.productArray.clientDeliveryCompleteDate
						});
					}
				} else {
					// 退货
					this.showPrice = true;
					this.showReason = true;
					console.log('退货')
					this.records.push({
						title: "已申请退货",
						date: this.productArray.createdAt
					});
					if(this.productArray.applyStatus == 2) {
						this.records.push({
							title: "商家拒绝退货",
							date: this.productArray.rejectDate
						});
						return;
					}
					if(this.productArray.applyStatus >= 3) {
						this.records.push({
							title: "商家待收货",
							date: this.productArray.deliveredDate
						});
					}
					if(this.productArray.applyStatus == 4) {
						this.records.push({
							title: "商家拒绝退款",
							date: this.productArray.refundRejectDate
						});
						return;
					}
					if(this.productArray.applyStatus >= 5) {
						this.records.push({
							title: "商家已确认收货",
							date: this.productArray.deliveryCompleteDate
						});
					}
					if(this.productArray.applyStatus >= 6) {
						this.records.push({
							title: "退款中",
							date: this.productArray.refundingDate
						});
					}
					if(this.productArray.applyStatus == 7) {
						this.records.push({
							title: "退款成功",
							date: this.productArray.refundDate
						});
						return;
					}
					if(this.productArray.applyStatus == 8) {
						this.records.push({
							title: "退款失败",
							date: this.productArray.refundFailureDate
						});
					}
				}
			}

		}
	}
</script>

<style lang='scss'>
	@import '../../assets/scss/afterSaleInformation.scss';
</style>