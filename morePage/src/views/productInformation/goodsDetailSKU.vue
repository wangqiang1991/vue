<template>
	<div style="height:auto;width:3.35rem;overflow:hidden;padding-left:0.2rem;padding-right:0.2rem;">

		<div v-show="firstStyleEnabledCover">
			<div class="specifications" style="padding-top:0.25rem;padding-bottom:0.2rem">{{firstStyleItemName}}</div>
			<div class="swiper_box">
				<div class="border swiper-container style1_swiper">
					<div class="ppt swiper-wrapper">
						<div class="flot swiper-slide" v-for="(n,index) in firstStyleItems" @click="onFirstClick(n,index)">
							<img v-if='n.cover' :src="n.cover" :class="selectedFirst == n?'on':'off'" />
							<p>{{n.name}}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="type first_type"  v-show="!firstStyleEnabledCover">
			<div class="dateilTile">{{firstStyleItemName}}</div>
			<div class="detailSpecifications">
				<ul>
					<li v-for="item in firstStyleItems" :class="selectedFirst==item ? 'styleType':'' " @click="onFirstClick(item)">{{item.name}}</li>
				</ul>
			</div>
		</div>

		<div v-show="secondStyleEnabledCover">
			<div class="specifications"  style="padding-top:0.25rem;padding-bottom:0.2rem">{{secondStyleItemName}}</div>
			<div class="swiper_box">
				<div class="border swiper-container style2_swiper">
					<div class="ppt swiper-wrapper">
						<div class="flot swiper-slide" v-for="n in secondStyleItems" @click="onSecondClick(n)">
							<img v-if='n.cover' :src="n.cover" :class="!n.status ? 'disbaleImg' : (selectedSecond == n ? 'on' : 'off')" />
							<p>{{n.name}}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="type" v-show="!secondStyleEnabledCover">
			<div class="dateilTile">{{secondStyleItemName}}</div>
			<div class="detailSpecifications">
				<ul>
					<li v-for="item in secondStyleItems" :class="!item.status ? 'nostyleType' : (selectedSecond == item ? 'styleType' :    '')" @click="onSecondClick(item)">{{item.name}}</li>
				</ul>
			</div>
		</div>

	</div>
</template>

