#!/usr/bin/env python3
# The above shebang (#!) operator tells Unix-like environments
# to run this file as a python3 script

import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy 
from sqlalchemy_utils import database_exists, create_database
from flask_cors import CORS
from os import environ

from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or 'mysql+mysqlconnector://root:root@localhost:${MYSQL_PORT}/application'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 299}

db = SQLAlchemy(app)


class application(db.Model):
    __tablename__ = 'application'

    application_id = db.Column(db.Integer, primary_key=True)
    nric = db.Column(db.String(10), nullable=False)
    applicant_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    contact_no = db.Column(db.String(8), nullable=False)
    grades = db.Column(db.String(10), nullable=False)
    university = db.Column(db.String(100), nullable=False)
    courses = db.Column(db.String(1000), nullable=False)
    statement = db.Column(db.String(1000), nullable=False)
    status = db.Column(db.String(10), nullable=False)
    created = db.Column(db.DateTime, nullable=False, default=datetime.now)
    modified = db.Column(db.DateTime, nullable=False,
                         default=datetime.now, onupdate=datetime.now)

    def json(self):
        dto = {
            "application_id": self.application_id,
            "nric": self.nric, 
            "applicant_name": self.applicant_name,
            "email": self.email,
            "contact_no": self.contact_no,
            "grades": self.grades,
            "university": self.university,
            "courses": self.courses,
            "statement": self.statement,
            "status": self.status,
            "created": self.created,
            "modified": self.modified
        }

        return dto

# Create new database if it does not exist
if not database_exists(app.config['SQLALCHEMY_DATABASE_URI']):
    create_database(app.config['SQLALCHEMY_DATABASE_URI'])
    print("New database created: " + database_exists(app.config['SQLALCHEMY_DATABASE_URI']))
    print("Database location: " + app.config['SQLALCHEMY_DATABASE_URI'])
else:
    print("Database at " + app.config['SQLALCHEMY_DATABASE_URI'] + " already exists")


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
            "message": "There are no Applications."
        }
    ), 404


@app.route("/application/<int:application_id>")
def find_by_application_id(application_id):
    application1 = application.query.filter_by(application_id=application_id).first()
    if application1:
        return jsonify(
            {
                "code": 200,
                "data": application1.json()
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

@app.route("/application/<string:university>")
def find_by_university(university):
    application_list = application.query.filter_by(university=university)
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


@app.route("/application", methods=['POST'])
def create_application():
    application_id = request.json.get('application_id', None)
    data = request.get_json()
    application1 = application(application_id=application_id, **data,status='NEW')

    try:
        db.session.add(application1)
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
            "data": application1.json()
        }
    ), 201

#Update Application status to "PAID"
@app.route("/application/<string:application_id>", methods=['PUT'])
def update_application(application_id):
    try:
        application1 = application.query.filter_by(application_id=application_id).first()
        if not application1:
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
        application1.status = 'PAID'
        db.session.commit()
        return jsonify(
            {
                "code": 200,
                "data": application1.json()
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


if __name__ == '__main__':
    print("This is flask for " + os.path.basename(__file__) + ": manage application ...")
    app.run(host='0.0.0.0', port=5001, debug=True)
