const dotenv = require("dotenv");
dotenv.config({ path: `./.env` });
IP_ADDRESS=process.env.IP_ADDRESS;
API_KEY_APPLICANT=process.env.API_KEY_APPLICANT;
console.log(IP_ADDRESS);


var submitButton=document.getElementById('save');
submitButton.addEventListener('click',async function(){
    // console.log('Submitting');
    // const response = await post('/application',);
    // // waits until the request completes...
    // console.log(response);
    // expected output: "resolved"
    var nric=document.getElementById('uinfin').value;
    var url=IP_ADDRESS.concat('/applicant/').concat(nric).concat('?apikey=').concat(API_KEY_APPLICANT);
    data={
        nric:document.getElementById('nric').value,
        applicant_name:document.getElementById('name').value,
        email:document.getElementById('email').value,
        mobile_no:document.getElementById('mobileno').value,
        grades:document.getElementById('grades').value,
        sex:document.getElementById('sex').value,
        dob:document.getElementById('dob').value,
        address:document.getElementById('regadd').value,
        nationality:document.getElementById('nationality').value,
        race:document.getElementById('race').value,
        userid:document.getElementById('userid').value
      }
        console.log(JSON.stringify(data));
        const settings = {
            method: 'POST',
            body: JSON.stringify(data), 
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
