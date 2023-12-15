<template>
  <div>
    <h1>Training</h1>

    <!-- File upload section -->
    <div class="section">
      <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
      <label
        id="csvFileLabel"
        for="fileInput"
      >
        Choose CSV File:
      </label>
      <div
        class="file-input-label"
        :for="selectedFile ? 'fileInputHasValue' : 'fileInput'"
      >
        <span v-if="selectedFile">{{ selectedFile.name }}</span>
        <span v-else>Click to choose a file</span>
        <input
          type="file"
          id="fileInput"
          accept=".csv"
          @change="handleFileUpload"
          aria-label="Choose CSV File"
        />
      </div>
      <button @click="startTraining">Start Training</button>
    </div>

    <!-- Past and current effectiveness section -->
    <div class="section">
      <h2>Past and Current Effectiveness</h2>
      <!-- Add your UI elements for past and current effectiveness here -->
    </div>

    <!-- Model overwrite UI element -->
    <div class="section">
      <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
      <label for="overwriteModel">Overwrite Existing Model:</label>
      <div class="yes-no-buttons">
        <button
          @click="handleModelOverwrite(true)"
          :class="{ active: overwriteModel }"
        >
          Yes
        </button>
        <button
          @click="handleModelOverwrite(false)"
          :class="{ active: !overwriteModel }"
        >
          No
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrainingPanel',
  data() {
    return {
      selectedFile: null,
      overwriteModel: false,
    };
  },
  methods: {
    handleFileUpload(event) {
      const [selectedFile] = event.target.files;
      if (selectedFile) {
        this.selectedFile = selectedFile;
      }
    },
    startTraining() {
      // Add logic to start training the model using this.selectedFile
      if (this.selectedFile) {
        console.log('Training started with file:', this.selectedFile);
        console.log('Overwrite model:', this.overwriteModel);
        // Add additional logic for training
      } else {
        console.error('No file selected for training.');
      }
    },
    handleModelOverwrite(value) {
      this.overwriteModel = value;
    },
  },
};
</script>

<style scoped>
.section {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 20px;
}

.file-input-label {
  cursor: pointer;
  display: inline-block;
  margin-left: 10px;
}

.yes-no-buttons {
  display: flex;
}

.yes-no-buttons button {
  margin-right: 10px;
  padding: 5px 10px;
  cursor: pointer;
}

.yes-no-buttons button.active {
  background-color: #4CAF50;
  color: #fff;
}
</style>
