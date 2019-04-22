import pandas as pd
import numpy as np
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import plotly.plotly as py
import plotly.graph_objs as go
import sqlalchemy
from sqlalchemy import create_engine, MetaData, inspect, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Numeric, Text, Float
from sqlalchemy.sql import text
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base
from flask import Flask, jsonify, render_template, request, redirect, url_for
import json
import pprint
import urllib
import datetime
from dateutil.parser import parse
from flask_sqlalchemy import SQLAlchemy
from collections import defaultdict, ChainMap, OrderedDict
pd.options.mode.chained_assignment = None
import humanize
import requests



#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False



#################################################
# Aeris Weather API Keys
#################################################

####### FOR LOCAL USE ONLY ########:
# from APIkeys import client_id, client_secret
# CLIENT_ID = client_id
# CLIENT_SECRET = client_secret

####### FOR HEROKU DEPLOYMENT ONLY ########:
CLIENT_ID = os.environ.get('client_id')
CLIENT_SECRET = os.environ.get('client_secret')



#################################################
# Database Setup
#################################################
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///Global_Land_Temps.sqlite"
db = SQLAlchemy(app)
engine = db.create_engine("sqlite:///Global_Land_Temps.sqlite", echo=False)
session = Session(engine)

class Disasters(db.Model):
    __tablename__ = 'US_Disasters'
    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    Disaster = db.Column(db.String)
    BeginDate = db.Column(db.Integer)
    EndDate = db.Column(db.Integer)
    Total_CPI_Adjusted_Cost_Millions = db.Column(db.Float)
    Deaths = db.Column(db.Integer)


class CLTtemps(db.Model):
    __tablename__ = 'CLT_AvgTemp_Forecasts'
    ID = db.Column(db.Integer, primary_key=True)
    Date = db.Column(db.String)
    ForecastTemps = db.Column(db.Float)	
	
db.create_all()
db.session.commit()



#################################################
# Flask Routes/Functions
#################################################
@app.route("/")
def index():
	"""Render Home Page"""
	obs_dict = {}	
	global aerisTemp
	global respTypes
	endpt1 = '/observations?p=charlotte%2Cnc'
	endpt2 = '/observations/summary?p=charlotte%2Cnc'
	aerisURL = "http://api.aerisapi.com/batch/charlotte,nc?requests=/observations,/observations/summary&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET
	request = urllib.request.urlopen(aerisURL)
	response = request.read()
	info = json.loads(response)
	if info['success']:
		respTypes = info['response']['responses']
		if respTypes[0]['request'] == endpt1:
			resp = respTypes[0]
			obs = resp['response']
			ob = obs['ob']
			obs_dict.update(timestamp = str(ob['timestamp']))
			obs_dict.update(humidity = str(ob['humidity']))
			obs_dict.update(isDay = str(ob['isDay']))
			obs_dict.update(tempF = str(ob['tempF']))
			obs_dict.update(weatherPrimaryCoded = str(ob['weatherPrimaryCoded']))
			obs_dict.update(weatherShort = str(ob['weatherShort']))
		if respTypes[1]['request'] == endpt2:
			resp = respTypes[1]
			ob_sum = resp['response']
			periods = ob_sum[0]['periods']
			aerisTemp = periods[0]['summary']['temp']['avgF']
			precipMM = periods[0]['summary']['precip']['totalMM']
			obs_dict.update(avgTempF = str(aerisTemp))
			obs_dict.update(precipMM = str(precipMM))
	else:
		print("An error occurred: %s" % (info['error']['description']))
		respTypes = {}
		request.close()
			
	query_statement1 = "SELECT Disaster, Total_CPI_Adjusted_Cost_Millions, Deaths FROM US_Disasters"
	df_disasters = pd.read_sql_query(query_statement1, db.session.bind)
	top10c = df_disasters.copy()
	top10d = df_disasters.copy()	
	top10c.drop(['Deaths'], axis=1, inplace=True)
	top10c.Total_CPI_Adjusted_Cost_Millions = top10c.Total_CPI_Adjusted_Cost_Millions.round()
	top10c = top10c.nlargest(10, 'Total_CPI_Adjusted_Cost_Millions')
	top10c['Cost_Sum_Totals'] = top10c.groupby(['Disaster'])['Total_CPI_Adjusted_Cost_Millions'].transform(sum)
	top10c.drop(['Total_CPI_Adjusted_Cost_Millions'], axis=1, inplace=True)
	newtop10c = top10c.drop_duplicates(subset=['Disaster'])
	newtop10c['Percentage'] = (100*(newtop10c.Cost_Sum_Totals / newtop10c.Cost_Sum_Totals.sum())).round()
	newtop10c.columns = ['label', 'total', 'value']
	dataOpt1 = newtop10c.to_dict(orient='records')
	top10d.drop(['Total_CPI_Adjusted_Cost_Millions'], axis=1, inplace=True)
	top10d = top10d.nlargest(10, 'Deaths')
	top10d['Death_Sum_Totals'] = top10d.groupby(['Disaster'])['Deaths'].transform(sum)
	top10d.drop(['Deaths'], axis=1, inplace=True)
	newtop10d = top10d.drop_duplicates(subset=['Disaster'])
	newtop10d['Percentage'] = (100*(newtop10d.Death_Sum_Totals / newtop10d.Death_Sum_Totals.sum())).round()
	newtop10d.columns = ['label', 'total', 'value']
	dataOpt2 = newtop10d.to_dict(orient='records')
				
	d = datetime.date.today()
	searchDate = str(d.year) + '-' + f"{d:%m}" + '-' + f"{d:%d}"
	result = db.session.query(CLTtemps).filter(CLTtemps.Date == searchDate)
	for row in result.all(): 
		temp2 = row.ForecastTemps	
	temp2 = (round(temp2,0))
	tempDiff = abs(aerisTemp - temp2)
	if tempDiff > 18: #18 is the current max on d3 gauge
		difference = 18.5
	else:
		difference = tempDiff
	
	return render_template("index.html", data=(obs_dict,dataOpt1,dataOpt2,difference,temp2))

	
	
