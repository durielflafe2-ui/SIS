import { useState, useMemo } from "react";

const STAGES = ["New", "Contacted", "Qualified", "Proposal", "Closed Won", "Closed Lost"];
const STAGE_COLORS = {
  "New": "#E6F1FB",
  "Contacted": "#FAEEDA",
  "Qualified": "#EAF3DE",
  "Proposal": "#EEEDFE",
  "Closed Won": "#E1F5EE",
  "Closed Lost": "#FCEBEB",
};
const STAGE_TEXT = {
  "New": "#185FA5",
  "Contacted": "#854F0B",
  "Qualified": "#3B6D11",
  "Proposal": "#534AB7",
  "Closed Won": "#0F6E56",
  "Closed Lost": "#A32D2D",
};

const ACTIVITY_TYPES = ["Call", "Email", "Meeting", "Note"];

const initContacts = [
  { id: 1, name: "Ama Owusu", email: "ama@techgh.com", phone: "+233 24 123 4567", company: "TechGh Ltd", stage: "Qualified", value: 12000, created: "2026-04-10" },
  { id: 2, name: "Kofi Mensah", email: "kofi@goldlink.com", phone: "+233 20 987 6543", company: "Goldlink Ventures", stage: "Proposal", value: 34000, created: "2026-03-22" },
  { id: 3, name: "Abena Sarpong", email: "abena@sarpinvest.com", phone: "+233 55 456 7890", company: "Sarp Investments", stage: "New", value: 8500, created: "2026-05-01" },
  { id: 4, name: "Kwame Asante", email: "kwame@akomark.com", phone: "+233 27 321 0987", company: "Akoma Marketing", stage: "Closed Won", value: 22000, created: "2026-02-15" },
];

const initActivities = [
  { id: 1, contactId: 1, type: "Call", note: "Discussed pricing and product demo.", date: "2026-05-08" },
  { id: 2, contactId: 2, type: "Email", note: "Sent proposal document for review.", date: "2026-05-07" },
  { id: 3, contactId: 4, type: "Meeting", note: "Signed contract. Deal closed.", date: "2026-04-20" },
];

function initials(name) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function Avatar({ name, size = 40 }) {
  const colors = ["#B5D4F4", "#9FE1CB", "#F4C0D1", "#CECBF6", "#FAC775"];
  const idx = name.charCodeAt(0) % colors.length;
  const textColors = ["#0C447C", "#085041", "#72243E", "#3C3489", "#633806"];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[idx], color: textColors[idx],
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 500, fontSize: size * 0.35, flexShrink: 0
    }}>{initials(name)}</div>
  );
}

function StageBadge({ stage }) {
  return (
    <span style={{
      background: STAGE_COLORS[stage] || "#F1EFE8",
      color: STAGE_TEXT[stage] || "#5F5E5A",
      borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 500
    }}>{stage}</span>
  );
}

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: "var(--color-background-secondary)",
      borderRadius: "var(--border-radius-md)", padding: "1rem 1.25rem", flex: 1
    }}>
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 500, margin: 0, color: color || "var(--color-text-primary)" }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)",
        border: "0.5px solid var(--color-border-tertiary)", padding: "1.5rem",
        width: 480, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto"
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--color-text-secondary)" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ContactForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: "", email: "", phone: "", company: "", stage: "New", value: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.name.trim() && form.email.trim();
  return (
    <div>
      {[["Name", "name", "text"], ["Email", "email", "email"], ["Phone", "phone", "text"], ["Company", "company", "text"]].map(([label, key, type]) => (
        <div key={key} style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>{label}</label>
          <input type={type} value={form[key]} onChange={e => set(key, e.target.value)}
            style={{ width: "100%", boxSizing: "border-box" }} placeholder={label} />
        </div>
      ))}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Stage</label>
          <select value={form.stage} onChange={e => set("stage", e.target.value)} style={{ width: "100%" }}>
            {STAGES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Deal Value (GHS)</label>
          <input type="number" value={form.value} onChange={e => set("value", e.target.value)}
            style={{ width: "100%", boxSizing: "border-box" }} placeholder="0" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={() => valid && onSave(form)} disabled={!valid}
          style={{ background: valid ? "var(--color-text-primary)" : "var(--color-border-tertiary)", color: "var(--color-background-primary)", border: "none", cursor: valid ? "pointer" : "default" }}>
          Save Contact
        </button>
      </div>
    </div>
  );
}

