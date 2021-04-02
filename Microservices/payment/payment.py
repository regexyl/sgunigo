import os
import settings
from sqlalchemy import create_engine
from sqlalchemy.sql import func
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy 
from sqlalchemy_utils import database_exists, create_database
from flask_cors import CORS
from os import environ
from datetime import datetime

app = Flask(__name__)

MYSQL_URI = 'mysql+mysqlconnector://root' + settings.MYSQL_PASSWORD + '@localhost:' + settings.MYSQL_PORT + '/payment'
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or MYSQL_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 299}
 
db = SQLAlchemy(app)


class payment_log(db.Model):
    __tablename__ = 'payment_log'
 
    payment_id = db.Column(db.Integer, primary_key=True, nullable=False) # SQLAlchemy auto sets first Integer in PK column to autoincrement=True
    application_id = db.Column(db.Integer, nullable=False)
    nric = db.Column(db.String(10), nullable=False)
    status = db.Column(db.String(10), nullable=False)
    created = db.Column(db.DateTime, nullable=False, server_default=func.now())
    modified = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
    

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
    data = request.get_json(force=True)
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