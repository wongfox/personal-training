import type { JourneySeed } from "../types";

export const leadTheRoom: JourneySeed = {
  slug: "lead-the-room",
  title: "Lead the Room",
  subtitle: "Move decisions, people and agreements forward with calm clarity.",
  description:
    "Nine practical sessions on the everyday mechanics of leadership: meetings that actually decide, feedback that changes behaviour, delegation without micromanaging, and influence and negotiation when you don't hold the title or all the cards.",
  category: "leadership",
  difficulty: "intermediate",
  order: 3,
  modules: [
    /* ───────────────────────── Module 1 ───────────────────────── */
    {
      title: "Meetings That Decide",
      description:
        "Turn meetings from status theatre into the place where decisions get made, owned and followed through.",
      lessons: [
        {
          slug: "lead-meetings-that-decide",
          title: "Run meetings that end in decisions",
          description: "Frame every agenda item as a question to be answered so the meeting has a finish line.",
          category: "leadership",
          difficulty: "intermediate",
          estimatedMinutes: 10,
          content: {
            hook: "Most recurring meetings end the way they began: everyone informed, nothing decided. The problem usually starts in the invite, not the room.",
            whyItMatters:
              "A meeting without a stated decision drifts toward updates, because updates are the safest thing to talk about. That burns hours of attention and pushes real choices into hallways and private messages. Leaders who frame meetings around decisions get faster teams and fewer reopened debates.",
            coreConcept: {
              title: "Agenda items are questions, not topics",
              body: [
                "A topic like 'Q3 pricing' invites a tour of opinions. A question like 'Do we raise the starter plan price in Q3, yes or no?' tells everyone what done looks like. The question becomes the meeting's finish line.",
                "Before sending the invite, write the decision you need, who makes it, and what input you need from each attendee. If you can't write the question, you probably need a short document or a one-on-one, not a meeting.",
                "Send pre-reads early and open by restating the question. Then spend the live time on disagreement and trade-offs, not on reading slides aloud. Status updates can travel in writing.",
              ],
              keyPoints: [
                "Rewrite every agenda topic as a question with a clear answer format.",
                "Name the decision-maker in the invite.",
                "Move pure status updates out of the meeting.",
                "If you can't state the question, don't schedule the meeting yet.",
              ],
            },
            expertInsight: {
              text: "Andy Grove treated meetings as a core tool of managerial work rather than a distraction from it. He distinguished routine process meetings from mission-oriented meetings called to solve a specific problem, and stressed that whoever calls a mission-oriented meeting must know exactly what it is meant to accomplish.",
              source: "Andy Grove",
              sourceDetail: "High Output Management (1983)",
            },
            example: {
              situation: "Marco, a team lead, runs a weekly 60-minute product sync with eight people.",
              before:
                "Agenda: 'Roadmap, onboarding metrics, Q3 pricing.' The hour fills with updates; pricing gets ten rushed minutes and is pushed to next week. Again.",
              after:
                "Agenda: '1) Do we ship onboarding v2 before or after the pricing change? Decider: Marco. 2) Starter plan: raise the price in Q3, yes or no? Decider: Lena, with input from Sales and Finance.' Metrics go out as a written note the day before.",
              whyItWorks:
                "Each item has an answer format and an owner, so discussion converges instead of wandering. People arrive having read the numbers and ready to argue the trade-off.",
            },
            reflectionPrompt:
              "Think of your next recurring meeting. What decision should it produce, and who should own that decision?",
          },
          exercise: {
            title: "Turn a topic into a decision",
            description: "Rewrite a vague agenda item so the meeting knows exactly what it must decide.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this agenda item as a clear decision question. Name who decides and, if useful, the options on the table.",
              original: "Agenda item 3: Discuss the vendor situation and next steps for the analytics tool.",
              tips: [
                "Start with the decision: 'Do we…' or 'Which…'.",
                "Make the answer format obvious (yes/no, option A or B).",
                "Name the decision-maker and the input you need.",
              ],
              maxWords: 40,
              keywords: ["decide", "decision", "do we", "which", "decider"],
              modelAnswer:
                "Decision: Do we renew our current analytics vendor for 12 months or switch to the cheaper alternative by June 1? Decider: Priya. Input needed: cost comparison from Finance, migration risk from Data.",
            },
          },
          quiz: [
            {
              prompt: "You're scheduling a meeting about a delayed launch. Which agenda line best sets it up to decide something?",
              options: [
                "Launch status and blockers",
                "Open discussion on how the launch is going",
                "Do we slip the launch two weeks or cut the reporting feature to hold the date? Decider: Ana",
                "Review of the launch timeline with the whole team",
              ],
              correctIndex: 2,
              explanation:
                "A decision question with clear options and a named decider gives the meeting a finish line. The others invite updates or open-ended talk that rarely converges.",
              conceptKey: "lead-agenda-as-question",
            },
            {
              prompt: "Half of your weekly meeting is people reading status updates aloud. What's the most effective change?",
              options: [
                "Limit each update to one minute",
                "Ask people to bring slides so updates look clearer",
                "Cancel the meeting permanently",
                "Send updates in writing beforehand and use the meeting for open decisions",
              ],
              correctIndex: 3,
              explanation:
                "Updates travel well in writing; live time is most valuable for disagreement and trade-offs. Shorter updates help a little but keep the meeting about status.",
              conceptKey: "lead-async-updates",
            },
            {
              prompt: "You want to call a meeting but can't state the decision it should produce. What does that most likely signal?",
              options: [
                "You need more attendees to figure it out",
                "The problem isn't ready for a meeting; clarify it in writing or one-on-one first",
                "The meeting should be longer",
                "The group should decide what to discuss when it meets",
              ],
              correctIndex: 1,
              explanation:
                "If you can't write the question, the group will spend the meeting discovering it, expensively. A short document or conversation usually sharpens the problem first.",
              conceptKey: "lead-meeting-readiness",
            },
          ],
          action: {
            title: "Reframe one upcoming meeting",
            description:
              "Pick one meeting you own or attend this week. Rewrite its agenda, or suggest a rewrite to the organiser, so each item is a decision question with a named decider. Move at least one status update into a written note.",
            successCriteria:
              "The updated agenda is sent or shared, with at least one item phrased as a question and a named decision-maker.",
            difficulty: "intermediate",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "lead-who-decides",
          title: "Make it clear who decides",
          description: "Separate who gives input from who makes the call, so decisions stop stalling in consensus.",
          category: "leadership",
          difficulty: "intermediate",
          estimatedMinutes: 10,
          content: {
            hook: "When everyone has a say and no one has the call, decisions don't get made. They get postponed.",
            whyItMatters:
              "Unclear decision rights are one of the most common reasons capable teams move slowly. People either wait for a consensus that never arrives or make calls that get quietly overturned later. Naming the decider up front protects both speed and trust.",
            coreConcept: {
              title: "Input is not a vote",
              body: [
                "Important decisions involve several roles: people who recommend, people who must agree, people whose input is sought, people who carry it out, and one person who decides. Most friction comes from confusing 'my input was heard' with 'I have a veto.'",
                "Say the roles out loud before the discussion: 'Lena decides; Sales and Finance give input; we'll decide by Friday.' People can then argue hard without worrying that disagreement means deadlock.",
                "Once the call is made, the decider explains the reasoning, including which input changed their mind and which didn't. People accept a decision that went against them far more readily when they can see they were genuinely heard.",
              ],
              keyPoints: [
                "Name one decider per decision, before the debate.",
                "Make clear who gives input and who, if anyone, must approve.",
                "Set a decision deadline.",
                "Close by explaining the reasoning, especially to those who disagreed.",
              ],
            },
            expertInsight: {
              text: "Paul Rogers and Marcia Blenko of Bain & Company described how organisations bottleneck when decision roles are unclear. They proposed assigning explicit roles, such as recommend, agree, perform, input and decide, with the core principle that one person clearly owns the final decision.",
              source: "Paul Rogers & Marcia Blenko",
              sourceDetail: "'Who Has the D?', Harvard Business Review (2006)",
            },
            example: {
              situation:
                "Sofia, an engineering manager, must choose between two database migration plans. Three senior engineers hold strong, opposing views.",
              before:
                "She schedules a discussion 'to align.' After an hour of circular debate she suggests everyone 'keep thinking about it.' Two weeks later the same debate restarts.",
              after:
                "She opens with: 'Tom will recommend a plan by Wednesday. Ravi and Mei, send me your strongest objections in writing. I'll decide on Thursday and explain why.' On Thursday she picks Tom's plan with one of Mei's safeguards and walks the team through the trade-off.",
              whyItWorks:
                "Clear roles let people disagree openly without fearing stalemate. A deadline and a reasoned explanation make the decision stick.",
            },
            reflectionPrompt:
              "Which decision on your team is stuck right now? Who should own it, and does that person know?",
          },
          exercise: {
            title: "Untangle a stalled decision",
            description: "Choose the move that gets a stuck cross-team decision moving again.",
            config: {
              type: "choice",
              scenario:
                "Your team and the marketing team have debated a feature's launch date across three meetings. Both leads have opinions, the VP has said 'work it out together', and nobody has written down who actually decides.",
              question: "What's the strongest next move?",
              options: [
                {
                  text: "Schedule a fourth meeting with everyone and push harder for consensus.",
                  quality: "weak",
                  feedback:
                    "More meetings with the same unclear roles usually produce the same stalemate. Consensus is a hope, not a decision process.",
                },
                {
                  text: "Ask the VP to decide on the spot at the next meeting, without a prepared recommendation.",
                  quality: "ok",
                  feedback:
                    "Escalating does clarify the decider, but without a recommendation the VP is likely to decide on thin information or send it back.",
                },
                {
                  text: "Propose roles in writing: you recommend a date with marketing's input, the VP decides by Friday, and both teams commit to the outcome.",
                  quality: "best",
                  feedback:
                    "This names a recommender, a decider and a deadline. It turns an open debate into a process with a finish line, without grabbing authority you don't have.",
                },
                {
                  text: "Pick the date yourself and announce it, since your team builds the feature.",
                  quality: "weak",
                  feedback:
                    "It feels fast, but a unilateral call is likely to be reopened by marketing or the VP. A decision that gets overturned costs more time than it saved.",
                },
              ],
            },
          },
          quiz: [
            {
              prompt: "A colleague gave input on your decision and is upset you went another way. What best preserves trust?",
              options: [
                "Reopen the decision so they feel included",
                "Explain what you weighed, how their input factored in, and why you chose differently",
                "Remind them that you were the decider",
                "Say nothing; the decision speaks for itself",
              ],
              correctIndex: 1,
              explanation:
                "People accept unfavourable decisions more readily when they can see their input was genuinely considered. Reopening invites endless relitigation; pulling rank erodes trust.",
              conceptKey: "lead-explain-the-call",
            },
            {
              prompt: "Which statement best sets up a clear decision process?",
              options: [
                "Let's all align on this by the end of the week.",
                "Everyone weighs in and we go with the majority.",
                "Let's keep discussing until it feels right.",
                "Jun decides by Thursday; design and support give input; legal must sign off on the terms.",
              ],
              correctIndex: 3,
              explanation:
                "It names one decider, the input roles, the one genuine approval and a deadline. 'Align' and majority votes leave ownership vague.",
              conceptKey: "lead-decision-roles",
            },
            {
              prompt: "Why name the decider before the debate rather than after it?",
              options: [
                "So people can argue openly without fearing deadlock or hidden politics",
                "So the decider can skip listening to input",
                "So the meeting is shorter because there's less disagreement",
                "So nobody else feels responsible for the outcome",
              ],
              correctIndex: 0,
              explanation:
                "Knowing who decides lets participants focus on making the best case instead of jockeying for control. It doesn't reduce the need to listen; it makes listening count.",
              conceptKey: "lead-decider-first",
            },
          ],
          action: {
            title: "Name the decider on one open decision",
            description:
              "Find one decision on your team that has been drifting. Send a short message proposing who recommends, who gives input, who decides, and by when.",
            successCriteria: "A message is sent that names a single decider and a decision date for one real, open decision.",
            difficulty: "intermediate",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "lead-close-the-loop",
          title: "End every meeting with owners and dates",
          description: "Close meetings in a way that turns discussion into named, checkable commitments.",
          category: "leadership",
          difficulty: "intermediate",
          estimatedMinutes: 8,
          content: {
            hook: "A meeting can reach a great decision and still fail, because nobody wrote down who does what next.",
            whyItMatters:
              "Decisions decay quickly when they live only in people's memories. Each attendee walks away with a slightly different version of what was agreed. A disciplined two-minute close prevents weeks of 'I thought you were handling that.'",
            coreConcept: {
              title: "The two-minute close",
              body: [
                "Reserve the last few minutes of every meeting for the close. Restate each decision in one sentence, then turn it into actions with a single owner and a date. 'The team will look into it' is not an action; 'Ravi sends the revised quote to the client by Tuesday' is.",
                "Phrase actions as concrete next steps, not intentions. 'Think about pricing' can't be checked off; 'draft three pricing options on one page' can.",
                "Within a few hours, send a short written recap: decisions, actions, owners, dates and open questions. Start the next meeting by checking those actions before adding new ones.",
              ],
              keyPoints: [
                "Restate decisions aloud before people leave.",
                "Every action gets one owner and one date.",
                "Write actions as concrete, visible next steps.",
                "Send the recap the same day and review it next time.",
              ],
            },
            expertInsight: {
              text: "David Allen's productivity method centres on defining the 'next action': the very next physical, visible step that moves something forward. Vague commitments stall because nobody knows what to do first; naming a concrete next action removes that friction.",
              source: "David Allen",
              sourceDetail: "Getting Things Done (2001)",
            },
            example: {
              situation: "Priya, a project lead, wraps up a client escalation call with four colleagues.",
              before:
                "'Great discussion, everyone. Let's follow up on all this and reconnect next week.' A week later, two people have drafted the same email and nobody has called the client.",
              after:
                "'Let me close. Decision: we offer a two-week extension, not a discount. Actions: Ravi emails the client today by 5 p.m.; Mei updates the project plan by Wednesday; I brief our VP tomorrow morning. Recap coming within the hour.'",
              whyItWorks:
                "Saying it aloud surfaces disagreement while everyone is still in the room. Single owners and dates make follow-up checkable instead of assumed.",
            },
            reflectionPrompt:
              "In your last meeting, what was agreed, and could everyone present name the same owners and dates?",
          },
          exercise: {
            title: "Sequence a strong meeting close",
            description: "Put the steps of an effective meeting close, and its follow-through, in the right order.",
            config: {
              type: "order",
              instruction: "Arrange these steps in the order you'd run them at the end of a meeting and afterwards.",
              items: [
                "Signal the close a few minutes before time is up",
                "Restate each decision in one sentence",
                "Assign every action a single owner and a date",
                "Confirm open questions and who will resolve them",
                "Send a written recap the same day",
                "Review the actions at the start of the next meeting",
              ],
              explanation:
                "You first create time for the close, then lock the decisions, then convert them into owned actions and flag what's unresolved. The recap makes it durable, and reviewing it next time makes it accountable.",
            },
          },
          quiz: [
            {
              prompt: "Which is a well-formed meeting action?",
              options: [
                "Marketing to look into the webinar idea",
                "We should think more about churn",
                "Lucas sends a draft webinar outline to the team by Thursday noon",
                "Follow up on the budget as needed",
              ],
              correctIndex: 2,
              explanation:
                "It has one owner, a concrete deliverable and a deadline. The others are intentions nobody can check off.",
              conceptKey: "lead-well-formed-action",
            },
            {
              prompt: "Why restate decisions aloud before people leave the meeting?",
              options: [
                "To make the meeting feel more formal",
                "To catch different interpretations while everyone is still present",
                "To give the facilitator the last word",
                "To avoid having to write a recap",
              ],
              correctIndex: 1,
              explanation:
                "People often leave with subtly different versions of the same decision. Saying it aloud exposes the gap when it is cheapest to fix.",
              conceptKey: "lead-restate-decisions",
            },
            {
              prompt: "Two actions from last week's meeting weren't done. What's the most useful response at the next meeting?",
              options: [
                "Skip them and focus on new topics",
                "Quietly reassign them all to yourself",
                "Save it for the next performance review",
                "Open by reviewing them: confirm the owner, remove blockers and reset a realistic date",
              ],
              correctIndex: 3,
              explanation:
                "Reviewing actions first signals that commitments matter and surfaces blockers early. Skipping them teaches the team that recaps are optional.",
              conceptKey: "lead-review-actions",
            },
          ],
          action: {
            title: "Run a two-minute close",
            description:
              "In your next meeting, ask for two minutes at the end. Restate the decisions, name an owner and a date for each action, then send a short written recap within a few hours.",
            successCriteria: "A recap is sent listing at least one decision and every action with a single owner and a date.",
            difficulty: "intermediate",
            estimatedMinutes: 10,
          },
        },
      ],
    },

    /* ───────────────────────── Module 2 ───────────────────────── */
    {
      title: "Feedback and Delegation",
      description:
        "Help people improve, hand off real ownership and make it safe for your team to tell you the truth.",
      lessons: [
        {
          slug: "lead-feedback-people-act-on",
          title: "Give feedback people act on",
          description: "Make feedback specific, caring and direct so it changes what people do next.",
          category: "leadership",
          difficulty: "intermediate",
          estimatedMinutes: 12,
          content: {
            hook: "Vague praise gets forgotten and vague criticism gets resented. Either way, nothing changes.",
            whyItMatters:
              "Most people want to get better, but they can't act on 'great job' or 'be more strategic.' Feedback that names a concrete behaviour and its effect gives them something to repeat or adjust tomorrow. Few leadership habits have more leverage.",
            coreConcept: {
              title: "Situation, behaviour, impact, and care",
              body: [
                "Useful feedback has three parts: the situation (when and where), the specific behaviour you observed, and the impact it had. 'In Tuesday's client call, you interrupted the client twice while they explained the issue, and they went quiet for the rest of the call' is something a person can work with.",
                "Directness is a form of respect. Softening a message until it disappears, or burying it in praise, protects your comfort at the other person's expense.",
                "End with a forward-looking request or question rather than a verdict, and invite their view, because you may be missing context. Give feedback soon, keep criticism private, and be as specific with praise as with criticism.",
              ],
              keyPoints: [
                "Name the situation, the observable behaviour and its impact.",
                "Describe actions, not personality traits.",
                "Be direct because you care, not despite it.",
                "Close with a clear request or a genuine question.",
              ],
            },
            expertInsight: {
              text: "Kim Scott frames good feedback along two dimensions: caring personally about the person and challenging them directly. Caring without challenging drifts into what she calls ruinous empathy, while challenging without caring becomes obnoxious aggression.",
              source: "Kim Scott",
              sourceDetail: "Radical Candor (2017)",
            },
            example: {
              situation:
                "Daniel, a design lead, needs to address a junior designer's presentations, which run long and bury the recommendation.",
              before: "'Your presentations are a bit unfocused. Maybe try to be more concise? But overall, great work, really!'",
              after:
                "'In yesterday's review, the recommendation came on slide 14 and the VP left before we got there, so we didn't get a decision. Next time, could you put the recommendation on slide one? What led you to build it that way?'",
              whyItWorks:
                "It names the moment, the behaviour and the real consequence, then asks for a specific change and invites the designer's perspective. Nothing in it is about personality.",
            },
            reflectionPrompt:
              "What feedback have you been holding back from someone? What specific behaviour and impact would you name?",
          },
          exercise: {
            title: "Make the feedback usable",
            description: "Turn a vague, over-softened comment into feedback someone can act on.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this feedback using situation, behaviour and impact. End with a clear request or a question.",
              original:
                "Hey, just a small thing, and it's probably not a big deal, but sometimes you come across as a bit negative in meetings. Anyway, you're doing great overall!",
              tips: [
                "Name a specific meeting or moment.",
                "Describe what they did, not who they are.",
                "State the impact on the team or the outcome.",
                "Close with a request or a question.",
              ],
              maxWords: 60,
              keywords: ["meeting", "when you", "next time", "impact", "could you"],
              modelAnswer:
                "In this morning's planning meeting, you rejected three ideas before their owners finished explaining them. After that, two people stopped contributing. Next time, could you ask one question about an idea before critiquing it? I'd also like to hear how that meeting felt from your side.",
            },
          },
          quiz: [
            {
              prompt: "Which comment is the most actionable?",
              options: [
                "You need to be more of a team player.",
                "In today's stand-up you flagged the blocker early, which let Ana reroute her work. Keep doing that.",
                "Great job lately, keep it up!",
                "You're very detail-oriented.",
              ],
              correctIndex: 1,
              explanation:
                "Positive feedback needs the same specificity as criticism. Naming the moment, the behaviour and the impact tells the person exactly what to repeat.",
              conceptKey: "lead-specific-praise",
            },
            {
              prompt:
                "A manager avoids telling a well-liked employee that their reports contain recurring errors, to keep the relationship warm. In Kim Scott's terms, this is:",
              options: ["Radical candor", "Obnoxious aggression", "Ruinous empathy", "Psychological safety"],
              correctIndex: 2,
              explanation:
                "Caring without challenging leaves the person unaware of a problem that will hurt them later. Real care includes saying the hard thing.",
              conceptKey: "lead-ruinous-empathy",
            },
            {
              prompt: "Why end critical feedback with a question like 'What was your thinking there?'",
              options: [
                "To soften the message so it feels less direct",
                "To let them decide whether the feedback applies",
                "To avoid having to give a clear recommendation",
                "To surface context you may lack and make the fix a shared problem",
              ],
              correctIndex: 3,
              explanation:
                "You see behaviour, not intent or constraints. Asking keeps the message direct while inviting information that might change the right fix.",
              conceptKey: "lead-feedback-inquiry",
            },
          ],
          action: {
            title: "Deliver one piece of specific feedback",
            description:
              "Today, give one person feedback, positive or constructive, that names the situation, the behaviour and its impact, and ends with a request or a question. In person, on a call or in a short message.",
            successCriteria:
              "You delivered feedback in which a neutral observer could identify a specific moment, a behaviour and an impact.",
            difficulty: "intermediate",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "lead-delegate-outcomes",
          title: "Delegate the outcome, not the task",
          description: "Hand off work with clear intent, constraints and authority so people can truly own it.",
          category: "leadership",
          difficulty: "intermediate",
          estimatedMinutes: 12,
          content: {
            hook: "If you have to explain every step, you haven't delegated. You've added a middle person to your own to-do list.",
            whyItMatters:
              "Leaders who delegate tasks become bottlenecks, because every judgement call flows back to them. Delegating the outcome, with the reason behind it, lets people make good decisions you didn't anticipate. It's how you scale your impact and grow your team at the same time.",
            coreConcept: {
              title: "Intent, constraints, authority, check-ins",
              body: [
                "Start with the outcome and why it matters: what success looks like and who it's for. When people understand the purpose, they can adapt sensibly when the plan meets reality.",
                "Then name the constraints, such as deadline, budget and non-negotiables, and the level of authority: decide and inform you, recommend for your approval, or explore options first. Mismatched authority is where most delegation goes wrong.",
                "Finally, agree check-in points that match the person's experience with this kind of task. A seasoned owner may need one checkpoint; someone new to the work may need a quick review of their plan before starting.",
              ],
              keyPoints: [
                "Lead with the outcome and the reason behind it.",
                "Spell out constraints and non-negotiables.",
                "Be explicit about decision authority.",
                "Match check-ins to experience with this specific task.",
              ],
            },
            expertInsight: {
              text: "Military doctrine uses 'commander's intent': a short statement of an operation's purpose and desired end state, so people on the ground can act sensibly when the detailed plan breaks down. Chip and Dan Heath brought the idea into business as a way to keep everyone focused on what matters most.",
              source: "Commander's intent (military doctrine)",
              sourceDetail: "Popularised in Made to Stick by Chip & Dan Heath (2007)",
            },
            example: {
              situation: "Hannah, an operations manager, needs a new supplier for packaging materials.",
              before:
                "'Can you get three quotes from packaging suppliers and send them to me?' Her report sends three quotes. Hannah then realises none meet the recyclability requirement she never mentioned.",
              after:
                "'We need a new packaging supplier by March so we can cut costs without breaking our recyclability commitment. Spend must come in below what we pay now, and recyclable materials are non-negotiable. You can shortlist and negotiate; I'll sign the contract. Let's review your shortlist next Friday.'",
              whyItWorks:
                "Her report now knows the goal, the hard constraints and where their authority ends, so they can make judgement calls without coming back for every question.",
            },
            reflectionPrompt:
              "What task are you holding onto that someone else could own if you gave them the intent and the authority?",
          },
          exercise: {
            title: "Write a delegation brief",
            description: "Structure a handoff so someone can own the outcome, not just the steps.",
            config: {
              type: "structure",
              framework: "Delegation brief",
              instruction:
                "Pick a real task you could hand off this week. Fill in each part of the brief the way you'd say it to the person.",
              context:
                "Keep each part short enough to say in one breath. If you can't fill a slot, that's a gap the other person would have hit later.",
              slots: [
                {
                  key: "outcome",
                  label: "Outcome and why",
                  hint: "What does done look like, and why does it matter?",
                  maxWords: 35,
                },
                { key: "constraints", label: "Constraints", hint: "Deadline, budget, non-negotiables.", maxWords: 30 },
                {
                  key: "authority",
                  label: "Authority",
                  hint: "Decide and inform me, recommend for approval, or explore first?",
                  maxWords: 25,
                },
                { key: "checkins", label: "Check-ins", hint: "When and how will you touch base?", maxWords: 20 },
              ],
            },
          },
          quiz: [
            {
              prompt:
                "You delegate a client report and it comes back missing the one insight the client cares about. What most likely went wrong?",
              options: [
                "The person lacked the skills for the task",
                "You described the task but not the outcome and why it mattered",
                "You gave them too much authority",
                "You scheduled too many check-ins",
              ],
              correctIndex: 1,
              explanation:
                "Without the purpose, people optimise for completing the task as described. Sharing the 'why' lets them prioritise what matters to the client.",
              conceptKey: "lead-delegate-intent",
            },
            {
              prompt: "A team member is experienced overall but new to vendor negotiations. Which check-in approach fits best?",
              options: [
                "No check-ins; trust them completely",
                "Daily status updates until it's done",
                "Review their negotiation plan before the first call, then check in after key milestones",
                "Run the negotiation yourself and let them observe",
              ],
              correctIndex: 2,
              explanation:
                "Oversight should match experience with this specific task, not general seniority. An early plan review catches gaps while leaving them in charge.",
              conceptKey: "lead-calibrate-checkins",
            },
            {
              prompt: "Which phrase defines authority most clearly?",
              options: [
                "Handle it however you think is best, but run everything by me.",
                "Feel free to own this.",
                "Let me know how it goes.",
                "You can choose the vendor within the agreed budget; anything above it, bring me a recommendation.",
              ],
              correctIndex: 3,
              explanation:
                "It draws a clear line between what they decide and what needs approval. Vague or contradictory authority causes either paralysis or overreach.",
              conceptKey: "lead-delegate-authority",
            },
          ],
          action: {
            title: "Delegate one outcome today",
            description:
              "Choose one task you'd normally do yourself or micromanage. Hand it off using the brief: outcome and why, constraints, authority, and one agreed check-in.",
            successCriteria:
              "The other person can repeat back the outcome, the key constraint and what they're allowed to decide, and a check-in time is agreed.",
            difficulty: "intermediate",
            estimatedMinutes: 15,
          },
        },
        {
          slug: "lead-safe-to-speak-up",
          title: "Make it safe to speak up",
          description: "Invite dissent and bad news early through how you ask and how you respond.",
          category: "leadership",
          difficulty: "intermediate",
          estimatedMinutes: 10,
          content: {
            hook: "If your team only brings you good news, it's not because everything is going well.",
            whyItMatters:
              "Problems are cheapest to fix when someone first notices them. If raising a concern feels risky, people stay quiet and issues surface late, when they're expensive. Leaders shape that risk calculation every day through small signals.",
            coreConcept: {
              title: "Questions invite, reactions decide",
              body: [
                "People decide whether to speak up based on what happened the last time someone did. How you react to bad news, a mistake or a challenge to your idea teaches the team more than any stated open-door policy.",
                "Ask in ways that make dissent the expected answer. 'Any concerns?' tends to get silence; 'What's the biggest risk in this plan we haven't discussed?' assumes there is one and makes naming it a contribution.",
                "When someone raises a concern, thank them first, then get curious. Admitting your own uncertainty, such as 'I could be missing something here', gives others permission to do the same.",
              ],
              keyPoints: [
                "Frame the work as uncertain, where input is genuinely needed.",
                "Ask specific questions that assume there are concerns.",
                "Respond to bad news with thanks and curiosity.",
                "Model fallibility by naming your own uncertainty.",
              ],
            },
            expertInsight: {
              text: "Amy Edmondson describes psychological safety as a shared belief that a team is safe for interpersonal risk-taking, such as asking questions, admitting mistakes or disagreeing. She stresses it is not about being nice or lowering standards; leaders build it by framing work as a learning challenge, acknowledging their own fallibility and asking genuine questions.",
              source: "Amy Edmondson",
              sourceDetail: "The Fearless Organization (2018)",
            },
            example: {
              situation: "Lucas, a team lead, presents a migration plan and wants honest critique from his team.",
              before: "'So that's the plan. I think it's pretty solid. Any concerns? No? Great, let's go.'",
              after:
                "'This is my first pass and I'm sure it has holes. If this migration fails two months from now, what's the most likely reason? Mei, you've run one of these before. What would you change?'",
              whyItWorks:
                "Lucas signals the plan is unfinished, asks a question that assumes risks exist, and invites a specific person. Dissent becomes the helpful answer rather than the awkward one.",
            },
            reflectionPrompt:
              "Think about the last time someone brought you bad news. What did your reaction teach them?",
          },
          exercise: {
            title: "Ask for the real concerns",
            description: "Rewrite a closed message so it invites honest pushback.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this message so it genuinely invites concerns and disagreement. End with a specific question.",
              original:
                "Here's the final plan for the reorg. I think we've covered everything. Let me know if there are any issues, but I'd like to move forward on Monday.",
              tips: [
                "Signal that the plan can still change.",
                "Admit what you might be missing.",
                "Ask a specific question that assumes there are risks.",
              ],
              maxWords: 50,
              requireQuestion: true,
              keywords: ["risk", "concern", "missing", "worr", "what would"],
              modelAnswer:
                "Here's my current draft of the reorg plan. I'm confident in the direction but likely missing something about how it affects your day-to-day work. Before we commit on Monday, what's the one change here that worries you most?",
            },
          },
          quiz: [
            {
              prompt: "Which question is most likely to surface real concerns about a plan?",
              options: [
                "Does everyone agree?",
                "Any questions?",
                "If this plan fails, what will the most likely cause have been?",
                "We're all good with this, right?",
              ],
              correctIndex: 2,
              explanation:
                "It assumes risks exist and makes naming one a helpful act. The others make silence or agreement the easy default.",
              conceptKey: "lead-invite-dissent",
            },
            {
              prompt:
                "A junior engineer tells you they made an error that delayed a release. Which response best builds psychological safety?",
              options: [
                "Thank them for raising it quickly, then ask what happened and what would help prevent it",
                "Tell them it's fine and move on without discussing it",
                "Point out that it should have been caught earlier",
                "Escalate it to your manager so the process is followed",
              ],
              correctIndex: 0,
              explanation:
                "Thanks rewards the act of speaking up; curiosity turns the mistake into learning. Brushing it aside skips the learning, and blame teaches people to hide the next one.",
              conceptKey: "lead-respond-to-bad-news",
            },
            {
              prompt: "Which statement about psychological safety is accurate?",
              options: [
                "It means avoiding conflict to keep the team comfortable",
                "It means lowering standards so people feel less pressure",
                "It is created mainly by announcing an open-door policy",
                "It means people feel safe to take interpersonal risks, like disagreeing or admitting mistakes",
              ],
              correctIndex: 3,
              explanation:
                "Psychological safety sits comfortably alongside high standards. It's about whether candour is safe, and it's built through daily behaviour rather than stated policies.",
              conceptKey: "lead-psych-safety-definition",
            },
          ],
          action: {
            title: "Ask one risk-seeking question",
            description:
              "In a meeting or one-on-one today, ask a question that assumes there's a concern, such as 'What's the biggest risk we're not discussing?' When someone answers, thank them before responding to the content.",
            successCriteria:
              "You asked at least one risk-seeking question and met the first answer with thanks and a follow-up question, not a defence.",
            difficulty: "intermediate",
            estimatedMinutes: 10,
          },
        },
      ],
    },

    /* ───────────────────────── Module 3 ───────────────────────── */
    {
      title: "Influence and Negotiation",
      description:
        "Move people and agreements forward when you don't hold the title, or all the cards.",
      lessons: [
        {
          slug: "lead-influence-without-authority",
          title: "Influence without authority",
          description: "Win cooperation from peers and other teams by trading in what they value.",
          category: "business",
          difficulty: "intermediate",
          estimatedMinutes: 12,
          content: {
            hook: "The people you most need help from often don't report to you, and they have their own priorities.",
            whyItMatters:
              "Much of modern work is cross-functional: you need engineering time, a legal review or another team's data. A title won't get it, and one-off favours run out. People who understand what others value can build cooperation that lasts.",
            coreConcept: {
              title: "Think in currencies",
              body: [
                "Everyone you need values something: recognition, time saved, progress on their own goals, reduced risk, learning, or simply being consulted early. Influence starts by understanding their world before you make your ask.",
                "Frame requests around their priorities, not only yours. 'This helps my launch' is weaker than 'This removes the manual reconciliation your team does every month.'",
                "Offer something in return, and build the relationship before you need it. Exchange works best as an ongoing pattern, not a last-minute bargain.",
              ],
              keyPoints: [
                "Map what the other person cares about before asking.",
                "Frame the ask in terms of their goals.",
                "Offer something they value in exchange.",
                "Invest in relationships before you need them.",
              ],
            },
            expertInsight: {
              text: "Allan Cohen and David Bradford describe influence as exchange: people cooperate when they receive something they value in return. They call these valued things 'currencies', such as inspiration, help with a task, recognition or personal support, and advise understanding a colleague's world before asking for anything.",
              source: "Allan Cohen & David Bradford",
              sourceDetail: "Influence Without Authority",
            },
            example: {
              situation:
                "Nadia, a product manager, needs two days of a data engineer's time from another team that is already overloaded.",
              before:
                "She messages their manager: 'We really need Sam for two days for our launch. It's high priority for us.' The request sits unanswered for a week.",
              after:
                "She learns the data team has been asked to cut pipeline incidents. Her message: 'The fix we need would also remove one of the flaky jobs behind your incident alerts. Could Sam pair with our engineer for two days? We'll handle testing and credit your team in the launch update.'",
              whyItWorks:
                "Nadia ties her ask to the other team's goal, reduces their effort and offers visible recognition. It becomes a trade, not a favour.",
            },
            reflectionPrompt: "Whose cooperation do you need this month, and what do they value most right now?",
          },
          exercise: {
            title: "Build an influence plan",
            description: "Prepare a request to someone who doesn't report to you.",
            config: {
              type: "structure",
              framework: "Currency map",
              instruction: "Think of a real request you need to make of a peer or another team. Map it before you ask.",
              context: "Influence works best when the request is framed around the other person's goals, not yours.",
              slots: [
                {
                  key: "priorities",
                  label: "Their priorities",
                  hint: "What are they measured on or worried about right now?",
                  maxWords: 30,
                },
                {
                  key: "currency",
                  label: "What they value",
                  hint: "Time saved, recognition, reduced risk, progress on their goals…",
                  maxWords: 25,
                },
                { key: "offer", label: "What you can offer", hint: "Something concrete you can give in return.", maxWords: 25 },
                {
                  key: "ask",
                  label: "Your ask, in their terms",
                  hint: "One or two sentences linking your request to their goals.",
                  maxWords: 40,
                },
              ],
            },
          },
          quiz: [
            {
              prompt: "You need a legal review of a contract, but legal is swamped. Which approach is most likely to work?",
              options: [
                "Mark the request urgent and copy their director",
                "Send the contract with the key clauses flagged, a summary of deviations from the standard template, and a realistic deadline",
                "Follow up every day until they respond",
                "Skip the review and accept the risk",
              ],
              correctIndex: 1,
              explanation:
                "Reducing their effort is a currency they value. Escalating or pestering spends goodwill you'll need later.",
              conceptKey: "lead-reduce-their-effort",
            },
            {
              prompt: "Why build relationships with other teams before you need anything from them?",
              options: [
                "Because exchange works best as an ongoing relationship, not a one-off transaction",
                "So you can call in favours later without explaining yourself",
                "Because people can't say no to friends",
                "So you can bypass formal processes",
              ],
              correctIndex: 0,
              explanation:
                "Trust and understanding of each other's goals build up over time, making future exchanges easier and fairer. It's not about obligation or skipping process.",
              conceptKey: "lead-bank-goodwill",
            },
            {
              prompt: "Which framing of a request to another team is strongest?",
              options: [
                "This is a top priority for my team.",
                "Our VP has asked for this.",
                "I'd really appreciate your help; it would mean a lot.",
                "This would remove the manual check your team runs every week, and we'll handle the rollout.",
              ],
              correctIndex: 3,
              explanation:
                "It ties the ask to the other team's own goal and lowers their cost. Appeals to your priorities or to rank give them no reason to care.",
              conceptKey: "lead-frame-their-terms",
            },
          ],
          action: {
            title: "Make one request in their currency",
            description:
              "Identify one thing you need from someone outside your reporting line. Before asking, write down one thing they care about, then send the request framed around it, with something concrete you can offer.",
            successCriteria:
              "A request is sent that explicitly links to the other person's goal and includes a specific offer from you.",
            difficulty: "intermediate",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "lead-interests-not-positions",
          title: "Negotiate interests, not positions",
          description: "Look beneath stated demands to find agreements both sides prefer.",
          category: "negotiation",
          difficulty: "intermediate",
          estimatedMinutes: 12,
          content: {
            hook: "When two people argue over a number, they're usually arguing about something else.",
            whyItMatters:
              "Trading demands back and forth tends to produce compromises that leave both sides unsatisfied, or no deal at all. Asking why someone wants what they want often reveals options neither side had considered. It works in salary talks, vendor deals and internal tugs-of-war alike.",
            coreConcept: {
              title: "Ask why, then widen the options",
              body: [
                "A position is what someone says they want: 'We need it by Friday.' An interest is why they want it: their client demo is on Monday and they need a buffer. Positions often clash; interests frequently don't.",
                "Uncover interests with open questions: 'Help me understand what Friday makes possible for you.' Share your own interests too, so the other side can help solve for them.",
                "Generate options before committing. Once both sides' interests are visible, there's often a package, such as a partial delivery on Friday and the full version on Tuesday, that serves both better than splitting the difference.",
              ],
              keyPoints: [
                "Separate what people ask for from why they want it.",
                "Ask open 'help me understand' questions.",
                "Share your interests, not just your demands.",
                "Generate several options before agreeing on one.",
              ],
            },
            expertInsight: {
              text: "Roger Fisher and William Ury argue that effective negotiators focus on interests rather than positions, because behind opposing positions there are often shared or compatible interests. They recommend inventing options for mutual gain before deciding, instead of haggling over a single point.",
              source: "Roger Fisher & William Ury",
              sourceDetail: "Getting to Yes (1981)",
            },
            example: {
              situation:
                "Elena, a team lead, is asked by sales to build a custom feature for a prospect within two weeks. Her team is fully booked.",
              before:
                "'Two weeks is impossible. The earliest is next quarter.' Sales escalates, and the two leads spend a week arguing over dates.",
              after:
                "'Help me understand what the prospect needs to see in two weeks.' It turns out they need evidence the feature is coming before their budget closes. Elena offers a prototype demo and a committed delivery date in writing. Sales gets the deal; her team keeps its plan.",
              whyItWorks:
                "By asking about the interest behind the deadline, Elena found an option that cost her team little and gave sales what it actually needed.",
            },
            reflectionPrompt:
              "Think of a current disagreement. What is the other side's position, and what interest might sit behind it?",
          },
          exercise: {
            title: "Find the interest",
            description: "Choose the response that moves a stuck negotiation forward.",
            config: {
              type: "choice",
              scenario:
                "You're negotiating with a software vendor. They insist on a three-year contract; you want one year because next year's budget isn't confirmed. Both sides have restated their positions twice.",
              question: "What's your best next move?",
              options: [
                {
                  text: "Hold firm on one year and say it's non-negotiable.",
                  quality: "weak",
                  feedback: "Repeating positions hardens both sides, and you learn nothing about what the vendor actually needs.",
                },
                {
                  text: "Split the difference and offer two years.",
                  quality: "ok",
                  feedback:
                    "It might close the deal, but it may not address either side's real concern, and you'd still commit budget you don't have.",
                },
                {
                  text: "Ask what a three-year term gives them, and explain that your constraint is unconfirmed budget, not reluctance.",
                  quality: "best",
                  feedback:
                    "Surfacing interests, perhaps revenue predictability for them and budget certainty for you, opens options like a one-year term with renewal pricing locked in.",
                },
                {
                  text: "Threaten to go to a competitor unless they accept one year.",
                  quality: "weak",
                  feedback: "Pressure may work once, but it damages the relationship and still ignores what each side really needs.",
                },
              ],
            },
          },
          quiz: [
            {
              prompt: "A colleague insists the team offsite must be in the city centre. Which question best reveals their interest?",
              options: [
                "Why are you being so rigid about this?",
                "What would being in the city centre make easier for you or the team?",
                "Would you accept the suburbs if we put it to a vote?",
                "Can we just compromise on somewhere halfway?",
              ],
              correctIndex: 1,
              explanation:
                "An open, non-judgemental question invites them to share the underlying need, perhaps transit access or a client visit, which may have other solutions.",
              conceptKey: "lead-uncover-interest",
            },
            {
              prompt: "What is the main risk of splitting the difference early in a negotiation?",
              options: [
                "It always takes too long to reach",
                "It is considered poor negotiation etiquette",
                "It can land on a midpoint that serves neither side's real interests",
                "It makes the other side distrust you",
              ],
              correctIndex: 2,
              explanation:
                "Compromising on positions skips the step of understanding interests, so better options for both sides go undiscovered.",
              conceptKey: "lead-avoid-split-difference",
            },
            {
              prompt:
                "Your manager wants you to take on a new project, and you're worried about overload. Which response best applies interest-based negotiation?",
              options: [
                "Share your capacity concern and ask what outcome matters most, so you can propose what to pause",
                "Say yes and quietly work longer hours",
                "Decline because your plate is full",
                "Ask for a raise in exchange",
              ],
              correctIndex: 0,
              explanation:
                "Naming your interest (a sustainable workload) and asking about theirs (the outcome that matters) creates room for options like reprioritising.",
              conceptKey: "lead-negotiate-workload",
            },
          ],
          action: {
            title: "Ask one 'help me understand' question",
            description:
              "In a disagreement or request today, big or small, ask the other person what their position makes possible for them before you respond with your own view.",
            successCriteria:
              "You identified at least one interest behind someone's stated position and wrote it down in one sentence.",
            difficulty: "intermediate",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "lead-know-your-walkaway",
          title: "Know your walk-away before you sit down",
          description: "Define your best alternative in advance so you negotiate from clarity, not pressure.",
          category: "negotiation",
          difficulty: "advanced",
          estimatedMinutes: 12,
          content: {
            hook: "The most powerful thing you can bring to a negotiation is a clear idea of what you'll do if it fails.",
            whyItMatters:
              "Without a defined alternative, people accept bad deals out of fear or reject good ones out of pride. Knowing your fallback in advance sets a rational floor. It also keeps you calm, because the outcome no longer feels all-or-nothing.",
            coreConcept: {
              title: "Your BATNA sets the floor",
              body: [
                "Your BATNA is your best alternative to a negotiated agreement: what you will actually do if this deal doesn't happen. It's not a wish but a concrete option, such as another offer, building it in-house or keeping the status quo.",
                "Work it out before the conversation. List your realistic alternatives, pick the strongest, and compare any proposal against it. If the deal beats your BATNA it's worth considering; if not, walking away is the rational move.",
                "Improve your BATNA when you can, because it's your main source of leverage. Think about the other side's alternatives too: the weaker their options, the more the deal is worth to them.",
              ],
              keyPoints: [
                "Define your concrete alternative before negotiating.",
                "Judge offers against your BATNA, not against your hopes.",
                "Strengthen your alternatives to strengthen your position.",
                "Estimate the other side's alternatives as well.",
              ],
            },
            expertInsight: {
              text: "Fisher and Ury introduced the BATNA, the best alternative to a negotiated agreement, as the standard against which any proposed deal should be measured. They argue it protects you both from accepting terms you should reject and from rejecting terms you'd be better off accepting.",
              source: "Roger Fisher & William Ury",
              sourceDetail: "Getting to Yes (1981)",
            },
            example: {
              situation: "Omar, a senior analyst, is about to negotiate a raise with his manager.",
              before:
                "He goes in hoping for a 'fair increase' with no plan B. When offered a small adjustment he accepts on the spot, then resents it for months.",
              after:
                "Beforehand he notes his alternatives: an informal offer from another company, or staying and pursuing promotion next cycle. He decides what's acceptable relative to those. In the meeting he asks for a specific number and explains his reasoning; when offered less, he asks for a promotion review date in writing as part of the package.",
              whyItWorks:
                "Knowing his alternatives gave Omar both a clear standard and composure. He negotiated on substance instead of reacting to the first offer.",
            },
            reflectionPrompt:
              "In a negotiation you're facing, what would you actually do if no agreement is reached?",
          },
          exercise: {
            title: "Weigh an offer against your alternatives",
            description: "Evaluate a real-world deal against your realistic walk-away options.",
            config: {
              type: "decision",
              instruction:
                "Decide whether to accept the renewal, counter, or walk away. Score each option against the criteria and name your BATNA.",
              prompt:
                "You're renewing a software contract and the vendor's price is noticeably higher than last year. Alternatives: switch to a cheaper competitor, which would need a two-month migration, or build a lighter internal tool that your team estimates would take a quarter. The current contract ends in six weeks.",
              suggestedCriteria: [
                "Total cost over two years",
                "Disruption and migration risk",
                "Time available before the deadline",
                "Strength of each alternative as leverage",
                "Long-term relationship with the vendor",
              ],
            },
          },
          quiz: [
            {
              prompt:
                "A recruiter offers you a role at your current salary. You have no other offers and you like your current job. What is your BATNA?",
              options: [
                "The salary you hope to get",
                "Staying in your current job",
                "The recruiter's best possible offer",
                "A counteroffer you could ask for",
              ],
              correctIndex: 1,
              explanation:
                "Your BATNA is what you'll actually do without a deal; here, staying where you are. Hopes and hypothetical counteroffers are not alternatives.",
              conceptKey: "lead-identify-batna",
            },
            {
              prompt:
                "An offer is below what you hoped for but clearly better than your best alternative. What does BATNA thinking suggest?",
              options: [
                "Reject it because it's below your target",
                "Accept immediately without discussion",
                "Take it seriously and keep negotiating from there, because it beats your alternative",
                "Wait silently for the other side to improve it",
              ],
              correctIndex: 2,
              explanation:
                "Comparing against your BATNA rather than your hopes stops you rejecting a deal that leaves you better off. You can still negotiate, from a realistic baseline.",
              conceptKey: "lead-batna-benchmark",
            },
            {
              prompt: "Before a supplier negotiation, which step most improves your position?",
              options: [
                "Getting a credible quote from a second supplier",
                "Preparing a firm opening demand",
                "Rehearsing persuasive phrasing",
                "Scheduling the meeting near the supplier's quarter end",
              ],
              correctIndex: 0,
              explanation:
                "A real alternative strengthens your BATNA, the core source of leverage. Tactics help at the margins; alternatives change the balance.",
              conceptKey: "lead-strengthen-batna",
            },
          ],
          action: {
            title: "Write your walk-away",
            description:
              "Pick a negotiation you're in or expect soon: a purchase, a deadline, a salary, a project's scope. Write down your realistic alternatives, choose your BATNA, and set the point below which you'd take it instead.",
            successCriteria:
              "You have a written note naming your BATNA in one concrete sentence and the threshold at which you'd walk away.",
            difficulty: "advanced",
            estimatedMinutes: 10,
          },
        },
      ],
    },
  ],
};
