import { useState } from "react";

const SUBJECTS = ["Mathematics","Science","English","Social Studies","Hindi","Physics","Chemistry","Biology","History","Geography","Computer Science","EVS"];
const GRADES = ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"];
const DURATIONS = ["30 minutes","45 minutes","60 minutes","90 minutes"];
const BOARDS = ["CBSE","ICSE","State Board","IB","Cambridge"];
const APPROACHES = ["Activity-based","Lecture","Discussion","Project-based","Socratic","Flipped classroom"];
const SECTIONS = ["Learning objectives","Warm-up","Main activity","Assessment","Homework","Materials list"];

// Keywords associated with each subject for validation
const SUBJECT_KEYWORDS = {
  "Mathematics": ["algebra","geometry","trigonometry","calculus","fractions","decimals","integers","probability","statistics","arithmetic","number","equation","polynomial","quadratic","circle","triangle","theorem","ratio","percentage","mensuration","coordinate","matrix","logarithm","sequence","series","sets","permutation","combination","integration","differentiation","vector","complex","binary","profit","loss","interest","speed","distance"],
  "Science": ["photosynthesis","cell","atom","molecule","force","energy","motion","electricity","magnet","light","sound","matter","living","organism","ecosystem","food","chain","nutrition","respiration","reproduction","evolution","genetics","hormone","disease","health","metal","nonmetal","acid","base","salt","chemical","reaction","periodic","table","newton","work","power","wave","current","circuit","lens","mirror","refraction","reflection"],
  "Physics": ["force","motion","velocity","acceleration","newton","energy","power","work","gravity","friction","pressure","buoyancy","wave","sound","light","optics","lens","mirror","reflection","refraction","electricity","current","voltage","resistance","magnet","electromagnetic","nuclear","atom","quantum","thermodynamics","heat","temperature","momentum","torque","oscillation","circuit","capacitor","inductor","semiconductor","transistor"],
  "Chemistry": ["atom","molecule","element","compound","mixture","acid","base","salt","chemical","reaction","bond","periodic","table","electron","proton","neutron","orbital","valence","oxidation","reduction","equilibrium","kinetics","thermochemistry","electrochemistry","organic","carbon","polymer","hydrocarbon","alcohol","aldehyde","ketone","ester","enzyme","catalyst","solution","concentration","mole","stoichiometry"],
  "Biology": ["cell","tissue","organ","organism","photosynthesis","respiration","nutrition","excretion","reproduction","genetics","DNA","RNA","evolution","ecosystem","biodiversity","microorganism","bacteria","virus","fungi","plant","animal","classification","hormone","nervous","system","blood","heart","digestion","immunity","disease","health","heredity","chromosome","mutation","ecology"],
  "English": ["grammar","essay","poem","poetry","prose","story","novel","character","plot","theme","metaphor","simile","comprehension","vocabulary","tense","verb","noun","adjective","adverb","preposition","conjunction","sentence","paragraph","writing","reading","literature","author","protagonist","antagonist","dialogue","narrative","speech","debate","letter","formal","informal","punctuation","clause","phrase"],
  "Social Studies": ["history","geography","civics","economy","society","culture","democracy","government","constitution","rights","duties","map","climate","agriculture","industry","trade","transport","communication","population","resources","disaster","environment","heritage","freedom","movement","independence","war","empire","civilization","revolution","treaty","policy"],
  "Hindi": ["vyakaran","kavita","kahani","upanyas","gadya","padya","sandhi","samas","alankar","ras","chhand","nibandh","patra","bhasha","lipi","shabd","vakya","kriya","sangya","sarvanam","visheshan","avyay","muhavara","lokokti","anuched","parichay","rachna"],
  "History": ["ancient","medieval","modern","civilization","empire","dynasty","war","revolution","independence","colonial","trade","culture","religion","society","political","economic","freedom","movement","treaty","constitution","democracy","nationalism","imperialism","renaissance","industrial","world","india","mughal","british","maratha","delhi","sultan","ruler","king","queen","viceroy","partition"],
  "Geography": ["map","climate","weather","soil","vegetation","agriculture","industry","population","urbanisation","river","mountain","plateau","plains","ocean","continent","country","state","capital","latitude","longitude","mineral","resource","transport","communication","disaster","earthquake","flood","drought","forest","biodiversity","ecosystem","environment","erosion","delta","tributary"],
  "Computer Science": ["algorithm","program","code","loop","function","variable","array","string","object","class","database","network","internet","html","css","javascript","python","java","operating","system","software","hardware","binary","decimal","logic","gate","boolean","recursion","sorting","searching","stack","queue","linked","list","tree","graph","complexity","cybersecurity","artificial","intelligence","machine","learning"],
  "EVS": ["environment","nature","plant","animal","water","air","soil","pollution","conservation","ecosystem","food","chain","biodiversity","weather","climate","community","family","health","hygiene","transport","communication","shelter","disaster","safety","recycle","reuse","reduce","natural","resource","energy","solar","wind"]
};

