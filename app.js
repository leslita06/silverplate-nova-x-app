(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var EV=Date.UTC(2027,1,11,19,0,0);
var app=$('#app'), body=document.body;
function p2(n){return String(n).padStart(2,'0')}
function hm(t){t=Math.floor(t);return p2(Math.floor(t/60)%24)+':'+p2(t%60)}
function hFr(t){var h=Math.floor(t/60),m=t%60;return h+' h'+(m?' '+p2(m):'')}
function ini(n){return n.replace(/^(M\.|Mme)\s+/,'').split(/[\s-]+/).map(function(w){return w.charAt(0)}).join('').slice(0,2).toUpperCase()}
var COL={'Distributeur':'#E8892B','Partenaire':'#6F8CFF','Presse':'#3DDC97','Influenceur':'#FF6FB1','Officiel':'#F6C343','Équipe NOVA':'#B48CFF'};
function avStyle(p){var c=COL[p]||'#888';return 'background:'+c+'22;color:'+c+';border:1.5px solid '+c+'66'}
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem('nx3-'+k));localStorage.setItem('nx3-'+k,JSON.stringify(v))}catch(e){return null}}

/* ---------- invité type ---------- */
var ME={c:'NOVAX-2027-AK-290245',n:'Mme Aya Koné',p:'Distributeur',t:12};
var G=(window.NX_INVITES||[]).map(function(x){return {c:x[0],n:x[1],p:x[2],t:x[3],vip:!!x[4]}});
G.unshift({c:ME.c,n:ME.n,p:ME.p,t:ME.t,me:true});
var PROF={'Influenceur':'Créateur de contenu'};
function prof(p){return PROF[p]||p}
var myTable=G.filter(function(g){return g.t===ME.t}).slice(0,10);

/* ---------- programme ---------- */
var P=[
 [19*60,'Portes et accueil','Scan du billet au comptoir NOVA X, badge et vestiaire.','Hall','libre',15],
 [19*60+15,'Cocktail et photocall','Cocktail dînatoire, photocall NOVA X et mur photo en direct.','Foyer','libre',30],
 [19*60+45,'Appel en salle','Installation à votre table. Votre place est sur votre billet.','Salle','table',15],
 [20*60,'Mot d\'accueil de NOVA Électronique','Ouverture de la soirée par la direction.','Scène','scene',8],
 [20*60+8,'Révélation du NOVA X','Le produit dévoilé sur scène et sur l\'écran géant.','Scène','scene',12],
 [20*60+20,'Vote en direct','Choisissez votre finition préférée depuis l\'appli.','Scène','scene',5],
 [20*60+25,'Questions à la scène','Les questions les plus soutenues sont posées en direct.','Scène','scene',5],
 [20*60+30,'Prise en main sur les stands','Prise en main du NOVA X avec les équipes NOVA.','Stands','libre',60],
 [21*60+30,'Dîner assis','Service à table. Régime particulier : signalez-le au serveur.','Salle','table',60],
 [22*60+30,'DJ et piste de danse','Le plateau se transforme en piste.','Salle','libre',30],
 [23*60,'Fin de soirée','Un souvenir NOVA X vous est remis à la sortie.','Hall','libre',30]
];
function idxAt(T){var i=-1;P.forEach(function(p,k){if(T>=p[0])i=k});return i}

/* ---------- horloge simulée ---------- */
var S={live:false,T:20*60+6,speed:2};
var timer=null;
function setLive(on,T){
 S.live=on; if(T!==undefined)S.T=T;
 body.classList.toggle('is-live',on); app.classList.toggle('is-live',on);
 $('#pre').hidden=on; $('#live').hidden=!on;
 $('#h-eyebrow').textContent=on?'En direct du Sofitel Ivoire':'NOVA Électronique vous invite';
 var b=$('#desk-live'); b.classList.toggle('on',on); $('span',b).textContent=on?'Revenir au compte à rebours':'Simuler le direct';
 clearInterval(timer);
 if(on){timer=setInterval(function(){S.T+=1/ (S.speed);render()},1000/1);}
 render();
}
function render(){
 var T=S.T;
 var tt=S.live?hm(T):hm((Date.now()/6e4)%1440);
 $('#st-time').textContent=tt; $('#live-clock').textContent=hm(T); $('#rg-clock').textContent=S.live?hm(T):'avant';
 if(S.live){
  var i=Math.max(0,idxAt(T)), c=P[i], n=P[i+1];
  $('#now-t').textContent=c[1]; $('#now-d').textContent=c[3]+' : '+c[2];
  var end=n?n[0]:c[0]+c[5]; $('#now-bar').style.width=Math.min(100,(T-c[0])/(end-c[0])*100)+'%';
  $('#next-h').textContent=n?hFr(n[0]):'23 h 30'; $('#next-t').textContent=n?n[1]:'Bon retour';
  $('#k-seq').textContent=c[1]; $('#k-seq-n').textContent=n?'Ensuite à '+hFr(n[0])+' : '+n[1]:'Dernière séquence';
 }
 timeline(); arrivals();
}

