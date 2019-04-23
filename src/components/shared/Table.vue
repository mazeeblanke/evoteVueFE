<template>
  <v-data-table
    :headers="headers"
    :items="formattedCampaigns"
    :search="search"
    :rows-per-page-items="perPageValues"
    :pagination="pagination"
    :total-items="campaigns.total"
    :loading="loading"
    :headers-length="9"
    @update:pagination="synchronizePagination"
  >
    <template slot="headers" slot-scope="props">
      <tr>
        <th>
          <v-checkbox
            :input-value="props.all"
            :indeterminate="props.indeterminate"
            primary
            hide-details
          ></v-checkbox>
        </th>
        <th v-for="header in props.headers" :key="header.text">{{ header.text }}</th>
        <th>Actions</th>
      </tr>
    </template>
    <template slot="items" slot-scope="props">
      <tr class="capitalize is-clickable" @click.stop="showCampaign(props.item, $event)">
        <td>
          <v-checkbox v-if="props.item.id" :input-value="props.selected" primary hide-details></v-checkbox>
        </td>
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.name }}</td>
        <td>
          <div
            @click="showCampaign(props.item, $event)"
            class="has-truncated-text"
            :style="{ 'width': '230px !important' }"
          >{{ props.item.description }}</div>
        </td>
        <td>{{ props.item.active }}</td>
        <td>{{ props.item.start_date }}</td>
        <td>{{ props.item.end_date }}</td>
        <td>{{ props.item.created_at }}</td>
        <td>
          <template v-if="props.item.id && (!props.item.deleting && !props.item.activating && !props.item.enrolling)">
            <v-menu transition="slide-y-transition" offset-y offset-x>
              <v-icon slot="activator">more_horiz</v-icon>
              <v-list>
                <v-list-tile v-if="userHasAdminRole" @click="editItem(props.item, category)">
                  <v-list-tile-title>Edit</v-list-tile-title>
                </v-list-tile>
                <v-list-tile :disabled="category != 'newCampaigns' || !!props.item.enrolled" @click="_enroll(props.item)">
                  <v-list-tile-title>{{ props.item.enrolled ? 'Already Enrolled' : 'Enroll' }}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile :disabled="category != 'campaigns' || !(props.item.enrolled || {}).verified " @click="$router.push({ name: 'Vote', params: { id: props.item.id } })">
                  <v-list-tile-title>{{ (props.item.enrolled && !props.item.enrolled.verified) ? 'awaiting verification ...' : 'Vote' }}</v-list-tile-title>
                </v-list-tile>
                <v-list-tile :disabled="category == 'newCampaigns'" @click="$router.push({ name: 'VoteResults', params: { id: props.item.id } })">
                  <v-list-tile-title>View Results</v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-if="userHasAdminRole" :disabled="category != 'newCampaigns'" @click="activateCampaign(props.item)">
                  <v-list-tile-title>Set Active</v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-if="userHasAdminRole" @click="$router.push(`${props.item.id}/verifyusers`)">
                  <v-list-tile-title>Verify Users</v-list-tile-title>
                </v-list-tile>
                <v-list-tile v-if="userHasAdminRole" @click="_deleteCampaign(props.item, category)">
                  <v-list-tile-title>Delete</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </template>
          <v-progress-linear
            v-else-if="props.item.id && (props.item.deleting || props.item.activating || props.item.enrolling)"
            :indeterminate="true"
          ></v-progress-linear>
        </td>
      </tr>
    </template>
    <v-alert class="" slot="no-results" :value="true" color="error" icon="warning">
      <div class="">Your search for "{{ search }}" found no results.</div>
    </v-alert>
  </v-data-table>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';


@Component
export default class Table extends Vue {
  @Prop(Array) headers !: any

  @Prop(Boolean) userHasAdminRole !: boolean

  @Prop({ type: Boolean, default: false, required: true }) loading!: boolean

  @Prop() category !: string

  @Prop({ type: Array }) formattedCampaigns !: any

  @Prop({ type: Object }) campaigns !: any

  @Prop({ type: String }) search !: any

  @Prop({ type: Function }) _enroll !: any

  @Prop({ type: Function }) activateCampaign !: any

  @Prop({ type: Function }) showCampaign !: any

  @Prop({ type: Function }) _deleteCampaign !: any

  @Prop({ type: Array }) perPageValues !: Array<number>

  @Prop() pagination !: any

  @Prop() editItem!: any

  @Prop() load!: any

  synchronizePagination(newPagination ) {
    this.$emit('update:pagination', newPagination)
  }

}

</script>

