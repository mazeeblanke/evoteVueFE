<template>
  <div>
    <v-menu
      :nudge-right="40"
      lazy
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px"
    >
      <v-text-field
        slot="activator"
        v-model="value"
        :label="label"
        :error-messages="errorMessages"
        box
        prepend-icon="event"
        readonly
      ></v-text-field>
      <v-date-picker
        @input="(value) => this.$emit('change', value)"
        v-model="value"
      ></v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    initValue: {
      type: String
    },

    errorMessages: {
      type: Array
    },

    label: {
      type: String,
      default: 'Date'
    }
  },

  mounted () {
    this.value = this.initValue
  },

  data () {
    return {
      // showDatePicker: false,
      value: null
    }
  }
}
</script>

