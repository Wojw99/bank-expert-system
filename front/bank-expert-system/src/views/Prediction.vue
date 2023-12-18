<template>
  <div :style="{ width: '100%', height: '100vh' }">
    <h1>Prediction</h1>

    <div id="form">
      <div v-for="(details, columnName) in settings" :key="columnName" class="form-row">
        <label :for="getColumnId(columnName)" class="label">{{ columnName }}
          <template v-if="details.type === 'category'">
            <select :id="getColumnId(columnName)"
            v-model="inputValues[columnName]" class="input">
              <option v-for="option in details.posibilities"
              :key="option" :value="option">{{ option }}</option>
            </select>
          </template>
          <template v-else>
            <input :type="getInputType(details)"
            :id="getColumnId(columnName)" v-model="inputValues[columnName]"
              class="input" @input="handleInput(columnName)" />
            <!-- Display validation alert if there's an error -->
            <p v-if="hasValidationError(columnName)" class="error-text">
              {{ getValidationError(columnName) }}
            </p>
          </template>
        </label>
      </div>
      <div class="button-container">
        <button @click="SignIn">Enter</button>
        <button @click="clearInputs">Clear All</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'PredictionPanel',
  setup() {
    const settings = ref({});
    const inputValues = ref({});
    const validationErrors = ref({});

    const getColumnId = (columnName) => `column_${columnName}`;

    const getInputType = (details) => {
      const columnTypeMap = {
        int: 'number',
        category: 'text',
        date: 'date',
      };
      return columnTypeMap[details.type] || 'text';
    };

    const validateInput = (columnName) => {
      const value = inputValues.value[columnName];
      const details = settings.value[columnName];
      const errors = [];

      if (details && details.type === 'int') {
        const isInteger = /^\d+$/.test(value);

        if (!isInteger) {
          errors.push('Please enter a valid integer value.');
        } else {
          const minValue = details.min;
          const maxValue = details.max;

          if (minValue !== null && parseInt(value, 10) < parseInt(minValue, 10)) {
            errors.push(`Value should be greater than or equal to ${minValue}.`);
          }
          if (maxValue !== null && parseInt(value, 10) > parseInt(maxValue, 10)) {
            errors.push(`Value should be less than or equal to ${maxValue}.`);
          }
        }
      }

      // Update validation errors for the current column
      validationErrors.value = {
        ...validationErrors.value,
        [columnName]: errors,
      };

      // Clear validation errors for other columns
      Object.keys(settings.value).forEach((name) => {
        if (name !== columnName) {
          validationErrors.value = {
            ...validationErrors.value,
            [name]: [],
          };
        }
      });
    };

    const handleInput = (columnName) => {
      validateInput(columnName);
    };

    const hasValidationError = (columnName) => validationErrors.value[columnName]?.length > 0;

    const getValidationError = (columnName) => validationErrors.value[columnName]?.join(' ');

    const clearValidationErrors = () => {
      validationErrors.value = {};
    };

    const SignIn = () => {
      // Handle form submission
      console.log('Form submitted with values:', inputValues.value);
    };

    const getDefaultMonth = () => {
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const currentMonth = new Date().getMonth();
      return months[currentMonth];
    };

    const setDefaultDateValues = () => {
      Object.keys(settings.value).forEach((columnName) => {
        if (columnName === 'day') {
          const currentDay = new Date().getDate();
          inputValues.value[columnName] = currentDay;
        } else if (columnName === 'month') {
          inputValues.value[columnName] = getDefaultMonth();
        }
      });
    };

    const clearInputs = () => {
      setDefaultDateValues();
      clearValidationErrors();
    };

    onMounted(async () => {
      try {
        const response = await fetch('http://localhost:3000/settings/all');
        const { settings: fetchedSettings } = await response.json();
        settings.value = fetchedSettings;
        setDefaultDateValues(); // Set default values after settings are fetched
      } catch (error) {
        console.error('Error fetching settings:', error.message);
      }
    });

    return {
      settings,
      inputValues,
      getColumnId,
      getInputType,
      handleInput,
      hasValidationError,
      getValidationError,
      SignIn,
      clearInputs,
    };
  },
};

</script>

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

/* Add styles for error text */
.error-text {
  color: red;
  margin-top: 5px;
}
</style>