/* ---------- compte à rebours ---------- */
function tick(){var r=Math.max(0,EV-Date.now());
 $('#cd-d').textContent=Math.floor(r/864e5);$('#cd-h').textContent=p2(Math.floor(r/36e5)%24);
 $('#cd-m').textContent=p2(Math.floor(r/6e4)%60);$('#cd-s').textContent=p2(Math.floor(r/1e3)%60);
 if(!S.live)$('#st-time').textContent=hm(new Date().getHours()*60+new Date().getMinutes());}
tick();setInterval(tick,1000);

/* ---------- navigation ---------- */
var ORDER=['accueil','billet','table','programme','direct','photos','pratique'];
var TABS=['accueil','programme','direct','photos','pratique'];
var cur='accueil';
function go(id,opt){
 if(!$('#s-'+id))return;
 var from=$('#s-'+cur), to=$('#s-'+id);
 if(id!==cur){
  from.classList.remove('on'); from.classList.add('out'); setTimeout(function(){from.classList.remove('out')},450);
  to.classList.add('on'); to.scrollTop=0; cur=id;
 } else to.classList.add('on');
 if(opt&&opt.tab)seg(opt.tab);
 var k=TABS.indexOf(id), ind=$('#tab-ind'), btns=$$('#tabbar button');
 btns.forEach(function(b){b.classList.toggle('on',b.dataset.go===id)});
 if(k>=0){ind.style.opacity=1;ind.style.transform='translateX('+(k*100)+'%)'}
 else ind.style.opacity=0;
 $$('#jump button').forEach(function(b){b.classList.toggle('on',b.dataset.go===id)});
 headerSolid();
 if(id==='table')setTimeout(drawPlan,60);
 if(id==='programme'&&S.live)setTimeout(function(){var n=$('.tl.now');if(n)to.scrollTop=Math.max(0,n.offsetTop-150)},120);
 if(history.replaceState)history.replaceState(null,'','#'+id);
}
document.addEventListener('click',function(e){
 var b=e.target.closest('[data-go]'); if(!b)return;
 e.preventDefault(); go(b.dataset.go,{tab:b.dataset.tab});
});
$('#brand').onclick=function(){go('accueil')};
$('#btn-billet').onclick=function(){go('billet')};
function headerSolid(){var s=$('#s-'+cur);$('#top').classList.toggle('solid',cur!=='accueil'||s.scrollTop>300)}
$$('.scr').forEach(function(s){s.addEventListener('scroll',function(){if(s.id==='s-'+cur)headerSolid()},{passive:true})});
window.addEventListener('resize',function(){go(cur)});

/* ---------- billet ---------- */
function qr(el,txt,size,dark){el.innerHTML='';if(window.QRCode)new QRCode(el,{text:txt,width:size,height:size,colorDark:dark||'#0B0D17',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M})}
qr($('#qr-big'),ME.c,392); qr($('#qr-peek'),ME.c,132);
$('#av-ini').textContent=ini(ME.n);
var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//SN Silverplate Services//NOVA X//FR','BEGIN:VEVENT','UID:'+ME.c+'@novax','DTSTAMP:20270101T000000Z','DTSTART:20270211T190000Z','DTEND:20270211T233000Z','SUMMARY:NOVA X, soirée de lancement','LOCATION:Sofitel Abidjan Hôtel Ivoire\\, boulevard Hassan II\\, Cocody\\, Abidjan','DESCRIPTION:Billet '+ME.c+'. Table '+ME.t+'.','END:VEVENT','END:VCALENDAR'].join('\r\n');
$('#b-ics').href='data:text/calendar;charset=utf-8,'+encodeURIComponent(ics);
$('#b-wa').href='https://wa.me/?text='+encodeURIComponent('NOVA X, soirée de lancement\nJeudi 11 février 2027, 19 h, Sofitel Abidjan Hôtel Ivoire\nTable '+ME.t+'\nMon billet : '+ME.c);
function markMeIn(){ $('#pass').classList.add('used'); $('#pass-state').innerHTML='<i class="ok"></i>Entrée validée. Bonne soirée !'; }

