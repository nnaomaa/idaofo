const N=8,COLS=['#e8272e','#ff8a1f','#ffd21f','#2fb344','#2f7bff','#a43cf0'],NAMES=['red','orange','yellow','green','blue','purple'];
const $=i=>document.getElementById(i),sleep=ms=>new Promise(r=>setTimeout(r,ms)),rnd=n=>Math.random()*n|0;
const LV=[
{m:20,mode:'score',t:2500,k:5,sc:2500,L:['##....##','','','','','','','##....##']},
{m:25,mode:'jelly',k:5,sc:3000,L:['#......#','#......#','','..jjjj..','.jjjjjj.','.jjjjjj.','..jjjj..','#......#']},
{m:30,mode:'ing',n:2,k:5,sc:2500,L:['..i..i..','','','','','','#......#','#......#']},
{m:28,mode:'order',k:5,sc:3500,o:[{t:4,n:25},{t:3,n:15}],L:['##....##','#......#','','','','','#......#','##....##']},
{m:28,mode:'jelly+lock',k:5,sc:5000,L:['###..###','##....##','#......#','','jjjjjjjj','jjjjjjjj','jjjjjjjj','l.l..l.l']},
{m:25,mode:'score',t:4500,k:5,sc:4500,L:['.....###','......##','.......#','','','','','m.m..m.m']},
{m:30,mode:'ing',n:3,k:5,sc:3500,L:['#i.i..i#','#......#','','','','','','mm....mm']},
{m:32,mode:'jelly',k:6,sc:6000,L:['##....##','#......#','','','jjjjjjjj','JJJJJJJJ','JJJJJJJJ','c......c']},
{m:30,mode:'ing',n:3,k:5,sc:3000,L:['i......i','','','','','#......#','##....##','###..###']},
{m:30,mode:'jelly',k:5,sc:3500,L:['###..###','##....##','#jjjjjj#','jjjjjjjj','jjjjjjjj','#jjjjjj#','##....##','###..###']},
{m:26,mode:'order',k:6,sc:3500,o:[{t:0,n:25},{s:'s',n:3}],L:['##....##','##....##','','','','','##....##','##....##']},
{m:32,mode:'ing+jelly',n:2,k:5,sc:4000,L:['.n....i.','','','','','jjjjjjjj','jjjjjjjj','']},
{m:32,mode:'ing',n:4,k:5,sc:3500,L:['###i...i','##......','#.......','','','','','m.m.mm.m']},
{m:34,mode:'jelly',k:6,sc:5500,L:['.##..##.','jjjjjjjj','.JJJJJJ.','..jjjj..','','#......#','##....##','###..###']},
{m:30,mode:'order',k:6,sc:4500,o:[{t:2,n:25},{s:'w',n:3},{s:'s',n:3}],L:['#......#','#......#','','','','','c......c','cc....cc']},
{m:28,mode:'ing+lock',n:3,k:6,sc:3500,L:['##i..i##','##....##','##....##','','','','','l.l..l.l']},
{m:30,mode:'score+jelly',t:5500,k:6,sc:5500,L:['##....##','','','jjjjjjjj','JJJJJJJJ','jjjjjjjj','','##....##']},
{m:36,mode:'ing',n:5,k:6,sc:4500,L:['i.i..i.i','','','','','','','c.m..m.c']},
{m:30,mode:'order+lock',k:6,sc:4500,o:[{t:4,n:20},{t:5,n:20},{s:'w',n:2}],L:['','','','','','##....##','###..###','###ll###']},
{m:38,mode:'ing+jelly',n:4,k:6,sc:7000,L:['###nn###','##....##','#jjjjjj#','jjjjjjjj','jjjjjjjj','#jjjjjj#','##....##','###..###']}];
let S={lives:5,ts:0,gold:10,unl:1,stars:[],best:[]};
try{Object.assign(S,JSON.parse(localStorage.getItem('cc')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('cc',JSON.stringify(S))}catch(e){}};
function tick(){const T=12e4;if(S.lives<5){if(!S.ts)S.ts=Date.now();while(S.lives<5&&Date.now()-S.ts>=T){S.lives++;S.ts+=T}if(S.lives>=5)S.ts=0;save()}
 let t='';if(S.lives<5){const s=Math.max(0,Math.ceil((S.ts+T-Date.now())/1000));t=' '+(s/60|0)+':'+String(s%60).padStart(2,'0')}
 $('lives').textContent='❤️ '+S.lives+t;}
setInterval(tick,1000);
function toast(t){const e=$('toast');e.textContent=t;e.style.display='block';setTimeout(()=>e.style.display='none',1800)}
function modal(h){$('modal').innerHTML='<div class="card">'+h+'</div>';$('modal').style.display='flex'}
function closeM(){$('modal').style.display='none'}
function loseLife(){if(S.lives==5)S.ts=Date.now();S.lives=Math.max(0,S.lives-1);save();tick()}
function show(id){$('map').style.display=id=='map'?'':'none';$('game').style.display=id=='game'?'flex':'none'}
function map(){show('map');const p=$('path');p.innerHTML='';for(let i=LV.length-1;i>=0;i--){const open=i<S.unl,d=document.createElement('div'),s=S.stars[i]||0;d.className='node'+(open?'':' lock')+(i==S.unl-1?' cur':'');d.style.marginLeft=Math.sin(i*1.3)*70+'px';d.innerHTML=`<b>${open?i+1:'🔒'}</b><i>${'★'.repeat(s)}${'☆'.repeat(3-s)}</i>`;if(open)d.onclick=()=>pre(i);p.appendChild(d)}$('map').scrollTop=1e5;tick()}
function goal(l){const G={score:`Reach ${l.t} points`,jelly:'Clear all the jelly',lock:'Break all the licorice locks 🔒',ing:`Bring ${l.n} ingredients (🍒🌰) to the bottom`,order:(l.o||[]).map(o=>o.n+'× '+(o.s=='w'?'wrapped candy':o.s=='s'?'striped candy':NAMES[o.t]+' candy')).join(', ')};return l.mode.split('+').map(m=>G[m]).join(' + ')}
let bo={};
function pre(i){if(S.lives<1)return modal(`<h2>Out of lives!</h2><p>A new life arrives every 2 minutes. Check the timer at the top.</p><button onclick="closeM()">Close</button>`);
 modal(`<h2>Level ${i+1}</h2><p>${goal(LV[i])}</p><p>${LV[i].m} moves · Best: ${S.best[i]||0}</p><button class="big" onclick="start(${i})">Play</button><button onclick="closeM()">Close</button>`)}
let g,jel,lvl,moves,score,coll,spawnLeft,orders,busy,chocHit,pendW=[],uid=0,SZ=44,sel=null,st=null;
const isC=x=>x&&x.k=='c',mk=o=>(o.id=++uid,o),fixed=x=>x&&(x.k=='h'||x.k=='m'||x.k=='x'||(x.k=='c'&&x.lock)),canSw=x=>x&&((x.k=='c'&&!x.lock)||x.k=='i');
function cand(r,c){const K=LV[lvl].k;let t;const same=(a,b)=>isC(a)&&isC(b)&&a.t==t&&b.t==t;do t=rnd(K);while((c>1&&same(g[r][c-1],g[r][c-2]))||(r>1&&same(g[r-1][c],g[r-2][c])));return mk({k:'c',t,s:null})}
function start(i){closeM();lvl=i;const L=LV[i];
 SZ=Math.min(54,Math.floor((Math.min(innerWidth,520)-20)/N));document.documentElement.style.setProperty('--S',SZ+'px');
 do{g=[];jel=[];spawnLeft=L.n||0;for(let r=0;r<N;r++){g[r]=[];jel[r]=[];const row=(L.L&&L.L[r])||'........';for(let c=0;c<N;c++){const ch=row[c];jel[r][c]=ch=='j'?1:ch=='J'?2:0;
  if(ch=='#')g[r][c]={k:'h',id:++uid};else if(ch=='m')g[r][c]=mk({k:'m',hp:2});else if(ch=='c')g[r][c]=mk({k:'x'});else if(ch=='i'||ch=='n'){g[r][c]=mk({k:'i',e:ch=='n'?'🌰':'🍒'});spawnLeft--}else{const x=cand(r,c);if(ch=='l')x.lock=true;g[r][c]=x}}}}while(matches().set.size||!hasMove());
 if(bo.bomb){const q0=g.flat().filter(x=>isC(x)&&!x.lock),x=q0[rnd(q0.length)];if(x){x.s='c';x.t=-1}}
 moves=L.m+(bo.mv?3:0);score=0;coll=0;orders=(L.o||[]).map(o=>({...o}));busy=false;pendW=[];sel=null;$('lv').textContent='Level '+(i+1);
 $('board').innerHTML='<div id="jel"></div>';show('game');render();ui()}
function render(){const J=$('jel');J.innerHTML='';for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(!(g[r][c]&&g[r][c].k=='h')){const d=document.createElement('div');d.className='cl'+(jel[r][c]>0?' jl j'+jel[r][c]:'');d.style.transform=`translate(${c*SZ}px,${r*SZ}px)`;J.appendChild(d)}
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){const x=g[r][c];if(!x||x.k=='h')continue;if(!x.el){const el=document.createElement('div');el.className='t';el.innerHTML='<div class="b"></div>';x.el=el;el.style.transform=`translate(${c*SZ}px,${(r-(x.sp||0))*SZ}px)`;$('board').appendChild(el);void el.offsetWidth;x.sp=0}
  x.el.style.transform=`translate(${c*SZ}px,${r*SZ}px)`;const b=x.el.firstChild;b.className='b '+(x.k=='c'?`c${x.t<0?'x':x.t} ${x.s&&x.s!='c'?'s'+x.s:''} ${x.w?'wf':''}`:x.k=='m'?'mer h'+x.hp:x.k=='x'?'choc':'ing');b.textContent=x.k=='i'?(x.e||'🍒'):'';x.el.classList.toggle('lk',!!x.lock);x.el.classList.toggle('sel',!!(sel&&sel[0]==r&&sel[1]==c))}ui()}
