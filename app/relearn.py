from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pandas as pd 
import numpy as np
import sys
import json

input_data = json.loads(sys.argv[1])

x_train = pd.read_csv('data/bank_x_train_limited.csv')
y_train = pd.read_csv('data/bank_y_train.csv')
x_val = pd.read_csv('data/bank_x_val_limited.csv')
y_val = pd.read_csv('data/bank_y_val.csv')

forest = RandomForestClassifier(
    random_state=input_data[0], 
    n_estimators=input_data[1], 
    max_depth=input_data[2],
    min_samples_split=input_data[3],
    min_samples_leaf=input_data[4]
)
forest.fit(x_train, y_train)

y_pred = forest.predict(x_val)
accuracy = accuracy_score(y_val, y_pred)

print(json.dumps(accuracy))