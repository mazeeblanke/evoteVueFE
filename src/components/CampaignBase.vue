<template>
  <v-container :fluid="true" :fill-height="false">
    <v-layout align-center justify-center>
      <v-flex xs12>
        <v-breadcrumbs divider="/">
          <v-breadcrumbs-item
            :to="{ name: isNaN(parseInt(route)) === false ? 'Campaign' : _UCFIRST(route), params: { id: ($route.params || {}).id } }"
            active-class="is-white"
            ripple
            v-for="route in $route.path.split('/').filter(r => r)"
            :key="route"
            class="capitalize"
          >{{  _UCFIRST(route) }}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <router-view></router-view>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
// import _ from "lodash";
// import CampaignForm from "../components/campaigns/CampaignForm.vue";
// import { namespace } from "vuex-class";
import { Component, Vue, Watch } from "vue-property-decorator";
// import Swal from "sweetalert2";
// import Table from './shared/Table.vue';

// const campaign = namespace("campaign");
// const user = namespace("user");
// const app = namespace("app");
import { UCFIRST } from "../utils/helpers";

@Component({
  // components: {
  //   CampaignForm,
  //   Table
  // }
})
export default class CampaignBase extends Vue {
  // activeTab: string ='Active Campaigns';
  // loading: boolean = false;
  // loadingCompletedCampaign: boolean = false;
  // loadingNewCampaign: boolean = false;
  // saving: boolean = false;
  // snackbar: boolean = false;
  // dialog: boolean = false;
  // total: number = 0;
  // snackbarText: any = null;
  // editedIndex: any = null;
  // editedItem: any = null;
  // search: any = null;
  // perPageValues = [9];
  // errors = [];
  // headers = [
  //   {
  //     text: "ID"
  //   },
  //   {
  //     text: "Name"
  //   },
  //   {
  //     text: "Description"
  //   },
  //   {
  //     text: "Status"
  //   },
  //   {
  //     text: "Start Date"
  //   },
  //   {
  //     text: "End Date"
  //   },
  //   {
  //     text: "Created At"
  //   }
  // ];
  // pagination: { rowsPerPage: number; page: number; confirmed: boolean } = {
  //   rowsPerPage: 9,
  //   page: 1,
  //   confirmed: true
  // };
  // completedCampaignPagination: { rowsPerPage: number; page: number; confirmed: boolean } = {
  //   rowsPerPage: 9,
  //   page: 1,
  //   confirmed: true
  // };
  // newCampaignPagination: { rowsPerPage: number; page: number; confirmed: boolean } = {
  //   rowsPerPage: 9,
  //   page: 1,
  //   confirmed: true
  // };
  // filter = {
  //   limit: 9,
  //   page: 1,
  //   search: null,
  //   active: 1
  //   // confirmed: false
  // };

  // @campaign.State campaigns;
  // @campaign.State completedCampaigns;
  // @campaign.State newCampaigns;
  // @user.State user;

  // @user.Getter userHasAdminRole;

  // @campaign.Action loadCampaigns;
  // @campaign.Action updateCampaign;
  // @campaign.Action createCampaign;
  // @campaign.Action deleteCampaign;
  // @campaign.Action setActiveCampaign;
  // @campaign.Action enroll;

  // @app.Mutation TOGGLE_SNACKBAR;

  // get formattedCampaigns() {
  //   let length = this.campaigns.data.length;
  //   let pageSize = this.pagination.rowsPerPage || 0;
  //   let emptyRowsLength = Math.abs(pageSize - length);
  //   return [...this.campaigns.data, ...Array(emptyRowsLength).fill({})].slice(
  //     0,
  //     pageSize
  //   );
  // }

  // get formattedCompletedCampaigns () {
  //   let length = this.completedCampaigns.data.length;
  //   let pageSize = this.pagination.rowsPerPage || 0;
  //   let emptyRowsLength = Math.abs(pageSize - length);
  //   return [...this.completedCampaigns.data, ...Array(emptyRowsLength).fill({})].slice(
  //     0,
  //     pageSize
  //   );
  // }

