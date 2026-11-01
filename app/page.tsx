"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowDown, ArrowRight, Award, Binary, BrainCircuit, Bug, CheckCircle2, ChevronRight, Code2, Ghost, LockKeyhole, Menu, Moon, Radio, RotateCcw, ShieldAlert, Skull, Sparkles, Terminal, Trophy, X, Zap } from "lucide-react";

type Tab = "home" | "escape" | "quiz" | "fortune" | "leaderboard";
type Player = { name: string; score: number; date: string };
const quiz = [
  { q: "Which practice best protects an account from password guessing?", a: ["Use your birthday", "Enable multi-factor authentication", "Reuse a long password", "Share passwords with a friend"], correct: 1, explain: "MFA adds another verification factor beyond the password." },
  { q: "What does HTTPS primarily provide?", a: ["Faster downloads", "Encrypted communication with the website", "Unlimited storage", "Virus removal"], correct: 1, explain: "HTTPS uses TLS to protect data in transit and authenticate the server." },
  { q: "Which one is a social engineering attack?", a: ["Phishing email", "Disk defragmentation", "Code compilation", "Data compression"], correct: 0, explain: "Phishing tricks people into revealing information or taking unsafe actions." },
  { q: "What is the binary representation of decimal 5?", a: ["101", "110", "111", "100"], correct: 0, explain: "4 + 1 = 5, represented as 101 in base two." },
  { q: "Which structure follows LIFO order?", a: ["Queue", "Tree", "Stack", "Graph"], correct: 2, explain: "A stack removes the most recently added item first." }
];
const missions = [
  { title: "The Binary Crypt", prompt: "Decode this binary message: 01000011 01010011", answer: "CS", hint: "Convert each 8-bit group to an ASCII character.", points: 100 },
  { title: "Phantom Phishing", prompt: "A message says: “Your account expires in 10 minutes. Click this unknown link and enter your password.” What is the threat?", answer: "phishing", hint: "It uses urgency and a suspicious link to steal credentials.", points: 150 },
  { title: "The Firewall Gate", prompt: "A network filter allows trusted traffic and blocks unauthorized traffic. Name this security control.", answer: "firewall", hint: "It is named after a barrier that slows or stops fire.", points: 150 }
];
const fortunes = [
  "A mysterious bug will reveal itself just before your deadline. Keep your commits small.",
  "The stars align in your favor: a clean build is approaching. Remember to test on mobile.",
  "Beware the tempting shortcut. The function you copy today may haunt your code tomorrow.",
  "A new collaboration is near. Two minds, one repository, fewer merge conflicts.",
  "Your next breakthrough hides in the error log. Read the stack trace before summoning help."
];
const initialPlayers: Player[] = [
  { name: "BYTE_WITCH", score: 850, date: "Demo score" },
  { name: "NULL_PHANTOM", score: 720, date: "Demo score" },
  { name: "GHOST_IN_SHELL", score: 610, date: "Demo score" }
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [score, setScore] = useState(0);
  const [missionIndex, setMissionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [missionFeedback, setMissionFeedback] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [fortune, setFortune] = useState("");
  const [fortuneName, setFortuneName] = useState("");
  const [fortuneCount, setFortuneCount] = useState(0);
  const [savedNotice, setSavedNotice] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cyberween-players");
      if (saved) setPlayers([...initialPlayers, ...JSON.parse(saved) as Player[]]);
    } catch { /* Ignore invalid local storage data. */ }
  }, []);

  const sortedPlayers = useMemo(() => [...players].sort((a, b) => b.score - a.score).slice(0, 10), [players]);
  const currentMission = missions[missionIndex];

  function addPoints(points: number) {
    setScore(s => s + points);
  }
  function finishRun(extra = 0) {
    const name = playerName.trim() || "ANONYMOUS_HACKER";
    const entry = { name: name.toUpperCase().slice(0, 18), score: score + extra, date: new Date().toLocaleDateString() };
    const next = [...players.filter(p => p.date !== "Demo score"), entry];
    setPlayers([...initialPlayers, ...next]);
    try { localStorage.setItem("cyberween-players", JSON.stringify(next)); setSavedNotice("SCORE SAVED ON THIS DEVICE."); } catch { setSavedNotice("Could not save: browser storage is unavailable."); }
  }
  function submitMission() {
    if (!answer.trim()) { setMissionFeedback("Enter your answer first."); return; }
    const normalized = answer.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const expected = currentMission.answer.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normalized === expected) {
      addPoints(currentMission.points);
      setMissionFeedback(`ACCESS GRANTED +${currentMission.points} XP`);
      setAnswer("");
      if (missionIndex < missions.length - 1) setMissionIndex(i => i + 1);
      else { finishRun(currentMission.points); setMissionFeedback(`ALL ROOMS CLEARED. +${currentMission.points} XP — run complete!`); }
    } else setMissionFeedback("ACCESS DENIED. Try again or reveal the hint.");
  }
  function chooseQuiz(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === quiz[quizIndex].correct) { setQuizScore(s => s + 100); addPoints(100); }
  }
  function nextQuiz() {
    if (quizIndex === quiz.length - 1) { setQuizDone(true); finishRun(); }
    else { setQuizIndex(i => i + 1); setSelected(null); }
  }
  function resetQuiz() { setQuizIndex(0); setSelected(null); setQuizScore(0); setQuizDone(false); }
  function makeFortune() {
    const n = fortuneName.trim() || "Mysterious Coder";
    const index = (n.length + fortuneCount * 3) % fortunes.length;
    setFortune(`${n}, ${fortunes[index]}`);
    setFortuneCount(c => c + 1);
  }

  const navItems: { id: Tab; label: string; icon: typeof Ghost }[] = [
    { id: "home", label: "Home", icon: Moon }, { id: "escape", label: "Escape Room", icon: LockKeyhole },
    { id: "quiz", label: "Quiz Arena", icon: BrainCircuit }, { id: "fortune", label: "AI Witch", icon: Sparkles },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy }
  ];

  return <main className="min-h-screen overflow-hidden">
    <div className="noise" />
    <header className="site-header">
      <a className="brand" href="#" onClick={() => setTab("home")}><span className="brand-mark"><Ghost size={22}/></span><span>CYBER<span className="text-ember">WEEN</span><small>THE HAUNTED WORLD OF CS</small></span></a>
      <nav className="desktop-nav">{navItems.map(n => <button key={n.id} onClick={() => setTab(n.id)} className={tab === n.id ? "nav-link active" : "nav-link"}>{n.label}</button>)}</nav>
      <div className="header-right"><span className="live-dot"/> <span className="live-label">SYSTEM ONLINE</span><button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X/> : <Menu/>}</button></div>
      {mobileOpen && <nav className="mobile-nav">{navItems.map(n => <button key={n.id} onClick={() => { setTab(n.id); setMobileOpen(false); }}>{n.label}<ChevronRight size={16}/></button>)}</nav>}
    </header>

    {tab === "home" && <section className="hero-wrap">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> OCTOBER 31, 2026 <span className="eyebrow-line"/></div>
          <div className="status-pill"><span className="pulse"/> A NEW CHALLENGE HAS AWAKENED</div>
          <h1>ENTER THE<br/><span className="outline-text">HAUNTED</span><br/><span className="text-ember">WORLD OF CS.</span></h1>
          <p className="hero-description">The code is cursed. The network is haunted. Only the sharpest minds will survive the night.</p>
          <div className="hero-actions"><button className="btn-primary" onClick={() => setTab("escape")}>ENTER THE ESCAPE ROOM <ArrowRight size={17}/></button><button className="btn-ghost" onClick={() => setTab("quiz")}>TEST YOUR KNOWLEDGE <ArrowDown size={16}/></button></div>
          <div className="hero-stats"><div><strong>03</strong><span>HAUNTED ROOMS</span></div><i/><div><strong>05</strong><span>CS CHALLENGES</span></div><i/><div><strong>∞</strong><span>WAYS TO FAIL</span></div></div>
        </div>
        <div className="hero-art" aria-label="Decorative haunted digital portal">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="portal-glow"/>
          <div className="moon-art"><Moon size={54} strokeWidth={1}/></div>
          <div className="portal"><div className="portal-inner"><Ghost size={112} strokeWidth={1.1}/><span>404<br/>SOUL NOT FOUND</span></div></div>
          <div className="floating-code code-a">01001000<br/>01000001<br/>01010101<br/>01010100</div><div className="floating-code code-b">const fear = true;<br/>while(alive) &#123;<br/> &nbsp; debug();<br/>&#125;</div>
          <div className="art-label"><span className="live-dot"/> PORTAL DETECTED <span>· 666.01 MHz</span></div>
          <div className="spark spark-one">✦</div><div className="spark spark-two">✧</div><div className="spark spark-three">✦</div>
        </div>
      </div>
      <div className="ticker"><div className="ticker-track">{Array.from({length: 4}).map((_,i)=><span key={i}> <Skull size={15}/> CODE YOUR WAY OUT <b>✳</b> HACK THE DARKNESS <b>✳</b> SURVIVE THE NIGHT <b>✳</b> </span>)}</div></div>
      <section className="section-block">
        <div className="section-heading"><div><span className="section-kicker">CHOOSE YOUR NIGHTMARE</span><h2>THE DARKNESS HAS <em>LEVELS.</em></h2></div><p>Three ways to prove you belong in the digital underworld.</p></div>
        <div className="feature-grid">
          <Feature icon={<LockKeyhole/>} number="01" title="CYBER ESCAPE ROOM" desc="Crack the code, identify the threat, and unlock every haunted chamber." tag="LOGIC · SECURITY" onClick={() => setTab("escape")}/>
          <Feature icon={<BrainCircuit/>} number="02" title="SPOOKY QUIZ ARENA" desc="Five quick-fire questions. One chance to show your Computer Science instincts." tag="KNOWLEDGE · SPEED" onClick={() => setTab("quiz")}/>
          <Feature icon={<Sparkles/>} number="03" title="THE AI WITCH" desc="Consult the digital oracle and discover what fate has compiled for you." tag="MYSTERY · FUN" onClick={() => setTab("fortune")}/>
        </div>
      </section>
    </section>}

    {tab !== "home" && <section className="app-section">
      <div className="app-topline"><button className="back-link" onClick={() => setTab("home")}>← BACK TO THE HAUNTED HOME</button><span className="xp-chip"><Zap size={14}/> {score} XP</span></div>
      {tab === "escape" && <div className="game-panel">
        <div className="panel-kicker"><LockKeyhole size={16}/> INTERACTIVE MISSION / 01</div><h1 className="page-title">THE <em>BROKEN</em> PORTAL</h1><p className="panel-intro">Three locks protect the exit. Solve each Computer Science challenge to escape the mansion.</p>
        <div className="mission-layout"><div className="mission-list">{missions.map((m,i)=><div className={`mission-step ${i === missionIndex ? "current" : ""} ${i < missionIndex ? "complete" : ""}`} key={m.title}><span>{i < missionIndex ? <CheckCircle2 size={18}/> : `0${i+1}`}</span><div><b>{m.title}</b><small>{i < missionIndex ? "CLEARED" : i === missionIndex ? "CURRENT CHAMBER" : "LOCKED"}</small></div></div>)}</div>
          <div className="challenge-card"><div className="challenge-meta"><span>CHAMBER 0{Math.min(missionIndex+1,3)}</span><span>REWARD: {currentMission.points} XP</span></div><h3>{currentMission.title}</h3><p>{currentMission.prompt}</p><label className="field-label" htmlFor="mission-answer">YOUR ANSWER</label><input id="mission-answer" className="dark-input" value={answer} onChange={e=>setAnswer(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitMission()} placeholder="Type your answer..."/>
            <div className="challenge-actions"><button className="btn-primary" onClick={submitMission}>SUBMIT ANSWER <ArrowRight size={16}/></button><button className="btn-ghost small" onClick={()=>setMissionFeedback(`HINT: ${currentMission.hint}`)}>REVEAL HINT</button></div>
            {missionFeedback && <div className={missionFeedback.startsWith("ACCESS GRANTED") || missionFeedback.startsWith("ALL ROOMS") ? "feedback success" : "feedback"}>{missionFeedback}</div>}
            {missionIndex === missions.length-1 && missionFeedback.startsWith("ALL ROOMS") && <button className="btn-ghost restart" onClick={()=>{setMissionIndex(0);setAnswer("");setMissionFeedback("");}}> <RotateCcw size={15}/> REPLAY MISSIONS</button>}
          </div></div>
      </div>}
      {tab === "quiz" && <div className="game-panel narrow-panel"><div className="panel-kicker"><BrainCircuit size={16}/> KNOWLEDGE CHECK / 02</div><h1 className="page-title">SPOOKY <em>QUIZ ARENA</em></h1>
        {!quizDone ? <><div className="quiz-progress"><span>QUESTION {quizIndex+1} / {quiz.length}</span><span>{quizScore} XP EARNED</span></div><div className="progress-track"><div style={{width:`${(quizIndex+1)/quiz.length*100}%`}}/></div><div className="quiz-card"><h3>{quiz[quizIndex].q}</h3><div className="answer-list">{quiz[quizIndex].a.map((a,i)=><button key={a} disabled={selected!==null} onClick={()=>chooseQuiz(i)} className={`answer-option ${selected===i ? (i===quiz[quizIndex].correct?"correct":"wrong") : selected!==null&&i===quiz[quizIndex].correct?"correct":""}`}><span>{String.fromCharCode(65+i)}</span>{a}{selected!==null&&i===quiz[quizIndex].correct&&<CheckCircle2 size={17}/>}</button>)}</div>
          {selected!==null&&<div className="explanation"><b>{selected===quiz[quizIndex].correct?"CORRECT. +100 XP":"NOT QUITE."}</b><p>{quiz[quizIndex].explain}</p><button className="btn-primary" onClick={nextQuiz}>{quizIndex===quiz.length-1?"FINISH QUIZ":"NEXT QUESTION"} <ArrowRight size={16}/></button></div>}</div></>:
          <div className="result-card"><Trophy size={52}/><span className="section-kicker">CHALLENGE COMPLETE</span><h2>{quizScore} <em>XP</em></h2><p>You survived the quiz arena. Keep learning, keep questioning, and never trust a suspicious link.</p><button className="btn-primary" onClick={resetQuiz}>PLAY AGAIN <RotateCcw size={16}/></button></div>}
      </div>}
      {tab === "fortune" && <div className="game-panel fortune-panel"><div className="panel-kicker"><Sparkles size={16}/> DIGITAL ORACLE / 03</div><h1 className="page-title">THE <em>AI WITCH</em></h1><p className="panel-intro">The oracle has been trained on ancient algorithms and questionable prophecies.</p><div className="crystal"><div className="crystal-ring"/><div className="crystal-ball"><Sparkles size={54}/></div></div><div className="fortune-box"><label className="field-label" htmlFor="fortune-name">WHAT SHOULD THE ORACLE CALL YOU?</label><input id="fortune-name" className="dark-input" value={fortuneName} onChange={e=>setFortuneName(e.target.value)} placeholder="Enter your coder alias..."/><button className="btn-primary" onClick={makeFortune}>REVEAL MY DIGITAL FATE <Sparkles size={16}/></button>{fortune&&<div className="fortune-result"><span>✧ YOUR PROPHECY ✧</span><p>{fortune}</p><small>FOR ENTERTAINMENT ONLY · NOT A REAL AI PREDICTION</small></div>}</div></div>}
      {tab === "leaderboard" && <div className="game-panel narrow-panel"><div className="panel-kicker"><Trophy size={16}/> HALL OF FAME / 04</div><h1 className="page-title">TOP <em>HACKERS</em></h1><p className="panel-intro">The legends who made it out of the digital underworld.</p><div className="leaderboard">{sortedPlayers.map((p,i)=><div className="leader-row" key={`${p.name}-${i}`}><span className={`rank rank-${i+1}`}>{String(i+1).padStart(2,"0")}</span><div className="leader-avatar">{i===0?<Trophy size={18}/>:<Ghost size={18}/>}</div><div className="leader-name"><b>{p.name}</b><small>{p.date}</small></div><strong>{p.score.toLocaleString()} <small>XP</small></strong></div>)}</div><div className="save-score"><label className="field-label" htmlFor="player-name">SAVE YOUR DISPLAY NAME</label><input id="player-name" className="dark-input" value={playerName} onChange={e=>setPlayerName(e.target.value)} placeholder="e.g. BYTE_WITCH"/><button className="btn-primary" style={{marginTop:12}} onClick={()=>finishRun()}>SAVE MY CURRENT SCORE <Trophy size={15}/></button>{savedNotice&&<div className="feedback success">{savedNotice}</div>}<p className="muted-note">Scores are saved in this browser only. Shared online rankings require a database integration.</p></div></div>}
    </section>}

    <footer className="footer"><div className="footer-brand"><Ghost size={20}/> CYBER<span>WEEN</span> 2026</div><p>BUILT FOR THE CURIOUS. POWERED BY CODE. HAUNTED BY BUGS.</p><span>© 2026 · COMPUTER SCIENCE HALLOWEEN EXPERIENCE</span></footer>
  </main>;
}

function Feature({icon,number,title,desc,tag,onClick}:{icon:React.ReactNode;number:string;title:string;desc:string;tag:string;onClick:()=>void}) {
  return <button className="feature-card" onClick={onClick}><div className="feature-top"><span>{icon}</span><small>{number}</small></div><h3>{title}</h3><p>{desc}</p><div className="feature-bottom"><span>{tag}</span><ArrowRight size={17}/></div></button>;
}