function checkTopicMatchesSubject(topic, subject) {
  if (!topic.trim()) return { valid: false, message: "Please enter a topic." };
  const keywords = SUBJECT_KEYWORDS[subject] || [];
  if (keywords.length === 0) return { valid: true }; // no keywords defined, allow it
  const topicLower = topic.toLowerCase();
  const matched = keywords.some(kw => topicLower.includes(kw));
  if (!matched) {
    return {
      valid: false,
      message: `"${topic}" doesn't seem to be a ${subject} topic. Please check your subject and topic — they should match. For example, if your topic is "Photosynthesis", select Science not Mathematics.`
    };
  }
  return { valid: true };
}

export default function App() {
  const [subject, setSubject] = useState("Mathematics");
  const [grade, setGrade] = useState("Class 9");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("45 minutes");
  const [board, setBoard] = useState("CBSE");
  const [extra, setExtra] = useState("");
  const [approaches, setApproaches] = useState(["Activity-based"]);
  const [sections, setSections] = useState(["Learning objectives","Warm-up","Main activity","Assessment"]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [topicWarning, setTopicWarning] = useState("");

  const toggleChip = (val, list, setList) => {
    setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val]);
  };

  const handleTopicChange = (val) => {
    setTopic(val);
    setTopicWarning("");
    setError("");
  };

  const handleSubjectChange = (val) => {
    setSubject(val);
    setTopicWarning("");
    setError("");
  };

  const durationMinutes = parseInt(duration);

  const buildTimeSlots = () => {
    if (durationMinutes === 30) return "5 min warm-up, 18 min main teaching, 5 min activity, 2 min summary";
    if (durationMinutes === 45) return "5 min warm-up, 25 min main teaching, 10 min activity or group work, 5 min assessment or summary";
    if (durationMinutes === 60) return "7 min warm-up, 30 min main teaching, 15 min activity or group work, 8 min assessment or summary";
    return "10 min warm-up, 40 min main teaching, 25 min activity or group work, 15 min assessment or summary";
  };

  const generate = async () => {
    setError("");
    setTopicWarning("");
    if (!topic.trim()) { setError("Please enter a topic before generating."); return; }

    const check = checkTopicMatchesSubject(topic, subject);
    if (!check.valid) { setTopicWarning(check.message); return; }

    setLoading(true);
    setOutput("");

    const prompt = `You are an expert Indian school teacher and curriculum designer. Create a detailed, practical, classroom-ready lesson plan that tells the teacher EXACTLY what to do minute by minute.

Details:
- Subject: ${subject}
- Grade: ${grade}
- Topic: ${topic}
- Total Duration: ${duration}
- Board: ${board}
- Teaching approach: ${approaches.join(", ") || "activity-based"}
- Sections to include: ${sections.join(", ")}
${extra ? `- Special notes: ${extra}` : ""}

CRITICAL REQUIREMENTS:
1. Every section must include the TIME allocated in brackets, e.g. "WARM-UP: (5 MINUTES)"
2. Use this time split: ${buildTimeSlots()}
3. Tell the teacher EXACTLY what to say, write on the board, and do — not vague instructions
4. For each activity, write what the TEACHER does AND what STUDENTS do
5. Include 2-3 specific questions the teacher should ask the class
6. Make it specific to ${subject} — only include content relevant to ${topic}
7. Assessment section must have actual questions related to ${topic}, not generic ones

FORMAT RULES:
- Section headers in ALL CAPS followed by colon, e.g. LEARNING OBJECTIVES: or WARM-UP: (5 MINUTES):
- No markdown, no asterisks, no bold
- Use numbers for lists
- Write as if speaking directly to the teacher: "Ask students...", "Write on the board...", "Show the diagram of..."`;

    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt,
          stream: true
        })
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(Boolean);
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.response) {
              fullText += json.response;
              setOutput(fullText);
            }
          } catch {}
        }
      }
    } catch {
      setError("Could not connect to Ollama. Make sure it's running: open Terminal and type 'ollama serve'");
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --purple: #7C3AED;
          --purple-light: #EDE9FE;
          --purple-mid: #DDD6FE;
          --purple-dark: #5B21B6;
          --purple-soft: #F5F3FF;
          --text: #1a1625;
          --text-muted: #6B7280;
          --text-light: #9CA3AF;
          --border: #E5E0F0;
          --border-focus: #7C3AED;
          --bg: #FAFAFA;
          --white: #FFFFFF;
          --card-shadow: 0 1px 3px rgba(124,58,237,0.06), 0 4px 16px rgba(124,58,237,0.05);
          --card-shadow-hover: 0 4px 24px rgba(124,58,237,0.12);
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 60% 40% at 70% -10%, rgba(124,58,237,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 0% 80%, rgba(124,58,237,0.04) 0%, transparent 60%),
            #FAFAFA;
          padding: 48px 24px 80px;
        }

        .container { max-width: 720px; margin: 0 auto; }

        .header { margin-bottom: 40px; }

        .header-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: var(--purple);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: var(--purple-light);
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 14px;
        }

        .header-eyebrow::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--purple);
        }

        h1 {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 400;
          color: var(--text);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
        }

        h1 em {
          font-style: italic;
          color: var(--purple);
        }

        .header-sub {
          font-size: 15px;
          color: var(--text-muted);
          font-weight: 300;
          line-height: 1.6;
        }

        .card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 16px;
          box-shadow: var(--card-shadow);
          transition: box-shadow 0.2s;
        }

        .card:hover { box-shadow: var(--card-shadow-hover); }

        .card-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--purple);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, var(--purple-mid), transparent);
        }

        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field.span2 { grid-column: 1 / -1; }

        label {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-muted);
          letter-spacing: 0.03em;
        }

        select, input, textarea {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--text);
          background: var(--purple-soft);
          border: 1.5px solid var(--border);
          border-radius: 12px;
          padding: 11px 14px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
        }

        select { cursor: pointer; }
        textarea { resize: vertical; min-height: 80px; line-height: 1.6; }

        select:focus, input:focus, textarea:focus {
          border-color: var(--border-focus);
          background: white;
        }

        .chips { display: flex; flex-wrap: wrap; gap: 8px; }

        .chip {
          font-family: 'DM Sans', sans-serif;
          padding: 7px 16px;
          border-radius: 30px;
          border: 1.5px solid var(--border);
          background: var(--white);
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.15s;
          user-select: none;
        }

        .chip:hover { border-color: var(--purple); color: var(--purple); }

        .chip.on {
          background: var(--purple);
          border-color: var(--purple);
          color: white;
          font-weight: 500;
        }

        .generate-btn {
          width: 100%;
          padding: 16px;
          background: var(--purple);
          color: white;
          border: none;
          border-radius: 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.01em;
          margin-top: 4px;
          position: relative;
          overflow: hidden;
        }

        .generate-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
        }

        .generate-btn:hover { background: var(--purple-dark); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.3); }
        .generate-btn:active { transform: translateY(0); }
        .generate-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .output-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          margin-top: 16px;
          box-shadow: var(--card-shadow);
          animation: fadeUp 0.3s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .output-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--purple-soft);
        }

        .output-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--purple);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .copy-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          padding: 5px 14px;
          border-radius: 8px;
          border: 1.5px solid var(--purple-mid);
          background: white;
          color: var(--purple);
          cursor: pointer;
          font-weight: 500;
          transition: all 0.15s;
        }

        .copy-btn:hover { background: var(--purple); color: white; border-color: var(--purple); }

        .output-body {
          padding: 28px 28px 32px;
          font-size: 14px;
          line-height: 1.8;
          color: var(--text);
          white-space: pre-wrap;
        }

        .section-block { margin-bottom: 20px; }

        .section-head {
          font-size: 11px;
          font-weight: 500;
          color: var(--purple);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--purple-light);
        }

        .section-body {
          font-size: 14px;
          line-height: 1.8;
          color: var(--text);
          white-space: pre-wrap;
        }

        .loading-dots {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 28px;
          color: var(--text-muted);
          font-size: 14px;
        }

        .dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--purple);
          animation: pulse 1s infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes pulse { 0%,100%{opacity:0.2} 50%{opacity:1} }

        .footer-note {
          text-align: center;
          font-size: 12px;
          color: var(--text-light);
          margin-top: 32px;
        }

        @media (max-width: 600px) {
          .grid2 { grid-template-columns: 1fr; }
          .field.span2 { grid-column: 1; }
          .page { padding: 28px 16px 60px; }
          .card { padding: 20px; }
        }
      `}</style>

      <div className="page">
        <div className="container">

          <div className="header">
            <div className="header-eyebrow">AI-powered for Indian teachers</div>
            <h1>Lesson <em>Planner</em></h1>
            <p className="header-sub">Generate structured, classroom-ready lesson plans in seconds. Built for CBSE, ICSE &amp; State Board.</p>
          </div>

          {/* Lesson Basics */}
          <div className="card">
            <div className="card-title">Lesson basics</div>
            <div className="grid2">
              <div className="field">
                <label>Subject</label>
                <select value={subject} onChange={e => handleSubjectChange(e.target.value)}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Grade / Class</label>
                <select value={grade} onChange={e => setGrade(e.target.value)}>
                  {GRADES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="field span2">
                <label>Topic / Chapter</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => handleTopicChange(e.target.value)}
                  placeholder="e.g. Photosynthesis, Fractions, French Revolution..."
                  style={topicWarning ? {borderColor:"#DC2626",background:"#FEF2F2"} : {}}
                />
                {topicWarning && (
                  <div style={{marginTop:6,padding:"10px 14px",background:"#FEF2F2",border:"1.5px solid #FCA5A5",borderRadius:10,fontSize:13,color:"#991B1B",lineHeight:1.6}}>
                    ⚠️ {topicWarning}
                  </div>
                )}
              </div>
              <div className="field">
                <label>Duration</label>
                <select value={duration} onChange={e => setDuration(e.target.value)}>
                  {DURATIONS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Board / Curriculum</label>
                <select value={board} onChange={e => setBoard(e.target.value)}>
                  {BOARDS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Teaching Style */}
          <div className="card">
            <div className="card-title">Teaching approach</div>
            <div className="chips">
              {APPROACHES.map(a => (
                <button key={a} className={`chip ${approaches.includes(a) ? "on" : ""}`}
                  onClick={() => toggleChip(a, approaches, setApproaches)}>{a}</button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="card">
            <div className="card-title">Include sections</div>
            <div className="chips">
              {SECTIONS.map(s => (
                <button key={s} className={`chip ${sections.includes(s) ? "on" : ""}`}
                  onClick={() => toggleChip(s, sections, setSections)}>{s}</button>
              ))}
            </div>
          </div>

          {/* Extra context */}
          <div className="card">
            <div className="card-title">Extra context <span style={{fontWeight:300,textTransform:'none',letterSpacing:0,color:'#9CA3AF',fontSize:'11px',marginLeft:4}}>optional</span></div>
            <div className="field">
              <label>Special notes about your class</label>
              <textarea value={extra} onChange={e => setExtra(e.target.value)}
                placeholder="e.g. Students struggle with fractions, mix of learners, prior lesson was on decimals..." />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{marginBottom:12,padding:"12px 16px",background:"#FEF2F2",border:"1.5px solid #FCA5A5",borderRadius:12,fontSize:13,color:"#991B1B",lineHeight:1.6}}>
              ⚠️ {error}
            </div>
          )}

          {/* Generate */}
          <button className="generate-btn" onClick={generate} disabled={loading || !topic.trim()}>
            {loading
              ? <><div className="spinner" /> Generating — text will appear as it streams...</>
              : <>✦ Generate lesson plan</>}
          </button>

          {/* Output */}
          {(loading || output) && (
            <div className="output-card">
              <div className="output-header">
                <span className="output-title">
                  Your lesson plan — {subject} · {grade} · {duration}
                </span>
                {output && (
                  <button className="copy-btn" onClick={copy}>{copied ? "Copied!" : "Copy"}</button>
                )}
              </div>
              {loading && !output ? (
                <div className="loading-dots">
                  <div className="dot"/><div className="dot"/><div className="dot"/>
                  <span style={{marginLeft:4}}>Starting generation...</span>
                </div>
              ) : (
                <div className="output-body">
                  {output.split(/\n/).map((line, i) => {
                    const isHeader = /^[A-Z][A-Z\s\/\(\)\-\:0-9]{3,}:/.test(line.trim());
                    return isHeader
                      ? <div key={i} className="section-head" style={{marginTop: i > 0 ? 20 : 0}}>{line.trim()}</div>
                      : <span key={i}>{line}{"\n"}</span>;
                  })}
                  {loading && <span style={{color:"var(--purple)",animation:"pulse 1s infinite"}}>▌</span>}
                </div>
              )}
            </div>
          )}

          <p className="footer-note">Made for  teachers · CBSE · ICSE · State Board</p>
        </div>
      </div>
    </>
  );
}