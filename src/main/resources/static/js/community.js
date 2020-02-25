/**
 * 提交回复
 */
function post() {
    let parentId = $("#question_id").val();
    let content = $("#comment_content").val();
    targetToId(parentId, 1, content);
}

function targetToId(targetId, type, content) {
    if (!content) {
        alert("不能回复空内容!");
        return;
    }
    $.ajax({
        type: "POST",
        url: "/comment",
        data: JSON.stringify({
            "parentId": targetId,
            "content": content,
            "type": type
        }),
        success: function (response) {
            if (response.code == 200) {
                window.location.reload();
            } else {
                if (response.code == 2003) {
                    let isAccept = confirm(response.message);
                    if (isAccept) {
                        window.open("https://github.com/login/oauth/authorize?client_id=9233929d9f721dcaf4a8&redirect_uri=http://localhost:8080/callback&scope=user&state=1");
                        window.localStorage.setItem("closable", "true");
                    }
                } else {
                    alert(response.message);
                }
            }
        },
        contentType: "application/json",
        dataType: "json"
    });
}

function comments(e) {
    let commentId = $(e).data("id");
    let content = $("#input-" + commentId).val();
    targetToId(commentId, 2, content)
}

/**
 * 展开二级评论
 */
function collapseComments(e) {
    let id = $(e).data("id");
    let comments = $('#comment-' + id);
    // $(e).toggleClass('active');
    // comments.toggleClass('in');
    let collapse = e.getAttribute("data-collapse");
    if (collapse) {
        comments.removeClass("in")
        e.removeAttribute("data-collapse");
        e.classList.remove("active");
    } else {
        let subCommentContainer = $("#comment-" + id);
        if (subCommentContainer.children().length == 1) {
            $.getJSON("/comment/" + id, function(data) {
                debugger;
                let items = [];
                $.each(data.data.reverse(), function (index, comment) {
                    let mediaLeftElement = $("<div>", {
                        "class": "media-left"
                    }).append($("<img/>", {
                        "class": "media-object img-rounded",
                        "src": comment.user.avatarUrl
                    }));

                    let mediaBodyElement = $("<div>", {
                        "class": "media-body"
                    }).append($("<h5>", {
                        "class": "media-heading",
                        "html": comment.user.name
                    })).append($("<div>", {
                        "html": comment.content
                    })).append($("<div>", {
                        "class": "menu"
                    })).append($("<span>", {
                        "class": "pull-right",
                        "html": moment(comment.gmtCreate).format("YYYY-MM-DD")
                    }));

                    let mediaElement = $("<div>", {
                        "class": "media"
                    }).append(mediaLeftElement).append(mediaBodyElement);

                    let commentElement = $("<div>", {
                        "class": "col-lg-12 col-md-12 col-sm-12 col-xs-12 comments"
                    }).append(mediaElement);

                    subCommentContainer.prepend(commentElement);
                });
            });
        }
        // commentBody.append($("<div/>", {
        //     "class": "col-lg-12 col-md-12 col-sm-12 col-xs-12 comments",
        //     "id": "comment-" + id,
        //     html: items.join("")
        // }));
        comments.addClass("in");
        e.setAttribute("data-collapse", "in");
        e.classList.add("active");

    }
}