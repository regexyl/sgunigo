#!/usr/bin/env python3
# The above shebang (#!) operator tells Unix-like environments
# to run this file as a python3 script

import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy 
from flask_cors import CORS
from os import environ

from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or 'mysql+mysqlconnector://root:root@localhost:8889/admin_portal'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 299}

db = SQLAlchemy(app)


class admin_portal(db.Model):
    __tablename__ = 'admin_portal_application'

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

    def __init__(self, application_id, nric, applicant_name, email, contact_no, grades, university, courses, statement, status):
        self.application_id = application_id
        self.nric = nric
        self.applicant_name= applicant_name
        self.email = email
        self.contact_no = contact_no
        self.grades = grades
        self.university= university
        self.courses= courses
        self.statement= statement
        self.status=status


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
            "modified": self.modified,
            "created": self.created,
            "modified": self.modified
        }

        return dto



@app.route("/admin_portal_application")
def get_all():
    application_list = admin_portal.query.all()
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


@app.route("/admin_portal_application/<int:application_id>")
def find_by_application_id(application_id):
    application1 = admin_portal.query.filter_by(application_id=application_id).first()
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


@app.route("/admin_portal_application/<string:application_id>", methods=['POST'])
def create_application(application_id):
    if (admin_portal.query.filter_by(application_id=application_id).first()):
        return jsonify(
            {
                "code": 400,
                "data": {
                    "application_id": application_id
                },
                "message": "Applicant already exists."
            }
        ), 400

    data = request.get_json()
    application1 = admin_portal(application_id,**data,status='RECEIVED')

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

#PUT got error unsure how to do 
@app.route("/admin_portal_application/<string:application_id>", methods=['PUT'])
def update_application(application_id):
    try:
        application1 = admin_portal.query.filter_by(application_id=application_id).first()
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
        data = request.get_json()
        if data['status']:
            application1.status = application1['status']
            db.session.commit()
            return jsonify(
                {
                    "code": 200,
                    "data": admin_portal.json()
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
    app.run(host='0.0.0.0', port=5300, debug=True)
