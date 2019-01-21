<template>
	<div id="ReturnGoods_Vue">

		<div class="content_box" style="padding-bottom:0.56rem;">

			<div class="goodContent">
				<div class="picBox">
					<img :src="cover + '?imageView2/0/w/500/h/500|imageslim'" />
				</div>
				<div class="box-right" style="overflow:hidden;">
					<p class="productTitle">
						{{title}}
					</p>
					<p class="productSize" style="width:5rem;max-width:5rem;"><span>{{styleName}}</span><span v-if="subName">{{subName}}</span> </p>
					<p class="productPrice">¥{{refundMoney}} <span style="font-size:0.1rem;font-weight:400">{{data.orderGoodsRelationDetail.expressMoney ? "(含运费 ¥"+data.orderGoodsRelationDetail.expressMoney+")" : "(免运费)"}}</span> </p>
				</div>
			</div>

			<p id="orderNumber_p" class="orderNo">
				<span>订单编号：</span>
        <span>
          <img src="../../assets/img/copy_image_btn.png" data-clipboard-target="#copy_content" id="copy_btn" @click='copyOrderNumber()'>
          <input readonly type="text" :value="orderNum" id="copy_content">
        </span>
			</p>


			<div class="method" v-if="orderStatus != 5">
				<p>处理方式<span style="color:#f75151;">*</span></p>
				<p>
					<span class="method1">退款</span>
					<img src="../../assets/img/arrow_right_choice.png" />
				</p>
				
			</div>

			<div class="method" @click="method" v-else>
				<p>处理方式<span style="color:#f75151;">*</span></p>
				<p>
					<span class="method1" v-if="!returnMethod" style="color:#cacaca;">请选择</span>
					<span class="method1" v-else v-model="returnMethod">{{returnMethod}}</span>
					<img src="../../assets/img/arrow_right_choice.png" />
				</p>
			</div>

			<div class="method" @click="cause">
				<p>申请原因<span style="color:#f75151;">*</span></p>
				<p>
					<span class="method1" v-if="!returnReason" style="color:#cacaca;">请选择</span>
					<span class="method1" v-else v-model="returnReason">{{returnReason}}</span>
					<img src="../../assets/img/arrow_right_choice.png" />
				</p>
			</div>

			<div class="method" v-if="orderStatus != 5">
				<p>售后数量<span style="color:#f75151;">*</span></p>
				<p>
					
					<b style="background:#fff;">{{maxCount}}</b>
					
				</p>
			</div>
			<div class="method" v-else>
				<p>售后数量<span style="color:#f75151;">*</span></p>
				<p>
					<span @click='reduce' class="returnNumber"> <img src="../../assets/img/red.png" /> </span>
					<b>{{count}}</b>
					<span @click='add' class="returnNumber"><img src="../../assets/img/ad.png" /> </span>
				</p>
			</div>



			<div class="method" @click="changePhone">
				<p>联系方式<span style="color:#f75151;">*</span></p>
				<p><input class="phone1" v-model="phone"></p>
			</div>

			<p class="returnCause" style="border-top: 1px solid #ddd;">
				问题描述：
			</p>

			<textarea style="width:3.45rem;" id='textarea' maxlength="200" name="textarea"  rows="5" placeholder="(请您在此描述您的问题)" v-model="remark"></textarea>

			<div class="addPic">
				<ul>
					<li class="picBox" v-for="pic in pics">
						<img :src="pic" />
						<i @click="deleteImg(pic)">
	            <img src="../../assets/img/delete.png" alt="删除图标">
	          </i>
					</li>

				</ul>
				<div class="editPic" style="overflow:hidden;" v-show="pics.length < 3">
					<img src="../../assets/img/add_img_btn.png" class="addPicBtn" @click="addPic" />
				</div>
			</div>

		</div>

		<div class="afterSaleBtn" @click="returnMoney()" v-if="orderStatus != 5">
			申请退款
		</div>
		<div class="afterSaleBtn" @click="returnGoods" v-else>
			申请售后
		</div>

		<div v-show="!loading" class="cd-popup2 methodContent">
			<div class="cd-popup-container2">
				<p class="title">
					处理方式
					<!--<img src="../../assets/img/closePic.png" class="cancel"/>-->
					<span class="cancel">取消</span>
					<ul class="contentBox">
						<li class="contentMain" @click="onlyReturnGoods">换货</li>
						<li class="contentMain" @click="bothReturnGoodsMoney">退款退货</li>
					</ul>
					<div class="mengban" v-show="clickType"></div>
				</p>
			</div>
		</div>

		<div v-show="!loading" class="cd-popup2 causeContent">
			<div class="cd-popup-container2">
				<p class="title">
					申请原因
					<!--<img src="../../assets/img/closePic.png" class="cancel"/>-->
					<span class="cancel">取消</span>
					<ul class="contentBox">
						<!-- <li class="contentMain" @click="quality">质量问题</li>
						<li class="contentMain" @click="other">其他</li> -->
						<li class="contentMain" v-for="item in returnReasons"  @click="chocieReason(item)">{{item}}</li>
					</ul>
					<div class="mengban" v-show="clickType"></div>
				</p>
			</div>
		</div>
	
	  <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>


	</div>
