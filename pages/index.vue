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
          <button id="search-btn" class="search-btn" @click="search">🔍</button>
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

    // Calculate the current date and time based on timezone
    const getCurrentDatetime = (timezone) => {
      const nowUTC = new Date(
        Date.now() + new Date().getTimezoneOffset() * 60 * 1000
      );

      if (timezone && timezone.startsWith("UTC")) {
        try {
          const offset = parseUTCOffset(timezone);
          const localTime = new Date(
            nowUTC.getTime() + offset * 60 * 60 * 1000
          );
          return formatDatetime(localTime);
        } catch (error) {
          return formatDatetime(new Date());
        }
      } else {
        return formatDatetime(new Date());
      }
    };

    // Parse UTC offset string
    const parseUTCOffset = (utcString) => {
      const match = utcString.match(/^UTC([+-]\d{2}):(\d{2})$/);
      if (!match) {
        throw new Error(`Invalid UTC format: ${utcString}`);
      }

      const sign = match[1][0] === "+" ? 1 : -1;
      const hours = parseInt(match[1].slice(1), 10);
      const minutes = parseInt(match[2], 10);

      return sign * (hours + minutes / 60);
    };

    // Format date and time as "29th Dec 2024, 14:20"
    const formatDatetime = (date) => {
      const day = date.getDate();
      const month = date.toLocaleString("en-GB", { month: "short" });
      const year = date.getFullYear();
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      const ordinalSuffix = getOrdinalSuffix(day);
      return `${day}${ordinalSuffix} ${month} ${year}, ${hour}:${minute}`;
    };

    // Get ordinal suffix for a day
    const getOrdinalSuffix = (day) => {
      const dayInt = parseInt(day, 10);
      if ([11, 12, 13].includes(dayInt % 100)) {
        return "th";
      }
      switch (dayInt % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

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
  width: 60%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
}

.common-box-shadow {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Search Section Styling */
#search-container {
  margin-bottom: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border: 1px solid #000;
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
  background-color: #f0f0f0;
}

/* Cards Section Styling */
#cards-container {
  margin-top: 16px;
}

.card {
  display: flex;
  background-color: #fff;
  margin: 20px 0;
  padding: 10px;
  border: 1px solid #000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 250px;
  object-fit: cover;
}

.card-content {
  flex: 1;
  padding: 0 10px;
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
  margin-top: 20px;
}

.card-button {
  flex: 1;
  padding: 8px 16px;
  border: 2px solid #0056b3;
  background-color: #fff;
  color: #0056b3;
  cursor: pointer;
  transition: background-color 0.3s;
}

.card-button:hover {
  background-color: #0056b3;
  color: #fff;
}
</style>
