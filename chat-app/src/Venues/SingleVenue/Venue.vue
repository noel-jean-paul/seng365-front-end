<template>
  <div id='venue' v-if="venue">

    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <b-row>
      <b-col class="ml-4" cols="4">
        <VenueDetails :venue="venue" class="mt-4"/>
        <b-button class="mt-4"
                  variant="primary"
                  @click="showEditModal = !showEditModal"
                  v-if="isAdmin"
        > Edit Venue </b-button>

        <b-button class="mt-4"
                  variant="secondary"
                  @click="showReviewModal = !showReviewModal"
                  v-if="reviewable"
        > Add Review </b-button>
      </b-col>

      <b-col cols="4">
        <VenuePhotos :venue="venue" :isAdmin=isAdmin class="mt-4" @reload-required="refreshData"/>
      </b-col>

      <b-col cols="3">
        <Reviews :venueId="$route.params.venueId"
                 :tableReviews="tableReviews"
        />
      </b-col>
    </b-row>

    <b-modal v-model="showEditModal"
             title="Edit Venue"
             hide-footer
    >
      <CreateVenue @close-reload="onVenueEdited"
                   :venue="venue"
                   :editMode="true"
                   :venueId="$route.params.venueId"
      />
    </b-modal>

    <b-modal v-model="showReviewModal"
             title="Add Review"
             hide-footer
    >
      <CreateReview @close-reload="onReviewEdited"
                    :venueId="$route.params.venueId"
      />
    </b-modal>

  </div>

</template>

<script>
  import VenueDetails from './VenueDetails';
  import VenuePhotos from './VenuePhotos';
  import authUtils from '../../utils/authUtils';
  import CreateVenue from '../CreateVenue';
  import CreateReview from './CreateReview';
  import Reviews from './Reviews';

  export default {
    name: "Venue",

    components: {
      VenueDetails,
      VenuePhotos,
      CreateVenue,
      CreateReview,
      Reviews
    },

    data() {
      return {
        venue: null,
        error: '',
        errorFlag: false,
        isAdmin: false,
        showEditModal: false,
        reviewable: false,
        reviews: [],
        showReviewModal: false,
        tableReviews: []
      }
    },

    mounted() {
      this.refreshData();
    },

    methods: {
      onReviewEdited() {
        this.showReviewModal = false;
        this.refreshData();
      },

      onVenueEdited() {
        this.showEditModal = false;
        this.refreshData();
      },

      refreshData() {
        return this.getVenueData()
          .then((venue) => {
            this.venue = venue;
            this.isAdmin = authUtils.isAuthenticated(this, venue.admin.userId);

            // must not be admin, must be authenticated, must not have posted a review for the venue
            this.reviewable = !this.isAdmin && this.$cookies.isKey('token') && !this.userHasReviewedVenue();
          })
      },

      userHasReviewedVenue() {
        const hasReviewed = this.reviews.find((review) =>
        { return review.reviewAuthor.userId === authUtils.getAuthedUserId(this)});
        return hasReviewed;
      },

      getVenueData() {
        return Promise.all([
          this.getAllVenues(),
          this.getVenue(),
          this.getReviews()
        ])
          .then((result) =>{
            const venues = result[0];
            let singleVenue = result[1];
            this.reviews = result[2];

            for (const venue of venues) {
              const id = venue.venueId.toString();
              const routeId = this.$route.params.venueId;
              if (id === routeId) {  // venueId is a string if you reload but num in you come from another page
                singleVenue = { ...venue, ...singleVenue};
                break;
              }
            }

            return singleVenue;
          });
      },

      getAllVenues() {
        return this.axios.get(`${this.$baseUrl}/venues`)
          .then((res) => {
            return res.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getVenue() {
        return this.axios.get(this.$baseUrl + '/venues/' + this.$route.params.venueId)
          .then((res) => {
            return res.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getReviews() {
        return this.axios.get(`${this.$baseUrl}/venues/${this.$route.params.venueId}/reviews`)
          .then((res) => {
            this.updateTableReviews(res.data);
            return res.data;
          })
      },

      updateTableReviews(reviews) {
        let rows = [];
        for (const review of reviews) {
          const row = {
            review: review.reviewBody,
            star_rating: review.starRating,
            cost_rating: review.costRating,
            author: {
              username: review.reviewAuthor.username,
              userId: review.reviewAuthor.userId
            },
            time_posted: review.timePosted
          };
          rows.push(row);
        }
        this.tableReviews = rows;
      }
    }
  }
</script>

<style scoped>

</style>
