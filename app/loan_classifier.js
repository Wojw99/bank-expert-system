const RandomForestClassifier = require('random-forest-classifier');

loanClassifier.RandomForest = new RandomForestClassifier(options)

loanClassifier.options = {
    numberOfTrees: 60,
}

loanClassifier.relearn = function () {
    csv_file_path = 'path/to/your/directory/X_train.csv'
}