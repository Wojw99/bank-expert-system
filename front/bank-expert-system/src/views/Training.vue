<template>
    <div>
      <h1>Training</h1>

      <div v-if="modelInfo && modelInfo.lastParameters">
      <!-- Model Info section -->
      <div class="section">
        <h2>Model Information</h2>
        <p>Last Training Parameters:</p>
        <ul>
          <!-- <li>ID: {{ modelInfo.lastParameters.id }}</li>
          <li>Random State: {{ modelInfo.lastParameters.random_state }}</li> -->
          <li>N Estimators: {{ modelInfo.lastParameters.n_estimators }}</li>
          <li>Max Depth: {{ modelInfo.lastParameters.max_depth }}</li>
          <li>Min Samples Split: {{ modelInfo.lastParameters.min_samples_split }}</li>
          <li>Min Samples Leaf: {{ modelInfo.lastParameters.min_samples_leaf }}</li>
        </ul>
        <strong>Accuracy: {{ (modelInfo.lastParameters.accuracy * 100).toFixed(2) }}%</strong>
      </div>
      </div>

    <!-- Form to modify hyperparameters -->
    <div class="section">
      <h2>Modify Hyperparameters</h2>
      <form @submit.prevent="relearnModel">
        <label for="n_estimators">N Estimators:
          <input type="number" id="n_estimators"
          v-model="newParameters.n_estimators" @input="handleInput('n_estimators')" />
        </label>
        <p v-if="hasValidationErrors('n_estimators')" class="error-text">
          {{ getValidationErrors('n_estimators') }}
        </p>

        <label for="max_depth">Max Depth:
          <input type="number" id="max_depth"
          v-model="newParameters.max_depth" @input="handleInput('max_depth')" />
        </label>
        <p v-if="hasValidationErrors('max_depth')" class="error-text">
          {{ getValidationErrors('max_depth') }}
        </p>

        <label for="min_samples_split">Min Samples Split:
          <input type="number" id="min_samples_split"
          v-model="newParameters.min_samples_split" @input="handleInput('min_samples_split')" />
        </label>
        <p v-if="hasValidationErrors('min_samples_split')" class="error-text">
          {{ getValidationErrors('min_samples_split') }}
        </p>

        <label for="min_samples_leaf">Min Samples Leaf:
          <input type="number" id="min_samples_leaf"
          v-model="newParameters.min_samples_leaf" @input="handleInput('min_samples_leaf')" />
        </label>
        <p v-if="hasValidationErrors('min_samples_leaf')" class="error-text">
          {{ getValidationErrors('min_samples_leaf') }}
        </p>

        <p v-if="!isFormValid && formErrorMessage" class="error-text">
          {{ formErrorMessage }}
        </p>
        <button @click="relearnModel" :disabled="relearningInProgress || !isFormValid">
          <span v-if="!relearningInProgress">Relearn</span>
          <span v-else>
            <img v-if="relearningInProgress" ref="learningBook"
            src="@/assets/book.gif" alt="Loading" class="learning-book-img" />
          </span>
        </button>
      </form>
    </div>

    <!-- New Model Information section -->
    <div v-if="newModelInfo" class="section" ref="newModelSection">
      <h2>New Model Information</h2>
      <p>New Model Accuracy: {{ (newModelInfo.accuracy * 100).toFixed(2) }}%</p>
      <p>Do you want to overwrite the model with new hyperparameters?</p>
      <div class="button-container">
        <button class="accept-button" @click="acceptRelearning">Yes, Accept Relearning</button>
        <button class="reject-button" @click="rejectRelearning">No, Reject Relearning</button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store/store';

