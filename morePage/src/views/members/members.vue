<template>
  <div id="members_Vue">
    <div class="main">
      <!--<p class="titleNumber">当前登陆账号</p>-->
      <div class="header" @click="changeHead">
        <p class="headerTitle">头像</p>
        <img src="../../assets/img/right.png" class="right"/>
        <div id="photo">
          <img :src="this.head"/>
        </div>
      </div>
      <div class="nickNameBox" @click="changeNickName">
        <p class="nickNameTitle">昵称</p>
        <img src="../../assets/img/right.png" class="right"/>
        <p class="nickNameContent">{{this.nickName}}</p>
      </div>
      <div class="genderBox" @click="changeGender">
        <p class="genderTitle">性别</p>
        <img src="../../assets/img/right.png" class="right"/>
        <p class="genderContent">{{this.gender}}</p>
      </div>
      <div class="birthdayBox" @click="changeBirthday">
        <p class="birthdayTitle">出生日期</p>
        <img src="../../assets/img/right.png" class="right"/>
        <p v-if="this.birthday" class="birthdayContent">{{this.birthday | parseTime('{y}-{m}-{d}')}}</p>
      </div>
      <div v-show="!loading" class="cd-popup2 changeNickName">
        <div class="cd-popup-container2">
          <div class="changeHeader">
            <span class="cancel" @click="cancelNickName">取消</span>
            <p class="title">修改昵称</p>
            <span class="sure" @click="sureNickName">确定</span>
          </div>
          <div class="nickNameArea">
            <input type="text" class="nickNameInput" placeholder="请输入昵称，且不超过16个字符" v-model:value="editNickName" maxlength="16" />
            <img src="../../assets/img/off_btn.png" class="offBtn" @click="deleteContent"
                 v-show="this.editNickName !== ''"/>
            <!-- <p class="prompting">小于等于16位字符</p> -->
          </div>
        </div>
      </div>
      <div v-show="!loading" class="cd-popup2 changeGender">
        <div class="cd-popup-container2">
          <div class="changeHeader">
            <span class="cancel">取消</span>
            <p class="title">修改性别</p>
          </div>
          <div class="changeGenderContent">
            <div class="choiceGenderBox">
              <p @click="choiceGender(1)" class="man">
                男
              </p>
              <img src="../../assets/img/choice.png" v-show="showGou1"/>
            </div>
            <div class="choiceGenderBox">
              <p @click="choiceGender(2)" class="women">
                女
              </p>
              <img src="../../assets/img/choice.png" v-show="showGou2"/>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!loading" class="cd-popup2 changeBirthday">
        <div class="cd-popup-container1">
          <!--<div class="changeHeader">
            <span class="cancel">取消</span>
            <span class="sure" @click="sureChangeBirthday">确定</span>
          </div>-->
          <div class="birthdayArea">
            <mt-datetime-picker
              @click="sureChangeBirthday"
              type="date"
              ref="picker"
              :value.sync="pickerValue"
              @confirm="handleConfirm"
              :startDate="startDate"
              :endDate="endDate"
              year-format="{value} 年"
              month-format="{value} 月"
              date-format="{value} 日">
            </mt-datetime-picker>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import LoadingView from '@/components/Loading.vue';
  import {DatetimePicker} from 'mint-ui';
  import wx from 'weixin-js-sdk';
  import {parseTime} from '@/commons/tools'  //tools 文件有调用就引入

  window.wx = wx;
  export default {
    name: 'members',
    created() {
      document.title="个人信息"
    },
    data() {
      return {
        nickName: '',
        editNickName:'',
        head: '',
        gender: '',
        showGou1: false,
        showGou2: false,
        year: '',
        month: '',
        day: '',
        birthday: '',
        showbir: true,
        startDate: new Date('1900-01-01'),
        endDate: new Date(),
        pickerVisible: true,
        localId: '',
        pickerValue:'1970-01-01'
      }
    },
    mounted: function () {
      var users = this.getUserData('user'); //获取微信用户id方法
      var user = JSON.parse(users);
      this.user = user;
      console.log(this.user)
      this.nickName = user.nickName;
      this.head = user.head;
      this.birthday = user.birthday;
      if (this.birthday) {
        this.pickerValue = parseTime(this.birthday,'{y}-{m}-{d}');
      }
      if (user.gender == 1) {
        this.gender = '男';
        this.showGou1 = true;
        this.showGou2 = false;
      } else {
        this.gender = '女'
        this.showGou1 = false;
        this.showGou2 = true;
      }
      $('.mint-datetime-cancel').click(function () {
        $('.changeBirthday').removeClass('is-visible2');
      })
      $('.mint-datetime-confirm').click(function () {
        console.log(this.pickerValue)
        $('.changeBirthday').removeClass('is-visible2');
      })
      $(".cd-popup2").on("touchmove", function () {
        event.preventDefault();
      })
      $(".cd-popup2").on("click", function () {
        event.preventDefault();
      }),
        this.http.get(this).url('/app/api/auth/wx-config').request(function (response) {
          console.log(response.data.data)
          var res = response.data.data;
          wx.config({
            appId: res.appId, // 必填，公众号的唯一标识
            timestamp: res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.nonceStr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名,
            jsApiList: ["chooseImage", "previewImage", "uploadImage"]
          })
        });
      wx.ready(function () {
      });
      wx.error(function (res) {
      });
    },
    component: {
      DatetimePicker
    },
//  watch:{
//    editNickName:function(editNickName){
//      console.log(editNickName)
//    }
//  },
    methods: {
      handleConfirm(value) {
        this.birthday = value;
        this.modifyUserInfo("birthday",parseTime(value,'{y}-{m}-{d}'));
      },
      changeNickName() {
        event.preventDefault();
        $('.changeNickName').addClass('is-visible2');
        //关闭弹框
        $(".changeNickName").click(function (event) {
          if ($(event.target).is('.cancel')) {
            event.preventDefault();
            $(this).removeClass('is-visible2');
          }
        })
        $('.nickNameInput').focus();
        this.editNickName = this.nickName;
      },

      changeGender() {
        event.preventDefault();
        $('.changeGender').addClass('is-visible2');
        //关闭弹框
        $(".changeGender").click(function (event) {
          if ($(event.target).is('.cancel') || $(event.target).is('.cd-popup2')) {
            event.preventDefault();
            $(this).removeClass('is-visible2');
          }
        })
        $('.nickNameInput').focus();
      },

      deleteContent() {
        this.editNickName = ''
      },
      choiceGender(gender) {
        this.gender = gender == 1 ? '男' : '女';
        this.showGou1 = this.gender == "男";
        this.showGou2 = this.gender == "女";
        this.modifyUserInfo("gender", gender);
        $('.changeGender').removeClass('is-visible2');
      },
      changeBirthday() {
        event.preventDefault();
        $('.changeBirthday').addClass('is-visible2');
        //关闭弹框
        $(".changeBirthday").click(function (event) {
          if ($(event.target).is('.cancel') || $(event.target).is('.cd-popup2')) {
            event.preventDefault();
            $(this).removeClass('is-visible2');
          }
        })
      },

      modifyUserInfo(key, value) {

        this.$indicator.open({
          spinnerType: 'fading-circle'
        });

        var params = {};
        params[key] = value;

        this.http.postJson(this).url("/app/api/member/modify").params(params).request(function (response) {
          this.$indicator.close();
          this.showSuccess("编辑成功")
        }, function (error) {
          this.$indicator.close();
        }, function (response) {
          this.$indicator.close();
        });
      },


      changeHead() {
        var that = this;
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            console.log(localIds)
            that.localId = localIds[0];
            
            
            
            wx.getLocalImgData({

              localId: localIds[0], // 图片的localID

              success: function (res) {
                that.$indicator.open({
                  spinnerType: 'fading-circle'
                });
                
                var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                var base64Index = localData.indexOf("base64,");
                
                that.http.postJson(that).url('/app/api/uploader').params({
                  fileStr: base64Index == -1 ? localData : localData.substr(base64Index + 7)
                }).request(function (response) {
                  that.$indicator.close();
                  that.head = response.data.data;
                  //请求修改头像方法
                  that.modifyUserInfo("head", that.head);
                }, function (err) {
                  that.$indicator.close();
                  //that.showError('服务器繁忙')
                }, function (response) {
                  that.$indicator.close();
                  //.showError(response.data.message);
                })
              }

            });
          }
        });
      },
      
      
      sureNickName() {
        if(this.editNickName == ""){
          this.showError('昵称不能为空');
        }else if(this.editNickName.length > 16){
        	 this.showError('昵称最大16位字符');
        } else{
          $('.changeNickName').removeClass('is-visible2');
          this.nickName = this.editNickName;
          this.modifyUserInfo("nickName", this.nickName);
        }
      },
      cancelNickName(){
        this.editNickName = this.nickName;
      }
    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/members.scss';
</style>