function ui(){const l=LV[lvl],M=l.mode,P=[];$('mv').textContent=moves;$('sc').textContent=score;
 if(M.includes('score'))P.push(`🎯 ${Math.min(score,l.t)}/${l.t}`);if(M.includes('jelly'))P.push('🍬 '+jel.flat().filter(v=>v>0).length);if(M.includes('ing'))P.push(`🍒 ${coll}/${l.n}`);
 if(M.includes('lock'))P.push('🔒 '+g.flat().filter(x=>isC(x)&&x.lock).length);if(M.includes('order'))P.push(orders.map(o=>(o.s=='w'?'🎁':o.s=='s'?'🍭':`<span style="color:${COLS[o.t]}">●</span>`)+' '+Math.max(0,o.n)).join(' '));
 $('goal').innerHTML=P.join(' &nbsp; ');$('fill').style.width=Math.min(100,score/(l.sc*1.9)*100)+'%'}
function complete(){const l=LV[lvl],M=l.mode;return(!M.includes('score')||score>=l.t)&&(!M.includes('jelly')||!jel.flat().some(v=>v>0))&&(!M.includes('ing')||coll>=l.n)&&(!M.includes('order')||orders.every(o=>o.n<=0))&&(!M.includes('lock')||!g.flat().some(x=>isC(x)&&x.lock))}
function matches(pref=[]){const runs=[],set=new Set();
 for(let d=0;d<2;d++)for(let a=0;a<N;a++){let b=0;while(b<N){const x=d?g[b][a]:g[a][b];if(!isC(x)||x.s=='c'||x.w){b++;continue}let e=b+1;for(;e<N;e++){const y=d?g[e][a]:g[a][e];if(!(isC(y)&&y.s!='c'&&!y.w&&y.t==x.t))break}
  if(e-b>=3){const cells=[];for(let i=b;i<e;i++)cells.push(d?[i,a]:[a,i]);runs.push({d,cells});cells.forEach(q=>set.add(q+''))}b=e}}
 const m={},cnt={};runs.forEach(R=>R.cells.forEach(q=>cnt[q+'']=(cnt[q+'']||0)+1));for(const k in cnt)if(cnt[k]>1)m[k]='w';
 for(const R of runs){const L=R.cells.length,pk=R.cells.find(q=>pref.some(p=>p+''==q+''))||R.cells[L>>1];if(L>=5)m[pk+'']='c';else if(L==4&&!R.cells.some(q=>m[q+'']))m[pk+'']=R.d?'h':'v'}
 return{set,make:Object.entries(m).map(([k,s])=>[...k.split(',').map(Number),s])}}
