import pandas as pd
import numpy as np
import pymongo
import json
from pymongo import MongoClient

client = MongoClient('mongodb+srv://DestiNationGuide:5keyeDycE3qfsZPB@destinationguide.o0wsv1e.mongodb.net/')

db = client['DestiNationGuide']

collection_name = 'PlaceData'

collection = db[collection_name]
cursor_data = list(collection.find())

client.close()

first_document = cursor_data[0] if cursor_data else {}
column_names = list(first_document.keys())

Places_df = pd.DataFrame(cursor_data, columns=column_names)

Places_df['Activities'] = Places_df['Activities'].apply(lambda x: ', '.join(x))
Places_df['Amenities'] = Places_df['Amenities'].apply(lambda x: ', '.join(x))
Places_df['Category'] = Places_df['Category'].apply(lambda x: ', '.join(x))


Places_df['tags'] = Places_df['Category']+Places_df['Activities']+Places_df['Amenities']+Places_df['City']+Places_df['LongDescription']+Places_df['ShortDescription']+Places_df['BMTV']+Places_df['Timings']


from sklearn.feature_extraction.text import TfidfVectorizer


tfv = TfidfVectorizer(min_df=3,  max_features=None, 
            strip_accents='unicode', analyzer='word',token_pattern=r'\w{1,}',
            ngram_range=(1, 3),
            stop_words = 'english')

# Filling NaNs with empty string
Places_df['tags'] = Places_df['tags'].fillna('')


# Fitting the TF-IDF on the 'overview' text
tfv_matrix = tfv.fit_transform(Places_df['tags'])   

from sklearn.metrics.pairwise import sigmoid_kernel

# Compute the sigmoid kernel
sig = sigmoid_kernel(tfv_matrix, tfv_matrix)

# Reverse mapping of indices and movie titles
indices = pd.Series(Places_df.index, index=Places_df['Name']).drop_duplicates()

def give_rec(title, sig=sig):
    # Get the index corresponding to original_title
    idx = indices[title]

    # Get the pairwsie similarity scores 
    sig_scores = list(enumerate(sig[idx]))

    # Sort the movies 
    sig_scores = sorted(sig_scores, key=lambda x: x[1], reverse=True)

    # Scores of the 10 most similar movies
    sig_scores = sig_scores[0:11]

    # Movie indices
    movie_indices = [i[0] for i in sig_scores]

    title_name = Places_df['Name'].iloc[movie_indices]
    # likes = Projects_df['likes'].iloc[movie_indices]

    title_name_list = title_name.tolist()
    return (title_name_list)