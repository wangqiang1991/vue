<template>
<div class="main">
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
</div>
</template>

<script>
import axios from 'axios'

  export default {
    name:'addstudent',
    data() {
       return {
          user:'',
          pwd:'',
          tip:''
      }
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


        // axios.get('/api/users/get',{
        //      params: {
        //       name: 'get'
        //     }
        // }).then(function(res){
        //   console.log(res.data)
        // })
         axios.delete('/api/users/delete',{
             params: {
              name: 'delete'
            }
        }).then(function(res){
          console.log(res.data)
        })
       
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

<style>
	.main{
    width: 100%;
  }
  .div{
    margin-top: 15px;
    margin-bottom: 35px;
  }
  #login{
    width: 100%;
  }
 
</style>