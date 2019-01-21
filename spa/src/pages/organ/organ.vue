<template>
	<div class="app-container calendar-list-container" id="organ">
		<div v-show="!showDetail">
			<el-input placeholder="输入关键字搜索部门" v-model="filterOrgan" style="width:300px;"></el-input>
			<div id="organTree" element-loading-text="努力加载中...">
				<el-tree ref="tree" :filter-node-method="filterNode" class="filter-tree" :render-content="renderContent" :data="organData" :props="defaultProps" default-expand-all node-key="departmentId">
				</el-tree>
			</div>

			
			<el-dialog :title="title" :visible.sync="addOrgan">

				<el-form class="small-space" :model="add_role" label-position="left" label-width="100px" style='width: 500px; margin-bottom:20px ; margin-left:50px;'>
					<el-form-item label="上级部门">
						<el-cascader style="width: 400px;" change-on-select :options="organData" :props="selectProps" v-model="parentIds" @change="handleChange">
						</el-cascader>
					</el-form-item>
				</el-form>

				<el-form class="small-space" :model="add_role" label-position="left" label-width="100px" style='width: 500px; margin-bottom:20px ; margin-left:50px;'>
					<el-form-item label="部门名称">
						<el-input type="type" placeholder="请输入部门名称" maxlength="10" v-model='name'></el-input>
					</el-form-item>
				</el-form>

				<el-form class="small-space" :model="add_role" label-position="left" label-width="100px" style='width: 500px; margin-left:50px;'>
					<el-form-item label="部门描述">
						<el-input type="textarea" placeholder="请输入部门描述" maxlength="50" v-model="description" :autosize="{ minRows: 3, maxRows: 5}"></el-input>
					</el-form-item>
				</el-form>

				<div slot="footer" class="dialog-footer">
					<el-button @click="addOrgan = false">取 消</el-button>
					<el-button @click="confirmOrgan(true)" type="primary">确定</el-button>
				</div>
			</el-dialog>

		</div>

		<save-Organ ref="Organ" v-show="showDetail" v-on:returnList="returnList()">
		</save-Organ>
	</div>
</template>

