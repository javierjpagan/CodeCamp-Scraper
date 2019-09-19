
function displaySaved() {
    $.getJSON("/saved/all", function (data) {

        $("#ccn-0").empty();
        $("#ccn-1").empty();
        $("#ccn-2").empty();

        $("#total-number").text(data.length);

        for (var i = 0; i < data.length; i++) {

            var articleDiv = $("<div>");
            articleDiv.addClass("card yellow lighten-5");
            articleDiv.attr("id", "main-" + data[i]._id);

            var contentDiv = $("<div>");
            contentDiv.addClass("card-content blue-text");

            var titleDiv = $("<div>");
            titleDiv.addClass("card-title");
            titleDiv.attr("data-id", data[i]._id);
            titleDiv.attr("id", "title-" + data[i]._id);
            titleDiv.text(data[i].title);
            contentDiv.append(titleDiv);

            var summaryDiv = $("<p>");
            summaryDiv.attr("id", "summary-" + data[i]._id);
            summaryDiv.text(data[i].summary);
            contentDiv.append(summaryDiv);

            var cardAction = $("<div>");
            cardAction.addClass("card-action");

            var link = $("<a>");
            link.attr("href", data[i].link);
            link.attr("id", "link-" + data[i]._id);
            link.html("<i class='fas fa-link'></i>");
            cardAction.append(link);

            var commentsButton = $("<a>");
            commentsButton.addClass(" btn create-comment modal-trigger");
            commentsButton.attr("data-id", data[i]._id);
            commentsButton.attr("data-target", "comments");
            commentsButton.text("Comments");

            var deleteArticle = $("<a>");
            deleteArticle.addClass(" btn delete-button");
            deleteArticle.attr("id", data[i]._id);
            deleteArticle.text("Delete");

            cardAction.append(commentsButton);
            cardAction.append(deleteArticle);
            articleDiv.append(contentDiv);
            articleDiv.append(cardAction);

            $("#ccn-" + String(i % 3)).append(articleDiv);
        }
    });
}

function deletecomment(thisId) {
    var data = {
        "_id": thisId
    };
    console.log(data);
    $.ajax({
        type: "DELETE",
        url: "/deletecomment",
        data: data,
        success: function (data, textStatus) {
            $("#" + thisId).remove();
        }
    })
}

$(document).ready(function () {
    // $('.slider').slider();
    // $(".button-collapse").sideNav();
    $('.modal').modal();

    // When click on savearticle button
    $(document).on('click', '.save-button', function () {
        var thisId = $(this).attr("id");
        var summary = $("#summary-" + thisId).text();
        var title = $("#title-" + thisId).text();
        var link = $("#link-" + thisId).attr('href');
        var data = {
            "id": thisId,
            "summary": summary,
            "title": title,
            "link": link,
        };
        $.ajax({
            type: "POST",
            url: "/save",
            data: data,
            dataType: "json",
            success: function (data, textStatus) {
                console.log(data);
            }
        });
    });
    // When click on delete article button
    $(document).on('click', '.delete-button', function () {
        var thisId = $(this).attr("id");
        var data = {
            "_id": thisId
        };
        $.ajax({
            type: "DELETE",
            url: "/delete",
            data: data,
            success: function (data, textStatus) {
                $("#main-" + thisId).remove();
            }
        })
    });

    // create comment
    $(document).on("click", ".create-comment", function (data) {
        $("#savecomment").attr("data-id", $(this).attr("data-id"));
        let aid = $(this).attr("data-id");
        let title = "Comments for the Article: " + aid;
        $("#display-title").empty();
        $("#display-title").text(title);
        $("#textarea1").val("");
        $.getJSON("/comments/" + aid, function (data) {
            if(data.length) {
                console.log(data);
                let commenttext = "Comments: " + data[0].body;
                $("#display-comment").empty();
                let commentList = $("<ul>");
                commentList.addClass("collection with-header");
                let hli = $("<li>");
                hli.addClass("collection-header")
                hli.text("Comments");
                commentList.append(hli);
            
                for (let i = 0; i < data.length; i++) {
                    let ili = $("<li>");
                    ili.attr("id", data[i]._id);
                    ili.addClass("collection-item");

                    let idiv = $("<div>");
                    idiv.text(data[i].body);

                    let adelete = $("<a>");
                    adelete.addClass("secondary-content");
                    adelete.html("<i class='far fa-trash-alt'></i>");
                    adelete.attr("comment-id", data[i]._id);
                    adelete.attr("href", "#");
                    adelete.attr("onclick", 'deletecomment("' + data[i]._id + '")');
                    let xdelete = $("<i>");
                    // xdelete.addClass("material-icons");
                    xdelete.attr("comment-id", data[i]._id);
                    // xdelete.html("delete");
                    adelete.append(xdelete);
                    idiv.append(adelete);
                    ili.append(idiv);
                    commentList.append(ili);
                }
                $("#display-comment").append(commentList);
            } else {
                $("#display-comment").empty();
            }
        });
    });


    $(document).on("click", "#savecomment", function () {

        var thisId = $(this).attr("data-id");
        var text = $("#textarea1").val();
        console.log(thisId);

        $.ajax({
            type: "POST",
            url: "/comments",
            data: {
                "article_id": thisId,
                "body": text
            },
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                $("#textarea1").val("");
            }
        });
    });

    $(document).on("click", "#deletecomment", function () {

        $.ajax({
            type: "DELETE",
            url: "/deletecomment",
            data: data,
            success: function (data, textStatus) {
                $("#display-comment").remove();
            }
        });
    });
});