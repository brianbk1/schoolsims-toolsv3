// Generalized sample data — no hard-coded district terminology (dev rule).
export const BAR = ["#8B1A2E","#1E2D6B","#2E6DB4","#5A3472","#2E6B50","#8B5A1A"];
export const MONTH_COLORS = ["#8B1A2E","#1E2D6B","#9E2235","#253580","#7A1728","#172560","#8B1A2E","#1E2D6B","#9E2235","#253580"];

export const COMP_COLORS = {
  "Lead with Courage":"#8B1A2E","Build Culture":"#1E2D6B","Lead Academics":"#2E6DB4",
  "Develop People":"#5A3472","Manage Operations":"#2E6B50","Beliefs & Values":"#8B5A1A",
};

export const program = {
  name: "Aspiring Leaders Program 2026–27",
  account: "Sample District · Cohort A",
  term: "Aug 2026 – May 2027",
  participants: 42,
  activities: 27,
  competenciesCount: 6,
  overallCompletion: 18,
  status: "Published & Active",
};

export const sourceDocs = [
  { name:"Leadership_Development_Handbook.pdf", meta:"37 pages · version retained", status:"Ingested", icon:"📕" },
  { name:"PD_Calendar_2026-27.xlsx", meta:"4 sheets · version retained", status:"Ingested", icon:"📘" },
  { name:"Induction_Program_Requirements.docx", meta:"12 pages · processing…", status:"Extracting", icon:"📙" },
];

// Review items — district-source vs AI-recommended kept distinct (dev rule)
export const districtItems = [
  { title:"Attend Program Orientation", deets:"Category: Workshop · Audience: All Participants · Due: Aug · Evidence: Attendance", src:"Leadership_Development_Handbook.pdf · p. 4" },
  { title:"Monthly Coaching Session", flag:"recurrence detected", deets:"Category: Coaching/Mentoring · Recurrence: Monthly (Sep–May) · Evidence: Coaching Note · Reviewer required", src:'PD_Calendar_2026-27.xlsx · Sheet "Coaching"' },
  { title:"Improvement Project — Charter, Milestones & Presentation", flag:"project pattern", deets:"Category: Project · Milestones: Charter → Approval → Mid-point → Final Presentation → Reflection · Evidence: Artifact + Approval sign-off", src:"Leadership_Development_Handbook.pdf · pp. 18–22" },
  { title:"Develop Individual Growth Plan", flag:"low confidence — verify dates", deets:"Category: Planning · Audience: All · Due: not found in source — left blank · Evidence: Artifact/File", src:"Induction_Program_Requirements.docx · section unclear" },
];

export const aiItems = [
  { title:"Simulation: Difficult Teacher Conversation", deets:"Maps to competency: Lead with Courage · reinforces the courageous-conversations workshop in the plan", src:"links to SchoolSims content library" },
  { title:"Simulation: Budget Crisis Response", deets:"Maps to competency: Manage Operations · aligns to the operations learning module", src:"links to SchoolSims content library" },
];

export const pillars = [
  ["Professional Development",20],["Hands-On Practice",22],["Improvement Project",25],
  ["Coaching",15],["Community of Practice",10],["70/20/10 Plan",12],
];

export const rollup = [
  ["Not Started",612,"#6B7A9A"],["In Progress",284,"#2E6DB4"],["Submitted",96,"#8B5A1A"],
  ["Awaiting Approval",41,"#A0620A"],["Complete",204,"#2E6B50"],["Overdue",97,"#8B1A2E"],
];

export const alerts = [
  ["high","97 assignments overdue cohort-wide","Across coaching evidence and the data-analysis activity.","due_date < today AND status ≠ complete"],
  ["","41 evidence items awaiting approval","Reviewer queue is holding up completion counts.","status = submitted AND approval_required"],
  ["","11 participants missing monthly coaching note","Recurring coaching evidence absent for the current month.","recurring_evidence_absent(this_month)"],
  ["","6 Improvement Project charters unapproved","Past target approval date; blocks mid-point milestone.","milestone.approval_required AND overdue"],
];

