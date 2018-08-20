<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-card class="header" flat>
          <v-card-title>
            <h2>Videos</h2>
          </v-card-title>
        </v-card>
        <v-container pl-3 pr-3>
          <v-card flat>
            <v-card-title>
              <v-dialog 
                v-model="dialog" 
                max-width="500px"
                content-class="overflow_visible"
                persistent
                scrollable
              >
                <v-btn 
                  slot="activator" 
                  color="primary" 
                  dark 
                  class="mb-2">
                  Create New Video
                  <v-icon right dark>add</v-icon>
                </v-btn>
                <v-card style="height: 500px;">
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm12 md12>
                          <v-btn class="primary" @click="dialog2 = true">Upload video</v-btn>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field 
                            v-model="editedItem.title" 
                            label="Title"
                            prepend-icon="view_headline" 
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-textarea 
                            v-model="editedItem.description" 
                            label="Description"
                            prepend-icon="description" 
                          ></v-textarea>
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
            <v-data-table class="videoList"
              :headers="headers"
              :items="items"
              :loading="loading"
              :search="search"
            >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{ props.item.title }}</td>
                <td class="text-xs-left">{{ props.item.description }}</td>
                <td class="justify-center layout px-0">
                  <v-btn icon class="mx-0" @click="watchItem(props.item)">
                    <v-icon color="green">play_circle_outline</v-icon>
                  </v-btn>
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
    <v-dialog 
      v-model='dialog2'
      fullscreen
      transition='dialog-bottom-transition'
      scrollable
    >
      <v-card tile>
        <v-toolbar card dark color='primary'>
          <v-btn icon @click.native='dialog2 = false' dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Drag and drop video here</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native='uploadInit'>Start Upload</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-progress-linear :indeterminate='true' v-if='startUpload'></v-progress-linear>
        <v-card-text>
          <picture-input
            id='uploadFile' 
            v-if='dialog2' 
            width='600' 
            height='600' 
            ref='pictureInput' 
            margin='16' 
            change='Change Video'
            remove='Remove Video'
            @change='onChange'
            accept='video/mp4,video/webm' 
            size='10' 
            buttonClass='btn theme--dark primary pa-2 white--text'
            removeButtonClass='btn theme--dark secondary pa-2 white--text'
            :removable='true'
            :customStrings='customStrings'>
          </picture-input>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog 
      v-model='dialog3'
      scrollable
      max-width="600px"
    >
      <v-card>
        <video-player
          class="video-player-box"
          ref="videoPlayer"
          :options="playerOptions"
          :playsinline="true"
        >
        </video-player>
      </v-card>
    </v-dialog>
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
  import axios from 'axios'
  import {uuid} from 'vue-uuid'
  import UploadButton from 'vuetify-upload-button'
  import PictureInput from 'vue-picture-input'
  import { videoPlayer } from 'vue-video-player'
  import 'video.js/dist/video-js.css'
  export default {
    data () {
      return {
        playerOptions: {
          muted: false,
          fluid: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: 'video/mp4',
            src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
          }]
        },
        video: '',
        customStrings: {
          'upload': '<p>Your device does not support file uploading.</p>', 
          'drag': 'Drag video here',
          'change': 'Change Video',
          'remove': 'Remove Video'
        },
        startUpload: false,
        dialog3: false,
        dialog2: false,
        dialog: false,
        loading: true,
        search: '',
        items: [],
        headers: [
          // { text: 'Avatar', value: 'avatar' },
          {
            text: 'Title',
            align: 'left',
            value: 'title'
          },
          { text: 'Description', value: 'description' },
          { text: 'Actions', value: 'name', sortable: false }
        ],
        editedIndex: -1,
        editedItem: {
          title: '',
          description: ''
        },
        defaultItem: {
          title: '',
          description: ''
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
        return this.editedIndex === -1 ? 'New Video' : 'Edit Video'
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
      uploadInit () {
        console.log('uploading...')
        this.dialog2 = false
      },

      onChange (video) {
        // console.log(image)
        // console.log('New picture selected!')
        if (video) {
          // console.log('Picture loaded.')
          this.video = video
        } else {
          console.log('FileReader API not supported: use the <form>, Luke!')
        }
      },
      
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
        this.session = JSON.parse(localStorage.getItem('adminsession'))
        axios.defaults.headers.common['Authorization'] = `bearer ${this.session.api_key}`
        axios.get(window.apiLink + 'videos').then(function (response) {
          // localStorage.setItem('session', JSON.stringify(response.data))
          // d.$emit('setRoleName', response.data)
          var items = []
          for (var x = 0; x < response.data.result.length; x++) {
            items.push({
              id: response.data.result[x].id,
              title: response.data.result[x].title,
              description: response.data.result[x].description,
              video: response.data.result[x].video
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

      watchItem (item) {
        this.dialog3 = true
        this.playerOptions.sources[0].src = item.video
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
              `${window.apiLink}videos/${item.id}`
            ).then(function (res) {
              d.items.splice(index, 1)
              d.$emit('receiveAlertMessage', {
                body: 'Video has been successfully removed.',
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
          axios.put(`${window.apiLink}videos/${d.editedItem.id}`, {
            title: d.editedItem.title,
            description: d.editedItem.description,
            video: d.editedItem.video
          }).then(function (res) {
            O.assign(d.items[d.editedIndex], d.editedItem)
            d.$emit('receiveAlertMessage', {
              body: 'Video has been successfully save.',
              type: 'success',
              id: uuid.v4()
            })
            d.close()
            if (d.photoIsLoaded === true) {
              axios.post(
                `${window.apiLink}videos/video/${d.editedItem.id}`,
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
          axios.post(`${window.apiLink}videos/`, {
            email: d.editedItem.email,
            name: d.editedItem.name,
            company: d.editedItem.company,
            position: d.editedItem.position,
            role: d.editedItem.role
          }).then(function (res) {
            // console.log('editedItem: ', d.editedItem)
            d.items.push(d.editedItem)
            // console.log('items: ', d.items)
            d.$emit('receiveAlertMessage', {
              body: 'Video has been successfully save.',
              type: 'success',
              id: uuid.v4()
            })
            d.close()
            if (d.photoIsLoaded === true) {
              axios.post(
                `${window.apiLink}videos/upload/${res.data.last_insert_id}`,
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
      'upload-btn': UploadButton,
      PictureInput,
      videoPlayer
    }
  }
</script>
