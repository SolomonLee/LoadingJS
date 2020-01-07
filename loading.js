/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■□□■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■□□■■■■■■■■■■■■■■■■■■■■■■■■■■■□□□□□□■■■■□□□□■■■■■■■■
■■□□■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■□□■■□□■■■■■■■■■■■■■■■■■■■■■■■□□□□□□■■□□■■■■□□■■■■■■
■■□□■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■□□■■■■■■■■■■■■■■■■■■■■■■■■■■■■■□□■■■■■□□■■■■□■■■■■■
■■□□■■■■■■■■□□□■■■■■□□□■□□■■■■■■□□□■□□■■□□■■■□■□□□■■■■■■□□□■□□■■■■■□□■■■■■■■□□□■■■■■■■■
■■□□■■■■■■□□■■■□□■■□□■■■□□■■■■□□■■■□□□■■□□■■■□□■■■□□■■□□■■■□□□■■□■■□□■■■■□■■■■■□□■■■■■■
■■□□■■■■■■□□■■■□□■■□□■■■□□■■■■□□■■■□□□■■□□■■■□□■■■□□■■□□■■■□□□■■□□■□□■■■■□□■■■□□■■■■■■■
■■□□□□□□■■■■□□□■■■■■■□□□■■□□■■■■□□□■□□■■□□■■■□□■■■□□■■■■□□□■□□■■■□□□■■■■■■■□□□■■■■■■■■■
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■□□■■■■■■■■■■■■■■■■■■■■■■■■■
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■□□■■■□□■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■□□□■■■■■■■■■■■■■■■■■■■■■■■■■■■■
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/

/* 簡介：
簡易載入HTML的JS
減少重複寫同樣區塊
並且能夠直接輸出 組合後的 html

(尚在開發中)

VERSION --
*/

/* 使用說明：
透過 * Setting * 設定基本功能
	templatesPath						載入template 位址
	cssTemplate 						css template 名稱
	jsTemplate 							css template 名稱
	outputFileName						輸出時檔名，{ON} 為原檔名 
	outputFileExtension					輸出時副檔名
	download_local_file_keydown			下載 檔案 快捷鍵 
	download_local_files_keydown		選取下載 檔案 快捷鍵


載入功能
	afterLoad(function) 			傳入 function 會在 window.onload 執行內容，避免loading error
	
	loadHead(string) 				傳入 string ，載入相關的 Head
	
	loadHeader(string) 				傳入 string ，載入相關的 Header
	
	loadFooter(string) 				傳入 string ，載入相關的 Footer
	
	loadModal(string) 				傳入 string ，載入相關的 Modal
	
	loadModalList(string array) 	傳入 string array，載入相關的 Modals
	
	loadTemplate 					傳入 string ，載入相關的 Template
	
	download_local_file				將目前檔案轉成純 HTML
	
	download_local_all_files		選擇目前 HTML 同層檔案，將選擇的檔案們轉成純 HTML
*/

/* 更新記錄：
*/

/* TODO：
	***	套用 Path Setting
	**	整合變數與 function 為 Object 
	**	優化 functions
	**	加速轉成純 Html 速度
	**	將特殊套件處理抽出
	*	loading error ex:document call innerHTML 出現錯誤
	*	加速 download 時間 (maybe web worker can)
	*	加速 loading 速度
	*	加入 新tag 可以直接載入區塊
	*	新tag 載入區塊後 可 遞迴載入
	 	瀏覽器兼容 IE、Firefox
*/

// ***** Setting *****
var templatesPath = 'templates/';
var cssTemplate = 'link.html';
var jsTemplate = 'script.html';
var outputFileName = '{ON}_local';
var outputFileExtension = 'html';
var download_local_file_keydown = 68/*D*/ && evtobj.ctrlKey && evtobj.altKey;
var download_local_files_keydown = 65/*A*/ && evtobj.ctrlKey && evtobj.altKey;
// ***** Setting : End *****


// ***** Private Setting *****
var _loaded = false;
var _after_fn_array = [];
var _is_local = window.location.href.indexOf("file:") != -1;
// ***** Private Setting : End *****

