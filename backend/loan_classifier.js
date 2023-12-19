const database = require('./database')
const config = require('./config');
const ValidationError = require('./validation_error')

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


loanClassifier.validateRelearningParams = function(reqHyperparameters) {
  const random_state = reqHyperparameters.random_state
  if(random_state <= 0 || random_state >= Math.pow(2, 32)) {
    throw new ValidationError('random_state should be between 0 and 2^32')
  }

  const n_estimators = reqHyperparameters.n_estimators
  if(n_estimators === null || n_estimators === undefined) {
    throw new ValidationError('n_estimators cannot be null.')
  }
  if(n_estimators <= 0) {
    throw new ValidationError('n_estimators must be greater than 0.')
  }

  const max_depth  = reqHyperparameters.max_depth 
  if(max_depth  <= 0) {
    throw new ValidationError('max_depth  must be greater than 0.')
  }

  const min_samples_split = reqHyperparameters.min_samples_split
  if(min_samples_split === null || min_samples_split === undefined) {
    throw new ValidationError('min_samples_split cannot be null.')
  } 
  if(min_samples_split <= 0) {
    throw new ValidationError('min_samples_split must be greater than 0.')
  }

  const min_samples_leaf = reqHyperparameters.min_samples_leaf 
  if(min_samples_leaf === null || min_samples_leaf === undefined) {
    throw new ValidationError('min_samples_leaf cannot be null.')
  }
  if(min_samples_leaf <= 0) {
    throw new ValidationError('min_samples_leaf must be greater than 0.')
  }
}

loanClassifier.relearn = async function (reqHyperparameters) {
    return new Promise((resolve, reject) => {
        const paramsArry = [
          reqHyperparameters.random_state,
          reqHyperparameters.n_estimators,
          reqHyperparameters.max_depth,
          reqHyperparameters.min_samples_split,
          reqHyperparameters.min_samples_leaf
        ]

        try{
          loanClassifier.validateRelearningParams(reqHyperparameters)
        } catch(error) {
          reject(error)
        }

        const pythonScriptPath = 'relearn.py';
        const pythonProcess = spawn('python', [pythonScriptPath, JSON.stringify(paramsArry)]);
    
        console.log(`Relearning started with parameters: ${paramsArry}`)
        console.log(strings.waitingForPythonScript)
    
        pythonProcess.stdout.on('data', (data) => {
            console.log(`${strings.pythonScriptOutput} ${data}`);

            this.hyperparametersTemp = {
              "random_state" : reqHyperparameters.random_state,
              "n_estimators" : reqHyperparameters.n_estimators,
              "max_depth" : reqHyperparameters.max_depth,
              "min_samples_split" : reqHyperparameters.min_samples_split,
              "min_samples_leaf" : reqHyperparameters.min_samples_leaf,
              "accuracy" : parseFloat(data)
            };

            const parsed = JSON.parse(data);
            resolve(parsed);
        });
          
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            console.error(`${strings.pythonScriptExitedWithCode} ${code}`);
            reject(new Error('Something went wrong'));
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
        reject(new Error('Something went wrong'));
      } else {
       console.log(strings.pythonScriptExecComplit);
      }
   });
  })
}

loanClassifier.validateSettingsNumber = function(paramKey, param, setting) {
  if(!Number.isInteger(param)) {
    throw new ValidationError(`${paramKey} must be instance of Int`)
  }
  if(setting.max) {
    const max = parseInt(setting.max)
    if(param > setting.max) {
      throw new ValidationError(`${paramKey} must be less or equal than ${max}`)
    }
  }
  if(setting.min) {
    const min = parseInt(setting.min)
    if(param < min) {
      throw new ValidationError(`${paramKey} must be greater or equal than ${min}`)
    }    
  }
}

loanClassifier.validateSettingsCategory = function(paramKey, param, setting) {
  if(!setting.posibilities.includes(param)) {
    throw new ValidationError(`Category ${paramKey} must be in: ${setting.posibilities}`)
  }
}

loanClassifier.validateClassificationParams = function(reqParameters) {
  loanClassifier.validateSettingsNumber('age', reqParameters.age, config.settings.age)
  loanClassifier.validateSettingsNumber('balance', reqParameters.balance, config.settings.balance)
  loanClassifier.validateSettingsNumber('day', reqParameters.day, config.settings.day)
  loanClassifier.validateSettingsNumber('duration', reqParameters.duration, config.settings.duration)

  loanClassifier.validateSettingsCategory('job', reqParameters.job, config.settings.job)
  loanClassifier.validateSettingsCategory('education', reqParameters.education, config.settings.education)
  loanClassifier.validateSettingsCategory('month', reqParameters.month, config.settings.month)
}

loanClassifier.classify = async function(reqParameters) {
    return new Promise((resolve, reject) => {

    try{
      loanClassifier.validateClassificationParams(reqParameters)
    } catch(error) {
      reject(error)
    }

    const pythonScriptPath = 'classify.py';

    const jobNum = config.categoryMaps[reqParameters.job]
    const eduNum = config.categoryMaps[reqParameters.education]
    const monthNum = config.categoryMaps[reqParameters.month]

    const inputData = [
      this.hyperparameters["random_state"],
      this.hyperparameters["n_estimators"],
      this.hyperparameters["max_depth"],
      this.hyperparameters["min_samples_split"],
      this.hyperparameters["min_samples_leaf"],
      reqParameters.age,
      jobNum,
      eduNum,
      reqParameters.balance,
      reqParameters.day,
      monthNum,
      reqParameters.duration
    ];
    
    const pythonProcess = spawn('python', [pythonScriptPath, JSON.stringify(inputData)]);

    console.log(strings.classificationStarted)
    console.log(strings.waitingForPythonScript)

    pythonProcess.stdout.on('data', (data) => {
        console.log(`${strings.pythonScriptOutput} ${data}`);
        const parsed = JSON.parse(data);
        resolve(parsed.accuracy);
    });
      
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`${strings.pythonScriptExitedWithCode} ${code}`);
        reject(new Error('Something went wrong'));
      } else {
        console.log(strings.pythonScriptExecComplit);
        reject(new Error('Something went wrong?'));
      }
    });
  })
}

module.exports = loanClassifier