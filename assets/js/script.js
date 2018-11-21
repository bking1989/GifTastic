$(document).ready(function() {
    // The theme for the GIF display
    var topics = ["Samuel L. Jackson","Jeff Goldblum","Lupita Nyong'o","Scarlett Johansson"];

    // Function to generate buttons for each of the topics
    function createBtn() {
        // Generates a button for each entry in the array
        for (var i = 0; i < topics.length; i++) {
            var topicBtn = $("<button>");
            topicBtn.addClass("btn btn-primary m-1 topic-btn");
            topicBtn.attr('data-keyword',topics[i]);
            topicBtn.text(topics[i]);
            $("#buttonDiv").append(topicBtn);
        };
    };

    // When you click the search button, it makes a button for the search term
    $("#searchBtn").on("click",function() {
        // Code to prevent the button from submitting placeholder text as input
        event.preventDefault();

        // If the input is empty, then nothing happens
        if ($("#searchBox").val() == 0) {
            void(0);
        } else {
            // Empty the existing list of buttons
            $("#buttonDiv").empty();

            // Clicking sends the term into the topic button box, and clears the input field
            var searchTerm = $("#searchBox").val().trim();
            topics.push(searchTerm);
            createBtn();
            $("#searchBox").val("");
        };
    });

    // When you click the 'Clear Topics' button, it will clear out the topic box
    $("#topicClear").on("click",function() {
        // Clear out the topics array
        topics = [];
        
        // Clear out the box holding the buttons
        $("#buttonDiv").empty();
    });

    // When you click the 'Clear Results' button, it will clear out the search results
    $("#clearBtn").on("click",function() {
        $("#resultsDiv").empty();
    });

    // The function for rendering all of the GIF images
    function displayGIF() {
        // Define our search term, for the query
        var searchTerm = $(this).attr("data-keyword");

        // Query URL for the Giphy API
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=rkd9TxMBGIfgfJh5M8jnqNbgbvTG8lUS&q=" + searchTerm + "&limit=10";

        // jQuery AJAX call for the API
        $.ajax({
            url : queryURL,
            method : "GET"
        }).then(function(response) {
            // Define the output of the API
            var results = response.data;

            // Define the area where we'll show our GIF images
            var resultsBox = $("#resultsDiv");

            // Take the API string and convert it into a series of GIF images
            for (var i = 0; i < results.length; i++) {
                // Set up a container <div> for the GIF and rating
                var gifDiv = $("<div>");
                gifDiv.addClass("gifContainer m-2");
                
                // Set up the <img> tag for the GIF image itself
                var gifImage = $("<img>");
                
                // Set up class and attributes for said <img> tag
                gifImage.addClass("aniGif img-fluid");
                gifImage.attr("src",results[i].images.fixed_height_still.url);
                gifImage.attr("data-still",results[i].images.fixed_height_still.url);
                gifImage.attr("data-animate",results[i].images.fixed_height.url);
                gifImage.attr("data-state","still");

                // Set up the <p> tag for the URL, rating, and source
                var gifURL = $("<p>");
                var gifRating = $("<p>");
                var gifSrc = $("<p>");
                
                gifURL.addClass("my-1");
                gifRating.addClass("my-1");
                gifSrc.addClass("my-1");

                $(gifURL).append("<b>URL:</b> " + JSON.stringify(results[i].bitly_url).replace(/['"]+/g, ''));
                $(gifRating).append("<b>Rating:</b> " + JSON.stringify(results[i].rating).toUpperCase().replace(/['"]+/g, ''));
                $(gifSrc).append("<b>Source:</b> " + JSON.stringify(results[i].source_tld).replace(/['"]+/g, ''));

                // Create a download button for the GIF image
                var downloadImage = results[i].images.original.url;
                var downloadBtn = $("<a>");
                downloadBtn.append("<i class='fa fa-download mr-2'></i>Download");
                downloadBtn.addClass("btn btn-dark text-white mr-2");
                downloadBtn.attr("href",downloadImage);
                downloadBtn.attr("target","_blank");

                // Create a button to add the GIF image to their favorites
                // var faveBtn = $("<a>");
                // faveBtn.append("<i class='fa fa-heart mr-2 fave-btn'></i>Add to Favorites");
                // faveBtn.addClass("btn btn-dark text-white");
                
                // Append the image and info to the containing <div>, then append it to the results area
                $(gifImage).appendTo(gifDiv);
                $(gifURL).appendTo(gifDiv);
                $(gifRating).appendTo(gifDiv);
                $(gifSrc).appendTo(gifDiv);
                $(downloadBtn).appendTo(gifDiv);
                // $(faveBtn).appendTo(gifDiv);
                $(gifDiv).prependTo(resultsBox);
            };

            // The function for the 'Add to Favorites' button
            $(".fave-btn").on("click",function() {

            });
            
            // The function for clicking the GIF image to play it
            $("img.aniGif").on("click",function () {
                // Define the image's state of animation
                var state = $(this).attr("data-state");
                
                // If the image isn't animated, we switch it
                if (state === "still") {
                    $(this).attr("src",$(this).attr("data-animate"));
                    $(this).attr("data-state","animate")
                } else if (state === "animate") {
                    $(this).attr("src",$(this).attr("data-still"));
                    $(this).attr("data-state","still");
                };
            });
        });
    };

    // A listener for whenever a topic button is clicked on
    $(document).on("click", ".topic-btn", displayGIF);

    // Initial button creation
    createBtn();
});