export default {
  name: 'TrainingPanel',
  data() {
    return {
      modelInfo: {
        lastParameters: {
          id: null,
          random_state: null,
          n_estimators: null,
          max_depth: null,
          min_samples_split: null,
          min_samples_leaf: null,
          accuracy: null,
        },
      },
      newParameters: {
        n_estimators: null,
        max_depth: null,
        min_samples_split: null,
        min_samples_leaf: null,
      },
      newModelInfo: null,
      relearningInProgress: false,
      hyperparameterValidationErrors: {
        n_estimators: [],
        max_depth: [],
        min_samples_split: [],
        min_samples_leaf: [],
      },
      hyperparameterConstraints: {
        n_estimators: {
          min: 0,
          max: 100,
        },
        max_depth: {
          min: 0,
          max: 10,
        },
        min_samples_split: {
          min: 0,
          max: 100,
        },
        min_samples_leaf: {
          min: 0,
          max: 100,
        },
      },
      isFormValid: true,
      formErrorMessage: '',
    };
  },
  methods: {
    validateForm() {
      this.isFormValid = !this.hasValidationErrors();
      if (!this.isFormValid) {
        this.formErrorMessage = 'Please correct the form errors before relearning.';
      } else {
        this.formErrorMessage = '';
      }
    },
    handleInput(columnName) {
      this.validateHyperparameter(columnName);
    },
    validateHyperparameters() {
      // Validate each hyperparameter
      this.validateHyperparameter('n_estimators');
      this.validateHyperparameter('max_depth');
      this.validateHyperparameter('min_samples_split');
      this.validateHyperparameter('min_samples_leaf');
    },
    validateHyperparameter(hyperparameter) {
      const value = this.newParameters && this.newParameters[hyperparameter];
      const constraints = this.hyperparameterConstraints[hyperparameter];

      const errors = [];

      if (
        value === null || value === undefined || Number.isNaN(value)
        || value < constraints.min || value > constraints.max
      ) {
        errors.push(`Invalid value for ${hyperparameter}`);
      }

      // Update validation errors for the current hyperparameter
      this.hyperparameterValidationErrors = {
        ...this.hyperparameterValidationErrors,
        [hyperparameter]: errors,
      };
    },

    getValidationErrors(hyperparameter) {
      return this.hyperparameterValidationErrors[hyperparameter].join(' ');
    },

    hasValidationErrors(hyperparameter) {
      return this.hyperparameterValidationErrors[hyperparameter].length > 0;
    },
    scrollToBook() {
      // Wait for 100ms before attempting to scroll
      setTimeout(() => {
        const { learningBook } = this.$refs;
        if (learningBook) {
          learningBook.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    },
    async fetchModelInfo() {
      try {
        const token = store.getters.authToken;
        const response = await fetch('http://localhost:3000/settings/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const { lastParameters } = await response.json();
        this.modelInfo.lastParameters = lastParameters;
      } catch (error) {
        console.error('Error fetching model info:', error.message);
      }
    },
    async relearnModel() {
      try {
        this.validateHyperparameters();

        this.formErrorMessage = '';
        if (
          this.hasValidationErrors('n_estimators')
          || this.hasValidationErrors('max_depth')
          || this.hasValidationErrors('min_samples_split')
          || this.hasValidationErrors('min_samples_leaf')
          || !this.newParameters.n_estimators
          || !this.newParameters.max_depth
          || !this.newParameters.min_samples_split
          || !this.newParameters.min_samples_leaf
        ) {
          return; // Exit early if there are validation errors or empty inputs
        }

        this.relearningInProgress = true;
        this.scrollToBook();

        const token = this.$store.getters.authToken;
        const response = await fetch('http://localhost:3000/classification/relearn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            n_estimators: this.newParameters.n_estimators,
            max_depth: this.newParameters.max_depth,
            min_samples_split: this.newParameters.min_samples_split,
            min_samples_leaf: this.newParameters.min_samples_leaf,
          }),
        });

        if (response.ok) {
          // Fetch updated model info after relearning
          await this.fetchModelInfo();

          // Set newModelInfo with the response data
          this.newModelInfo = await response.json();
        } else {
          console.error('Error relearning model:', response.statusText);
          this.formErrorMessage = 'Error relearning model. Please try again.';
        }
      } catch (error) {
        console.error('Error relearning model:', error.message);
        this.formErrorMessage = 'Error relearning model. Please try again.';
      } finally {
        this.relearningInProgress = false;
      }
    },
    async acceptRelearning() {
      try {
        const token = this.$store.getters.authToken;
        const response = await fetch('http://localhost:3000/classification/acceptRelearning', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Fetch updated model info after accepting relearning
          await this.fetchModelInfo();
        } else {
          console.error('Error accepting relearning:', response.statusText);
        }
        this.newModelInfo = null;
        this.clearInputs();
      } catch (error) {
        console.error('Error accepting relearning:', error.message);
      }
    },
    rejectRelearning() {
      // Reset the form and hide the "New Model Information" section
      this.newModelInfo = null;
      this.clearInputs();
    },
    clearInputs() {
      this.newParameters = {
        n_estimators: null,
        max_depth: null,
        min_samples_split: null,
        min_samples_leaf: null,
      };
    },
  },
  mounted() {
    // Fetch model info when the component is mounted
    this.fetchModelInfo();
  },
};
</script>

<style scoped>
/* Your existing styles remain unchanged */
.section {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center; /* Center text in the section */
}

ul {
  list-style-position: inside; /* Align the dots inside the list items */
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

form label {
  margin: 5px 0;
}
.section {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center; /* Center text in the section */
}

ul {
  list-style-position: inside; /* Align the dots inside the list items */
  list-style-type: none;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

form label {
  margin: 5px 0;
}

.button-container {
  margin-top: 10px;
}

.accept-button {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-right: 10px;
  cursor: pointer;
}

.reject-button {
  background-color: #f44336; /* Red */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}
.error-text {
  margin: 5px 0;
  font-weight: bold;
  color: red;
}
</style>
