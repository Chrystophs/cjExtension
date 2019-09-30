$(document).ready(function(){
    commentChecker();
});

$(window).on("click", function(){
    commentChecker();
});

var response;

// Change to your own repository of data.
var d = "https://gist.githubusercontent.com/Chrystophs/9f5adf56cdeae52563294b0610547482/raw/f7f5f586f12c8586bd953c2ae015b12b775222e4/default-test.json";

// Check for the comment box.
function commentChecker() {
    // Get Text for Toolbar
    readJSON(d);
    var checkComment = setInterval(function() {
        // Old version of Jira Service Desk
        if($("#addcomment form textarea").length && !$("#cjExtension").length) {
            $("#addcomment").prepend("<div id='cjExtension'></div>");
            if(response) {
                buildControls(response);
            }
        }
        // New Version of Jira Service Desk
        if ( $(".ak-editor-content-area").length && !$("#cjExtension").length) {
            $(".ak-editor-content-area").parent().parent().prepend("<div id='cjExtension' class=\"next-gen\"></div>");
            buildControls(response);
        }
    }, 2000);
}

// Build controls, takes response as json data.
function buildControls(res) {
    // Beginning of Form and Fields
    var formHTML = '',
        formFields= '';

    // Create my Variables
    var greetings = res.greetings,
    responses = res.responses,
    closings = res.closings;

    //Assigning ignored names
    ignoreNames = res.ignoreNames;

    // Build greeting options
    formFields = "<select id=\"res-greeting\" class=\"form-control custom-selector\">";
    $.each(greetings, function(i, greeting){
        formFields += "<option value=\"" + greeting + "\" >" + greeting + "</option>";
    });
    formFields += "</select>";

    // Build response options
    formFields += "<select id=\"res-response\" class=\"form-control custom-selector\">";
    $.each(responses, function(i, response){
        const requests = response.requests;
        if(requests) {
            formFields += "<option id=\"res" + i + "\" class=\"requests\" value=\"" + response.message + "\" >" + response.name + "</option>";
        } else {
            formFields += "<option id=\"res" + i + "\" value=\"" + response.message + "\" >" + response.name + "</option>";
        }
    });
    formFields += "</select>";

    // Build closing options 
    formFields += "<select id=\"res-closing\" class=\"form-control custom-selector\">";
    $.each(closings, function(i, closing){
        formFields += "<option value=\"" + closing.message + "\" >" + closing.name + "</option>";
    });
    formFields += "</select>";

    // Build Form HTML
    formHTML += "<form id=\"canned-responses\"><div class=\"input-group\">" +
        "<div class=\"input-group-prepend\"><button id=\"cs-expand\" class=\"btn btn-secondary\">Expand</button></div>" +
        formFields +
        "<div class=\"input-group-append\">" +
        "<button id=\"res-submit\" class=\"btn btn-success\">Submit</button>" +
        "</div></div></form>";

    // Add Tools to the Toolbar
    $("#cjExtension").html(formHTML);

    // Apply Click Function
    $('#cs-expand').click(function(e){
        e.preventDefault();
        expandTextarea();
    });


    //Check the time of day
    var d = new Date();
    var time = d.getHours();
    if(time > 8) {
        $("#res-greeting option[value=\"Hello\"]").attr("selected", "selected");
    }

    $("#res-submit").click(function(e){
        e.preventDefault();
        if($("#addcomment").length) {
            csReplyBtn(false);
        } else if($("#cjExtension.next-gen").length) {
            csReplyBtn(true);
        }
    });
}

