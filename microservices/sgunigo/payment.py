import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy 
from flask_cors import CORS
from os import environ

from datetime import datetime
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or 'mysql+mysqlconnector://root:root@localhost:8889/payment'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 299}
 
db = SQLAlchemy(app)


class payment_log(db.Model):
    __tablename__ = 'payment_log'
 
    payment_id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, nullable=False)
    nric = db.Column(db.String(10), nullable=False)
    status = db.Column(db.String(10), nullable=False)
    created = db.Column(db.DateTime, nullable=False, default=datetime.now)
    modified = db.Column(db.DateTime, nullable=False,
                         default=datetime.now, onupdate=datetime.now)
    

    def json(self):
        dto= {
            "payment_id": self.payment_id, 
            "application_id": self.application_id,
            "nric": self.nric,
            "status": self.status,
            "created": self.created,
            "modified": self.modified
            }
        return dto

@app.route("/payment")
def get_all():
    payment_list = payment_log.query.all()
    if len(payment_list):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "applicant_details": [payment.json() for payment in payment_list]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no applicants."
        }
    ), 404

 
@app.route("/payment/<string:payment_id>")
def find_by_payment_id(payment_id):
    payment = payment_log.query.filter_by(payment_id=payment_id).first()
    if payment:
        return jsonify(
            {
                "code": 200,
                "data": payment.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Payment Log not found."
        }
    ), 404

@app.route("/payment/appplication_id/<string:application_id>")
def find_by_application_id(application_id):
    payment = payment_log.query.filter_by(application_id=application_id).first()
    if payment:
        return jsonify(
            {
                "code": 200,
                "data": payment.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Payment Log not found."
        }
    ), 404


@app.route("/payment", methods=['POST'])
def create_application():
    payment_id = request.json.get('payment_id', None)
    data = request.get_json()
    payment = payment_log(payment_id=payment_id, **data,status='NEW')

    try:
        db.session.add(payment)
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
            "data": payment.json()
        }
    ), 201



if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5400, debug=True)