var submitButton=document.getElementById('save');
submitButton.addEventListener('click',async function(){
    // console.log('Submitting');
    // const response = await post('/application',);
    // // waits until the request completes...
    // console.log(response);
    // expected output: "resolved"
    var nric=document.getElementById('nric').value;
    const IP_ADDRESS='http://172.20.10.4'
    const API_KEY_APPLICANT='AYuRJuTIMUUfqYAANsTGJlxX8YVkCwTT'
    const url=IP_ADDRESS.concat(':8000/applicant/',nric,'?apikey=',API_KEY_APPLICANT)
    // var url='http://localhost:8000/applicant_details/'.concat(nric);
    const profile = {
        nric:document.getElementById('nric').value,
        applicant_name:document.getElementById('applicant_name').value,
        sex:document.getElementById('sex').value,
        race:document.getElementById('race').value,
        nationality:document.getElementById('nationality').value,
        dob:document.getElementById('dob').value,
        email:document.getElementById('email').value,
        mobile_no:document.getElementById('mobile_no').value,
        address:document.getElementById('address').value,
        grades:document.getElementById('grades').value,
        userid:document.getElementById('userid').value
      }
        console.log(JSON.stringify(profile));
        const settings = {
            method: 'POST',
            body: JSON.stringify(profile), 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        console.log(url);
        try {
            const fetchResponse = await fetch(url, settings);
            const data = await fetchResponse.json();
            if (data.code==400){
                alert('You have not made any changes to your profile.')
            } else {
                window.location.href = "http://localhost:3001/applications";
            }
        } catch (e) {
            console.log(e);
        }   

});
if (authLevel == 'L0') {
    $("#formPerson").show();
} else {
    $("#formPerson").hide();
}
