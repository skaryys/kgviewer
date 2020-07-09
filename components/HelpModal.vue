<template>
  <div v-if="show">
      <div class="c-overlay" @click="hideModal()"></div>
      <div class="c-modal">
        <div class="close" @click="hideModal()"></div>
        <div class="content">
          <h2 class="c-h2">
            Help
          </h2>
          <h3 class="c-h3">
            Showing all nodes
          </h3>
          <p class="c-paragraph">This option is selected by default. It means that you can see all nodes and relationships.</p>
          <h3 class="c-h3">
            Searching nodes by name
          </h3>
          <p class="c-paragraph">After selecting this option, you can search nodes by name. After updating the graph you can then see all nodes with similar name and their related nodes and relationships.</p>
          <h3 class="c-h3">
            Searching nodes of a given type
          </h3>
          <p class="c-paragraph">After selecting this option, you can search nodes of a given type. After updating the graph you can then see al nodes of that type and their related nodes and relationships.</p>
          <h3 class="c-h3">
            Searching nodes by CYPHER
          </h3>
          <p class="c-paragraph">You can also search nodes and relationships with help of <a href="https://neo4j.com/docs/cypher-manual/current/" target="_blank">CYPHER</a>.</p>
          <h3 class="c-h3">
            Show types
          </h3>
          <p class="c-paragraph">You can check <i>Show types</i>, if you want to show nodes which represent each type of nodes as node.</p>
          <h3 class="c-h3">
            Quick mode
          </h3>
          <p class="c-paragraph">Graph is loading very slowly sometimes. You can check quick mode - loading will be quick, but the result will not be pretty.</p>
          <h3 class="c-h3">
            Limit of nodes
          </h3>
          <p class="c-paragraph">By default, only 300 elements (nodes and relationships) are showed (because of performance). If you want to increase this number, write your limit to the appropriate text field.</p>
        </div>
      </div>
  </div>
</template>

<style scoped lang="scss">
  .c-modal, .c-overlay {
    display: block;
    opacity: 1;
  }
</style>

<script>
  import axios from "axios";

  export default {
    props: {
      show: {
        default: false,
        type: Boolean
      }
    },
    methods: {
      hideModal: function() {
        this.$parent.showHelp = false;
      }
    }
  }
</script>