function expand(set){const q=[...set];while(q.length){const[r,c]=q.pop().split(',').map(Number),x=g[r][c];if(!isC(x)||!x.s)continue;const add=[];blast=1;if(x.s=='h'||x.s=='v')beams.push([r,c,x.s]);
 if(x.s=='h')for(let i=0;i<N;i++)add.push([r,i]);else if(x.s=='v')for(let i=0;i<N;i++)add.push([i,c]);
 else if(x.s=='w'){if(!x.w)x.w=1;for(let a=-1;a<2;a++)for(let b=-1;b<2;b++)add.push([r+a,c+b])}
 else{const cn={};g.flat().forEach(y=>isC(y)&&y.t>=0&&(cn[y.t]=(cn[y.t]||0)+1));const t=+Object.keys(cn).sort((a,b)=>cn[b]-cn[a])[0];for(let i=0;i<N;i++)for(let j=0;j<N;j++)if(isC(g[i][j])&&g[i][j].t===t)add.push([i,j])}
 for(const[a,b]of add){if(a<0||b<0||a>=N||b>=N)continue;const k=a+','+b;if(!set.has(k)){set.add(k);q.push(k)}}}}
function drawBeams(){const B=$('board');for(const[r,c,d]of beams){const e=document.createElement('div');e.className='beam';e.style.cssText=d=='h'?`left:0;top:${r*SZ+SZ*.3}px;width:${N*SZ}px;height:${SZ*.4}px`:`top:0;left:${c*SZ+SZ*.3}px;height:${N*SZ}px;width:${SZ*.4}px`;B.appendChild(e);setTimeout(()=>e.remove(),450)}beams=[]}
function kill(r,c){const x=g[r][c];g[r][c]=null;if(x&&x.el){const e=x.el;e.classList.add('pop');setTimeout(()=>e.remove(),300)}}
function count(x){if(x.s=='h'||x.s=='v')orders.forEach(o=>o.s=='s'&&o.n--);if(x.s=='w')orders.forEach(o=>o.s=='w'&&o.n--);orders.forEach(o=>o.t===x.t&&o.n--)}
function clearSet(clr,mkS,chain){let n=0;const rem=[],hm=new Set(),P=k=>k.split(',').map(Number);
 for(const k of clr){const[r,c]=P(k),x=g[r][c];if(!x)continue;if(x.k=='m')hm.add(k);else if(x.k=='x'){kill(r,c);chocHit=true}else if(x.k=='c'){if(x.lock)x.lock=false;else if(x.w==1){}else{n++;rem.push([r,c]);count(x);kill(r,c)}}}
 for(const k of[...clr,...mkS]){const[r,c]=P(k);if(jel[r][c]>0)jel[r][c]--}
 for(const[r,c]of rem)for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const y=g[r+a]&&g[r+a][c+b];if(!y)continue;const k=(r+a)+','+(c+b);if(y.k=='m')hm.add(k);else if(y.k=='x'){kill(r+a,c+b);chocHit=true}}
 for(const k of hm){const[r,c]=P(k),y=g[r][c];if(y&&--y.hp<=0){kill(r,c);score+=100}}score+=n*60*chain}