/* ---------- table et plan ---------- */
function zone(n){var c=(n-1)%5,r=Math.floor((n-1)/5)+1;return (c<2?'côté jardin':c>2?'côté cour':'au centre')+', '+(r===1?'1er':r+'e')+' rang'}
$('#tb-zone').textContent=zone(ME.t);
function mates(){
 $('#mates-peek').innerHTML=myTable.filter(function(g){return !g.me}).map(function(g){return '<div class="mate"><i style="'+avStyle(g.p)+'">'+ini(g.n)+'</i><b>'+g.n.replace(/^(M\.|Mme)\s+/,'').split(' ')[0]+'</b><span>'+prof(g.p)+'</span></div>'}).join('');
 $('#mates-list').innerHTML=myTable.map(function(g){return '<li class="mrow'+(g.me?' me':'')+'"><i style="'+avStyle(g.p)+'">'+ini(g.n)+'</i><div><b>'+g.n+(g.me?' (vous)':'')+'</b><span>'+prof(g.p)+'</span></div>'+(g.vip?'<span class="tag">Officiel</span>':'')+'</li>'}).join('');
 $('#mates-n').textContent=myTable.length+' couverts';
}
mates();
var planDrawn=false;
function drawPlan(){
 if(planDrawn)return; planDrawn=true;
 var s='<defs><linearGradient id="stg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#E8892B" stop-opacity=".5"/><stop offset="1" stop-color="#E8892B" stop-opacity="0"/></linearGradient></defs>';
 s+='<rect x="70" y="8" width="220" height="10" rx="3" fill="#E8892B"/><text x="180" y="13.5" fill="#160c02" font-size="6" font-weight="800" text-anchor="middle" dominant-baseline="central" font-family="Montserrat" letter-spacing="1">ÉCRAN GÉANT</text>';
 s+='<rect x="90" y="22" width="180" height="34" rx="6" fill="#1f2450" stroke="rgba(232,137,43,.6)"/><text x="180" y="39" fill="#fff" font-size="10" font-weight="700" text-anchor="middle" dominant-baseline="central" font-family="Montserrat" letter-spacing="2">SCÈNE</text>';
 s+='<path d="M90 56 L50 110 L310 110 L270 56Z" fill="url(#stg)" opacity=".35"/>';
 s+='<rect x="8" y="150" width="20" height="120" rx="4" fill="#2a3a5c"/><text x="18" y="210" fill="#b8c2e6" font-size="7" font-weight="700" text-anchor="middle" transform="rotate(-90 18 210)" font-family="Montserrat" letter-spacing="1">DÉMONSTRATIONS</text>';
 s+='<rect x="332" y="150" width="20" height="120" rx="4" fill="#2a3a5c"/><text x="342" y="210" fill="#b8c2e6" font-size="7" font-weight="700" text-anchor="middle" transform="rotate(90 342 210)" font-family="Montserrat" letter-spacing="1">DÉMONSTRATIONS</text>';
 s+='<rect x="140" y="398" width="80" height="18" rx="4" fill="none" stroke="rgba(255,255,255,.3)" stroke-dasharray="3 3"/><text x="180" y="407" fill="#9ca1c0" font-size="7.5" font-weight="700" text-anchor="middle" dominant-baseline="central" font-family="Montserrat" letter-spacing="1.5">ENTRÉE</text>';
 var me=null;
 for(var n=1;n<=30;n++){
  var r=Math.floor((n-1)/5),c=(n-1)%5, x=72+c*54, y=92+r*50+(c%2?10:0), vip=n<=3, isMe=n===ME.t;
  if(isMe)me=[x,y];
  s+='<g class="tb'+(vip?' vip':'')+(isMe?' me':'')+'"><circle cx="'+x+'" cy="'+y+'" r="'+(isMe?16:14)+'"/>';
  for(var k=0;k<10;k++){var a=k/10*Math.PI*2;s+='<circle cx="'+(x+Math.cos(a)*(isMe?21:19)).toFixed(1)+'" cy="'+(y+Math.sin(a)*(isMe?21:19)).toFixed(1)+'" r="2.2" style="fill:'+(isMe?'#FFB25C':'rgba(255,255,255,.16)')+';stroke:none"/>'}
  s+='<text x="'+x+'" y="'+y+'">'+n+'</text></g>';
 }
 if(me){
  var ax=me[0]<180?me[0]+27:me[0]-27;s+='<path class="route" d="M180 396 L180 386 L'+ax+' 386 L'+ax+' '+me[1]+' L'+(me[0]+(ax>me[0]?20:-20))+' '+me[1]+'"/>';
  s+='<circle class="pulse" cx="'+me[0]+'" cy="'+me[1]+'" r="16"/>';
 }
 $('#plan').innerHTML=s;
}

