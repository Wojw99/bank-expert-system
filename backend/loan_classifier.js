const fs = require('fs');
const csv = require('csv-parser');
const RandomForestClassifier = require('random-forest-classifier').RandomForestClassifier;
const database = require('./database')

const { spawn } = require('child_process');
const strings = require('./strings');

loanClassifier = {}

loanClassifier.hyperparameters = null
loanClassifier.hyperparametersTemp = null

database.getParameters(function (error, params) {
  if(params !== null) {
    loanClassifier.hyperparameters = params
    loanClassifier.hyperparametersTemp = { ...loanClassifier.hyperparameters }
  }
})

setTimeout(function() {

}, 1000);

loanClassifier.relearn = async function (
    random_state = 42,
    n_estimators = 60,
    max_depth = null,
    min_samples_split = 5,
    min_samples_leaf = 1,
) {
    return new Promise((resolve, reject) => {
        this.hyperparametersTemp = [
            random_state,
            n_estimators,
            max_depth,
            min_samples_split,
            min_samples_leaf,
        ];
    
        const pythonScriptPath = 'relearn.py';
        const pythonProcess = spawn('python', [pythonScriptPath, JSON.stringify(this.hyperparametersTemp)]);
    
        console.log(`Relearning started with parameters: ${this.hyperparametersTemp}`)
        console.log(strings.waitingForPythonScript)
    
        pythonProcess.stdout.on('data', (data) => {
            console.log(`${strings.pythonScriptOutput} ${data}`);
            const parsed = JSON.parse(data);
            resolve(parsed);
        });
          
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            console.error(`${strings.pythonScriptExitedWithCode} ${code}`);
            reject(new Error('Async operation failed'));
          } else {
            console.log(strings.pythonScriptExecComplit);
          }
        });
    });
}

loanClassifier.acceptRelearning = function() {
  console.log("original: ", this.hyperparameters)
  this.hyperparameters = this.hyperparametersTemp
  console.log("updated: ", this.hyperparameters)
  database.updateParameters(this.hyperparameters.random_state,this.hyperparameters.n_estimators,this.hyperparameters.max_depth,this.hyperparameters.min_samples_split,this.hyperparameters.min_samples_leaf)
}

loanClassifier.classify = async function(
    age = 30,
    job = 1,
    balance = 927,
    day = 13,
    month = 1,
    duration = 555, 
    campaign = 1
) {
    return new Promise((resolve, reject) => {
    const pythonScriptPath = 'classify.py';
    const inputData = [
        this.hyperparameters[0],
        this.hyperparameters[1],
        this.hyperparameters[2],
        this.hyperparameters[3],
        this.hyperparameters[4],
        age,
        job,
        balance,
        day,
        month,
        duration,
        campaign
    ];
    const pythonProcess = spawn('python', [pythonScriptPath, JSON.stringify(inputData)]);

    console.log(strings.classificationStarted)
    console.log(strings.waitingForPythonScript)

    pythonProcess.stdout.on('data', (data) => {
        console.log(`${strings.pythonScriptOutput} ${data}`);
        const parsed = JSON.parse(data);
        resolve(parsed);
    });
      
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`${strings.pythonScriptExitedWithCode} ${code}`);
        reject(new Error('Async operation failed'));
      } else {
        console.log(strings.pythonScriptExecComplit);
      }
    });
    })
}

module.exports = loanClassifier