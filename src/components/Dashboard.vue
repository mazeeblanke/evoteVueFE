<template>
  <v-app id="inspire" dark>
    <Sidebar></Sidebar>
    <Navbar></Navbar>
    <v-content>
        <v-container fill-height>
        <v-layout justify-center align-center>
            <v-flex shrink>
            <router-view></router-view>
            </v-flex>
        </v-layout>
        </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';

export default {
    components: {
        Navbar,
        Sidebar
    },
    data: () => ({

    }),
    props: {
        source: String
    }
}
</script>
