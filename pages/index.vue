<template>
  <main>
    <div class="container">
      <!-- Search Container -->
      <div id="search-container">
        <h1>Countries</h1>
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            class="search-input"
            placeholder="Search countries"
          />
          <button id="search-btn" class="search-btn" @click="search">
            &#128269;
          </button>
        </div>
      </div>

      <!-- Cards Container -->
      <div id="cards-container">
        <div
          v-for="country in filteredCountries"
          :key="country.cca3"
          class="card common-box-shadow"
        >
          <img
            :src="country.flags?.png || 'https://via.placeholder.com/150'"
            :alt="'Flag of ' + country.name.common"
            class="card-image"
          />
          <div class="card-content">
            <h2 class="card-heading">{{ country.name.common }}</h2>
            <p class="card-currency">
              Currency:
              {{
                country.currencies
                  ? Object.keys(country.currencies).join(", ")
                  : "N/A"
              }}
            </p>
            <p class="card-datetime">Region: {{ country.region }}</p>
            <div class="card-buttons">
              <button class="card-button" @click="openMap(country.latlng)">
                Show Map
              </button>
              <button class="card-button" @click="viewDetails(country.cca3)">
                Detail
              </button>
            </div>
          </div>
        </div>
        <div v-if="filteredCountries.length === 0 && countries.length > 0">
          <p>No countries found.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const countries = ref([]);
    const searchQuery = ref("");

    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        countries.value = response.data;
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    const filteredCountries = computed(() =>
      countries.value.filter((country) =>
        country.name.common
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      )
    );

    const openMap = (latlng) => {
      if (latlng) {
        const [lat, lng] = latlng;
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
      } else {
        alert("Location not available");
      }
    };

    const viewDetails = (name) => {
      navigateTo(`/detail/${name}`);
    };

    const search = () => {
      console.log(`Searching for: ${searchQuery.value}`);
    };

    onMounted(fetchCountries);

    return {
      countries,
      searchQuery,
      filteredCountries,
      openMap,
      viewDetails,
      search,
    };
  },
};
</script>

<style scoped>
/* Body Styling */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh; /* Full height of the viewport */
}

main {
  width: 100%; /* Ensure the main section takes up the full width */
  display: flex;
  justify-content: center; /* Center content horizontally */
}

.container {
  width: 60%; /* 60% of the screen width */
  height: 100vh; /* Full height of the viewport */
  background-color: #fff; /* White background for the container */
  display: flex;
  flex-direction: column;
}

.common-box-shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add box-shadow */
}

/* Search container to align elements */
.search-container {
  display: flex;
  align-items: center;
  border: 1px solid black;
  overflow: hidden;
  margin-bottom: 10px;
}

/* Input field styling */
.search-input {
  border: none;
  padding: 8px 12px;
  font-size: 16px;
  outline: none;
  flex: 1;
}

/* Button styling with magnifying glass */
.search-btn {
  background-color: white;
  border: none;
  padding: 8px;
  font-size: 20px;
  cursor: pointer;
  background-color: transparent;
  color: black;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #f0f0f0;
}

#cards-container {
  margin-top: 16px;
}
#search-container {
  margin-bottom: 1px;
}
/* Card container styling */
.card {
  display: flex;
  background-color: white;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 10px;
  overflow: hidden;
  border: 1px solid black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Image styling */
.card-image {
  width: 250px;
  object-fit: cover;
}

/* Card content area styling */
.card-content {
  padding-left: 10px;
  padding-right: 10px;
  flex: 1;
}

/* Heading styling */
.card-heading {
  font-size: 20px;
  margin-bottom: 8px;
}

/* Currency and date-time styling */
.card-currency,
.card-datetime {
  font-size: 14px;
  margin-bottom: 8px;
}

/* Button styling */
.card-buttons {
  display: flex;
  gap: 8px;
  margin-top: 40px;
}

.card-button {
  padding: 8px 16px;
  border: 2px solid blue;
  background-color: white;
  color: blue;
  cursor: pointer;
  flex: 1;
  transition: background-color 0.3s;
}

.card-button:hover {
  background-color: #0056b3;
  color: white;
}
</style>
