<template>
  <div :style="{ width: '100%', height: '100vh' }">
    <h1>Prediction</h1>

    <div id="form">
      <div v-for="(details, columnName) in settings" :key="columnName" class="form-row">
        <label :for="getColumnId(columnName)" class="label">{{ columnName }}
          <!-- Use a select dropdown for category types -->
          <select
          v-if="details.type === 'category'"
          :id="getColumnId(columnName)"
          v-model="inputValues[columnName]"
          class="input"
        >
          <option v-for="option in details.posibilities"
          :key="option" :value="option">{{ option }}</option>
        </select>
        <!-- Use the appropriate input type for other types -->
        <input
          v-else
          :type="getInputType(details)"
          :id="getColumnId(columnName)"
          v-model="inputValues[columnName]"
          class="input"
        />
        </label>
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

/* Add styles for browsers that don't support 'appearance' property */
.input::-webkit-inner-spin-button,
.input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.input {
  appearance: none;
  -moz-appearance: textfield;
  width: 200px;
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
      const columnTypeMap = {
        int: 'number',
        category: 'text',
        date: 'date',
      };
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
          // Set default value for the "month" input
          this.inputValues[columnName] = this.getDefaultMonth();
        }
      });
    },

    getDefaultMonth() {
      // Get the current month as a three-letter abbreviation (e.g., "jan", "feb")
      const months = [
        'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
      ];
      const currentMonth = new Date().getMonth();
      return months[currentMonth];
    },
  },
};
</script>
