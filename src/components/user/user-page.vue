<template>
  <div style="text-align:center; margin:16px 0">
    <Page show-sizer show-total :total="total"></Page>
  </div>
</template>

<script>
export default {
  name: 'user-page',
  props: ['total'],
  data () {
    return {}
  }
}
</script>

<style scoped>

</style>