@app.route("/projInfo/national")
def about1():
	"""Render About Sub Page1"""
	query_statement = "Select * from US_Disasters"
	df = pd.read_sql_query(query_statement, db.session.bind)
	df['Years'] = df.apply(year_range, axis=1)
	df1 = df.copy()
	df2 = df.copy()
	df3C = df.copy()
	df3D = df.copy()
	
	df1['Cost_Sum_Totals'] = df1.groupby(['Years','Disaster'])['Total_CPI_Adjusted_Cost_Millions'].transform(sum)
	df1.Cost_Sum_Totals = df1.Cost_Sum_Totals.round()
	df1.drop(['id', 'BeginDate', 'EndDate', 'Total_CPI_Adjusted_Cost_Millions', 'Deaths', 'Name'], axis=1, inplace=True)
	df1 = df1.drop_duplicates(subset=['Disaster','Cost_Sum_Totals'])
	newdf1 = df1.set_index(['Years'], inplace=False)
	costData = []
	for item, group in newdf1.groupby(level=0):
		d = dict(zip(newdf1.index.names, [item]))
		d['event'] = dict(zip(group['Disaster'], group['Cost_Sum_Totals']))
		costData.append(d)

	df2['Death_Sum_Totals'] = df2.groupby(['Years','Disaster'])['Deaths'].transform(sum)
	df2.drop(['id', 'BeginDate', 'EndDate', 'Total_CPI_Adjusted_Cost_Millions', 'Deaths', 'Name'], axis=1, inplace=True)
	df2 = df2.drop_duplicates(subset=['Disaster','Death_Sum_Totals'])
	newdf2 = df2.set_index(['Years'], inplace=False)
	deathData = []
	for item, group in newdf2.groupby(level=0):
		d = dict(zip(newdf2.index.names, [item]))
		d['event'] = dict(zip(group['Disaster'], group['Death_Sum_Totals']))
		deathData.append(d)
	
	df3C.drop(['id', 'Disaster', 'BeginDate', 'EndDate', 'Deaths', 'Years'], axis=1, inplace=True)
	df3C.Total_CPI_Adjusted_Cost_Millions = df.Total_CPI_Adjusted_Cost_Millions.round()
	df3C = df3C.nlargest(10, 'Total_CPI_Adjusted_Cost_Millions')
	df3C.columns = ['label', 'value']
	dataOpt1 = df3C.to_dict(orient='records')

	df3D.drop(['id', 'Disaster', 'BeginDate', 'EndDate', 'Total_CPI_Adjusted_Cost_Millions', 'Years'], axis=1, inplace=True)
	df3D = df3D.nlargest(10, 'Deaths')
	df3D.columns = ['label', 'value']
	dataOpt2 = df3D.to_dict(orient='records')  
	
	return render_template("about1.html", data=(costData,deathData,dataOpt1,dataOpt2))


	
@app.route("/projInfo/local")
def about2():
	"""Render About Sub Page2"""
	return render_template("about2.html")
	

	
@app.route("/glossary")
def glossary():
	"""Render Glossary Page"""
	return render_template("glossary.html")	
	

	
@app.route("/references")
def references():
	"""Render References Page"""
	return render_template("references.html")
	
	
	
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404
	
	

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('500.html'), 500	
	
	

def year_range (row):
    if (row['EndDate'] > 19799999) & (row['EndDate'] < 19850000):	
        return "1980-1984"
    if (row['EndDate'] > 19849999) & (row['EndDate'] < 19900000):
        return "1985-1989"
    if (row['EndDate'] > 19899999) & (row['EndDate'] < 19950000):
        return "1990-1994"
    if (row['EndDate'] > 19949999) & (row['EndDate'] < 20000000):
        return "1995-1999"
    if (row['EndDate'] > 19999999) & (row['EndDate'] < 20050000):
        return "2000-2004"
    if (row['EndDate'] > 20049999) & (row['EndDate'] < 20100000):
        return "2005-2009"
    if (row['EndDate'] > 20099999) & (row['EndDate'] < 20150000):
        return "2010-2014"	  
    return "2015-2018"	
	
	
	
if __name__ == '__main__':
    app.run(debug=False)
	
	
