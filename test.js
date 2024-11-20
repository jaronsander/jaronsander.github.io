import fetch from "node-fetch"; 

export default defineComponent({
  async run({ steps, $ }) {
    let body = JSON.stringify({
      "emails": [
        { "email": steps.trigger.event.body.Email }  
      ],
      "name": steps.trigger.event.body.Full_Name,
      "telephones": [
        { "telephone": steps.trigger.event.body.Phone }
      ],
      "title": steps.trigger.event.body.Title,
      "address": {
        "city": steps.trigger.event.body.Mailing_City, 
        "region": steps.trigger.event.body.Mailing_State
      },
      "company": steps.trigger.event.body.Company, 
      "raw": {
        "website": steps.trigger.event.body.Website,
        "lifecyclestage": "marketingqualifiedlead",
      }
    });
    
    let config = {
      method: 'post',
      body: body,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTE1ZTBhYmFhYjQ3MjU5YzJjZjcxYzEiLCJ3b3Jrc3BhY2VfaWQiOiI2NTE1ZTBhYmFhYjQ3MjU5YzJjZjcxYzMiLCJpYXQiOjE2OTcwNDc3NjR9.dA8Z2EG4XC3EPoivYAKceB-8xR-u5RDchAR4rh89apQ'
      }
    };
    
    try {
      const response = await fetch('https://api.unified.to/crm/654d87c1ac25dba036cfdcd8/contact', config);
      const data = await response.json();
      return data;
    } catch(e) {
      console.log(e);
      
      const regex = /Existing ID:\s(\d+)/;
      const match = e.message.match(regex);
      
      if (match && match[1]) {
        const id = match[1];
        console.log("Existing ID:", id);
        
        config = {
          method: 'put',
          body: body,
          headers: {
            'accept': 'application/json',
            'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTE1ZTBhYmFhYjQ3MjU5YzJjZjcxYzEiLCJ3b3Jrc3BhY2VfaWQiOiI2NTE1ZTBhYmFhYjQ3MjU5YzJjZjcxYzMiLCJpYXQiOjE2OTcwNDc3NjR9.dA8Z2EG4XC3EPoivYAKceB-8xR-u5RDchAR4rh89apQ',
            'Content-Type': 'application/json'
          }
        };
        
        const url = `https://api.unified.to/crm/${steps.trigger.event.query.connection}/contact/${id}`;
        const response = await fetch(url, config);
        const data = await response.json();
        return data;
        
      } else {
        console.log("ID not found in the message.");
      }
    }
  }
});