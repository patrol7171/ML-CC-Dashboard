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
from datetime import datetime
from dateutil.parser import parse
from flask_sqlalchemy import SQLAlchemy
from collections import defaultdict, ChainMap, OrderedDict


#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


#################################################
# Database Setup
#################################################
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///Global_Land_Temps.sqlite"
db = SQLAlchemy(app)


class Disasters(db.Model):
    __tablename__ = 'US_Disasters'

    id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String)
    Disaster = db.Column(db.String)
    BeginDate = db.Column(db.Integer)
    EndDate = db.Column(db.Integer)
    Total_CPI_Adjusted_Cost_Millions = db.Column(db.Float)
    Deaths = db.Column(db.Integer)

    def __repr__(self):
        return '<US_Disasters %r>' % (self.name)


# Create database tables
@app.before_first_request
def setup():
    db.create_all()

	
#################################################
# Flask Routes
#################################################

@app.route("/")
def index():
    """Render Home Page"""
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
		
    return render_template("index.html", data=(costData,deathData,dataOpt1,dataOpt2))

	
	
@app.route("/about")
def about():
	"""Render About Page"""
	return render_template("about.html")
	

	
@app.route("/references")
def references():
	"""Render References Page"""
	return render_template("references.html")

	

@app.route("/faq")
def faq():
	"""Render FAQ Page"""
	return render_template("faq.html")	
	

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
    app.run(debug=True)
	
	
