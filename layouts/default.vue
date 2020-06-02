<template>
  <div>
    <Header></Header>
    <div class="content-wrapper">
      <nuxt />
    </div>
    <script src="/neovis.js-custom/dist/neovis.js"></script>
  </div>
</template>

<script>
  import Header from "~/components/Header.vue";

  export default {
    components: {
      Header
    }
  }
</script>

<style scoped lang="scss">
  .content-wrapper {
    padding-top: $menuHeight;

    @include break($screen-md) {
      padding-top: $menuDesktopHeight;
    }
  }
</style>
