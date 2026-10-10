// Maps the AI extraction JSON into the view-model the dashboard screens consume.
// Everything degrades gracefully when fields are null/absent — we never fabricate.

import { BAR, COMP_COLORS } from './data.js'

const MONTH_ORDER = ["August","September","October","November","December","January","February","March","April","May","June","July"];

export function normalize(result) {
  const r = result || {};
  const program = r.program || {};
  const activities = Array.isArray(r.activities) ? r.activities : [];
  const competencies = Array.isArray(r.competencies) && r.competencies.length
    ? r.competencies : inferCompetencies(activities);

  // group activities by month, preserving school-year order, unknowns last
  const byMonth = {};
  activities.forEach(a => {
    const m = a.month || "Unscheduled";
    (byMonth[m] = byMonth[m] || []).push(a);
  });
  const months = Object.keys(byMonth).sort((a, b) => {
    const ai = MONTH_ORDER.indexOf(a), bi = MONTH_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  }).map(m => [m, byMonth[m].map(a => `${a.title}·${a.category || "Activity"}`)]);

  // category counts
  const typeCounts = {};
  activities.forEach(a => { const c = a.category || "Other"; typeCounts[c] = (typeCounts[c] || 0) + 1; });

  // competency cards: count aligned activities; progress unknown pre-launch → 0
  const compCards = competencies.map(name => {
    const n = activities.filter(a => a.competency === name).length;
    return [name, 0, n];
  });

  // pillars from r.pillars, else from distinct categories
  const pillars = (Array.isArray(r.pillars) && r.pillars.length
    ? r.pillars.map(p => p.name)
    : Object.keys(typeCounts)).slice(0, 8).map(name => [name, 0]);

  const districtItems = activities.map(a => ({
    title: a.title,
    flag: a.needs_review ? (a.review_note || "needs review") : (a.recurrence ? "recurrence detected" : null),
    deets: [
      a.category && `Category: ${a.category}`,
      a.audience && `Audience: ${a.audience}`,
      a.recurrence && `Recurrence: ${a.recurrence}`,
      a.due ? `Due: ${a.due}` : (a.month ? `Month: ${a.month}` : "Due: not found in source — left blank"),
      a.evidence && `Evidence: ${a.evidence}`,
    ].filter(Boolean).join(" · "),
    src: a.source_reference || "source reference unavailable",
  }));

  const aiItems = (Array.isArray(r.ai_recommendations) ? r.ai_recommendations : []).map(x => ({
    title: x.title,
    deets: `Maps to competency: ${x.maps_to || "—"} · ${x.rationale || ""}`,
    src: "SchoolSims content library",
  }));

  const flagged = activities.filter(a => a.needs_review).length;

  return {
    program: {
      name: program.name || "Imported Program",
      account: program.organization || "Imported from document",
      term: program.term || "Term not specified",
      participants: program.participants || "—",
      activities: activities.length,
      competenciesCount: competencies.length,
      overallCompletion: 0,
      status: "Draft — not yet published",
    },
    months, typeCounts, competencies, compCards, pillars,
    districtItems, aiItems,
    counts: { district: activities.length, ai: aiItems.length, flagged, published: 0 },
    projects: Array.isArray(r.projects) ? r.projects : [],
    risks: Array.isArray(r.risks) ? r.risks : [],
    narrative: r.narrative || "No narrative was generated for this document.",
    raw: r,
  };
}

function inferCompetencies(activities) {
  const set = new Set();
  activities.forEach(a => { if (a.competency) set.add(a.competency); });
  return [...set];
}

export { BAR, COMP_COLORS };