function ActivityForm({ contacts, onSave, onCancel, defaultContactId }) {
  const [form, setForm] = useState({ contactId: defaultContactId || contacts[0]?.id || "", type: "Call", note: "", date: new Date().toISOString().slice(0, 10) });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.contactId && form.note.trim();
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Contact</label>
        <select value={form.contactId} onChange={e => set("contactId", Number(e.target.value))} style={{ width: "100%" }}>
          {contacts.map(c => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Type</label>
          <select value={form.type} onChange={e => set("type", e.target.value)} style={{ width: "100%" }}>
            {ACTIVITY_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Date</label>
          <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Notes</label>
        <textarea value={form.note} onChange={e => set("note", e.target.value)}
          style={{ width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 80 }} placeholder="Describe the interaction..." />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={() => valid && onSave(form)} disabled={!valid}
          style={{ background: valid ? "var(--color-text-primary)" : "var(--color-border-tertiary)", color: "var(--color-background-primary)", border: "none", cursor: valid ? "pointer" : "default" }}>
          Log Activity
        </button>
      </div>
    </div>
  );
}

export default function CRM() {
  const [tab, setTab] = useState("dashboard");
  const [contacts, setContacts] = useState(initContacts);
  const [activities, setActivities] = useState(initActivities);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("All");
  const [showAddContact, setShowAddContact] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [nextId, setNextId] = useState(100);

  const getNextId = () => { setNextId(n => n + 1); return nextId; };

  const filtered = useMemo(() => contacts.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === "All" || c.stage === filterStage;
    return matchSearch && matchStage;
  }), [contacts, search, filterStage]);

  const totalValue = contacts.reduce((s, c) => s + Number(c.value || 0), 0);
  const wonValue = contacts.filter(c => c.stage === "Closed Won").reduce((s, c) => s + Number(c.value || 0), 0);
  const stageCounts = STAGES.reduce((acc, s) => { acc[s] = contacts.filter(c => c.stage === s).length; return acc; }, {});

  const saveContact = (form) => {
    if (editContact) {
      setContacts(cs => cs.map(c => c.id === editContact.id ? { ...c, ...form, value: Number(form.value) } : c));
      setEditContact(null);
    } else {
      setContacts(cs => [...cs, { ...form, id: getNextId(), value: Number(form.value), created: new Date().toISOString().slice(0, 10) }]);
      setShowAddContact(false);
    }
  };

  const deleteContact = (id) => {
    setContacts(cs => cs.filter(c => c.id !== id));
    setActivities(as => as.filter(a => a.contactId !== id));
    if (selectedContact?.id === id) setSelectedContact(null);
  };

  const saveActivity = (form) => {
    setActivities(as => [...as, { ...form, id: getNextId(), contactId: Number(form.contactId) }]);
    setShowAddActivity(false);
  };

  const contactActivities = selectedContact ? activities.filter(a => a.contactId === selectedContact.id) : [];

  const NavBtn = ({ id, label, icon }) => (
    <button onClick={() => setTab(id)} style={{
      display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
      borderRadius: "var(--border-radius-md)", border: "none", cursor: "pointer",
      background: tab === id ? "var(--color-background-secondary)" : "transparent",
      color: tab === id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
      fontWeight: tab === id ? 500 : 400, fontSize: 14, width: "100%", textAlign: "left"
    }}>
      <i className={`ti ti-${icon}`} style={{ fontSize: 17 }} aria-hidden="true" />
      {label}
    </button>
  );

  return (
    <div style={{ display: "flex", minHeight: 580, fontFamily: "var(--font-sans)" }}>
      {/* Sidebar */}
      <div style={{
        width: 190, flexShrink: 0, borderRight: "0.5px solid var(--color-border-tertiary)",
        padding: "1.25rem 0.75rem", display: "flex", flexDirection: "column", gap: 4
      }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-tertiary)", margin: "0 0 12px 8px", letterSpacing: "0.06em", textTransform: "uppercase" }}>CRM System</p>
        <NavBtn id="dashboard" label="Dashboard" icon="layout-dashboard" />
        <NavBtn id="contacts" label="Contacts" icon="users" />
        <NavBtn id="pipeline" label="Pipeline" icon="chart-bar" />
        <NavBtn id="activities" label="Activities" icon="calendar" />
        <div style={{ flex: 1 }} />
        <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 12, marginTop: 8 }}>
          <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 8px" }}>Strategic Info Systems</p>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto" }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div>
            <h2 style={{ margin: "0 0 1.25rem", fontSize: 20 }}>Overview</h2>
            <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <MetricCard label="Total Contacts" value={contacts.length} sub={`${contacts.filter(c => c.stage === "New").length} new this month`} />
              <MetricCard label="Pipeline Value" value={`GHS ${totalValue.toLocaleString()}`} sub="All active leads" />
              <MetricCard label="Won Revenue" value={`GHS ${wonValue.toLocaleString()}`} color="#0F6E56" sub={`${contacts.filter(c => c.stage === "Closed Won").length} deals closed`} />
              <MetricCard label="Activities" value={activities.length} sub="Total interactions" />
            </div>

            <h3 style={{ fontSize: 15, margin: "0 0 12px", fontWeight: 500 }}>Pipeline by stage</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {STAGES.map(s => (
                <div key={s} style={{
                  background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)",
                  padding: "10px 16px", minWidth: 90
                }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "var(--color-text-secondary)" }}>{s}</p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 500 }}>{stageCounts[s]}</p>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 15, margin: "0 0 12px", fontWeight: 500 }}>Recent activity</h3>
            <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
              {activities.slice(-5).reverse().map((a, i) => {
                const c = contacts.find(x => x.id === a.contactId);
                return (
                  <div key={a.id} style={{
                    padding: "10px 16px", display: "flex", alignItems: "center", gap: 12,
                    borderBottom: i < 4 ? "0.5px solid var(--color-border-tertiary)" : "none",
                    background: "var(--color-background-primary)"
                  }}>
                    {c && <Avatar name={c.name} size={32} />}
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{c?.name || "Unknown"} <span style={{ fontWeight: 400, color: "var(--color-text-secondary)" }}>— {a.type}</span></p>
                      <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{a.note}</p>
                    </div>
                    <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{a.date}</span>
                  </div>
                );
              })}
              {activities.length === 0 && <p style={{ padding: "1rem", color: "var(--color-text-secondary)", fontSize: 14 }}>No activities yet.</p>}
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {tab === "contacts" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>Contacts</h2>
              <button onClick={() => setShowAddContact(true)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <i className="ti ti-plus" aria-hidden="true" /> Add Contact
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, company, email…" style={{ flex: 1 }} />
              <select value={filterStage} onChange={e => setFilterStage(e.target.value)}>
                <option value="All">All Stages</option>
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
              {filtered.length === 0 && <p style={{ padding: "1rem", color: "var(--color-text-secondary)", fontSize: 14 }}>No contacts found.</p>}
              {filtered.map((c, i) => (
                <div key={c.id} style={{
                  padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
                  borderBottom: i < filtered.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none",
                  background: "var(--color-background-primary)", cursor: "pointer"
                }} onClick={() => { setSelectedContact(c); setTab("contact-detail"); }}>
                  <Avatar name={c.name} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{c.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{c.company} · {c.email}</p>
                  </div>
                  <StageBadge stage={c.stage} />
                  <span style={{ fontSize: 13, color: "var(--color-text-secondary)", minWidth: 90, textAlign: "right" }}>GHS {Number(c.value || 0).toLocaleString()}</span>
                  <button onClick={e => { e.stopPropagation(); setEditContact(c); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}>
                    <i className="ti ti-edit" style={{ fontSize: 16 }} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); deleteContact(c.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#A32D2D" }}>
                    <i className="ti ti-trash" style={{ fontSize: 16 }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT DETAIL */}
        {tab === "contact-detail" && selectedContact && (
          <div>
            <button onClick={() => setTab("contacts")} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem", color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer", fontSize: 14 }}>
              <i className="ti ti-arrow-left" /> Back to contacts
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.5rem" }}>
              <Avatar name={selectedContact.name} size={56} />
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>{selectedContact.name}</h2>
                <p style={{ margin: "2px 0 0", color: "var(--color-text-secondary)", fontSize: 14 }}>{selectedContact.company}</p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <StageBadge stage={selectedContact.stage} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <MetricCard label="Email" value={selectedContact.email} />
              <MetricCard label="Phone" value={selectedContact.phone || "—"} />
              <MetricCard label="Deal Value" value={`GHS ${Number(selectedContact.value || 0).toLocaleString()}`} color="#0F6E56" />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Interaction history</h3>
              <button onClick={() => { setShowAddActivity(true); }} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                <i className="ti ti-plus" /> Log activity
              </button>
            </div>
            <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
              {contactActivities.length === 0 && <p style={{ padding: "1rem", color: "var(--color-text-secondary)", fontSize: 14 }}>No interactions logged yet.</p>}
              {contactActivities.map((a, i) => (
                <div key={a.id} style={{
                  padding: "10px 16px", display: "flex", gap: 12, alignItems: "flex-start",
                  borderBottom: i < contactActivities.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none",
                  background: "var(--color-background-primary)"
                }}>
                  <span style={{
                    background: STAGE_COLORS["Qualified"], color: STAGE_TEXT["Qualified"],
                    borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 500, flexShrink: 0, marginTop: 2
                  }}>{a.type}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13 }}>{a.note}</p>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{a.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PIPELINE */}
        {tab === "pipeline" && (
          <div>
            <h2 style={{ margin: "0 0 1.25rem", fontSize: 20 }}>Pipeline</h2>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
              {STAGES.map(stage => {
                const stageContacts = contacts.filter(c => c.stage === stage);
                const stageValue = stageContacts.reduce((s, c) => s + Number(c.value || 0), 0);
                return (
                  <div key={stage} style={{ minWidth: 180, flexShrink: 0 }}>
                    <div style={{ marginBottom: 8 }}>
                      <StageBadge stage={stage} />
                      <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginLeft: 6 }}>{stageContacts.length} · GHS {stageValue.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {stageContacts.map(c => (
                        <div key={c.id} onClick={() => { setSelectedContact(c); setTab("contact-detail"); }} style={{
                          background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)",
                          borderRadius: "var(--border-radius-md)", padding: "10px 12px", cursor: "pointer"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <Avatar name={c.name} size={28} />
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{c.name}</p>
                          </div>
                          <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{c.company}</p>
                          <p style={{ margin: "4px 0 0", fontSize: 12, fontWeight: 500, color: "#0F6E56" }}>GHS {Number(c.value || 0).toLocaleString()}</p>
                        </div>
                      ))}
                      {stageContacts.length === 0 && (
                        <div style={{
                          border: "0.5px dashed var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)",
                          padding: "20px 12px", textAlign: "center", color: "var(--color-text-tertiary)", fontSize: 12
                        }}>Empty</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTIVITIES */}
        {tab === "activities" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>Activities</h2>
              <button onClick={() => setShowAddActivity(true)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <i className="ti ti-plus" /> Log Activity
              </button>
            </div>
            <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
              {activities.length === 0 && <p style={{ padding: "1rem", color: "var(--color-text-secondary)", fontSize: 14 }}>No activities logged.</p>}
              {[...activities].reverse().map((a, i) => {
                const c = contacts.find(x => x.id === a.contactId);
                return (
                  <div key={a.id} style={{
                    padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
                    borderBottom: i < activities.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none",
                    background: "var(--color-background-primary)"
                  }}>
                    {c && <Avatar name={c.name} size={34} />}
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{c?.name || "Unknown"}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>{a.note}</p>
                    </div>
                    <span style={{
                      background: STAGE_COLORS["Qualified"], color: STAGE_TEXT["Qualified"],
                      borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 500
                    }}>{a.type}</span>
                    <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{a.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddContact && (
        <Modal title="Add Contact" onClose={() => setShowAddContact(false)}>
          <ContactForm onSave={saveContact} onCancel={() => setShowAddContact(false)} />
        </Modal>
      )}
      {editContact && (
        <Modal title="Edit Contact" onClose={() => setEditContact(null)}>
          <ContactForm initial={editContact} onSave={saveContact} onCancel={() => setEditContact(null)} />
        </Modal>
      )}
      {showAddActivity && (
        <Modal title="Log Activity" onClose={() => setShowAddActivity(false)}>
          <ActivityForm contacts={contacts} onSave={saveActivity} onCancel={() => setShowAddActivity(false)}
            defaultContactId={selectedContact?.id} />
        </Modal>
      )}
    </div>
  );
}