<script>
	import swiper from 'swiper';
	export default {
		name: "goodsDetailSku",
		data() {
			return {
				firstStyleEnabledCover: false,
				secondStyleEnabledCover: false,
				firstStyleItems: [],
				hotSpace: {},
				firstStyleItemName: "",
				swipeInfo: "",
				secondStyleItemName: '',
				secondStyleItems: [],
				stylesSku: [],
				secondsSku: [],
				selectedFirst: null,
				selectedSecond: null,
				onstyles: [],
				index:null
			}
		},
		mounted() {

		},
		methods: {
			selectSku(sku) {
				for(var i = 0; i < this.firstStyleItems.length; i++) {
					var name = this.firstStyleItems[i];
					if(sku.name == name.name) {
						this.selectedFirst = name;
						break;
					}
				}			
				for(var i = 0; i<this.secondStyleItems.length;i++) {
          var subName = this.secondStyleItems[i];
          if(sku.subName == subName.name){
          	this.selectedSecond = subName;
          	break;
          }
				}			
			},
			loadSource(data) {
				if (data.index) {
					this.index = data.index;
				}
				this.stylesSku = data.styles;
				this.firstStyleEnabledCover = data.firstStyleEnabledCover;
				this.firstStyleItemName = data.firstStyleItemName;
				this.firstStyleItems = data.firstStyleItems;

				this.secondStyleEnabledCover = data.secondStyleEnabledCover;
				this.secondStyleItemName = data.secondStyleItemName;
				this.secondStyleItems = data.secondStyleItems;

				// this.secondStyleItems.forEach((item) => {
				// 	item.status = true;
				// });
				this.initDisableSecondStyle();

				this.initLayer();
			},
			initDisableSecondStyle() {
				for(var i = 0; i < this.firstStyleItems.length; i++) {
					if (this.stylesSku[0].name == this.firstStyleItems[i].name) {
						this.loopDisabledSecondStyleItems(this.firstStyleItems[i]);
						break;
					}
				}		
			},
			initLayer() {
				this.$nextTick(() => {
					var myswiper1 = new swiper('.style1_swiper', {
						slidesPerView: 'auto',
						paginationClickable: true,
						observer: true,
						observeParents: true,
						freeMode: true,
						freeModeFluid: true
					});
				});
				this.$nextTick(() => {
					var myswiper1 = new swiper('.style2_swiper', {
						slidesPerView: 'auto',
						paginationClickable: true,
						observer: true,
						observeParents: true,
						freeMode: true,
						freeModeFluid: true
					});
				});
			},
			onFirstClick(item) {
				this.selectedFirst = item;
				this.loopDisabledSecondStyleItems(item);
				this.onSelected();
			},
			loopDisabledSecondStyleItems(item) {
				var onSku = [];
				for(var i = 0; i < this.stylesSku.length; i++) {
					if(item.name == this.stylesSku[i].name) {
						onSku.push(this.stylesSku[i])
					}
				}
				if(onSku.length) {
					for(var i = 0; i < this.secondStyleItems.length; i++) {
						var flag = false;
						for(var j = 0; j < onSku.length; j++) {
							if(onSku[j].subName == this.secondStyleItems[i].name) {
								flag = true;
							}
						}
						this.secondStyleItems[i].status = flag;
						if (!flag && this.selectedSecond == this.secondStyleItems[i]) {
							this.selectOther(item.name);
						}
					}
				} else {
					for(var i = 0; i < this.secondStyleItems.length; i++) {
						this.secondStyleItems[i].status = false;
					}
				}
			},
			onSecondClick(item) {
				if (item.status == false) {
					return;
				}
				this.selectedSecond = item;
				this.onSelected();
			},
			onSelected() {
				if(this.selectedFirst && this.selectedSecond) {
					for(var i = 0; i < this.stylesSku.length; i++) {
						var sku = this.stylesSku[i];
						if(sku.name == this.selectedFirst.name && sku.subName == this.selectedSecond.name) {
							if (this.index) {
								sku.index = this.index;
							}
							this.$emit("onSkuChange", sku);
							break;
						}
					}
				}
			},
			selectOther(name) {
				this.stylesSku.forEach((sku)=> {
					if (sku.name == name) {
						this.secondStyleItems.forEach((item)=> {
							if (sku.subName == item.name) {
								this.selectedSecond = item;
							}
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.specifications {
		padding-top: 0.3rem;
		width: 3.35rem;
		color: #999;
		font-weight:500;
		font-size: 0.14rem;		
	}
	
	.swiper_box {
		//padding: 0.2rem 0 0.04rem 0.2rem;
		width: 3.35rem;
		overflow-x: scroll;
		margin-bottom:0.25rem;
		
		.border {
			width: 100%;
			height: auto;
			background:#FFF;
		}
		.ppt {

			.flot {
				float: left;
				width: 0.5rem;
				margin-right: 0.15rem;
				height: auto;
				img {
					width: 0.5rem;
					height: 0.5rem;
					margin-bottom: 0.1rem;
				}
				img.on {
					background: #F6F6F6;
					border: 1px solid #cacaca;
				}
				img.off {
					border: 1px solid #F2F2F2;
				}
				.disbaleImg{
					border: 1px dashed #EEEEEE
				}
				p {
					font-size: 0.1rem;
					font-weight: normal;
					color: #999999;
					text-align: center;
					width: 0.5rem;
					word-break:break-all;
				}
			}
		}
	}
	
	.type {
		margin-top:0.25rem;
		width: 3.35rem;
		font-size: 0.14rem;
		.dateilTile {
			padding-top: 0rem;
			color: #666666;
			padding-bottom: 0.2rem;
			font-size: 0.14rem;
		}
		.detailSpecifications {
			padding-bottom:0.15rem;
			//border-bottom:1px solid #ddd;
			ul {
				margin: 0;
				padding: 0;
				li:nth-child(even) {
					margin-left: 0.1rem;
				}
				li {
					word-break:break-all;
					font-size:0.12rem;
					overflow:hidden;
					display: inline-block;
					border-radius: 0.03rem;
					margin-left: 0;
					width: 1.38rem;
					height: auto;
					text-align: center;
					background: #FFFFFF;
					border: 1px solid #F2F2F2;
					padding:0.1rem;
					margin-bottom: 0.1rem;
					color: #666666;
				}
				.styleType {
					border: 1px solid #CACACA;
					background: #EEEEEE;
					color: #666666;
				}
				.nostyleType {
					background: #FFFFFF;
					border: 1px dashed #EEEEEE;
					color: #CACACA;
				}
			}
		}
	}
	.first_type{
		.detailSpecifications{
			border-bottom:none;
			padding-bottom:0;
		}
	}
</style>