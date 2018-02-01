from flask import Flask
from flask import render_template
import pandas as pd
app = Flask(__name__)



def getData():
	try:
		dfRawData = pd.read_csv("static/data.csv")
		dfRawData.set_index('Country', inplace=True)
		df = dfRawData.fillna(0)
		df.drop(df.index[0], inplace=True) #drops row no. 1
		df.drop(df.index[2:65],inplace=True)
		df.drop(df.index[40:],inplace=True)
		#drop column by name:
		df.drop([col for col in df.columns if ".2" not in col and "Country" not in col], axis=1,inplace=True)
		df.drop(df.columns[6:],axis=1,inplace=True)
		df.rename(columns=lambda x: x.replace('.2',''), inplace=True)
	except Exception as e:
		print(e)
	return df

@app.route('/getJson/')
def getJson(df):
	df.to_json(orient="records")
	return 1

def generateExcel(df):
	df.to_csv("static/dataRefined.csv")

@app.route('/')
def main():
	df = getData()
	generateExcel(df)
	return render_template("index.html")
