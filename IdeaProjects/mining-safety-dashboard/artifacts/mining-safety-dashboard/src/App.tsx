import { useMemo, useState, type FormEvent } from 'react';
import {
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FilePlus2,
  Filter,
  Info,
  LayoutDashboard,
  MapPin,
  Radio,
  Siren,
  Target,
  UserRound,
  X,
} from 'lucide-react';

type Status = 'Open' | 'In progress' | 'Completed';
type Hazard = {
  id: string;
  kind?: 'Hazard' | 'Near-miss';
  type: string;
  area: string;
  likelihood: number;
  consequence: number;
  risk: number;
  controls: string;
  action: string;
  owner: string;
  due: string;
  status: Status;
  reported: string;
  repeat?: boolean;
  escalated?: boolean;
};

const hazardTypes = ['Ground control', 'Mobile equipment', 'Electrical', 'Dust / air quality', 'Working at height', 'Traffic management', 'Chemical exposure'];
const workAreas = ['North pit', 'Process plant', 'Workshop', 'ROM pad', 'Tailings dam', 'Underground 4L'];
const owners = ['M. Ndlovu', 'S. Jacobs', 'L. Mokoena', 'R. Daniels', 'A. Williams', 'T. Khumalo'];
const today = new Date();
const dateAt = (offset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};
const displayDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' });
const isOverdue = (hazard: Hazard) => hazard.status !== 'Completed' && new Date(`${hazard.due}T23:59:00`) < new Date();
const riskBand = (risk: number) => risk >= 15 ? 'extreme' : risk >= 10 ? 'high' : risk >= 5 ? 'medium' : 'low';
const riskName = (risk: number) => risk >= 15 ? 'Critical' : risk >= 10 ? 'High' : risk >= 5 ? 'Moderate' : 'Low';

const initialHazards: Hazard[] = [
  { id: 'HZ-1042', type: 'Ground control', area: 'North pit', likelihood: 4, consequence: 5, risk: 20, controls: 'Barricade placed; geotechnical inspection requested.', action: 'Scale loose brow and install additional mesh at 4N access.', owner: 'M. Ndlovu', due: dateAt(-2), status: 'Open', reported: 'Today, 06:42', repeat: true },
  { id: 'HZ-1041', kind: 'Near-miss', type: 'Mobile equipment', area: 'ROM pad', likelihood: 4, consequence: 4, risk: 16, controls: 'Spotter assigned during reversing; radio channel 3.', action: 'Re-mark pedestrian exclusion zone and brief all haul truck operators.', owner: 'S. Jacobs', due: dateAt(2), status: 'In progress', reported: 'Yesterday, 15:18' },
  { id: 'HZ-1040', type: 'Dust / air quality', area: 'Process plant', likelihood: 3, consequence: 4, risk: 12, controls: 'Fixed extraction running at 70%; disposable masks available.', action: 'Repair torn extraction boot and complete follow-up exposure reading.', owner: 'L. Mokoena', due: dateAt(-7), status: 'Open', reported: '18 Jun, 11:07', repeat: true },
  { id: 'HZ-1039', type: 'Electrical', area: 'Workshop', likelihood: 2, consequence: 5, risk: 10, controls: 'Isolation register in use; temporary lock applied.', action: 'Replace damaged isolator cover and update panel inspection record.', owner: 'R. Daniels', due: dateAt(5), status: 'In progress', reported: '17 Jun, 09:22' },
  { id: 'HZ-1038', type: 'Working at height', area: 'Tailings dam', likelihood: 2, consequence: 5, risk: 10, controls: 'Harness and double lanyard used; permit issued.', action: 'Add anchor-point verification to pre-task briefing checklist.', owner: 'A. Williams', due: dateAt(-12), status: 'Completed', reported: '15 Jun, 14:36' },
  { id: 'HZ-1037', type: 'Traffic management', area: 'North pit', likelihood: 3, consequence: 3, risk: 9, controls: 'One-way route and berms established.', action: 'Refresh faded stop signage at ramp intersection.', owner: 'T. Khumalo', due: dateAt(7), status: 'Open', reported: '14 Jun, 07:50', repeat: true },
  { id: 'HZ-1036', type: 'Chemical exposure', area: 'Process plant', likelihood: 2, consequence: 3, risk: 6, controls: 'SDS available; eyewash station within 10 m.', action: 'Replace missing cabinet label and verify spill kit contents.', owner: 'L. Mokoena', due: dateAt(-4), status: 'Completed', reported: '12 Jun, 12:04' },
];

