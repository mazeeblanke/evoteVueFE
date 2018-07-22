<template>
<v-dialog @update:returnValue="handleDialogUpdate" v-model="dialog" max-width="800px">
  <v-card>
    <v-card-title>
      <span class="headline">
        {{ isNewCampaignPosition ? "New Campaign Position" : "Edit Campaign Position" }}
      </span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm6 md4>
            <v-text-field
              v-model="editedItem.name"
              label="Name"
              box
              clearable
              :error-messages="errors.name"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6 md8>
            <v-text-field
              v-model="editedItem.description"
              label="Description"
              box
              clearable
              :error-messages="errors.name"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        @click.native="close"
      >Cancel</v-btn>
      <v-btn
        depressed
        :loading="saving"
        @click.native="save"
      >{{ isNewCampaignPosition ? 'Create Campaign Position' : 'Update Campaign position' }}</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>


<script>
export default {
  props: {
    close: {
      type: Function,
      required: true
    },
    save: {
      type: Function,
      required: true
    },
    editedItem: {
      type: Object,
      required: true
    },
    errors: {
      type: Array,
      required: true
    },
    dialog: {
      type: Boolean,
      required: true
    },
    saving: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    isNewCampaignPosition () {
      return !!!this.editedItem.created_at
    }
  },

  methods: {
    handleDialogUpdate (value) {
      this.close()
      this.$emit('update:dialog', value)
    }
  },

  watch: {
    editedItem (newValue) {
      this.$emit('change', newValue)
    }
  }
}
</script>
