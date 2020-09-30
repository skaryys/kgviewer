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
          <input class="c-input limit-input" type="number" min="0" v-model="nodesLimit" placeholder="Limit" title="Limit" />
        </Col>
        <Col class="xs-stretch">
          <button class="c-button a-button" @click="drawGraph()">Search</button>
        </Col>
        <Col class="xs-stretch">
          <button class="c-button a-button" @click="exportRDF()">Export</button>
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
    <HelpModal :show="showHelp" />
    <div class="help-icon" @click="() => {this.showHelp = true;}">
      <svg id="Layer_1" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg"><g><path fill="#fff" d="m437.02 74.98c-48.353-48.352-112.64-74.98-181.02-74.98s-132.667 26.628-181.02 74.98-74.98 112.64-74.98 181.02 26.628 132.667 74.98 181.02 112.64 74.98 181.02 74.98 132.667-26.628 181.02-74.98 74.98-112.64 74.98-181.02-26.628-132.667-74.98-181.02zm-181 357.02c-8.836 0-16.005-7.164-16.005-16s7.158-16 15.995-16h.01c8.836 0 16 7.164 16 16s-7.164 16-16 16zm50.892-164.285c-22.514 22.514-34.912 52.447-34.912 84.285 0 8.836-7.164 16-16 16s-16-7.164-16-16c0-40.386 15.727-78.354 44.285-106.912 17.872-17.873 27.715-41.635 27.715-66.911 0-27.668-22.509-50.177-50.177-50.177h-3.646c-27.668 0-50.177 22.509-50.177 50.177v5.823c0 8.836-7.164 16-16 16s-16-7.164-16-16v-5.823c0-45.313 36.864-82.177 82.177-82.177h3.646c45.313 0 82.177 36.864 82.177 82.177 0 33.823-13.171 65.622-37.088 89.538z"/></g></svg>
    </div>
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

  .help-icon {
    position: fixed;
    top: 0;
    right: 0;
    width: 5rem;
    height: 5rem;
    z-index: 8;
    cursor: pointer;
    svg {
      width: 5rem;
      height: 5rem;
    }
  }
</style>

<script>
  import axios from "axios";
  import FileDownload from "js-file-download";
  import HelpModal from "~/components/HelpModal.vue";

  export default {
    components: {
      HelpModal
    },
    data() {
      return {
        cypherNodes: false,
        whatSearch: 0,
        searchString: "",
        searchType: "Person",
        labels: [],
        nodesLimit: 300,
        quickMode: false,
        showHelp: false,
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
            initial_cypher: (this.whatSearch == 3) ? this.searchString : "MATCH (n)-[r]->(m) WHERE id(n) > 0 " + this.cypherNodesString() + this.searching() +"RETURN n,r,m ORDER BY id(r) DESC LIMIT " + this.nodesLimit
          };
          const viz = new NeoVis.default(config);
          viz.render();
      },
      exportRDF: function() {
        axios.get('/get/partial/rdf', {
          params: {
            cypher: (this.whatSearch == 3) ? this.searchString : "MATCH (n)-[r]->(m) WHERE id(n) > 0 " + this.cypherNodesString() + this.searching() + "RETURN n,r,m ORDER BY id(r) DESC LIMIT " + this.nodesLimit
          }}).then(function (response) {
            FileDownload(response.data, 'partial_graph.rdf');
        }).catch(function (error) {
          console.log('Error ' + error.message)
        });
      }
    }
  }
</script>