  // get formattedNewCampaigns () {
  //   let length = this.newCampaigns.data.length;
  //   let pageSize = this.pagination.rowsPerPage || 0;
  //   let emptyRowsLength = Math.abs(pageSize - length);
  //   return [...this.newCampaigns.data, ...Array(emptyRowsLength).fill({})].slice(
  //     0,
  //     pageSize
  //   );
  // }

  _UCFIRST(word) {
    return UCFIRST(word);
  }

  // showCampaign(campaign, event) {
  //   if (campaign.deleting || event.target.localName !== "td" || !campaign.id)
  //     return;

  //    if (!this.userHasAdminRole) {
  //      this.TOGGLE_SNACKBAR({
  //         msg: "User does not have permission to perform that action !",
  //         color: "error"
  //       });
  //      return;
  //    }
  //   this.$router.push(`/dashboard/campaigns/${parseInt(campaign.id, 10)}`);
  // }

  // showCampaignForm() {
  //   this.editedItem = {
  //     active: 0
  //   };
  //   this.dialog = true;
  // }

  // close() {
  //   this.dialog = false;
  //   setTimeout(() => {
  //     this.editedItem = {};
  //     this.editedIndex = -1;
  //   }, 300);
  // }

  // editItem(campaign, category = "campaigns") {
  //   this.editedIndex = this[category].data.indexOf(campaign);
  //   this.editedItem = Object.assign({}, campaign, { category } );
  //   this.dialog = true;
  // }

  // updateSearchQuery(e) {
  //   _.debounce(() => {
  //     this.search = e.target.value;
  //   }, 500)();
  // }

  // _enroll(campaign) {
  //   let payload = {
  //     campaignId: campaign.id,
  //     userId: this.user.id
  //   };
  //   this.enroll(payload)
  //     .then(res => {
  //       this.TOGGLE_SNACKBAR({
  //         msg: res.message,
  //         color: "success"
  //       });
  //     })
  //     .catch(err => {
  //       // this.$set(campaign, 'activating', false)
  //       console.log(err);
  //       this.TOGGLE_SNACKBAR({
  //         msg: `${err.response.data.message}`,
  //         color: "error"
  //       });
  //     });
  // }

  // activateCampaign(campaign) {
  //   Swal({
  //     // title: 'Are you sure you want to Activate this campaign?',
  //     title: "Are you sure ?",
  //     text: "This would activate this campaign!",
  //     type: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes"
  //   }).then(result => {
  //     if (result.value) {
  //       this.$set(campaign, "activating", true);
  //       // console.log(campaign)
  //       this.setActiveCampaign({ campaignId: campaign.id })
  //         .then(res => {
  //           this.$set(campaign, "activating", false);
  //           this.TOGGLE_SNACKBAR({
  //             msg: res.message,
  //             color: "success"
  //           });
  //         })
  //         .catch(err => {
  //           this.$set(campaign, "activating", false);
  //           this.TOGGLE_SNACKBAR({
  //             msg: `${err.response.data.message}`,
  //             color: "error"
  //           });
  //         });
  //     }
  //   });
  // }

  // save() {
  //   this.saving = true;
  //   const doAction = this.editedItem.created_at
  //     ? this.updateCampaign
  //     : this.createCampaign;
  //   doAction(this.editedItem)
  //     .then(() => {
  //       this.close();
  //       this.snackbarText = this.editedItem.created_at
  //         ? "Succesfully updated campaign!"
  //         : "Succesfully created campaign!";
  //       this.TOGGLE_SNACKBAR({
  //         msg: this.snackbarText,
  //         color: "success"
  //       });
  //       // this.snackbar = true
  //       this.saving = false;
  //       this.errors = [];
  //       this.campaigns.total += 1;
  //     })
  //     .catch(err => {
  //       this.saving = false;
  //       // console.log(err.response.data)
  //       this.errors = err.response.data.message;
  //       this.TOGGLE_SNACKBAR({
  //         msg: this.errors[0],
  //         color: "success"
  //       });
  //     });
  // }

