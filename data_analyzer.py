from flask import Flask
from flask import render_template, request, Response
app = Flask(__name__)

@app.route('/')
def test():
	return render_template("index.html")