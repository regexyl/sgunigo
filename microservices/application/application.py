#!/usr/bin/env python3
# The above shebang (#!) operator tells Unix-like environments
# to run this file as a python3 script

import os
from os.path import join, dirname
from dotenv import load_dotenv
from sqlalchemy.sql.functions import user
from sqlalchemy import create_engine
from sqlalchemy.sql import func
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_utils import database_exists, create_database
from flask_cors import CORS
from os import environ

from datetime import datetime

app = Flask(__name__)
CORS(app)
tablename = 'application'

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MYSQL_URI = 'mysql+mysqlconnector://root' + os.getenv('MYSQL_PASSWORD') + '@localhost:' + os.getenv('MYSQL_PORT') + '/' + tablename
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or MYSQL_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 3600}

db = SQLAlchemy(app)

class application(db.Model):
    __tablename__ = tablename

    application_id = db.Column(db.Integer, primary_key=True, nullable=False) # SQLAlchemy auto sets first Integer in PK column to autoincrement=True
    nric = db.Column(db.String(10), nullable=False)
    applicant_name = db.Column(db.String(100), nullable=False)
    sex = db.Column(db.String(10), nullable=False)
    race = db.Column(db.String(10), nullable=False)
    nationality= db.Column(db.String(100), nullable=False)
    dob = db.Column(db.String(10), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    mobile_no = db.Column(db.String(12), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    grades = db.Column(db.String(10), nullable=False)
    university = db.Column(db.String(100), nullable=False)
    course1 = db.Column(db.String(100), nullable=False)
    course2 = db.Column(db.String(100), nullable=False)
    course3 = db.Column(db.String(100), nullable=False)
    statement = db.Column(db.String(1000), nullable=False)
    status = db.Column(db.String(10), nullable=False, server_default='UNPAID')
    created = db.Column(db.DateTime, nullable=False, server_default=func.now())
    modified = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
    userid = db.Column(db.String(30), nullable=False)

    def json(self):
        dto = {
            "application_id": self.application_id,
            "nric": self.nric, 
            "applicant_name": self.applicant_name,
            "sex": self.sex,
            "race": self.race,
            "nationality": self.nationality,
            "dob": self.dob,
            "email": self.email,
            "mobile_no": self.mobile_no,
            "address": self.address,
            "grades": self.grades,
            "university": self.university,
            "course1": self.course1,
            "course2": self.course2,
            "course3": self.course3,
            "statement": self.statement,
            "status": self.status,
            "created": self.created,
            "modified": self.modified,
            "userid": self.userid
        }

        return dto

# Create new database if it does not exist
if not database_exists(app.config['SQLALCHEMY_DATABASE_URI']):
    create_database(app.config['SQLALCHEMY_DATABASE_URI'])
    print("New database created: " + database_exists(app.config['SQLALCHEMY_DATABASE_URI']))
    print("Database location: " + app.config['SQLALCHEMY_DATABASE_URI'])
else:
    print("Database at " + app.config['SQLALCHEMY_DATABASE_URI'] + " already exists")

# Create new table if it does not exist
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])  # Access the DB Engine
if not engine.dialect.has_table(engine, tablename):  # If table don't exist, Create.
    db.drop_all()
    db.create_all()

@app.route("/application")
def get_all():
    application_list = application.query.all()
    if len(application_list):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "Applications": [application.json() for application in application_list]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no applications."
        }
    ), 404


@app.route("/application/<int:application_id>")
def find_by_application_id(application_id):
    application_find = application.query.filter_by(application_id=application_id).first()
    if application_find:
        return jsonify(
            {
                "code": 200,
                "data": application_find.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "data": {
                "application_id": application_id
            },
            "message": "Application not found."
        }
    ), 404
# Get Individual university PAID applications
@app.route("/application/<string:university>")
def find_by_university(university):
    application_list = application.query.filter_by(university=university, status="PAID")
    if application_list:
        return jsonify(
            {
                "code": 200,
                "Applications": [application.json() for application in application_list]
            }
        )
    return jsonify(
        {
            "code": 404,
            "data": {
                "application_id": university
            },
            "message": "Application not found."
        }
    ), 404

# Get individual applicant's PAID applications
@app.route("/application/paid/<string:userid>")
def find_by_userid_paid(userid):
    applications = application.query.filter_by(userid=userid, status="PAID")
    if applications:
        return jsonify(
            {
                "code": 200,
                "applications": [application.json() for application in applications]
            }
        )
    return jsonify(
        {
            "code": 404,
            "data": {
                "application_id": userid
            },
            "message": "Application not found."
        }
    ), 404

# Get individual applicant's UNPAID applications
@app.route("/application/unpaid/<string:userid>")
def find_by_userid_unpaid(userid):
    applications = application.query.filter_by(userid=userid, status="UNPAID")
    if applications:
        return jsonify(
            {
                "code": 200,
                "applications": [application.json() for application in applications]
            }
        )
    return jsonify(
        {
            "code": 404,
            "data": {
                "application_id": userid
            },
            "message": "Application not found."
        }
    ), 404


@app.route("/application", methods=['POST'])
def create_application():
    data = request.get_json(force=True)
    userid1=data["userid"]
    university1=data["university"]
    if (application.query.filter_by(university=university1, userid=userid1).first()):
        return jsonify(
            {
                "code": 400,
                "data": {
                    "userid": userid1,
                    "university": university1
                },
                "message": "Application already exists."
            }
        ), 400
    application_post = application(**data)

    try:
        db.session.add(application_post)
        db.session.commit()
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "message": "An error occurred while creating application. " + str(e)
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": application_post.json()
        }
    ), 201

#Update Application status to "PAID"
@app.route("/application/<string:application_id>", methods=['PUT'])
def update_application(application_id):
    try:
        application_put = application.query.filter_by(application_id=application_id).first()
        if not application_put:
            return jsonify(
                {
                    "code": 404,
                    "data": {
                        "application_id": application_id
                    },
                    "message": "application not found."
                }
            ), 404

        # update status
        application_put.status = 'PAID'
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "data": application_put.json()
            }
        ), 200
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "application_id": application_id
                },
                "message": "An error occurred while updating the application. " + str(e)
            }
        ), 500

#Update ALL application statuses to "PAID"
@app.route("/application/all/<string:userid>", methods=['PUT'])
def update_all_applications(userid):
    try:
        unpaid_applications = application.query.filter_by(userid=userid, status="UNPAID")
        if not unpaid_applications:
            return jsonify(
                {
                    "code": 404,
                    "data": {
                        "userid": userid
                    },
                    "message": "You have no unpaid applications."
                }
            ), 404

        # update status
        # for application in unpaid_applications:
        #     application.status = 'PAID'
        unpaid_applications.update({'status':'PAID'})
        db.session.commit()
        print(unpaid_applications.json())
        return jsonify(
            {
                "code": 200,
                "data": unpaid_applications.json()
            }
        ), 200
    except Exception as e:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "userid": userid
                },
                "message": "An error occurred while updating the application. " + str(e)
            }
        ), 500


if __name__ == '__main__':
    print("This is flask for " + os.path.basename(__file__) + ": manage application ...")
    app.run(host='0.0.0.0', port=5001, debug=True)