/* ---------- programme ---------- */
var filt='all';
$$('#prog-chips button').forEach(function(b){b.onclick=function(){filt=b.dataset.f;$$('#prog-chips button').forEach(function(x){x.classList.toggle('on',x===b)});timeline()}});
function timeline(){
 var i=S.live?idxAt(S.T):-1;
 $('#timeline').innerHTML=P.map(function(p,k){
  var st=k<i?'past':k===i?'now':'';
  var bd=k===i?'<span class="badge now">Maintenant</span>':(k===i+1&&S.live)?'<span class="badge nxt">Ensuite</span>':'';
  return '<li class="tl '+st+(filt!=='all'&&p[4]!==filt?' hide':'')+'"><time>'+hm(p[0]).replace(':',' h ').replace(' h 00',' h')+'</time><div class="tl-c">'+bd+'<h5>'+p[1]+'</h5><p>'+p[2]+'</p><span class="where">'+p[3]+'</span></div></li>';
 }).join('');
}

/* ---------- vote ---------- */
var OPT=[['Noir Abysse','#0b0d17',88],['Orange Solaire','#E8892B',131],['Bleu Nuit','#262C51',64],['Argent Lune','#C9CCD8',47]];
var myVote=store('vote');
function drawPoll(){
 var tot=OPT.reduce(function(a,o){return a+o[2]},0), max=Math.max.apply(null,OPT.map(function(o){return o[2]}));
 $('#poll-total').textContent=tot+' votes';
 var box=$('#opts'); box.classList.toggle('voted',myVote!=null);
 if(!box.children.length){box.innerHTML=OPT.map(function(o,k){return '<button class="opt" data-k="'+k+'"><span class="fill"></span><span class="sw" style="background:'+o[1]+'"></span><b>'+o[0]+'</b><span class="pct">0 %</span></button>'}).join('');
  $$('.opt',box).forEach(function(b){b.onclick=function(){if(myVote!=null)return;myVote=+b.dataset.k;OPT[myVote][2]++;store('vote',myVote);$('#poll-state').textContent='Merci, vote enregistré';drawPoll()}})}
 $$('.opt',box).forEach(function(b,k){var pc=Math.round(OPT[k][2]/tot*100);b.classList.toggle('mine',myVote===k);$('.fill',b).style.width=myVote!=null?pc+'%':'0';$('.pct',b).textContent=pc+' %'});
 if(myVote!=null)$('#poll-state').textContent='Vote enregistré';
 $('#q-vote-s').textContent=myVote!=null?'Résultats en direct':'Votre finition préférée';
}
drawPoll();
var O2=[['L\'autonomie de la batterie',41],['L\'appareil photo',33],['Le prix de lancement',18],['Le design',8]];
$('#opts2').innerHTML=O2.map(function(o,k){return '<div class="opt'+(k===0?' win':'')+'"><span class="fill" data-w="'+o[1]+'"></span><b>'+o[0]+'</b><span class="pct">'+o[1]+' %</span></div>'}).join('');
function animClosed(){$$('#opts2 .fill').forEach(function(f){f.style.width='0';setTimeout(function(){f.style.width=f.dataset.w+'%'},80)})}

