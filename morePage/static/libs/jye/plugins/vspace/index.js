(function (e$, $) {
    var plugin = e$.createPlugin();
    plugin.name = "vspace";
    plugin.alias = "间隔符";
    plugin.class = function (editModel, rootDom, editDom) {
        var __this__ = this;
        this.uptoken = null;
        this.html = $("<div></div>");
        this.edit = $("<div></div>")
        this.source = {name: plugin.name, props: {height:30}};
        this.getJsonContent = function () {
            return source;
        };
        this.getHtmlContent = function () {
            return this.html;
        };
        this.setJsonContent = function (json) {
            this.source = json;
        };
        this.getEditHtml = function () {
            rendererEdit();
            return this.edit;
        };

        this.activate = function () {

        };

        this.validate = function () {
            return null;
        }

        function renderer() {
            __this__.html.empty();
            __this__.html.load("/static/libs/jye/plugins/vspace/show.html", function () {
                __this__.html.find("div").height(__this__.source.props.height);
            });
        };

        function rendererEdit() {
            __this__.edit.load("./app/plugins/vspace/edit.html", function () {
                __this__.edit.find('[type="number"]').val(__this__.source.props.height);
                __this__.edit.find('[type="number"]').change(function() {
                	var val = $(this).val();
                	if (!/^[1-9]\d*$/.test(val)) {
                		val = 30;
                	} else {
                		val = parseInt(val);
                	}
                	if (val > 1000) {
                		val = 1000;
                	}
                	if (val < 1) {
                		val = 1;
                	}
                	$(this).val(val + "");
                	__this__.source.props.height = val;
                	__this__.html.find("div").height(__this__.source.props.height);
                });
            });
        };
        renderer();

    };
    e$.installPlugin(plugin);
})(jye, jQuery);
