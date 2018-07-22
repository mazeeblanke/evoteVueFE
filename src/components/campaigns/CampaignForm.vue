<template>
<v-dialog @update:returnValue="handleDialogUpdate" v-model="dialog" max-width="800px">
  <v-card>
    <v-card-title>
      <span class="headline">
        {{ isNewCampaign ? "New Campaign" : "Edit Campaign" }}
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
          <v-flex xs12 sm6 md4>
            <date-picker
              label="Start Date"
              :init-value="editedItem.start_date"
              :error-messages="errors.start_date"
              @change="(date) => editedItem.start_date = date"
            ></date-picker>
          </v-flex>
          <v-flex xs12 sm6 md4>
            <date-picker
              label="End Date"
              :init-value="editedItem.end_date"
              :error-messages="errors.end_date"
              @change="(date) => editedItem.end_date = date"
            ></date-picker>
          </v-flex>
          <v-flex xs12 sm12 md12>
            <v-textarea
              v-model="editedItem.description"
              :error-messages="errors.description"
              label="Description"
              type="text"
              box
              clearable
            ></v-textarea>
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
      >{{ isNewCampaign ? 'Create Campaign' : 'Update Campaign' }}</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>


<script>
import DatePicker from '@/components/shared/DatePicker'

export default {
  components: {
    DatePicker
  },

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
    isNewCampaign () {
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