/* ---------- questions ---------- */
var Q=store('qs')||[
 {id:1,t:'Quel est le prix de lancement en Côte d\'Ivoire, et chez quels revendeurs ?',a:'Grâce',v:38,s:'pin',m:12},
 {id:2,t:'Le NOVA X sera-t-il disponible en paiement échelonné pour les commerçants ?',a:'Aristide',v:27,s:'ok',m:9},
 {id:3,t:'Combien de temps tient la batterie en usage normal ?',a:'Anonyme',v:22,s:'ans',m:6},
 {id:4,t:'Y aura-t-il un service après-vente à Bouaké et San-Pédro ?',a:'Salimata',v:15,s:'ok',m:4},
 {id:5,t:'Quelle garantie pour les revendeurs agréés ?',a:'Hervé',v:9,s:'ok',m:2},
 {id:6,t:'Peut-on précommander dès ce soir sur les stands ?',a:'Junior',v:0,s:'wait',m:1},
 {id:7,t:'Le chargeur rapide est-il fourni dans la boîte ?',a:'Anonyme',v:0,s:'wait',m:0}
];
var upd=store('ups')||{}; var qsort='top', qid=100;
function saveQ(){store('qs',Q);store('ups',upd)}
function stLab(s){return s==='pin'?'<span class="st pin">À l\'écran</span>':s==='ans'?'<span class="st ans">Répondue</span>':s==='wait'?'<span class="st wait">En modération</span>':''}
function drawQ(){
 var vis=Q.filter(function(q){return q.s!=='wait'&&q.s!=='no'||q.mine&&q.s==='wait'});
 vis.sort(qsort==='top'?function(a,b){return (b.s==='pin')-(a.s==='pin')||b.v-a.v}:function(a,b){return a.m-b.m});
 $('#qs').innerHTML=vis.map(function(q){return '<li class="qi'+(q.mine?' mine':'')+'"><button class="up'+(upd[q.id]?' on':'')+'" data-id="'+q.id+'" '+(q.s==='wait'?'disabled':'')+'><svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg>'+q.v+'</button><div><p>'+esc(q.t)+'</p><small>'+stLab(q.s)+esc(q.a)+', il y a '+(q.m<1?'quelques secondes':q.m+' min')+'</small></div></li>'}).join('');
 $$('#qs .up').forEach(function(b){b.onclick=function(){var q=Q.filter(function(x){return x.id==b.dataset.id})[0];if(!q)return;upd[q.id]=!upd[q.id];q.v+=upd[q.id]?1:-1;saveQ();drawQ()}});
 $('#q-count').textContent=Q.filter(function(q){return q.s!=='wait'&&q.s!=='no'}).length;
 drawMod();
}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
$$('.q-sort button').forEach(function(b){b.onclick=function(){qsort=b.dataset.s;$$('.q-sort button').forEach(function(x){x.classList.toggle('on',x===b)});drawQ()}});
$('#ask-t').addEventListener('input',function(){$('#ask-c').textContent=this.value.length+'/200'});
$('#ask').onsubmit=function(e){e.preventDefault();var t=$('#ask-t').value.trim();if(t.length<5){$('#ask-t').focus();toast('Question','Écrivez au moins quelques mots.');return}
 Q.push({id:++qid+Date.now()%1000,t:t,a:$('#ask-anon').checked?'Anonyme':ME.n,v:0,s:'wait',m:0,mine:true});saveQ();$('#ask-t').value='';$('#ask-c').textContent='0/200';
 qsort='new';$$('.q-sort button').forEach(function(x){x.classList.toggle('on',x.dataset.s==='new')});drawQ();toast('Question envoyée','Elle apparaît pour tous dès sa validation par la régie.')};
function seg(t){$$('#seg button').forEach(function(b){b.classList.toggle('on',b.dataset.t===t)});$('#pane-v').hidden=t!=='v';$('#pane-q').hidden=t!=='q';if(t==='v')animClosed()}
$$('#seg button').forEach(function(b){b.onclick=function(){seg(b.dataset.t)}});
drawQ();

/* ---------- photos ---------- */
var PH=[['gala-salle','tall','Grâce',48],['scene-lumiere','sq','Ibrahim',61],['invites','tall','Inès',27],['tables','sq','Équipe NOVA',33],['public','sq','Junior',19],['scene-feux','tall','Affoué',42],['cocktail','sq','Patrick',15],['salle-rouge','tall','Laetitia',22],['diner','sq','Éric',11],['revelation','sq','NOVA Électronique',87]];
var likes=store('likes')||{};
function drawWall(extra){
 var h=(extra||[]).map(function(src){return '<figure class="ph new"><img src="'+src+'" alt="Votre photo"><span class="who">Vous, en validation</span></figure>'}).join('');
 h+=PH.map(function(p,k){var on=likes[p[0]];return '<figure class="ph '+p[1]+'" style="animation-delay:'+(k*.05)+'s"><img src="img/'+p[0]+'.jpg" alt="Photo de soirée" loading="lazy"><span class="who">'+p[2]+'</span><button class="lk'+(on?' on':'')+'" data-k="'+p[0]+'"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>'+(p[3]+(on?1:0))+'</button></figure>'}).join('');
 $('#wall').innerHTML=h;
 $$('#wall .lk').forEach(function(b){b.onclick=function(){likes[b.dataset.k]=!likes[b.dataset.k];store('likes',likes);drawWall(mine)}});
 $('#tile-ph').textContent=(PH.length+mine.length)+' photos';
}
var mine=[];
$('#up').onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){mine.unshift(r.result);drawWall(mine);toast('Photo reçue','Elle passe sur l\'écran du cocktail après validation.')};r.readAsDataURL(f);this.value=''};
drawWall(mine);

