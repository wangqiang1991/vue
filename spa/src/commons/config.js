export default {
	imgtmb: {
		_200: '?imageView2/1/w/200/h/200',
		_100: '?imageView2/1/w/100/h/100',
		_50: '?imageView2/1/w/50/h/50'
	},
  toShortUrl:"/api/short-url/shorten",
  tip:{
    toDo:'/api/todo'
  },
	express: {
		list: "api/express"
	},
	login: "api/sys-user/login",
	role: {
		list: "api/sys-role/roles",
		delete: "api/sys-role/:roleId",
		save: "api/sys-role/role",
		edit: "api/sys-role/roles/:roleId"
	},
	permission: {
		list: "api/permission",
		delete_url: "api/permission/:permissionId",
    sort:"/api/permission/sort"
	},
	provider: {
		provider_natures_url: "api/goods-provider/natures",
		providers_url: "api/goods-provider/providers",
		provider_save_url: "/api/goods-provider/provider",
		provider_delete_url: "/api/goods-provider/:providerId",
		provider_all_url: "/api/goods-provider",
    provider_order:"/api/goods-provider/:providerId"
	},
	express: {
		express_search_save_url: "api/express",
		express_delete_url: "api/express/:expressId"
	},
	keywords: {
		keywords_search_save_url: "api/hot-keywords/keywords/page",
		keywords_delete_url: "api/hot-keywords/:keywordId",
		keywords_sort_url: "api/hot-keywords/sort",
		keywords_disable_url: "api/hot-keywords/disable/:keywordId",
		keywords_enable_url: "api/hot-keywords/enable/:keywordId",
		keywords_save_url: "api/hot-keywords/keywords"
	},
	system_user: {
		search_save_url: "api/sys-user",
		detail: "api/sys-user/:systemUserId",
		delete: "api/sys-user/:systemUserId"
	},
	categroy: {
		categroy_list_url: "/api/category",
		categroy_delete_url: "/api/category/:categoryId",
		categroy_token: 'api/sys-user/upload/token'
	},
	expressTemplate: {
		express_template_url: "/api/express-template",
		express_template_disable_url: "/api/express-template/disable/:expressTemplateId",
		express_template_enable_url: "/api/express-template/enable/:expressTemplateId",
		express_template_all_url: "/api/express-template/all-templates",
		express_template_check:'api/goods-express-template/using/:templateId'
	},
	praise_goods: {
		list_url: "api/praise-goods",
		batch_del_url: "api/praise-goods/batch/delete",
		save_url: "api/praise-goods",
		detail_url: "api/praise-goods/:goodsId",
    comments: "api/praise-goods/comments/:goodsId"
	},
	articles: {
		save_url: "api/articles"
	},
	goods: {
		list_url: "api/goods",
		batch_del_url: "api/goods/batch/delete",
		save_url: "api/goods",
		detail_url: "api/goods/:goodsId",
    delete_url_v2:"api/goods/v2/:goodsId",
		pulled_url: "api/goods/batch/pulled",
		sort_url: "api/goods/sort",
		putaway_url: "api/goods/batch/putaway",
		goods_putaway:"/api/goods/putaway",
		goods_pullaway:"/api/goods/pulled",
    list_url_v2: "/api/goods/v2",
    save_url_v2:"/api/goods/basic",
    save_content:"/api/goods/content",
    top_goods:"/api/goods/set-top/:goodsId",
    cancel_top:"/api/goods/cancel-top/:goodsId",
    set_coupon:"/api/goods/coupons",
    add_coupon:"/api/goods/add-coupon/:goodsId",
    delete_coupon:"/api/goods/del-coupon/:goodsId",
    callBack_base:"/api/goods/rollback/:goodsId",
    callBack_content:"/api/goods/rollback-to-content/:goodsId",
    goods_sale:"/api/goods/:goodsId/no-storage-sale",
    style_item:"/api/support-style-item",
    check_sku:'/api/goods/sku/ref-validate/:styleId'
	},
	coupon: {
		list_url: "api/coupon",
		disable_url: "api/coupon/disable/:couponId",
		enable_url: "api/coupon/enable/:couponId",
		save_url: "api/coupon",
		detail_url: "api/coupon/:couponId",
		delete_url:"api/coupon/delete/:couponId"
	},
	room_area: {
		list_url: "api/room-area",
		save_url: "api/room-area",
		sort_url: "api/room-area/sort",
		delete_url: "api/room-area/:areaId"
	},
	image_style: {
		list_url: "api/image-style",
		save_url: "api/image-style",
		sort_url: "api/image-style/sort",
		delete_url: "api/image-style/:styleId",
		image_style_token: 'api/sys-user/upload/token'
	},
	space: {
		list_url: "api/space",
		save_url: "api/space",
		delete_url: "api/space/:spaceId",
		detail_url: "api/space/:spaceId",
		goods_url: "api/space/goods/:spaceId",
		praise_goods_url: "api/space/praiseGoods/:spaceId",
		put_space:"/api/space/push/:spaceId",
		pull_space:"/api/space/pull/:spaceId"
	},
	picture: {
		list_url: "api/picture",
		delete_url: "api/picture/:sceneId",
		detail_url: "api/picture/:sceneId",
		update_level_url: "api/picture/level/:sceneId",
		detail_url: "api/picture/:sceneId",
		pulled_url: "api/picture/batch/pulled",
		putaway_url: "api/picture/batch/putaway",
		praiseGoods_list:"/api/praise-goods/find-by-picture-relation"
	},
	subject: {
		list_url: "api/subject-article",
		save_url: "api/subject-article",
		publish_url: "api/subject-article/publish/:subjectArticleId",
		delete_url: "api/subject-article/delete/:subjectArticleId",
		cancelPublish_url: "api/subject-article/cancel-publish/:subjectArticleId"
	},
	home: {
		homeTopList_url: "api/home-top/subject",
		home_top_space_list: "api/home-top/space",
		home_top_subject_list: "api/home-top/subject",
		home_top_scene_list: "api/home-top/scene",
		home_top_praise:"api/home-top/scene-praise-goods",
    home_top_plan:"/api/home-top/plan",
    home_top_sort_url: "api/home-top/sort",
    home_top_delete_url: "api/home-top/:homeTopId",
    home_top_save_url: "api/home-top",
    home_hot_goods_list:"/api/home-top/goods"
	},
	banner: {
		banner_list_url: "api/banner",
		banner_delete_url: "api/banner/delete/:bannerId",
		banner_publish_url: "api/banner/publish/:bannerId",
		banner_cancelPublish_url: "api/banner/cancelPublish/:bannerId",
		banner_save_url: "api/banner",
		banner_detail:"/api/banner/:bannerId",
		save_banner:"/api/banner"
	},
	service: {
		category_list_url: "api/service-category",
		category_sort_url: "api/service-category/sort",
		category_delete_url: "api/service-category/:categoryId",
		category_save_url: "api/service-category",
		service_list_url: "api/service",
		service_save_url: "api/service",
		service_delete_url: "api/service/:serviceId"
	},
	recommend: {
		recommend_list_url: "api/home-recommend",
		recommend_delete_url: "api/home-recommend/:recommendId",
		recommend_save_url: "api/home-recommend"
	},
	order: {
		order_list_url: "api/order",
		order_detail_url: "api/order/:orderId",
    order_normal_detail_url: "api/order/normal/:orderId",
		order_money_modify: "/api/order/money",
		order_goods_money_modify: "/api/order/money/:relationId",
    edit_express_money:"/api/order/express/money/:relationId",
		order_address_modify: "/api/order/address",
		order_remark_modify: "/api/order/remark",
		order_deliver: "/api/order/deliver",
		order_express_info: "/api/order/express/track/:relationId",
		sync_payment: "/api/order/sync-pay-result/:orderId",
		add_express: "/api/express/track",
		delete_express: "/api/express/track/:trackId",
		money_change:"/api/order/money-change-record/:orderId",
		chang_goods_message: "/api/work/after-sale-track/record/:workId",
    find_orderNumber:"/api/order/order-goods/detail/:orderNumber",
    edit_express:"/api/order/modify/express/:relationId",
    order_global_search: "/api/order/query/:orderNumber"
	},
	problemOrder: {
		problem_order_list: "api/work",
		detail_url: "api/work/:workId",
		find_status: "api/work/status",
		edit_money_url: "/api/work/modify/money/:workId",
		reject_apply: "/api/work/reject/:workId",
		agree_apply: "/api/work/pass/:workId",
		confirm_receive: "/api/work/confirm-receive/:workId",
		reject_exchange: "/api/work/reject-exchange/:workId",
		reject_refund: "/api/work/reject-refund/:workId",
		execute_refund_money: "/api/work/refund/:workId",
		edit_express_url: "/api/work/modify/express/:workId",
		express_info_url: "/api/work/express/track/:workId",
		sync_payment: "/api/work/sync-refund-result/:workId",
		merchant_receipt:"/api/work/find-wait-receive",
		wait_refund:"/api/work/find-wait-pay-for"
	},
	designer: {
		list_url: "api/designer",
		scene_list_url: "api/designer/scene",
		praise_list_url: "api/designer/praise-goods",
		save_url: "api/designer",
		delete_url: "api/designer/:designerId"
	},
	goodsComments: {
		list_url: "api/order-comments",
		delete_url: "api/order-comments/:commentId"
	},
	subjectArticleComments: {
		list_url: "api/article-comment",
		delete_url: "api/article-comment/:commentId"
	},
  feedBack: {
    list_url: "api/feedback",
    delete_url: "api/feedback/:feedBackId"
  },
  article_type: {
    list_url: "api/article-type",
    save_url: "api/article-type",
    sort_url: "api/article-type/sort",
    delete_url: "api/article-type/:typeId"
  },
  members: {
    list_url: "/api/member",
    detail_url: "/api/member/details/:memberId"
  },
  department:{
    list:"/api/department",
    add:"/api/department",
    delete:"/api/department/delete/:departmentId"
  },
	staff:{
	 list:  '/api/employee',
	 add:   "/api/employee",
	 del:  "/api/employee/:employeeId"
 },
 goodsExpressTemplate: {
   list_url: '/api/goods-express-template',
   delete_url: '/api/goods-express-template/:templateId'
 },
 area:{
  city:"/api/region/city",
  provinces:"/api/region/provinces"
 },
 //仓库管理
 storage:{
	  list_url:"/api/storage-region/find-all",
	  save_url:"/api/storage-region/save",
	  delete_url:"/api/storage-region/delete/:regionId",
	  storage_list:"/api/storage/goods",
	  set_goods_storage:"/api/storage",
	  save_purchase_order:"/api/purchase-order/save",
	  list_purchase_order:"/api/purchase-order/find-all",
	  set_purchase_order:"/api/purchase-order/accept/:purchaseId",
	  finish_purchase_order:"/api/purchase-order/finish/:purchaseId",
	  create_storage:"/api/goods-put-storage/storage-and-create-record",
	  storage_detail:"/api/goods-put-storage/find-style-detail",
	  storage_history:"/api/goods-put-storage",
	  return_purchase:"/api/purchase-order/cancel/:purchaseOrderId",
	  purchase_batch_order_list:"/api/purchase-batch-order",
	  purchase_order_count:"/api/purchase-order/count",
	  set_orderNumber:"/api/purchase-batch-order/generate/order-number",
	  create_purchase:"/api/purchase-batch-order/create",
	  agree_purchase:"/api/purchase-batch-order/pass/:purchaseBatchOrderId",
	  disagree_purchase:"/api/purchase-batch-order/reject/:purchaseBatchOrderId",
	  purchase_detail:"/api/purchase-batch-order/:purchaseBatchOrderId",
	  reject_purchase:"/api/purchase-batch-order/reject-purchase-order",
	  update_purchase:"/api/purchase-batch-order/update",
	  find_goods:"/api/purchase-order/style-detail/:orderNumber",
	  putin_purchase:"/api/purchase-order/put",
	  find_order:"/api/work/by-work-number/:workNumber",
	  put_in:"/api/work-storage/put",
	  workOrder_list:"/api/work-storage",
	  work_storage_detail:"/api/work-storage/:recordId",
    workNumber_storage_detail:"/api/work-storage/:workNumber",
	  create_loan:"/api/loan/create-record",
	  loan_list:"/api/loan",
	  loan_detail:"/api/loan/:recordId",
	  back_loan:"/api/loan/back",
    outside_record_list:"/api/outside-use",
    create_outside:"/api/outside-use/outside",
    storageBad_list:"/api/storage-bad",
    create_storageBad:"/api/storage-bad/put",
    putIn_count:"/api/work-storage/count/:type",
    putIn_workStorage:'/api/work-storage',
    order_outPut_list:'/api/order-output',
    set_order_output:"/api/order-output/output"
  },
  givGoods:{
	 	givGoods_goods:'/api/praise-goods/scene-use/:goodsId',
	  list_url: "/api/member"
  },
  validateGoods:{
    scene_url: "/api/picture/home-use/:sceneId",
    goodsData: "/api/goods/home-use/:goodsId",
    space : "/api/space/home-use/:spaceId",
    article : "/api/subject-article/home-use/:subjectArticleId"
  },
  softWear:{
  	house_list:"/api/house",
  	can_delete:"/api/house/house-type/can-delete/:houseTypeId",
    house_delete:"/api/house/:houseId",
    plan_list:"/api/plan",
    plan_detail:"/api/plan/:planId",
    activities:"/api/activities",
    activities_end:"/api/activities/end/:activityId",
    activities_publish:"/api/activities/publish/:activityId",
    activities_delete:"/api/activities/:activityId",
    activities_detail:"/api/activities/:activityId",
    house_type:"/api/house/house-type",
    house_plan:"/api/plan",
    plan_type:"/api/dict/:type"
  },
  promoter:{
    list_url:"/api/promoter",
    detail_url:"/api/promoter/:promoterId"
  },
  statistics:{
   goods_list:"/api/statistics/goods",
   all_list :"/api/statistics/all",
   activities_list:"/api/statistics/activities",
   booths_list:"/api/statistics/promoters",
   putStorageStatistics_total:"/api/put-storage-statistics/total",
   putStorageStatistics_items:"/api/put-storage-statistics/items",
   putStorageStatistics_details:"/api/put-storage-statistics/details",
   outputStorageStatistics_total:"/api/output-storage-statistics/total",
   outputStorageStatistics_items:"/api/output-storage-statistics/items",
   outputStorageStatistics_details:"/api/output-storage-statistics/details",
   badStorageStatistics_total:"/api/bad-storage-statistics/total",
   badStorageStatistics_items:"/api/bad-storage-statistics/items",
   badStorageStatistics_details:"/api/bad-storage-statistics/details",
   storageBalance_total:"/api/goods-storage-statistics/total",
   storageBalance_detail:"/api/goods-storage-statistics/details",
   goodsSalesStorageStatistics_total:"/api/sale-statistics/total",
   goodsSalesStorageStatistics_items:"/api/sale-statistics/items",
   goodsSalesStorageStatistics_details:"/api/sale-statistics/details",
   financeStorageStatistics_total:"/api/finance-statistics/total",
   gmv_order_detail:"/api/statistics-order-detail/find-by-page",
   sale_order_detail:'/api/statistics-order-detail/find-sale-order-by-page',
   gmv_dash:"/api/statistics-order-detail/dash",
   inventory_lit_url:"/api/statistics-sku-detail/find-by-page",
   inventory_detail_url:"/api/statistics-sku-record/find-detail"
  },
  promoterSettle:{
    list_url:"/api/promoter-settle",
    account_url:"/api/promoter-settle/settle-account",
    statistics_url:"/api/promoter-settle/statistics",
    order_url:"/api/promoter-settle/settle-order"
  },
  propel:{
    save_url:'/api/notice-message/save-message',
    goods_list:"/api/notice-message/find-message/goods",
    activity_list:"/api/notice-message/find-message/activity",
    subject_list:"/api/notice-message/find-message/article"
  }
}
