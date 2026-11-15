(function(){
var $=function(s){return document.querySelector(s)};
var DEBUG=/[?&]debug/.test(location.search), SKIP=/[?&]skip/.test(location.search);
var KEY='tsr_stamps_v1';
if(/[?&]reset/.test(location.search)){try{localStorage.removeItem(KEY)}catch(e){}try{history.replaceState(null,'',location.pathname)}catch(e){}}
var AFRAME_URL='https://cdnjs.cloudflare.com/ajax/libs/aframe/1.4.2/aframe.min.js';
var MIND_URL='https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js';
var st=(function(){try{var v=JSON.parse(localStorage.getItem(KEY));if(v&&v.s&&v.s.length===9)return v}catch(e){}return{s:[0,0,0,0,0,0,0,0,0],f:0}})();
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
function count(){return st.s.filter(Boolean).length}
function show(id){document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('on')});if(id)$('#'+id).classList.add('on')}
$('#rotTxt').textContent=TXT.rot;$('#btnBook').textContent=TXT.book;$('#btnClose').textContent=TXT.close;$('#btnGo').textContent=TXT.start;$('#look').textContent=TXT.looking;

/* ---------- オープニング ---------- */
function playOpening(){show('op');Story.start('op','op',{done:function(){var op=$('#op');op.classList.add('out');setTimeout(function(){show('');op.classList.remove('out');showHowto()},600)}})}


/* ---------- あそびかた ---------- */
function showHowto(){
 var ic=['🔍','📷','✨','⭐'],h='';
 HOWTO.forEach(function(s,i){h+='<div class="hw" style="--d:'+(0.3+i*0.9).toFixed(1)+'s"><div class="no">'+(i+1)+'</div><div class="ic">'+ic[i]+'</div><div class="t">'+s.t+'</div><div class="d">'+s.d+'</div></div>'});
 $('#hwCards').innerHTML=h;show('howto');var e=$('#howto');e.classList.remove('go');void e.offsetWidth;e.classList.add('go')}
$('#btnGo').addEventListener('click',startCamera);

/* ---------- カメラ(AR) ---------- */
var arStarted=false,gameOpen=false,blockUntil=0;
function updateCam(){
 $('#cnt').textContent='スタンプ '+count()+' / 9'+(st.f?' ★':'');
 var w=$('#finBtnWrap');w.innerHTML='';
 if(count()===9&&!st.f){var b=document.createElement('button');b.className='btn big';b.textContent='ぶたいへ行こう!';b.onclick=function(){openGame(9)};w.appendChild(b)}}
function startCamera(){
 show('cam');updateCam();
 if(DEBUG){$('#look').style.display='none';var d=$('#dbg');d.innerHTML='';
  for(var i=0;i<10;i++){(function(i){var b=document.createElement('button');b.className='btn small';b.textContent=i<9?String(i+1):'さいご';b.onclick=function(){openGame(i)};d.appendChild(b)})(i)}
  var eb=document.createElement('button');eb.className='btn small';eb.textContent='エンディング';eb.onclick=playEnding;d.appendChild(eb);
  if(/[?&]end/.test(location.search)){playEnding();return}
  var m=location.search.match(/spot=(\d+)/);if(m)openGame(parseInt(m[1],10)-1);return}
 if(arStarted)return;arStarted=true;loadAR()}
