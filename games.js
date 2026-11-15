/* 9つのゲームとラストの神楽(iPad横向き用)。cx = {stage, hint(文), quiz(クリア後の動き), done(), cleanups[], spot} */
var GAMES=[];
function mk(stage){var c=document.createElement('canvas');stage.appendChild(c);var r=stage.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);
 c.width=Math.round(r.width*d);c.height=Math.round(r.height*d);var g=c.getContext('2d');g.scale(d,d);return{c:c,g:g,w:r.width,h:r.height}}
function PT(e,c){var r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function loopG(cx,fn){var on=true,f=function(t){if(!on)return;fn(t);requestAnimationFrame(f)};requestAnimationFrame(f);cx.cleanups.push(function(){on=false})}
function rnd(a,b){return a+Math.random()*(b-a)}
function loadImg(src){var i=new Image();i.src=src;return i}
function badge(stage,txt){var b=document.createElement('div');b.className='badge2';b.textContent=txt;stage.appendChild(b);return b}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}

/* 1 梨:金色の梨をさがす */
GAMES[0]=function(cx){
 var m=mk(cx.stage),g=m.g,w=m.w,h=m.h,cols=6,rows=3,ps=[],gold=Math.floor(Math.random()*cols*rows),found=false,pop=0,wrong=0;
 var s=Math.min(w/(cols+1.4),h/(rows+1.8))*.55;
 for(var r=0;r<rows;r++)for(var c=0;c<cols;c++)ps.push({x:w*(.14+.72*c/(cols-1))+rnd(-s*.25,s*.25),y:h*(.3+.46*r/(rows-1))+rnd(-s*.2,s*.2),s:s*rnd(.92,1.08),gold:ps.length===gold,sh:0});
 var leaves=[];for(var k=0;k<46;k++)leaves.push({x:rnd(0,w),y:rnd(h*.08,h*.95),r:rnd(s*.5,s*1.1),a:rnd(0,6)});
 function star(x,y,r,rot){g.save();g.translate(x,y);g.rotate(rot);g.fillStyle='#fff';g.beginPath();for(var i=0;i<8;i++){var rr=i%2?r*.3:r;g.lineTo(Math.cos(i*Math.PI/4)*rr,Math.sin(i*Math.PI/4)*rr)}g.closePath();g.fill();g.restore()}
 function pear(p,t){g.save();g.translate(p.x+(p.sh>0?Math.sin(p.sh)*5:0),p.y);var z=p.s*(p.gold&&found?1+pop*.5:1);
  g.fillStyle=p.gold?'#FFC933':'#E6E08A';g.strokeStyle=p.gold?'#E69A00':'#A8A04E';g.lineWidth=3;
  g.beginPath();g.ellipse(0,0,z*.7,z*.62,0,0,7);g.fill();g.stroke();
  g.fillStyle=p.gold?'#F2B01A':'#CFC76C';g.beginPath();g.ellipse(0,-z*.56,z*.16,z*.06,0,0,7);g.fill();
  g.strokeStyle='#8B6A3E';g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(0,-z*.57);g.quadraticCurveTo(z*.02,-z*.72,z*.1,-z*.8);g.stroke();
  g.fillStyle=p.gold?'#D98F00':'#B7A25A';[[-.35,-.15],[.1,-.3],[.38,-.08],[-.2,.15],[.25,.22],[-.42,.3],[.02,.38],[.45,.34],[-.05,0]].forEach(function(q){g.beginPath();g.arc(q[0]*z,q[1]*z,z*.04,0,7);g.fill()});
  if(p.gold){var k=.6+.4*Math.sin(t/200);star(-z*.6,-z*.4,z*.28*k,t/600);star(z*.66,z*.1,z*.22*(1.2-k*.5),-t/500)}
  g.restore()}
 loopG(cx,function(t){var gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#CDEBFF');gr.addColorStop(1,'#E9F7E0');g.fillStyle=gr;g.fillRect(0,0,w,h);
  leaves.forEach(function(l){g.fillStyle='rgba(127,201,143,.85)';g.beginPath();g.ellipse(l.x,l.y,l.r,l.r*.55,l.a,0,7);g.fill()});
  ps.forEach(function(p){if(p.sh>0)p.sh-=.5;pear(p,t)});if(found&&pop<1)pop+=.05});
 cx.hint(cx.spot.hint);
 m.c.addEventListener('pointerdown',function(e){if(found)return;var q=PT(e,m.c),best=null,bd=1e9;
  ps.forEach(function(p){var d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;best=p}});
  if(best&&bd<best.s*1.05){if(best.gold){found=true;cx.hint('見つけた!');setTimeout(function(){cx.quiz()},900)}else{best.sh=8;wrong++;if(wrong%2===0)cx.hint('それはふつうの梨だよ。金色にかがやく梨をさがそう。')}}})};