/* ---------- équipe et messages ---------- */
var TEAM=[['Accueil et billets','Comptoir du hall','AC','#E8892B'],['Placement et tables','Salle, côté entrée','PT','#6F8CFF'],['Presse et créateurs','Espace presse','PC','#3DDC97'],['Régie de la soirée','Fond de salle','RG','#B48CFF']];
$('#team').innerHTML=TEAM.map(function(t,k){return '<li class="tm"><i style="background:'+t[3]+'22;color:'+t[3]+'">'+t[2]+'</i><div><b>'+t[0]+'</b><span class="on-site">'+t[1]+'</span></div><button data-chat="'+k+'">Écrire</button></li>'}).join('');
var REP=['Bonsoir ! Présentez-vous au comptoir du hall, nous vous attendons.','Bien noté. Un hôte vous rejoint à votre table dans deux minutes.','Avec plaisir. Retrouvez-nous à l\'espace presse, à droite de la scène.','Merci, c\'est transmis. Nous revenons vers vous très vite.'];
$$('[data-chat]').forEach(function(b){b.onclick=function(){var k=+b.dataset.chat;openSheet(TEAM[k][0],'<div class="chat" id="chat"><div class="bub them">Bonsoir, ici l\'équipe '+TEAM[k][0].toLowerCase()+'. Comment pouvons-nous vous aider ?</div></div><form class="chat-f" id="chat-f"><input id="chat-i" placeholder="Votre message" autocomplete="off"><button class="btn sm">Envoyer</button></form>');
 $('#chat-f').onsubmit=function(e){e.preventDefault();var v=$('#chat-i').value.trim();if(!v)return;var c=$('#chat');c.insertAdjacentHTML('beforeend','<div class="bub me">'+esc(v)+'</div><div class="bub them typing">…</div>');$('#chat-i').value='';setTimeout(function(){var t=$('.typing',c);if(t){t.classList.remove('typing');t.textContent=REP[k]}},1300)}}});
var ANN=store('ann')||[['19:00','Les portes sont ouvertes. Préparez votre billet pour le scan.'],['18:30','Le parking de l\'hôtel est indiqué par le fléchage NOVA X.']];
function drawAnn(){return ANN.map(function(a){return '<div class="ann"><small>'+a[0]+'</small>'+esc(a[1])+'</div>'}).join('')}
$('#btn-notif').onclick=function(){$('#notif-dot').classList.remove('on');openSheet('Annonces',drawAnn())};
function openSheet(t,h){$('#sheet-t').textContent=t;$('#sheet-body').innerHTML=h;$('#sheet').hidden=false}
$$('[data-close]').forEach(function(b){b.onclick=function(){$('#sheet').hidden=true}});
var tT;function toast(k,t){$('#toast-k').textContent=k;$('#toast-t').textContent=t;var e=$('#toast');e.classList.add('on');clearTimeout(tT);tT=setTimeout(function(){e.classList.remove('on')},3600)}
$('#b-copy').onclick=function(){var a='Sofitel Abidjan Hôtel Ivoire, boulevard Hassan II, Cocody, Abidjan';(navigator.clipboard?navigator.clipboard.writeText(a):Promise.reject()).then(function(){toast('Adresse copiée',a)},function(){toast('Adresse',a)})};

