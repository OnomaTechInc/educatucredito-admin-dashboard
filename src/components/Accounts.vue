<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column>
        <v-card class="header" flat>
          <v-card-title>
          <!-- <v-flex xs12 sm6 md6> -->
            <h2>Chart Accounts Management</h2>
            <!-- <v-spacer></v-spacer> -->
          </v-card-title>
        </v-card>
        <v-container>
          <v-card>
            <v-card-title>
              <v-dialog 
                v-model="dialog" 
                max-width="500px"
                content-class="overflow_visible"
                persistent
                scrollable
              >
                <v-card style="height: 500px;">
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
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
                            v-model="editedItem.duedate" 
                            label="Due Date"
                            prepend-icon="calendar" 
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field 
                            v-model="editedItem.amount" 
                            label="Amount"
                            prepend-icon="phone" 
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field 
                            v-model="editedItem.file" 
                            label="File"
                            prepend-icon="room" 
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="items"
              :loading="loading"
              :search="search"
            >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.name }}</td>
                <td class="text-xs-left">{{ props.item.duedate }}</td>
                <td class="text-xs-left">{{ props.item.amount }}</td>
                <td class="justify-center layout px-0">
                  <v-btn icon class="mx-0" @click="editItem(props.item)">
                    <v-icon color="teal">edit</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                    <v-icon color="pink">delete</v-icon>
                  </v-btn>
                </td>
              </template>
              <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
              </v-alert>
            </v-data-table>
          </v-card>
        </v-container>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.header {
  background: #fff;
  margin: 0px -23px 20px -23px;
  padding: 0px 20px 0 20px;
  width: 100%;
}
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
.float_atop {
  cursor: pointer;
  position: absolute;
  left: 50%;
  top: -60px;
  transform: translateX(-50%);
  z-index: 999999999999
}
</style>
<style>
.overflow_visible {
  overflow: visible;
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
        headers: [
          // { text: 'Avatar', value: 'avatar' },
          {
            text: 'Name',
            align: 'left',
            value: 'name'
          },
          { text: 'Due Date', value: 'duedate' },
          { text: 'Amount', value: 'amount' },
          { text: 'Actions', value: 'name', sortable: false }
        ],
        editedIndex: -1,
        editedItem: {
          name: '',
          email: '',
          contact: '',
          address: '',
          avatar: ''
        },
        defaultItem: {
          name: '',
          email: '',
          contact: '',
          address: '',
          avatar: ''
        },
        photoIsLoaded: false,
        session: '',
        loadPhoto: function (val) {
          var reader = new FileReader()
          var d = this
          reader.onload = function (event) {
            d.$parent.$parent.$parent.$parent.editedItem.avatar = event.target.result
          }
          reader.readAsDataURL(val)
          d.$parent.$parent.$parent.$parent.photoIsLoaded = true
        }
      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Agent' : 'Edit Agent'
      }
    },
    watch: {
      dialog (val) {
        this.photoIsLoaded = true
        val || this.close()
      }
    },
    created () {
      this.initialize()
    },
    methods: {
      uploadPhoto () {
        document.getElementById('uploadFile').click()
      },

      getColor (v) {
        if (v === '') {
          return 'lightgray'
        } else {
          return window.avatarColor[v]
        }
      },

      initialize () {
        var d = this
        this.session = JSON.parse(localStorage.getItem('session'))
        axios.defaults.headers.common['Authorization'] = `bearer ${this.session.api_key}`
        axios.get(window.apiLink + 'agents').then(function (response) {
          // localStorage.setItem('session', JSON.stringify(response.data))
          // d.$emit('setRoleName', response.data)
          var items = []
          for (var x = 0; x < response.data.result.length; x++) {
            items.push({
              id: response.data.result[x].id,
              name: response.data.result[x].name,
              avatar: response.data.result[x].user_image,
              email: response.data.result[x].email,
              contact: response.data.result[x].company,
              address: response.data.result[x].position
            })
          }
          d.loading = false
          d.items = items
        }).catch(function (error) {
          console.log(error)
          if (error.response !== undefined && error.response.status === 422) {
            d.error = true
            // d.errorMessage = error.response.data.username
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

      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.items.indexOf(item)
        var d = this
        this.$store.dispatch('confirmer/ask', {
          title: 'Confirm Delete',
          body: 'Are you sure you want to delete this item?'
        }).then(confirmation => {
          if (confirmation) {
            axios.delete(
              `${window.apiLink}agents/${item.id}`
            ).then(function (res) {
              d.items.splice(index, 1)
              d.$emit('receiveAlertMessage', {
                body: 'Agent has been successfully removed.',
                type: 'success',
                id: uuid.v4()
              })
            }).catch(function (error) {
              console.log('error: ', error)
            })
          }
        })
      },

      close () {
        this.dialog = false
        document.getElementById('uploadFile').value = ''
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        var data = new FormData()
        var d = this
        var O = Object
        data.append('file', document.getElementById('uploadFile').files[0])
        if (this.editedIndex > -1) {
          // O.assign(d.items[d.editedIndex], d.editedItem)
          axios.put(`${window.apiLink}agents/${d.editedItem.id}`, {
            email: d.editedItem.email,
            name: d.editedItem.name,
            contact: d.editedItem.contact,
            address: d.editedItem.address
          }).then(function (res) {
            O.assign(d.items[d.editedIndex], d.editedItem)
            d.$emit('receiveAlertMessage', {
              body: 'Agent has been successfully save.',
              type: 'success',
              id: uuid.v4()
            })
            d.close()
            if (d.photoIsLoaded === true) {
              axios.post(
                `${window.apiLink}agents/photo/${d.editedItem.id}`,
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
        } else {
          axios.post(`${window.apiLink}agents/`, {
            email: d.editedItem.email,
            name: d.editedItem.name,
            contact: d.editedItem.contact,
            address: d.editedItem.address
          }).then(function (res) {
            // console.log('editedItem: ', d.editedItem)
            d.items.push(d.editedItem)
            // console.log('items: ', d.items)
            d.$emit('receiveAlertMessage', {
              body: 'Agent has been successfully save.',
              type: 'success',
              id: uuid.v4()
            })
            d.close()
            if (d.photoIsLoaded === true) {
              axios.post(
                `${window.apiLink}agents/upload/${res.data.last_insert_id}`,
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
      }
    },
    components: {
      'upload-btn': UploadButton
    }
  }
</script>
