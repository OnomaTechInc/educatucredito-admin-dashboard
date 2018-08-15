<template> 
  <picture-input 
    ref="pictureInput" 
    width="600" 
    height="600" 
    margin="16" 
    @change="onChange"
    accept="video/mp4,video/png" 
    size="10" 
    buttonClass="btn"
    :customStrings="{
        upload: '<h1>Bummer!</h1>',
        drag: 'Drag photo here'
    }">
    <span>asas</span>
  </picture-input>
</template>
<script>
import PictureInput from 'vue-picture-input'
export default {
  methods: {
    onChange (image) {
      console.log('New video selected!')
      if (image) {
        console.log('Video loaded.')
        this.image = image
      } else {
        console.log('FileReader API not supported: use the <form>, Luke!')
      }
    }
  },
  components: {
    PictureInput
  }
}
</script>
