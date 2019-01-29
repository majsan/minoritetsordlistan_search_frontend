<template>
  <div class="row view">
    <div class="col-12">
      <div class="row info-text">
        <div class="col-12">
          Välj ett sakområde för att kunna söka.
        </div>
      </div>
      <div class="row fish-icon">
        <div class="col-12">
          <icon scale="11" name="fish"></icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mix from '../mix'
export default {
  mixins: [mix],
  name: 'NoSearchResult',
  data () {
    return {
    }
  }
}
</script>

<style>
.view {
  padding: 10px;
}
.fish-icon {
  text-align: center;
  color: rgb(138, 208, 219);
}
.info-text {
  text-align: center;
  color: hsl(0, 0%, 60%);
}
</style>