async function doClear(set,make=[],chain=1){const mkS=new Set(make.map(m=>m[0]+','+m[1])),clr=new Set([...set].filter(k=>!mkS.has(k)));if(!set.nc)expand(clr);else blast=1;clearSet(clr,mkS,chain);const hadB=beams.length;drawBeams();if(blast){SFX.boom();blast=0}else SFX.pop(chain);if(make.length)SFX.make();
 for(const[r,c,s]of make){const x=g[r][c];if(x&&!clr.has(r+','+c)){x.s=s;if(s=='c')x.t=-1}}render();await sleep(hadB?420:260)}
function gravity(){let again;do{again=0;for(let c=0;c<N;c++){let w=N-1;for(let r=N-1;r>=0;r--){const x=g[r][c];if(!x)continue;if(fixed(x)){w=r-1;continue}if(r!=w){g[w][c]=x;g[r][c]=null}w--}
 let s0=0;while(s0<N&&g[s0][c]&&g[s0][c].k=='h')s0++;let f=s0;while(f<N&&!fixed(g[f][c]))f++;let nn=0;for(let r=s0;r<f;r++)if(!g[r][c])nn++;for(let r=s0;r<f;r++)if(!g[r][c]){const x=spawnLeft>0&&Math.random()<.15?(spawnLeft--,mk({k:'i'})):cand(r,c);x.sp=nn;g[r][c]=x}
 const b=g[N-1][c];if(b&&b.k=='i'){kill(N-1,c);coll++;score+=500;SFX.coll();again=1}}}while(again)}