export const months = [
  ["August",["Program Orientation·Workshop","Review Expectations·Planning","Meet Coach·Coaching","Project Charter·Project"]],
  ["September",["Project Approval·Project","Essential Experience·Experience","Coaching #1·Coaching","Growth Plan·Planning"]],
  ["October",["Courageous Conversations·Workshop","Coaching #2·Coaching","Growth Plan Approval·Planning"]],
  ["November",["Data Analysis·Assessment","Essential Experience·Experience","Coaching #3·Coaching"]],
  ["December",["Mock Interview·Assessment","Reflection·Reflection"]],
  ["January",["Operations Module·Workshop","Budget Reflection·Reflection"]],
  ["February",["Culture Plan·Project","Community Engagement·Project"]],
  ["March",["Talent Dev Plan·Planning","Coaching Evidence·Reflection"]],
  ["April",["Supplemental Learning·Experience","Final Artifacts·Project"]],
  ["May",["Project Presentation·Assessment","Year-End Reflection·Reflection"]],
];

export const competencies = [
  ["Lead with Courage",22,4],["Build Culture",18,2],["Lead Academics",15,6],
  ["Develop People",20,6],["Manage Operations",12,2],["Beliefs & Values",25,6],
];

export const heatParts = ["J. Rivera","M. Chen","A. Okafor","S. Patel","L. Gomez","D. Brooks"];
export const heatCats = ["Workshop","Coaching","Project","Assessment","Reflection","70/20/10"];
export const heatStatuses = [["#2E6B50","C"],["#2E6DB4","IP"],["#8B5A1A","S"],["#8B1A2E","OD"],["#C3CAD9","NS"]];

export const participant = {
  name:"Jordan Rivera", role:"Assistant Principal · Lincoln Middle · Cohort A",
  completion:61, overdue:2, awaiting:3, completed:14,
  activities:[
    ["Program Orientation","Workshop","Attendance","st-approved","Approved"],
    ["Coaching Session #3","Coaching","Coaching Note","st-submitted","Submitted"],
    ["Improvement Project — Charter","Project","Artifact + Sign-off","st-approved","Approved"],
    ["Improvement Project — Mid-point","Project","Artifact","st-progress","In Progress"],
    ["Data Analysis Activity","Assessment","Artifact/File","st-overdue","Overdue"],
    ["Growth Plan Update","Planning","Artifact/File","st-overdue","Overdue"],
    ["Sim: Difficult Teacher Conversation","Simulation","Native SchoolSims","st-complete","Complete"],
  ],
};

export const narrative = "As of the reporting date, the Aspiring Leaders Program shows 18% overall completion across 42 participants and 27 published activities. Completion is strongest in the Improvement Project pillar (25% of assignments complete) and lowest in Community of Practice (10%). 97 assignments are overdue and 41 await reviewer approval, concentrated in coaching evidence and the data-analysis activity. These figures reflect implementation progress and evidence status only; they do not by themselves demonstrate competency growth. The highest-leverage administrative action is clearing the approval queue and following up on overdue coaching evidence before the next reporting cycle.";

export const risks = [
  ["Risk 1","97 overdue assignments cohort-wide.","due_date < today AND status ≠ complete"],
  ["Risk 2","11 participants missing a monthly coaching note.","recurring coaching evidence absent for current month"],
  ["Risk 3","6 Improvement Project charters unapproved past target.","milestone approval_required AND overdue"],
];

export const recs = [
  "Clear the 41-item approval queue — it is blocking completion counts.",
  "Send targeted follow-up to the 11 participants missing coaching evidence.",
  "Confirm Improvement Project charter approvals before the mid-point milestone opens.",
];

export const simRecs = [
  ["Lead with Courage","Difficult Teacher Conversation · Parent Conflict · Staff Performance"],
  ["Develop People","Teacher Coaching Cycle · Observation & Feedback · Mentoring New Staff"],
  ["Manage Operations","Budget Crisis · Scheduling Conflict · Safety Incident"],
];
