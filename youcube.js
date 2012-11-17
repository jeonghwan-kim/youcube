/*********************************************
Blog Class
*********************************************/
function Blog(date, body, img) {
    // property
    this.date = date;
    this.body = body;
    this.img = img;
    
    Blog.prototype.signiture;
    
    // 블로그 항목을 표현하는 문자열 반환
    Blog.prototype.toString = function() {
        return "[" + this.date + "]" + this.body;
    }
    
    // 블로그 항목을 표현하는 서식화된 문자열 반환
    Blog.prototype.toHTML = function(highlight) {
        var html = "";
        html += highlight ? "<p>" : "<p style='background-color:#EEEEEE;'>"; 
        html += "<strong>" + this.date + "</strong><br />";
        if (this.img) 
            html += "<img src='" + this.img + "' /><br />";
        html += this.body + "<br /><em>" + this.signiture + "</em></p>";
        return html;
    }
}

// toString Override
Date.prototype.toString = function() {
    return this.getDate() + "/" + (this.getMonth() + 1) + "/" + this.getFullYear();
}

/*********************************************
Global varialble
*********************************************/

// 블로그 객체
var blog = new Array();

// ajax 요청 객체
var ajaxReq = new AjaxRequest();

// ajax 요청 보내기
ajaxReq.send("get", "blog.xml", ajaxhandler);


/*********************************************
Function Definition
*********************************************/

// ajax 요청 핸들러
function ajaxhandler() {
    if (ajaxReq.getReadyState() == 4 && ajaxReq.getStatus() == 200) {
        var xmlElement = ajaxReq.getResponseXML();  
        
        // 블로그 객체 signiture 저장
        Blog.prototype.signiture = "by " + getText(xmlElement.getElementsByTagName("author")[0]);
            
        // 블로그 객체 생성
        var entries = xmlElement.getElementsByTagName("entry");
        for (var i = 0; i < entries.length; i++) {
             var date = getText(entries[i].getElementsByTagName("date")[0]);
             var body = getText(entries[i].getElementsByTagName("body")[0]);
             var image = getText(entries[i].getElementsByTagName("image")[0]);
             blog.push(new Blog(new Date(date), body, image));
        } 
        
        // 블로그 정렬(시간순)
        blog.sort(function(a, b) { return b.date - a.date; });
        
        // 5개 디폴트로 보여주기
        showBlog(5);
    }
}         

// element 로 부터 nodeValu 얻어내기. 없으면 "" 반환
function getText(elem) {
    var text = "";
    if (elem) {
        if (elem.childNodes) {
            var child = elem.childNodes[0];
            if (child.nodeValue) text = child.nodeValue;
            else alert("debug poing");
        }
    }
    return text;
}
 
// 초기설정
window.onload = function() {
    // showall 클릭 이벤트 콜백 함수
    document.getElementById("showall").onclick = function () {
        document.getElementById("search").style.display = "inline";
        document.getElementById("searchbtn").style.display = "inline";
        showBlog();
        document.getElementById("search").onfocus;
    }

    // showrandom 클릭 이벤트 콜백 함수
    document.getElementById("showrandom").onclick = function() {
        var i = Math.floor(Math.random() * blog.length);
        alert(blog[i]);
    }
    
    // search 버튼 이벤트 콜백 함수
    document.getElementById("searchbtn").onclick = searchBlog;

    // text input 이벤트 콜백 함수
    document.getElementById("search").onfocus = function() {
        document.getElementById("helpMsg").innerHTML = "";
    }            
    document.getElementById("search").onkeydown = function(e) {
        if(e.keyCode == 13) { // 엔터키
            searchBlog(); // 블로그 검색
        } else {
            document.getElementById("helpMsg").innerHTML = "";
        }
    }
}          

// 블로그 검색   
function searchBlog() {
    var keyword = document.getElementById("search").value;
    if (keyword.length == 0) return;

    // 검색 시작
    for (var i = 0; i < blog.length; i++) {
        // 검색어(keyword)를 찾은 경우
        if (blog[i].body.toLowerCase().indexOf(keyword.toLowerCase()) != -1) {
            alert(blog[i]);
            break;
        }
    }
    
    // 검색실패시 아래 메세지 보여줌
    if (i == blog.length) {
        document.getElementById("helpMsg").innerHTML = 
            "Sorry, there are no blog entries.";
    }
}

// 블로그 항목 리스트를 보여준다.
function showBlog(num) {
    var blogHTML = "";
    
    // showallblog일 경우
    if (!num) num = blog.length;
    
    for (var i = 0; i < blog.length && i < num; i++) 
        blogHTML += blog[i].toHTML(i % 2);
        
    document.getElementById("blog").innerHTML = blogHTML;
}