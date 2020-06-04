<template>
  <div class="c-card">
    <div class="c-mediaWrapper-4_3" v-if="result.image">
      <img :src="result.image.contentUrl" :alt="result.name"/>
    </div>
    <div class="content">
      <div class="c-h2">
        {{ result.name }}
      </div>
      <Paragraph>
        {{ result.description }}
        <br v-if="result.description">
        <br v-if="result.description">
        <em>{{ result["@id"] }}</em>
      </Paragraph>
      <button class="c-button" v-on:click="addNode(result)" v-if="!noAdd">Přidat do grafu</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['result', "noAdd"],
    methods: {
      addNode: function (result) {
        this.$emit('add-root', result)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    padding-bottom: 8rem;

    .c-button {
      background-color: #32cd32;
      position: absolute;
      bottom: 3rem;
      left: 3rem;
    }
  }
</style>
