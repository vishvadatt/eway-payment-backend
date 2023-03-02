const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const rapid = require("eway-rapid");

app.post("/test", (req, res) => {
 
  var key = "44DD7Cs8c0Zf95+6ihfMgN04LTZ8srglTZtThAU8OX7nIpZ5vWo7/q+ws8eryOWKN4uBHx";
  const password = "OVWduKnI";
  const endpoint = "Sandbox"; // use Production when you go live

  // Create the eWAY Client
  var client = rapid.createClient(key, password, endpoint);

  client
    .createTransaction(rapid.Enum.Method.RESPONSIVE_SHARED, {
      Customer: {
        Reference: "A12345",
        Title: "Mr.",
        FirstName: "John",
        LastName: "Smith",
        CompanyName: "Demo Shop 123",
        JobDescription: "Developer",
        Street1: "Level 5",
        Street2: "369 Queen Street",
        City: "Sydney",
        State: "NSW",
        PostalCode: "2000",
        Country: "au",
        Phone: "09 889 0986",
        Mobile: "09 889 6542",
        Email: "demo@example.org",
        Url: "http://www.ewaypayments.com",
      },

      Payment: {
        TotalAmount: 5000,
      },
      // Change these to your server
      RedirectUrl: "https://www.google.com/",
      CancelUrl: "https://www.eway.com.au/",
      TransactionType: "Purchase",
    })
    .then(function (response) {
      console.log("response...", response);
      if (response.getErrors().length == 0) {
        var redirectURL = response.get("SharedPaymentUrl");
        console.log("redirectURL..",redirectURL);
        console.log("success ok");
        return res
          .status(200)
          .json({ redirectURL: redirectURL, status: "Success" });
      } else {
        let errMsg = [];
        response.getErrors().map((error) => {
          // console.log("Response Messages: " + rapid.getMessage(error, "en"));
          errMsg.push(rapid.getMessage(error, "en"));
        });
        return res.status(400).json({ message: errMsg });
      }
    })
    .catch(function (reason) {
      let errMsg = [];
      response.getErrors().map((error) => {
        // console.log("Response Messages......: " + rapid.getMessage(error, "en"));
        errMsg.push(rapid.getMessage(error, "en"));
      });
      return res.status(400).json({ message: errMsg });
    });
});

app.listen(5000, () => {
  console.log("server running on 5000");
});
