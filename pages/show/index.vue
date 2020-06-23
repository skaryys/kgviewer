<template>
  <div>

    <div class="search-wrapper">
      <Row>
        <Col>
          <select class="c-input" v-model="whatSearch">
            <option value="0">All</option>
            <option value="1">Search nodes by name</option>
            <option value="2">Search nodes of a given type</option>
            <option value="3">Search nodes by CYPHER</option>
          </select>
        </Col>
        <Col>
          <input class="c-input" v-model="searchString" v-if="(whatSearch != 2 && whatSearch != 0)" />
          <select class="c-input" v-model="searchType" v-if="(whatSearch == 2)">
            <option v-for="label in labels" :value="label">
              {{ label }}
            </option>
          </select>
        </Col>
        <Col class="h-displayFlex xs-itemsCenter xs-wrap xs-stretch" v-if="(whatSearch != 3)">
          <div class="c-svgInput h-displayInlineBlock">
            <input type="checkbox" name="class_nodes" id="class_nodes" v-model="cypherNodes">
            <label for="class_nodes">
              <svg overflow="scroll" baseProfile="tiny" version="1.1" viewBox="0 0 10.001 7.993" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.428,0L3.936,4.7L1.574,2.229L0,3.875L3.149,7.17l0.787,0.824l6.066-6.347L8.428,0z" fill-rule="evenodd"></path>
              </svg>
            </label>
          </div>
          <label class="c-paragraph node-label" for="class_nodes">Show types</label>
        </Col>
        <Col class="h-displayFlex xs-itemsCenter xs-wrap xs-stretch">
          <div class="c-svgInput h-displayInlineBlock">
            <input type="checkbox" name="quick_mode" id="quick_mode" v-model="quickMode">
            <label for="quick_mode">
              <svg overflow="scroll" baseProfile="tiny" version="1.1" viewBox="0 0 10.001 7.993" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.428,0L3.936,4.7L1.574,2.229L0,3.875L3.149,7.17l0.787,0.824l6.066-6.347L8.428,0z" fill-rule="evenodd"></path>
              </svg>
            </label>
          </div>
          <label class="c-paragraph node-label" for="quick_mode">Quick mode</label>
        </Col>
        <Col class="xs-stretch" v-if="(whatSearch != 3)">
          <input class="c-input limit-input" type="number" min="0" v-model="nodesLimit" placeholder="Limit" />
        </Col>
        <Col class="xs-stretch">
          <button class="c-button a-button" @click="drawGraph()">Update</button>
        </Col>
      </Row>
    </div>

    <div class="c-card" id="graphCard"> <!-- nemůže být normální komponenta, využívá věci z klientské knihovny Neovis -->
      <div class="c-mediaWrapper-4_3" id="graphCard-image" style="display: none;">
      </div>
      <div class="content">
        <div class="c-h2" id="graphCard-name" style="display: none">
          x
        </div>
      </div>
    </div>

    <div class="graph-wrapper" id="main-graph"></div>

    <Loader class="graph-loader" />
  </div>
</template>

<style lang="scss" scoped>
  .search-wrapper {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    @include break($screen-md) {
      display: block;
      top: 10rem;
      background-color: $white;
      z-index: 5;
      box-shadow: 0 0.5rem 1rem 0 rgba(120, 120, 120, 0.3);
      padding: .5rem 1.5rem;

      select.c-input {
        background-image: url(/drop.svg);
      }

      .node-label {
        margin-bottom: 0;
        margin-left: 1rem;
      }

      .limit-input {
        width: 8rem;
        text-align: center;
      }
    }
  }

  .graph-wrapper {
    width: 100%;
    @include calc(height, "100vh - 6rem");

    @include break($screen-md) {
      @include calc(height, "100vh - 10rem");
    }
  }

  #graphCard {
    display: none;

    @include break($screen-md) {
      width: 35rem;
      max-width: 35rem;
      position: fixed;
      top: 18rem;
      left: 2rem;
      z-index: 6;
    }
  }
</style>

<script>
  import axios from "axios";

  export default {
    data() {
      return {
        cypherNodes: false,
        whatSearch: 0,
        searchString: "",
        searchType: "Person",
        labels: [],
        nodesLimit: 300,
        quickMode: false
      }
    },
    mounted() {
      this.drawGraph();
      this.getLabels();
    },
    methods: {
      getLabels: function() {
        const self = this;
        axios.get('/get/labels').then(function (response) {
          self.labels = response.data;
        });
      },
      searching: function() {
        if (this.whatSearch == 0) {
          return "";
        } else if (this.whatSearch == 1) {
          return "AND (n.name CONTAINS '" + this.searchString + "' OR m.name CONTAINS '" + this.searchString + "') ";
        } else if (this.whatSearch == 2) {
          return "AND (n:" + this.searchType + " OR m:" + this.searchType + ") ";
        } else if (this.whatSearch == 3) {
          return this.searchString;
        }
      },
      cypherNodesString: function() {
        return (this.cypherNodes ? "" : "AND NOT n:Type AND NOT m:Type ");
      },
      drawGraph: function () {
          document.querySelector(".graph-loader").style.display = "block";
          let config = {
            container_id: "main-graph",
            server_url: "bolt://localhost:7687",
            server_user: "neo4j",
            server_password: "kgviewer",
            labels: {
              [NeoVis.NEOVIS_DEFAULT_CONFIG]: {
                "caption": "name",
              },
            },
            arrows: true,
            initial_cypher: (this.whatSearch == 3) ? this.searchString : "MATCH (n)-[r]->(m) WHERE id(n) > 0 " + this.cypherNodesString() + this.searching() +"RETURN n,r,m LIMIT " + this.nodesLimit
          };
          const viz = new NeoVis.default(config);
          viz.render();
      }
    }
  }
</script>

