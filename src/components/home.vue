<template>
<div>
  <el-menu theme="dark"  class="el-menu-demo" mode="horizontal" >
	  <el-row :gutter="10">
		  <el-col :xs="14" :sm="16" :md="18" :lg="20">

		  	<el-menu-item index="1">学生管理系统</el-menu-item>

		  </el-col>
		  <el-col :xs="10" :sm="8" :md="6" :lg="4">
		  	<el-menu-item index="2">管理员:老王</el-menu-item>
		  </el-col>
	  </el-row>
  </el-menu>
  <el-row :gutter="10">
		  <el-col :xs="10" :sm="8" :md="6" :lg="4">
			<el-menu default-active="1" class="el-menu-vertical-demo">
		      <el-menu-item  index="1">
		        <i class="el-icon-message"></i>主页
		      </el-menu-item>
		      <el-submenu index="2">
				  <template slot="title"><i class="el-icon-menu"></i>学生管理</template>
				  <el-menu-item index="2-1">增添学生</el-menu-item>
				  <el-menu-item index="2-2">修改学生</el-menu-item>
				  <el-menu-item index="2-3">查询学生</el-menu-item>
		      </el-submenu>
		      <el-submenu index="3">
				  <template slot="title"><i class="el-icon-setting"></i>设置</template>
				  <el-menu-item index="3-1">用户设置</el-menu-item>
				  <el-menu-item index="3-2">管理设置</el-menu-item>
		      </el-submenu>
		    </el-menu>
		  </el-col>
		  <el-col :xs="14" :sm="16" :md="18" :lg="20">
				<router-view></router-view>
		  </el-col>
   </el-row>	
</div>
</template>


<script>
	import Addstudent from './addstudent.vue'

  export default {
  	name:'home',
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>