/* ---------- régie : arrivées ---------- */
// heure d'arrivée simulée, déterministe
var seed=7;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
G.forEach(function(g){var u=rnd();g.arr=u<.93?19*60+Math.round(Math.pow(rnd(),.85)*70+(rnd()*rnd())*20):null;if(g.vip&&g.arr)g.arr=Math.min(g.arr,19*60+50);if(g.me)g.arr=19*60+31});
var manual={};
function arrivedAt(g){return manual[g.c]!=null?manual[g.c]:g.arr}
var BASE=300-G.length; // places réservées aux accompagnants déjà comptés à part
function arrivals(){
 var T=S.live?S.T:18*60+59;
 var inn=G.filter(function(g){var a=arrivedAt(g);return a!=null&&a<=T});
 var n=Math.min(300,inn.length+Math.round(BASE*Math.min(1,Math.max(0,(T-19*60)/80))*.9));
 $('#k-arr').textContent=n; $('#k-gauge').style.width=(n/300*100)+'%';
 var r5=inn.filter(function(g){return arrivedAt(g)>T-5}).length;
 $('#k-rate').textContent=r5+' entrée'+(r5>1?'s':'')+' sur les 5 dernières minutes';
 if(G[0]&&arrivedAt(G[0])!=null&&arrivedAt(G[0])<=T)markMeIn();
 // par profil
 var tot={},got={};G.forEach(function(g){tot[g.p]=(tot[g.p]||0)+1});inn.forEach(function(g){got[g.p]=(got[g.p]||0)+1});
 $('#by-prof').innerHTML=Object.keys(tot).sort(function(a,b){return tot[b]-tot[a]}).map(function(p){var v=got[p]||0;return '<li><div class="bl"><span>'+prof(p)+'</span><b>'+v+' / '+tot[p]+'</b></div><div class="bt"><i style="width:'+(v/tot[p]*100)+'%;background:'+COL[p]+'"></i></div></li>'}).join('');
 // flux
 function setH(el,h){if(el._h!==h){el._h=h;el.innerHTML=h}}
 var last=inn.slice().sort(function(a,b){return arrivedAt(b)-arrivedAt(a)}).slice(0,7);
 setH($('#feed'),(typeof FERR!=='undefined'?FERR.join(''):'')+(last.length?last.map(function(g){return '<li class="'+(g.vip?'vip':'')+'"><i style="'+avStyle(g.p)+'">'+ini(g.n)+'</i><div><b>'+g.n+'</b><span>'+prof(g.p)+', table '+g.t+(g.vip?', officiel':'')+'</span></div><time>'+hm(arrivedAt(g))+'</time></li>'}).join(''):'<li class="empty">Les portes ouvrent à 19 h.</li>'));
 // courbe
 var pts=[],mx=300;for(var m=0;m<=95;m+=5){var t=19*60+m;if(t>T)break;var c=G.filter(function(g){var a=arrivedAt(g);return a!=null&&a<=t}).length+Math.round(BASE*Math.min(1,m/80)*.9);pts.push([m/95*600,150-c/mx*140])}
 if(pts.length<2)pts=[[0,150],[1,150]];
 var d='M'+pts.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1)}).join(' L');
 $('#chart').innerHTML='<defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#E8892B" stop-opacity=".45"/><stop offset="1" stop-color="#E8892B" stop-opacity="0"/></linearGradient></defs>'+[0,1,2,3].map(function(k){return '<line x1="0" x2="600" y1="'+(10+k*46.6)+'" y2="'+(10+k*46.6)+'" stroke="rgba(255,255,255,.06)"/>'}).join('')+'<line x1="0" x2="600" y1="10" y2="10" stroke="rgba(232,137,43,.4)" stroke-dasharray="4 6" vector-effect="non-scaling-stroke"/><path d="'+d+' L'+pts[pts.length-1][0].toFixed(1)+' 150 L0 150Z" fill="url(#cg)"/><path d="'+d+'" fill="none" stroke="#E8892B" stroke-width="2.5" vector-effect="non-scaling-stroke"/>';
 var lp=pts[pts.length-1],dt=$('#chart-dot');dt.style.left=(lp[0]/6)+'%';dt.style.top=(lp[1]/150*150)+'px';
}
$('#scan').onsubmit=function(e){e.preventDefault();var v=$('#scan-in').value.trim().toUpperCase();if(!v)return;
 var g=G.filter(function(x){return x.c===v})[0], T=S.live?S.T:19*60;
 if(!S.live)setLive(true,19*60+10);
 if(!g){feedMsg('Code inconnu : '+esc(v),'Vérifier l\'invitation, appeler le chef d\'accueil')}
 else if(arrivedAt(g)!=null&&arrivedAt(g)<=S.T){feedMsg(g.n+' est déjà entré(e) à '+hm(arrivedAt(g)),'Billet déjà utilisé')}
 else{manual[g.c]=Math.floor(S.T);arrivals();toast('Entrée validée',g.n+', table '+g.t)}
 $('#scan-in').value='';};
var FERR=[];function feedMsg(t,s){FERR.unshift('<li class="ko"><i style="background:#FF5D5D22;color:#FF5D5D">!</i><div><b>'+t+'</b><span>'+s+'</span></div><time>'+hm(S.T)+'</time></li>');FERR=FERR.slice(0,2);arrivals()}

/* ---------- régie : modération ---------- */
function drawMod(){
 var w=Q.filter(function(q){return q.s==='wait'});
 $('#k-mod').textContent=w.length; $('#k-qt').textContent=Q.length;
 var mh=w.length?w.map(function(q){return '<li class="mq"><div style="flex:1"><p>'+esc(q.t)+'</p><small>'+esc(q.a)+'</small></div><div class="acts"><button class="y" title="Valider" data-a="ok" data-id="'+q.id+'"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></button><button class="p" title="Mettre à l\'écran" data-a="pin" data-id="'+q.id+'"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg></button><button class="n" title="Écarter" data-a="no" data-id="'+q.id+'"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div></li>'}).join(''):'<li class="empty">Aucune question en attente. Les nouvelles arrivent ici.</li>';
 var mq=$('#modq'); if(mq._h===mh)return; mq._h=mh; mq.innerHTML=mh;
 $$('#modq button').forEach(function(b){b.onclick=function(){var q=Q.filter(function(x){return x.id==b.dataset.id})[0];if(b.dataset.a==='pin')Q.forEach(function(x){if(x.s==='pin')x.s='ok'});q.s=b.dataset.a;saveQ();drawQ()}});
}

