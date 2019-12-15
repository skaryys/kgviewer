<template>
  <div class="container">
    <slot/>
  </div>
</template>

<style scoped lang="scss">
  .container {
    width: 100%;
    max-width: 100%;
    display: block;
    padding-left: $columnsSpace / 2;
    padding-right: $columnsSpace / 2;

    @include break($screen-xs) {
      width: convert($screen-xs);
      margin-left: auto;
      margin-right: auto;
    }

    @include break($screen-sm) {
      width: convert($screen-sm);
    }

    @include break($screen-md) {
      width: convert($screen-md);
    }

    @include break($screen-lg) {
      width: convert($screen-lg);
    }

    @include break($screen-xl) {
      width: convert($screen-xl);
    }

  }
</style>