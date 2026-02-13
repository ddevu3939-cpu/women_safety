// Load saved contacts when page opens
window.onload = function() {
    loadContacts();
};

function addContact() {
    let name = document.getElementById("name").value;
    let number = document.getElementById("number").value;

    if(name === "" || number === "") {
        alert("Enter both name and number");
        return;
    }

    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.push({name, number});
    localStorage.setItem("contacts", JSON.stringify(contacts));

    loadContacts();
    alert("Contact Saved!");

    document.getElementById("name").value = "";
    document.getElementById("number").value = "";
}

function loadContacts() {
    let contactList = document.getElementById("contactList");
    contactList.innerHTML = "";

    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    contacts.forEach(contact => {
        let option = document.createElement("option");
        option.value = contact.number;
        option.text = contact.name + " (" + contact.number + ")";
        contactList.add(option);
    });
}

function activateSOS() {
    let number = document.getElementById("contactList").value;

    if(!number) {
        alert("Select a contact first!");
        return;
    }
    sendSOS();

    navigator.geolocation.getCurrentPosition(function(position){
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let locationLink = "https://www.google.com/maps?q=" + lat + "," + lon;

        let message = "I am in danger, help needed! My location: " + locationLink;

        window.location.href = "sms:" + number + "?body=" + encodeURIComponent(message);
    });

    alert("SOS Activated!");
}

function callPolice() {
    window.location.href = "tel:112";
}

function callCyber() {
    window.location.href = "tel:1930";
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(function(position){
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let locationLink = "https://www.google.com/maps?q=" + lat + "," + lon;

        document.getElementById("status").innerHTML =
            "<a href='" + locationLink + "' target='_blank'>View Live Location</a>";
    });
}

// Simple AI Assistant
function aiAssistant() {
    let input = document.getElementById("userInput").value.toLowerCase();
    let chatBox = document.getElementById("chatBox");

    let response = "";

    if(input.includes("night")) {
        response = "Avoid isolated roads, share live location with trusted contacts, and stay in well-lit areas.";
    }
    else if(input.includes("cab")) {
        response = "Verify driver details, share trip info, and sit in the back seat.";
    }
    else if(input.includes("travel")) {
        response = "Inform someone before travel and keep emergency contacts ready.";
    }
    else {
        response = "Stay alert, trust your instincts, and use SOS if needed.";
    }

    chatBox.innerHTML += "<b>You:</b> " + input + "<br>";
    chatBox.innerHTML += "<b>AI:</b> " + response + "<br><br>";

    document.getElementById("userInput").value = "";
}




// function sendSOS() {
//     fetch("http://localhost:3000/send-sms2", {   // changed endpoint
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             to: "+918075594879",
//             message: "I am in danger, help needed!"
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             alert("SMS Sent Successfully!");
//         } else {
//             alert("Failed to send SMS");
//         }
//     })
//     .catch(error => {
//         console.error("Error:", error);
//         alert("Server error");
//     });
// }



//version03
function sendSOS() {

    const contacts = JSON.parse(localStorage.getItem("contacts"));

    if (!contacts || contacts.length === 0) {
        alert("No contacts saved!");
        return;
    }

    contacts.forEach(contact => {

        // Skip invalid numbers
        if (!contact.number || contact.number.length < 10) return;

        fetch("http://localhost:3000/send-sms2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                to: "+91" + contact.number,  // add country code
                message: "I am in danger, help needed!"
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("Sent to:", contact.name, data);
        })
        .catch(err => {
            console.error("Error sending to:", contact.name, err);
        });

    });

    alert("SOS sent to all contacts!");
}
