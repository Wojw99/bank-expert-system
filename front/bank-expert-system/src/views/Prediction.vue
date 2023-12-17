<template>
  <div :style="{ width: '100%', height: '100vh' }">
    <h1>Prediction</h1>

    <div id="form">
      <div v-for="(details, columnName) in settings" :key="columnName" class="form-row">
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label :for="getColumnId(columnName)" class="label">{{ columnName }}</label>
        <input
          :type="getInputType(details)"
          :id="getColumnId(columnName)"
          v-model="inputValues[columnName]"
          class="input"
        />
      </div>
      <br>
      <div class="button-container">
        <button @click="SignIn">Enter</button>
        <button @click="clearInputs">Clear All</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-row {
  margin-bottom: 10px;
}

.label {
  margin-right: 10px;
}

.button-container {
  margin-top: 20px;
}

button {
  margin-right: 40px;
}
</style>

<script>
export default {
  name: 'PredictionPanel',
  data() {
    return {
      settings: {},
      inputValues: {},
    };
  },
  mounted() {
    this.fetchSettings();
    this.setDefaultDateValues(); // Call the method to set default date values
  },
  methods: {
    async fetchSettings() {
      try {
        const response = await fetch('http://localhost:3000/settings/all');
        const { settings } = await response.json();

        // Update the component's data with the received settings
        this.settings = settings;

        // Initialize inputValues with default values
        this.setDefaultDateValues();
      } catch (error) {
        console.error('Error fetching settings:', error.message);
      }
    },
    getColumnId(columnName) {
      return `column_${columnName}`;
    },
    getInputType(details) {
      // Mapping column types to input types
      const columnTypeMap = {
        int: 'number',
        category: 'text',
        date: 'date',
      };

      // Return the corresponding input type or default to 'text'
      return columnTypeMap[details.type] || 'text';
    },
    SignIn() {
      // Handle form submission
      console.log('Form submitted with values:', this.inputValues);
    },
    clearInputs() {
      // Clear all input values
      this.setDefaultDateValues();
    },
    setDefaultDateValues() {
      Object.keys(this.settings).forEach((columnName) => {
        if (columnName === 'day') {
            const currentDay = new Date().getDate();
            this.inputValues[columnName] = currentDay;
          } else if (columnName === 'month') {
            const currentMonth = new Date().getMonth() + 1;
            this.inputValues[columnName] = currentMonth;
          }
      });
    },
  },
};
</script>
