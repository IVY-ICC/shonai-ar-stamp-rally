/* オープニング/エンディングの場面進行(つぎへボタンで進む4場面ずつ) */
(function(){
var $=function(s,r){return (r||document).querySelector(s)};
var FR=[2,3,4,5,1,6,7,8,9],SZ={1:21,9:17};
var CF=['#F58BA5','#FFD46B','#8FD3A0','#7FB6F2','#B7A8F0','#FFFFFF'];
var CFG={
 op:{caps:['もうすぐ、庄内神楽祭り!','わたしは、かぐらちゃん。お祭りの前に、町を案内するよ!','町の9つの場所で、友だちが待っているよ。','みんなに会えたら、神楽のぶたいのじゅんびをしよう!'],
     bn:['','','',''],next:['つぎへ ▶','つぎへ ▶','つぎへ ▶','あそびかたへ ▶'],cy:.70,R:function(W,H){return Math.min(.40*W,.42*H)}},
 end:{caps:['みんなのおかげで、ぶたいのじゅんびができたよ。','みんな、ありがとう!','庄内神楽が、始まるよ!','さあ、お祭りの始まりだよ!'],
     bn:['ぶたいが完成!','','','ぜんぶクリア!おめでとう!'],next:['つぎへ ▶','つぎへ ▶','つぎへ ▶',''],cy:.70,R:function(W,H){return Math.min(.40*W,.42*H)}}};
function tpl(k){
 var fl='';[['#F58BA5',4],['#FFD46B',16],['#7FB6F2',28],['#8FD3A0',40],['#B7A8F0',52],['#F58BA5',64],['#FFD46B',76],['#7FB6F2',88]].forEach(function(p,i){fl+='<i style="left:'+p[1]+'%;--c:'+p[0]+';--d:'+(i*.18).toFixed(2)+'s"></i>'});
 var rb='<svg class="rb" viewBox="0 0 200 100" preserveAspectRatio="xMidYMax meet"><g fill="none" stroke-width="5" stroke-linecap="round"><path pathLength="1" d="M10 100A90 90 0 0 1 190 100" stroke="#F7A1B4"/><path pathLength="1" d="M16 100A84 84 0 0 1 184 100" stroke="#FFD58A"/><path pathLength="1" d="M22 100A78 78 0 0 1 178 100" stroke="#FFF2A0"/><path pathLength="1" d="M28 100A72 72 0 0 1 172 100" stroke="#A8E3B8"/><path pathLength="1" d="M34 100A66 66 0 0 1 166 100" stroke="#9FD3F5"/><path pathLength="1" d="M40 100A60 60 0 0 1 160 100" stroke="#C3B6F2"/></g></svg>';
 var mt='<svg class="mtn" viewBox="0 0 400 120" preserveAspectRatio="none"><path d="M0 120V92L40 70L80 88L130 52L175 30L205 46L225 36L262 60L300 78L350 62L400 82V120Z" fill="#8FC1E0"/><path d="M175 30L162 44L172 41L180 48L188 40L198 46L205 46Z" fill="#fff" opacity=".9"/><path d="M225 36L214 48L224 45L232 50Z" fill="#fff" opacity=".9"/></svg>';
 var stg='<div class="stg"><div class="back"><div class="trio"><img class="t1" src="img/char_orochi.svg" alt=""><img class="t2" src="img/char_mikoto.svg" alt=""><img class="t3" src="img/char_hime.svg" alt=""></div></div><div class="curt l"></div><div class="curt r"></div><div class="roof"></div><div class="floor"></div><div class="lant a"></div><div class="lant b"></div></div>';
 return '<div class="sky"></div><div class="dawn"></div><div class="sun"></div>'+mt+'<div class="flags">'+fl+'</div><div class="ground"></div>'+rb+'<div class="cf"></div><div class="fs"></div>'+stg+
  '<div class="g"><img src="img/guide.svg" alt=""></div><div class="ebanner"></div><div class="cap"></div><div class="nav"><button class="btn big nx"></button><button class="btn bk"></button></div><button class="btn small skip2">スキップ</button>'}
function Story(id,k,hooks){
 var el=$('#'+id),cfg=CFG[k],n=0,fs,fe={};
 el.innerHTML=tpl(k);el.classList.add('story');fs=$('.fs',el);
 FR.forEach(function(f,i){var d=document.createElement('div');d.className='f';var dl=(f===1)?0.3+8*0.15:0.3+(i<4?i:i-1)*0.15;
  d.style.cssText='--s:'+(SZ[f]||15)+'vmin;--d:'+dl.toFixed(2)+'s';d.innerHTML='<img src="img/friend'+f+'.svg" alt="">';fs.appendChild(d);fe[f]=d});
 var cf=$('.cf',el),k2;for(k2=0;k2<46;k2++){var c=document.createElement('i');c.style.cssText='left:'+(Math.random()*100).toFixed(1)+'%;background:'+CF[k2%6]+';--du:'+(3.2+Math.random()*2.6).toFixed(1)+'s;--dl:'+(.4+Math.random()*4.5).toFixed(1)+'s;--r:'+Math.round(240+Math.random()*480)+'deg;border-radius:'+(k2%3?'2px':'50%');cf.appendChild(c)}
 function layout(){var W=innerWidth,H=innerHeight,R=cfg.R(W,H),cx=W/2,cy=(W>H?cfg.cy:cfg.cy-.04)*H;
  FR.forEach(function(f,i){var r=(180-i*22.5)*Math.PI/180;fe[f].style.left=(cx+R*Math.cos(r))+'px';fe[f].style.top=(cy-R*Math.sin(r))+'px'})}
 layout();addEventListener('resize',layout);
 var cap=$('.cap',el),bn=$('.ebanner',el),nx=$('.nx',el),bk=$('.bk',el),nav=$('.nav',el);
 function pop(e){e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop')}
 function go(i){n=i;el.dataset.s=i;cap.textContent=cfg.caps[i-1];pop(cap);bn.textContent=cfg.bn[i-1];if(cfg.bn[i-1]){bn.style.display='';pop(bn)}else{bn.classList.remove('pop');bn.style.display='none'}
  nav.classList.remove('in');void nav.offsetWidth;nav.classList.add('in');
  var last=(i===4);if(k==='op'){nx.textContent=cfg.next[i-1];nx.style.display='';bk.style.display='none'}
  else if(last){nx.textContent=hooks.bookText;nx.style.display='';bk.textContent='もういちど見る';bk.style.display=''}
  else{nx.textContent=cfg.next[i-1];nx.style.display='';bk.style.display='none'}}
 nx.onclick=function(){if(n<4){go(n+1)}else if(k==='op'){hooks.done()}else{hooks.book()}};
 bk.onclick=function(){hooks.again()};
 $('.skip2',el).onclick=function(){if(k==='op')hooks.done();else go(4)};
 return{start:function(){el.dataset.s=0;void el.offsetWidth;go(1)},layout:layout}}
var inst={};
window.Story={start:function(id,k,hooks){inst[id]=inst[id]||Story(id,k,hooks);inst[id].start()}};
})();
