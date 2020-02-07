function post() {
    let parentId = $("#question_id").val();
    let content = $("#comment_content").val();
    if (!content) {
        alert("不能回复空内容!");
        return;
    }
    $.ajax({
        type: "POST",
        url: "/comment",
        data: JSON.stringify({
            "parentId": parentId,
            "content": content,
            "type": 1
        }),
        success: function(response) {
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