<script>
	import saveOrgan from "./saveOrgan.vue";
	export default {
		components: {
			saveOrgan
		},
		watch: {
			filterOrgan(val) {
				this.$refs.tree.filter(val);
			}
		},
		data() {
			return {
				parentIds: [],
				showDetail: false,
				staffOrgan: false,
				addOrgan: false,
				name: '', //名称
				description: "", //描述
				parentId: "", //父机构Id
				departmentId: "", //机构Id，修改的时候必传，否则视为新增
				filterOrgan: "",
				organData: [],
				defaultProps: {
					children: 'children',
					label: (data, node) => {
						return data;
					}
				},
				selectProps: {
					value: "departmentId",
					label: "name",
					children: "children"
				},
			};
		},
		mounted() {
			this.findOrgan();
		},
		methods: {
			filterNode(value, data) {
				if(!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			returnList() {
				this.showDetail = false;
			},
			//			列表
			findOrgan() {
				this.http.get(this).url(this.config.department.list).params().request(function(response) {
					let data = response.data;
					if(data.code != 0) {
						this.$message.error(data.message);
						return;
					}
					let treeArry = [];
					treeArry.push(data.data);
					this.organData = treeArry;
				}, function(error) {
					this.$message.error(error);
				});
			},

			//确定
			confirmOrgan() {
				let params = {};
				params.parentId = this.parentIds[this.parentIds.length - 1];
				params.name = this.name;
				params.description = this.description;
				params.departmentId = this.departmentId;

				if(params.parentId == this.departmentId){
					this.$message({message: '不能以自身为上级部门',type: 'warning'});
					return false;
				}

				if(this.organSpec()) {
					this.http.postJson(this).url(this.config.department.add).params(params).request(function(response) {
							if(response.data.code != 0) {
								this.$message({
									message: response.data.message,
									type: 'error'
								});
								return;
							}
							this.addOrgan = false;
							this.findOrgan();
						},
						function(err) {}
					);

					return false;
				}
			},
			handleChange(data) {
				console.log(data);
			},
			//新增
			addOrgans(store, data, event) {
				event.cancelBubble = true; // 阻止事件冒泡
				this.parentId = data.departmentId; 
				this.departmentId = "";
				this.name = "";
				this.description = "";
				this.title = "新增";
				this.addOrgan = true;
				this.parentIds = [];
				//				debugger;
				// 临时变量
				var datas = [];
				// 将树型结构转线性表（Array）
				this.fillOrgDatas(datas, this.organData);
				// 默认重点击这个item开始倒序过滤查找父
				var selData = data;
				do {
					// 获取选择item的父
					selData = this.getSelectedData(datas, selData);
					// 如果父不是null，则将它的id放到数组中
					if(selData != null) {
						this.parentIds.push(selData.departmentId);
					}
				} while (selData != null);
				// 因为倒起找的父，所以要将数组逆序
				this.parentIds = this.parentIds.reverse();
				// 如果是添加，则将自己也追加到最后一个
				this.parentIds.push(data.departmentId);
			},
			fillOrgDatas(arr, orgDatas) {
				for(var i = 0; i < orgDatas.length; i++) {
					var item = orgDatas[i];
					arr.push(item);
					if(item.children) {
						this.fillOrgDatas(arr, item.children);
					}
				}
			},
			getSelectedData(orgDatas, data) {
				for(var i = 0; i < orgDatas.length; i++) {
					if(orgDatas[i].departmentId == data.parentId) {
						return orgDatas[i];
					}
				}
				return null;
			},
			/*编辑*/
			edit(store, data, event) {
				event.cancelBubble = true; 
				this.name = data.name;
				this.description = data.description;

				this.parentId = data.parentId;
				this.departmentId = data.departmentId
				this.title = "编辑"
				this.addOrgan = true;

				this.parentIds = [];

				var datas = [];
				this.fillOrgDatas(datas, this.organData);

				var selData = data;
				do {
					selData = this.getSelectedData(datas, selData);
					if(selData != null) {
						this.parentIds.push(selData.departmentId);
					}
				} while (selData != null);

				this.parentIds = this.parentIds.reverse();

			},
			//判断
			organSpec() {
				if(!this.name || !this.name.trim()) {
					this.$message({
						message: '部门名称不能为空',
						type: 'warning'
					});
					return false;
				}
				return true;
			},
			/*删除*/
			remove(store, data,event) {
				event.cancelBubble = true; 
				this.$confirm('是否要删除部门"' + data.name + '"?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					confirmButtonClass: "el-button--danger"
				}).then(() => {
					this.http.delete(this).url(this.config.department.delete).restful({
						departmentId: data.departmentId
					}).request((response) => {
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
						this.findOrgan();

					}, (err) => {});
				}).catch(() => {

				});
				return false;
			},
			/*加载员工*/
			personnel(Organ, data, event) {
				event.cancelBubble = true; // 阻止事件冒泡
				this.showDetail = true;
				this.$refs.Organ.loadSource(data);
			},
			renderContent(h, {
				node,
				data,
				store
			}) {
				return(<span style="width:100%;overflow:hidden;">

		            <span style="width:25%;padding-left:10px;float:left;overflow:hidden; white-space: nowrap; text-overflow: ellipsis;">
		              <icon-svg icon-class="organ"  v-show={data.parentId ==null} style="margin-right:10px;"></icon-svg>
		              <icon-svg icon-class="department" v-show={data.parentId !=null } style="margin-right:5px"></icon-svg>
		              <span>{node.label.name}</span>
		            </span>
		
		            <span style="width:400px;text-align:right;padding-right:10px;position:absolute;top:0;right:0;z-index:10;">
		              <el-button size="small" type="primary" on-click={ ($event) => this.personnel(store, data,event) }><icon-svg icon-class="yuangong"></icon-svg>员工列表</el-button>
		              <el-button size="small" icon="edit"  type="primary" on-click={ ($event) => this.addOrgans(store, data,event) }>新增下级部门</el-button>
		              <el-button size="small" icon="edit"  v-show={data.parentId != null}  on-click={ ($event) => this.edit(store, data,event) }>编辑</el-button>
		              <el-button size="small" icon="delete" v-show ={data.parentId != null} type="danger" on-click={ ($event) => this.remove(store, data,event) }>删除</el-button>
		            </span>
		
		            <span style="width:40%;text-align:center;position:absolute;top:0;left:30%;">
		              <span style="width:100%; overflow:hidden; white-space: nowrap; text-overflow: ellipsis; ">
		             	 {node.label.description}
		              </span>
		            </span>

		          </span>);
			}
		}
	}
</script>

<style lang="scss">
	#organ {
		#organTree {
			margin-top: 20px;
			text-indent: 3;
		}
		.el-tree-node__expand-icon {
			display: none;
		}
		.el-tree-node__content{
     	position: relative;
		}
		span {
			display: inline-block;
		}
		textarea {
			border-radius: 3px;
			outline: none;
		}
	}
</style>