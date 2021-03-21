from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy 
from flask_cors import CORS
from os import environ

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost:3306/applicant_details'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
 
db = SQLAlchemy(app)

CORS(app)

class applicant_details(db.Model):
    __tablename__ = 'applicant_details'
 
    nric = db.Column(db.String(9), primary_key=True)
    applicant_name = db.Column(db.String(100), nullable=False)
 
    def __init__(self, nric, applicant_name):
        self.nric = nric
        self.applicant_name = applicant_name

 
    def json(self):
        return {"nric": self.nric, "applicant_name": self.applicant_name}

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


@app.route("/applicant_details/<string:nric>", methods=['POST'])
def create_applicant(nric):
    if (applicant_details.query.filter_by(nric=nric).first()):
        return jsonify(
            {
                "code": 400,
                "data": {
                    "nric": nric
                },
                "message": "Applicant already exists."
            }
        ), 400
 
    data = request.get_json()
    applicant = applicant_details(nric, **data)
 
    try:
        db.session.add(applicant)
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
    app.run(port=5000, debug=True)