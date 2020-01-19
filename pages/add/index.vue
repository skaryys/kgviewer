<template>
  <Container class="addpage">
    <Heading1>
      Přidání entity do grafu
    </Heading1>
    <div class="inputContainer">
      <input type="text" id="entityInput" class="c-input"/>
      <button id="entityButton" class="c-button" v-on:click="findEntities()">Hledat entity</button>
    </div>
    <Row v-if="foundEntities.length > 0" style="margin-top: 3rem;">
      <transition name="fade" v-for="entity in foundEntities" v-bind:key="entity.result.id" appear>
        <Col :xs="12" :sm="6" :lg="4" :xl="3" style="display: flex; margin-bottom: 3rem;">
          <Card
            :result="entity.result"
            v-on:add-root="addNode($event)"
          ></Card>
        </Col>
      </transition>
    </Row>
    <Row v-if="foundEntities.length < 1" style="margin-top: 3rem">
      <transition name="fade" appear>
        <Col :xs="12">
          <Paragraph>
            Nenalezen žádný výsledek nebo jste ještě nezadali váš požadavek.
          </Paragraph>
        </Col>
      </transition>
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
</style>

<script>
  import axios from "axios";

  export default {
    asyncData() {
      return {
        foundEntities: [],
        loader: false
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
            "languages": "cs"
          }
        }).then(function (response) {
          self.foundEntities = response.data.itemListElement;
          self.loader = false;
        });
      },

      addNode: function (result) {
        const self = this;
        self.loader = true;

        axios.all([
          axios.post('/add/single', result),
          axios.post('/add/relatives', result)
        ]).then(() => {
          self.loader = false;
        })
        .catch(error => {
          console.log(error);
          self.loader = false;
        });
      },

    }
  }
</script>
