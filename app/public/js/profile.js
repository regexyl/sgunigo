var submitButton=document.getElementById('save');
submitButton.addEventListener('click',async function(){
    // console.log('Submitting');
    // const response = await post('/application',);
    // // waits until the request completes...
    // console.log(response);
    // expected output: "resolved"
    var nric=document.getElementById('nric').value;
    var url='http://localhost:5000/applicant_details/'.concat(nric);
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
