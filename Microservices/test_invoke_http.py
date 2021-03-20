#test_invoke_http.py
from invokes import invoke_http

# invoke book microservice to get all applicants
results = invoke_http("http://127.0.0.1:5000/applicant_details", method='GET')

print( type(results) )
print()
print( results )

# invoke book microservice to create a applicant
nric = 'S9704969C'
applicant_name = { "applicant_name": "Test Created" }
create_results = invoke_http(
        "http://127.0.0.1:5000/applicant_details/" + nric, method='POST', 
        json=applicant_name
    )

print()
print( create_results )
