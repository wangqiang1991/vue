(function(e$, $) {
	var plugin = e$.createPlugin();
	plugin.name = "goods";
	plugin.alias = "商品";
	plugin.class = function(editModel, rootDom, editDom) {
		var __this__ = this;
		this.html = $("<div></div>");
		this.edit = $("<div></div>")
		this.source = {name: plugin.name, props: {
			goodsId: null,
			title: null,
			cover: null,
			goodsNumber: null,
			minPrice: null,
			maxPrice: null,
			totalCount: null,
			salesCount: null,
			viewCount: null
		  }
		};
		this.getJsonContent = function() {
			return source;
		};
		this.getHtmlContent = function() {
			return this.html;
		};
		this.setJsonContent = function(json) {
			this.source = json;
		};
		this.getEditHtml = function() {
			rendererEdit();
			return this.edit;
		};

		this.activate = function() {

		};

		this.validate = function() {
			return null;
		}

		this.refreshView = function() {
			refreshShow();
		}

		function renderer() {
			__this__.html.empty();
			__this__.html.load("/static/libs/jye/plugins/goods/show.html", function() {
				__this__.refreshView();
			});
		};

		function rendererEdit() {
			__this__.edit.load("./app/plugins/goods/edit.html", function() {
				refreshEdit();
				bundEvent();
			});
		};

		function bundEvent() {
			__this__.edit.find(".btn-primary").bind('click',function () {
				window.toggleGoodsSelector(function(goods) {
                    console.log(goods);
					__this__.source.props.goodsId = goods.goodsId;
					__this__.source.props.title = goods.title;
					__this__.source.props.cover = goods.cover;
					__this__.source.props.minPrice = goods.minPrice;
					__this__.source.props.maxPrice = goods.maxPrice;
					__this__.source.props.totalCount = goods.totalCount;
					__this__.source.props.salesCount = goods.salesCount;
					__this__.source.props.viewCount = goods.viewCount;
					__this__.source.props.goodsNumber = goods.goodsNumber;
					refreshEdit();
					refreshShow();
                });
			});
		};

        function refreshEdit() {
			var item = __this__.source.props;
			__this__.edit.find(".title").text(item.title);
			__this__.edit.find(".cover").attr("src", item.cover);
			__this__.edit.find(".goodsNumber").text(item.goodsNumber);
			__this__.edit.find(".price").text("￥" + (item.minPrice ? item.minPrice : "0") + "-￥" + (item.maxPrice ? item.maxPrice : "0"));
			__this__.edit.find(".totalCount").text(item.totalCount);
			__this__.edit.find(".salesCount").text(item.salesCount);
			__this__.edit.find(".viewCount").text(item.viewCount);
        };

        function refreshShow() {
        	var goodsDom = __this__.html.find(".goods_all");
			var item = __this__.source.props;
			if (item.goodsId && item.title) {
				//展示商品详细信息
				var goods_bt_dom = goodsDom.find(".goods_bt");
				goods_bt_dom.html(__this__.source.props.title);
				var span_money_dom = goodsDom.find(".span_money");
				span_money_dom.html(__this__.source.props.minPrice);
				var cover_img_dom = goodsDom.find(".cover_img");
				cover_img_dom.attr("src",__this__.source.props.cover + "?imageView2/1/w/200/h/200");
			}

			if (!editDom) {
				goodsDom.bind('click',function () {
					// alert(__this__.source.props)
          if (window.receiveGoodsMessage) {
            window.receiveGoodsMessage(__this__.source.props);
          }
				});
			}

        };

		renderer();
		// editModel && rendererEdit();

	};
	e$.installPlugin(plugin);
})(jye, jQuery);