function _loadFile(url,callback) {
    if(_is_local){
        return console.log("local file can't use XMLHttpRequest");
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        callback(this.responseText);
    }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function _check_modals_created(){
    if (document.getElementsByTagName('modals').length == 0){
        if (document.getElementsByClassName('content').length != 0){
            document.getElementsByClassName('content')[0].appendChild(document.createElement('modals'))
        } else {
            document.getElementsByTagName('body')[0].appendChild(document.createElement('modals'))
        }
    }
}

function _html_append(tagName,file){
    var tempHtml   = document.createElement('div');
    var tempScript = document.createElement('script');

    tempHtml.innerHTML = file;
    var scripts = tempHtml.getElementsByTagName("script");

    for (i = 0;i < scripts.length; i++){
        tempScript.innerText = scripts[i].innerText;
    }

    tempHtml.querySelectorAll('body script').forEach(function(e){e.remove()})
    tempScript.innerHTML = tempScript.innerHTML.replace(/(?:&nbsp;|<br>)/g,'');

    document.getElementsByTagName(tagName)[0].appendChild(tempHtml);
    document.getElementsByTagName(tagName)[0].appendChild(tempScript);
}


function loadHead(){
    _loadFile('templates/link.html',setHead)
}

function setHead(file){
    document.getElementsByTagName('head')[0].innerHTML = document.getElementsByTagName('head')[0].innerHTML + file;
}

function loadHeader(){
    _loadFile('templates/header.html',setHeader)
}

function setHeader(file){
    document.getElementsByTagName('header')[0].innerHTML = document.getElementsByTagName('header')[0].innerHTML + file;
}

function loadFooter(){
    _loadFile('templates/footer.html',setHeader)
}

function setFooter(file){
    document.getElementsByTagName('footer')[0].innerHTML = document.getElementsByTagName('footer')[0].innerHTML + file;
}

function loadModal(fileNmae){
    _loadFile('templates/'+fileNmae+'.html',setModal)
}

function setModal(file){
    _check_modals_created();
    _html_append('modals',file);
}

function loadTemplate(fileNmae){
    _loadFile('templates/'+fileNmae+'.html',setTemplate)
}

function setTemplate(file){;
    tagName = 'body';

    var tempHtml = document.createElement('div');
    tempHtml.innerHTML = file;
    tempScript = tempHtml.getElementsByTagName('script')[0]

    document.getElementsByTagName(tagName)[0].appendChild(tempScript);
}

function loadModalList(fileNmaeList){
    fileNmaeList.forEach(function(name){
        loadModal(name);
    });
}

function afterLoad(fn){
    if(!_loaded){
        _after_fn_array.push(fn);
    } else {
        fn();
    }
}

function download_local_file() {
    var data = document.documentElement; // copy file

    var removeElementByClass = function(_selector,_data){
        _html   = document.createElement('html');
        _html.innerHTML = _data;
        _html.querySelectorAll(_selector).forEach(function(e){e.remove()});
        return _html.innerHTML;
    }

    // 將常用的套件 還原
    data.querySelectorAll(".hasDatepicker").forEach(function(item){ // datepicker
        item.removeAttribute("id");
        item.classList.remove("hasDatepicker");
    })

    if(data.querySelector("#ui-datepicker-div") != null) {
        data.querySelector("#ui-datepicker-div").remove();
    }

    data.querySelectorAll(".select2").forEach(function(item){ // select2
        item.remove();
    })

    if (typeof _is_download_local_files !== 'undefined') { delete CKEDITOR;} // ckeditor
    data.querySelectorAll(".cke_2").forEach(function(item){
        item.remove();
    })
    
    // 檔名設定
    data = data.innerHTML;
    var or_filename = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
    var filename = or_filename.substr(0,or_filename.lastIndexOf('.'))+"_local.html";
    var type = "html"

    // 建立並寫入檔案 並 透過連結方式下載
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) { // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    } else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function download_local_all_files() {
    // 測試版  限定 下載的檔案 需跟開啟檔案 同一資料夾
    var _download_url_list = [];
    var _download_url = location.href.replace(location.href.split(/(\\|\/)/g).pop(),"");
    var _files_list = document.createElement('input');

    _files_list.setAttribute("type","file");
    _files_list.setAttribute("multiple","multiple");
    _files_list.onchange = function(e){
        // step 1 select download files & get file name
        for(var i = 0;i < $(this)[0].files.length;i++){
            _download_url_list.push(_download_url + $(this)[0].files[i].name);
        }

        // step 2 open & download & close
        var _sub_page = null;
        var _run_download = function(){
            if(_sub_page != null) {
                _sub_page.remove();
            }
             
            if(_download_url_list.length > 0)
            {
                _sub_page = document.createElement("iframe");
                _sub_page.setAttribute("src", _download_url_list[0]);
                //_sub_page.style.display = "none";
                document.body.appendChild(_sub_page);
                _sub_page.contentWindow._is_download_local_files = true;
                _sub_page.contentWindow._download_over = function(){
                    _download_url_list.splice(0,1);
                    _run_download();
                };

                /*var _sub_page = window.open(_download_url_list[0], "sub_" , "width=1,height=1");
                _sub_page._is_download_local_files = true;
                _sub_page._download_over = function(){
                    _download_url_list.splice(0,1);
                    _sub_page.close();
                    _run_download();
                };*/
                /*setTimeout(function(){
                    _sub_page.download_local_file();
                    _sub_page.close();
                    _download_url_list.splice(0,1);
                    _run_download();
                },2000);*/
            } else {
                _files_list.remove();
            }

        }
        _run_download();
    }
    _files_list.click();
}


function _download_local_file_key_press(e) {
    var evtobj = window.event? event : e;
    if (download_local_file_keydown) {
        download_local_file()
    };

    if (download_local_files_keydown) {
        download_local_all_files()
    };
}

document.onkeydown = _download_local_file_key_press;


window.onload = function(){
    setTimeout(function(){
        _after_fn_array.forEach(function(fn){
            try {
                fn();
            } catch (e) {
                console.log(e);
            }
        })
		
        _after_fn_array = [];
		_loaded = true;

        if (typeof _is_download_local_files !== 'undefined') {
            download_local_file();
            _download_over();
        } 
    },1000);
};

loadHead();
loadHeader();

loadModalList(['my_alert']);
// loadTemplate(['Template_fix_message_item']);