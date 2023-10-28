import pandas
import re
import numpy as np

import sklearn.linear_model
import sklearn.neighbors
import sklearn.tree

import sklearn.model_selection

from sklearn import preprocessing

from scipy import stats

unique_data = pandas.read_csv('data.txt', sep = "\t")
unique_data

def extract_numbers(frame, ignore_columns = []):
    # iterate through each column
    for col in frame.columns:
        # skip ignored columns
        if col in ignore_columns:
            continue

        # iterate through each value in the column
        for i in range(len(frame)):
            # grab the current working entry
            cell_text = str(frame.at[i, col])
    
            # if this doesn't work, NaN
            if not cell_text:
                frame.at[i, col] = np.nan
                continue

            # Remove the mph and kg from cells that have it
            cell_text = re.sub(r'\s(mph|kg)', '', cell_text)

            # regex search for things that fit the desc. of a number
            match = re.search(r'-?\d+(?:\.\d+)?', cell_text)

            # if a number is found, remove what's necessary
            if match:
                number = match.group(0)
                
                # Remove any remaining whitespace
                number = number.strip()

                # cast the number as a float
                number = float(number)
                
                # then if not a decimal number, cast from float to int
                if (('.' not in str(number)) or str(number)[-2:] == '.0'):
                    number = int(number)
                    
                # assign the value in the frame
                frame.at[i, col] = number
                
            # if no number is found, NaN
            else:
                frame.at[i, col] = np.nan
    return frame

def assign_types(frame):
    for column in frame.columns:
        # Try to convert the column to integer
        if frame[column].apply(lambda x: isinstance(x, (int, np.int64))).all():
            frame[column] = frame[column].astype(int)
        # Try to convert the column to float
        elif frame[column].apply(lambda x: isinstance(x, (float, np.float64))).all():
            frame[column] = frame[column].astype(float)
        # Otherwise, assume the column contains strings
        else:
            frame[column] = frame[column].astype(str)
    return frame

def lowercase(frame, select_columns = []):
    # iterate through the columns selected
    for col in frame.columns:
        # skip ignored columns
        if col not in select_columns:
            continue

        # iterate through each value in the column
        for i in range(len(frame)):
            if i not in frame.index:
                continue
            # grab the current working entry
            cell_text = str(frame.at[i, col])
    
            # if this doesn't work, NaN
            if not cell_text:
                frame.at[i, col] = np.nan
                continue

            # if it does, make it lowercase
            frame.at[i, col] = cell_text.lower()
    return frame

def remove_nan(frame):
    delete_rows = []
    # iterate through the columns selected
    for col in frame.columns:
        # iterate through each value in the column
        for i in range(len(frame)):
            if frame.at[i, col] is np.nan:
                if i not in delete_rows:
                    delete_rows.append(i)
            if frame.at[i, col] == '?':
                if i not in delete_rows:
                    delete_rows.append(i)

    delete_rows.sort()
    return frame.drop(index = delete_rows)

def clean_data(frame):
    # remove the mph and kg, cast everything to int or float, and set n/a's to np.nan
    final_frame = extract_numbers(frame, ['label', 'col_02', 'col_03'])

    # remove all rows with np.nan
    final_frame = remove_nan(final_frame)

    # assign datatypes to the cols
    final_frame = assign_types(final_frame)

    # make all the string vals lowercase
    final_frame = lowercase(final_frame, ['col_02', 'col_03'])
    
    return final_frame

unique_data = clean_data(unique_data)
unique_data

def one_hot(frame, column_name):
    if column_name == '':
        return frame
    
    # Create a set of all possible values for the specified column
    all_values = set()
    for val_str in frame[column_name]:
        vals = [v.strip().lower() for v in val_str.split(',')]
        all_values.update(vals)
    
    # Create a new column for each value in specified column
    for value in all_values:
        col_name = f"{column_name}: {value}"
        # in here, populate the one-hot column
        frame[col_name] = frame[column_name].apply(lambda x: 1 if value in x else 0)

    # Remove the original column from the new frame
    new_frame = frame.drop(columns=[column_name])
    
    return new_frame

unique_data = one_hot(unique_data, 'col_02')
unique_data = one_hot(unique_data, 'col_03')


def create_classifiers():
    logistic = sklearn.linear_model.LogisticRegression()
    knn = sklearn.neighbors.KNeighborsClassifier(n_neighbors = 5)
    dt = sklearn.tree.DecisionTreeClassifier(max_depth = 10, random_state = 0)
    return [logistic, knn, dt]

my_classifiers = create_classifiers()
my_classifiers


def cross_fold_validation(classifier, frame, folds):
    # grab the y, and the x
    features = frame.copy()
    label = features['label']
    del features['label']

    # preprocess the data
    scaler = sklearn.preprocessing.MinMaxScaler()
    features = scaler.fit_transform(features)

    # and perform cross-validation
    return (sklearn.model_selection.cross_validate(classifier, features, y = label, cv = folds)['test_score']).tolist()

my_classifiers_scores = []
for classifier in my_classifiers:
    accuracy_scores = cross_fold_validation(classifier, unique_data, 5)
    my_classifiers_scores.append(accuracy_scores)
    print("Classifier: %s, Accuracy: %s." % (type(classifier).__name__, accuracy_scores))


def significance_test(a_values, b_values, p_value):
    return stats.ttest_ind(a_values, b_values)[1] < p_value

for i in range(len(my_classifiers)):
    for j in range(i + 1, len(my_classifiers)):
        significant = significance_test(my_classifiers_scores[i], my_classifiers_scores[j], 0.10)
        print("%s vs %s: %s" % (type(my_classifiers[i]).__name__,
                                type(my_classifiers[j]).__name__, significant))
