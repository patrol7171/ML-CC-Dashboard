import pandas as pd
import numpy as np
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import plotly.plotly as py
import plotly.graph_objs as go
import sqlalchemy
from sqlalchemy import create_engine, MetaData, inspect
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
def home():
    """Render Home Page."""
    return render_template("index.html")



@app.route("/tables")
def tables():
	 # """Render Sample Tables page"""
	return render_template("table.html")


@app.route("/charts")
def charts():
	 # """Render Sample Charts Page"""
	return render_template("charts.html")



@app.route("/Deaths")
def death_data():
    """Return top 25 most deadly"""
    query_statement = db.session.query(Disasters).order_by(Disasters.Deaths.desc()).limit(10).statement
    df = pd.read_sql_query(query_statement, db.session.bind)	
    plot_trace = {
            "x": df["Name"].values.tolist(),
            "y": df["Deaths"].values.tolist(),
            "type": "bar"
    }
    return jsonify(plot_trace)


@app.route("/Total_CPI_Adjusted_Cost_Millions")
def cost_data():
    """Return top 25 highest cost"""
    query_statement = db.session.query(Disasters).order_by(Disasters.Total_CPI_Adjusted_Cost_Millions.desc()).limit(10).statement
    df = pd.read_sql_query(query_statement, db.session.bind)	
    plot_trace = {
            "x": df["Name"].values.tolist(),
            "y": df["Total_CPI_Adjusted_Cost_Millions"].values.tolist(),
            "type": "bar"
    }
    return jsonify(plot_trace)



# @app.route("/Disaster")
# def all_data():
#     """Return events by disaster"""
#     query_statement = db.session.query(Disasters).filter_by(Disasters.Disaster='Severe Storm').statement
#     df = pd.read_sql_query(query_statement, db.session.bind)	
#     plot_trace = {
#             "x": df["Disaster"].values.tolist(),
#             "y": df["Total_CPI_Adjusted_Cost_Millions"].values.tolist(),
#             "type": "bar"
#     }
#     return jsonify(plot_trace)

	
if __name__ == '__main__':
    app.run(debug=True)
	
	