/* 2 なす:はさみでとる */
GAMES[1]=function(cx){
 var m=mk(cx.stage),g=m.g,w=m.w,h=m.h,N=5,es=[],by=h*.23,sl=h*.1,rx=Math.min(h*.075,w*.045),ry=rx*2.1,cutN=0,trail=[],last=null,fin=false,bY=h*.78;
 for(var i=0;i<N;i++)es.push({x:w*(.14+.72*i/(N-1)),y:by+sl+ry,vy:0,rot:0,cut:false,land:false,lx:0});
 var bk=badge(cx.stage,'とれたなす 0 / 3');
 function eggplant(e){g.save();g.translate(e.x,e.y);g.rotate(e.rot);
  g.fillStyle='#8B6FD6';g.strokeStyle='#5B45A8';g.lineWidth=3;g.beginPath();g.ellipse(0,0,rx,ry,0,0,7);g.fill();g.stroke();
  g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(-rx*.4,-ry*.2,rx*.16,ry*.4,.1,0,7);g.fill();
  g.fillStyle='#7FC98F';g.strokeStyle='#4E9E62';g.beginPath();g.moveTo(-rx*.9,-ry*.82);g.lineTo(0,-ry*1.02);g.lineTo(rx*.9,-ry*.82);g.lineTo(rx*.5,-ry*.62);g.lineTo(-rx*.5,-ry*.62);g.closePath();g.fill();g.stroke();g.restore()}
 function leaf(x,y,r,a){g.save();g.translate(x,y);g.rotate(a);g.fillStyle='#5FAE6E';g.strokeStyle='#3E8A52';g.lineWidth=2;g.beginPath();g.moveTo(-r,0);g.bezierCurveTo(-r*.5,-r*.62,r*.5,-r*.62,r,0);g.bezierCurveTo(r*.5,r*.62,-r*.5,r*.62,-r,0);g.fill();g.stroke();g.beginPath();g.moveTo(-r,0);g.lineTo(r*.9,0);g.stroke();g.restore()}
 function flower(x,y,r){g.fillStyle='#B58AE6';for(var i=0;i<5;i++){g.beginPath();g.ellipse(x+Math.cos(i*1.256)*r*.6,y+Math.sin(i*1.256)*r*.6,r*.55,r*.38,i*1.256,0,7);g.fill()}g.fillStyle='#FFE27A';g.beginPath();g.arc(x,y,r*.3,0,7);g.fill()}
 function drawBranch(){g.lineCap='round';g.lineJoin='round';
  g.strokeStyle='#5E4126';g.lineWidth=h*.04;g.beginPath();g.moveTo(w*.02,by-h*.01);g.bezierCurveTo(w*.3,by-h*.045,w*.62,by+h*.02,w*.98,by-h*.03);g.stroke();
  g.strokeStyle='#7A5632';g.lineWidth=h*.028;g.beginPath();g.moveTo(w*.02,by-h*.01);g.bezierCurveTo(w*.3,by-h*.045,w*.62,by+h*.02,w*.98,by-h*.03);g.stroke();
  [[.08,-1],[.28,-1],[.5,-1],[.72,-1],[.9,-1]].forEach(function(q,i){var x=w*q[0],y=by-h*.02+(i%2?h*.008:0);g.strokeStyle='#6A4A2A';g.lineWidth=h*.016;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+(i%2?-1:1)*h*.03,y-h*.07,x+(i%2?-1:1)*h*.05,y-h*.11);g.stroke();
   leaf(x+(i%2?-1:1)*h*.08,y-h*.11,h*.085,(i%2?.5:-.5));leaf(x+(i%2?1:-1)*h*.03,y-h*.085,h*.07,(i%2?-.7:.7))});
  leaf(w*.17,by-h*.07,h*.075,-.3);leaf(w*.39,by-h*.07,h*.08,.3);leaf(w*.62,by-h*.06,h*.075,-.3);leaf(w*.82,by-h*.075,h*.08,.35);
  flower(w*.19,by-h*.12,h*.03);flower(w*.62,by-h*.13,h*.03)}
 loopG(cx,function(t){var gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#E4F4FF');gr.addColorStop(1,'#F3EEFF');g.fillStyle=gr;g.fillRect(0,0,w,h);
  drawBranch();
  g.fillStyle='#C79A5C';g.strokeStyle='#9E7440';g.lineWidth=4;g.beginPath();g.roundRect?g.roundRect(w*.22,bY,w*.56,h*.19,14):g.rect(w*.22,bY,w*.56,h*.19);g.fill();g.stroke();
  es.forEach(function(e,i){if(!e.cut){g.strokeStyle='#6C7F3F';g.lineWidth=7;g.beginPath();g.moveTo(e.x,by+h*.005);g.lineTo(e.x,e.y-ry);g.stroke()}
   else if(!e.land){e.vy+=.9;e.y+=e.vy;e.rot+=.04*(e.x<w/2?-1:1);if(e.y>bY+h*.04){e.land=true;e.y=bY+h*.05;e.x=w*(.3+.14*(cutN>0?es.filter(function(q){return q.land}).length-1:0));e.rot=Math.PI/2*(e.x<w/2?1:-1)*.8}}
   eggplant(e)});
  g.fillStyle='#C79A5C';g.fillRect(w*.22,bY+h*.1,w*.56,h*.09);g.strokeStyle='#9E7440';g.strokeRect(w*.22,bY+h*.1,w*.56,h*.09);
  var now=performance.now();trail=trail.filter(function(q){return now-q.t<250});
  if(trail.length>1){g.strokeStyle='rgba(255,255,255,.95)';g.lineWidth=6;g.beginPath();trail.forEach(function(q,i){i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.stroke()}
  if(last){g.font=(h*.07)+'px sans-serif';g.fillText('✂️',last.x-h*.03,last.y+h*.02)}});
 function cutTest(a,b){if(fin)return;es.forEach(function(e){if(e.cut||cutN>=3)return;var lo=Math.min(a.x,b.x)-8,hi=Math.max(a.x,b.x)+8;
   if(e.x<lo||e.x>hi)return;var t=(b.x===a.x)?0:Math.max(0,Math.min(1,(e.x-a.x)/(b.x-a.x))),y=a.y+t*(b.y-a.y);
   if(y>by-10&&y<by+sl+ry*.5){e.cut=true;cutN++;bk.textContent='とれたなす '+cutN+' / 3';
    if(cutN>=3){fin=true;cx.hint('3本とれた!');setTimeout(function(){cx.quiz()},1400)}}})}
 m.c.addEventListener('pointerdown',function(e){last=PT(e,m.c);trail=[{x:last.x,y:last.y,t:performance.now()}];m.c.setPointerCapture(e.pointerId)});
 m.c.addEventListener('pointermove',function(e){if(!last)return;var p=PT(e,m.c);cutTest(last,p);last=p;trail.push({x:p.x,y:p.y,t:performance.now()})});
 ['pointerup','pointercancel'].forEach(function(n){m.c.addEventListener(n,function(){last=null})})};

/* 3 いちご:こたえるといちごが現れる */
GAMES[2]=function(cx){
 cx.stage.innerHTML='<div class="ibox">?</div>';
 cx.quiz(function(){cx.stage.innerHTML='<img class="ibig" src="img/friend3.svg" alt="">';
  for(var i=0;i<16;i++){var s=document.createElement('div');s.textContent=['✨','🍓','⭐'][i%3];s.style.cssText='position:absolute;font-size:'+(4+Math.random()*4)+'vh;left:'+(Math.random()*90+2)+'%;top:'+(Math.random()*80+5)+'%;animation:bounce '+(.6+Math.random()*.6)+'s ease-in-out infinite';cx.stage.appendChild(s)}
  cx.hint('いちごがあらわれた!');setTimeout(cx.done,2200)})};

/* 4 トマト:くもったビニールをふく */
GAMES[3]=function(cx){
 var sc=mk(cx.stage),g=sc.g,w=sc.w,h=sc.h,fg=mk(cx.stage),f=fg.g,tm=loadImg('img/friend4.svg');
 function scene(){var gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#CFEFFF');gr.addColorStop(.62,'#E8F7E4');gr.addColorStop(.62,'#B98B5E');gr.addColorStop(1,'#9E7440');g.fillStyle=gr;g.fillRect(0,0,w,h);
  g.strokeStyle='#fff';g.lineWidth=h*.012;for(var i=1;i<5;i++){g.beginPath();g.moveTo(w*i/5,0);g.lineTo(w*i/5,h*.62);g.stroke()}g.beginPath();g.moveTo(0,h*.3);g.lineTo(w,h*.3);g.stroke();
  [.12,.32,.52,.72,.9].forEach(function(px,i){var y=h*(.5+(i%2)*.06),s=Math.min(w*.17,h*.34);g.strokeStyle='#5FAE6B';g.lineWidth=h*.012;g.beginPath();g.moveTo(w*px,h*.62);g.lineTo(w*px,h*.1);g.stroke();
   g.fillStyle='#7FC98F';for(var k=0;k<5;k++){g.beginPath();g.ellipse(w*px+(k%2?1:-1)*s*.28,h*(.15+k*.09),s*.2,s*.08,(k%2?.5:-.5),0,7);g.fill()}
   if(tm.complete)g.drawImage(tm,w*px-s/2,y-s*.55,s,s*.95)})}
 scene();tm.onload=scene;
 f.fillStyle='rgba(238,244,250,.97)';f.fillRect(0,0,w,h);f.fillStyle='rgba(255,255,255,.5)';for(var i=0;i<40;i++){f.beginPath();f.arc(rnd(0,w),rnd(0,h),rnd(3,9),0,7);f.fill()}
 var GX=30,GY=18,seen={},n=0,pb=badge(cx.stage,'きれいになった 0%'),fin=false,down=false,lp=null,R=Math.min(w,h)*.085;
 function wipe(p){f.globalCompositeOperation='destination-out';f.lineWidth=R*2;f.lineCap='round';f.beginPath();f.moveTo((lp||p).x,(lp||p).y);f.lineTo(p.x,p.y);f.stroke();f.beginPath();f.arc(p.x,p.y,R,0,7);f.fill();f.globalCompositeOperation='source-over';
  for(var gx=0;gx<GX;gx++)for(var gy=0;gy<GY;gy++){var cx0=(gx+.5)*w/GX,cy0=(gy+.5)*h/GY;if(!seen[gx+','+gy]&&Math.hypot(cx0-p.x,cy0-p.y)<R){seen[gx+','+gy]=1;n++}}
  var pc=Math.min(100,Math.round(n/(GX*GY)*100/.8));pb.textContent='きれいになった '+pc+'%';
  if(pc>=100&&!fin){fin=true;fg.c.style.transition='opacity .6s';fg.c.style.opacity=0;cx.hint('きれいになった!トマトが見えたよ。');setTimeout(function(){cx.quiz()},1100)}lp=p}
 fg.c.addEventListener('pointerdown',function(e){down=true;lp=null;fg.c.setPointerCapture(e.pointerId);wipe(PT(e,fg.c))});
 fg.c.addEventListener('pointermove',function(e){if(down&&!fin)wipe(PT(e,fg.c))});
 ['pointerup','pointercancel'].forEach(function(nm){fg.c.addEventListener(nm,function(){down=false;lp=null})})};

/* 5 ほうれんそう:3束ぬく */
GAMES[4]=function(cx){
 var h='<div class="hgrid">';for(var i=0;i<9;i++)h+='<div class="hcell"><div class="hole"></div><img src="img/friend5.svg" alt=""></div>';
 cx.stage.innerHTML=h+'</div>';var pc=0,cells=cx.stage.querySelectorAll('.hcell'),bd=badge(cx.stage,'ぬいた数 0 / 3');
 cells.forEach(function(c){c.addEventListener('click',function(){if(pc>=3||c.classList.contains('pulled'))return;c.classList.add('pulled');pc++;bd.textContent='ぬいた数 '+pc+' / 3';
  if(pc>=3){cx.hint('3束ぬけた!');setTimeout(function(){cx.quiz()},1000)}else cx.hint('あと '+(3-pc)+'束ぬこう。')})})};

/* 6 ゆず:リトマス試験紙(青・赤の2まい。どちらからでもOK。つけて2.5秒でじどうで終わる) */
GAMES[5]=function(cx){
 var SP=[{k:'blue',x:'6%',n:'青リトマス紙',res:'赤くなったよ!',chg:true},{k:'red',x:'21%',n:'赤リトマス紙',res:'ぜんぜん変わらないね!',chg:false}];
 cx.stage.innerHTML='<div class="yzbowl"><span>ゆずの果じゅう</span></div><img src="img/friend6.svg" alt="" style="position:absolute;right:46%;bottom:4%;height:32%"><div class="yzgauge"><i></i></div><div class="yzarrow">ここにつけよう ▼</div>'+
  SP.map(function(o,i){return '<div class="strip lt lt-'+o.k+'" style="left:'+o.x+'"><i></i></div><div class="ltc" style="left:calc('+o.x+' - 3vh)">'+o.n+'<em></em></div>'}).join('');
 var bw=cx.stage.querySelector('.yzbowl'),gg=cx.stage.querySelector('.yzgauge'),gi=gg.querySelector('i'),ar=cx.stage.querySelector('.yzarrow'),
  strips=cx.stage.querySelectorAll('.strip'),caps=cx.stage.querySelectorAll('.ltc'),doneN=0,active=false,tms=[];
 cx.cleanups.push(function(){tms.forEach(function(t){clearInterval(t)})});
 function inBowl(s){var a=s.getBoundingClientRect(),b=bw.getBoundingClientRect(),x=a.left+a.width/2,y=a.bottom;return x>b.left&&x<b.right&&y>b.top+b.height*.2&&y<b.bottom}
 function summary(){var d=document.createElement('div');d.className='ltsum';
  d.innerHTML='<b>しらべたけっか</b><div>青リトマス紙 → <span class="r">赤</span>に変わった</div><div>赤リトマス紙 → 変わらなかった</div><button type="button">つぎへ</button>';
  cx.stage.appendChild(d);cx.hint('2まいとも、しらべたね!けっかを見てみよう。');
  d.querySelector('button').addEventListener('click',function(){d.remove();cx.quiz()})}
 strips.forEach(function(s,idx){var o=SP[idx],dr=false,ox=0,oy=0,fin=false,t0=0,tm=null,pid=0;
  function stop(){if(tm){clearInterval(tm);tm=null}gg.style.display='none';gi.style.width='0'}
  function home(){s.style.transition='left .35s,top .35s';s.style.left=o.x;s.style.top='';setTimeout(function(){s.style.transition=''},400)}
  function finish(){stop();fin=true;dr=false;active=false;if(o.chg)s.classList.add('red');
   caps[idx].querySelector('em').textContent=o.res;caps[idx].classList.add('ok');try{s.releasePointerCapture(pid)}catch(e){}
   doneN++;cx.hint((o.chg?'赤くなった!':'ぜんぜん変わらないね!')+(doneN<2?' もう1まいも、しらべよう。':''));
   setTimeout(home,500);if(doneN===2)setTimeout(summary,1700)}
  function tick(){var p=Math.min(1,(performance.now()-t0)/2500);gi.style.width=(p*100)+'%';if(p>=1)finish()}
  function check(){if(fin)return;
   if(dr&&inBowl(s)){if(!tm){t0=performance.now();gg.style.display='block';cx.hint('しらべ中…そのまま、まってね。');tm=setInterval(tick,40);tms.push(tm)}}
   else if(tm){stop();cx.hint('リトマス紙を、ゆずの果じゅうにつけよう。')}}
  s.addEventListener('pointerdown',function(e){if(fin||active)return;active=true;dr=true;pid=e.pointerId;s.style.transition='';var r=s.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;s.setPointerCapture(pid);ar.style.display='none'});
  s.addEventListener('pointermove',function(e){if(!dr)return;var sr=cx.stage.getBoundingClientRect();s.style.left=(e.clientX-sr.left-ox)+'px';s.style.top=(e.clientY-sr.top-oy)+'px';check()});
  function up(){if(!dr)return;dr=false;active=false;if(tm){stop();cx.hint('もう少し、つけておこう。')}else if(!fin)cx.hint('リトマス紙を、ゆずの果じゅうにつけよう。');if(!fin)home()}
  s.addEventListener('pointerup',up);s.addEventListener('pointercancel',up)})};

/* 7 ブルーベリー:うらにも続く迷路 */
GAMES[6]=function(cx){
 var m=mk(cx.stage),g=m.g,w=m.w,h=m.h,C=7,R=5,bi=loadImg('img/friend7.svg');
 function gen(){var c=[];for(var r=0;r<R;r++){c.push([]);for(var q=0;q<C;q++)c[r].push({n:1,e:1,s:1,w:1,v:0})}
  var stk=[[0,0]];c[0][0].v=1;while(stk.length){var t=stk[stk.length-1],r0=t[0],c0=t[1],nb=[];
   if(r0>0&&!c[r0-1][c0].v)nb.push([r0-1,c0,'n','s']);if(r0<R-1&&!c[r0+1][c0].v)nb.push([r0+1,c0,'s','n']);if(c0>0&&!c[r0][c0-1].v)nb.push([r0,c0-1,'w','e']);if(c0<C-1&&!c[r0][c0+1].v)nb.push([r0,c0+1,'e','w']);
   if(!nb.length){stk.pop();continue}var x=nb[Math.floor(Math.random()*nb.length)];c[r0][c0][x[2]]=0;c[x[0]][x[1]][x[3]]=0;c[x[0]][x[1]].v=1;stk.push([x[0],x[1]])}return c}
 var L=[gen(),gen()];
 function bfs(c,sr,sc){var d={};d[sr+','+sc]=0;var q=[[sr,sc]];while(q.length){var t=q.shift(),r=t[0],cc=t[1],cl=c[r][cc],dd=d[r+','+cc];
   [['n',-1,0],['s',1,0],['w',0,-1],['e',0,1]].forEach(function(x){if(!cl[x[0]]){var k=(r+x[1])+','+(cc+x[2]);if(d[k]===undefined){d[k]=dd+1;q.push([r+x[1],cc+x[2]])}}})}return d}
 function far(d,minRatio,ex){var mx=0,k;for(k in d)mx=Math.max(mx,d[k]);var c=[];for(k in d)if(d[k]>=mx*minRatio&&ex.indexOf(k)<0)c.push(k);return c[Math.floor(Math.random()*c.length)]}
 var d0=bfs(L[0],0,0),portal=far(d0,.75,['0,0']),pp=portal.split(',').map(Number),d1=bfs(L[1],pp[0],pp[1]),goal=far(d1,.8,[portal]);
 function pick(d,ex){var ks=Object.keys(d).filter(function(k){return ex.indexOf(k)<0});return ks[Math.floor(Math.random()*ks.length)]}
 var b0a=pick(d0,['0,0',portal]),b0b=pick(d0,['0,0',portal,b0a]),b1=pick(d1,[portal,goal]);
 var berries={'0':[b0a,b0b],'1':[b1]},got=0,P={l:0,r:0,c:0},flipping=false,fin=false;
 var dpW=Math.min(w*.26,h*.52),cs=Math.min((w-dpW-24)/C,(h-24)/R),ox=(w-dpW-cs*C)/2+6,oy=(h-cs*R)/2;
 var bd=badge(cx.stage,'ブルーベリー 0 / 3');bd.style.left='auto';bd.style.right='2vh';
 function draw(){g.clearRect(0,0,w,h);g.fillStyle=P.l?'#FFF3D1':'#EDE9FF';g.fillRect(0,0,w,h);
  g.fillStyle=P.l?'#FFE9A8':'#DCD6FA';g.fillRect(ox-8,oy-8,cs*C+16,cs*R+16);g.fillStyle='#fff';g.fillRect(ox,oy,cs*C,cs*R);
  g.strokeStyle=P.l?'#C99A2E':'#6A5ACD';g.lineWidth=Math.max(3,cs*.07);g.lineCap='round';g.beginPath();
  for(var r=0;r<R;r++)for(var c=0;c<C;c++){var cl=L[P.l][r][c],x=ox+c*cs,y=oy+r*cs;
   if(cl.n){g.moveTo(x,y);g.lineTo(x+cs,y)}if(cl.e){g.moveTo(x+cs,y);g.lineTo(x+cs,y+cs)}if(cl.s){g.moveTo(x,y+cs);g.lineTo(x+cs,y+cs)}if(cl.w){g.moveTo(x,y);g.lineTo(x,y+cs)}}
  g.stroke();g.textAlign='center';g.textBaseline='middle';
  var pc=pp[1],pr=pp[0];g.fillStyle='#8E86D8';g.beginPath();g.arc(ox+(pc+.5)*cs,oy+(pr+.5)*cs,cs*.36,0,7);g.fill();g.fillStyle='#fff';g.font='bold '+cs*.26+'px sans-serif';g.fillText(P.l?'おもて':'うら',ox+(pc+.5)*cs,oy+(pr+.5)*cs);
  if(!P.l){g.fillStyle='#FFB3C7';g.font='bold '+cs*.3+'px sans-serif';g.fillText('S',ox+.5*cs,oy+.5*cs)}
  else{var gg=goal.split(',').map(Number);g.fillStyle='#FFD34D';g.font=cs*.62+'px sans-serif';g.fillText('🚩',ox+(gg[1]+.5)*cs,oy+(gg[0]+.5)*cs)}
  berries[P.l].forEach(function(k){var q=k.split(',').map(Number);g.fillStyle='#6F7CD0';g.beginPath();g.arc(ox+(q[1]+.5)*cs,oy+(q[0]+.5)*cs,cs*.2,0,7);g.fill();g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(ox+(q[1]+.5)*cs-cs*.06,oy+(q[0]+.5)*cs-cs*.06,cs*.05,0,7);g.fill()});
  var s=cs*.76;if(bi.complete)g.drawImage(bi,ox+(P.c+.5)*cs-s/2,oy+(P.r+.5)*cs-s/2,s,s);else{g.fillStyle='#8E9CE8';g.beginPath();g.arc(ox+(P.c+.5)*cs,oy+(P.r+.5)*cs,cs*.3,0,7);g.fill()}}
 bi.onload=draw;draw();
 function move(dir){if(flipping||fin)return;if(typeof hid==='function')hid();var cl=L[P.l][P.r][P.c];if(cl[dir])return;var dr={n:-1,s:1,w:0,e:0}[dir],dc={n:0,s:0,w:-1,e:1}[dir];P.r+=dr;P.c+=dc;
  var k=P.r+','+P.c,bl=berries[P.l],ix=bl.indexOf(k);if(ix>=0){bl.splice(ix,1);got++;bd.textContent='ブルーベリー '+got+' / 3';cx.hint('ブルーベリーゲット!');}
  draw();
  if(k===portal){flipping=true;cx.hint('うらがえすよ!');m.c.style.transition='transform .3s';m.c.style.transform='perspective(900px) rotateY(90deg)';
   setTimeout(function(){P.l^=1;draw();m.c.style.transform='perspective(900px) rotateY(0deg)';setTimeout(function(){flipping=false;m.c.style.transition=''},320)},320);return}
  if(P.l===1&&k===goal){if(got>=3){fin=true;cx.hint('ゴール!');setTimeout(function(){cx.quiz()},900)}else cx.hint('ブルーベリーを3つ集めてから、ゴールしよう。')}}
 var dp=document.createElement('div');dp.className='dpad';dp.innerHTML='<button class="u">▲</button><button class="l">◀</button><button class="r">▶</button><button class="d">▼</button>';cx.stage.appendChild(dp);var dl=document.createElement('div');dl.className='dplabel';dl.textContent='ここをおして動かそう';cx.stage.appendChild(dl);dp.classList.add('pulse');var hid=function(){dp.classList.remove('pulse');dl.style.display='none'};
 [['u','n'],['l','w'],['r','e'],['d','s']].forEach(function(x){dp.querySelector('.'+x[0]).addEventListener('click',function(){move(x[1])})});
 function key(e){var mp={ArrowUp:'n',ArrowDown:'s',ArrowLeft:'w',ArrowRight:'e'}[e.key];if(mp)move(mp)}document.addEventListener('keydown',key);cx.cleanups.push(function(){document.removeEventListener('keydown',key)});
 var ax=0,ay=0,dn=false;m.c.addEventListener('pointerdown',function(e){ax=e.clientX;ay=e.clientY;dn=true;m.c.setPointerCapture(e.pointerId)});
 m.c.addEventListener('pointermove',function(e){if(!dn)return;var dx=e.clientX-ax,dy=e.clientY-ay,t=cs*.5;if(Math.max(Math.abs(dx),Math.abs(dy))<t)return;if(Math.abs(dx)>Math.abs(dy))move(dx>0?'e':'w');else move(dy>0?'s':'n');ax=e.clientX;ay=e.clientY});
 ['pointerup','pointercancel'].forEach(function(n){m.c.addEventListener(n,function(){dn=false})})};

/* 8 由布岳:等高線 */
GAMES[7]=function(cx){
 var m=mk(cx.stage),g=m.g,w=m.w,h=m.h,pg=0,fin=false,dr=false,ly=0,layers=[],bd=badge(cx.stage,'山の高さ 0%');
 var bx=w*.5,by=h*.8,rx=Math.min(w*.3,h*.5),ry=rx*.5,cols=['#3f8f4f','#5fa85f','#8cb35a','#b3924a','#a67c52','#8f6a4a'];
 for(var i=0;i<3;i++){var t=i/5,sc=1-t*.5;layers.push({cx:bx,cy:by-t*ry*1.8,rx:rx*sc,ry:ry*sc,c:cols[i],at:i/6,seed:i*12.9898,label:''})}
 var po=rx*.28;for(var j=3;j<6;j++){var tt=j/5,sc2=(1-tt*.65)*.55,lf=tt*ry*2.2;
  layers.push({cx:bx-po,cy:by-lf-8,rx:rx*sc2,ry:ry*sc2,c:cols[j],at:j/6,seed:j*15.123,label:'西のみね'});layers.push({cx:bx+po,cy:by-lf,rx:rx*sc2*.95,ry:ry*sc2*.95,c:cols[j],at:j/6,seed:j*27.456,label:'東のみね'})}
 function shape(l,rise){g.beginPath();for(var i=0;i<=18;i++){var a=i/18*Math.PI*2,nz=Math.sin(a*3+l.seed)*.08+Math.sin(a*5+l.seed*1.7)*.05;
   var x=l.cx+Math.cos(a)*l.rx*(1+nz),y=l.cy-rise+Math.sin(a)*l.ry*(1+nz);i?g.lineTo(x,y):g.moveTo(x,y)}g.closePath()}
 loopG(cx,function(now){g.clearRect(0,0,w,h);var gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#D8F0FF');gr.addColorStop(1,'#F2F8E6');g.fillStyle=gr;g.fillRect(0,0,w,h);
  if(pg<.08){g.save();g.setLineDash([12,10]);g.strokeStyle='#3f8f4f';g.lineWidth=4;g.beginPath();g.ellipse(bx,by,rx,ry,0,0,7);g.stroke();g.restore();var yy=Math.sin(now/260)*h*.03;g.fillStyle='#33376B';g.font='bold '+h*.09+'px sans-serif';g.textAlign='center';g.fillText('↑',bx,by-h*.1+yy);g.font='bold '+h*.045+'px sans-serif';g.fillText('上になぞろう',bx,by+h*.12)}
  layers.forEach(function(l){var c=Math.max(0,Math.min(1,(pg-l.at)/(1/6)));if(c<=0)return;g.save();g.globalAlpha=c;g.fillStyle=l.c;g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=2;shape(l,(1-c)*35);g.fill();g.stroke();
   if(pg>=.85&&l.label){g.fillStyle='#222';g.font='bold '+Math.max(14,h*.042)+'px sans-serif';g.textAlign='center';g.fillText(l.label,l.cx,l.cy-l.ry-8)}g.restore()})});
 function mv(y){if(!dr||fin)return;var d=ly-y;ly=y;if(d>0){pg=Math.min(1,pg+d/(h*.8));bd.textContent='山の高さ '+Math.round(pg*100)+'%';
   if(pg<.3)cx.hint('指で画面を上になぞろう。');else if(pg<.7)cx.hint('みねが2つに分かれてきた!');else if(pg<1)cx.hint('あと少し!');
   if(pg>=1){fin=true;cx.hint('山ができた!');setTimeout(function(){cx.quiz()},1000)}}}
 m.c.addEventListener('pointerdown',function(e){dr=true;ly=e.clientY;m.c.setPointerCapture(e.pointerId)});
 m.c.addEventListener('pointermove',function(e){mv(e.clientY)});
 ['pointerup','pointercancel'].forEach(function(n){m.c.addEventListener(n,function(){dr=false})})};

/* 9 ミツマタ:えだが3つに分かれる */
GAMES[8]=function(cx){
 var m=mk(cx.stage),g=m.g,w=m.w,h=m.h,lv=1,dur=700,t0=performance.now()-dur-50,fin=false,bd=badge(cx.stage,'分かれた回数 1');
 function flower(x,y,r){g.fillStyle='#FFF1A8';for(var k=0;k<6;k++){g.beginPath();g.arc(x+Math.cos(k*1.047)*r*.8,y+Math.sin(k*1.047)*r*.8,r*.7,0,7);g.fill()}g.fillStyle='#FFC933';g.beginPath();g.arc(x,y,r*.55,0,7);g.fill()}
 function br(x,y,a,len,th,d,t){var gr=d<lv?1:t,x2=x+Math.sin(a)*len*gr,y2=y-Math.cos(a)*len*gr;
  g.strokeStyle='#8B6A3E';g.lineWidth=th;g.lineCap='round';g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();
  if(d<lv){[-1,0,1].forEach(function(k){br(x2,y2,a+k*.62,len*.64,th*.68,d+1,t)})}else if(gr>.8)flower(x2,y2,Math.max(5,h*.03-lv*h*.005))}
 loopG(cx,function(now){var t=Math.min(1,(now-t0)/dur);t=1-Math.pow(1-t,3);
  var gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#D6EEFF');gr.addColorStop(1,'#F4F8DC');g.fillStyle=gr;g.fillRect(0,0,w,h);
  g.fillStyle='#BFE3A8';g.beginPath();g.ellipse(w/2,h*.97,w*.5,h*.1,0,0,7);g.fill();
  br(w/2,h*.93,0,h*.27,Math.max(8,h*.03),0,t);
  g.fillStyle='#33376B';g.font='bold '+Math.max(16,h*.045)+'px sans-serif';g.textAlign='center';g.fillText('えだの先: '+Math.pow(3,lv)+'こ',w/2,h*.09)});
 m.c.addEventListener('pointerdown',function(){if(fin||performance.now()-t0<dur)return;if(lv<3){lv++;t0=performance.now();bd.textContent='分かれた回数 '+lv;
   cx.hint(lv<3?'もう一度タップ!えだがまた3つに分かれるよ。':'3回分かれたよ!');
   if(lv>=3){fin=true;setTimeout(function(){cx.quiz()},1600)}}})};

/* ラスト 神楽:ならべかえ */
var FINALE_GAME=function(cx){
 var st=cx.stage,w=st.clientWidth,h=st.clientHeight,F=FINALE,names=['左','まんなか','右'],slots=[],cards=[],home=[];
 var clue=document.createElement('div');clue.className='clue';clue.innerHTML=F.clue.join('<br>');st.appendChild(clue);
 var ss=Math.min(h*.3,w*.2);
 [.25,.5,.75].forEach(function(px,i){var s=document.createElement('div');s.className='slot';s.style.cssText='position:absolute;width:'+ss+'px;height:'+ss+'px;left:'+(w*px-ss/2)+'px;top:'+(h*.36)+'px;max-width:none';s.innerHTML='<b>'+names[i]+'</b>';st.appendChild(s);slots.push({el:s,x:w*px,y:h*.36+ss/2,card:null})});
 var order=shuffle(F.order.slice()),cw=0,ch=0;
 order.forEach(function(id,i){var c=document.createElement('div');c.className='kcard';c.dataset.id=id;c.innerHTML='<img src="img/char_'+id+'.svg" alt="">';st.appendChild(c);cards.push(c)});
 cw=cards[0].offsetWidth;ch=cards[0].offsetHeight;
 cards.forEach(function(c,i){var hx=w*[.2,.38,.56][i],hy=h*.82;home.push({x:hx,y:hy});place(c,hx,hy);bind(c,i)});
 function place(c,x,y){c.style.left=(x-cw/2)+'px';c.style.top=(y-ch/2)+'px'}
 function bind(c,i){var dr=false,ox=0,oy=0;
  c.addEventListener('pointerdown',function(e){dr=true;var r=c.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;c.setPointerCapture(e.pointerId);c.style.zIndex=9;slots.forEach(function(s){if(s.card===c)s.card=null})});
  c.addEventListener('pointermove',function(e){if(!dr)return;var sr=st.getBoundingClientRect();c.style.left=(e.clientX-sr.left-ox)+'px';c.style.top=(e.clientY-sr.top-oy)+'px'});
  function up(){if(!dr)return;dr=false;c.style.zIndex=3;var x=c.offsetLeft+cw/2,y=c.offsetTop+ch/2,best=null,bd=1e9;
   slots.forEach(function(s){var d=Math.hypot(x-s.x,y-s.y);if(d<bd){bd=d;best=s}});
   if(best&&bd<ss*.9){if(best.card){var o=best.card,oi=cards.indexOf(o);place(o,home[oi].x,home[oi].y)}best.card=c;place(c,best.x,best.y)}else place(c,home[i].x,home[i].y)}
  c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up)}
 var b=document.createElement('button');b.className='btn big kbtn';b.textContent='これで決まり!';st.appendChild(b);
 b.addEventListener('click',function(){if(slots.some(function(s){return!s.card})){cx.hint('3人全員を、わくの中に入れてね。');return}
  var ok=slots.every(function(s,i){return s.card.dataset.id===F.order[i]});
  slots.forEach(function(s,i){s.card.classList.toggle('ok',s.card.dataset.id===F.order[i])});
  if(ok){cx.hint('せいかい!おろちをたいじしたよ!');setTimeout(cx.done,1400)}else cx.hint('ちがう順番みたい。ヒントをもう一度読もう。')})};
