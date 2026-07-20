/* ===================================================================
   planet.js — the living "ice planet" that represents Ace and You.
   A self-contained particle/canvas engine: a fractured, glowing sphere
   that breathes when idle and flares with word-synced pulses while
   its owner speaks. Exposes a tiny public API (pulse / setSpeaking /
   setDim / stop / start) that app.js drives from real speech events.
   =================================================================== */
(function(){
  function createPlanet(canvas, wrap, pal, opts){
    opts = opts || {};
    const ctx = canvas.getContext('2d');
    let W, H, DPR, PLANET_R = 100, built = false, running = true;
    const params = { density:3000, crackSeeds:12, holeCount:50, fragCount:34, lift:40, glow:100, spinSpeed:1 };
    let camera = { rotX:0.18, rotY:0.4, zoom:1, dist:700 };
    let surfaceParticles = [], fragmentParticles = [], crackSegments = [], holeCenters = [], fragCenters = [];

    function rotatePoint(x,y,z, rx, ry){ const cosx=Math.cos(rx),sinx=Math.sin(rx); const y1=y*cosx-z*sinx,z1=y*sinx+z*cosx; const cosy=Math.cos(ry),siny=Math.sin(ry); return [x*cosy+z1*siny, y1, -x*siny+z1*cosy]; }
    function project(px,py,pz, cx,cy, distance, zoom){ const scale=(distance/(distance-pz))*zoom; return { x:cx+px*scale, y:cy+py*scale, scale }; }
    function angDist(a,b){ let d=a-b; while(d>Math.PI)d-=2*Math.PI; while(d<-Math.PI)d+=2*Math.PI; return d; }
    function segDist(theta,phi,s){ const dx1=angDist(theta,s.t1),dy1=phi-s.p1; const ex=angDist(s.t2,s.t1),ey=s.p2-s.p1; const len2=ex*ex+ey*ey||1e-6; let tp=(dx1*ex+dy1*ey)/len2; tp=Math.max(0,Math.min(1,tp)); return Math.hypot(dx1-ex*tp, dy1-ey*tp); }
    function crackWalk(theta,phi,angle,steps,depth,segs){ for(let i=0;i<steps;i++){ const nt=theta+Math.cos(angle)*0.035, np=phi+Math.sin(angle)*0.035; segs.push({t1:theta,p1:phi,t2:nt,p2:np}); theta=nt; phi=np; angle+=(Math.random()-0.5)*0.5; if(Math.abs(phi)>Math.PI*0.48) break; if(depth<2&&Math.random()<0.05&&steps-i>8) crackWalk(theta,phi,angle+(Math.random()<0.5?1:-1)*(0.7+Math.random()*0.6),Math.floor((steps-i)*0.5),depth+1,segs); } }
    function buildCracks(){ const segs=[]; const n=Math.floor(params.crackSeeds); for(let i=0;i<n;i++) crackWalk((Math.random()*2-1)*Math.PI,(Math.random()*2-1)*Math.PI*0.4,Math.random()*Math.PI*2,40+Math.floor(Math.random()*40),0,segs); crackSegments=segs; }
    function buildHoles(){ const n=Math.floor(params.holeCount); const a=[]; for(let i=0;i<n;i++) a.push({t:(Math.random()*2-1)*Math.PI,p:(Math.random()*2-1)*Math.PI*0.42,r:0.02+Math.random()*0.035}); holeCenters=a; }
    function buildFragCenters(){ const n=Math.floor(params.fragCount); const a=[]; for(let i=0;i<n;i++) a.push({t:(Math.random()*2-1)*Math.PI,p:(Math.random()*2-1)*Math.PI*0.4,r:0.045+Math.random()*0.05,seed:Math.random()*1000}); fragCenters=a; }
    function fibonacciDir(i,n){ const offset=2/n, incr=Math.PI*(3-Math.sqrt(5)); const y=((i*offset)-1)+offset/2; const r=Math.sqrt(Math.max(0,1-y*y)); const p=i*incr; return { x:Math.cos(p)*r, y, z:Math.sin(p)*r }; }
    function buildSurface(){
      const n=Math.floor(params.density); const surf=[]; const frags=[];
      for(let i=0;i<n;i++){
        const d=fibonacciDir(i,n); const theta=Math.atan2(d.z,d.x), phi=Math.asin(Math.max(-1,Math.min(1,d.y)));
        let crackD=Infinity; for(let s=0;s<crackSegments.length;s++){ const dd=segDist(theta,phi,crackSegments[s]); if(dd<crackD)crackD=dd; if(crackD<0.01)break; }
        if(crackD<0.011) continue; const crackGlow=crackD<0.028?(1-crackD/0.028):0;
        let inHole=false; for(const h of holeCenters){ if(Math.hypot(angDist(theta,h.t),phi-h.p)<h.r){ inHole=true; break; } }
        if(inHole&&Math.random()<0.9) continue;
        let frag=null; for(const f of fragCenters){ const dd=Math.hypot(angDist(theta,f.t),phi-f.p); if(dd<f.r){ frag={f,dd}; break; } }
        const seed=Math.random()*1000, jitter=0.4+Math.random()*0.8;
        if(frag) frags.push({ dir:d, seed, jitter, edge:frag.dd/frag.f.r }); else surf.push({ dir:d, seed, jitter, crackGlow });
      }
      surfaceParticles=surf; fragmentParticles=frags;
    }
    function rebuildAll(){ buildCracks(); buildHoles(); buildFragCenters(); buildSurface(); }
    function resize(){
      DPR=Math.min(window.devicePixelRatio||1,2); const rect=wrap.getBoundingClientRect();
      W=Math.max(70,rect.width); H=Math.max(70,rect.height);
      canvas.width=W*DPR; canvas.height=H*DPR; canvas.style.width=W+'px'; canvas.style.height=H+'px'; ctx.setTransform(DPR,0,0,DPR,0,0);
      PLANET_R=Math.max(40, Math.min(180, Math.min(W,H)*0.36)); camera.dist=PLANET_R*3.5; params.lift=PLANET_R*0.18;
      if(!built){ params.density=Math.round(Math.max(1200, Math.min(4200, Math.min(W,H)*9))); built=true; rebuildAll(); }
    }
    let pulses=[], ringWaves=[], isSpeaking=false, idlePhase=Math.random()*Math.PI*2, synth=null;
    function addPulse(s){ pulses.push({start:performance.now(),strength:s||1}); ringWaves.push({start:performance.now()}); if(ringWaves.length>8) ringWaves.shift(); }
    function energyNow(){ const now=performance.now(); pulses=pulses.filter(p=>now-p.start<420); let e=0; for(const p of pulses){ const age=(now-p.start)/420; e+=Math.max(0,1-age)*p.strength; } return Math.min(2.2,e); }
    if(opts.interactive !== false){
      let dragging=false,lx=0,ly=0;
      canvas.addEventListener('mousedown', e=>{ dragging=true; lx=e.clientX; ly=e.clientY; });
      window.addEventListener('mouseup', ()=> dragging=false);
      window.addEventListener('mousemove', e=>{ if(!dragging)return; camera.rotY+=(e.clientX-lx)*0.005; camera.rotX+=(e.clientY-ly)*0.005; camera.rotX=Math.max(-1.3,Math.min(1.3,camera.rotX)); lx=e.clientX; ly=e.clientY; });
      canvas.addEventListener('wheel', e=>{ e.preventDefault(); camera.zoom*=(1-e.deltaY*0.001); camera.zoom=Math.max(0.5,Math.min(2.2,camera.zoom)); }, {passive:false});
      let tl=null;
      canvas.addEventListener('touchstart', e=>{ if(e.touches.length===1) tl={x:e.touches[0].clientX,y:e.touches[0].clientY}; });
      canvas.addEventListener('touchmove', e=>{ if(e.touches.length===1&&tl){ camera.rotY+=(e.touches[0].clientX-tl.x)*0.005; camera.rotX+=(e.touches[0].clientY-tl.y)*0.005; camera.rotX=Math.max(-1.3,Math.min(1.3,camera.rotX)); tl={x:e.touches[0].clientX,y:e.touches[0].clientY}; } e.preventDefault(); }, {passive:false});
    }
    const LIGHT=(()=>{ const l=[-0.5,-0.5,0.6]; const m=Math.hypot(l[0],l[1],l[2]); return l.map(v=>v/m); })();
    let t=0, lastFrame=performance.now();
    function draw(){
      if(!running) return;
      const now=performance.now(); const dt=Math.min(50,now-lastFrame); lastFrame=now; t+=dt*0.001;
      if(!W){ requestAnimationFrame(draw); return; }
      ctx.clearRect(0,0,W,H);
      const cx=W/2, cy=H/2, distance=camera.dist, zoom=camera.zoom;
      const rx=camera.rotX, ry=camera.rotY + t*params.spinSpeed*0.5;
      const energy=energyNow();
      const idleBreath = isSpeaking ? 0 : (0.5+0.5*Math.sin(t*0.8+idlePhase))*0.15;
      const glowAmt=(params.glow/100)*(1+energy*0.7+idleBreath); const lift=params.lift*(1+energy*0.35);
      const c0=project(0,0,0, cx,cy, distance, zoom); const coreR=PLANET_R*(1.15+energy*0.12)*c0.scale;
      const cg=ctx.createRadialGradient(c0.x,c0.y,0, c0.x,c0.y, coreR);
      cg.addColorStop(0, `rgba(${pal.coreA},${Math.min(0.85,0.55*glowAmt)})`);
      cg.addColorStop(0.6, `rgba(${pal.coreB},${Math.min(0.4,0.22*glowAmt)})`);
      cg.addColorStop(1, `rgba(${pal.coreC},0)`);
      ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(c0.x,c0.y,coreR,0,Math.PI*2); ctx.fill();
      const nowMs=performance.now();
      for(const rw of ringWaves){ const age=(nowMs-rw.start)/900; if(age>1) continue; const rr=coreR*(1+age*2.6), al=(1-age)*0.35; ctx.strokeStyle=`rgba(${pal.ring},${al})`; ctx.lineWidth=1.4; ctx.beginPath(); ctx.arc(c0.x,c0.y,rr,0,Math.PI*2); ctx.stroke(); }
      ctx.restore();
      const drawn=[];
      for(const p of surfaceParticles){
        const [X,Y,Z]=rotatePoint(p.dir.x*PLANET_R,p.dir.y*PLANET_R,p.dir.z*PLANET_R, rx, ry);
        if(Z<-PLANET_R*0.15) continue; const pr=project(X,Y,Z, cx,cy, distance, zoom);
        const light=Math.max(0,(X/PLANET_R)*LIGHT[0]+(Y/PLANET_R)*LIGHT[1]+(Z/PLANET_R)*LIGHT[2]);
        const tw=0.85+0.15*Math.sin(t*(2+energy*4)+p.seed);
        drawn.push({ pr, Z, light, crackGlow:p.crackGlow, jitter:p.jitter, tw });
      }
      drawn.sort((a,b)=>a.Z-b.Z);
      for(const d of drawn){
        const size=Math.max(0.5,1.5*d.jitter*d.pr.scale);
        if(d.crackGlow>0.05){ const col=pal.crack(d.crackGlow); const a=0.5+0.5*d.crackGlow; ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},${a*d.tw})`; ctx.beginPath(); ctx.arc(d.pr.x,d.pr.y,size*1.3,0,Math.PI*2); ctx.fill(); ctx.restore(); }
        else { const col=pal.rock(0.15+0.85*d.light); ctx.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},${0.85*d.tw})`; ctx.beginPath(); ctx.arc(d.pr.x,d.pr.y,size,0,Math.PI*2); ctx.fill(); }
      }
      const fd=[];
      for(const p of fragmentParticles){
        const R2=PLANET_R + lift*(1-p.edge*0.4) + Math.sin(t*6+p.seed)*energy*3;
        const [X,Y,Z]=rotatePoint(p.dir.x*R2,p.dir.y*R2,p.dir.z*R2, rx, ry);
        if(Z<-PLANET_R*0.2) continue; const pr=project(X,Y,Z, cx,cy, distance, zoom);
        const light=Math.max(0,(X/R2)*LIGHT[0]+(Y/R2)*LIGHT[1]+(Z/R2)*LIGHT[2]);
        fd.push({ pr, Z, light, jitter:p.jitter, edge:p.edge });
      }
      fd.sort((a,b)=>a.Z-b.Z);
      for(const f of fd){
        const size=Math.max(0.6,1.7*f.jitter*f.pr.scale); const lit=0.25+0.75*f.light, rim=1-f.edge;
        if(rim>0.6){ ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.fillStyle=`rgba(${pal.rim},${0.25*rim})`; ctx.beginPath(); ctx.arc(f.pr.x,f.pr.y,size*3,0,Math.PI*2); ctx.fill(); ctx.restore(); }
        const col=pal.frag(lit,rim); ctx.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},0.92)`; ctx.beginPath(); ctx.arc(f.pr.x,f.pr.y,size,0,Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    resize();
    if('ResizeObserver' in window){ new ResizeObserver(resize).observe(wrap); }
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
    return {
      pulse(s){ addPulse(s||1); },
      setSpeaking(on){ isSpeaking=!!on; if(on){ if(!synth) synth=setInterval(()=>addPulse(0.7+Math.random()*0.6),150); } else if(synth){ clearInterval(synth); synth=null; } },
      setDim(on){ wrap.classList.toggle('listening', !!on); },
      stop(){ running=false; },
      start(){ if(!running){ running=true; lastFrame=performance.now(); requestAnimationFrame(draw); } }
    };
  }

  /* two ice palettes: Ace (deeper cyan-blue) and You (paler, whiter ice) */
  const ICE_ACE = { coreA:'150,230,255', coreB:'80,175,255', coreC:'50,120,210', ring:'175,235,255', rim:'175,235,255',
    crack:(g)=>[150+90*g,220+30*g,255], rock:(l)=>[28+l*165|0,45+l*180|0,72+l*183|0], frag:(l,r)=>[40+l*160+r*30|0,62+l*173+r*30|0,92+l*163+r*20|0] };
  const ICE_YOU = { coreA:'205,240,255', coreB:'150,205,255', coreC:'110,175,240', ring:'215,245,255', rim:'215,245,255',
    crack:(g)=>[195+50*g,235+15*g,255], rock:(l)=>[45+l*160|0,68+l*172|0,100+l*172|0], frag:(l,r)=>[70+l*150+r*30|0,98+l*158+r*30|0,132+l*138+r*20|0] };

  function inst(cid, wid, pal, opts){ const c=document.getElementById(cid), w=document.getElementById(wid); return (c&&w)?createPlanet(c,w,pal,opts):null; }
  window.PLANETS = {
    gateAce: inst('gatePlanetAce','gateWrapAce', ICE_ACE, {interactive:false}),
    gateYou: inst('gatePlanetYou','gateWrapYou', ICE_YOU, {interactive:false}),
    ace:     inst('planetAce','wrapAce', ICE_ACE, {}),
    you:     inst('planetYou','wrapYou', ICE_YOU, {})
  };
})();
