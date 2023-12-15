<template>
  <div :style="{ width: '100%', height: '100vh' }">
    <h1>prediction</h1>

    <div id="form">
      <div v-for="(column, index) in csvColumns" :key="index" class="form-row">
        <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
        <label :for="getColumnId(index)" class="label">{{ column }}</label>
        <input
          :type="getInputType(column)"
          :id="getColumnId(index)"
          v-model="inputValues[column]"
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
  margin-bottom: 10px; /* Adjust the margin as needed */
}

.label {
  margin-right: 10px; /* Adjust the margin as needed */
}

.button-container {
  margin-top: 20px; /* Adjust the margin as needed */
}

button {
  margin-right: 40px; /* Adjust the margin as needed */
}
</style>

<script>
export default {
  name: 'PredictionPanel',
  data() {
    return {
      csvColumns: [
        'age', 'job', 'marital', 'education', 'default',
        'balance', 'housing', 'contact', 'day', 'month',
        'duration', 'campaign', 'pdays', 'previous', 'poutcome', 'deposit',
      ],
      inputValues: {},
    };
  },
  methods: {
    getColumnId(index) {
      return `column_${index}`;
    },
    getInputType(column) {
      // Mapping column names to input types
      const columnTypeMap = {
        age: 'number',
        job: 'text',
        marital: 'text',
        education: 'text',
        default: 'text',
        balance: 'number',
        housing: 'text',
        contact: 'text',
        day: 'number',
        month: 'text',
        duration: 'number',
        campaign: 'number',
        pdays: 'number',
        previous: 'number',
        poutcome: 'text',
        deposit: 'text',
      };

      // Return the corresponding input type or default to 'text'
      return columnTypeMap[column] || 'text';
    },
    SignIn() {
      // Handle form submission
      console.log('Form submitted with values:', this.inputValues);
    },
    clearInputs() {
      // Clear all input values
      this.inputValues = {};
    },
  },
};
</script>
