import sys
import json
import joblib

forest = joblib.load('trained_model_temp.joblib')
joblib.dump(forest, 'trained_model.joblib')

print(json.dumps("Models switched."))