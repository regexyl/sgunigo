from flask import Flask, request, jsonify
from flask_cors import CORS

import os, sys

import requests
from invokes import invoke_http

app = Flask(__name__)
CORS(app)

applicant_details_URL = "http://localhost:5000/applicant_details"
application_URL = "http://localhost:5001/application"
activity_log_URL = "http://localhost:5003/activity_log"
error_URL = "http://localhost:5004/error"


@app.route("/place_application", methods=['POST'])
def place_application():
    # Simple check of input format and data of the request are JSON
    if request.is_json:
        try:
            application1 = request.get_json()
            print("\nReceived an order in JSON:", application1)

            # do the actual work
            # 1. Send application info
            result = processPlaceApplication(application1)
            return jsonify(result), result["code"]

        except Exception as e:
            # Unexpected error in code
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "place_application.py internal error: " + ex_str
            }), 500

    # if reached here, not a JSON request.
    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400


def processPlaceApplication(application1):
    # 2. Send the application info 
    # Invoke the application microservice
    print('\n-----Invoking order microservice-----')
    application_result = invoke_http(application_URL, method='POST', json=application1)
    print('order_result:', application_result)

    # 4. Record new application
    # record the activity log anyway
    print('\n\n-----Invoking activity_log microservice-----')
    invoke_http(activity_log_URL, method="POST", json=application_result)
    print("\n Application sent to activity log.\n")
    # - reply from the invocation is not used;
    # continue even if this invocation fails

    # Check the application result; if a failure, send it to the error microservice.
    code = application_result["code"]
    if code not in range(200, 300):

        # Inform the error microservice
        print('\n\n-----Invoking error microservice as order fails-----')
        invoke_http(error_URL, method="POST", json=application_result)
        # - reply from the invocation is not used; 
        # continue even if this invocation fails
        print("Application status ({:d}) sent to the error microservice:".format(
            code), application_result)

        # 7. Return error
        return {
            "code": 500,
            "data": {"application_result": application_result},
            "message": "Application creation failure sent for error handling."
        }


    # 7. Return created order, 
    return {
        "code": 201,
        "data": {
            "application_result": application_result,
        }
    }


# Execute this program if it is run as a main script (not by 'import')
if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) +
          " for placing an application...")
    app.run(host="0.0.0.0", port=5100, debug=True)
    # Notes for the parameters:
    # - debug=True will reload the program automatically if a change is detected;
    #   -- it in fact starts two instances of the same flask program,
    #       and uses one of the instances to monitor the program changes;
    # - host="0.0.0.0" allows the flask program to accept requests sent from any IP/host (in addition to localhost),
    #   -- i.e., it gives permissions to hosts with any IP to access the flask program,
    #   -- as long as the hosts can already reach the machine running the flask program along the network;
    #   -- it doesn't mean to use http://0.0.0.0 to access the flask program.
