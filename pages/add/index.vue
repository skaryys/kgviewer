<template>
  <Container class="addpage">
    <Row>
      <Col class="xs-hide xs-3 lg-show">
        <Heading3>
          Entities waiting to be added
        </Heading3>
        <Paragraph style="color: limegreen" v-if="queueEntities.length < 1">
          No entities are waiting to be added
        </Paragraph>
        <div v-if="queueEntities.length > 0">
          <Paragraph v-for="(entity, index) in queueEntities" v-bind:key="entity.id" style="margin-bottom: .5rem;">
            <strong>{{ entity.name }}</strong>
            <span v-if="typeof(entity.description) != 'undefined'"> - {{ entity.description }}</span>
            <span v-if="index === 0" class="loading"></span>
          </Paragraph>
        </div>
      </Col>
      <Col>
        <Heading1>
          Add entity to graph
        </Heading1>
        <div class="inputContainer">
          <input type="text" id="entityInput" class="c-input"/>
          <button id="entityButton" class="c-button" v-on:click="findEntities()">Search entities</button>
        </div>
        <Row v-if="foundEntities.length > 0" style="margin-top: 3rem;">
          <transition name="fade" v-for="entity in foundEntities" v-bind:key="entity.result.id" appear>
            <Col :xs="12" :sm="6" :lg="4" :xl="3" style="display: flex; margin-bottom: 3rem;">
              <Card
                :result="entity.result"
                :no-add="false"
                v-on:add-root="addNode($event)"
              ></Card>
            </Col>
          </transition>
        </Row>
        <Row v-if="foundEntities.length < 1" style="margin-top: 3rem">
          <transition name="fade" appear>
            <Col :xs="12">
              <Paragraph>
                No result or no query.
              </Paragraph>
            </Col>
          </transition>
        </Row>
      </Col>
    </Row>
    <Loader v-if="loader"/>
  </Container>
</template>

<style scoped lang="scss">
  .addpage {
    padding-top: 2rem;
    padding-bottom: 8rem;
  }

  .inputContainer {
    display: flex;

    button {
      flex: 0 0 20rem;
    }
  }

  @keyframes ellipsis {
    to {
      width: 2rem;
    }
  }

  .loading:after {
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    -webkit-animation: ellipsis steps(4,end) 900ms infinite;
    animation: ellipsis steps(4,end) 900ms infinite;
    content: "\2026";
    width: 0;
  }
</style>

<script>
  import axios from "axios";

  export default {
    data() {
      return {
        loader: false,
        queueEntities: [],
        foundEntities: []
      }
    },
    methods: {
      findEntities: function () {
        const self = this;
        self.loader = true;
        const query = this.$el.querySelector("#entityInput").value;

        axios.get('https://kgsearch.googleapis.com/v1/entities:search', {
          params: {
            'query': query,
            'limit': 100,
            'indent': true,
            "key": "AIzaSyA94kim18rne3X5gzh7Gpl8Gt4SXz5yzuc",
            "languages": "en"
          }
        }).then(function (response) {
          self.foundEntities = response.data.itemListElement;
          self.loader = false;
        });
      },

      addNode: function (result) {
        const self = this;
        self.loader = true;

        axios.post("/add/to/queue", result).then(() => {
          self.loader = false;
        }).catch(error => {
          console.log(error);
          self.loader = false;
        });
      },
    },
    mounted() {
      const self = this;

      axios.get('http://localhost:3001/db.json').then(function (response) {
        self.queueEntities = response.data["objects"];
      });

      setInterval(function() {
        axios.get('http://localhost:3001/db.json').then(function (response) {
          self.queueEntities = response.data["objects"];
        });
      }, 5000);
    }
  }
</script>
