<template>
  <li>
    <strong>{{ country.name }}</strong>
    <button @click="openMap">Show Map</button>
    <button @click="viewDetails">Detail</button>
  </li>
</template>

<script>
export default {
  props: {
    country: {
      type: Object,
      required: true,
    },
  },
  methods: {
    openMap() {
      const [lat, lng] = this.country.latlng;
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    },
    viewDetails() {
      this.$router.push(`/detail/${this.country.name}`);
    },
  },
};
</script>
