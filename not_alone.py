import os
from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'mentalHealth')
COLLECTION_NAME = 'projects'

if MONGO_URI == "mongodb://localhost:27017":
    COLLECTION_NAME = 'employment'
else:
    COLLECTION_NAME = 'projects'

@app.route("/")
def index():
    """
    A Flask view to serve the main dashboard page.
    """
    return render_template("index_3.html")


@app.route("/real_stories")
def realStories():

    return render_template("real_stories.html")


@app.route("/charts")
def charts():

    return render_template("charts.html")


@app.route("/videos")
def videos():

    return render_template("videos.html")


@app.route("/mentalHealth/employment")
def mentalHealth_employment():
    """
    A Flask view to serve the project data from
    MongoDB in JSON format.
    """

    # A constant that defines the record fields that we wish to retrieve.
    FIELDS = {
        '_id': False, 'Year': True, 'Region': True,
        'Employment rate of people with mental illness': True, 'Employment rate of population': True,
        'Row Year': True    # ALTERATION - Row Year added
    }

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGO_URI) as conn:
        # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to 55000
        projects = collection.find(projection=FIELDS, limit=20000)
        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(projects))


if __name__ == "__main__":
    app.run(debug=True)