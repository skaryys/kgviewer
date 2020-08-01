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
      </Paragraph>
      <button class="c-button" v-on:click="function(e) {addNode(e.target, result);}" v-if="!noAdd">Add to graph</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['result', "noAdd"],
    methods: {
      addNode: function (button, result) {
        button.innerHTML = 'Added to queue';
        button.style.pointerEvents = 'none';
        setTimeout(() => {
          button.style.display = 'none';
        }, 1000);
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
