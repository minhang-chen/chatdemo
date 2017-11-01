(function (util) {

    var template =
        `<div class="m-chat-window j-chat-window animated" data-session-name="{{sessionName}}">
			<div class="m-head info-head">
				<span class="j-nickname title">{{groupName}}</span>
				<i class="iconfont icon-guanbi quit closeChatWindow"></i>
			</div>
			<div class="m-chat-area">
				<ul class="m-chat-messages">
					<!--<li class="chat-time">{{time}}</li>-->
					<!--<li></li>-->
					<!--<li class="itm itm-left">-->
						<!--<span class="m-avatar"><i class="iconfont avatar icon-morentouxiang"></i></span>-->
						<!--<span class="chat-message">在吗？</span>-->
					<!--</li>-->
					<!--<li class="itm itm-left">-->
						<!--<span class="m-avatar"><i class="iconfont avatar icon-morentouxiang"></i></span>-->
						<!--<span class="chat-message">在吗？</span>-->
					<!--</li>		-->
				</ul>
			</div>
			<div class="m-editor">
			  	<div class="chat-face">
			  	  <ul class="face-list z-hid">
			  	  </ul>
			  	</div>
			  	<div id="toolbar">
			  	  <!-- <button class="ql-image"><i class="iconfont icon-tupian"></i></button> -->
			  	  <label id="pictruePicker" class="iconfont icon-tupian select-image">
			  	  	<!--<input type="file" accept="image/png, image/gif, image/jpeg, image/bmp, image/x-icon, image/svg+xml" class="ql-image">-->
			  	  </label>
			  	  <button class="ql-emoji"><i class="iconfont icon-xiaolian"></i></button>
			  	  <!-- <button class="uploadfile"><i class="iconfont icon-wenjian"></i></button>-->
			  	  <img class="u-record" src="./js/chatdemo/image/ic_before.png">
			  	</div>
			  	<div id="editor">
			  	</div>
			  	<a class="u-send-btn j-send-btn" href="javascript:;">发送</a>
			</div>
			<div class="m-hint expire">资讯服务未开通/已到期</div>
			<div class="status-hint" style="display: none;">该表未填写</div>
		</div>`;

    var msgSource =
        `<li class="chat-time">{{time}}</li>
		{{#if canParse}}
			{{#if fromMyself}}
			    <li style="text-align: right;margin-right: 52px;">{{nickName}}</li>
			 	<li class="itm itm-right">
					<span class="m-avatar"><i class="iconfont avatar icon-morentouxiang"></i></span>
					{{#if isImage}}
						<img src="{{content}}" width="110" class="oImage" data-book-mark="{{bookMark}}" data-msg-id="{{msgId}}">
					{{else}}
					    {{#if isAudio}}
					        <span class="audio-message">
					            <span class="audio-length">
                                    <span>{{audioLength}}</span>
                                    <span>"</span>
					            </span>
					            <img src="./js/chatdemo/image/noPlay.png">
					        </span> 
					        <audio src="{{content}}"></audio>
					    {{else}}
						<span class="chat-message oText" data-msg-id="{{msgId}}" data-book-mark="{{bookMark}}">{{content}}
						{{#if isReceipt}}
						    <span class="u-receipt">{{receipt}}</span>
						 {{/if}}
						</span>
						{{/if}}
					{{/if}}
			 	</li>
			{{else}}
			    <li style="text-align: left;margin-left: 52px;">{{nickName}}</li>
			 	<li class="itm itm-left">
					<span class="m-avatar"><i class="iconfont avatar icon-morentouxiang"></i></span>
					{{#if isImage}}
						<img src="{{content}}" width="110" class="oImage" data-book-mark="{{bookMark}}" data-msg-id="{{msgId}}">
					{{else}}
					    {{#if isAudio}}
					        <span class="audio-message">
					            <span class="audio-length">
                                    <span>{{audioLength}}</span>
                                    <span>"</span>
					            </span>
					            <img src="./js/chatdemo/image/noPlay.png">
					        </span> 
					        <audio src="{{content}}"></audio>
					    {{else}}
						<span class="chat-message oText" data-msg-id="{{msgId}}" data-book-mark="{{bookMark}}">{{content}}
						</span>
						{{/if}}
					{{/if}}
			 	</li>
			{{/if}}
		{{else}}
			{{#if fromMyself}}
			    {{#if isReSend}}
			        <li class="not-parse">{{content}}<li>
			    {{else}}
                    <li style="text-align: right;margin-right: 52px;">{{nickName}}</li>
                    <li class="itm itm-right">
                        <span class="m-avatar"><i class="iconfont avatar icon-morentouxiang"></i></span>
                        <span class="chat-message">
                            {{#if isNew}}
                                <span class="title">{{title}}</span>
                                <span style="padding: 10px 0;display: block;cursor: pointer" class="{{aClass}}" data-uId = "{{userId}}" data-cId = "{{classId}}" data-nId="{{notesId}}">
                                    <img height="50" width="50" src ="{{imgSrc}}" class="u-event">
                                    <span class="event-text">
                                        <span class="new-text">{{content}}</span>
                                    </span>
                                </span>
                            {{else}}
                            <span style="padding: 10px 0;display: block;cursor: pointer" class="{{aClass}}" data-status="{{status}}" data-rId="{{recordId}}" data-uId="{{userId}}" data-hpId="{{healthyPlanId}}"  data-userRId="{{userRecipeId}}">
                                <img height="50" width="50" src ={{imgSrc}} class="u-event">
                                <span class="event-text">{{content}}</span>
                            </span>
                            {{/if}}
                        </span>
                    </li>
			 	{{/if}}
			{{else}}
			    {{#if isReSend}}
			        <li class="not-parse">{{content}}<li>
			    {{else}}
                    <li style="text-align: left;margin-left: 52px;">{{nickName}}</li>
                    <li class="itm itm-left">
                        <span class="m-avatar"><i class="iconfont avatar icon-morentouxiang"></i></span>
                        <span class="chat-message">
                            {{#if isNew}}
                                <span class="title">{{title}}</span>
                                <span style="padding: 10px 0;display: block;cursor: pointer" class="{{aClass}}" data-uId = "{{userId}}" data-cId = "{{classId}}" data-nId="{{notesId}}">
                                    <img height="50" width="50" src ="{{imgSrc}}" class="u-event">
                                    <span class="event-text">
                                        <span class="new-text">{{content}}</span>
                                    </span>
                                </span>
                            {{else}}
                            <span style="padding: 10px 0;display: block;cursor: pointer" class="{{aClass}}" data-status="{{status}}" data-rId="{{recordId}}" data-uId="{{userId}}" data-hpId="{{healthyPlanId}}"  data-userRId="{{userRecipeId}}" >
                                <img height="50" width="50" src ={{imgSrc}} class="u-event">
                                <span class="event-text">{{content}}</span>
                            </span>
                            {{/if}}
                        </span>
                    </li>
			 	{{/if}}
			{{/if}}
		{{/if}}
		`;
    var msgItem =
        `<div class="msg-itm">
            <div class="user-info">
                <span class="nick-name">{{nickName}}</span>
                <span class="time">{{localTime}}</span>
            </div>
            <div class="u-content">
            {{#if canParse}}
                {{#if isImage}}
                    <img src="{{content}}" width="110" class="oImage" data-book-mark="{{bookMark}}" data-msg-id="{{msgId}}">
                {{else}}
                    <span class="chat-message">{{content}}
                    {{#if isReceipt}}
                        <span class="u-receipt">{{receipt}}</span>s
                     {{/if}}
                    </span>
                {{/if}}
            {{else}}
            {{#if isReSend}}
			        <span class="not-parse">{{content}}</span>
			    {{else}}
                    <span class="card-message">
                        {{#if isNew}}
                            <span class="title">{{title}}</span>
                            <span style="padding: 10px;display: block;cursor: pointer" class="{{aClass}}" data-uId = "{{userId}}" data-cId = "{{classId}}" data-nId="{{notesId}}">
                                <img height="50" width="50" src ={{imgSrc}} class="u-event">
                                <span class="event-text">
                                    <span class="new-text">{{content}}</span>
                                </span>
                            </span>
                        {{else}}
                        <span style="padding: 10px;display: block;cursor: pointer" class="{{aClass}}" data-status="{{status}}" data-rId="{{recordId}}" data-uId="{{userId}}" data-hpId="{{healthyPlanId}}"  data-userRId="{{userRecipeId}}" >
                            <img height="50" width="50" src ={{imgSrc}} class="u-event">
                            <span class="event-text">{{content}}</span>
                        </span>
                        {{/if}}
                    </span>
			 	{{/if}}
            {{/if}}
            </div>
        </div>`
    var textSource =
        `{{#if canParse}}
            {{#if isText}}
            <div class="msg-itm">
                <div class="user-info">
                    <span class="nick-name">{{nickName}}</span>
                    <span class="time">{{localTime}}</span>
                </div>
                <div class="u-content">
                    <span class="chat-message">{{content}}
                    </span>
                </div>
            </div>
            {{/if}}
            {{/if}}`
    var imgSource =
        `{{#if canParse}}
         {{#if isImage}}
         <div class="msg-itm">
                <div class="user-info">
                    <span class="nick-name">{{nickName}}</span>
                    <span class="time">{{localTime}}</span>
                </div>
                <div class="u-content">
                    <img src="{{content}}" width="110" class="oImage" data-book-mark="{{bookMark}}" data-msg-id="{{msgId}}" alt="文件已过期">
                </div>
        </div>
        {{/if}}
        {{/if}}`;
    var collectSource=
        `<div class="itm" data-msg-id="{{msgId}}">
            <div class="m-name">{{nickName}}</div>
            <span class="m-time">收藏于<span>{{createDate}}</span></span>
            <div class="m-content">
            {{#if isImage}}
                <div class="image-box">
                    <img class="oImage" src="{{content}}" alt="图片过期">
                </div>
                {{#if classify}}
                <span class="m-bookMark">{{bookMarkName}}</span>
                {{/if}}
            {{else}}
            {{content}}
            {{/if}}
            </div>
            <img src="./js/chatdemo/image/ic_delete.png" alt="删除" class="u-delete">
        </div>`;
    var teamMemberSource =
        `<li class="itm"><img src="{{avatarImg}}" class="avatar">
            <span class="nick-name">{{nickName}}</span>
        </li>`;
    var reviewSfSourse =
        `<table class="gridtable">
            <tr>
                <th colspan="4">{{= moudleInfo.surveyMoudleName}}</th>
            </tr>
            <tr>
                <th>问题</th>
                <th>选项</th>
                <th>回复</th>
            </tr>
            {{each(i,moudleGroup) moudleGroups}}
            {{each(j, surveyItem) surveyItems}}
            {{each(k, result) results}}
            <input type="hidden" name="sfResultId" value="{{= result.resultId}}"/>
            <tr>
                <td>{{= surveyItem.itemName}}</td>
                {{if surveyItem.surveyItemType == 3}}
                <td>{{= result.strValue}}</td>
                {{else surveyItem.surveyItemType == 4}}
                {{if result.strValue == 1}}
                <td>有</td>
                {{else}}
                <td>无</td>
                {{/if}}
                {{else surveyItem.surveyItemType == ''}}
                <td>{{= result.numValue}}{{= surveyItem.unit}}</td>
                {{else}}
                <td>{{= result.subItemTitle}}</td>
                {{/if}}
                <td><input type='text' name="sfDoc" style="width:200px;" value="{{= result.docFeedback}}" maxlength="100"></td>
            </tr>
            {{/each}}
            {{/each}}
            {{/each}}
        </table>
        {{each(i,data) evaluates}}
        结论：{{= data.evaluateRuleTitle}}
        {{/each}}
        <div class="btn-area">
            <div class="btn-wrap">
                {{if record.status!=3 && record.status!=4}}
                <span class="form-btn submit j-submit" style="width: 110px;cursor: pointer" onclick="submit()">提交</span>
                {{/if}}
                <span class="u-btn z-nocolor j-cancel" style="width: 110px;" onclick="cancel()">取消</span>
            </div>
        </div>`;
    var healthyPlanSource =
        `<div class="healthy-wrapper">
            <div class="healthy-header">
                <div class="m-avatar">
                    <div class="avatar-wrapper">
                        <img class="avatar" src="" alt="">
                    </div>
                    <span class="name"></span>
                </div>
                <div class="m-info">
                    <div>健康计划名称：{{= healthy_plan_name}}</div>
                    <div>方案执行时间：{{= plan_start_time}}-{{= plan_end_time}}</div>
                </div>
                <div class="m-chart">
                    <div class="small-wrapper left">
                        <div class="circleProgress leftcircle"></div>
                    </div>
                    <div class="small-wrapper right">
                        <div class="circleProgress rightcircle"></div>
                    </div>
                    <span style="font-size: 12px;" class="text">第</span>
                    <span style="font-size: 30px;" class="text">\${date = Math.floor((Date.parse((new Date()).toLocaleDateString()) - Date.parse(plan_start_time))/(24*3600*1000))+1}</span>
                    <span style="font-size: 12px;" class="text">天</span>
                </div>
            </div>
            {{each(i,_data) data}}
            <div class="plan-item">
                <div class="plan-title">{{= _data.title}}</div>
                <table style="width: 100%;">
                    <tbody>
                {{each(j,criteria) criterias}}
                <tr class="item-content">
                    {{if _data.code == 'test'}}
                    <td><div class="circle"></div><span class="list-name">{{= criteria.kpi_title}}</span></td>
                    <td><span class="list-name">目标：</span><span class="list-content">{{= criteria.targetValue}}</span></td>
                    <td><span class="list-name">测试频率：</span><span class="list-content">{{= criteria.period}}</span></td>
                    <td><span class="list-name">测试时间：</span><span class="list-content">{{= criteria.alert_times}}</span></td>
                    {{else _data.code == 'survey'}}
                    <td><div class="circle"></div><span class="list-name">{{= criteria.survey_moudle_name}}</span></td>
                    <td><span class="list-name">随访频率：</span><span class="list-content">{{= criteria.period}}</span></td>
                    {{else _data.code == 'nutrition'}}
                    <td><div class="circle"></div><span class="list-name">建议：</span><span class="list-content">{{= criteria.suggest}}</span></td>
                    {{else _data.code == 'sports'}}
                    <td><div class="circle"></div><span class="list-name">目标：</span><span class="list-content">{{= criteria.target}}</span></td>
                    <td><span class="list-name">强度：</span><span class="list-content">{{= criteria.suggest}}</span></td>
                    <td><span class="list-name">推荐运动：</span><span class="list-content">{{= criteria.sport_names}}</span></td>
                    {{else _data.code == 'mentality'}}
                    <td><div class="circle"></div><span class="list-name">目标：</span><span class="list-content">{{= criteria.target}}</span></td>
                    <td><span class="list-name">记录频率：</span><span class="list-content">{{= criteria.period}}</span></td>
                    {{else _data.code == 'live'}}
                    <td><div class="circle"></div><span class="list-name">目标：</span><span class="list-content">{{= criteria.target}}</span></td>
                    <td><span class="list-name">建议：</span><span class="list-content">{{= criteria.suggest}}</span></td>
                    {{else _data.code == 'assessment'}}
                    <td><div class="circle"></div><span class="list-name">{{= criteria.survey_moudle_name}}</span></td>
                    <td><span class="list-name">评估频率：</span><span class="list-content">{{= criteria.period}}</span></td>
                    {{else _data.code == 'wards'}}
                    <td><div class="circle"></div><span class="list-name">{{= criteria.survey_moudle_name}}</span></td>
                    <td><span class="list-name">查房频率：</span><span class="list-content">{{= criteria.period}}</span></td>
                    <td><span class="list-name">查房时间：</span><span class="list-content">{{= criteria.doTime}}</span></td>
                    <td><span class="list-name">填表人：</span><span class="list-content">{{= criteria.fillUserTypeName}}</span></td>
                    {{else _data.code == 'review'}}
                    <td><div class="circle"></div><span class="list-name">{{= criteria.indicesName}}</span></td>
                    <td>{{= criteria.period}}</td>
                    {{/if}}
                </tr>
                {{/each}}
                    </tbody>
                </table>
            </div>
            {{/each}}
        </div>`;
    var healthyClassSource =
        `<div class="healthy-box">
            <h2 class="title">{{= title}}</h2>
            <div class="m-source">来源：{{= classSrc}}</div>
            <div class="m-content">
                {{html classText }}
            </div>
            <div style="font-size: 14px;color: #999;">阅读：{{= readTotal}}</div>
        </div>`;
    var noticeSource =
        `<div class="healthy-box">
            <h2 class="title">{{= notesTitle}}</h2>
            <div class="m-source">{{= notesTypeName}}</div>
            <div class="m-content">
                {{html notesContent}}
            </div>
        </div>`;
    var assessSource =
        `<table class="gridtable">
            <tr>
                <th colspan="2">\${data= moudleInfo.opTime.split(' ')[0].split('-')[0]+'年'+moudleInfo.opTime.split(' ')[0].split('-')[1]+'月'+moudleInfo.opTime.split(' ')[0].split('-')[2]+'日'}{{= moudleInfo.surveyMoudleName}}</th>
            </tr>
            <tr><th colspan="2">{{= moudleGroups[0].surveyGroupName}}</th></tr>
            <tr>
                <th>问题</th>
                <th>选项</th>
            </tr>
            {{each(i,moudleGroup) moudleGroups}}
            {{each(j, surveyItem) surveyItems}}
            {{each(k, result) results}}
            <input type="hidden" name="sfResultId" value="{{= result.resultId}}"/>
            <tr>
                <td>{{= surveyItem.itemName}}</td>
                {{if surveyItem.surveyItemType == 3}}
                <td>{{= result.strValue}}</td>
                {{else surveyItem.surveyItemType == 4}}
                {{if result.strValue == 1}}
                <td>有</td>
                {{else}}
                <td>无</td>
                {{/if}}
                {{else surveyItem.surveyItemType == ''}}
                <td>{{= result.numValue}}{{= surveyItem.unit}}</td>
                {{else}}
                <td>{{= result.subItemTitle}}</td>
                {{/if}}
            </tr>
            {{/each}}
            {{/each}}
            {{/each}}
        </table>`
    var msgTemplate = Handlebars.compile(msgSource);
    var msgItemTemplate = Handlebars.compile(msgItem);
    var textTemplate = Handlebars.compile(textSource);
    var imgTemplate = Handlebars.compile(imgSource);
    var collectTemplate = Handlebars.compile(collectSource);
    var teamMemberTemplate = Handlebars.compile(teamMemberSource);
    var typeinLayerIndexSF = '';
    var rId = '';
    var uId = '';
    var hpId = '';
    var cId = '';
    var nId = '';
    var userRId = '';
    var itemIndex = '';
    var caseItemIndex = '';
    var msgId = '';
    var sessionNameA = '';
    var illnessCode = '';
    var dialogItemIndex = '0';
    var isText = true;
    var deleteIndex = '';
    var isPerson = false;
    var memberIndex = '';
    var navItemIndex = '';
    /**
     * 聊天窗口
     * @param {[Array]} emojiItems [必填参数]
     * @param {Object} container [可选参数]
     */
    function ChatWindow(opt) {
        util.extend(this, opt);
        this.container = this.container || document.body;
        this.emojiItems = this.emojiItems || [];
        this.msgItemContent = document.querySelector('.msgs-box');
        this.textsContent = document.querySelector('.text-box');
        this.imgContent = document.querySelector('.imgs-box');
        this.elm = this._layout.cloneNode(true);
        this.chatArea = this.elm.querySelector('.m-chat-area');
        this.msgContainer = this.chatArea.querySelector('.m-chat-messages');
        this.oImage = this.chatArea.querySelectorAll('.oImage');
        //窗口类型group or personal
        this.chatWindowType = 'group';

        //缓存值
        this.msgs = [];
        this.willSendImage = [];
        this.sessionName = '';
        this.nickName = '';
        this.endTimeStamp = -1;
        this.preEndStamp = -1;
        //当前chatArea的scrollHeight
        this.scrollHeight = 0;
        this.loadingMsgs = false;
        this.scrollOver = false;
        this.container.appendChild(this.elm);
        this.canChat = '';
        this.quill = new Quill('#editor', {
            modules: {
                toolbar: '#toolbar'
            }
        });

        this.toolbar = this.quill.getModule('toolbar');
        this.faceList = this.elm.querySelector('.face-list');
        this.editor = this.elm.querySelector('#editor');

        this.imagePicker = this.elm.querySelector('#pictruePicker');
        this.emojiPicker = this.elm.querySelector('.ql-emoji');
        this.sendBtn = this.elm.querySelector('.j-send-btn');

        this._initEvent();
        this._initDataUpdateEvent();
        this._initScrollOver();
        this._renderEmojiItems(this.emojiItems);
        this.sendBtn.addEventListener('click', this._sendHandler.bind(this));
        // this.editor.addEventListener('keyup', function(e){
        //     if(e.key === 'Enter'){
        //         this._sendHandler();
        //     }
        // }.bind(this));
        $('.m-chat-area , .msgs-box,.imgs-box,.collect-box').on('click','.oImage',function () {
            var getSrc = this.getAttribute('src');
            var imgObj = new Image();
            $('.img-wrapper').fadeIn(500);
            imgObj.onload=function () {
                $('.img-show').attr('src',getSrc);
            };
            imgObj.onerror=function () {
                $('.img-show').attr('src','./js/chatdemo/image/img_expired.png');
            };
            imgObj.src = getSrc;
        });
        $('.ql-editor').off('click').on('click','img',function () {
            var getSrc = this.getAttribute('src');
            $('.img-wrapper').fadeIn(500);
            $('.img-show').attr('src',getSrc);
        })
        $('.img-wrapper').click(function () {
            $(this).fadeOut(500);
        });
        $('.m-chat-area, .msgs-box').on('click', '.eventSF', function () {
            getEvent(this);
        });
        $('.m-chat-area, .msgs-box').on('click', '.eventWZ', function () {
            getEvent(this);
        });
        $('.m-chat-area, .msgs-box').on('click', '.eventJKJH', function () {
            getHealthPLan(this);
        });
        $('.m-chat-area, .msgs-box').on('click', '.news', function () {
            getNews(this)
        });
        $('.m-chat-area, .msgs-box').on('click', '.notice', function () {
            getNotice(this)
        });
        $('.m-chat-area, .msgs-box').on('click', '.eventSuggest', function () {
            userRId = this.getAttribute('data-userRId');
            var url = myConfig.H5Api+'/jy/jkda/showRecipe.htm?vType=YS&userRecipeId='+userRId
            typeinLayerIndexSF = layer.open({
                type: 1,
                title: '用药建议详情',
                skin: 'layui-layer-rim', //加上边框
                area: ['600px', '900px'], //宽高
                offset: '30px',
                scrollbar: false,
                content: '<iframe src=' + url + ' style="width:100%;height:100%" frameborder="0"></iframe>'
            })
        });
        $('.m-chat-area, .msgs-box').on('click', '.eventTest', function () {
            getEventTest(this);
        });
        // $(document).on('click','.j-cancel',function (e) {
        //     layer.close(typeinLayerIndexSF);
        //     e.stopPropagation();
        // });
        //
        // $(document).on('click','.j-submit',function (e) {
        //     returnSF();
        //     e.stopPropagation();
        // });
        /*收藏功能*/
        $('.m-chat-area').on('contextmenu','.oText',function (e) {
            var _this = this;
            isText = true
            e.preventDefault();
            msgId = this.getAttribute('data-msg-id');
            var menu=document.querySelector("#menu");
            if ($(this).attr('data-book-mark') == 1){
                $('#menu').text('已收藏')
            }else {
                $('#menu').text('收藏到')
                $('#menu').on('click',function () {
                    if (isText){
                        chat.collectPictures(msgId);
                        _this.setAttribute('data-book-mark','1');
                    }else {
                        $('.m-collection').show();
                        $('.black-bg').show();
                    }
                });
            }
            menu.style.left=e.clientX+'px';
            menu.style.top=e.clientY+'px';
            menu.style.display='block';


        });
        $('.m-chat-area').on('contextmenu','.oImage',function (e) {
            var _this = this;
            isText = false;
            e.preventDefault();
            var menu=document.querySelector("#menu");
            var imageUrl = this.getAttribute('src');
            if ($(this).attr('data-book-mark') == 1){
                $('#menu').text('已收藏')
            }else {
                $('#menu').text('收藏到');
                $('#menu').one('click',function () {
                    if (isText){
                        chat.collectPictures(msgId);
                        _this.setAttribute('data-book-mark','1');
                    }else {
                        $('.m-collection').show();
                        $('.black-bg').show();
                    }
                });
                $('.m-collection > .j-confirm').click(function () {
                    if(itemIndex == 0){
                        chat.collectPictures(msgId);
                        _this.setAttribute('data-book-mark','1');
                        $('.black-bg').hide();
                        $('.m-toast').text('已收藏图片！');
                        $('.m-toast').fadeIn(500);
                        setTimeout(function () {
                            $('.m-toast').fadeOut(500);
                        },1000)
                    }else if (itemIndex == 1){
                        var date = new Date();
                        var year = date.getFullYear();
                        var month = date.getMonth()+1;
                        var day = date.getDate();
                        var tody = year+'年'+p(month)+'月'+p(day)+'日';
                        $('.m-dietRecords').show();
                        laydate.render({
                            elem: '.select-time',
                            value: tody,
                            format: 'yyyy年MM月dd日',
                            max: tody
                        });
                        $('.m-dietRecords > .j-confirm').off('click').on('click',function () {
                            var date = $('.select-time').val();
                            var dateNew = date.replace(/(\d{4}).(\d{1,2}).(\d{1,2}).+/mg, '$1-$2-$3');
                            var dietType = $('.select-meals').val();
                            var dietDesc = $('.remark').val();
                            $.ajax({
                                url: myConfig.webIM+'/uniqueComservice2/base.do?do=httpInterface&module=commonHealthyPlanService&method=addUserDietRecord4IM&flag=2',
                                type: "post",
                                dataType:'json',
                                contentType:'application/json',
                                data:JSON.stringify({
                                    calltype:'17',
                                    userId: $('.j-user').attr('data-operator-id'),
                                    sessionName: sessionNameA,
                                    dietType: dietType,
                                    dietDesc: dietDesc,
                                    imageUrl: imageUrl,
                                    msgId: msgId,
                                    date: dateNew
                                }),
                                success:function (res) {
                                    if(res.return_msg.business_code == 'FAIL_MESSAGE'){
                                        $('.m-toast').text(res.return_msg.business_message);
                                    }else{
                                        _this.setAttribute('data-book-mark','1');
                                        $('.m-toast').text('已收藏到饮食！');
                                    }
                                    $('.m-toast').fadeIn(500);
                                    setTimeout(function () {
                                        $('.m-toast').fadeOut(500);
                                    },1000)
                                }
                            });
                            $(this).parents('.m-dietRecords').hide();
                            $('.black-bg').hide();
                            $('.remark').val('');
                        })
                    }else {
                        $('.m-case').show();
                        $('.m-case > .j-confirm').on('click',function () {
                            $.ajax({
                                url: myConfig.webIM+'/uniqueComservice2/base.do?do=httpInterface&module=userIllnessService&method=addUserIllness&flag=2',
                                type: "post",
                                dataType:'json',
                                contentType:'application/json',
                                data:JSON.stringify({
                                    calltype:'17',
                                    userId: $('.j-user').attr('data-operator-id'),
                                    sessionName: sessionNameA,
                                    imageUrl: imageUrl,
                                    msgId: msgId,
                                    illnessCode: illnessCode
                                }),
                                success:function (res) {
                                    _this.setAttribute('data-book-mark','1');
                                    $('.m-toast').text('已收藏到病例');
                                    $('.m-toast').fadeIn(500);
                                    setTimeout(function () {
                                        $('.m-toast').fadeOut(500);
                                    },1000)
                                }
                            })
                            $(this).parents('.m-case').hide();
                            $('.black-bg').hide();
                        })
                    }
                    $(this).parents('.m-collection').hide();
                    $('.item').removeClass('z-bg');
                    $('.item').find('.choose').hide();
                    $('.item').find('span').css('color','#333');
                })
            }
            var imgObj = new Image();
            imgObj.onload=function () {
                menu.style.left=e.clientX+'px';
                menu.style.top=e.clientY+'px';
                menu.style.display='block';

            };
            imgObj.src = imageUrl;
            msgId = this.getAttribute('data-msg-id');

        });
        // $('.m-chat-area').on('mouseover mouseout','.oImage',function (e) {
        //     var oCollect=document.querySelector(".m-collectstatus");
        //     if (e.type == 'mouseover'){
        //         if ($(this).attr('data-book-mark') == 1){
        //             $('.z-collect').attr('src','./js/chatdemo/image/ic_collected.png');
        //             $(".m-collectstatus>.title").text('已收藏');
        //         }else if($(this).attr('data-book-mark') == 0) {
        //             $('.z-collect').attr('src','./js/chatdemo/image/ic_collect.png');
        //             $(".m-collectstatus>.title").text('未收藏')
        //         }
        //         oCollect.style.left=e.clientX+'px';
        //         oCollect.style.top=e.clientY+'px';
        //         oCollect.style.display='block';
        //     }else if (e.type == 'mouseout'){
        //         oCollect.style.display='none';
        //         $('.remark').val('');
        //     }
        // });
        // $('.m-chat-area').on('mouseover mouseout','.oText',function (e) {
        //     var oCollect=document.querySelector(".m-collectstatus");
        //     if (e.type == 'mouseover'){
        //         if ($(this).attr('data-book-mark') == 1){
        //             $('.z-collect').attr('src','./js/chatdemo/image/ic_collected.png');
        //             $(".m-collectstatus>.title").text('已收藏');
        //         }else if($(this).attr('data-book-mark') == 0) {
        //             $('.z-collect').attr('src','./js/chatdemo/image/ic_collect.png');
        //             $(".m-collectstatus>.title").text('未收藏')
        //         }
        //         oCollect.style.left=e.clientX+'px';
        //         oCollect.style.top=e.clientY+'px';
        //         oCollect.style.display='block';
        //     }else if (e.type == 'mouseout'){
        //         oCollect.style.display='none';
        //         $('.remark').val('');
        //     }
        // });
        window.onclick=function(e){
            document.querySelector('#menu').style.display='none';
        }
        $('.m-collection').on('click','.quit',function () {
            $(this).parents('.m-collection').hide();
            $('.black-bg').hide();
            $('.item').removeClass('z-bg');
            $('.item').find('.choose').hide();
            $('.item').find('span').css('color','#333');
        });
        $('.m-dietRecords').on('click','.quit',function () {
            $(this).parents('.m-dietRecords').hide();
            $('.black-bg').hide();
        });
        $('.m-case').on('click','.quit',function () {
            $(this).parents('.m-case').hide();
            $('.black-bg').hide();
        });
        $('.m-collection').on('click','.item',function () {
            $(this).addClass('z-bg').siblings('.item').removeClass('z-bg');
            $(this).find('span').css('color','#fff');
            $(this).find('.choose').show();
            $(this).siblings('.item').find('.choose').hide();
            $(this).siblings('.item').find('span').css('color','#333');
            itemIndex = $(this).index();
        });
        $('.m-case').on('click','.item',function () {
            $(this).addClass('z-bg').siblings('.item').removeClass('z-bg');
            $(this).find('.choose').show();
            $(this).siblings('.item').find('.choose').hide();
            $(this).find('span').css('color','#fff');
            $(this).siblings('.item').find('span').css('color','#333');
            caseItemIndex = $(this).index();
            if (caseItemIndex == 0){
                illnessCode = 'outpatientClinic'
            }else if (caseItemIndex == 1){
                illnessCode = 'emergency'
            }else if (caseItemIndex == 2){
                illnessCode = 'inspection'
            }else if (caseItemIndex == 3){
                illnessCode = 'prescription'
            }
        });
        /*消息记录*/
        $('.u-record').click(function () {
            $('.m-dialog').show();
            $('.black-bg').show();
            var dateTime = '-1';
            chat.getHistoryMessageInfo(sessionNameA,'',dateTime,'');
            chat.getTeamMember();
            var oMsgs = document.querySelector('.msgs-box');
            var oText = document.querySelector('.text-box');
            var oImgs = document.querySelector('.imgs-box');
            var oCollect = document.querySelector('.collect-box');
            var oMember = document.querySelector('.team-members');
            oMsgs.innerHTML = '';
            oText.innerHTML = '';
            oImgs.innerHTML = '';
            oMember.innerHTML = '';
            util.emitter.on('memberUpdate',function (msgs) {
                var memberHTML = ''
                msgs.forEach(function (msg) {
                    memberHTML += teamMemberTemplate(msg);
                })
                oMember.innerHTML = memberHTML;
            });
            util.emitter.on('curSessionInfoUpdate', function (msgs) {
                var msgItemHTML = '',
                    textHTML = '',
                    imgHTML = '';
                msgs.forEach(function (msg) {
                    msgItemHTML += msgItemTemplate(msg);
                    textHTML += textTemplate(msg);
                    imgHTML += imgTemplate(msg);
                })
                oMsgs.innerHTML = msgItemHTML;
                oText.innerHTML = textHTML;
                oImgs.innerHTML = imgHTML;
                if ($('.info-wrapper').eq(dialogItemIndex).html()==''){
                    $('.noinfo-box').show()
                }else{
                    $('.noinfo-box').hide()
                }
            });
            util.emitter.on('collectInfoUpdate', function (msgs) {
                var collectHTML = '';
                msgs.forEach(function (msg) {
                    collectHTML += collectTemplate(msg);;
                })
                oCollect.innerHTML = collectHTML;
                if ($('.info-wrapper').eq(dialogItemIndex).html()==''){
                    $('.noinfo-box').show()
                }else{
                    $('.noinfo-box').hide()
                }
            });
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            var tody = year+'-'+p(month)+'-'+p(day);
            laydate.render({
                elem: '.el-input__inner',
                max: tody,
                done:function (date) {
                    var timestamp2 = Date.parse(new Date(date));
                    dateTime = timestamp2;
                    if (isPerson){
                        chat.getPersonHistoryMessageInfo(sessionNameA,chat.store.memberUserNa[memberIndex],dateTime,'');
                        if(dialogItemIndex == 0){
                            chat.getPersonHistoryMessageInfo(sessionNameA,chat.store.memberUserNa[memberIndex],dateTime,'','');
                        }else if (dialogItemIndex == 1){
                            chat.getPersonHistoryMessageInfo(sessionNameA,chat.store.memberUserNa[memberIndex],dateTime,'','Text');
                        }else if (dialogItemIndex == 2){
                            chat.getPersonHistoryMessageInfo(sessionNameA,chat.store.memberUserNa[memberIndex],dateTime,'','Image');
                        }
                    }else{
                        if(dialogItemIndex == 0){
                            chat.getHistoryMessageInfo(sessionNameA,dateTime,'','');
                        }else if (dialogItemIndex == 1){
                            chat.getHistoryMessageInfo(sessionNameA,dateTime,'','Text');
                        }else if (dialogItemIndex == 2){
                            chat.getHistoryMessageInfo(sessionNameA,dateTime,'','Image');
                        }
                    }
                }
            });
            $('.refresh').click(function () {
                dateTime = '-1';
                isPerson = false;
                chat.getHistoryMessageInfo(sessionNameA,'',dateTime);
                $('.el-input__inner').val('');
            });
        });
        $('.title-item').on('click','.close',function () {
            $('.m-dialog').hide();
            $('.black-bg').hide();
            $('.nav>.itm').eq(0).addClass('z-active').siblings('.itm').removeClass('z-active');
            $('.info-wrapper').eq(0).show().siblings('.info-wrapper').hide();
            $('.noinfo-box').hide();
            $('.el-input__inner').val('');
            $('.team-members').removeClass('slide-enter-active');
        });
        $('.nav>.itm').off('click').on('click',function () {
            $(this).addClass('z-active').siblings('.itm').removeClass('z-active');
            var index = $(this).index();
            dialogItemIndex = index;
            $('.info-wrapper').eq(index).show().siblings('.info-wrapper').hide();
            if ($('.info-wrapper').eq(index).html()==''){
                $('.noinfo-box').show()
            }else{
                $('.noinfo-box').hide()
            }
            if(index == 3){
                $('.collect-box').html('');
                chat.getCollectInfo();
            }else if(index == 0){
                chat.getHistoryMessageInfo(sessionNameA,'',-1,'');
            }else if (index == 1){
                chat.getHistoryMessageInfo(sessionNameA,'',-1,'Text');
            }else if (index == 2){
                chat.getHistoryMessageInfo(sessionNameA,'',-1,'Image');
            }
        });
        $('.collect-box').off('mouseenter mouseleave').on('mouseenter mouseleave','.itm',function (event) {
            var _this = this;
            deleteIndex = $(this).attr('data-msg-id');
            if(event.type == "mouseenter"){
                $(this).find('.u-delete').fadeIn(500);
            }else if(event.type == "mouseleave"){
                $(this).find('.u-delete').fadeOut(500);
            }
        });
        $('.collect-box').on('click','.u-delete',function (event) {
            var result = confirm('是否删除');
            if (result){
                $(this).parents('.itm').remove();
                chat.deleteCollect(deleteIndex);
            }
            event.stopPropagation();
        });
        $('.m-dialog .footer .page-btn').off('click').click(function () {
            var index = $(this).index();

            if(index == 0){
                chat.store.oTimeBtn = '0';
                if(dialogItemIndex == 0){
                    chat.getHistoryMessageInfo(sessionNameA,0,'','');
                }else if (dialogItemIndex == 1){
                    chat.getHistoryMessageInfo(sessionNameA,0,'','Text');
                }else if (dialogItemIndex == 2){
                    chat.getHistoryMessageInfo(sessionNameA,0,'','Image');
                }
            }else if(index == 1){
                chat.store.oTimeBtn = '1';
                if(dialogItemIndex == 0){
                    chat.getHistoryMessageInfo(sessionNameA,'',chat.store.firstTime,'');
                }else if (dialogItemIndex == 1){
                    chat.getHistoryMessageInfo(sessionNameA,'',chat.store.firstTime,'Text');
                }else if (dialogItemIndex == 2){
                    chat.getHistoryMessageInfo(sessionNameA,'',chat.store.firstTime,'Image');
                }
            }else if (index == 2){
                chat.store.oTimeBtn = '2';
                if(dialogItemIndex == 0){
                    chat.getHistoryMessageInfo(sessionNameA,chat.store.lastTime+1000,'','');
                }else if (dialogItemIndex == 1){
                    chat.getHistoryMessageInfo(sessionNameA,chat.store.lastTime+1000,'','Text');
                }else if (dialogItemIndex == 2){
                    chat.getHistoryMessageInfo(sessionNameA,chat.store.lastTime+1000,'','Image');
                }
            }else if (index == 3){
                chat.store.oTimeBtn = '3';
                if(dialogItemIndex == 0){
                    chat.getHistoryMessageInfo(sessionNameA,'',-1,'');
                }else if (dialogItemIndex == 1){
                    chat.getHistoryMessageInfo(sessionNameA,'',-1,'Text');
                }else if (dialogItemIndex == 2){
                    chat.getHistoryMessageInfo(sessionNameA,'',-1,'Image');
                }
            };
        });
        /*查看群成员*/
        document.querySelector('.members').onclick = function () {
            $('.team-members').toggleClass('slide-enter-active');
        }
        $('.team-members').off('click').on('click','.itm',function () {
            memberIndex = $(this).index();
            isPerson = true;
            chat.getPersonHistoryMessageInfo(sessionNameA,chat.store.memberUserNa[memberIndex],'',-1,'');
            $('.team-members').removeClass('slide-enter-active');
        })
        /*播放语音*/
        $('.m-chat-area').on('click','.audio-message',function () {
            if($(this).children('img').attr('src') == './js/chatdemo/image/play.gif'){
                $(this).children('img').attr('src','./js/chatdemo/image/noPlay.png');
                $(this).next('audio')[0].pause();
            }else{
                for(var i=0;i<$('audio').length;i++){
                    $('audio')[i].pause();
                    $('.audio-message > img').attr('src','./js/chatdemo/image/noPlay.png');
                }
                $(this).children('img').attr('src','./js/chatdemo/image/play.gif');
                $(this).next('audio')[0].currentTime = 0;
                $(this).next('audio')[0].play();
                $(this).next('audio').on('ended',function () {
                    $(this).siblings().children('img').attr('src','./js/chatdemo/image/noPlay.png');
                })
            }
        })
    }
    function cancel() {
        layer.close(typeinLayerIndexSF);
    }
    function submit() {
        returnSF();
    }
    /*补零*/
    function p(s) {
        return s < 10 ? '0' + s: s;
    }
    function getEvent(_this) {
        rId= _this.getAttribute('data-rId');
        uId = _this.getAttribute('data-uId');
        $.ajax({
            url:'/ts/workStation.do?method=getSurveyRecordInfo',
            type: "get",
            dataType:'json',
            contentType:'application/json',
            data:{
                recordId: rId,
                type: 'YS'
            },
            success:function (res) {
                var status = res.result.record.status;
                if (status == 0) {
                    if ($('.m-editor').css('display')=='block'){
                        $('.status-hint').css('bottom','227px')
                    }
                    $('.status-hint').fadeIn();
                    setTimeout(function () {
                        $('.status-hint').fadeOut();
                    },1000)
                }else if(status == 1 || status == 2 || status == 3) {
                    $.template('template',reviewSfSourse);
                    $('#eventForm').html($.tmpl('template',res.result));
                    typeinLayerIndexSF = layer.open({
                        type: 1,
                        title: '详情',
                        skin: 'layui-layer-rim', //加上边框
                        area: ['900px', '600px'], //宽高
                        offset: '30px',
                        scrollbar: false,
                        content: $('#eventForm')
                    });
                }
            }
        })
    }
    function getEventTest(_this) {
        rId= _this.getAttribute('data-rId');
        uId = _this.getAttribute('data-uId');
        $.ajax({
            url:'/ts/workStation.do?method=getSurveyRecordInfo',
            type: "get",
            dataType:'json',
            contentType:'application/json',
            data:{
                recordId: rId,
                type: 'YS'
            },
            success:function (res) {
                var status = res.result.record.status;
                if (status == 0) {
                    if ($('.m-editor').css('display')=='block'){
                        $('.status-hint').css('bottom','227px')
                    }
                    $('.status-hint').fadeIn();
                    setTimeout(function () {
                        $('.status-hint').fadeOut();
                    },1000)
                }else if(status == 1 || status == 2 || status == 3) {
                // $('#eventForm').html($('#assess').tmpl(res.result));
                $.template('template',assessSourse);
                $('#eventForm').html($.tmpl('template',res.result));
                typeinLayerIndexSF = layer.open({
                    type: 1,
                    title: '详情',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['900px', '600px'], //宽高
                    offset: '30px',
                    scrollbar: false,
                    content: $('#eventForm')
                });
                }
            }
        })
    }
    function returnSF(){
        var userId = uId;
        var idArray = $('input[name="sfResultId"]');
        var docArray = $('input[name="sfDoc"]');
        var recordId = rId;

        var ids = "";
        $.each(idArray, function(i, n){
            ids += $(n).val()+",";
        });

        var docs = "";
        $.each(docArray, function(i, n){
            if($(n).val()==null || $(n).val()==''){
                docs += "-1"+",";
            }else{
                docs += $(n).val()+",";
            }
        });

        $.ajax({
            url:'/ts/executePlan.do?method=replySurvey',
            type:'get',
            dataType:'json',
            data:{
                userId:userId,
                ids:ids,
                docs:docs,
                recordId:recordId
            }
        }).success(function (res) {
            if(res.business_code === 'SUCCESS'){
                $('.m-toast').text("提交成功！");
                $('.m-toast').fadeIn(500);
                setTimeout(function () {
                    $('.m-toast').fadeOut(500);
                },1000)
                layer.close(typeinLayerIndexSF);
            }else{
                $('.m-toast').text(res.business_message);
                $('.m-toast').fadeIn(500);
                setTimeout(function () {
                    $('.m-toast').fadeOut(500);
                },1000)
            }
        })
    }
    function getHealthPLan(_this) {
        uId = _this.getAttribute('data-uId');
        hpId = _this.getAttribute('data-hpId');

        $.ajax({
            url: myConfig.webIM + '/uniqueComservice2/base.do?do=httpInterface&module=healthPlan2Service&method=getUserHealthyPlanDets&flag=2',
            type: "post",
            dataType:'json',
            contentType:'application/json',
            data:JSON.stringify({
                calltype:'17',
                userId: uId,
                healthyPlanId: hpId
            }),
            success:function (res) {
                // $('#eventForm').html($('#healthyPlan').tmpl(res.return_msg.result));
                $.template('template',healthyPlanSource);
                $('#eventForm').html($.tmpl('template',res.return_msg.result));
                typeinLayerIndexSF = layer.open({
                    type: 1,
                    title: '健康计划',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['800px', '600px'], //宽高
                    offset: '30px',
                    scrollbar: false,
                    content: $('#eventForm'),
                    success:function () {
                        $.ajax({
                            url: myConfig.webIM + '/uniqueComservice2/base.do?do=httpInterface&module=userService&method=getUserById&flag=2',
                            type: "post",
                            dataType:'json',
                            contentType:'application/json',
                            data:JSON.stringify({
                                calltype:'17',
                                userId: uId,
                                orgGroupCode: 'ALL'
                            }),
                            success:function (res) {
                                var imgurl = myConfig.webIM + '/uniqueComservice2/base.do?method=getUserImageDesc&userId='+uId;
                                var imgObj = new Image();
                                $('.m-avatar .name').html(res.return_msg.result.userName);
                                imgObj.onload=function () {
                                    $('.avatar').attr('src',imgurl);
                                };
                                imgObj.onerror=function () {
                                    $('.avatar').attr('src','./images/avatar.png');
                                };
                                imgObj.src = imgurl;
                            }
                        });
                        var day = Math.floor((Date.parse((new Date()).toLocaleDateString()) - Date.parse(res.return_msg.result.plan_start_time))/(24*3600*1000))+1;
                        var dayTotal = Math.floor((Date.parse(res.return_msg.result.plan_end_time) - Date.parse(res.return_msg.result.plan_start_time))/(24*3600*1000))+1;
                        if (day > dayTotal/2){
                            $('.rightcircle').css('transform','rotate(225deg)');
                            var change = (day-(dayTotal/2))/(dayTotal/2)*180+45;
                            $('.leftcircle').css('transform','rotate('+change+'deg)')
                        }else{
                            var change = (day/(dayTotal/2))*180+45;
                            $('.rightcircle').css('transform','rotate('+change+'deg)');
                            $('.leftcircle').css('transform','rotate(45deg)')
                        }
                    }
                });
            }
        })
    }
    function getNews(_this) {
        uId = _this.getAttribute('data-uId');
        cId = _this.getAttribute('data-cId');
        $.ajax({
            url: myConfig.webIM + '/uniqueComservice2/base.do?do=httpInterface&module=mcClassService&method=getMcClassDetail&flag=2',
            type: "post",
            dataType:'json',
            contentType:'application/json',
            data:JSON.stringify({
                calltype:'17',
                userId: uId,
                classId: cId
            }),
            success:function (res) {
                // $('#eventForm').html($('#healthyClass').tmpl(res.return_msg.result));
                $.template('template',healthyClassSource);
                $('#eventForm').html($.tmpl('template',res.return_msg.result));
                typeinLayerIndexSF = layer.open({
                    type: 1,
                    title: '健康课堂-详情',
                    skin: 'layui-layer-rim', //加上边框
                    area: ['600px', '900px'], //宽高
                    offset: '30px',
                    scrollbar: false,
                    content: $('#eventForm')
                });
            }
        })
    }
    function getNotice(_this) {
        nId = _this.getAttribute('data-nId');
        $.ajax({
            url: myConfig.webIM + '/uniqueComservice2/base.do?do=httpInterface&module=notesService&method=getMcNotes&flag=2',
            type: "post",
            dataType:'json',
            contentType:'application/json',
            data:JSON.stringify({
                notesId: nId,
            }),
            success:function (res) {
                if (res.return_msg){
                    // $('#eventForm').html($('#notice').tmpl(res.return_msg.result));
                    $.template('template',noticeSource);
                    $('#eventForm').html($.tmpl('template',res.return_msg.result));
                    typeinLayerIndexSF = layer.open({
                        type: 1,
                        title: '公告窗-详情',
                        skin: 'layui-layer-rim', //加上边框
                        area: ['600px', '900px'], //宽高
                        offset: '30px',
                        scrollbar: false,
                        content: $('#eventForm')
                    });
                }else{
                    $('.m-toast').text('内容已被发布者删除！');
                    $('.m-toast').fadeIn(500);
                    setTimeout(function () {
                        $('.m-toast').fadeOut(500);
                    },1000)
                }
            }
        })
    }
    util.extend(ChatWindow.prototype, {
        _layout: util.html2Node(template),

        _renderWindow: function (msgs) {
            var msgsHTML = '',
                endTimestamp = -1,
                _this = this;
            msgs.forEach(function (msg) {
                msgsHTML += msgTemplate(msg);
            })
            if (msgs.length > 0) {
                endTimestamp = msgs[0].createDate;
            }
            // if(_this.endTimeStamp !== endTimestamp){
            _this.endTimeStamp = endTimestamp;
            _this.msgContainer.innerHTML = msgsHTML;
            // }
        },

        show: function (sessionName, nickName, unReadCount, canChat) {
            var elm = this.elm,
                _this = this;
            _this.unReadCount = unReadCount;

            elm.classList.remove('z-hid');

            _this.animation && _this.animation.enter && util.animateClass(elm, _this.animation.enter);
            _this.canChat = canChat;
            _this.sessionName = sessionName;
            sessionNameA = sessionName;
            _this.nickName = nickName;
            elm.querySelector('.j-nickname').textContent = nickName;
            document.querySelector('.m-input-cotain').textContent = nickName;
            if (canChat == '1' || canChat == '') {
                elm.querySelector('.j-send-btn').textContent = '发送';
                elm.querySelector('.j-send-btn').style.color = '#fff';
                elm.querySelector('.expire').style.display = 'none';
            } else {
                elm.querySelector('.m-chat-area').style.height = "88%";
                elm.querySelector('.m-editor').style.display = 'none';
            }
            if (!_this.loadingMsgs) {
                _this.loadingMsgs = true;
                chat.getHistoryMessage(_this.sessionName, _this.endTimeStamp)
                    .then(_this._updateScrollPos.bind(_this))
                    .then(function () {
                        _this.loadingMsgs = false;
                    })
                    .then(function () {
                        var unReadMsgs = [];
                        var msgs = _this.msgs;
                        for (var i = 0; i < unReadCount; i++) {
                            var msgIndex = msgs.length - 1 - i;
                            if (msgIndex < 0) break;
                            unReadMsgs.push({
                                'msgId': msgs[msgIndex].msgId,
                                'from': msgs[msgIndex].from
                            });
                        }
                        chat.markRead(sessionName, unReadMsgs);
                    });
            }

            this.uploader = WebUploader.create({
                server: myConfig.imApiRoot + '/launchr/chat/upload',
                auto: true,
                pick: {
                    id: '#pictruePicker'
                },
                thumb:{
                    allowMagnify:false
                },
                formData: {
                    'appName': myConfig.imAppName,
                    'appToken': 'verify-code',
                    'userName': 10301,
                    'to': this.sessionName,
                    'type': 'Image',
                    'info': JSON.stringify({'nickName': this.nickName}),
                    'clientMsgId': Date.now()
                },
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/jpg,image/jpeg,image/png'
                }
            })
                .on('uploadSuccess', function (file, res) {
                    var newFile = {};
                    if (res.message === 'Success') {
                        newFile = {
                            fileName: file.name,
                            fileSize: res.fileSize,
                            fileUrl: res.fileUrl,
                            thumbnail: res.thumbnail,
                            thumbnailHeight: res.thumbnailHeight,
                            thumbnailWidth: res.thumbnailWidth
                        };
                        _this.willSendImage.push(newFile);
                    }
                })
                .on('fileQueued', function (file) {
                    _this.uploader.makeThumb(file, function (error, src) {
                        _this.insertImage(src);
                        file.type = 'Image';
                    });
                })

        },

        close: function (callback) {
            var elm = this.elm,
                container = this.container;
            if (this.animation && this.animation.leave) {
                util.animateClass(elm, this.animation.leave, function (e) {
                    container.removeChild(elm);
                    callback && callback();
                })
            } else {
                container.removeChild(elm);
                callback && callback();
            }
            util.emitter.emit('closeWindow');

        },

        _initEvent: function () {
            var imagePicker = this.imagePicker,
                emojiPicker = this.emojiPicker,
                faceList = this.faceList,
                uploader = this.uploader,
                _this = this,
                closeChatWindowList = this.elm.querySelectorAll('.closeChatWindow');

            imagePicker.addEventListener('change', function (e) {
                var imgSrc = this.value;
                _this.insertImage(imgSrc);
            })

            emojiPicker.addEventListener('click', function(e){
                faceList.classList.toggle('z-hid');
            })

            // uploader.on('fileQueued', function(file){
            // debugger;
            // var f = {
            // 	fileName: file.name,
            // 	fileSize: file.size,
            // 	fileUrl:'',
            // 	thumbnail:,
            // 	thumbnailHeight:,
            // 	thumbnailWidth:,
            // };

            // 	uploader.makeThumb(file, function( error, src){
            // 		_this.insertImage(src);
            // 	});
            // })

            closeChatWindowList.forEach(function (item) {
                item.addEventListener('click', function () {
                    _this.close();
                })
            })

            _this.chatArea.addEventListener('scroll', function () {
                util.throttle(function () {
                    if (this._isScrollToTop() && !this.loadingMsgs && !this.scrollOver) {
                        _this.loadingMsgs = true;
                        chat.getHistoryMessage(this.sessionName, this.endTimeStamp)
                            .then(this._updateScrollPos.bind(this))
                            .then(function () {
                                _this.loadingMsgs = false;
                            });
                    }
                }, 500, _this);
            })
        },

        _updateScrollPos: function () {
            var _this = this;
            _this.chatArea.scrollTop = _this.chatArea.scrollHeight - _this.scrollHeight;
            _this.scrollHeight = _this.chatArea.scrollHeight;
        },

        _scrollToBottom: function () {
            this.chatArea.scrollTop = this.chatArea.scrollHeight - this.chatArea.offsetHeight;
        },

        _initDataUpdateEvent: function () {
            var _this = this;
            util.emitter.on('curSessionUpdate', function (msgs) {
                _this.msgs = msgs;
                _this._renderWindow(msgs);
                _this._scrollToBottom();
                // _this.quill.focus();
                // setTimeout(function(){
                //     _this.quill.focus();
                // }, 500);
            });
        },

        _initScrollOver: function () {
            var _this = this;
            util.emitter.on('scrollOver', function () {
                _this.scrollOver = true;
            })
        },

        _isScrollToTop: function () {
            var _this = this;
            if (_this.chatArea.scrollTop <= 10) {
                return true;
            }
            return false;
        },

        _renderEmojiItems: function (emojiItems) {
            if (emojiItems.length < 1) return this;

            var fragment = document.createDocumentFragment();

            emojiItems.forEach(function (item, index) {
                var emojiItemPath = code2EmojiPath(item.unicode);
                var emojiItemTemplate = '<button class="face-itm"><img data-code="' +
                    item.code + '" src="' + emojiItemPath + '" width="20" height="20"></button>';
                fragment.appendChild(util.html2Node(emojiItemTemplate));
            });

            this.faceList.appendChild(fragment);
            this.faceList.addEventListener('click', this._chooseEmojiHandler.bind(this));
        },

        _chooseEmojiHandler: function (e) {
            var quill = this.quill;
            // quill.focus();
            var elm = e.target,
                imgSrc = elm.src,
                range = quill.getSelection(),
                index = range ? range.index+1 : 0,
                code = elm.getAttribute("data-code");

            if (index) {
                quill.updateContents([{retain: index}, {
                    // insert: {image: imgSrc},
                    insert: {text: code},
                    attributes: {width: '20px', height: '20px'}
                }])
            } else {
                quill.updateContents([{insert: {text: code}, attributes: {width: '20px', height: '20px'}}]);
            }

            quill.setSelection(index + 1, 0);
            this._hidFaceList();
        },

        _hidFaceList: function () {
            this.faceList.classList.toggle('z-hid');
        },

        insertImage: function (imgSrc) {
            var quill = this.quill;
            // quill.focus();

            var range = quill.getSelection(),
                index = range ? range.index : 0;

            if (index) {
                _.defer(function () {
                    quill.updateContents([{retain: index}, {insert: {image: imgSrc}}]);
                })

            } else {
                _.defer(function () {
                    quill.updateContents([{insert: {image: imgSrc}}]);
                })
            }

            quill.setSelection(index + 1, 0);
            chat.store.curSessionMsgs.push();
        },

        _sendGoupMsgHandler: function () {
            var _this = this,
                imgIndex = 0,
                content = _this.editor.textContent,
                delta = _this.quill.getContents();
            if (content == "" && delta.ops.length == 1) {
                return
            }
            delta.ops.forEach(function (op) {
                var insert = op.insert;
                if (insert.image) {
                    chat.sendGroupMsg([_this.sessionName], JSON.stringify(_this.willSendImage[imgIndex++]), 'Image');
                } else {
                    if (insert !== '\n') {
                        chat.sendGroupMsg([_this.sessionName], insert, 'Text');
                    }
                }
            })

            _this._clearEditor();
        },

        _sendHandler: function (e) {
            if (this.canChat == '1' || this.canChat == '') {
                var _this = this,
                    chatType = _this.chatWindowType;
                switch (chatType) {
                    case 'group':
                        _this._sendGoupMsgHandler();
                        break;
                }
            }
        },

        _clearEditor: function () {
            this.quill.setContents();
            this.willSendImage = [];
        }

    })

    window.ChatWindow = ChatWindow;
    window.cancel = cancel;
    window.submit = submit;

})(util);