/* ---------- régie : incidents ---------- */
var INC=store('inc')||[['File d\'attente au comptoir : 14 personnes','Accueil',3,'19:22',0],['Micro main 2 : batterie faible','Scène',2,'19:48',0],['Table 7 : un couvert manquant','Salle',1,'19:40',1]];
function drawInc(){
 var open=INC.filter(function(i){return !i[4]});
 $('#k-inc').textContent=open.length; $('#k-inc-p').textContent=open.length?(open.filter(function(i){return i[2]===3}).length+' urgent'+(open.filter(function(i){return i[2]===3}).length>1?'s':'')):'aucun en cours';
 $('#incs').innerHTML=INC.slice().sort(function(a,b){return a[4]-b[4]||b[2]-a[2]}).map(function(i){var k=INC.indexOf(i);return '<li class="ic'+(i[4]?' done':'')+'"><span class="sev s'+i[2]+'"></span><p>'+esc(i[0])+'<small>'+i[1]+', signalé à '+i[3]+'</small></p>'+(i[4]?'<span class="rg-sub">Réglé</span>':'<button data-k="'+k+'">Marquer réglé</button>')+'</li>'}).join('');
 $$('#incs button').forEach(function(b){b.onclick=function(){INC[+b.dataset.k][4]=1;store('inc',INC);drawInc()}});
}
drawInc();
$('#inc-add').onclick=function(){$('#inc-form').hidden=!$('#inc-form').hidden;if(!$('#inc-form').hidden)$('#inc-t').focus()};
$('#inc-form').onsubmit=function(e){e.preventDefault();INC.unshift([$('#inc-t').value.trim(),$('#inc-z').value,+$('#inc-g').value,S.live?hm(S.T):'avant',0]);store('inc',INC);$('#inc-t').value='';$('#inc-form').hidden=true;drawInc()};

/* ---------- régie : annonces ---------- */
function push(t){ANN.unshift([S.live?hm(S.T):'maintenant',t]);store('ann',ANN);$('#notif-dot').classList.add('on');$('#push-log').textContent='Envoyée à '+(S.live?hm(S.T):'l\'instant')+' : « '+t+' »';toast('Annonce de l\'organisation',t)}
$('#push').onsubmit=function(e){e.preventDefault();var t=$('#push-t').value.trim();if(t){push(t);$('#push-t').value=''}};
$$('#presets button').forEach(function(b){b.onclick=function(){push(b.textContent)}});

/* ---------- régie : ouverture ---------- */
function regie(on){$('#regie').hidden=!on;$('#desk').hidden=on;if(on){if(!S.live)setLive(true,20*60+6);arrivals();drawMod();history.replaceState&&history.replaceState(null,'','#regie')}else go(cur)}
$('#regie-link').onclick=function(){regie(true)}; $('#desk-regie').onclick=function(){regie(true)}; $('#rg-back').onclick=function(){regie(false)};
$('#rg-sim').onclick=function(){manual={};setLive(true,19*60);toast('Simulation','Soirée rejouée depuis l\'ouverture des portes.')};
$('#rg-next').onclick=function(){if(!S.live){setLive(true,20*60+6);return}var i=idxAt(S.T);if(P[i+1])S.T=P[i+1][0];render()};
// appui long sur le logo : régie
var lp;$('#brand').addEventListener('pointerdown',function(){lp=setTimeout(function(){regie(true)},900)});['pointerup','pointerleave'].forEach(function(ev){$('#brand').addEventListener(ev,function(){clearTimeout(lp)})});

/* ---------- direct : vie de la salle ---------- */
setInterval(function(){
 if(!S.live)return;
 var k=Math.floor(Math.random()*OPT.length);OPT[k][2]+=1+Math.floor(Math.random()*2);drawPoll();
 if(Math.random()<.3){var q=Q[Math.floor(Math.random()*Q.length)];if(q.s!=='wait'&&q.s!=='no'){q.v++;drawQ()}}
},2200);

/* ---------- boutons de vitrine ---------- */
$('#sim-on').onclick=function(){setLive(true,20*60+6);toast('En direct','La soirée a commencé : voici l\'appli pendant l\'événement.')};
$('#sim-off').onclick=function(){setLive(false)};
$('#desk-live').onclick=function(){setLive(!S.live,S.live?undefined:20*60+6)};
var dq=$('#qr-desk');if(dq)qr(dq,location.href.split('#')[0],172);

/* ---------- démarrage ---------- */
var h=(location.hash||'').slice(1), qp=new URLSearchParams(location.search);
if(qp.get('direct')==='1')setLive(true,20*60+6); else render();
if(h==='regie')regie(true); else go(ORDER.indexOf(h)>=0?h:'accueil');
if(qp.get('tab'))seg(qp.get('tab'));
})();
