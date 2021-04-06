import os
from os.path import join, dirname
from dotenv import load_dotenv
from sqlalchemy import create_engine
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy 
from sqlalchemy_utils import database_exists, create_database
from flask_cors import CORS
from os import environ

app = Flask(__name__)

CORS(app)
tablename = 'applicant_details'

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MYSQL_URI = 'mysql+mysqlconnector://root' + os.getenv('MYSQL_PASSWORD') + '@localhost:' + os.getenv('MYSQL_PORT') + '/' + tablename
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or MYSQL_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 3600}
 
db = SQLAlchemy(app)


class applicant_details(db.Model):
    __tablename__ = tablename
 
    nric = db.Column(db.String(10), nullable=False, primary_key=True)
    applicant_name = db.Column(db.String(100), nullable=False)
    sex = db.Column(db.String(10), nullable=False)
    race = db.Column(db.String(10), nullable=False)
    nationality= db.Column(db.String(100), nullable=False)
    dob = db.Column(db.String(10), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    mobile_no = db.Column(db.String(12), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    grades = db.Column(db.String(10), nullable=False)
    userid = db.Column(db.String(30), nullable=False)
 
    def __init__(self, nric, applicant_name, sex, race, nationality, dob, email, mobile_no, address, grades, userid):
        self.nric = nric
        self.applicant_name = applicant_name
        self.sex = sex
        self.race = race
        self.nationality = nationality
        self.dob = dob
        self.email = email
        self.mobile_no = mobile_no
        self.address = address
        self.grades = grades
        self.userid = userid

    def json(self):
        return {
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
            "userid": self.userid
            }

# Create new database if it does not exist
if not database_exists(app.config['SQLALCHEMY_DATABASE_URI']):
    create_database(app.config['SQLALCHEMY_DATABASE_URI'])
    print("New database created: " + str(database_exists(app.config['SQLALCHEMY_DATABASE_URI'])))
    print("Database location: " + app.config['SQLALCHEMY_DATABASE_URI'])
else:
    print("Database at " + app.config['SQLALCHEMY_DATABASE_URI'] + " already exists")

# Create new table if it does not exist
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])  # Access the DB Engine
if not engine.dialect.has_table(engine, tablename):  # If table don't exist, Create.
    db.drop_all()
    db.create_all()


@app.route("/applicant_details")
def get_all():
    applicant_list = applicant_details.query.all()
    if len(applicant_list):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "applicant_details": [applicant.json() for applicant in applicant_list]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "There are no applicants."
        }
    ), 404

 
@app.route("/applicant_details/<string:nric>")
def find_by_nric(nric):
    applicant = applicant_details.query.filter_by(nric=nric).first()
    if applicant:
        return jsonify(
            {
                "code": 200,
                "data": applicant.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Applicant not found."
        }
    ), 404

@app.route("/applicant_details/id/<string:userid>")
def find_by_userid(userid):
    applicant = applicant_details.query.filter_by(userid=userid).first()
    if applicant:
        return jsonify(
            {
                "code": 200,
                "data": applicant.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Applicant not found."
        }
    ), 404


@app.route("/applicant_details/<string:nric>", methods=['POST'])
def create_applicant(nric):
    data = request.get_json(force=True)
    applicant = applicant_details(**data)
 
    try:
        db.session.merge(applicant)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "nric": nric
                },
                "message": "An error occurred creating the Applicant."
            }
        ), 500
 
    return jsonify(
        {
            "code": 201,
            "data": applicant.json()
        }
    )

if __name__ == '__main__':
    print("This is flask for " + os.path.basename(__file__) + ": manage applicant ...")
    app.run(host='0.0.0.0',port=5000, debug=True)