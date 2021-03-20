#!/usr/bin/env python3
# The above shebang (#!) operator tells Unix-like environments
# to run this file as a python3 script

import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost:3306/application'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 299}

db = SQLAlchemy(app)


class application(db.Model):
    __tablename__ = 'application'

    application_id = db.Column(db.Integer, primary_key=True)
    nric = db.Column(db.String(10), nullable=False)
    grades = db.Column(db.String(10), nullable=False)
    status = db.Column(db.String(10), nullable=False)
    created = db.Column(db.DateTime, nullable=False, default=datetime.now)
    modified = db.Column(db.DateTime, nullable=False,
                         default=datetime.now, onupdate=datetime.now)

    def json(self):
        dto = {
            'application_id': self.application_id,
            'nric': self.nric,
            'grades': self.grades,
            'status': self.status,
            'modified': self.modified,
            'created': self.created,
            'modified': self.modified
        }

        return dto


# class Order_Item(db.Model):
#     __tablename__ = 'order_item'

#     item_id = db.Column(db.Integer, primary_key=True)
#     order_id = db.Column(db.ForeignKey(
#         'order.order_id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False, index=True)

#     book_id = db.Column(db.String(13), nullable=False)
#     quantity = db.Column(db.Integer, nullable=False)

#     # order_id = db.Column(db.String(36), db.ForeignKey('order.order_id'), nullable=False)
#     # order = db.relationship('Order', backref='order_item')
#     order = db.relationship(
#         'Order', primaryjoin='Order_Item.order_id == Order.order_id', backref='order_item')

#     def json(self):
#         return {'item_id': self.item_id, 'book_id': self.book_id, 'quantity': self.quantity, 'order_id': self.order_id}


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

#PUT got error unsure how to do 
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
        data = request.get_json()
        if data['status']:
            # application1.status = application1['status']
            db.session.commit()
            return jsonify(
                {
                    "code": 200,
                    "data": application.json()
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