// Build function for submit button
function csReplyBtn(nextGen){
    
    // My variables and field values
    var reporter,
        greeting = $("#res-greeting").val(),
        message = $("#res-response").val(),
        closing = $("#res-closing").val(),
        text = ""

    // Old vs Next Gen Check
    if( $("#reporter-val .user-hover").length ) {
        reporter = $("#reporter-val .user-hover").text().trim()
    } else {
        reporter = $(".grWmuE .epXzqq").text().trim()
    }
        
    var emailCheck = reporter.split("");

    // Check for extra variables
    if( !$("#res-response :selected").hasClass("requests") ) {

        // Split name
        reporter = reporter.split(" ");
        var isEmail = emailCheck.indexOf("@") > 0 ? true : false;
        var ignoreName = ignoreNames.indexOf(reporter[0]) < 0 ? true : false;

        // Compiling the response
        if(!nextGen) {
            if( ignoreName && !isEmail ) { 
                // Capitalize Name
                reporter = reporter[0].toLowerCase();
                var name = reporter.charAt(0).toUpperCase() + reporter.slice(1);
    
                text = greeting + " " + name + ",\n\n" + message + "\n\n" + closing;
            } else {
                text = greeting + ",\n\n" + message + "\n\n" + closing;
            }
        } else {
            message = message.split("\n\n").join("</p><p>");
            if( ignoreName && !isEmail ) { 
                // Capitalize Name
                reporter = reporter[0].toLowerCase();
                var name = reporter.charAt(0).toUpperCase() + reporter.slice(1);
    
                text = "<p>" + greeting + " " + name + ",</p><p>" + message + "</p><p>" + closing + "</p>";
            } else {
                text = "<p>" + greeting + ",</p><p>" + message + "</p><p>" + closing + "</p>";
            }
        }

        // Next gen check Add comment correctly
        if(!nextGen) {
            $("#addcomment form textarea").focus();
            $("#addcomment #comment").text(text);
        } else {
            $(".ak-editor-content-area .ProseMirror").addClass("ProseMirror-focused").focus().html(text);
        }
        
        // Scroll to comment
        if(!nextGen){
            $('html, body').animate({
                scrollTop: $("#addcomment").offset().top /*class you want to scroll to!!*/
            }, 1000); /*animation time length*/
        } else {
            $('html, body').animate({
                scrollTop: $(".ak-editor-content-area").offset().top /*class you want to scroll to!!*/
            }, 1000); /*animation time length*/
        }

    } else {

        var index = parseInt($("#res-response :selected").attr("id").replace("res", "")),
            reqForm = "<form id=\"req-form\"><div class=\"input-group\">";

        requests = response.responses[index].requests;
        
        $.each(requests, function(n, request){
            reqForm += "<input id=\"req-input" + n + "\" class=\"form-control custom-input\" type=\"text\" placeholder=\"" + request + "\" />";
        });

        reqForm += "<button id=\"req-submit\" class=\"btn btn-warning\">Submit</button>" +
            "</div></form>";

        // Add Form
        if( $("#req-form").length ) {
            $("#req-form").remove();
            $("#cjExtension").append(reqForm);
        } else {
            $("#cjExtension").append(reqForm);
        }

        $("#req-submit").click(function(e) {
            e.preventDefault();
            // Split name
            reporter = reporter.split(" ");
            var isEmail = emailCheck.indexOf("@") > 0 ? true : false;
            var ignoreName = ignoreNames.indexOf(reporter[0]) < 0 ? true : false;
            var message = $("#res-response").val();

            // Inject input from user
            $.each($("#req-form input"), function(n, m){
                message = message.replace("{" + (n + 1) + "}", $(m).val());
            });

            // Compiling the response
            if(!$("#cjExtension").hasClass("next-gen")) {
                if( ignoreName && !isEmail ) { 
                    // Capitalize Name
                    reporter = reporter[0].toLowerCase();
                    var name = reporter.charAt(0).toUpperCase() + reporter.slice(1);
        
                    text = greeting + " " + name + ",\n\n" + message + "\n\n" + closing;
                } else {
                    text = greeting + ",\n\n" + message + "\n\n" + closing;
                }
            } else {
                message = message.split("\n\n").join("</p><p>");
                if( ignoreName && !isEmail ) { 
                    // Capitalize Name
                    reporter = reporter[0].toLowerCase();
                    var name = reporter.charAt(0).toUpperCase() + reporter.slice(1);

                    text = greeting + " " + name + ",<p>" + message + "</p>" + closing;
                } else {
                    text = greeting + "<p>" + message + "</p>" + closing;
                }
            }
    
            if(!nextGen) {
                $("#addcomment form textarea").focus();
                $("#addcomment #comment").text(text);
            } else {
                $(".ak-editor-content-area .ProseMirror").addClass("ProseMirror-focused").focus().html(text);
            }

            // Remove request form
            $("#req-form").remove();
            
            // Scroll to comment
            if(!nextGen){
                $('html, body').animate({
                    scrollTop: $("#addcomment").offset().top /*class you want to scroll to!!*/
                }, 1000); /*animation time length*/
            } else {
                $('html, body').animate({
                    scrollTop: $(".ak-editor-content-area").offset().top /*class you want to scroll to!!*/
                }, 1000); /*animation time length*/
            }

        });

    }
}
// Ajax reqeust function
function readJSON(path) {
    var x = new XMLHttpRequest();
    x.open('GET', path, true);
    x.responseType = 'json';
    x.onreadystatechange  = function(e) { 
        if (x.readyState == 4) {
            if (this.status == 200) {
                response = this.response.data.cjToolbar;
            } 
        }
    }
    x.send();
}

// Expand text area, Old version of Jira
function expandTextarea(){
    
    $("#addcomment form textarea").focus();
    
    $("#addcomment #comment").height("500px");

    // Scroll to comment
    $('html, body').animate({
        scrollTop: $("#addcomment").offset().top /*class you want to scroll to!!*/
    }, 1000); /*animation time length*/

}