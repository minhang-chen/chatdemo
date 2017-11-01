(function () {
    var HISTORY_MESSAGE_URL = myConfig.imApiRoot + '/launchr/chat/historymessage',
        UNREAD_SESSION_URL = myConfig.imApiRoot + '/launchr/chat/unreadsession',
        SUBSCRIBE_MESSAGE_URL = myConfig.imApiRoot + '/launchr/chat/subscribemessage',
        SEND_MSG_URL = myConfig.imApiRoot + '/launchr/chat/sendmsg',
        READ_SESSION_URL = myConfig.imApiRoot + '/launchr/chat/readsession',
        USER_SESSION_URL = myConfig.webIM+'/uniqueComservice2/base.do?do=httpInterface&module=workBenchPatientService&method=getWorkBenchPatientList&flag=2',
        ADD_BOOKMARK_URL = myConfig.imApiRoot + '/launchr/chat/addbookmark',
        SEARCH_BOOKMARK_URL = myConfig.imApiRoot + '/launchr/chat/searchbookmark',
        DELETE_BOOKMARK_URL = myConfig.imApiRoot + '/launchr/chat/deletebookmark',
        TEAM_MEMBER_URL = myConfig.imApiRoot + '/launchr/chat/session';

    var chat = (function () {
        var userName = '';
        var staffId='';
        var appName = myConfig.imAppName;
        var emojiPath = './emoji/';
        var imApiRoot1 = myConfig.imApiRoot;
        var showChat = document.querySelector('.j-user');
        userName = showChat.dataset['operatorId'];
        staffId = showChat.dataset['staffId'];
        var nickName = showChat.dataset['nickName'];
        showChat.addEventListener('click', function () {
            chat.chatBox.show();
        });

        var store = {
            curMsgId: 0,
            curSessionName: '',
            lastTime: '',
            firstTime:'',
            oTimeBtn:'',
            curSessionMsgs: [],
            curSessionMsgsInfo: [],
            collectInfo:[],
            threadList: [],
            memberUserNa:[],
            resendContent:[],
            clientTime: +new Date()

        };
        var limit = 10;
        util.emitter.on('closeWindow', function () {
            store.curSessionName = '';
            store.curSessionMsgs = [];
        });
        function collectPictures(msgId){
            return fetch(ADD_BOOKMARK_URL,{
                mode: 'cors',
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "appName": appName,
                    "appToken": "verify-code",
                    "userName": chat.userName,
                    "sessionName":store.curSessionName,
                    "msgId": msgId
                })
            })
        }
        function deleteCollect(msgId) {
            return fetch(DELETE_BOOKMARK_URL,{
                mode: 'cors',
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "appName": appName,
                    "appToken": "verify-code",
                    "userName": chat.userName,
                    "sessionName":store.curSessionName,
                    "msgId": msgId
                })
            })
        }
        /*获得群成员*/
        function getTeamMember() {
            return fetch(TEAM_MEMBER_URL, {
                mode: 'cors',
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "appName": appName,
                    "userName": chat.userName,
                    "sessionName":store.curSessionName,
                    "appToken": "verify-code"
                })
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
                store.memberUserNa = [];
                var info = data.data.memberList.map(translateTeamMember);
                util.emitter.emit('memberUpdate', info);
            })
        }
        function translateTeamMember(msg) {
            var nickName = msg.nickName,
                userName = msg.userName,
                avatarImg = myConfig.webIM + '/uniqueComservice2/base.do?method=getUserImageDesc&userId='+userName;

            var memberInfo = {
                nickName: nickName,
                userName: userName,
                avatarImg: avatarImg
            };
            store.memberUserNa.push(userName);
            return memberInfo;
        }
        function getCollectInfo() {
            return fetch(SEARCH_BOOKMARK_URL,{
                mode: 'cors',
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "appName": appName,
                    "appToken": "verify-code",
                    "userName": chat.userName,
                    "to":store.curSessionName,
                    "limit": "200",
                    "endTimestamp": -1
                })
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
                var info = data.msg.map(translateCollectInfo);
                util.emitter.emit('collectInfoUpdate', info);
            })
        }
        function translateCollectInfo(msg) {
            var isImage = false,
                classify = false,
                content = '',
                msgId = msg.msgId,
                bookMarkName = '',
                createDate = getMsgTime(new Date(msg.createDate)),
                nickName = util.JSONParse(msg.info).nickName,
                userName = util.JSONParse(msg.info).userName,
                avatarImg = myConfig.webIM + '/uniqueComservice2/base.do?method=getUserImageDesc&userId='+userName;
            if (msg.type == 'Text'){
                content = msg.content;
            }else if(msg.type == 'Image'){
                isImage = true;
                content = msg.content ? myConfig.imImageRoot + util.JSONParse(msg.content).fileUrl : '';
                bookMarkName = msg.bookMarkName;
                if (bookMarkName){
                    classify = true;
                }
            }
            var newInfo = {
                isImage :isImage,
                content: content,
                createDate: createDate,
                bookMarkName: bookMarkName,
                nickName: nickName,
                userName: userName,
                avatarImg: avatarImg,
                classify: classify,
                msgId: msgId
            };
            return newInfo;
        }
        function getHistoryMessageInfo(sessionName,startTimestamp,endTimestamp,type) {
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
                    "limit": 22,
                    "startTimestamp": startTimestamp,
                    "endTimestamp": endTimestamp,
                    "type": type
                })
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
                if (store.curSessionName !== sessionName) {
                    store.curSessionMsgsInfo = [];
                    store.curSessionName = sessionName;
                }
                var msgs = dealMsgs(data.msg);
                store.lastTime= msgs[msgs.length - 1] ? Date.parse(new Date(msgs[msgs.length - 1].localTime)): store.lastTime;
                store.firstTime =msgs[0] ? Date.parse(new Date(msgs[0].localTime)):store.firstTime;
                if(msgs.length < 22){
                    $('.m-dialog .footer .page-btn').css('opacity','.5');
                    if(store.oTimeBtn == '1'){
                        changeB()
                    }else if(store.oTimeBtn == '2'){
                        changeA()
                    }
                }else{
                    changeA()
                    if(store.oTimeBtn == '1'){
                        $('.m-dialog .footer .page-btn').css('opacity','1');
                    }else if(store.oTimeBtn == '2'){
                        $('.m-dialog .footer .page-btn').css('opacity','1');
                    }else if(store.oTimeBtn == '0'){
                        changeB()
                    }else if(store.oTimeBtn == '3'){
                        changeA()
                    }
                }
                if (msgs[msgs.length - 1] && msgs[0]){
                    store.curSessionMsgsInfo = [];
                }else{
                    $('.m-dialog .footer .page-btn').eq()
                }
                store.curSessionMsgsInfo = msgs.concat(store.curSessionMsgsInfo);
                util.emitter.emit('curSessionInfoUpdate', store.curSessionMsgsInfo);
            })
        }
        function changeA() {
            $('.m-dialog .footer .page-btn').eq(0).css('opacity','1');
            $('.m-dialog .footer .page-btn').eq(1).css('opacity','1');
            $('.m-dialog .footer .page-btn').eq(2).css('opacity','.5');
            $('.m-dialog .footer .page-btn').eq(3).css('opacity','.5');
        }
        function changeB() {
            $('.m-dialog .footer .page-btn').eq(0).css('opacity','.5');
            $('.m-dialog .footer .page-btn').eq(1).css('opacity','.5');
            $('.m-dialog .footer .page-btn').eq(2).css('opacity','1');
            $('.m-dialog .footer .page-btn').eq(3).css('opacity','1');
        }
        function getPersonHistoryMessageInfo(sessionName,userName,startTimestamp,endTimestamp,type) {
            return fetch(HISTORY_MESSAGE_URL, {
                mode: 'cors',
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "appName": appName,
                    "appToken": "verify-code",
                    "userName": userName,
                    "onlyFrom": userName,
                    "to": sessionName,
                    "limit": 22,
                    "startTimestamp": startTimestamp,
                    "endTimestamp": endTimestamp,
                    "type": type
                })
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
                if (store.curSessionName !== sessionName) {
                    store.curSessionMsgsInfo = [];
                    store.curSessionName = sessionName;
                }
                var msgs = dealMsgs(data.msg);
                store.curSessionMsgsInfo = [];
                store.curSessionMsgsInfo = msgs.concat(store.curSessionMsgsInfo);
                util.emitter.emit('curSessionInfoUpdate', store.curSessionMsgsInfo);
            })
        }
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
                    "limit": limit,
                    "endTimestamp": endTimeStamp
                })
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
                if (store.curSessionName !== sessionName) {
                    store.curSessionMsgs = [];
                    store.curSessionName = sessionName;
                }
                var msgs = dealMsgs(data.msg);
                if (data.msg.length >= limit) {
                    if (msgs.length < 10) {
                        msgs = {};
                        limit += 10;
                        getHistoryMessage(sessionName, endTimeStamp);
                        return
                    }
                }
                if (store.curSessionMsgs.length == 0
                    || (store.curSessionMsgs.length > 0
                    && msgs[0].createDate !== store.curSessionMsgs[0].createDate)) {

                    store.curSessionMsgs = msgs.concat(store.curSessionMsgs);
                    util.emitter.emit('curSessionUpdate', store.curSessionMsgs);

                } else if (store.curSessionMsgs.length > 0 && msgs[0].createDate == store.curSessionMsgs[0].createDate) {
                    util.emitter.emit('scrollOver');
                }
            })
        }
        function dealMsgs(msgs) {
            if (!msgs) {
                return [];
            }
            msgs = msgs.filter(function (msg) {
                if (msg.type == 'Alert' && util.JSONParse(msg.info).alertContent == undefined) {
                    return
                }
                return msg.type !== 'Cmd';
            }).map(translateMsg);
            var oMsg = [];
            for (var i=0;i<msgs.length;i++){
                if (msgs[i].isDone !='Y'){
                    oMsg.push(msgs[i]);
                }else{
                    if (store.resendContent.length==0){
                        store.resendContent.push(msgs[i]);
                    }else{
                        var contentN=0;
                        for (var j=0;j<store.resendContent.length;j++){
                            if (msgs[i].clientMsgId ==store.resendContent[j].clientMsgId){
                                contentN++;
                            }
                        }
                        if (contentN==0){
                            store.resendContent.push(msgs[i]);
                        }
                    }
                }
            }
            msgs = oMsg;
            msgs = _.sortBy(msgs, ['msgId']);
            var msgsLength = msgs.length;
            if (msgsLength>0){
                for (var i=0;i<store.resendContent.length;i++){
                    if(store.resendContent[i].clientMsgId <= msgs[msgsLength-1].msgId && store.resendContent[i].clientMsgId >= msgs[0].msgId){
                        msgs.push(store.resendContent[i]);
                    }
                }
            }
            msgs = _.sortBy(msgs, ['msgId']);
            return msgs;
        }

        //http://imhttp.joyjk.com:10017/launchr/JJZ3eaa
        function translateMsg(msg) {
            var msgContent = '',
                msgId = msg.msgId,
                title = '',
                imgSrc = '',
                receipt = '',
                status = '',
                recordId = '',
                userId = '',
                classId = '',
                aClass='',
                healthyPlanId= '',
                notesId = '',
                userRecipeId='',
                bookMark = '',
                isDone = '',
                audioLength = '',
                isText = false,
                canParse = true,
                isImage = false,
                isNew = false,
                isReSend = false,
                isReceipt = false,
                isAudio = false,
                from = msg.from,
                clientMsgId = msg.clientMsgId,
                time = getMsgTime(new Date(msg.createDate)),
                localTime = formatDate(new Date(msg.createDate)),
                nickName = JSON.parse(msg.info).nickName,
                eventType = util.JSONParse(msg.content);
            fromMyself = msg.from == userName;
            if (msg.type !== 'Text' && msg.type !== 'Image' && msg.type != 'Event' && msg.type != 'ReSend' && msg.type != 'Alert' && msg.type != 'News' && msg.type != 'Audio') {
                msgContent = '此类型消息web端不支持显示，请在手机端查看';
                // msgContent = msg.type + msg.content+'233333';
                isReSend = true;
                canParse = false;
            } else if (msg.type == 'Image') {
                msgContent = msg.content ? myConfig.imImageRoot + util.JSONParse(msg.content).fileUrl : '';
                isImage = true;
                bookMark = msg.bookMark;
            } else if (msg.type == 'Event') {
                if (util.JSONParse(msg.content).type && util.JSONParse(msg.content).type == 'receiptMsg') {
                    canParse = true;
                } else {
                    cardImg(eventType);
                    canParse = false;
                }
                if (util.JSONParse(msg.content).msgTitle == '[问诊表]'){
                    aClass = "eventWZ";
                }else if (util.JSONParse(msg.content).msgTitle == '[随访]' ){
                    aClass = "eventSF";
                }else if (util.JSONParse(msg.content).msgTitle == '[健康计划]'){
                    aClass = "eventJKJH";
                }else if(util.JSONParse(msg.content).msgTitle == '[建议]'||util.JSONParse(msg.content).msgTitle == '[处方]'|| util.JSONParse(msg.content).msgTitle == '[建议终止]'){
                    aClass = "eventSuggest";
                }else if (util.JSONParse(msg.content).msgTitle == '[评估]' || util.JSONParse(msg.content).msgTitle == '[查房]'){
                    aClass = "eventTest";
                }
                status = util.JSONParse(msg.content).status;
                userId = util.JSONParse(msg.content).userId;
                recordId = util.JSONParse(msg.content).recordId;
                healthyPlanId = util.JSONParse(msg.content).healthyPlanId;
                userRecipeId = util.JSONParse(msg.content).userRecipeId;
                msgContent = util.JSONParse(msg.content).msg;
                // msgContent =JSON.stringify(msg)
            } else if (msg.type == 'ReSend') {
                if (eventType.type == 'Alert') {
                    isReSend = true;
                    msgContent = nickName + '撤回了一条信息';
                    canParse = false;
                } else if (eventType.type == 'Event') {
                    var eventType = util.JSONParse(util.JSONParse(msg.content).content);
                    if (eventType.type && eventType.type == 'receiptMsg') {
                        canParse = true;
                    } else {
                        cardImg(eventType);
                        canParse = false;
                    }
                    if (eventType.msgTitle == '[问诊表]'){
                        aClass = "eventWZ";
                    }else if (eventType.msgTitle == '[随访]'){
                        aClass = "eventSF";
                    }else if (eventType.msgTitle == '[评估]' || eventType.msgTitle == '[查房]'){
                        aClass = "eventTest";
                    }
                    status = util.JSONParse(util.JSONParse(msg.content).content).status;
                    recordId = util.JSONParse(util.JSONParse(msg.content).content).recordId;
                    userId = util.JSONParse(util.JSONParse(msg.content).content).userId;
                    isDone = util.JSONParse(util.JSONParse(msg.content).content).isDone;
                    time = getMsgTime(new Date(msg.clientMsgId));
                    msgId = msg.clientMsgId;
                    msgContent = util.JSONParse(msg.info).alertContent;
                    // msgContent =msg.content;
                }
            } else if (msg.type == 'Alert') {
                msgContent = util.JSONParse(msg.info).alertContent;
                isReSend = true;
                canParse = false;
            } else if (msg.type == 'News') {
                msgContent = util.JSONParse(msg.content).description;
                // msgContent = JSON.stringify(msg);
                if (util.JSONParse(msg.content).notesId) {
                    if (util.JSONParse(msg.content).picUrl == null) {
                        imgSrc = './js/chatdemo/image/ic_gonggao.png';
                    } else {
                        imgSrc = util.JSONParse(msg.content).picUrl;
                    }
                    aClass = 'notice';
                    notesId = util.JSONParse(msg.content).notesId;
                } else {
                    imgSrc = './js/chatdemo/image/ic_xuanjiao.png';
                    aClass='news';
                    classId = util.urlParse(util.JSONParse(msg.content).url).classId;
                }
                title = util.JSONParse(msg.content).title;
                isNew = true;
                canParse = false;
                userId =util.JSONParse(msg.info).userName;
            } else if (msg.type == 'Text'){
                isText = true;
                msgContent = msg.content;
                bookMark = msg.bookMark;
            }else if(msg.type == 'Audio'){
                msgContent = msg.content ? myConfig.imImageRoot + util.JSONParse(msg.content).fileUrl : '';
                // msgContent =JSON.stringify(msg);
                audioLength = util.JSONParse(msg.content).audioLength;
                isAudio = true;
            }
            function cardImg(obj) {
                if (obj.type == 'surveyPush') {
                    imgSrc = './js/chatdemo/image/icon_suifang.png'
                } else if (obj.type == 'tellVisitDoc' || obj.type == 'continueTest' || obj.type == 'adjustWarning' || obj.type == 'testResultPage') {
                    imgSrc = './js/chatdemo/image/icon_yujing.png'
                } else if (obj.type == 'assessPush') {
                    imgSrc = './js/chatdemo/image/icon_pinggu.png'
                } else if (obj.type == 'inquirySend' || obj.type == 'serviceComments') {
                    imgSrc = './js/chatdemo/image/ic_wenzhen.png'
                } else if (obj.type == 'recipePage' || obj.type == 'stopRecipe') {
                    imgSrc = './js/chatdemo/image/icon_card_prescription.png'
                } else if (obj.type == 'healthyExecute' || obj.type == 'shareNotes' || obj.type == 'healthyAdjust' || obj.type == 'healthySubmit') {
                    imgSrc = './js/chatdemo/image/icon_card_health_plan.png'
                } else if (obj.type == 'roundsFilled' || obj.type == 'roundsAsk') {
                    imgSrc = './js/chatdemo/image/icon_chafang.png'
                }else if(obj.type == 'sendCompleateDocMsg'){
                    imgSrc = './js/chatdemo/image/icon_card_hospitalization_records.png'
                }
            }

            var newMsg = {
                msgId: msgId,
                time: time,
                localTime: localTime,
                createDate: msg.createDate,
                fromMyself: fromMyself,
                canParse: canParse,
                isText: isText,
                isImage: isImage,
                isReSend: isReSend,
                isNew: isNew,
                isReceipt: isReceipt,
                to: msg.to,
                from: from,
                content: msgContent,
                nickName: nickName,
                title: title,
                receipt: receipt,
                imgSrc: imgSrc,
                status: status,
                recordId: recordId,
                userId: userId,
                healthyPlanId: healthyPlanId,
                classId: classId,
                notesId: notesId,
                userRecipeId: userRecipeId,
                aClass: aClass,
                bookMark: bookMark,
                clientMsgId:clientMsgId,
                isDone: isDone,
                isAudio: isAudio,
                audioLength: audioLength
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
                isToday = time.getFullYear() === currentDate.getFullYear() && time.getMonth() === currentDate.getMonth() && time.getDate() === currentDate.getDate();
            if (isToday) {
                return time.getHours() + ':' + leftPad(time.getMinutes());
            } else {
                return time.getMonth() + 1 + '月' + time.getDate() + '日';
            }
        }

        function formatDate(now)   {
            var year=now.getFullYear();
            var month=now.getMonth()+1;
            var date=now.getDate();
            var hour=now.getHours();
            var minute=now.getMinutes();
            var second=now.getSeconds();
            return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;
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
                    "end": 2000
                })
            }).then(function (res) {
                return res.json();
            }).then(function (json) {
                var sessions = _.sortBy(json.sessions, function (o) {
                    return o.lastMsg && -o.lastMsg.msgId;
                });
                var threadList = sessions.map(function (item) {
                    return getThreadListItem(item);
                }).filter(function (item) {
                    return Boolean(item);
                });
                store.curMsgId = threadList.length > 0 ? threadList[0].lastMsg.msgId : store.curMsgId;
                store.threadList = threadList;
                util.emitter.emit('updateThreadList', store.threadList);
            })
        }
        function getUserList(userNameF) {
            fetch(USER_SESSION_URL, {
                mode: 'cors',
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "staffId": staffId,
                    "userName": userNameF
                })
            }).then(function (res) {
                return res.json()
            }).then(function (json) {
                var sessions = _.sortBy(json.return_msg.result.list);
                var userList = sessions.map(function (item) {
                    return getUserListItem(item);
                }).filter(function (item) {
                    return Boolean(item);
                });
                util.emitter.emit('updateUserList', userList);
            })
        }
        function getUserListItem(session) {
            var canChat='';
            var userItem = {
                avatar: '',
                userName: '',
                sex: '',
                age: '',
                illDiagnose: '',
                sessionName: '',
                teamName: ''
            };
            userItem = {
                avatar: session.avatar,
                userName: session.userName,
                sex: session.sex,
                age: session.age,
                illDiagnose: session.illDiagnose,
                sessionName: session.imGroupId,
                teamName:session.teamName
            }
            return userItem
        }

        function getThreadListItem(session) {
            if (session.sessionName === 'Message@SYS' || session.sessionName === 'PUSH@SYS') {
                return null;
            }
            var threadItem = {
                avatar: '',
                count: '',
                sessionName: '',
                lastMsg: {},
                nickName: '',
                canChat: ''
            };
            var lastMsg = {};
            if (session.lastMsg) {
                lastMsg = translateMsg(session.lastMsg);
                lastMsg.content = getLastMsgContent(session.lastMsg.content);
            }
            threadItem = _.assign({}, {
                sessionName: session.sessionName,
                avatar: session.avatar || '',
                count: session.count,
                // nickName: session.nickName || util.JSONParse(session.lastMsg.info).nickName,
                nickName: session.nickName,
                lastMsg: lastMsg,
                canChat: session.extension ? util.JSONParse(session.extension).canChat : ''
            });
            return threadItem;
        }

        function getLastMsgContent(content) {
            try {
                var newContent = JSON.parse(content);
                if (newContent.fileName) {
                    newContent = "[图片]";
                }
                if (newContent.type == 'Alert') {
                    newContent = newContent.content;
                }
                if (newContent.audioLength){
                    newContent = "[语音]";
                }
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
            }).then(function (res) {
                return res.json();
            }).then(function (data) {

                var _data = _.sortBy(data.msg,function (o) {
                    return o.msgId
                });
                store.curMsgId = data.msg && data.msg.length > 0 ? _data[data.msg.length - 1].msgId : store.curMsgId;
                var msgs = dealMsgs(data.msg);
                //更改threadList  找到sessionName对应的thread  更改这个thread
                msgs.forEach(function (item, index) {
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

        function markRead(sessionName, content) {
            fetch(READ_SESSION_URL, {
                mode: 'cors',
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "appName": appName,
                    "appToken": "verify-code",
                    "userName": chat.userName,
                    "sessionName": sessionName,
                    "content": content
                })
            }).then(function (res) {
                return res.json();
            }).then(function (data) {
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
        function sendGroupMsg(chatRooms, content, type) {
            var info = {'nickName': nickName};
            info = JSON.stringify(info);
            store.clientTime = store.clientTime+1;
            return $.ajax({
                url: SEND_MSG_URL,
                async:false,
                type: 'post',
                dataType:'json',
                contentType:'application/json',
                data: JSON.stringify({
                    "appName": appName,
                    "appToken": "verify-code",
                    "userName": userName,
                    "to": chatRooms,
                    "content": content,
                    "type": type,
                    "clientMsgId": store.clientTime,
                    "info": info
                })
            })
            // fetch(SEND_MSG_URL, {
            //     mode: 'cors',
            //     method: 'post',
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({
            //         "appName": appName,
            //         "appToken": "verify-code",
            //         "userName": userName,
            //         "to": chatRooms,
            //         "content": content,
            //         "type": type,
            //         "clientMsgId": store.clientTime,
            //         "info": info
            //     })
            // })
        }

        var d = new Date();
        d.setDate(d.getDate() + 1);
        function setCookie(name, value, expires, path, domain, secure) {
            var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
            cookie = name + '=' + value;
            if (expires) {
                cookie += '; expires=' + expires.toGMTString();
            }
            if (path) {
                cookie += '; path=' + path;
            }
            if (domain) {
               if (domain != '182.92.8.118' && domain != 'localhost'){
                    domain = domain.split('.')[1] + '.' + domain.split('.')[2];
                }
                cookie += '; domain=' + domain;
            }
            if (secure) {
                cookie += '; secure=' + secure;
            }
            document.cookie = cookie;
        }

        // setCookie('AppName', appName, d, '/', 'mintcode.com');
        // setCookie('UserName', userName, d, '/', 'mintcode.com');
        setCookie('AppName', appName, d, '/', window.location.hostname);
        setCookie('UserName', userName, d, '/', window.location.hostname);
        return {
            store: store,
            userName: userName,
            collectPictures: collectPictures,
            getHistoryMessage: getHistoryMessage,
            getHistoryMessageInfo: getHistoryMessageInfo,
            getPersonHistoryMessageInfo:getPersonHistoryMessageInfo,
            getCollectInfo: getCollectInfo,
            getTeamMember: getTeamMember,
            translateMsg: translateMsg,
            deleteCollect: deleteCollect,
            isEmoji: isEmoji,
            getMsgTime: getMsgTime,
            leftPad: leftPad,
            getThreadList: getThreadList,
            getThreadListItem: getThreadListItem,
            getLastMsgContent: getLastMsgContent,
            getUserList: getUserList,
            getUserListItem: getUserListItem,
            loadLongPoll: loadLongPoll,
            dealPollMsg: dealPollMsg,
            sendGroupMsg: sendGroupMsg,
            markRead: markRead,
            imApiRoot: imApiRoot1
        }
    })();

    // updateMessage();

    chat.getThreadList();
    chat.loadLongPoll();
    chat.getUserList();

    // getSessionDetail('1483952717158');

    var chatBox = new ChatBox({
        animation: {
            enter: 'lightSpeedIn',
            leave: 'lightSpeedOut'
        }
    });
    chat.chatBox = chatBox;
    window.chat = chat;
    // var showChatList = document.querySelector('#showChatList');
    // showChatList.addEventListener('click', function() {
    //     chatBox.show();
    // });
})();