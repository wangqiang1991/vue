<template>
	<div class="app-container calendar-list-container">
		<div style="margin-bottom: 15px;">
			<el-button @click="returnList">返回</el-button>
			<span style="font-size:18px">所属部门：{{departmentName}}</span>
		</div>
		<div class="filter-container">
			<el-input @keyup.enter.native="doSearch()" v-model="staffListL.condition" style="width: 200px;" class="filter-item" placeholder="输入用户昵称">
			</el-input>
			<el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索</el-button>
			<el-button @click="handleCreate" class="filter-item" style="margin-left: 10px;" type="primary" icon="edit">添加</el-button>
		</div>

		<el-table :data="dataList" v-loading="staffListL.loading" element-loading-text="努力加载中..." border fit highlight-current-row style="width: 100%">
			<el-table-column type="index" align="center" label="序号" width="65">
			</el-table-column>

			<el-table-column label="员工名称" width="200">
				<template scope="scope">
					<span class="link-type">{{scope.row.reallyName}}</span>
				</template>
			</el-table-column>

			<el-table-column label="员工手机号">
				<template scope="scope">
					<span>{{scope.row.phone}}</span>
				</template>
			</el-table-column>

			<el-table-column label="员工性别">
				<template scope="scope">
					<span v-if='scope.row.gender == 1'>男</span>
					<span v-if='scope.row.gender == 2'>女</span>
				</template>
			</el-table-column>

			<el-table-column label="登录账号">
				<template scope="scope">
					<span>{{scope.row.loginName}}</span>
				</template>
			</el-table-column>

			<el-table-column label="员工角色">
				<template scope="scope">
					<span v-for="role in scope.row.roleVos">{{role.name}} </span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" width="200">
				<template scope="scope">
					<el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="onEdit(scope.row)">编辑
					</el-button>
					<el-button icon="delete" size="small" type="danger" @click="deleteSystemUser(scope.row)">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div  class="pagination-container">
			<el-pagination @size-change="handleSizeChange" :current-page="staffListL.pageIndex"
			@current-change="handleCurrentChange" :page-sizes="[10,15,20,30]" :page-size="staffListL.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="staffListL.total">
			</el-pagination>
		</div>

		<!--添加弹出框-->
		<el-dialog :title="title" :visible.sync="staffFrame">

			<el-form class="small-space" :model="add_role" label-position="left" label-width="100px" style='width: 500px; margin-bottom:20px ; margin-left:50px;'>
				<el-form-item label="所属部门">
					<el-cascader style="width: 400px;" change-on-select :options="organData" :props="selectProps" v-model="departmentIds">
					</el-cascader>
				</el-form-item>
			</el-form>

			<el-form class="small-space" :model="employeeFrom" label-position="left" label-width="100px" style='width: 500px; margin-left:50px;'>
				
				<el-form-item label="登录账号">
					<el-input auto-complete="off" type="text" placeholder="请输入登录账号" maxlength="20" v-model="employeeFrom.loginName"></el-input>
				</el-form-item>

				<el-form-item label="密码">
					<el-input auto-complete="off" placeholder="请输入密码" type="password" v-model="employeeFrom.password"></el-input>
				</el-form-item>

				<el-form-item label="员工名称">
					<el-input auto-complete="off" type="text" v-model="employeeFrom.reallyName" maxlength="20" placeholder="请输入员工名称"></el-input>
				</el-form-item>
				
				<el-form-item label="员工手机号">
					<el-input auto-complete="off" type="text" placeholder="请输入员工手机号" maxlength="11" v-model="employeeFrom.phone"></el-input>
				</el-form-item>
				
				<el-form-item label="员工性别">
					<el-radio class="radio" v-model="employeeFrom.gender" label="1">男</el-radio>
        	<el-radio class="radio" v-model="employeeFrom.gender" label="2">女</el-radio>
				</el-form-item>

				<el-form-item label="员工微信">
					<el-input auto-complete="off" type="text" v-model="employeeFrom.wechat" maxlength="20" placeholder="请输入员工微信"></el-input>
				</el-form-item>

				<el-form-item label="员工QQ">
					<el-input auto-complete="off" type="text" v-model="employeeFrom.qq" maxlength="11" placeholder="请输入员工QQ"></el-input>
				</el-form-item>

				<el-form-item label="员工邮箱">
					<el-input auto-complete="off" type="text" v-model="employeeFrom.email" maxlength="100" placeholder="请输入员工邮箱"></el-input>
				</el-form-item>

				<el-form-item label="员工生日">
					<el-date-picker
			      v-model="employeeFrom.birthday"
			      type="date"
			      placeholder="设置员工生日">
			    </el-date-picker>
				</el-form-item>

				<el-form-item label="员工地址">
					<el-input auto-complete="off" type="text" v-model="employeeFrom.address" maxlength="50" placeholder="请输入员工地址"></el-input>
				</el-form-item>

				<el-form-item label='描述'>
					<el-input auto-complete="off" type="textarea" placeholder="请输入描述" :autosize="{ minRows: 3, maxRows: 5}" v-model="employeeFrom.description"></el-input>
				</el-form-item>

				<el-form-item label="关联角色">
					<div style="max-height:200px; overflow-y: auto;">
						<div v-for="(role,index) in roleVos" :key="role.key">
							<template>
								<el-radio-group v-model="roleId">
									<el-radio :label="role.roleId">{{role.name}}</el-radio>
								</el-radio-group>
							</template>
						</div>
					</div>
				</el-form-item>

			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="staffFrame=false">取 消</el-button>
				<el-button type="primary" @click="submitCreate">保 存</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		name: "saveOrgan",
		data() {
			return {
				departmentId:null,
				varPassword: "",
				departmentName: '',
				label: null,
				roleId: null,
				roleVos: [],
				staffFrame: false,
				dataList: [],
				staffListL: {
					loading: false,
					pageSize: 15, //每页显示数量
					pageIndex: 1, //pageIndex
					total: '',
					condition: ""
				},
				employeeFrom: {
					reallyName: "", //真实姓名
					phone: "", //手机号码
					description: "", //描述
					loginName: "", //登录名称
					departmentId: "", //部门Id
					password: "", //密码
					roleVos: [], //角色
					employeeId: "",
					gender:1,
					wechat:'',
					qq:'',
					email:'',
					birthday:'',
					address:''
				},
				departmentIds: [],
				organData: [],
				selectProps: {
					value: "departmentId",
					label: "name",
					children: "children"
				}
			}
		},
		mounted() {
			//this.findSaveOrgan();
			this.findAll();
		},
		methods: {
			returnList() {
				this.reset();
				this.departmentId = null;
				this.$emit('returnList');
			},
			doSearch() {
				this.staffListL.pageIndex = 1;
				this.findSaveOrgan();
			},
			loadSource(data) {
				this.departmentId = data.departmentId;
				this.organData = this.$parent.organData;
				this.departmentName = data.name;
				this.findSaveOrgan();
			},
			setDepartmentSelected(departmentId) {
				// 临时变量
				var datas = [];
				var departmentIds = [];
				// 将树型结构转线性表（Array）
				this.fillOrgDatas(datas, this.organData);
				// 默认重点击这个item开始倒序过滤查找父
				var selDepartmentId = departmentId;
				do {
					// 获取选择item的父
					var selData = this.getSelectedData(datas, selDepartmentId);
					// 如果父不是null，则将它的id放到数组中
					if(selData != null) {
						departmentIds.push(selData.departmentId);
						selDepartmentId = selData.parentId;
					} else {
						selDepartmentId = null;
					}
				} while (selDepartmentId != null);
				// 因为倒起找的父，所以要将数组逆序
				this.departmentIds = departmentIds.reverse();
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
			getSelectedData(orgDatas, departmentId) {
				for(var i = 0; i < orgDatas.length; i++) {
					if(orgDatas[i].departmentId == departmentId) {
						return orgDatas[i];
					}
				}
				return null;
			},
			findSaveOrgan() {
				let params = {};
				params.pageSize = this.staffListL.pageSize;
				params.pageIndex = this.staffListL.pageIndex;
				params.reallyName = this.staffListL.condition;
				params.departmentId = this.departmentId;
				this.http.get(this).url(this.config.staff.list).params(params).request((response) => {
						if(response.data.code != 0) {
							this.$message({
								message: response.data.message,
								type: 'error'
							});
							return;
						}
						this.dataList = response.data.data.data;
						this.staffListL.total = response.data.data.totalSize;
					},
					(error) => {}
				);
			},
			handleCreate() {
				this.reset();
				this.staffFrame = true;
				this.title = "添加员工";
				
				this.setDepartmentSelected(this.departmentId);
			},
			onEdit(data) {
				this.reset();
				this.employeeFrom.employeeId = data.employeeId
				this.employeeFrom.reallyName = data.reallyName;
				this.employeeFrom.phone = data.phone;
				this.employeeFrom.description = data.description;
				this.employeeFrom.loginName = data.loginName;
				this.employeeFrom.password = data.password;
				this.employeeFrom.roleVos.name = data.roleVos;

				this.employeeFrom.gender = data.gender +'';
				this.employeeFrom.wechat = data.wechat;
				this.employeeFrom.qq = data.qq;
				this.employeeFrom.email = data.email;
				this.employeeFrom.birthday = data.birthday;
				this.employeeFrom.address = data.address;
		

				this.varPassword = data.password;
				if(data.roleVos && 　data.roleVos.length > 0) {
					this.roleId = data.roleVos[0].roleId;
				}

				this.title = "修改员工";
				this.staffFrame = true;
				this.setDepartmentSelected(this.departmentId);
			},
			reset() {
				this.employeeFrom = {
					reallyName: "",
					phone: "", 
					description: "", 
					loginName: "", 
					departmentId: "", 
					password: "", 
					roleVos: [],
					employeeId: "",
					gender:'1',
					wechat:'',
					qq:'',
					email:'',
					birthday:'',
					address:''
				}
			},
			checkAllform() {
				
				if(!this.employeeFrom.loginName || !this.employeeFrom.loginName.trim()) {
					this.$message({
						message: '登录账号不能为空',
						type: 'warning'
					});
					return false;
				}

				if(!this.employeeFrom.password || !this.employeeFrom.password.trim()) {
					this.$message({
						message: '密码不能为空',
						type: 'warning'
					});
					return false;
				}	

				if(!this.employeeFrom.reallyName || !this.employeeFrom.reallyName.trim()) {
					this.$message({
						message: '真实名字不能为空',
						type: 'warning'
					});
					return false;
				}

				if(!this.employeeFrom.phone || !this.employeeFrom.phone.trim()) {
					this.$message({
						message: '手机号不能为空',
						type: 'warning'
					});
					return false;
				}

				if(!this.validate.validatPhone(this.employeeFrom.phone)) {
					this.$message({
						message: "请输入正确的手机号码",
						type: "warning"
					});
					return false;
				}

				if(!this.roleId){
					this.$message({
						message: "请选择关联角色",
						type: "warning"
					});
					return false;
				}

				return true;
			},
			submitCreate() {
				if(this.checkAllform()){
					this.employeeFrom.roleVos = [{
						roleId: this.roleId
					}];

					var params = $.extend({}, this.employeeFrom);

					if(this.departmentIds && this.departmentIds.length > 0) {
						params.departmentId = this.departmentIds[this.departmentIds.length - 1];
					}
					params.password = md5(this.employeeFrom.password);

					this.http.postJson(this).url(this.config.staff.add).params(	params ).request((response) => {
						if(response.data.code != 0) {
							this.$message({
								message: response.data.message ? response.data.message : "系统错误",
								type: 'error'
							});
							return;
						}
						this.$message({
							type: 'success',
							message: '保存成功!'
						});
						this.staffFrame = false;
						this.findSaveOrgan();
					},(error) => {});
			  }
			},
			findAll() {
				this.http.get(this).url(this.config.role.list).request(
					function(response) {
						if(response.data.code != 0) {
							this.$message({
								message: response.data.message,
								type: 'error'
							});
							return;
						}
						response.data.data.forEach((item) => {
							if(item.name != "系统管理员"){
								this.roleVos.push(item);
							}
						});
					},
					function(err) {console.log(err)}
				);
			},
			deleteSystemUser(data) {
				this.$confirm('是否要删除"' + data.reallyName + '"?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					confirmButtonClass: "el-button--danger"
				}).then(() => {
					this.http.delete(this).url(this.config.staff.del).restful({
							employeeId: data.employeeId
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
							this.findSaveOrgan();
						}, (err) => {});
				}).catch(() => {});
			},
			/**
			 * 分页控件每页条数改变
			 */
			handleSizeChange(val) {
				this.staffListL.pageSize = val;
				this.findSaveOrgan();
			},
			/**
			 * 分页控件页码改变
			 */
			handleCurrentChange(val) {
				this.staffListL.pageIndex = val;
				this.findSaveOrgan();
			},
		},
	}
</script>
<style>
	.app-container {
		padding: 10px 20px 20px 20px;
	}
</style>