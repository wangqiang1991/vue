<template>
	<div class="app-container calendar-list-container" id="organ">
	 <el-row style="border: 1px solid #d1dbe5;">
      <el-col :span="6" style="padding-top:20px;">
				<el-input placeholder="输入关键字搜索部门" v-model="filterOrgan" style="width:80%;margin-left:10%;"></el-input>
				<div id="organTree" element-loading-text="努力加载中...">
					<el-tree 
						ref="tree" 
						:filter-node-method="filterNode" 
						class="filter-tree" 
						:render-content="renderContent" 
						:data="organData" 
						:props="defaultProps" 
						default-expand-all 
						highlight-current="true"
						node-key="departmentId">
					</el-tree>
				</div>
			</el-col>
			 <el-col :span="18" style="padding:20px;">
				 <span style="margin-right:10px;" class="title"  v-if="departmentData.departmentId">{{departmentData.name}}</span>
				 <el-button size="small"  type="primary" @click="addOrgans"><i class="el-icon-plus" style="margin-right:5px;"></i>新增下级部门</el-button>
			   <el-button size="small" icon="edit" @click="edit" v-if="departmentData.parentId">编辑</el-button>
			   <el-button size="small" icon="delete" @click="remove" v-if="departmentData.parentId" type="danger">删除</el-button>
		   	 <div style="margin-top:20px;margin-bottom:20px;">
		   	 		<el-breadcrumb>
						  <el-breadcrumb-item :key="item" v-if="parentName.length" v-for="item in parentName">{{item}}</el-breadcrumb-item>
						</el-breadcrumb>
		   	 </div>
		   	 <p class="desc" v-if="departmentData.description"><span>部门描述:</span>{{departmentData.description}}</p>
		   	 <div>
		   	 	<icon-svg icon-class="employee" style="margin-right:5px;width:20px;height:20px;"></icon-svg>
		   	 	<span class="title">部门人员</span>
		   	 	
		   	 	<div style="margin-bottom:20px;margin-top:20px;">
							<el-input @keyup.enter.native="doSearch()" v-model="role.condition" style="width: 200px;" class="filter-item" placeholder="输入用户昵称"></el-input>
							<el-button  type="primary" style="margin-left:12px;" @click="createEmployee"><i class="el-icon-plus" style="margin-right:5px;"></i>添加成员</el-button>
							<el-button @click="doSearch" class="filter-item" style="margin-left: 12px;" type="primary" v-waves icon="search">搜索</el-button>
					</div>
		   	 	<el-table :data="roleDataList"  border fit highlight-current-row style="width: 100%">
						<el-table-column type="index" align="center" label="序号" width="65">
						</el-table-column>

						<el-table-column label="员工名称" >
							<template scope="scope">
								<span >{{scope.row.reallyName}}</span>
							</template>
						</el-table-column>

						<el-table-column label="员工手机号" width="150">
							<template scope="scope">
								<span>{{scope.row.phone}}</span>
							</template>
						</el-table-column>

						<el-table-column label="性别" align="center" width="80">
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

						<el-table-column align="center" label="操作" width="180">
							<template scope="scope">
								<el-button icon="edit" v-if="scope.row.status!='draft'" size="small" @click="onEdit(scope.row)">编辑
								</el-button>
								<el-button icon="delete" size="small" type="danger" @click="deleteSystemUser(scope.row)">删除
								</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination-container">
						<el-pagination @size-change="handleSizeChange" :current-page="role.pageIndex"
						@current-change="handleCurrentChange" :page-sizes="[10,15,20,30]" :page-size="role.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="role.total">
						</el-pagination>
					</div>
		   	 </div>
			 </el-col>
		</el-row>	

			
			<el-dialog :title="title" :visible.sync="dialogVisible">

				<el-form class="small-space" label-position="left" label-width="100px" style='width: 500px; margin-bottom:20px ; margin-left:50px;'>
					<el-form-item label="上级部门">
						<el-cascader :disabled="title == '新增部门'" style="width: 400px;" change-on-select :options="organData" :props="selectProps" v-model="parentIds">
						</el-cascader>
					</el-form-item>
				</el-form>

				<el-form class="small-space"  label-position="left" label-width="100px" style='width: 500px; margin-bottom:20px ; margin-left:50px;'>
					<el-form-item label="部门名称">
						<el-input type="type" placeholder="请输入部门名称" maxlength="10" v-model='department.name'></el-input>
					</el-form-item>
				</el-form>

				<el-form class="small-space"  label-position="left" label-width="100px" style='width: 500px; margin-left:50px;'>
					<el-form-item label="部门描述">
						<el-input type="textarea" placeholder="请输入部门描述(选填)" maxlength="50" v-model="department.description" :autosize="{ minRows: 3, maxRows: 5}"></el-input>
					</el-form-item>
				</el-form>

				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button @click="confirmOrgan(true)" type="primary">确定</el-button>
				</div>
			</el-dialog>


		<!--添加弹出框-->
		<el-dialog :title="employeeTitle" :visible.sync="employeeVisible">

			<el-form class="small-space" :model="add_role" label-position="left" label-width="100px" style='width: 500px; margin-bottom:20px ; margin-left:50px;'>
				<el-form-item label="所属部门">
					<el-cascader :disabled="employeeTitle == '新增员工'" style="width: 400px;" change-on-select :options="organData" :props="selectProps" v-model="parentIds">
					</el-cascader>
				</el-form-item>
			</el-form>

			<el-form class="small-space"  label-position="left" label-width="100px" style='width: 500px; margin-left:50px;'>
				
				<el-form-item label="登录账号">
					<el-input auto-complete="off" type="text" :disabled="employeeTitle == '修改员工'" placeholder="请输入登录账号" maxlength="20" v-model="employeeFrom.loginName"></el-input>
				</el-form-item>

				<el-form-item label="密码">
					<el-input auto-complete="off" placeholder="请输入密码" type="password" v-model="employeeFrom.password"></el-input>
				</el-form-item>

				<el-form-item label="员工名称">
					<el-input auto-complete="off" type="text" v-model="employeeFrom.reallyName" maxlength="20" placeholder="请输入员工名称"></el-input>
				</el-form-item>
				
				<el-form-item label="员工手机号">
					<el-input auto-complete="off" type="text" :disabled="employeeTitle == '修改员工'"  placeholder="请输入员工手机号" maxlength="11" v-model="employeeFrom.phone"></el-input>
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
			      :editable="false"
			      :picker-options="pickerOptions"
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
				<el-button @click="employeeVisible=false">取 消</el-button>
				<el-button type="primary" @click="submitCreate">保 存</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import saveOrgan from "./saveOrgan.vue";
	import md5 from 'js-md5'
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
				oldPassword:null,
				dataList:[],
				roleDataList:[],
				roleVos:[],
				listQuery:{
					pageSize: 15,
					pageIndex: 1,
					total: '',
					condition: ""
				},
				role:{
					pageSize: 15, 
					pageIndex: 1, 
					total: '',
					condition: ""
				},
				department:{
					name: '', 
					description: "", 
					parentId: "",
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
					address:'',
				},
				roleId: null,
				firstLoad:true,
				firstEmployeeData:[],
				treeArry:[],
				employeeVisible:false,
				dialogVisible:false, 
				title:'',
				employeeTitle:'',
				departmentData: {}, // 部门Id
				filterOrgan: "", //检索部门变量
				organData: [], //树形结构数据
				parentIds: [], //父级结构数组
				parentName:[],
				employeeCountMap:{},
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
				pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
			};
		},
		mounted() {
			this.findOrgan(true);
			this.findAll();
			this.loadAllMember();
		},
		methods: {
			/*左侧选中方法*/
			choiceDepartment(store,data,event){
				console.log(data)
				this.departmentData = data;
				this.setDepartmentList();
				this.findSaveOrgan();
			},
			/*判断是否选择节点*/
			isChoice() {
				if(this.departmentData.departmentId) {
					return true;
				} else {
					this.$message({message: '请先选择部门',type: 'warning'});
					return false;
				}
			},
			/*过滤节点*/
			filterNode(value, data) {
				if(!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			//表单判断
			checkForm() {
				if(!this.department.name || !this.department.name.trim()) {
					this.$message({message: '部门名称不能为空',type: 'warning'});
					return false;
				}
				
				return true;
			},
			//确定添加
			confirmOrgan() {
				let params = {};
				params.parentId = this.parentIds[this.parentIds.length - 1];
				params.name = this.department.name;
				params.description = this.department.description;
				
				if(this.title == "编辑部门"){
					params.departmentId = this.departmentData.departmentId;
				} else {
					params.departmentId = null;
				}

				/*编辑时判断不能以自身为上级部门*/
				if(params.parentId == params.departmentId){
					this.$message({message: '不能以自身为上级部门',type: 'warning'});
					return false;
				}

				if(this.checkForm()) {
					this.http.postJson(this).url(this.config.department.add).params(params).request(function(response) {
						if(response.data.code != 0) {
							this.$message({message: response.data.message,type: 'error'});
							return;
						}
						this.dialogVisible = false;
						this.reset();
						this.findOrgan(false);
					},(err)=> {console.log(err)});
				}
			},
			//新增下级部门
			addOrgans() {
				if(this.isChoice()){
					this.reset();
					this.department.parentId = this.departmentData.departmentId; 
					this.title = "新增部门";
					this.dialogVisible = true;
					this.setDepartmentList();	
				}
			},
			reset(){
				this.department = {
					name: '', 
					description: "", 
					parentId: "",
				}
			},
			setDepartmentList() {
				this.parentIds = [];
				this.parentName = [];
				var datas = [];
				this.fillOrgDatas(datas, this.organData);
				var selData = this.departmentData;
				do {
					selData = this.getSelectedData(datas, selData);
					if(selData != null) {
						this.parentIds.push(selData.departmentId);
						this.parentName.push(selData.name);
					}
				} while (selData != null);
				this.parentIds = this.parentIds.reverse();
				this.parentName = this.parentName.reverse();
				this.parentIds.push(this.departmentData.departmentId);
				this.parentName.push(this.departmentData.name);
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
			edit() {
				if(this.isChoice()){
					this.reset();
					this.department.parentId = this.departmentData.departmentId; 
					this.title = "编辑部门"
					this.dialogVisible = true;

					this.department.name = this.departmentData.name;
					this.department.description = this.departmentData.description;
					this.parentName = [];
					this.parentIds = [];
					this.setDepartmentList();	
					this.parentIds.splice(-1,1);
				}

			},
			/*删除架构*/
			remove() {
				if(this.isChoice()){
					this.$confirm('是否要删除部门"' + this.departmentData.name + '"?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						confirmButtonClass: "el-button--danger"
					}).then(() => {
						this.http.delete(this).url(this.config.department.delete).restful({departmentId: this.departmentData.departmentId}).request((response) => {
							if(response.data.code != 0) {
								this.$message({message: response.data.message,type: 'error'});
								return;
							}
							this.$message({type: 'success',message: '删除成功!'});
							this.findOrgan(false);
						}, (err) => {console.log(err)});
					}).catch(() => {});
				}
			},
			handleSizeChange(val) {
				this.role.pageSize = val;
				this.findSaveOrgan();
			},
			handleCurrentChange(val) {
				this.role.pageIndex = val;
				this.findSaveOrgan();
			},
			doSearch() {
				this.role.pageIndex = 1;
				this.findSaveOrgan();
			},
			

			//查询组织机构树
			findOrgan(type) {
				this.http.get(this).url(this.config.department.list).params().request(function(response) {
					let data = response.data;
					if(data.code != 0) {
						this.$message.error(data.message);
						return;
					}
					this.departmentData = {};
					this.parentName = [];
					let treeArry = [];
					treeArry.push(data.data);
					//this.organData = treeArry;
					this.treeArry = treeArry;
					this.setTreeNumber();
				}, function(error) {
					this.$message.error(error);
				});
			},
			/*查询所有人员*/	
			loadAllMember() {
				
					let params = {};
					params.pageSize = 1000;
					params.pageIndex = 1;
					this.http.get(this).url(this.config.staff.list).params(params).request((response) => {
							if(response.data.code != 0) {
								this.$message({
									message: response.data.message,
									type: 'error'
								});
								return;
							}
							this.firstEmployeeData = response.data.data.data;
							this.setTreeNumber();
						},
						(error) => {}
					);
			},
			setTreeNumber(){
				if(this.treeArry && this.firstEmployeeData){

					this.organData = [];
					this.setTreeFirstNumber(this.treeArry);
					//console.log(this.treeArry);
					this.getNumber();
					console.log(this.treeArry);
					setTimeout(()=>{
						this.organData = this.treeArry;
					},300)
					
				}
			},
			setTreeFirstNumber(treeArry){
				treeArry.forEach((item)=>{
					item.memberNumber = 0;
					if(item.children != null){
						this.setTreeFirstNumber(item.children);
					}
				})
			},
			getNumber(){
				this.firstEmployeeData.forEach((item)=>{
					let id = item.departmentId;
					this.setCount(this.treeArry,id);
				})
				
			},
			setCount(array,id){
				array.forEach((item)=>{
					if(item.departmentId == id){
						item.memberNumber++;
						if(item.parentId != null){
							this.setCount(this.treeArry,item.parentId);
						}
					}else{
						if(item.children != null){
							this.setCount(item.children,id);
						}
					}
				})
			},



			setNumber(children) {
				children.forEach(function(child) {
					console.log(child);
					var ecount = this.getNumberToDepartment(child);
				}.bind(this));
			},

			getNumberToDepartment(department) {
					if (this.employeeCountMap[department.departmentId]) {
						return this.employeeCountMap[department.departmentId];
					}
				  var ecount = this.getEmployee(department);
					var children = department.children;
					if (children) {
						for (var i = 0; i < children.length; i++) {
							ecount += this.getNumberToDepartment(children[i]);
						}
					}
					this.employeeCountMap[department.departmentId] = ecount;
					console.log(department.name, ecount);
					department.reallyName = department.name;
					department.name = department.name + "(" + ecount + ")";
					return ecount;
			},

			getEmployee(department) {
				var count = 0;
				this.firstEmployeeData.forEach((employee) => {
						if (department.departmentId == employee.departmentId) {
							count ++;
						}
				});

				return count;
			},




			/*查询人员*/
			findSaveOrgan() {
				
					let params = {};
					params.pageSize = this.role.pageSize;
					params.pageIndex = this.role.pageIndex;
					params.reallyName = this.role.condition;
					params.departmentId = this.departmentData.departmentId;
					this.http.get(this).url(this.config.staff.list).params(params).request((response) => {
							if(response.data.code != 0) {
								this.$message({
									message: response.data.message,
									type: 'error'
								});
								return;
							}
							this.roleDataList = response.data.data.data;
						  this.role.total = response.data.data.totalSize;
						},
						(error) => {}
					);
				
			},

			createEmployee() {
				if(this.isChoice()){
					this.resetEmployee();
					this.oldPassword = null;
					this.employeeVisible = true;
					this.employeeTitle = '新增员工';
					this.setDepartmentList();	
				}
			},
			onEdit(data) {
				this.resetEmployee();
				this.oldPassword = data.password;
				this.employeeVisible = true;
				this.employeeTitle = '修改员工';
				this.setDepartmentList();	
				this.employeeFrom.employeeId = data.employeeId;

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
				this.setDepartmentList();	

			},
			submitCreate() {
				if(this.checkAllform()){
					this.employeeFrom.roleVos = [{
						roleId: this.roleId
					}];

					var params = this.employeeFrom;
					params.departmentId = this.parentIds[this.parentIds.length - 1];
					if(this.oldPassword == this.employeeFrom.password){
						params.password = this.oldPassword;
					} else {
						params.password = md5(this.employeeFrom.password);
					}

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
						this.employeeVisible = false;
						//window.location.reload();
						this.loadAllMember();
						this.findSaveOrgan();
					},(error) => {console.log(error)});
			  }
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
							//window.location.reload();
							this.loadAllMember();
							this.findSaveOrgan();
						}, (err) => {});
				}).catch(() => {});
			},
			resetEmployee() {
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
						message: '员工名称不能为空',
						type: 'warning'
					});
					return false;
				}

				if(!this.employeeFrom.phone || !this.employeeFrom.phone.trim()) {
					this.$message({
						message: '员工手机号不能为空',
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
			/*查询角色列表*/
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
						this.roleVos = [];
						response.data.data.forEach((item) => {
							if(item.name != "系统管理员"){
								this.roleVos.push(item);
							}
						});
					},
					function(err) {console.log(err)}
				);
			},
			
			renderContent(h, {
				node,
				data,
				store
			}) {
				return(<span style="width:100%;overflow:hidden;"  on-click={ ($event) => this.choiceDepartment(store, data,event) }>

		            <span style="width:100%;padding-left:10px;float:left;overflow:hidden; white-space: nowrap; text-overflow: ellipsis;">
		              <icon-svg icon-class="organ"  v-show={data.parentId ==null} style="margin-right:10px;"></icon-svg>
		              <icon-svg icon-class="department" v-show={data.parentId !=null } style="margin-right:5px"></icon-svg>
		              <span>{node.label.name}({node.label.memberNumber })</span>
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
			
			>.el-tree{
				background:#fff;
				border:none;
			}
		}
		.is-current{
			>div.el-tree-node__content{
				background:#38adff;
			}
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
		.title{
			font-size:20px;
			color:#343434;
		}
		.el-breadcrumb__item:last-child .el-breadcrumb__separator{
			display:none;
		}
		.desc{
	    width:100%;
	    color:#666;
	    font-size:16px;
	    span{
	      color:#343434;
	    }
   }
	}
</style>