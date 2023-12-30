<template>
  <div :style="{ width: '100%', height: '100vh' }">
    <h1>Prediction</h1>

    <div id="form">
      <div v-for="(details, columnName) in settings" :key="columnName" class="form-row">
        <label :for="getColumnId(columnName)" class="label">{{ columnName }}
          <template v-if="details.type === 'category'">
            <select :id="getColumnId(columnName)"
            v-model="inputValues[columnName]" class="input" @change="handleInput(columnName)">
              <option v-for="option in details.posibilities"
              :key="option" :value="option">{{ option }}</option>
            </select>
            <p v-if="hasValidationError(columnName)" class="error-text">
              {{ getValidationError(columnName) }}
            </p>
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
      <button @click="predictLoan">Predict</button>
      <button @click="clearInputs">Clear All</button>
      <p v-if="predictionResult === 1">Customer should get a loan.</p>
      <p v-if="predictionResult === 0">Customer should not get a loan.</p>
    </div>
  </div>
</div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue';
import store from '@/store/store';

export default {
  name: 'PredictionPanel',
  setup() {
    const settings = ref({});
    const inputValues = ref({});
    const validationErrors = reactive({});
    const predictionResult = ref(null);
    const isFormValid = ref(false);

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
      const value = String(inputValues.value[columnName]); // Convert value to string
      const details = settings.value[columnName];
      const errors = [];

      // Check for empty or non-string inputs
      if (value === null || value === undefined || value.trim() === '') {
        errors.push('Please enter a valid value.');
      } else if (details && details.type === 'int') {
        // Check for valid integer values
        const intValue = parseInt(value, 10);

        if (Number.isNaN(intValue) || value.includes('.') || value.includes(',')) {
          errors.push('Please enter a valid integer value.');
        } else {
          // Validate against min and max values
          const minValue = details.min;
          const maxValue = details.max;

          if (minValue !== null && intValue < parseInt(minValue, 10)) {
            errors.push(`Value should be greater than or equal to ${minValue}.`);
          }
          if (maxValue !== null && intValue > parseInt(maxValue, 10)) {
            errors.push(`Value should be less than or equal to ${maxValue}.`);
          }
        }
      }

      // Update validation errors for the current column
      validationErrors.value[columnName] = errors;
    };

    const hasValidationError = (columnName) => validationErrors.value[columnName]?.length > 0;

    const getValidationError = (columnName) => validationErrors.value[columnName]?.join(' ');

    const clearValidationErrors = () => {
      validationErrors.value = {};
    };

    const validateForm = () => {
  // Check the overall validity of the form
  isFormValid.value = Object.entries(settings.value).every(([columnName, details]) => {
    const value = inputValues.value[columnName];

    // Check for empty values
    if (value === '' || value === null || value === undefined) {
      validationErrors.value[columnName] = ['Please enter... a valid value.'];
      return false;
    }

    // Check for valid integer values for int type columns
    if (details.type === 'int') {
      const intValue = parseInt(value, 10);

      if (!Number.isInteger(value)) {
        validationErrors.value[columnName] = ['Please enter a valid integer value.'];
        return false;
      }

      // Validate against min and max values
      const minValue = details.min;
      const maxValue = details.max;

      if (minValue !== null && intValue < parseInt(minValue, 10)) {
        validationErrors.value[columnName] = [`Value should be greater than or equal to ${minValue}.`];
        return false;
      }
      if (maxValue !== null && intValue > parseInt(maxValue, 10)) {
        validationErrors.value[columnName] = [`Value should be less than or equal to ${maxValue}.`];
        return false;
      }
    }

    // Clear validation errors if the value is valid
    validationErrors.value[columnName] = [];
    return true;
  });
};

    const handleInput = (columnName) => {
      validateInput(columnName);
      // validateForm();
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
      clearValidationErrors();
      predictionResult.value = null;
      Object.keys(inputValues.value).forEach((key) => {
        inputValues.value[key] = null;
      });
    };

    const showEmptyInputAlerts = () => {
      // Check for empty inputs and display alerts
      Object.keys(inputValues.value).forEach((columnName) => {
        const value = inputValues.value[columnName];
        const details = settings.value[columnName];

        if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
          validationErrors.value[columnName] = ['Please enter a valid value.'];
        } else if (details && details.type === 'category' && !value) {
          validationErrors.value[columnName] = ['Please select a value.'];
        } else {
          validationErrors.value[columnName] = []; // Clear validation errors if the value is valid
        }
      });
    };

    const predictLoan = async () => {
  try {
    // Validate inputs
    validateForm();
    showEmptyInputAlerts();

    // Exit early if there are validation errors or the form is invalid
    if (!isFormValid.value) {
      console.log('Form is not valid. Prediction aborted.');
      return;
    }

    // Create query string based on input values
    const queryParams = new URLSearchParams();
    Object.keys(inputValues.value).forEach((columnName) => {
      // Parse values to integers for int type columns
      if (settings.value[columnName].type === 'int') {
        const intValue = parseInt(inputValues.value[columnName], 10);
        if (!Number.isNaN(intValue)) {
          queryParams.append(columnName, intValue);
        }
      } else {
        queryParams.append(columnName, inputValues.value[columnName]);
      }
    });

    const token = store.getters.authToken;
    const response = await fetch(`http://localhost:3000/classification/classify?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      predictionResult.value = result.prediction[0];
      console.log(result);
      console.log(result.prediction);
    } else {
      console.error('Error predicting loan:', response.statusText);
    }
  } catch (error) {
    console.error('Error predicting loan:', error.message);
  }
};

    onMounted(async () => {
      try {
        // Retrieve the authentication token from the Vuex store
        const token = store.getters.authToken;

        const response = await fetch('http://localhost:3000/settings/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const { settings: fetchedSettings } = await response.json();

          // Initialize settings, validationErrors, and inputValues
          if (fetchedSettings && Object.keys(fetchedSettings).length > 0) {
            settings.value = fetchedSettings;
            validationErrors.value = Object.fromEntries(
              Object.keys(fetchedSettings).map((columnName) => [columnName, []]),
            );

            Object.keys(settings.value).forEach((columnName) => {
              inputValues.value[columnName] = null;
            });

            setDefaultDateValues();
          } else {
            console.error('Error fetching settings: Empty response');
          }
        } else {
          console.error('Error fetching settings:', response.statusText);
        }
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
      predictLoan,
      clearInputs,
      predictionResult,
      isFormValid,
      validateForm,
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

/* Adjusted styles for error text */
.error-text {
  color: red;
  margin-top: 2px; /* Adjust this value as needed */
}
</style>
