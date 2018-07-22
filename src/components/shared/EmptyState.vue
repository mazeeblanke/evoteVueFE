<template>
  <div class="EmptyState">
    <div class="empty-icon is-h-centered">
      <!-- <figure class="image.is-96x96"> -->
        <img src="../../../static/warning.svg">
      <!-- </figure> -->
    </div>
    <p class="empty-text"> {{ emptyText }} </p>
  </div>
</template>

<script>

export default {
  props: {
    emptyText: {
      type: String,
      default: 'Nothing here yet'
    },
    emptyTextSubtitle: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="sass">
  .EmptyState
    width: 400px
    margin: 0 auto
    padding: 60px 0
    text-align: center

    display: flex
    justify-content: center
    flex-direction: column

  .empty-icon svg
    width: 80px

  .empty-text
    padding-top: 20px
    font-weight: 500
</style>