function loadScript(src){return new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
function loadAR(){
 loadScript(AFRAME_URL).then(function(){return loadScript(MIND_URL)}).then(function(){
  var sc=document.createElement('a-scene');
  sc.setAttribute('mindar-image','imageTargetSrc: ./ar/all.mind; autoStart: true; uiScanning: no; uiLoading: no; filterMinCF: 0.0001; filterBeta: 0.001; missTolerance: 5; warmupTolerance: 3');
  sc.setAttribute('color-space','sRGB');sc.setAttribute('renderer','colorManagement: true, physicallyCorrectLights, alpha: true');
  sc.setAttribute('vr-mode-ui','enabled: false');sc.setAttribute('device-orientation-permission-ui','enabled: false');
  var cam=document.createElement('a-camera');cam.setAttribute('position','0 0 0');cam.setAttribute('look-controls','enabled: false');sc.appendChild(cam);
  for(var i=0;i<9;i++){(function(i){var t=document.createElement('a-entity');t.setAttribute('mindar-image-target','targetIndex: '+i);
   var hold=null;
   t.addEventListener('targetFound',function(){clearTimeout(hold);hold=setTimeout(function(){if(!gameOpen&&Date.now()>blockUntil)openGame(i)},500)});
   t.addEventListener('targetLost',function(){clearTimeout(hold)});
   sc.appendChild(t)})(i)}
  $('#arlayer').appendChild(sc);
 }).catch(function(){$('#look').textContent='カメラのじゅんびができなかったよ。ページを開きなおしてね。'})}

/* ---------- ゲーム ---------- */
var cx=null;
function openGame(i){
 if(gameOpen)return;gameOpen=true;show('game');
 var sp=(i<9)?SPOTS[i]:FINALE;
 var img=(i<9)?sp.img:'img/char_mikoto.svg';
 $('#gtitle').innerHTML='<img src="'+img+'" alt=""><span class="no">'+(i<9?'スポット '+(i+1):'ラスト')+'</span>'+sp.name;
 var stage=$('#stage');stage.innerHTML='';stage.style.setProperty('--bg',(i<9)?sp.color:'#EAF0FF');
 $('#quizbox').className='';$('#quizbox').innerHTML='';
 cx={stage:stage,idx:i,spot:sp,cleanups:[],
  hint:function(t){$('#ghint').textContent=t},
  quiz:function(onOk){showQuiz(sp,onOk||cx.done)},
  done:function(){finishGame(i)}};
 cx.hint(sp.hint);
 setTimeout(function(){(i<9?GAMES[i]:FINALE_GAME)(cx)},30)}
function showQuiz(sp,onOk){
 var qb=$('#quizbox'),h='<div class="qcard"><div class="q"></div><div class="opts"></div><div class="msg"></div></div>';
 qb.innerHTML=h;qb.className='on';qb.querySelector('.q').textContent=sp.q;
 var box=qb.querySelector('.opts'),msg=qb.querySelector('.msg'),lock=false;
 sp.opts.forEach(function(o,k){var b=document.createElement('button');b.className='opt';b.textContent=o;
  b.onclick=function(){if(lock)return;
   if(k===sp.ans){lock=true;b.classList.add('ok');msg.style.color='#2B9A5F';msg.textContent=TXT.right;setTimeout(function(){qb.className='';onOk()},900)}
   else{b.classList.add('ng');msg.style.color='#D2547A';msg.textContent=TXT.wrong;setTimeout(function(){b.classList.remove('ng')},400)}};
  box.appendChild(b)})}
function teardown(){if(cx){cx.cleanups.forEach(function(f){try{f()}catch(e){}});cx=null}$('#stage').innerHTML='';$('#quizbox').className='';gameOpen=false;blockUntil=Date.now()+2500}
function closeGame(){teardown();show('cam');updateCam()}
$('#btnClose').addEventListener('click',closeGame);
function finishGame(i){
 teardown();
 var first,html;
 if(i<9){first=!st.s[i];st.s[i]=1}else{first=!st.f;st.f=1}save();
 if(i===9){playEnding();return}
 var sp=(i<9)?SPOTS[i]:FINALE,all=count()===9;
 var seal=(i<9)?'<img src="'+sp.img+'" alt="">':'<img src="img/char_mikoto.svg" alt="">';
 var title=(i<9)?sp.name:'神楽のぶたいが完成!';
 var extra=(i<9&&all&&!st.f)?'<p style="color:#D2547A">9か所を回ったよ!いよいよ、神楽のぶたいのじゅんびだよ。</p>':(i<9&&!all?'<p style="color:#D2547A">お祭りまで、あと'+(9-count())+'か所!</p>':'');
 var btns='<button class="btn big" id="cNext">'+TXT.next+'</button><button class="btn" id="cBook">'+TXT.toBook+'</button>';
 if(i<9&&all&&!st.f)btns='<button class="btn big" id="cFin">ぶたいへ行こう!</button><button class="btn" id="cNext">'+TXT.next+'</button>';
 html='<div class="in"><div class="seal">'+seal+'<div class="st">'+(i<9?TXT.stampGot:'コンプリート!')+'</div></div><div class="tx"><h2>'+title+'</h2><p>'+sp.clear+'</p>'+extra+'<div class="row">'+btns+'</div></div></div>';
 $('#clear').innerHTML=html;show('clear');
 var n=$('#cNext');if(n)n.onclick=function(){show('cam');updateCam()};
 var b=$('#cBook');if(b)b.onclick=openBook;
 var f=$('#cFin');if(f)f.onclick=function(){show('cam');openGame(9)}}

/* ---------- エンディング ---------- */
function playEnding(){show('end');Story.start('end','end',{bookText:TXT.book,book:openBook,again:playEnding})}

/* ---------- スタンプ帳 ---------- */
function openBook(){
 var h='<h2><span id="bTitle">スタンプ帳 '+count()+' / 9</span><button class="btn small" id="bClose">'+TXT.close+'</button></h2><div class="bgrid">';
 SPOTS.forEach(function(s,i){var on=st.s[i];h+='<div class="bc '+(on?'on':'off')+'"><span class="no">'+(i+1)+'</span><img src="'+s.img+'" alt=""><span>'+(on?s.name:'?')+'</span></div>'});
 h+='<div class="bc '+(st.f?'on':'off')+'"><span class="no">★</span><img src="img/char_hime.svg" alt=""><span>'+(st.f?'神楽':'?')+'</span></div></div>';
 $('#book').innerHTML=h;show('book');
 $('#bClose').onclick=function(){show('cam');updateCam()};
 if(st.f){var eb2=document.createElement('button');eb2.className='btn small';eb2.textContent='エンディングを見る';eb2.style.marginLeft='1vh';$('#bClose').parentNode.appendChild(eb2);eb2.onclick=playEnding}
 
 /* ---------- STAFF_PIN ---------- */
 /*
 var taps=0,tm;$('#bTitle').onclick=function(){taps++;clearTimeout(tm);tm=setTimeout(function(){taps=0},1500);
  if(taps>=5){taps=0;var p=prompt('スタッフ用の番号');if(p===STAFF_PIN&&confirm('スタンプを全部消しますか?')){st={s:[0,0,0,0,0,0,0,0,0],f:0};save();openBook()}}}*/
  }
  $('#btnBook').addEventListener('click',openBook);

/* ---------- 開始 ---------- */
if(SKIP){startCamera()}else{playOpening()}
})();
