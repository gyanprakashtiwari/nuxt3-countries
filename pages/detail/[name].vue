<template>
  <main>
    <div class="container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading">
        <p>Loading country details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <!-- Country Details Section -->
      <div id="country-details" class="country-details" v-else-if="country">
        <div class="country-header">
          <h2>{{ country.name.common }}</h2>
          <img
            :src="country.flags?.svg || 'https://via.placeholder.com/150'"
            :alt="'Flag of ' + country.name.common"
            class="country-flag"
          />
        </div>
        <div class="details-content">
          <p><strong>Native Name:</strong> {{ nativeName }}</p>
          <p><strong>Capital:</strong> {{ country.capital?.[0] || "N/A" }}</p>
          <p><strong>Region:</strong> {{ country.region }}</p>
          <p><strong>Subregion:</strong> {{ country.subregion || "N/A" }}</p>
          <p><strong>Area:</strong> {{ country.area }} Km<sup>2</sup></p>
          <p><strong>Population:</strong> {{ country.population }}</p>
          <p><strong>Languages:</strong> {{ languages }}</p>
          <p>
            <strong>Country Code:</strong> +{{ country.idd?.root
            }}{{ country.idd?.suffixes?.[0] || "" }}
          </p>
          <p><strong>Currencies:</strong> {{ currencies }}</p>
          <p><strong>Timezones:</strong> {{ country.timezones?.join(", ") }}</p>
          <p>
            <strong>Google Maps:</strong>
            <a :href="googleMapsLink" target="_blank">View on Map</a>
          </p>
        </div>
      </div>

      <!-- Neighbor Countries Section -->
      <div
        id="neighbour-countries"
        class="neighbour-countries"
        v-if="neighbours.length"
      >
        <h3>Neighbour Countries:</h3>
        <div class="flags-container">
          <div
            class="neighbour-flag"
            v-for="neighbour in neighbours"
            :key="neighbour.cca3"
          >
            <img
              :src="neighbour.flags?.svg || 'https://via.placeholder.com/50'"
              :alt="'Flag of ' + neighbour.name.common"
              class="flag-image"
            />
            <p>{{ neighbour.name.common }}</p>
          </div>
        </div>
      </div>

      <!-- No Neighbor Countries Found -->
      <div v-else-if="country && !neighbours.length" class="no-data">
        <p>No neighboring countries found.</p>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const route = useRoute();
    const countryName = route.params.name;

    const country = ref(null);
    const neighbours = ref([]);
    const isLoading = ref(true);
    const error = ref(null);

    const nativeName = computed(() => {
      if (!country.value?.name?.nativeName) return "N/A";
      const nativeNames = Object.values(country.value.name.nativeName);
      return nativeNames.length ? nativeNames[0].common : "N/A";
    });

    const languages = computed(() => {
      if (!country.value?.languages) return "N/A";
      return Object.values(country.value.languages).join(", ");
    });

    const currencies = computed(() => {
      if (!country.value?.currencies) return "N/A";
      return Object.values(country.value.currencies)
        .map((currency) => currency.name)
        .join(", ");
    });

    const googleMapsLink = computed(() => {
      return country.value?.maps?.googleMaps || "#";
    });

    const fetchCountry = async () => {
      isLoading.value = true;
      error.value = null;

      try {
        console.log(countryName);
        const response = await axios.get(
          `https://restcountries.com/v3.1/alpha/${countryName}`
        );
        if (!response.data || !response.data.length) {
          throw new Error("Country not found.");
        }

        country.value = response.data[0];
        console.log(response.data);

        if (country.value.borders?.length) {
          const borderCodes = country.value.borders.join(",");
          const neighbourResponse = await axios.get(
            `https://restcountries.com/v3.1/alpha?codes=${borderCodes}`
          );
          neighbours.value = neighbourResponse.data || [];
        }
      } catch (err) {
        error.value =
          err.response?.data?.message || err.message || "An error occurred.";
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(fetchCountry);

    return {
      country,
      neighbours,
      isLoading,
      error,
      nativeName,
      languages,
      currencies,
      googleMapsLink,
    };
  },
};
</script>

<style>
/* General Styling */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.container {
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  width: 80%;
}

.loading,
.error,
.no-data {
  text-align: center;
  font-size: 18px;
  margin: 20px;
  color: #555;
}

.error {
  color: red;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

/* Country Details Styling */
.country-details {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.country-header {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 50%;
}

.country-header img.country-flag {
  max-width: 500px;
  max-height: 600px;
  object-fit: cover;
}

.country-header h2 {
  font-size: 28px;
  margin: 0;
}

.details-content {
  padding-top: 50px;
  margin-left: 20px;
  text-align: left;
  flex-grow: 1;
  width: 50%;
}

.details-content p {
  margin: 5px 0;
  font-size: 16px;
}

.details-content a {
  color: #007bff;
  text-decoration: none;
}

.details-content a:hover {
  text-decoration: underline;
}

/* Neighbour Countries Styling */
.neighbour-countries {
  margin-top: 20px;
  border: 1px solid black;
  padding: 10px;
}

.flags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.neighbour-flag {
  display: inline-block;
  width: 250px;
  height: 200px;
}

.flag-image {
  width: 100%;
  height: auto;
}
</style>
