(function (util, Handlebars) {
    var template =
        `<div class="m-chat-wrap z-hid animated clearfix">
			<div class="m-chat-list">
				<div class="m-head list-box">
					<span>聊天</span>
					<i class="iconfont icon-guanbi quit closeChatBox"></i>
				</div>
				<div class="m-search">
					<i class=" iconfont icon-sousuo search"></i>
					<img class="clear" src="./js/chatdemo/image/ic_colse.png">
					<input class="u-search" type="text" name="" placeholder="输入姓名搜索">
				</div>
				<div class="m-menu">
					<div class="contact white"><i class="iconfont icon-xiaoxi info"></i>最近联系</div>
					<span class="Separate">|</span>
					<div class="patient-list gray"><i class="iconfont icon-wodehuanzhe patient"></i>患者列表</div>
				</div>
				<div class="m-list-wrapper">
                    <div class="m-group">
                    </div>
                    <div class="m-user"></div>
                </div>
			</div>	
		</div>`;

    var threadListSourse =
        `<div class='itm' data-session-name='{{sessionName}}' data-nick-name='{{nickName}}' data-unread-count='{{count}}' data-can-chat='{{canChat}}'>
			<div class="area-avatar">
				{{#if avatar}}
					<img style="width: 42px;height: 42px;border-radius: 50%;border:none; " class="avatar" src="http://a.mintcode.com + {{.}}">
				{{else}}
					<i class="iconfont avator icon-morentouxiang"></i>
				{{/if}}
				{{#if count}}
					<span class="redDot">{{count}}</span>		
				{{/if}}
			</div>
			<div class="info">
				<div class="info-box">
					<span class='name'>{{nickName}}</span>
					<p class="text">{{lastMsg.content}}</p>
				</div>
			</div>
			<span class='time'>{{lastMsg.time}}</span>
		</div>`;
    var UserListSourse =
        `<div class='itm'data-session-name='{{sessionName}}' data-nick-name='{{userName}}-{{teamName}}' data-unread-count='0' data-can-chat='{{canChat}}'>
			<div class="area-avatar">
				<i class="iconfont avator icon-morentouxiang"></i>
			</div>
			<div class="info">
				<div class="info-box">
					<span class='name'>{{userName}}</span>
					<p class="text">{{illDiagnose}}</p>
				</div>
			</div>
		</div>`;
    var collectionTemplate =
        `<div class="m-collection m-layer" style="display: none">
            <div class="title">收藏图片到 <i class="iconfont icon-guanbi quit closeChatBox"></i></div>
            <ul class="m-item">
                <li class="item"><span>仅收藏图片</span><img class="choose" src="./js/chatdemo/image/ic_choose.png"></li>
                <li class="item"><span>收藏到饮食记录</span><img class="choose" src="./js/chatdemo/image/ic_choose.png"></li>
                <li class="item"><span>收藏到病历</span><img class="choose" src="./js/chatdemo/image/ic_choose.png"></li>
            </ul>
            <div class="btn-blue j-confirm">确定</div>
        </div>`;
    var dietRecordsTemplate =
        `<div class="m-dietRecords m-layer" style="display: none">
            <div class="title">收藏到饮食记录 <i class="iconfont icon-guanbi quit closeChatBox"></i></div>
            <ul class="m-item">
                <li class="item"><span class="itm-title">日期：</span><input type="text" class="value-box select-time"></li>
                <li class="item">
                    <span class="itm-title">三餐：</span>
                    <select name="" class="value-box select-meals">
                        <option value="1">早餐</option>
                        <option value="2">午餐</option>
                        <option value="3">晚餐</option>
                        <option value="4">加餐</option>
                    </select>
                </li>
                <li class="item">
                    <span class="itm-title" style="vertical-align: top">备注：</span>
                    <textarea class="value-box remark" placeholder="添加饮食备注信息，最多150字" maxlength="150"></textarea>
                </li>
            </ul>
            <div class="btn-blue j-confirm">保存</div>
        </div>`;
    var caseTemplate =
        `<div class="m-case m-layer" style="display: none">
            <div class="title">收藏到病例 <i class="iconfont icon-guanbi quit closeChatBox"></i></div>
            <ul class="m-item">
                <li class="item"><span>门诊</span><img class="choose" src="./js/chatdemo/image/ic_choose.png"></li>
                <li class="item"><span>急诊</span><img class="choose" src="./js/chatdemo/image/ic_choose.png"></li>
                <li class="item"><span>检验检查</span><img class="choose" src="./js/chatdemo/image/ic_choose.png"></li>
                <li class="item"><span>药物处方</span><img class="choose" src="./js/chatdemo/image/ic_choose.png"></li>
            </ul>
            <div class="btn-blue j-confirm">保存</div>
        </div>`;
    var menuTemplate =
        `<div id="menu" style="display: none;">
            <div>收藏到</div>
        </div>`;
    var imageTemplate =
        `<div class="img-wrapper" style="display: none">
            <div class="img-box">
                <img class="img-show" src="" alt="">
            </div>
        </div>`;
    var collectionStatusTemplate =
        `<div class="m-collectstatus" style="display: none">
            <img class="z-collect" src="" alt=""><span class="title"></span>
        </div>`
    var blackBgTemplate =
        `<div class="black-bg">
            
        </div>`
    var infoRecordTemplate=
        `<div class="m-dialog m-chat-message" style="display: none;">
                <div class="title-item">
                    <span class="m-input-cotain"></span>	
                    <span class="btn-wrapper">
                        <span class="refresh"><img src="./js/chatdemo/image/ic_renovate.png" alt=""></span>
                        <span class="members"><img src="./js/chatdemo/image/ic_group.png" alt=""></span>
                        <span class="close"><i class="iconfont icon-guanbi"></i></span>
                    </span>
                </div>
                <ul class="team-members" >
                    
                </ul>
                <div class="nav">
                    <span class="itm z-active">全部</span> 
                    <span class="itm">文本</span>
                    <span class="itm">图片</span>
                    <span class="itm">收藏</span>
                </div>
                <div class="msgs-box info-wrapper"></div>
                <div class="text-box info-wrapper" style="display: none"></div>
                <div class="imgs-box info-wrapper" style="display: none"></div>
                <div class="collect-box info-wrapper" style="display: none">1231321321</div>
                <div class="noinfo-box" style="display: none;">
                    <div class="no-msg">
                        <div class="icon"><img src="./js/chatdemo/image/ic_none.png" alt=""></div>
                        <div class="des">无相关记录</div>
                    </div>
                </div>
                <div class="footer">
                    <div class="el-date-editor el-input ">
                        <img src="./js/chatdemo/image/ic_calendar.png" style="margin-left: 10px;"><input autocomplete="off" placeholder="选择日期" type="text" rows="2" class="el-input__inner">
                    </div>
                    <div class="pagination">
                        <span class="icon page-btn z-disabled"><img src="./js/chatdemo/image/img_first.png" alt=""></span> 
                        <span class="icon page-btn z-disabled"><img src="./js/chatdemo/image/img_last.png" alt=""></span> 
                        <span class="icon page-btn z-disabled"><img src="./js/chatdemo/image/img_next.png" alt=""></span>
                        <span class="icon page-btn z-disabled"><img src="./js/chatdemo/image/img_final.png" alt=""></span> 
                    </div>
                </div>
            </div>`
    var toastTemplate =
        `<div class="m-toast">
            
        </div>`;
    var cardTemplate =
        `<form id="eventForm" name="ans-typein" class="ans-show ans-typein" style="display: none;">
        </form>`
    var threadListTemplate = Handlebars.compile(threadListSourse);
    var userListTemplate = Handlebars.compile(UserListSourse);

    function ChatBox(opts) {
        util.extend(this, opts);
        this.container = this.container || document.body;
        this.elm = this._layout.cloneNode(true);
        this.sessionList = this.elm && this.elm.querySelector('.m-group');
        this.sessionUserList = this.elm && this.elm.querySelector('.m-user');
        this.chatEditor = this.elm && this.elm.querySelector('.m-chat-editor');
        this.contact = this.elm && this.elm.querySelector('.contact');
        this.patient = this.elm && this.elm.querySelector('.patient-list');
        this.oSearch = this.elm && this.elm.querySelector('.search');
        this.oText = this.elm && this.elm.querySelector('.u-search');
        this.oClear = this.elm&&this.elm.querySelector('.clear');
        this.container.appendChild(this.elm);
        this.container.appendChild(this._collectionLayout.cloneNode(true));
        this.container.appendChild(this._menuLayout.cloneNode(true));
        this.container.appendChild(this._imageLayout.cloneNode(true));
        this.container.appendChild(this._collectionStatusLayout.cloneNode(true));
        this.container.appendChild(this._dietRecordsLayout.cloneNode(true));
        this.container.appendChild(this._caseLayout.cloneNode(true));
        this.container.appendChild(this._blackBgLayout.cloneNode(true));
        this.container.appendChild(this._infoRecordLayout.cloneNode(true));
        this.container.appendChild(this._toastLayout.cloneNode(true));
        this.container.appendChild(this._cardLayout.cloneNode(true));
        this.sessionName = '';
        this.threadList = [];
        this.userList = [];
        this._initEvent();
    }

    util.extend(ChatBox.prototype, {
        _layout: util.html2Node(template),
        _collectionLayout:util.html2Node(collectionTemplate),
        _menuLayout:util.html2Node(menuTemplate),
        _imageLayout:util.html2Node(imageTemplate),
        _collectionStatusLayout:util.html2Node(collectionStatusTemplate),
        _dietRecordsLayout:util.html2Node(dietRecordsTemplate),
        _caseLayout:util.html2Node(caseTemplate),
        _blackBgLayout:util.html2Node(blackBgTemplate),
        _infoRecordLayout:util.html2Node(infoRecordTemplate),
        _toastLayout:util.html2Node(toastTemplate),
        _cardLayout:util.html2Node(cardTemplate),
        _initEvent: function () {
            var quitBtnList = this.elm.querySelectorAll('.closeChatBox');
            var _this = this;

            [].slice.call(quitBtnList).forEach(function (item) {
                item.addEventListener('click', function (e) {
                    _this.close();
                })
            });
            _this.contact.addEventListener('click',function (e) {
                _this.toggleLeft();
            });
            _this.patient.addEventListener('click',function (e) {
                _this.toggleRight();
            });
            _this.oSearch.addEventListener('click',function () {
                chat.getUserList(_this.oText.value);
                _this.toggleRight();
            });
            _this.oClear.addEventListener('click',function () {
                _this.oText.value = '';
                chat.getUserList( _this.oText.value);
            });
            $('.u-search').keydown(function(event){
                event=document.all?window.event:event;
                if((event.keyCode || event.which)==13){
                    chat.getUserList(_this.oText.value);
                    _this.toggleRight();
                }
            });
            _this.oText.oninput = function () {
                if (_this.oText.value == ''){
                    chat.getUserList(_this.oText.value);
                }
            };
            util.emitter.on('updateThreadList', function (threadList) {
                _this._renderThreadList(threadList);
            });
            util.emitter.on('updateUserList', function (userList) {
                _this._renderUserList(userList);
            })
        },
        _renderUserList:function (userList) {
            var _this = this;
            var sessionUserList = this.sessionUserList;
            var userListHtml = '';
            userList.forEach(function (item) {
                var length = userListTemplate(item).length;
                var template = userListTemplate(item);
                var str = '';
                str = template;
                userListHtml += str;
            })
            sessionUserList.innerHTML = userListHtml;
            var sessionItems = this.sessionItems = [].slice.call(sessionUserList.getElementsByClassName('itm'));
            sessionItems.forEach(function (item) {
                item.addEventListener('click', function (e) {
                    for(var i=0;i<chat.store.threadList.length;i++){
                        if(e.currentTarget.dataset.sessionName == chat.store.threadList[i].sessionName){
                            $('.m-group>.itm').eq(i).trigger('click');
                            return
                        }
                    }
                    _this._showChatWindow(e);
                });
            })
        },

        _renderThreadList: function (threadList) {
            var _this = this;
            var sessionList = this.sessionList;
            var threadListHtml = '';
            var display = ' style="display:none" ';
            threadList.forEach(function (item) {
                var length = threadListTemplate(item).length;
                var template = threadListTemplate(item);
                var str = '';
                if (JSON.stringify(item.lastMsg).length < 3) {
                    str = template.substring(0, 16) + display + template.substring(17, length);
                } else {
                    if (item.nickName) {
                        str = template
                    } else {
                        str = template.substring(0, 16) + display + template.substring(17, length);
                    }
                }
                threadListHtml += str;
            });
            sessionList.innerHTML = threadListHtml;

            var sessionItems = this.sessionItems = [].slice.call(sessionList.getElementsByClassName('itm'));
            sessionItems.forEach(function (item) {
                item.addEventListener('click', _this._showChatWindow.bind(_this));
                // item.addEventListener('click', function(e){
                // 	util.throttle(_this._showChatWindow.bind(_this, e), 300);
                // });
            })
        },

        _showChatWindow: function (e) {
            var _this = this,
                chatWindow = _this.chatWindow,
                chatWindowElm = _this.elm && _this.elm.querySelector('.j-chat-window'),
                unReadCount = e.currentTarget.dataset.unreadCount,
                sessionName = e.currentTarget.dataset.sessionName,
                nickName = e.currentTarget.dataset.nickName,
                canChat = e.currentTarget.dataset.canChat;
            //如果点击的是当前窗口，不做任何操作
            if (chatWindowElm && _this.sessionName == sessionName) return;
            //窗口在展示时候，点击需要先关闭窗口
            if (chatWindowElm && !chatWindow.elm.classList.contains('z-hid')) {
                chatWindow.close(function () {
                    _this._createChatWindow();
                    _this.sessionName = sessionName;
                    _this.chatWindow.show(sessionName, nickName, unReadCount, canChat);
                });
                // _this.chatWindow = {};
            } else {
                _this._createChatWindow();
                _this.sessionName = sessionName;
                _this.chatWindow && _this.chatWindow.show(sessionName, nickName, unReadCount, canChat);
            }
           chat.store.resendContent =[];
        },
        _showChatWindow2: function (sessionName, nickName, unReadCount, canChat) {
            var _this = this,
                chatWindow = _this.chatWindow,
                chatWindowElm = _this.elm && _this.elm.querySelector('.j-chat-window');
            //如果点击的是当前窗口，不做任何操作
            if (chatWindowElm && _this.sessionName == sessionName) return;
            //窗口在展示时候，点击需要先关闭窗口
            if (chatWindowElm && !document.querySelector('.m-chat-window').classList.contains('z-hid')) {
                chatWindow.close(function () {
                    _this._createChatWindow();
                    _this.sessionName = sessionName;
                    _this.chatWindow.show(sessionName, nickName, unReadCount, canChat);
                });
                // _this.chatWindow = {};
            } else {
                _this._createChatWindow();
                _this.sessionName = sessionName;
                _this.chatWindow && _this.chatWindow.show(sessionName, nickName, unReadCount, canChat);
            }
            chat.store.resendContent = [];
        },
        _createChatWindow: function () {
            if (!ChatWindow) return;
            var _this = this;
            _this.chatWindow = new ChatWindow({
                container: document.querySelector('.m-chat-wrap'),
                emojiItems: EmojiItems,
                animation: {
                    enter: 'zoomInRight',
                    leave: 'zoomOutRight'
                }
            });
        },

        toggleLeft:function (){
            this.sessionList.style.marginLeft = "0px";
            this.contact.classList.add('white');
            this.contact.classList.remove('gray');
            this.patient.classList.add('gray');
            this.patient.classList.remove('white');

        },
        toggleRight:function (){
            this.sessionList.style.marginLeft = "-310px";
            this.patient.classList.add('white');
            this.patient.classList.remove('gray');
            this.contact.classList.add('gray');
            this.contact.classList.remove('white');
        },
        show: function () {
            var elm = this.elm;
            elm.classList.remove('z-hid');
            util.animateClass(elm, this.animation.enter);
        },

        close: function () {
            var elm = this.elm,
                _this = this;

            util.animateClass(elm, this.animation.leave, function () {
                elm.classList.add('z-hid');
            });
        },

    })

    window.ChatBox = ChatBox;
})(util, Handlebars);
