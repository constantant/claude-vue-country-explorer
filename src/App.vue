<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>
        <router-link to="/" class="text-decoration-none text-white">
          Country Explorer
        </router-link>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// App.vue uses setup script with no additional logic needed
</script>

<style>
.text-decoration-none {
  text-decoration: none;
}
</style>
