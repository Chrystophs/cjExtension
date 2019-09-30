/*
* Setup Keys with Locations
* Atlassian Example URL https://example.atlassian.net/browse/
* These will also be used for Quick Links.
*/
    var keys = [
        {
            "key": "help",
            "location" : "https://zimtra.atlassian.net/browse/"
        }
    ]
    
// Listen for a Message from Popup.html & execute action and respond to popup.html.
chrome.runtime.onMessage.addListener(
    function(msg, sender, response) {
        switch (msg.type){
            case 'TO_TICKET':
                response("Going to issue: " + msg.ticket);
                goToTicket(msg.ticket, false);
                break;
            case 'TO_TICKET_NEW':
                response("Going to issue: " + msg.ticket);
                goToTicket(msg.ticket, true);
                break;
            case 'TO_LOCATION':
                response("Going to: " + msg.btn);
                goToLocation(msg.btn);
                break;
            default:
                response('unknown response');
                break;
        }
        return true;
    }
);

function goToTicket(ticket, newTab) {
    ticket = ticket.toLowerCase();
    var k = ticket.split("-");
    var l = keys.filter(i => {
        return i.key === k[0] ? i : "" ;
    })
    if(!newTab) {
        location = l[0].location + ticket;
    } else {
        window.open(l[0].location + ticket, "_blank");
    }
}
function goToLocation(text) {
    text = text.toLowerCase();
    var l = keys.filter(i => {
        return i.key === text ? i : "" ;
    })
    location = l[0].location;
}