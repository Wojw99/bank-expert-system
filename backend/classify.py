from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pandas as pd 
import numpy as np
import sys
import json
import joblib

input_data = json.loads(sys.argv[1])
# input_data = [42,50,5,5,1,30,1,927,13,1,555,1]
# print(input_data)

forest = joblib.load('trained_model.joblib')

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

print(json.dumps({"prediction" : prediction.tolist(), "sample" : sample}))