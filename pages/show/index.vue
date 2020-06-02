<template>
  <div>
    <Graph />
    <Loader class="graph-loader" />
  </div>
</template>

<script>
  import Graph from "../../components/Graph";

  export default {
    components: {
      Graph
    }
  }
</script>
