<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand>
          <router-link class="custom-router-link"
                       :to="{ name: 'home' }"
          >
            TravelEA
          </router-link>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item>
              <router-link class="custom-router-link" :to="{ name: 'venues' }"> Venues </router-link>
            </b-nav-item>

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template slot="button-content"><em>User</em></template>

              <b-dropdown-item v-if="$cookies.isKey('token')"
                               @click="onProfileClick"
              >Profile</b-dropdown-item>

              <b-dropdown-item v-if="$cookies.isKey('token')"
                               @click="signOut"
              >Log Out</b-dropdown-item>

              <b-dropdown-item v-else
                               @click="signIn"
              >Log in</b-dropdown-item>

            </b-nav-item-dropdown>
          </b-navbar-nav>

        </b-collapse>
      </b-navbar>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
  import authUtils from './utils/authUtils';

  export default {
    name: 'app',

    methods: {
      signIn() {
        this.$router.push({ name: 'home' })
      },

      signOut() {
        this.$cookies.remove('token');
        setTimeout(() => {
          this.$router.push({name: 'home'})
        }, 600);
      },

      onProfileClick() {
        this.$router.push({ name: 'user', params: { userId: authUtils.getAuthedUserId(this) } });
      }
    }
  }
</script>

<style>
  .custom-router-link {
    color: inherit;
  }

  a:hover {
    color: inherit;
  }

</style>
