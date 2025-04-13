<template>
  <div>
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-4"
      :to="{ name: 'home' }"
    >
      Back to Countries
    </v-btn>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" text="Failed to load country details. Please try again."></v-alert>
      </v-col>
    </v-row>

    <template v-else-if="country">
      <v-row>
        <v-col cols="12" md="6">
          <v-img
            :src="country.flags.svg"
            :alt="country.flags.alt || country.name.common + ' flag'"
            class="rounded-lg"
            height="300"
            cover
          ></v-img>
        </v-col>
        
        <v-col cols="12" md="6">
          <h1 class="text-h3 mb-4">{{ country.name.common }}</h1>
          <v-row>
            <v-col cols="12" sm="6">
              <div class="mb-2"><strong>Official Name:</strong> {{ country.name.official }}</div>
              <div class="mb-2"><strong>Capital:</strong> {{ country.capital?.[0] || 'N/A' }}</div>
              <div class="mb-2"><strong>Region:</strong> {{ country.region }}</div>
              <div class="mb-2"><strong>Subregion:</strong> {{ country.subregion || 'N/A' }}</div>
              <div class="mb-2"><strong>Population:</strong> {{ formatPopulation(country.population) }}</div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="mb-2"><strong>Languages:</strong> {{ formatLanguages(country.languages) }}</div>
              <div class="mb-2"><strong>Currencies:</strong> {{ formatCurrencies(country.currencies) }}</div>
              <div class="mb-2"><strong>Area:</strong> {{ formatArea(country.area) }}</div>
              <div class="mb-2">
                <strong>Timezones:</strong>
                <div v-for="timezone in country.timezones" :key="timezone">{{ timezone }}</div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <h2 class="text-h5 mb-3">Border Countries</h2>
          <div v-if="borderCountries.length > 0" class="d-flex flex-wrap gap-2">
            <v-btn
              v-for="border in borderCountries"
              :key="border.cca3"
              :to="{ name: 'country-detail', params: { code: border.cca3 }}"
              variant="outlined"
              size="small"
            >
              {{ border.name.common }}
            </v-btn>
          </div>
          <div v-else>No bordering countries</div>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const route = useRoute()
const country = ref(null)
const borderCountries = ref([])
const loading = ref(true)
const error = ref(null)

const formatPopulation = (population) => {
  return new Intl.NumberFormat().format(population)
}

const formatLanguages = (languages) => {
  return languages ? Object.values(languages).join(', ') : 'N/A'
}

const formatCurrencies = (currencies) => {
  if (!currencies) return 'N/A'
  return Object.values(currencies)
    .map(currency => `${currency.name} (${currency.symbol || 'N/A'})`)
    .join(', ')
}

const formatArea = (area) => {
  return `${new Intl.NumberFormat().format(area)} km²`
}

const fetchCountry = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${props.code}`)
    country.value = response.data[0]
    
    if (country.value.borders?.length > 0) {
      const borderResponse = await axios.get(
        `https://restcountries.com/v3.1/alpha?codes=${country.value.borders.join(',')}`
      )
      borderCountries.value = borderResponse.data
    } else {
      borderCountries.value = []
    }
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCountry()
})

watch(() => props.code, () => {
  fetchCountry()
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
