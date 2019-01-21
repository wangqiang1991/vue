<template>
  <div id="feedback_Vue">
  	<div class="name">
  		<span>您的姓名</span>
  		<input type="text" value="" placeholder="（必填）" maxlength="16" v-model="name"/>
  		<img src="../../assets/img/off_btn.png" v-show="this.name !== '' && this.name !== null && this.nameFocus" @click="nameCancel"/>
  	</div>
  	<div class="phone">
      <span>您的联系方式</span>
      <input type="number" value="" placeholder="（必填）" v-model="phone" class="nameInput"/>
      <img src="../../assets/img/off_btn.png" v-show="this.phone !== '' && this.phone !== null && this.phoneFocus" @click="phoneCancel"/>
    </div>
    <div class="feedback">
    	<p class="title">您的意见</p>
    	<textarea placeholder="谢谢您愿意花时间来让构巢变得更好" maxlength="200" v-model="content" style="padding: 0;"></textarea>
    </div>
    <div class="sureBtn" @click="onceClickType">
    	提交
    </div>
  </div>
</template>

<script>
  export default {
    name: 'feedback',
    data() {
      return {
        name:'',
        phone:'',
        content:'',
        nameFocus: false,
        phoneFocus: false,
        onceType:true
      }
    },
    created (){
      document.title="打小报告";
    },
    activated () {
      document.title="打小报告";
    },

    mounted() {
      var user = JSON.parse(this.getUserData('user'));
      console.log(user)
      this.name = user.nickName;
      this.phone = user.phone;
      var that = this;
      $('.name').click(function(){
        $('.name input').focus();
        that.nameFocus = true;
        that.phoneFocus = false;
      });
      $('.name input').blur(function(){
      });
      $('.phone').click(function(){
        $('.phone input').focus();
        that.phoneFocus = true;
        that.nameFocus = false;
      });
      $('textarea').focus(function(){
        that.phoneFocus = false;
        that.nameFocus = false;
      });
    },
    methods: {
      nameCancel(){
        this.name = '';
        $('.name input').focus();
      },
      phoneCancel(){
        this.phone = '';
        $('.phone input').focus();
      },
      onceClickType() {
        if(this.onceType==true){
          this.onceType = false;         
        }
         this.submitFeedback();
      },
      submitFeedback(){
        this.phoneFocus = false;
        this.nameFocus = false;
        var that = this;

         if(!this.name || this.name.trim().length == 0){
          this.onceType==true
          this.showError('请填写您的姓名');
          return;
        }

        if(!this.content || this.content.trim().length == 0){
        	this.onceType==true
          this.showError('请填写您的意见');
          return;
        }
        if (!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,1,3,6,7,8])|(19[7,8,9])|(166))\d{8}$/.test(this.phone)) {
        	this.onceType==true
          this.showError('请输入正确的电话号码');
          return;
        }
        this.http.postJson(this).url('app/api/feed-back').params({
          contact:this.name,
          phone:this.phone,
          content:this.content
        }).request(function(response){
          console.log(response)
          this.showSuccess('提交成功');
          //this.onceType = true;
          setTimeout(function(){
            that.keep.go('/personal_center.html',false)
          },200)

        },function(err){
          //this.showMessage('提交失败')
        })
      }
    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/feedback.scss';
</style>