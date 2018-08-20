<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
            <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-form @submit.prevent="login">
                <v-card-text>
                    <v-text-field 
                      prepend-icon="person" 
                      name="login" 
                      label="Login" 
                      id="username"
                      type="text"
                      :error="error"
                      :error-messages="errorMessage"
                      v-model="username"
                      autocorrect="off"
                      autocapitalize="none"
                    >
                    </v-text-field>
                    <v-text-field 
                      prepend-icon="lock" 
                      name="password" 
                      label="Password" 
                      id="password" 
                      type="password" 
                      v-model="pass" 
                      :error="error"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn type="submit" color="primary">Login</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
        </v-flex>
    </v-layout>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.below_box {
  position: relative;
  top: 40px;
}
</style>
<script>
import axios from 'axios'
import {uuid} from 'vue-uuid'
export default {
  data () {
    return {
      username: '',
      pass: '',
      error: false,
      errorMessage: []
    }
  },
  methods: {
    login () {
      var d = this
      axios.get(`${window.apiLink}login`, {
        params: {
          email: this.username,
          password: this.pass
        }
      }).then(function (response) {
        if (response.data.status === 'error') {
          d.$emit('receiveAlertMessage', {
            body: response.data.message,
            type: 'error',
            id: uuid.v4()
          })
        } else {
          localStorage.setItem('adminsession', JSON.stringify(response.data))
          d.$emit('setRoleName', response.data)
          if (d.$route.query.redirect !== undefined) {
            d.$router.replace({ path: d.$route.query.redirect })
          } else {
            d.$router.replace({ name: 'Dashboard' })
          }
        }
      }).catch(function (error) {
        if (error.response.status !== undefined && error.response.status === 422) {
          d.error = true
          d.errorMessage = error.response.data.username
        } else {
          d.$emit('receiveAlertMessage', {
            body: error.response.statusText,
            type: 'error',
            id: uuid.v4()
          })
        }
      })
    }
  }
}
</script>