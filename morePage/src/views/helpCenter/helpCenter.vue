<template>
  <div id="helpCenter_Vue">
    <div class="helpCenter">
      <div class="widget widget-tab">
        <div class="swiper-container" id="swiper-container">
          <div class="swiper-wrapper">
            <div class="widget-title inline-block tabs swiper-slide" v-for="question in questions">
              <ul style="float: left;" id="questiontabs">
                <li @click="selectedQuestion=question" class="questiontabs"
                    :class="{'questiontabs-sel' : question == selectedQuestion}">
                  <label>{{question.name}}</label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="widget-box">
          <ul class="question-list" v-for="item in selectedQuestion.serviceVos">
            <li @click="goto(item)">
              <div class="questionContent">
                <span>{{item.title}}</span>
                <img src="../../assets/img/right.png"/>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
    <!-- <vload v-bind:dataload='dataload'></vload> -->

    <firstLoad :firstLoad='firstLoad'></firstLoad>
    <loadFailed :loadFailed='loadFailed' @reload='reload'></loadFailed>
  </div>

</template>

<script>
  import swiper from 'swiper';
  import loading from '../../components/Loading.vue';
  import firstLoad from '../../components/firstLoad.vue';
  import loadFailed from '../../components/loadFailed.vue';

  export default {
    name: 'helpCenter',
    components: {
       firstLoad:firstLoad,
      loadFailed:loadFailed,
      Vload: loading
    },
    data() {
      return {
        firstLoad:true,
        loadFailed:false,
        questions: [],
        selectedQuestion: {serviceVos: []},
        dataload: true
      }
    },
    mounted() {

      this.getQuestion();
    },
    created() {
      document.title = "帮助中心"
    },
    activated() {
      document.title = "帮助中心";
    },

    methods: {
      reload(){
        this.loadFailed = false;
        this.getQuestion();
      },
      initLayer() {
        this.$nextTick(() => {
          new swiper('#swiper-container', {
            slidesPerView: 5,
            paginationClickable: true,
            spaceBetween: 0,
            observer: true,
            observeParents: true
          });
        });
      },
      getQuestion() {

        this.http.get(this).url("/app/api/service").request(
          (response) => {
            this.firstLoad = false;
            this.questions = response.data.data;
            if (this.questions.length > 0) {
              this.selectedQuestion = this.questions[0];
            }
            this.initLayer();
            this.dataload = false;
          },
          (error) => {
            this.loadFailed = true;
            this.firstLoad = false;
            //this.showError('服务器繁忙');
            this.dataload = false;
          },
          (response) => {
            this.loadFailed = true;
            this.firstLoad = false;
            //this.showError(response.data.message)
            this.dataload = false;
          }

        )
      },
      goto(item) {
        console.log(item)
        this.keep.go("content_detail.html", false, {articleId: item.detailId,title:item.title});
      }
    }
  }
</script>

<style lang='scss'>
  @import '../../assets/scss/helpCenter.scss';
</style>
