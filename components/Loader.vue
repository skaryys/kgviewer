<template>
  <div class="ajaxLoader">
    <div class="loader"></div>
  </div>
</template>

<style lang="scss" scoped>
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .ajaxLoader {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.7);
    z-index: 80000;

    .loader {
      border: 16px solid #f3f3f3;
      border-top: 16px solid red;
      border-radius: 50%;
      width: 150px;
      height: 150px;
      animation: spin 2s linear infinite;
      position: absolute;
      @include calc(left,"50% - 7.5rem");
      @include calc(top,"50% - 7.5rem");
    }
  }
</style>
