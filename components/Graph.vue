<template>
  <div class="graph-wrapper" id="main-graph">
  </div>
</template>

<style lang="scss">
  .graph-wrapper {
    width: 100%;
    @include calc(height, "100vh - 6rem");

    @include break($screen-md) {
      @include calc(height, "100vh - 10rem");
    }
  }
</style>

<script>
  export default {
    mounted() {
      this.drawGraph();
    },
    methods: {
      drawGraph: function () {
        let config = {
          container_id: "main-graph",
          server_url: "bolt://localhost:7687",
          server_user: "neo4j",
          server_password: "kgviewer",
          labels: {
            "Class": {
              "caption": "className"
            },
            [NeoVis.NEOVIS_DEFAULT_CONFIG]: {
              "caption": "name",
            },
          },
          arrows: true,
          initial_cypher: "MATCH (n)-[r]->(m) WHERE NOT n:Class AND NOT m:Class RETURN n,r,m"
        };

        const viz = new NeoVis.default(config);
        viz.render();
      }
    }
  }
</script>
