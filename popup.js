$(function() {
    popup.Init();
});
var contentVersion;

// Change to your own repository of data.
var d = "https://gist.githubusercontent.com/Chrystophs/9f5adf56cdeae52563294b0610547482/raw/f7f5f586f12c8586bd953c2ae015b12b775222e4/default-test.json"

var popup = {
    "Init": function() {
        // Scope
        var _this = this;
        
        fetch(d)
        .then(res => res.json())
        .then(res => {
            $("#content-version").html("<small><i>Content Version: " + res.data.version + "</i></small>");
            _this.buildQuickText(res.data.quickText);
            _this.activateButtons();
        })


    },
    "activateButtons": function() {
        
        // Navigate to ticket
        $("#to-ticket").on('click', function(e){
            e.preventDefault();
            var ticket = $("#ticket-number").val();
            if( ticket ) {
                sendMessage("#cj-output", {type: "TO_TICKET", ticket: ticket});
            } else {
                $('#cj-output').html("<div class='alert alert-danger'>Please input a value.</div>");
            }
            $("#ticket-number").val("");
        });

        // Navigate to ticket in New Tab
        $("#to-ticket-new").on('click', function(e){
            e.preventDefault();
            var ticket = $("#ticket-number").val();
            if( ticket ) {
                sendMessage("#cj-output", {type: "TO_TICKET_NEW", ticket: ticket});
            } else {
                $('#cj-output').html("<div class='alert alert-danger'>Please input a value.</div>");
            }
            $("#ticket-number").val("");
        });

        // To Location Buttons
        $(".to-desk").on('click', function(e){
            e.preventDefault();
            sendMessage("#cj-output", {type: "TO_LOCATION", btn: $(this).text().trim()});
        });
        
        // Quick Text Button
        $("#quick-text-btn").on('click', function(e){
            e.preventDefault();
            $("#cj-quick-text").hasClass("open") ? $("#cj-quick-text").removeClass("open") : $("#cj-quick-text").addClass("open");
        });

        // Copy new text to clipboard
        $(".qt-copy").on('click', function(e){
            e.preventDefault();
            var text = $(".hidden", this);
            copyToClipboard(text);
            $(this).addClass("copied");
            setTimeout(function(){
                $("button.copied").removeClass("copied");
            }, 1500);
        });

    },
    "buildQuickText" : function(quickText) {
        var qtHTML = "";
        var d = new Date();
        var y = d.getFullYear().toString(),
            m = d.getMonth() + 1,
            day = d.getDate().toString();
            m = m.toString();
            if(m.length = 1) {
                m = "0" + m;
            }
        var theDate = y + m + day;    
        quickText.forEach(item => {
            var summary = item.summary,
                content = item.content;
            if(item.getdate){ 
                summary = summary.replace("{date}", theDate);
                content = content.replace("{date}", theDate);
            }
            qtHTML += "<div id=\"qt-"+item.id+"\" class=\"cj-options input-group\">" +
                "<div class=\"input-group-prepend\">" +
                "<div class=\"qt-title input-group-text bg-light\">" + item.title + "</div>" +
                "</div>" +
                "<button class=\"cj-center qt-copy btn btn-dark\">Summary<textarea class=\"hidden\">" + summary + "</textarea></button>" +
                "<div class=\"input-group-append\">" +
                "<button class=\"qt-content qt-copy btn btn-secondary\">Content<textarea class=\"hidden\">" + content + "</textarea></button>" +
                "</div></div>";
        });
        $("#cj-quick-text").html(qtHTML);
    }
}
function sendMessage(id, msg) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
            if (response !== undefined) {
                $(id).html("<div class='alert alert-success mb-1'>" + response + "</div>");
            } else {
                $(id).html("<div class='alert alert-danger mb-1'>Please wait for the page to load.</div>");
            }
        });
    });
}

function copyToClipboard(element) {
    $(element).show().select();
    document.execCommand("copy");
    $(element).hide();
}