<template>
  <div>
    <h1>Training</h1>

    <!-- Model Info section -->
    <div class="section">
      <h2>Model Information</h2>
      <p>Last Training Parameters:</p>
      <ul>
        <li>ID: {{ modelInfo.lastParameters.id }}</li>
        <li>Random State: {{ modelInfo.lastParameters.random_state }}</li>
        <li>N Estimators: {{ modelInfo.lastParameters.n_estimators }}</li>
        <li>Max Depth: {{ modelInfo.lastParameters.max_depth }}</li>
        <li>Min Samples Split: {{ modelInfo.lastParameters.min_samples_split }}</li>
        <li>Min Samples Leaf: {{ modelInfo.lastParameters.min_samples_leaf }}</li>
        <li>Accuracy: {{ modelInfo.lastParameters.accuracy }}</li>
      </ul>
    </div>

    <!-- Form to modify hyperparameters -->
    <div class="section">
      <h2>Modify Hyperparameters</h2>
      <form @submit.prevent="relearnModel">
        <label for="n_estimators">N Estimators:
          <input type="number" id="n_estimators" v-model="newParameters.n_estimators" />
        </label>
        <label for="max_depth">Max Depth:
          <input type="number" id="max_depth" v-model="newParameters.max_depth" />
        </label>
        <label for="min_samples_split">Min Samples Split:
          <input type="number" id="min_samples_split" v-model="newParameters.min_samples_split" />
        </label>
        <label for="min_samples_leaf">Min Samples Leaf:
          <input type="number" id="min_samples_leaf" v-model="newParameters.min_samples_leaf" />
        </label>
        <button type="submit">Relearn</button>
      </form>
    </div>

    <!-- New Model Information section -->
    <div v-if="newModelInfo" class="section">
      <h2>New Model Information</h2>
      <p>New Model Accuracy: {{ (newModelInfo.accuracy * 100).toFixed(2) }}%</p>
      <div class="button-container">
        <button class="accept-button" @click="acceptRelearning">Yes, Accept Relearning</button>
        <button class="reject-button" @click="rejectRelearning">No, Reject Relearning</button>
      </div>
    </div>
  </div>
</template>

<script>
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
    };
  },
  methods: {
    async fetchModelInfo() {
      try {
        const response = await fetch('http://localhost:3000/settings/all');
        const { lastParameters } = await response.json();
        this.modelInfo.lastParameters = lastParameters;
      } catch (error) {
        console.error('Error fetching model info:', error.message);
      }
    },
    async relearnModel() {
      try {
        // Retrieve the authentication token from the Vuex store
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
        }
      } catch (error) {
        console.error('Error relearning model:', error.message);
      }
    },
    async acceptRelearning() {
      // Add logic to accept relearning (send request to acceptRelearning endpoint)
      console.log('Accepted relearning');
    },
    rejectRelearning() {
      // Add logic to reject relearning
      // For example, reset newModelInfo and show the original model info
      this.newModelInfo = null;
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
</style>
