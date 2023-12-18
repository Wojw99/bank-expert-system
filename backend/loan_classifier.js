const fs = require('fs');
const csv = require('csv-parser');
const RandomForestClassifier = require('random-forest-classifier').RandomForestClassifier;
const database = require('./database')
const config = require('./config');

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
        const paramsArry = [
          random_state,
          n_estimators,
          max_depth,
          min_samples_split,
          min_samples_leaf
        ]
    
        const pythonScriptPath = 'relearn.py';
        const pythonProcess = spawn('python', [pythonScriptPath, JSON.stringify(paramsArry)]);
    
        console.log(`Relearning started with parameters: ${paramsArry}`)
        console.log(strings.waitingForPythonScript)
    
        pythonProcess.stdout.on('data', (data) => {
            console.log(`${strings.pythonScriptOutput} ${data}`);

            this.hyperparametersTemp = {
              "random_state" : random_state,
              "n_estimators" : n_estimators,
              "max_depth" : max_depth,
              "min_samples_split" : min_samples_split,
              "min_samples_leaf" : min_samples_leaf,
              "accuracy" : parseFloat(data)
            };

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

loanClassifier.acceptRelearning = async function() {
  this.hyperparameters = this.hyperparametersTemp
  database.updateParameters(this.hyperparameters)

  return new Promise((resolve, reject) => {
    const pythonScriptPath = 'acceptRelearning.py';
    const pythonProcess = spawn('python', [pythonScriptPath]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`${strings.pythonScriptOutput} ${data}`);
      resolve(data);
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

loanClassifier.classify = async function(
    age = 30,
    job = 1,
    balance = 927,
    day = 13,
    month = 1,
    duration = 555, 
    education = 1
) {
    return new Promise((resolve, reject) => {
    const pythonScriptPath = 'classify.py';

    const jobNum = config.categoryMaps[job]
    const eduNum = config.categoryMaps[education]

    const inputData = [
      this.hyperparameters["random_state"],
      this.hyperparameters["n_estimators"],
      this.hyperparameters["max_depth"],
      this.hyperparameters["min_samples_split"],
      this.hyperparameters["min_samples_leaf"],
        age,
        jobNum,
        balance,
        day,
        month,
        duration,
        eduNum
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
        reject(new Error('Something went wrong?'));
      }
    });
  })
}

module.exports = loanClassifier