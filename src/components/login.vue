<template>
<el-card class="box-card">
  <img src="" alt="">
  <el-button type="text">学生管理系统</el-button>
  <div class="div">
     <el-input placeholder="请输入用户名" v-model="user">
        <template slot="prepend">用户名</template>
      </el-input>
  </div>
  <div class="div">
     <el-input type='password' placeholder="请输入密码" v-model="pwd">
        <template slot="prepend" >密码</template>
      </el-input>
  </div>
  <div class="div">
    <el-button type="primary" id='login' @click='login'>登录</el-button>
  </div>
</el-card >
</template>

<script>
import axios from 'axios'
//import '../assets/css/login.css';
  export default {
    data() {
       return {
          user:'',
          pwd:'',
          tip:''
      }
    },
    mounted :function(){
      console.log(this.$router)
    },
    methods: {
      login:function () {
        let user = this.user;
        let pwd = this.pwd;
        
        if(user == '' || pwd == ''){
             this.$message({
                message: '用户名或密码不能为空',
                type: 'error'
              });
             return false;
        }else if(!/^[a-zA-Z]\w{5,16}$/.test(pwd)){
            this.$message({
                message: '密码格式不正确',
                type: 'error'
              });
            return false;
        }
        // this.$router.push('/home/addstudent');

         //this.$router.push({path:'/home', query:{id:123,uid:'tes'} });   //类似get传参，通过URL传递参数
         
         this.$router.push({path:'/home', params:{id:456} });   //类似post传参


        // axios.get('/api/users/get',{
        //      params: {
        //       name: 'get'
        //     }
        // }).then(function(res){
        //   console.log(res.data)
        // })
        //  axios.delete('/api/users/delete',{
        //      params: {
        //       name: 'delete'
        //     }
        // }).then(function(res){
        //   console.log(res.data)
        // })
       
        // axios.post('/api/users/post', {
        //   name: 'Fred'
        // })
        // .then(function (response) {
        //   console.log(response.data);
        // })
        //  axios.put('/api/users/put', {
        //   name: 'put'
        // })
        // .then(function (response) {
        //   console.log(response.data);
        // })


      }
    }
  }
</script>

<style scoped>
  @import '../assets/css/login.css';


	.box-card{
		width: 400px;
    height: 300px;
    position: absolute;
    top: 50%;
    margin-top: -150px;
    left: 50%;
    margin-left: -200px;
	}
  #login{
    width: 100%;
  }
 
</style>