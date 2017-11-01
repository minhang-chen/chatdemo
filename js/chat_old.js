/**
 * Created by KevinWang on 2017/2/22.
 */
(function(){
    //测试环境
    var imApiRoot = "http://182.92.8.118";
    var imImageRoot = "http://182.92.8.118/launchr";
    var imAppName = "test";

    /*
     //仿真环境
     var imApiRoot = "http://imhttp.joyjk.cn";
     var imImageRoot = "http://imhttp.joyjk.cn/launchr";
     var imAppName = "ALL";

     //生产环境
     var imApiRoot = "http://imhttp.juyuejk.com";
     var imImageRoot = "http://imhttp.juyuejk.com/launchr";
     var imAppName = "ALL";
     */

    var HISTORY_MESSAGE_URL = imApiRoot + '/launchr/chat/historymessage',
        UNREAD_SESSION_URL = imApiRoot + '/launchr/chat/unreadsession',
        SUBSCRIBE_MESSAGE_URL = imApiRoot + '/launchr/chat/subscribemessage',
        SEND_MSG_URL = imApiRoot + '/launchr/chat/sendmsg',
        READ_SESSION_URL = imApiRoot + '/launchr/chat/readsession';

    var chat = (function(){
        var userName = '';
        var appName = imAppName;
        var emojiPath = './emoji/';

        var showChat = document.querySelector('.j-user');
        userName = showChat.dataset['operatorId'];
        var nickName = showChat.dataset['nickName'];

        showChat.addEventListener('click', function(){
            chat.chatBox.show();
        })

        var store = {
            curMsgId: 0,
            curSessionName: '',
            curSessionMsgs: [],
            threadList: []
        };

        util.emitter.on('closeWindow', function(){
            store.curSessionName = '';
            store.curSessionMsgs = [];
        });

        function getHistoryMessage(sessionName, endTimeStamp) {
            return fetch(HISTORY_MESSAGE_URL, {
                mode: 'cors',
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "appName": appName,
                    "appToken": "verify-code",
                    "userName": chat.userName,
                    "to": sessionName,
                    "limit": 10,
                    "endTimestamp": endTimeStamp
                })
            }).then(function(res) {
                return res.json();
            }).then(function(data) {
                if (store.curSessionName !== sessionName) {
                    store.curSessionMsgs = [];
                    store.curSessionName = sessionName;
                }
                var msgs = dealMsgs(data.msg);
                if(store.curSessionMsgs.length == 0
                    || (store.curSessionMsgs.length > 0
                    && msgs[0].createDate !== store.curSessionMsgs[0].createDate)){

                    store.curSessionMsgs = msgs.concat(store.curSessionMsgs);
                    util.emitter.emit('curSessionUpdate', store.curSessionMsgs);

                } else if(store.curSessionMsgs.length > 0 && msgs[0].createDate == store.curSessionMsgs[0].createDate){
                    util.emitter.emit('scrollOver');
                }

            })
        }

        function dealMsgs(msgs){
            if(!msgs){
                return [];
            }
            msgs = msgs.filter(function(msg){
                return msg.type !== 'Cmd';
            }).map(translateMsg);

            msgs = _.sortBy(msgs, ['msgId']);
            return msgs;
        }

        //http://imhttp.joyjk.com:10017/launchr/JJZ3eaa
        function translateMsg(msg) {
            var msgContent = '',
                canParse = true,
                isImage = false,
                from = msg.from,
                time = getMsgTime(new Date(msg.createDate)),
                nickName = JSON.parse(msg.info).nickName;
            fromMyself = msg.from == userName;
            if (msg.type !== 'Text' && msg.type !== 'Image') {
                msgContent = '此类型消息web端不支持显示，请在手机端查看';
                canParse = false;
            } else if (msg.type == 'Image') {
                msgContent = msg.content ? imImageRoot + util.JSONParse(msg.content).fileUrl : '';
                isImage = true;
            } else {
                msgContent = msg.content;
            }
            var newMsg = {
                msgId: msg.msgId,
                time: time,
                createDate: msg.createDate,
                fromMyself: fromMyself,
                canParse: canParse,
                isImage: isImage,
                to: msg.to,
                from: from,
                content: msgContent,
                nickName:nickName
            }
            return newMsg;
        }



        function isEmoji(content) {
            var ranges = [
                '\ud83c[\udf00-\udfff]',
                '\ud83d[\udc00-\ude4f]',
                '\ud83d[\ude80-\udeff]'
            ];
            var reg = new RegExp(ranges.join('|'), 'g');
            return reg.test(content);
        }

        function getMsgTime(time) {
            var currentDate = new Date(),
                isToday = time.getFullYear() === currentDate.getFullYear() && time.getMonth() === currentDate.getMonth() && time.getDate() === currentDate. getDate();
            if (isToday) {
                return time.getHours() + ':' + leftPad(time.getMinutes());
            } else {
                return time.getMonth() + 1 + '月' + time.getDate() + '日';
            }
        }

        function leftPad(number) {
            if (typeof number !== 'number') number = Number(number);
            return number < 10 ? '0' + number : number;
        }

        function getThreadList() {
            fetch(UNREAD_SESSION_URL, {
                mode: 'cors',
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "appName": appName,
                    "appToken": "verify-code",
                    "userName": chat.userName,
                    "start": 0,
                    "end": 50
                })
            }).then(function(res) {
                return res.json();
            }).then(function(json) {
                var sessions = _.sortBy(json.sessions, function(o) {
                    return o.lastMsg && -o.lastMsg.msgId;
                });
                var threadList = sessions.map(function(item) {
                    return getThreadListItem(item);
                }).filter(function(item){
                    return Boolean(item);
                });
                store.curMsgId = threadList.length > 0 ? threadList[0].lastMsg.msgId : store.curMsgId;
                store.threadList = threadList;
                util.emitter.emit('updateThreadList', store.threadList);
            })
        }

        function getThreadListItem(session) {
            if(session.sessionName === 'Message@SYS' || session.sessionName === 'PUSH@SYS'){
                return null;
            }
            var threadItem = {
                avatar: '',
                count: '',
                sessionName: '',
                lastMsg: {},
                nickName: ''
            }
            var lastMsg = {};

            if(session.lastMsg){
                lastMsg = translateMsg(session.lastMsg);
                lastMsg.content = getLastMsgContent(session.lastMsg.content);
            }

            threadItem = _.assign({}, {
                sessionName: session.sessionName,
                avatar: session.avatar || '',
                count: session.count,
                nickName: session.nickName || util.JSONParse(session.lastMsg.info).nickName,
                lastMsg: lastMsg
            })
            return threadItem;
        }

        function getLastMsgContent(content) {
            try {
                var newContent = JSON.parse(content);
                return newContent = newContent.msgTitle || (newContent.title && '[' + newContent.title + ']') || newContent;
            } catch (err) {
                return content;
            }
        }

        function loadLongPoll() {
            fetch(SUBSCRIBE_MESSAGE_URL, {
                mode: 'cors',
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "appName": appName,
                    "appToken": "verify-code",
                    "userName": chat.userName,
                    "msgId": store.curMsgId,
                    "milliseconds": 20000
                })
            }).then(function(res) {
                return res.json();
            }).then(function(data) {
                store.curMsgId = data.msg && data.msg.length > 0 ? data.msg[data.msg.length - 1].msgId : store.curMsgId;
                var msgs = dealMsgs(data.msg);
                //更改threadList  找到sessionName对应的thread  更改这个thread
                msgs.forEach(function(item, index) {
                    dealPollMsg(item);
                });
                loadLongPoll();
            })
        }

        function dealPollMsg(msg) {
            var isMySelf,
                sessionID,
                threadList;

            isMySelf = msg.from == chat.userName;
            sessionID = isMySelf ? msg.to : msg.from;
            threadList = store.threadList;

            var willUpdateThread = _.find(store.threadList, ['sessionName', sessionID]);

            //如果存在要更新的会话
            if (!!willUpdateThread) {
                //回话窗口和会话列表更新

                if (willUpdateThread.sessionName == store.curSessionName) {
                    store.curSessionMsgs.push(msg);
                    util.emitter.emit('curSessionUpdate', store.curSessionMsgs);
                }
                chat.getThreadList();
                // willUpdateThread.lastMsg = msg;
                // util.emitter.emit('updateThreadList', store.threadList);
            }
        }

        function markRead(sessionName, content){
            fetch(READ_SESSION_URL, {
                mode: 'cors',
                method: 'post',
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    "appName": appName,
                    "appToken": "verify-code",
                    "userName": chat.userName,
                    "sessionName": sessionName,
                    "content": content
                })
            }).then(function(res){
                return res.json();
            }).then(function(data){
                chat.getThreadList();
            })
        }


        // function updateMessage() {
        //     fetch(SUBSCRIBE_MESSAGE_URL, {
        //         mode: 'cors',
        //         method: 'post',
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify({
        //             "appName": appName,
        //             "appToken": "verify-code",
        //             "userName": chat.userName,
        //             "msgId": '1480908208798',
        //             "milliseconds": 10000
        //         })
        //     }).then(function(res) {
        //         return res.json();
        //     }).then(function(data) {
        //         console.log(data);
        //     })
        // }

        function sendGroupMsg(chatRooms, content, type){
            var info = {'nickName': nickName};
            info = JSON.stringify(info);
            return fetch(SEND_MSG_URL,{
                mode: 'cors',
                method: 'post',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "appName": appName,
                    "appToken": "verify-code",
                    "userName": userName,
                    "to": chatRooms,
                    "content": content,
                    "type": type,
                    "clientMsgId": store.curMsgId,
                    "info": info
                })
            })
        }

        var d = new Date();
        d.setDate(d.getDate() + 1);
        function setCookie(name,value,expires,path,domain,secure){
            var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
            cookie = name + '=' + value;
            if(expires){
                cookie += '; expires=' + expires.toGMTString();
            }
            if(path){
                cookie += '; path=' + path;
            }
            if(domain){
                cookie += '; domain=' + domain;
            }
            if(secure){
                cookie += '; secure=' + secure;
            }
            document.cookie = cookie;
        }

        // setCookie('AppName', appName, d, '/', 'mintcode.com');
        // setCookie('UserName', userName, d, '/', 'mintcode.com');
        setCookie('AppName', appName, d, '/', window.location.hostname);
        setCookie('UserName', userName, d, '/', window.location.hostname);
        return{
            store: store,
            userName: userName,
            getHistoryMessage: getHistoryMessage,
            translateMsg: translateMsg,
            isEmoji: isEmoji,
            getMsgTime: getMsgTime,
            leftPad: leftPad,
            getThreadList: getThreadList,
            getThreadListItem: getThreadListItem,
            getLastMsgContent: getLastMsgContent,
            loadLongPoll: loadLongPoll,
            dealPollMsg: dealPollMsg,
            sendGroupMsg:sendGroupMsg,
            markRead: markRead
        }
    })();

    // updateMessage();

    chat.getThreadList();
    chat.loadLongPoll();




    // getSessionDetail('1483952717158');

    var chatBox = new ChatBox({
        animation: {
            enter: 'lightSpeedIn',
            leave: 'lightSpeedOut'
        }
    });
    chat.chatBox = chatBox;
    window.chat = chat;
    //
    // var showChatList = document.querySelector('#showChatList');
    // showChatList.addEventListener('click', function() {
    //     chatBox.show();
    // });

})();