  // _deleteCampaign(campaign, category = "campaigns") {
  //   Swal({
  //     title: "Are you sure?",
  //     text: "You want to delete this campaign (s)!",
  //     type: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes"
  //   }).then(result => {
  //     if (result.value) {
  //       this.$set(campaign, "deleting", true);
  //       this.deleteCampaign({ id: campaign.id, category })
  //         .then(res => {
  //           this.TOGGLE_SNACKBAR({
  //             msg: res.message,
  //             color: "success"
  //           });
  //         })
  //         .catch(() => {
  //           this.TOGGLE_SNACKBAR({
  //             msg: "An error occured!",
  //             color: "error"
  //           });
  //         });
  //     }
  //   });
  // }

  // loadCompletedCampaignPagination () {
  //   if (this.loadingCompletedCampaign) return;
  //   this.loadingCompletedCampaign = true;
  //   const { page, rowsPerPage, confirmed } = this.completedCampaignPagination;
  //   this.loadCampaigns({
  //     limit: rowsPerPage,
  //     page,
  //     search: this.search || null,
  //     completed: 1
  //     // confirmed
  //    })
  //     .then(() => {
  //       this.loadingCompletedCampaign = false;
  //     })
  //     .catch(err => {
  //       this.loadingCompletedCampaign = false;
  //       if (err.response.status === 401) {
  //         this.TOGGLE_SNACKBAR({
  //           msg: `${err.response.data.message}`,
  //           color: "error",
  //           position: "top",
  //           multiLine: false
  //         });
  //       }
  //     });
  // }

  // loadNewCampaignPagination() {
  //   if (this.loadingNewCampaign) return;
  //   this.loadingNewCampaign = true;
  //   const { page, rowsPerPage, confirmed } = this.newCampaignPagination;

  //    this.loadCampaigns({
  //     limit: rowsPerPage,
  //     page,
  //     search: this.search || null,
  //     new: 1
  //     // confirmed
  //    })
  //     .then(() => {
  //       this.loadingNewCampaign = false;
  //     })
  //     .catch(err => {
  //       this.loadingNewCampaign = false;
  //       if (err.response.status === 401) {
  //         this.TOGGLE_SNACKBAR({
  //           msg: `${err.response.data.message}`,
  //           color: "error",
  //           position: "top",
  //           multiLine: false
  //         });
  //       }
  //     });
  // }

  // loadActiveCampaignPagination() {
  //   if (this.loading) return;
  //   this.loading = true;
  //   const { page, rowsPerPage, confirmed } = this.pagination;

  //   this.filter = {
  //     limit: rowsPerPage,
  //     page,
  //     search: this.search || null,
  //     active: 1
  //     // confirmed
  //   };

  //   this.loadCampaigns(this.filter)
  //     .then(() => {
  //       this.loading = false;
  //     })
  //     .catch(err => {
  //       this.loading = false;
  //       if (err.response.status === 401) {
  //         this.TOGGLE_SNACKBAR({
  //           msg: `${err.response.data.message}`,
  //           color: "error",
  //           position: "top",
  //           multiLine: false
  //         });
  //       }
  //     });
  // }

  // @Watch("completedCampaignPagination", { deep: true })
  // completedCampaignPaginationHandler() {
  //   this.loadCompletedCampaignPagination();
  // }

  // @Watch("newCampaignPagination", { deep: true })
  // newCampaignPaginationHandler() {
  //   this.loadNewCampaignPagination();
  // }

  // @Watch("pagination", { deep: true, immediate: true })
  // paginationHandler() {
  //   this.loadActiveCampaignPagination()
  // }


}
</script>

<style scoped>
</style>
