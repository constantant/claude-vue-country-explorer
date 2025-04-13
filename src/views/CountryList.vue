<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="searchQuery"
          label="Search countries"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="selectedRegion"
          :items="regions"
          label="Filter by region"
          variant="outlined"
          hide-details
          clearable
        ></v-select>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" text="Failed to load countries. Please try again."></v-alert>
      </v-col>
    </v-row>

    <v-row v-else-if="filteredCountries.length === 0">
      <v-col cols="12">
        <v-alert type="info" text="No countries found matching your criteria."></v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="country in filteredCountries" :key="country.cca3" cols="12" sm="6" md="4" lg="3">
        <v-card
          :to="{ name: 'country-detail', params: { code: country.cca3 }}"
          class="h-100"
        >
          <v-img
            :src="country.flags.svg"
            :alt="country.flags.alt || country.name.common + ' flag'"
            height="160"
            cover
          ></v-img>
          <v-card-title class="text-truncate">{{ country.name.common }}</v-card-title>
          <v-card-text>
            <div><strong>Capital:</strong> {{ country.capital?.[0] || 'N/A' }}</div>
            <div><strong>Region:</strong> {{ country.region }}</div>
            <div><strong>Population:</strong> {{ formatPopulation(country.population) }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const countries = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const selectedRegion = ref(null)

const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

const filteredCountries = computed(() => {
  return countries.value
    .filter(country => {
      const matchesSearch = country.name.common.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesRegion = !selectedRegion.value || country.region === selectedRegion.value
      return matchesSearch && matchesRegion
    })
    .sort((a, b) => a.name.common.localeCompare(b.name.common))
})

const formatPopulation = (population) => {
  return new Intl.NumberFormat().format(population)
}

const fetchCountries = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get('https://restcountries.com/v3.1/all')
    countries.value = response.data
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCountries()
})
</script>