async function settle(){let chain=1;while(true){gravity();render();await sleep(330);
 const ws=[];g.forEach((row,r)=>row.forEach((x,c)=>isC(x)&&x.w==1&&ws.push(r+','+c)));if(ws.length){await sleep(900);ws.forEach(k=>{const[r,c]=k.split(',');g[r][c].w=2});chain++;await doClear(new Set(ws),[],chain);continue}
 const m=matches();if(!m.set.size)break;chain++;if(chain>2)banner(['','','','Sweet!','Delicious!','Divine!','Sugar Crush!'][Math.min(chain,6)]);await doClear(m.set,m.make,chain)}}
function combo(p1,p2){const X=g[p1[0]][p1[1]],Y=g[p2[0]][p2[1]],A=X.s,B=Y.s,set=new Set([p1+'',p2+'']),add=(r,c)=>{if(r>=0&&r<N&&c>=0&&c<N)set.add(r+','+c)},[r,c]=p2;
 if(A=='c'&&B=='c')for(let i=0;i<N;i++)for(let j=0;j<N;j++)add(i,j);
 else if(A=='c'||B=='c'){const o=A=='c'?Y:X;for(let i=0;i<N;i++)for(let j=0;j<N;j++){const y=g[i][j];if(isC(y)&&y.t===o.t){if(o.s)y.s=o.s=='w'?'w':(Math.random()<.5?'h':'v');add(i,j)}}}
 else if(A!='w'&&B!='w'){for(let i=0;i<N;i++){add(r,i);add(i,c)}set.nc=1}
 else if(A=='w'&&B=='w'){for(let a=-2;a<3;a++)for(let b=-2;b<3;b++)add(r+a,c+b)}
 else{for(let i=0;i<N;i++)for(let d=-1;d<2;d++){add(r+d,i);add(i,c+d)}}
 if(A=='c'||B=='c'){X.s=null;Y.s=null;const o=A=='c'?Y:X;if(!o.s&&o.k=='c')o.s=null}else{X.s=null;Y.s=null}return set}
