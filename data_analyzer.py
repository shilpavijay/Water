from flask import Flask
app = Flask(__name__)

@app.route('/')
def test():
	return render_template("index.html")