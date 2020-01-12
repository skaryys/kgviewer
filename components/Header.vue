<template>
  <header class="c-menu horizontal h-positionFixed" data-menu="menu-1">
    <div class="wrapper">
      <a class="logo" href="/">
        Knowledge Graph Viewer
      </a>
      <nav class="nav">
        <ul class="nav-list">
          <li>
            <a href="#">Zobrazit dosavadní graf</a>
          </li>
          <li>
            <a href="/add">Přidat novou entitu do grafu</a>
          </li>
        </ul>
      </nav>
      <div class="hamburger" v-on:click="toggleMenu">
        <div class="line"></div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
  .logo {
    color: $white;
    font-size: 2.2rem;

    @include break($screen-md) {
      flex-basis: 25rem;
      font-size: 2.8rem;
    }
  }
</style>

<script>
  export default {
    methods: {
      toggleMenu: function() {
        document.querySelector(".c-menu").classList.toggle("opened");
      }
    }
  }
</script>

