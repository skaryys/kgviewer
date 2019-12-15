import Vue from 'vue';
import Container from "../components/grid/Container.vue";
import Row from "../components/grid/Row.vue";
import Col from "../components/grid/Col.vue";

const AppioVueGrid = {
  install(Vue, options) {
    Vue.component("Container", Container)
    Vue.component("Row", Row)
    Vue.component("Col", Col)
  }
};

Vue.use(AppioVueGrid);
