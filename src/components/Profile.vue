<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-card class="header" flat>
          <v-card-title>
            <h2>Profile</h2>
          </v-card-title>
        </v-card>
        <v-container>
          <v-card>
            <v-card-title>
              <v-avatar
                class="float_atop"
                slot="activator"
                color="red"
                size="120"
                style="background: #fff"
                light
                @click="uploadPhoto"
              >
                <img
                  title="click here to change photo"
                  v-if="editedItem.avatar"
                  :src="editedItem.avatar"
                  alt=""
                >
                <span title="click here to upload photo" class="white--text" style="font-size: 84px" v-else-if="editedItem.name">{{ initials(editedItem.name) }}</span>
                <span title="click here to upload photo" class="black--text" v-else><v-icon size="120">account_circle</v-icon></span>
              </v-avatar>
              <upload-btn :fileChangedCallback="loadPhoto" style="display:none"></upload-btn>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field 
                      v-model="editedItem.name" 
                      label="Name"
                      prepend-icon="person" 
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field 
                      v-model="editedItem.email" 
                      label="Email"
                      prepend-icon="mail" 
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field 
                      v-model="editedItem.company" 
                      label="Company"
                      prepend-icon="business" 
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field 
                      v-model="editedItem.position" 
                      label="Position"
                      prepend-icon="how_to_reg" 
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-btn color="error" @click="">Reset password</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.header {
  background: #fff;
  margin: 0px -23px 20px -23px;
  padding: 0px 20px 0 20px;
  width: 100%;
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
.float_atop {
  cursor: pointer;
  position: absolute;
  left: 50%;
  top: -60px;
  transform: translateX(-50%);
  z-index: 999999999999
}
</style>
<script>
  import axios from 'axios'
  import {uuid} from 'vue-uuid'
  import UploadButton from 'vuetify-upload-button'
  export default {
    data () {
      return {
        dialog: false,
        loading: true,
        search: '',
        items: [],
        editedItem: {
          name: '',
          email: '',
          company: '',
          position: ''
        },
        photoIsLoaded: false,
        session: '',
        loadPhoto: function (val) {
          var reader = new FileReader()
          var d = this
          reader.onload = function (event) {
            d.$parent.$parent.editedItem.avatar = event.target.result
          }
          reader.readAsDataURL(val)
          d.$parent.$parent.photoIsLoaded = true
        }
      }
    },
    computed: {
    },
    watch: {
      dialog (val) {
        this.photoIsLoaded = true
        val || this.close()
      }
    },
    created () {
      // this.initialize()
    },
    methods: {
      resetPasswd () {
        // var d = this
        this.$store.dispatch('confirmer/ask', {
          title: 'Confirm Reset',
          body: 'Are you sure you want to reset this user\'s password?'
        }).then(confirmation => {
          if (confirmation) {
            // @TODO: reset password
          }
          // d.dialog = false
        })
      },

      uploadPhoto () {
        document.getElementById('uploadFile').click()
      },

      initialize () {
        var d = this
        this.session = JSON.parse(localStorage.getItem('session'))
        axios.defaults.headers.common['Authorization'] = `bearer ${this.session.api_key}`
        axios.get(window.apiLink + 'users').then(function (response) {
          // localStorage.setItem('session', JSON.stringify(response.data))
          // d.$emit('setRoleName', response.data)
          var items = []
          for (var x = 0; x < response.data.result.length; x++) {
            items.push({
              id: response.data.result[x].id,
              name: response.data.result[x].name,
              avatar: response.data.result[x].user_image,
              email: response.data.result[x].email,
              company: response.data.result[x].company,
              position: response.data.result[x].position
            })
          }
          d.loading = false
          d.items = items
        }).catch(function (error) {
          console.log(error)
          if (error.response !== undefined && error.response.status === 422) {
            d.error = true
            d.errorMessage = error.response.data.username
          } else {
            d.$emit('receiveAlertMessage', {
              body: error.response.statusText,
              type: 'error',
              id: uuid.v4()
            })
          }
          d.loading = false
        })
      },

      initials (f = 'f') {
        if (f !== null || f !== undefined) {
          return f.charAt(0).toUpperCase()
        } else {
          return '?'
        }
      },

      save () {
        var data = new FormData()
        var d = this
        var O = Object
        data.append('file', document.getElementById('uploadFile').files[0])
        axios.put(`${window.apiLink}users/`, {
          email: d.editedItem.email,
          name: d.editedItem.name,
          company: d.editedItem.company,
          position: d.editedItem.position
        }).then(function (res) {
          // console.log('editedItem: ', d.editedItem)
          d.items.push(d.editedItem)
          // console.log('items: ', d.items)
          d.$emit('receiveAlertMessage', {
            body: 'User has been successfully save.',
            type: 'success',
            id: uuid.v4()
          })
          d.close()
          if (d.photoIsLoaded === true) {
            axios.post(
              `${window.apiLink}users/upload/${res.data.last_insert_id}`,
              data
            ).then(function (res2) {
            }).catch(function (error2) {
              console.log('error: ', error2)
            })
            d.photoIsLoaded = false
          }
        }).catch(function (error) {
          console.log('error: ', error)
        })
      }
    },
    components: {
      'upload-btn': UploadButton
    }
  }
</script>