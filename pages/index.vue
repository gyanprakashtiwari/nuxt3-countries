<template>
  <main>
    <div class="container">
      <!-- Search Section -->
      <section id="search-container">
        <h1>Countries</h1>
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            class="search-input"
            placeholder="Search countries"
          />
          <button id="search-btn" class="search-btn" @click="search">
            <img src="/assets/icons/mg.png" />
          </button>
        </div>
      </section>

      <!-- Countries Cards Section -->
      <section id="cards-container">
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
            <p class="card-datetime">
              Current Date & Time:
              {{ getCurrentDatetime(country.timezones?.[0]) || "N/A" }}
            </p>
            <div class="card-buttons">
              <button
                class="card-button"
                v-if="country.maps?.googleMaps"
                @click="openMap(country.maps.googleMaps)"
              >
                Show Map
              </button>
              <button class="card-button" @click="viewDetails(country.cca3)">
                Details
              </button>
            </div>
          </div>
        </div>
        <div v-if="filteredCountries.length === 0 && countries.length > 0">
          <p>No countries found.</p>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { getCurrentDatetime } from "@/utils/datetimeUtils";

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

    const openMap = (googleMapsLink) => {
      if (googleMapsLink) {
        window.open(googleMapsLink, "_blank");
      } else {
        alert("Map link not available");
      }
    };

    const viewDetails = (cca3) => {
      navigateTo(`/detail/${cca3}`);
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
      getCurrentDatetime,
    };
  },
};
</script>

<style scoped>
/* General Styling */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

main {
  display: flex;
  justify-content: center;
  width: 100%;
}

.container {
  width: 50%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
}

.common-box-shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#search-container {
  margin-bottom: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border: 1px solid gray;
  border-radius: 4px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  border: none;
  padding: 8px 12px;
  font-size: 16px;
  outline: none;
}

.search-btn {
  border: none;
  background-color: transparent;
  padding: 8px;
  font-size: 20px;
  cursor: pointer;
  color: #000;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: white;
}
.search-btn img {
  background-color: white;
  color: gray;
  height: 35px;
  width: 35px;
}

#cards-container {
  margin-top: 16px;
}

.card {
  display: flex;
  background-color: white;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 10px;
  overflow: hidden;
  border: 1px solid gray;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(222, 218, 218, 0.1);
}

.card-image {
  width: 250px;
  object-fit: cover;
}

.card-content {
  /* padding: 16px; */
  padding-left: 10px;
  padding-right: 10px;
  flex: 1;
}

.card-heading {
  font-size: 20px;
  margin-bottom: 8px;
}

.card-currency,
.card-region {
  font-size: 14px;
  margin-bottom: 8px;
}

.card-buttons {
  display: flex;
  gap: 8px;
  margin-top: 40px;
}

.card-button {
  flex: 1;
  padding: 8px 16px;
  color: #0056b3;
  cursor: pointer;
  transition: background-color 0.3s;
  border: 3px solid blue;
  border-radius: 3px;
  background-color: white;
  font-size: 20px;
  font-weight: 450;
}

.card-button:hover {
  background-color: #0056b3;
  color: #fff;
}
</style>
