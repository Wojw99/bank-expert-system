from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pandas as pd 
import numpy as np
import sys
import json

input_data = json.loads(sys.argv[1])
# input_data = [42,50,5,5,1,30,1,927,13,1,555,1]
# print(input_data)

x_train = pd.read_csv('data/bank_x_train_limited.csv')
y_train = pd.read_csv('data/bank_y_train.csv')

forest = RandomForestClassifier(
    random_state=input_data[0], 
    n_estimators=input_data[1], 
    max_depth=input_data[2],
    min_samples_split=input_data[3],
    min_samples_leaf=input_data[4]
)
forest.fit(x_train, y_train)

sample = [[
    input_data[5],
    input_data[6],
    input_data[7],
    input_data[8],
    input_data[9],
    input_data[10],
    input_data[11]
]]

prediction = forest.predict(sample)

print(json.dumps(prediction.tolist()))