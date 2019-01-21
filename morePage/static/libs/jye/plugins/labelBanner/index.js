(function(e$, $) {
	var plugin = e$.createPlugin();
	plugin.name = "label_banner";
	plugin.alias = "标题栏";
	plugin.class = function(editModel, rootDom, editDom) {
		var __this__ = this;
		this.html = $("<div></div>");
		this.edit = $("<div></div>")
		this.source = {name:plugin.name, props:{text:"Label", fontSize:"14px", align:"left"}};
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
			bundEvent();
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
			__this__.html.load("./app/plugins/labelBanner/show.html", function() {
				__this__.refreshView();
			});
		};

		function rendererEdit() {
			__this__.edit.load("./app/plugins/labelBanner/edit.html", function() {
				refreshEdit();
				bundEvent();
			});
		};

		function bundEvent() {
			__this__.edit.find('input').change(function() {
				__this__.source.props.text = $(this).val();
				refreshShow();
			});

			__this__.edit.find("select:first").change(function() {
				__this__.source.props.fontSize = $(this).val();
				refreshShow();
			});

			__this__.edit.find("select:last").change(function() {
				__this__.source.props.align = $(this).val();
				refreshShow();
			});
		};

        function refreshEdit() {
			var item = __this__.source.props;
			__this__.edit.find("input").val(item.text);
			__this__.edit.find("select:first").val(item.fontSize);
			__this__.edit.find("select:last").val(item.align);
        };

        function refreshShow() {
        	var spanDom = __this__.html.find(".label-label > span");
			var item = __this__.source.props;
			spanDom.text(item.text);
			spanDom.css("font-size", item.fontSize);
			spanDom.parent().css("text-align", item.align);
        };

		renderer();
		editModel && rendererEdit();
		
	};
	e$.installPlugin(plugin);
})(jye, jQuery);