</template>

<script>
	import LoadingView from '@/components/Loading.vue';
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';
	import wx from 'weixin-js-sdk';

	var data1 = ['不想要了','发货太慢，不想等了','忘记使用优惠券','商家无货','其他'];
	var data2 = ['不想要了','商家发错货','质量问题','商品损坏','商品与页面描述不符','其他'];

	export default {
		name: 'ReturnGoods',
		components: {
      firstLoad:firstLoad,
      loadFailed:loadFailed,
    },
		data() {
			return {
				data:{
					orderGoodsRelationDetail:{
						expressMoney:0,
					}
				},
				firstLoad:true,
				loadFailed:false,
				pics: [],
				returnReasons:[],
				remark: '',
				workType: 2,
				reason: '',
				phone: '',
				count:1,
				maxCount:1,
				refundMoney: '',
				orderNum: '',
				title: '',
				styleName: '',
				subName:'',
				cover: '',
				returnReason: '',
				returnMethod: '',
				clickType: false,
				onceType: true
			}
		},
		created() {
			var orderStatus = this.getParam('orderStatus');
			if(orderStatus == 2) {
				document.title = "申请退款";
				this.returnReasons = data1;
			} else {
				document.title = "申请售后";
				this.returnReasons = data2;
			}
		},
		mounted: function() {
			this.relationId = this.getParam('relationId');
			var orderNumber = this.getParam('orderNumber');
			this.laodOrderDetail(orderNumber);

			$(".cd-popup2").on("touchmove", function() {
				event.preventDefault();
			})
			$(".cd-popup2").on("click", function() {
				event.preventDefault();
			})

			this.http.get(this).url('/app/api/auth/wx-config').request(function(response) {
				console.log(response.data.data)
				var res = response.data.data;
				wx.config({
					appId: res.appId, // 必填，公众号的唯一标识
					timestamp: res.timestamp, // 必填，生成签名的时间戳
					nonceStr: res.nonceStr, // 必填，生成签名的随机串
					signature: res.signature, // 必填，签名,
					jsApiList: ["chooseImage", "previewImage", "uploadImage"]
				})
			});
			wx.ready(function() {});
			wx.error(function(res) {});

		},
		methods: {
			reduce() {
				if (this.count > 1) {
					this.count--;
				}
			},
			add() {
				if (this.count < (this.data.orderGoodsRelationDetail.amount - this.data.orderGoodsRelationDetail.afterApplyCount)) {
					this.count++;
				}
			},
			chocieReason(item) {
				$('.causeContent').removeClass('is-visible2');
				this.returnReason = item;
				this.reason = item;
				this.clickType = true;		
			},
			reload(){
				this.loadFailed = false;
				var orderNumber = this.getParam('orderNumber');
				this.laodOrderDetail(orderNumber);
			},
			laodOrderDetail(orderNumber){
				this.http.get(this).url('/app/api/order/detail/:orderNumber').restful({
					orderNumber: orderNumber
				}).request(function(response) {
					this.firstLoad = false;
					var data = response.data.data;
					this.data = data;
					this.phone = data.phone;
					this.maxCount = data.orderGoodsRelationDetail.amount;
					this.refundMoney = data.orderGoodsRelationDetail.money;
					this.orderNum = data.orderGoodsRelationDetail.orderNumber;
					this.title = data.orderGoodsRelationDetail.title;
					this.styleName = data.orderGoodsRelationDetail.styleName;
					this.subName = data.orderGoodsRelationDetail.subName;
					this.cover = data.orderGoodsRelationDetail.cover;
					this.orderStatus = data.orderGoodsRelationDetail.orderStatus;
				},(err)=>{
					this.firstLoad = false;
					this.loadFailed = true;
				})
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
			changePhone() {
				$('.phone1').focus()
			},
			quality() {
				$('.causeContent').removeClass('is-visible2');
				this.returnReason = '质量问题';
				this.reason = '质量问题';
				this.clickType = true;
			},
			other() {
				$('.causeContent').removeClass('is-visible2');
				this.returnReason = '其他';
				this.reason = '其他';
				this.clickType = true;
			},
			onlyReturnGoods() {
				this.workType = 2;
				$('.methodContent').removeClass('is-visible2');
				this.returnMethod = '换货';
				this.clickType = true;
			},
			bothReturnGoodsMoney() {
				this.workType = 3;
				$('.methodContent').removeClass('is-visible2');
				this.returnMethod = '退款退货';
				this.clickType = true;
			},
			upload() {
				var that = this;
				wx.getLocalImgData({
					localId: this.localIds[this.uploadIndex], // 图片的localID
					success: function(res) {
						that.$indicator.open({
							spinnerType: 'fading-circle'
						});
						var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
						var base64Index = localData.indexOf("base64,");

						that.http.postJson(that).url('/app/api/uploader').params({
							fileStr: base64Index == -1 ? localData : localData.substr(base64Index + 7)
						}).request(function(response) {
							that.$indicator.close();
							//alert(response.data.data)
							that.pics.push(response.data.data);
							this.uploadIndex++;
							if(this.uploadIndex < this.localIds.length) {
								this.upload();
							} else {
								// 所有上传完
							}
						}, function(err) {
							that.$indicator.close();
							//that.showError('服务器繁忙')
						}, function(response) {
							that.$indicator.close();
							// that.showError(response.data.message);
						})
					}

				});
			},
			addPic() {
				var that = this;
				wx.chooseImage({
					count: 3 - that.pics.length, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {

						var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						//          alert(localIds)
						that.localIds = localIds;
						that.uploadIndex = 0;

						that.upload();
					}
				});
			},
			deleteImg(pic) {
				var that = this;
				for(var i = 0; i < this.pics.length; i++) {
					if(that.pics[i] == pic) {
						that.pics.splice(i, 1)
					}
				}
			},
			method() {
				event.preventDefault();
				$('.methodContent').addClass('is-visible2');
				this.clickType = false;
				//关闭弹框
				$(".methodContent").click(function(event) {
					if($(event.target).is('.cancel') || $(event.target).is('.cd-popup2')) {
						event.preventDefault();
						$(this).removeClass('is-visible2');
					}
				})
			},
			cause() {
				event.preventDefault();
				$('.causeContent').addClass('is-visible2');
				this.clickType = false;
				//关闭弹框
				$(".causeContent").click(function(event) {
					if($(event.target).is('.cancel') || $(event.target).is('.cd-popup2')) {
						event.preventDefault();
						$(this).removeClass('is-visible2');
					}
				})
			},
			returnGoods() {
				var relationId = this.getParam('relationId');
				var user = JSON.parse(this.getUserData('user'));
				var imgstr = this.pics.join(',');
				if(!this.returnMethod || this.returnMethod.trim().length == 0) {
					this.showError('请选择处理方式');
					return;
				};
				if(!this.returnReason || this.returnReason.trim().length == 0) {
					this.showError('请选择退款原因');
					return;
				};
				if(!this.remark || this.remark.trim().length == 0) {
					this.showError('请填写问题描述');
					return;
				};

				this.$indicator.open({
					spinnerType: 'fading-circle'
				});
				this.http.postJson(this).url('/app/api/work/apply').params({
					relationId: relationId,
					phone: this.phone,
					remark: this.remark,
					reason: this.reason,
					applyCount:this.count,
					images: imgstr,
					workType: this.workType
				}).request(function(response) {
					this.$indicator.close();
					this.showSuccess('申请成功')
					console.log(this.phone)
					//this.keep.go('/service.html', false);
					window.location.replace('/service.html');
					console.log(response)
					console.log(this.phone)
				}, function(err) {
					this.$indicator.close();
					// this.showMessage('申请失败')
				})
			},
			returnMoney() {				
				if(!this.returnReason || this.returnReason.trim().length == 0) {
					//this.onceType ==true;
					this.showError('请选择退款原因');
					return;
				};
				if(!this.remark || this.remark.trim().length == 0) {
					//this.onceType ==true
					this.showError('请填写问题描述');
					return;
				};
				if(!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,1,3,6,7,8])|(19[7,8,9])|(166))\d{8}$/.test(this.phone)) {
					//this.onceType == true;
					this.showError('请输入正确的电话号码');
					return;
				};		
				var imgstr = this.pics.join(',');
				this.http.postJson(this).url("/app/api/work/apply").params({
					workType: 1,
					relationId: this.relationId,
					reason: this.reason,
					remark: this.remark,
					phone: this.phone,
					applyCount:this.maxCount,
					images: imgstr
				}).request((response) => {
					this.showSuccess('退款申请提交成功')
					this.afterSaleStatus = 1;
					console.log(this.phone)
					console.log(this.reason)
					console.log(this.remark)
					//this.keep.go('/service.html', false);
					window.location.replace('/service.html');
					console.log(response)
				}, (err) => {
					//this.showMessage('申请失败')
					console.log(err)
				}, (req) => {
					console.log(req)
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '../../assets/scss/ReturnGoods.scss';
	.mengban {
		width: 3.75rem;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background: red;
		opacity: 0;
	}
</style>