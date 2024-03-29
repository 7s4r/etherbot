from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('localhost', 27017)
db = client.etherbot

@app.route('/')
def hello():
    items = db.etherbot.find()
    return 'Hello World! I have {} items.\n'.format(items)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
