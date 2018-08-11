<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-card class="header" flat>
          <v-card-title>
            <h2>Files Management</h2>
          </v-card-title>
        </v-card>
        <v-card style="height: 500px;">
        </v-card>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2.header {
  background: #fff;
  margin: -23px -23px 20px -23px;
  padding: 20px;
}
.content--wrap .container {
  background: #f5f5f5;
}
.content-container {
  padding: 20px;
  background: #fff;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
<script>
</script>