function hasMove(){for(let r=0;r<N;r++)for(let c=0;c<N;c++)for(const[a,b]of[[0,1],[1,0]]){const r2=r+a,c2=c+b;if(r2>=N||c2>=N)continue;const x=g[r][c],y=g[r2][c2];if(!canSw(x)||!canSw(y))continue;
 if(isC(x)&&isC(y)&&((x.s&&y.s)||x.s=='c'||y.s=='c'))return true;g[r][c]=y;g[r2][c2]=x;const m=matches().set.size;g[r][c]=x;g[r2][c2]=y;if(m)return true}return false}
function shuffle(){const cs=g.flat().filter(x=>isC(x)&&!x.lock&&!x.s),ts=cs.map(x=>x.t);for(let i=0;i<40;i++){ts.sort(()=>Math.random()-.5);cs.forEach((x,j)=>x.t=ts[j]);if(!matches().set.size&&hasMove())break}}
function grow(){const cs=[];for(let r=0;r<N;r++)for(let c=0;c<N;c++)if(g[r][c]&&g[r][c].k=='x')for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const y=g[r+a]&&g[r+a][c+b];if(y&&isC(y)&&!y.lock)cs.push([r+a,c+b])}
 if(!cs.length)return;const[r,c]=cs[rnd(cs.length)];kill(r,c);g[r][c]=mk({k:'x'})}
async function trySwap(a,b,c,d){if(busy||c<0||d<0||c>=N||d>=N)return;const x=g[a][b],y=g[c][d];if(!canSw(x)||!canSw(y))return;busy=true;SFX.swap();g[a][b]=y;g[c][d]=x;render();await sleep(230);
 const isCombo=isC(x)&&isC(y)&&((x.s&&y.s)||x.s=='c'||y.s=='c');let m;
 if(!isCombo){m=matches([[a,b],[c,d]]);if(!m.set.size){SFX.bad();g[a][b]=x;g[c][d]=y;render();await sleep(230);busy=false;return}}
 moves--;chocHit=false;if(isCombo){const s=combo([a,b],[c,d]);render();await sleep(250);await doClear(s,[],2)}else await doClear(m.set,m.make,1);
 await settle();if(!chocHit&&g.flat().some(z=>z&&z.k=='x')){grow();render();await sleep(300)}ui();
 if(complete())return finish();if(moves<=0)return fail();if(!hasMove()){toast('No moves — shuffling!');shuffle();render();await sleep(400)}busy=false}
function banner(t){const e=$('ban');e.textContent=t;e.className='';void e.offsetWidth;e.className='on'}
async function finish(){busy=true;const l=LV[lvl];if(moves>0){banner('Sugar Crush!');await sleep(900);
 let cv=0;for(let n=moves;n>0;n--){const cs=g.flat().filter(x=>isC(x)&&!x.lock&&!x.s);if(cs.length&&cv++<12)cs[rnd(cs.length)].s=Math.random()<.5?'h':'v';moves--;score+=300;snd(500+rnd(500),.08,'square',.05);render();await sleep(cv>12?30:150)}
 for(let i=0;i<40;i++){const k=[];g.forEach((row,r)=>row.forEach((x,c)=>isC(x)&&x.s&&!x.w&&k.push(r+','+c)));if(!k.length)break;await doClear(new Set([k[rnd(k.length)]]),[],2);await settle()}}
 ui();const s=1+(score>=l.sc*1.4)+(score>=l.sc*1.9);S.stars[lvl]=Math.max(S.stars[lvl]||0,s);S.best[lvl]=Math.max(S.best[lvl]||0,score);S.unl=Math.min(LV.length,Math.max(S.unl,lvl+2));save();tick();SFX.win();banner(['','Tasty!','Divine!','Sugar Crush!'][s]);
 modal(`<h2>${['','Tasty!','Divine!','Sugar Crush!'][s]}</h2><div style="font-size:34px;color:#ffb300">${'★'.repeat(s)}${'☆'.repeat(3-s)}</div><p>Score ${score}</p>${lvl+1<LV.length?`<button class="big" onclick="closeM();pre(${lvl+1})">Next level</button>`:''}<button onclick="closeM();map()">Map</button>`)}
