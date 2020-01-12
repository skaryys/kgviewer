import Vue from 'vue';
import Container from "../components/grid/Container.vue";
import Row from "../components/grid/Row.vue";
import Col from "../components/grid/Col.vue";
import Heading1 from "../components/text/Heading1";
import Heading2 from "../components/text/Heading2";
import Heading3 from "../components/text/Heading3";
import Paragraph from "../components/text/Paragraph";
import List from "../components/text/List";
import ListItem from "../components/text/ListItem";
import Card from "../components/Card";
import Loader from "../components/Loader";

const AppioVueGrid = {
  install(Vue, options) {
    Vue.component("Container", Container);
    Vue.component("Row", Row);
    Vue.component("Col", Col);
    Vue.component("Heading1", Heading1);
    Vue.component("Heading2", Heading2);
    Vue.component("Heading3", Heading3);
    Vue.component("Paragraph", Paragraph);
    Vue.component("List", List);
    Vue.component("ListItem", ListItem);
    Vue.component("Card", Card);
    Vue.component("Loader", Loader);
  }
};

Vue.use(AppioVueGrid);