function App() {
  const [hazards, setHazards] = useState<Hazard[]>(initialHazards);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [selectedId, setSelectedId] = useState('HZ-1042');
  const [matrixFilter, setMatrixFilter] = useState<number | null>(null);
  const [form, setForm] = useState({
    kind: 'Hazard' as 'Hazard' | 'Near-miss', type: 'Ground control', area: 'North pit', likelihood: '3', consequence: '3',
    controls: '', action: '', owner: 'M. Ndlovu', due: dateAt(7), status: 'Open' as Status,
  });
  const stats = useMemo(() => {
    const open = hazards.filter((h) => h.status !== 'Completed');
    return {
      open: open.length,
      overdue: open.filter(isOverdue).length,
      critical: hazards.filter((h) => h.risk >= 15 && h.status !== 'Completed').length,
      closure: Math.round((hazards.filter((h) => h.status === 'Completed').length / hazards.length) * 100),
    };
  }, [hazards]);
  const visibleHazards = useMemo(() => matrixFilter ? hazards.filter((hazard) => hazard.risk === matrixFilter) : hazards, [hazards, matrixFilter]);
  const selected = hazards.find((hazard) => hazard.id === selectedId) ?? hazards[0];
  const categories = useMemo(() => hazardTypes.map((type) => ({ type, count: hazards.filter((h) => h.type === type).length })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count), [hazards]);
  const repeats = useMemo(() => {
    const byType = new Map<string, { type: string; area: string; count: number; risk: number }>();
    hazards.filter((h) => h.repeat).forEach((hazard) => {
      const key = `${hazard.type}-${hazard.area}`;
      const current = byType.get(key);
      byType.set(key, current ? { ...current, count: current.count + 1, risk: Math.max(current.risk, hazard.risk) } : { type: hazard.type, area: hazard.area, count: 1, risk: hazard.risk });
    });
    return [...byType.values()].sort((a, b) => b.count - a.count);
  }, [hazards]);

  const announce = (message: string) => {
    setAlertText(message);
    window.setTimeout(() => setAlertText(''), 5000);
  };
  const updateStatus = (id: string, status: Status) => {
    setHazards((current) => current.map((hazard) => hazard.id === id ? { ...hazard, status } : hazard));
    announce(`${id} status updated to ${status.toLowerCase()}.`);
  };
  const escalate = (hazard: Hazard) => {
    setHazards((current) => current.map((item) => item.id === hazard.id ? { ...item, escalated: true } : item));
    announce(`${hazard.id} escalated to the shift superintendent.`);
  };
  const submitHazard = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const likelihood = Number(form.likelihood);
    const consequence = Number(form.consequence);
    const next: Hazard = {
      id: `HZ-${1043 + hazards.length - initialHazards.length}`,
      kind: form.kind, type: form.type, area: form.area, likelihood, consequence, risk: likelihood * consequence,
      controls: form.controls, action: form.action, owner: form.owner, due: form.due, status: form.status,
      reported: 'Just now', repeat: false,
    };
    setHazards((current) => [next, ...current]);
    setSelectedId(next.id);
    setDrawerOpen(false);
    setForm({ kind: 'Hazard', type: 'Ground control', area: 'North pit', likelihood: '3', consequence: '3', controls: '', action: '', owner: 'M. Ndlovu', due: dateAt(7), status: 'Open' });
    announce(`${next.id} recorded and added to the control room.`);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand-row">
          <div className="brand-mark">HSE</div>
          <div><div className="brand-title">MineSafe<br />Control Room</div><div className="brand-subtitle">Operational assurance</div></div>
        </div>
        <div className="nav-label">Workspace</div>
        <nav className="nav-list">
          <button className="nav-item active" data-testid="nav-dashboard"><LayoutDashboard size={15} /> Overview <span className="nav-count">LIVE</span></button>
          <button className="nav-item" data-testid="nav-hazards" onClick={() => document.getElementById('open-actions')?.scrollIntoView({ behavior: 'smooth' })}><ClipboardList size={15} /> Hazard register <span className="nav-count">{hazards.length}</span></button>
          <button className="nav-item" data-testid="nav-actions" onClick={() => document.getElementById('open-actions')?.scrollIntoView({ behavior: 'smooth' })}><ClipboardCheck size={15} /> Corrective actions <span className="nav-count">{stats.open}</span></button>
          <button className="nav-item" data-testid="nav-trends" onClick={() => document.getElementById('trends')?.scrollIntoView({ behavior: 'smooth' })}><BarChart3 size={15} /> Trends & analysis</button>
        </nav>
        <div className="sidebar-spacer" />
        <div className="shift-card">
          <div className="shift-title"><span className="live-dot" /> Shift A is active</div>
          <p className="shift-copy">Control room synced locally. Sample data is shown for prototype demonstration.</p>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="crumb">Operations / HSE assurance / Overview</div>
          <div className="topbar-right"><div className="clock mono">18 JUN 2024 · 07:14 SAST</div><button className="btn btn-quiet" aria-label="Notifications" data-testid="button-notifications"><Bell size={16} /></button><div className="avatar" aria-label="Signed in as N. Molefe">NM</div></div>
        </header>
        <div className="page">
          {alertText && <div className="alert-strip" role="status" data-testid="status-alert"><span><strong>Control room update</strong> &nbsp; {alertText}</span><button onClick={() => setAlertText('')} aria-label="Dismiss notification" data-testid="button-dismiss-alert"><X size={14} /></button></div>}
          <section className="hero">
            <div><div className="eyebrow">Daily assurance board · 18 June 2024</div><h1>Mining Hazard Reporting and Corrective-Action Monitoring System</h1><p>One operational view for supervisors and safety officers to understand exposure, assign ownership and keep every control moving toward closure.</p></div>
            <div className="hero-actions"><button className="btn btn-secondary" onClick={() => announce('Prototype mode: all records are stored in this browser session.')} data-testid="button-prototype-info"><Info size={14} /> Prototype notes</button><button className="btn btn-primary" onClick={() => setDrawerOpen(true)} data-testid="button-report-hazard"><FilePlus2 size={15} /> Report hazard</button></div>
          </section>
          <section className="metric-grid" aria-label="Safety performance summary">
            <article className="metric-card metric-warning" data-testid="metric-critical"><div className="metric-top"><span>Critical exposure</span><Siren size={14} /></div><div className="metric-value">{stats.critical}</div><div className="metric-detail"><strong>Immediate attention</strong> · risk score 15+</div></article>
            <article className="metric-card" data-testid="metric-open-actions"><div className="metric-top"><span>Open actions</span><ClipboardCheck size={14} /></div><div className="metric-value">{stats.open}</div><div className="metric-detail"><strong>{stats.overdue} overdue</strong> · of {hazards.length} reported items</div></article>
            <article className="metric-card metric-warning" data-testid="metric-overdue"><div className="metric-top"><span>Overdue follow-up</span><Clock3 size={14} /></div><div className="metric-value">{stats.overdue}</div><div className="metric-detail"><strong>Needs escalation</strong> · owners notified</div></article>
            <article className="metric-card metric-good" data-testid="metric-closure"><div className="metric-top"><span>Closure rate</span><CheckCircle2 size={14} /></div><div className="metric-value">{stats.closure}%</div><div className="metric-detail"><strong>Current reporting window</strong> · target 85%</div></article>
          </section>
          <section className="dashboard-grid">
            <div className="panel">
              <div className="panel-header"><div><div className="panel-title">Current risk matrix</div><div className="panel-subtitle">Select a score to filter the live hazard register below.</div></div><span className="eyebrow mono">5 × 5 AS/NZS 4360</span></div>
              <div className="panel-body"><div className="risk-layout"><div className="matrix-wrap"><div className="matrix-y">Likelihood</div><div className="matrix">
                {[5, 4, 3, 2, 1].flatMap((likelihood) => [1, 2, 3, 4, 5].map((consequence) => { const score = likelihood * consequence; const count = hazards.filter((h) => h.risk === score).length; return <button className={`matrix-cell ${riskBand(score)} ${matrixFilter === score ? 'selected' : ''}`} key={`${likelihood}-${consequence}`} title={`Risk score ${score}; ${count} active records`} aria-label={`Risk score ${score}; ${count} records`} onClick={() => setMatrixFilter(matrixFilter === score ? null : score)} data-testid={`matrix-cell-${likelihood}-${consequence}`}><span className="cell-number">{score}</span>{count > 0 && <span className="cell-count">{count}</span>}</button>; }))}
              </div><div className="matrix-axis"><span>Rare</span><span>Almost certain</span></div><div className="matrix-x">Consequence</div></div><div className="legend"><div className="legend-item"><span className="legend-swatch extreme" /> Critical 15–25</div><div className="legend-item"><span className="legend-swatch high" /> High 10–14</div><div className="legend-item"><span className="legend-swatch medium" /> Moderate 5–9</div><div className="legend-item"><span className="legend-swatch low" /> Low 1–4</div><div className="legend-note">Risk = likelihood × consequence. Controls are considered before ranking.</div></div></div></div>
            </div>
            <div className="panel">
              <div className="panel-header"><div><div className="panel-title">Control room signal</div><div className="panel-subtitle">What needs a supervisor's attention first.</div></div><Radio size={16} color="hsl(35 76% 46%)" /></div>
              <div className="panel-body"><div className="detail-kicker">NEXT BEST ACTION</div><h3 style={{ margin: '7px 0 8px', fontSize: 17, letterSpacing: '-.04em' }}>{stats.overdue} overdue action{stats.overdue === 1 ? '' : 's'} require follow-up</h3><p style={{ fontSize: 11, lineHeight: 1.6, color: 'hsl(var(--muted-foreground))', margin: 0 }}>The open register is ranked by exposure, then due date. Start with the critical ground-control observation in North pit.</p><button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => document.getElementById('open-actions')?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-review-actions">Review action queue <ChevronDown size={14} /></button></div>
            </div>
          </section>
          <section className="panel" id="open-actions">
            <div className="panel-header"><div><div className="panel-title">Open corrective actions</div><div className="panel-subtitle">{matrixFilter ? `Filtered to risk score ${matrixFilter}.` : 'Every open item has an owner, a date and a next control.'}</div></div><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{matrixFilter && <button className="btn btn-quiet" onClick={() => setMatrixFilter(null)} data-testid="button-clear-filter"><X size={13} /> Clear filter</button>}<span className="eyebrow mono">{visibleHazards.filter((h) => h.status !== 'Completed').length} OPEN</span></div></div>
            <div className="action-list">
              {visibleHazards.filter((h) => h.status !== 'Completed').map((hazard) => <div className="action-row" key={hazard.id} onClick={() => setSelectedId(hazard.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setSelectedId(hazard.id); }} role="button" tabIndex={0} data-testid={`row-hazard-${hazard.id}`}><span className={`action-severity ${riskBand(hazard.risk)}`} /><div><div className="action-code">{hazard.id} · {hazard.kind ?? 'Hazard'} · {hazard.reported}</div><div className="action-name">{hazard.action}</div><div className="action-meta"><span><MapPin size={10} style={{ verticalAlign: 'middle' }} /> {hazard.area}</span><span><UserRound size={10} style={{ verticalAlign: 'middle' }} /> {hazard.owner}</span><span className={isOverdue(hazard) ? 'mono' : ''} style={isOverdue(hazard) ? { color: 'hsl(var(--destructive))' } : undefined}>{isOverdue(hazard) ? 'Overdue' : `Due ${displayDate(hazard.due)}`}</span></div></div><div style={{ display: 'grid', gap: 7, justifyItems: 'end' }}><select className={`status-select ${hazard.status === 'Open' ? 'open' : 'progress'}`} value={hazard.status} onClick={(event) => event.stopPropagation()} onChange={(event) => updateStatus(hazard.id, event.target.value as Status)} aria-label={`Update status for ${hazard.id}`} data-testid={`select-status-${hazard.id}`}><option>Open</option><option>In progress</option><option>Completed</option></select><button className="btn btn-quiet" onClick={(event) => { event.stopPropagation(); escalate(hazard); }} disabled={hazard.escalated} data-testid={`button-escalate-${hazard.id}`}><Siren size={12} /> {hazard.escalated ? 'Escalated' : 'Escalate'}</button></div></div>)}
              {visibleHazards.filter((h) => h.status !== 'Completed').length === 0 && <div style={{ padding: 30, textAlign: 'center', color: 'hsl(var(--muted-foreground))', fontSize: 12 }}>No open actions match this risk score.</div>}
            </div>
          </section>
          {selected && <section className="detail-panel" data-testid={`detail-hazard-${selected.id}`}><div className="detail-kicker">SELECTED RECORD · {selected.id} · {selected.kind ?? 'Hazard'}</div><h3>{selected.type} observation in {selected.area}</h3><p>{selected.controls}</p><div className="detail-grid"><div className="detail-item"><span>Risk rating</span><strong>{selected.risk} · {riskName(selected.risk)}</strong></div><div className="detail-item"><span>Responsible</span><strong>{selected.owner}</strong></div><div className="detail-item"><span>Due date</span><strong>{displayDate(selected.due)}</strong></div></div></section>}
          <section className="lower-grid" id="trends">
            <div className="panel"><div className="panel-header"><div><div className="panel-title">Incident trends by work area</div><div className="panel-subtitle">Reported hazards and near-misses · last four reporting periods.</div></div><BarChart3 size={16} color="hsl(var(--accent))" /></div><div className="chart-area"><div className="chart-key"><span><i className="key-dot current" /> Current</span><span><i className="key-dot previous" /> Previous</span></div><div className="bar-chart">{workAreas.slice(0, 5).map((area, index) => <div className="bar-group" key={area}><div className="bars"><span className="bar previous" style={{ height: `${[38, 64, 48, 78, 30][index]}%` }} /><span className="bar current" style={{ height: `${[59, 44, 86, 39, 67][index]}%` }} /></div><span className="bar-label">{area === 'Process plant' ? 'Plant' : area === 'Tailings dam' ? 'Tailings' : area.split(' ')[0]}</span></div>)}</div></div></div>
            <div className="panel"><div className="panel-header"><div><div className="panel-title">High-risk categories</div><div className="panel-subtitle">Volume of observations in the active register.</div></div><Target size={16} color="hsl(var(--primary))" /></div><div className="category-list">{categories.slice(0, 5).map((category) => <div className="category-line" key={category.type}><span className="category-label">{category.type}</span><div className="track"><div className="fill" style={{ width: `${Math.max(18, (category.count / Math.max(...categories.map((item) => item.count))) * 100)}%` }} /></div><span className="category-count">{category.count}</span></div>)}</div></div>
          </section>
          <section className="panel" style={{ marginBottom: 16 }}><div className="panel-header"><div><div className="panel-title">Repeated hazards</div><div className="panel-subtitle">Patterns worth addressing at source, not only closing as individual actions.</div></div><Filter size={15} color="hsl(var(--muted-foreground))" /></div><table className="repeat-table"><thead><tr><th>Hazard pattern</th><th>Work area</th><th>Signal</th><th>Highest score</th></tr></thead><tbody>{repeats.map((item) => <tr key={`${item.type}-${item.area}`}><td>{item.type}</td><td className="repeat-area">{item.area}</td><td className="repeat-number">{item.count} repeat reports</td><td><span className={`severity-chip ${item.risk >= 15 ? 'critical' : ''}`}>{item.risk} · {riskName(item.risk)}</span></td></tr>)}</tbody></table></section>
          <section className="readout"><div><div className="eyebrow">Interview readout</div><h2>A control loop, not a form.</h2><p>This prototype models the supervisor's real decision path: capture the observation with enough operational context, make exposure visible through a consistent risk method, assign a person and date, then keep overdue work in the same view until it is verified closed.</p></div><div className="readout-list"><div className="readout-item"><Check size={14} /> <span><strong>Understand:</strong> a single record connects hazard, work area, controls and risk score.</span></div><div className="readout-item"><Check size={14} /> <span><strong>Act:</strong> status, ownership and due date are updated without leaving the board.</span></div><div className="readout-item"><Check size={14} /> <span><strong>Escalate:</strong> a supervisor can flag a stuck action and preserve the audit trail.</span></div></div></section>
          <div className="footer-note"><strong>Prototype sample data.</strong> This interface is for demonstration only and does not represent a live mine-site safety record or emergency response channel.</div>
        </div>
      </main>
      {drawerOpen && <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawerOpen(false); }}><div className="drawer" role="dialog" aria-modal="true" aria-labelledby="report-title"><div className="drawer-head"><div><div className="eyebrow">New observation · local prototype</div><h2 id="report-title">Report a hazard or near-miss</h2><p className="drawer-copy">Capture enough context for the next person to make a safe decision. The risk score is calculated from likelihood × consequence.</p></div><button className="close-button" onClick={() => setDrawerOpen(false)} aria-label="Close report form" data-testid="button-close-report"><X size={16} /></button></div><form onSubmit={submitHazard}><div className="form-grid"><div className="field"><label htmlFor="observation-kind">Observation type</label><select id="observation-kind" value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value as 'Hazard' | 'Near-miss' })} data-testid="select-observation-kind"><option>Hazard</option><option>Near-miss</option></select></div><div className="field"><label htmlFor="hazard-type">Hazard type</label><select id="hazard-type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} data-testid="select-hazard-type">{hazardTypes.map((type) => <option key={type}>{type}</option>)}</select></div><div className="field"><label htmlFor="work-area">Work area</label><select id="work-area" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} data-testid="select-work-area">{workAreas.map((area) => <option key={area}>{area}</option>)}</select></div><div className="field"><label htmlFor="likelihood">Likelihood</label><select id="likelihood" value={form.likelihood} onChange={(event) => setForm({ ...form, likelihood: event.target.value })} data-testid="select-likelihood">{[1, 2, 3, 4, 5].map((value) => <option value={value} key={value}>{value} · {['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost certain'][value - 1]}</option>)}</select></div><div className="field"><label htmlFor="consequence">Consequence</label><select id="consequence" value={form.consequence} onChange={(event) => setForm({ ...form, consequence: event.target.value })} data-testid="select-consequence">{[1, 2, 3, 4, 5].map((value) => <option value={value} key={value}>{value} · {['Minor', 'Moderate', 'Serious', 'Major', 'Severe'][value - 1]}</option>)}</select></div><div className="field full"><label htmlFor="existing-controls">Existing controls</label><textarea id="existing-controls" required value={form.controls} onChange={(event) => setForm({ ...form, controls: event.target.value })} placeholder="What is already preventing harm?" data-testid="textarea-existing-controls" /></div><div className="field full"><label htmlFor="corrective-action">Corrective action</label><textarea id="corrective-action" required value={form.action} onChange={(event) => setForm({ ...form, action: event.target.value })} placeholder="What must happen next to reduce the exposure?" data-testid="textarea-corrective-action" /></div><div className="field"><label htmlFor="responsible-person">Responsible person</label><select id="responsible-person" value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} data-testid="select-responsible-person">{owners.map((owner) => <option key={owner}>{owner}</option>)}</select></div><div className="field"><label htmlFor="due-date">Due date</label><input id="due-date" type="date" required value={form.due} onChange={(event) => setForm({ ...form, due: event.target.value })} data-testid="input-due-date" /></div><div className="field full"><label htmlFor="completion-status">Completion status</label><select id="completion-status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Status })} data-testid="select-completion-status"><option>Open</option><option>In progress</option><option>Completed</option></select></div></div><div className="risk-preview"><span>Calculated risk rating</span><strong>{Number(form.likelihood) * Number(form.consequence)} · {riskName(Number(form.likelihood) * Number(form.consequence))}</strong></div><div className="drawer-foot"><button type="button" className="btn btn-secondary" onClick={() => setDrawerOpen(false)} data-testid="button-cancel-report">Cancel</button><button type="submit" className="btn btn-primary" data-testid="button-submit-report"><FilePlus2 size={14} /> Record hazard</button></div></form></div></div>}
    </div>
  );
}

export default App;
