<template>
  <div>
    <Header></Header>
    <div class="content-wrapper">
      <nuxt />
    </div>
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