function fail(){busy=true;SFX.lose();loseLife();modal(`<h2>Out of moves!</h2><p>You lost a life ❤️</p><button class="big" onclick="closeM();map()">Back to map</button>`)}
function give(){closeM();loseLife();map()}
function quit(){if(busy&&$('modal').style.display=='flex')return;modal(`<h2>Quit level?</h2><p>You'll lose a life.</p><button class="big" onclick="closeM()">Keep playing</button><button onclick="give()">Quit</button>`)}
const bd=$('board'),pos=e=>{const q=bd.getBoundingClientRect();return[Math.min(N-1,Math.max(0,Math.floor((e.clientY-q.top)/SZ))),Math.min(N-1,Math.max(0,Math.floor((e.clientX-q.left)/SZ)))]};
bd.onpointerdown=e=>{if(!busy)st={x:e.clientX,y:e.clientY,p:pos(e)}};
bd.onpointermove=e=>{if(!st||busy)return;const dx=e.clientX-st.x,dy=e.clientY-st.y;if(Math.hypot(dx,dy)>SZ*.4){const[r,c]=st.p,v=Math.abs(dy)>Math.abs(dx);st=null;sel=null;trySwap(r,c,r+(v?Math.sign(dy):0),c+(v?0:Math.sign(dx)))}};
bd.onpointerup=e=>{if(!st||busy){st=null;return}const[r,c]=st.p;st=null;if(sel&&Math.abs(sel[0]-r)+Math.abs(sel[1]-c)==1){const s=sel;sel=null;trySwap(s[0],s[1],r,c)}else sel=[r,c];render()};
let beams=[],AC,blast=0,mute=0,mus=1,mi=0;
function snd(f,d=.12,type='sine',v=.15,slide=0,delay=0){if(mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state=='suspended')AC.resume();const t=AC.currentTime+delay,o=AC.createOscillator(),G=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);G.gain.setValueAtTime(v,t);G.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(G);G.connect(AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
const NT=[523,587,659,784,880,1047,1175,1319],MEL=[523,659,784,659,587,740,880,740,523,659,784,1047,988,784,659,587];
const SFX={swap:()=>snd(330,.09,'triangle',.12,220),bad:()=>snd(170,.2,'sawtooth',.09,-70),pop:c=>{for(let i=0;i<3;i++)snd(NT[Math.min(c-1+i,7)],.14,'sine',.14,0,i*.06)},make:()=>snd(700,.25,'square',.06,700),
 boom:()=>{snd(220,.4,'sawtooth',.12,-170);snd(1200,.3,'square',.05,-900,.05)},coll:()=>{snd(880,.12,'sine',.15);snd(1320,.25,'sine',.15,0,.1)},win:()=>NT.forEach((n,i)=>snd(n,.25,'triangle',.12,0,i*.1)),lose:()=>[400,330,260,200].forEach((n,i)=>snd(n,.3,'sawtooth',.08,0,i*.15))};
function tgl(k){k?mus^=1:mute^=1;$('s1').textContent=mute?'🔇':'🔊';$('s2').textContent=mus?'🎵':'🚫';}
setInterval(()=>{if(mus&&!mute&&$('game').style.display!='none'){snd(MEL[mi%16]/2,.25,'triangle',.035);if(mi%2==0)snd(MEL[mi%16]/4,.5,'sine',.035);mi++}},300);
tick();map();
