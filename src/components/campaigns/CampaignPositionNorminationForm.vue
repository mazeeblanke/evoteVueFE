<template>
<v-dialog @update:returnValue="handleDialogUpdate" v-model="dialog" max-width="800px">
  <v-card>
    <v-card-title>
      <span class="headline">
        Add Norminees
      </span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm12 md12>
            <el-select
              v-model="norminees"
              multiple
              filterable
              remote
              :style="{ width: '100%', background: '#424242' }"
              reserve-keyword
              placeholder="Please enter a keyword"
              :remote-method="fetchUsers"
              :loading="loading">
              <el-option
                v-for="user in userSuggestions"
                :key="user.id"
                :label="user.username"
                :value="user.id">
              </el-option>
            </el-select>
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
      >Add Norminee(s)</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>


<script>
import { mapActions } from 'vuex'

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
    norminees: {
      type: Array,
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
    // isNewCampaignPosition () {
    //   return !!!this.editedItem.created_at
    // }
  },

  data () {
    return {
      userSuggestions: [],
      loading: false
    }
  },

  methods: {
    ...mapActions('user', [
      'loadUsers'
    ]),

    handleDialogUpdate (value) {
      this.close()
      this.$emit('update:dialog', value)
    },

    fetchUsers(query) {
      if (query !== '') {
        this.loading = true;
        this.loadUsers()
        .then((res) => {
          this.userSuggestions = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      } else {
        this.userSuggestions = [];
        this.loading = false
      }
    }
  },

  watch: {
    norminees (newValue) {
      this.$emit('change', newValue)
    }
  }
}
</script>

<style>
.el-input__inner {
  background: #424242
}
</style>

