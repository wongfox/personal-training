import type { PracticeSeed } from "../types";

const NETWORKING_OBJECTIVE =
  "Practise the full arc: introduce yourself in one line, ask an opening question, follow up on their answer, close gracefully and exchange contact information.";

export const practiceTools: PracticeSeed[] = [
  /* ───────────────────── Conversation Simulator ───────────────────── */
  {
    slug: "practice-conversation-potential-client",
    title: "Conversation Simulator: The potential client",
    description: "Meet a potential client at an event and turn small talk into a real next step, without pitching.",
    category: "social_intelligence",
    difficulty: "beginner",
    estimatedMinutes: 8,
    config: {
      type: "roleplay",
      mode: "conversation",
      setting: "An industry evening event. You're standing near the bar when someone turns and introduces themselves.",
      counterpart: {
        name: "Laura Mendes",
        role: "Operations Director at a mid-sized logistics company",
        persona:
          "Friendly but busy; she has met several vendors tonight and quickly tunes out generic pitches. She warms up when someone asks about her real challenges and speaks in plain language. She shares more once she feels listened to rather than sold to.",
      },
      objective:
        "Introduce yourself in one clear line, learn about one real challenge she's facing, and agree a natural next step without pitching.",
      openingLine: "Hi, nice to meet you. What do you do?",
      scriptedTurns: [
        "Interesting. And what kind of companies do you usually work with?",
        "Got it. Honestly, our biggest headache right now is getting different teams to work from the same numbers. How would you even approach something like that?",
        "This has been useful. I need to catch someone before they leave. What would you suggest as a next step?",
      ],
      focus: ["clarity", "curiosity", "conciseness", "persuasion"],
    },
  },
  {
    slug: "practice-conversation-colleague-pushback",
    title: "Conversation Simulator: The sceptical colleague",
    description: "A peer pushes back on your idea in a meeting. Stay calm, get curious and find common ground.",
    category: "communication",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    config: {
      type: "roleplay",
      mode: "conversation",
      setting:
        "A weekly team meeting. You've just proposed moving the monthly performance report to a self-serve dashboard.",
      counterpart: {
        name: "Tom Becker",
        role: "Senior Analyst and your peer",
        persona:
          "Sharp, sceptical and protective of processes he built. Not hostile, but he pushes back hard when he senses extra work or risk for his team. He respects people who acknowledge his concerns before defending their idea.",
      },
      objective:
        "Acknowledge his concern, ask what's behind it, and steer the discussion toward a small test you can both support, without getting defensive.",
      openingLine:
        "I'm not sure about this. We tried something similar two years ago and it created more questions than it answered.",
      scriptedTurns: [
        "Maybe. But who handles it when the dashboard numbers don't match what finance reports?",
        "Okay, that's more thought-through than I expected. My worry is still the workload on my team during the switch.",
        "If we did try it, what would a small first step look like, and how would we know it's working?",
      ],
      focus: ["empathy", "curiosity", "confidence", "persuasion"],
    },
  },
  {
    slug: "practice-conversation-ask-for-resources",
    title: "Conversation Simulator: Asking for resources",
    description: "Make a clear, well-argued case to your manager for more people, time or budget.",
    category: "leadership",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    config: {
      type: "roleplay",
      mode: "conversation",
      setting: "A one-to-one with your manager. Your project is slipping because the team is stretched across too much work.",
      counterpart: {
        name: "Sarah Lin",
        role: "Head of Department, your manager",
        persona:
          "Supportive but under budget pressure from above. She responds to clear trade-offs and evidence, not complaints. If the ask is vague, she pushes back with sharp questions about priorities.",
      },
      objective:
        "State the problem and its impact clearly, make a specific ask, show the trade-off if nothing changes, and agree a concrete next step.",
      openingLine: "You wanted to talk about the project. What's going on?",
      scriptedTurns: [
        "I hear you. But headcount is tight this quarter. What happens if we don't add anyone?",
        "Okay. If I could only give you part of what you're asking for, what would matter most?",
        "Let me think about it. What exactly should I take into my next budget meeting?",
      ],
      focus: ["clarity", "confidence", "structure", "persuasion", "executive_presence"],
    },
  },
  {
    slug: "practice-conversation-supplier-price-rise",
    title: "Conversation Simulator: The supplier price rise",
    description: "A long-standing supplier wants to raise prices. Negotiate without damaging the relationship.",
    category: "negotiation",
    difficulty: "advanced",
    estimatedMinutes: 12,
    config: {
      type: "roleplay",
      mode: "conversation",
      setting: "A video call with your packaging supplier. They've emailed to announce a price increase from next quarter.",
      counterpart: {
        name: "Javier Ortega",
        role: "Key Account Manager at your packaging supplier",
        persona:
          "Polite, experienced and firm. He has been told to protect margin, but he values the account and wants to keep it. He concedes on timing, volume or payment terms more readily than on the headline price.",
      },
      objective:
        "Understand what is driving the increase, avoid accepting the first number, explore trades such as timing, volume or terms, and leave with a concrete proposal to review.",
      openingLine:
        "Thanks for making time. As I mentioned in my email, our costs have gone up and we need to raise prices by eight percent from next quarter.",
      scriptedTurns: [
        "I understand it's not welcome news. But our material costs are real, and every client is seeing an increase.",
        "There might be some flexibility, but I'd need something in return. What could you offer on your side?",
        "Let me take this back to my team. What exactly should I put in the proposal so we can close this?",
      ],
      focus: ["confidence", "curiosity", "persuasion", "authority"],
    },
  },

  /* ───────────────────── Networking Practice ───────────────────── */
  {
    slug: "practice-networking-ceo",
    title: "Networking Practice: Meeting a CEO",
    description: "You have two minutes with a senior leader. Be concise, curious and memorable.",
    category: "networking",
    difficulty: "advanced",
    estimatedMinutes: 8,
    config: {
      type: "roleplay",
      mode: "networking",
      setting: "A leadership forum reception. The CEO of a company you admire is briefly free between conversations.",
      counterpart: {
        name: "Catherine Doyle",
        role: "CEO of a regional retail group",
        persona:
          "Direct, time-poor and courteous. She meets many people who want something from her, so she only warms to those who are concise and genuinely curious. She enjoys questions about strategy and dislikes flattery.",
      },
      objective: NETWORKING_OBJECTIVE,
      openingLine: "Hello, I don't think we've met. I'm Catherine.",
      scriptedTurns: [
        "Good to meet you. Tell me a little more about what you're working on.",
        "That's an interesting angle. We're wrestling with something similar: how to move faster without losing control. What have you seen work?",
        "I should keep moving, but I've enjoyed this. How would you like to stay in touch?",
      ],
      focus: ["conciseness", "confidence", "curiosity", "executive_presence"],
    },
  },
  {
    slug: "practice-networking-supplier",
    title: "Networking Practice: Meeting a supplier",
    description: "Build rapport with a potential supplier at a trade fair and find out if there's a fit.",
    category: "networking",
    difficulty: "beginner",
    estimatedMinutes: 7,
    config: {
      type: "roleplay",
      mode: "networking",
      setting: "A trade fair. You stop at the stand of a components manufacturer your team has been considering.",
      counterpart: {
        name: "Henrik Larsen",
        role: "Sales Director at a components manufacturer",
        persona:
          "Warm, talkative and naturally inclined to pitch. He appreciates buyers who are clear about what they need and becomes more candid about lead times and limits when asked direct, specific questions.",
      },
      objective: NETWORKING_OBJECTIVE,
      openingLine: "Welcome! Are you familiar with what we do, or shall I give you the quick tour?",
      scriptedTurns: [
        "Great. So what's your team looking for at the moment?",
        "That makes sense. To be honest, lead times are tight across the industry right now. What would matter most to you if we worked together?",
        "Let's not lose this thread. What's the best way to continue the conversation after the fair?",
      ],
      focus: ["clarity", "curiosity", "structure"],
    },
  },
  {
    slug: "practice-networking-potential-client",
    title: "Networking Practice: Meeting a potential client",
    description: "Open a conversation with a decision-maker and earn a follow-up, not a brush-off.",
    category: "networking",
    difficulty: "intermediate",
    estimatedMinutes: 8,
    config: {
      type: "roleplay",
      mode: "networking",
      setting: "An industry breakfast for healthcare operations leaders. You're seated next to someone at a shared table.",
      counterpart: {
        name: "Amira Haddad",
        role: "Head of Procurement at a hospital group",
        persona:
          "Professional and slightly guarded; she is approached by vendors constantly and expects a sales pitch. She relaxes when the conversation is about her priorities rather than your product, and respects people who don't push.",
      },
      objective: NETWORKING_OBJECTIVE,
      openingLine: "Morning. Is this seat taken, or am I stealing someone's spot?",
      scriptedTurns: [
        "Thanks. So what brings you to this breakfast?",
        "I see. On our side, the big theme this year is doing more with tighter budgets. How do you see that playing out?",
        "The session's about to start. If it makes sense to talk again, how should we stay in touch?",
      ],
      focus: ["empathy", "curiosity", "clarity", "persuasion"],
    },
  },
  {
    slug: "practice-networking-event",
    title: "Networking Practice: The networking event",
    description: "Approach a stranger at a busy networking evening and leave with a genuine connection.",
    category: "networking",
    difficulty: "beginner",
    estimatedMinutes: 7,
    config: {
      type: "roleplay",
      mode: "networking",
      setting: "A city networking evening for tech and business professionals. Someone is standing alone near the window.",
      counterpart: {
        name: "Chris Novak",
        role: "Product Manager at a fintech start-up",
        persona:
          "Friendly but a little reserved; he came alone and is relieved when someone else starts the conversation. He opens up quickly when asked about his work and enjoys swapping ideas.",
      },
      objective: NETWORKING_OBJECTIVE,
      openingLine: "Oh, hi. Yes, I'm a bit new to these events, to be honest.",
      scriptedTurns: [
        "Nice to meet you. So what kind of work do you do?",
        "That sounds interesting. I've been trying to figure out how to grow my network outside product. What's been useful for you?",
        "I've really enjoyed this. Shall we swap details before the crowd pulls us apart?",
      ],
      focus: ["confidence", "curiosity", "flow"],
    },
  },
  {
    slug: "practice-networking-business-dinner",
    title: "Networking Practice: The business dinner",
    description: "Build a relationship over dinner with someone you're seated next to, balancing warmth and business.",
    category: "networking",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    config: {
      type: "roleplay",
      mode: "networking",
      setting: "A business dinner hosted by a partner company. You're seated next to someone you haven't met.",
      counterpart: {
        name: "Mónica Ruiz",
        role: "Finance Director at the partner company",
        persona:
          "Composed and observant, with a dry sense of humour. She prefers a relaxed conversation over shop talk at dinner, but appreciates sharp business thinking when it comes up naturally. She notices whether people listen or just wait to talk.",
      },
      objective: NETWORKING_OBJECTIVE,
      openingLine: "I think we're neighbours for the evening. Mónica. How do you know our hosts?",
      scriptedTurns: [
        "Ah, I see. And outside of work, what keeps you busy?",
        "That's lovely. I find these dinners are the only time I really hear what other teams are working on. What's the biggest thing on your plate right now?",
        "It's been a pleasure. I'd be happy to continue this. What's the easiest way to reach you?",
      ],
      focus: ["empathy", "flow", "curiosity", "executive_presence"],
    },
  },
  {
    slug: "practice-networking-conference-coffee",
    title: "Networking Practice: The conference coffee break",
    description: "Approach a speaker in a ten-minute coffee break and make the most of a short window.",
    category: "networking",
    difficulty: "beginner",
    estimatedMinutes: 6,
    config: {
      type: "roleplay",
      mode: "networking",
      setting: "A conference coffee break, just after a session you enjoyed. The speaker is at the coffee station.",
      counterpart: {
        name: "Ben Okafor",
        role: "Head of Data at an insurance company, today's speaker",
        persona:
          "Approachable and still energised from his talk. He enjoys specific questions about his content much more than general praise. He has limited time before the next session and will politely keep things moving.",
      },
      objective: NETWORKING_OBJECTIVE,
      openingLine: "Hi there. Did you catch the session, or are you just here for the coffee?",
      scriptedTurns: [
        "Thanks, that's kind. What's your connection to the topic?",
        "That's a good point. Honestly, the hardest part for us was getting people to trust the data. Have you run into that?",
        "The next session's about to start. Let's stay in touch. What's the best way to reach you?",
      ],
      focus: ["conciseness", "curiosity", "confidence"],
    },
  },

  /* ───────────────────── Presentation Trainer ───────────────────── */
  {
    slug: "practice-presentation-trainer",
    title: "Presentation Trainer",
    description: "Pick an audience, objective and time limit, then craft the opening of your talk and get feedback.",
    category: "communication",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    config: {
      type: "pitch",
      briefing:
        "Choose who you're speaking to, what you need from them and how long you have. Then write, or speak aloud and transcribe, the opening of your talk: the first 30 to 60 seconds. State your main point early, make clear why it matters to this audience, and say what you'll ask of them. You'll get feedback on clarity, structure and presence.",
      audiences: ["Executive committee", "Your team", "A potential client", "Investors", "A conference audience"],
      objectives: ["Get approval", "Inform and align", "Persuade to act", "Secure budget"],
      durations: [1, 3, 5],
      suggestedTopics: [
        "Digital Commerce Strategy",
        "Why we should replace our reporting tool",
        "Quarterly results and priorities for next quarter",
        "A proposal to pilot a four-day project sprint",
        "Expanding into a new regional market",
      ],
    },
  },

  /* ───────────────────── Thought Organizer ───────────────────── */
  {
    slug: "practice-organizer-scr",
    title: "Thought Organizer: Situation, Complication, Resolution",
    description: "Structure a recommendation the way consultants do, so your reader gets it in seconds.",
    category: "critical_thinking",
    difficulty: "intermediate",
    estimatedMinutes: 8,
    config: {
      type: "structure",
      framework: "Situation, Complication, Resolution (Minto)",
      instruction:
        "Pick a recommendation you need to make. Fill each block briefly. Together they should read as one short, persuasive argument.",
      context: "Example topic: your team needs approval to replace an outdated planning tool.",
      slots: [
        {
          key: "situation",
          label: "Situation",
          hint: "The stable context your audience already agrees with.",
          maxWords: 35,
        },
        {
          key: "complication",
          label: "Complication",
          hint: "What has changed or gone wrong, creating the need to act.",
          maxWords: 35,
        },
        {
          key: "resolution",
          label: "Resolution",
          hint: "Your recommendation, stated plainly, and the first step.",
          maxWords: 40,
        },
      ],
    },
  },
  {
    slug: "practice-organizer-prep",
    title: "Thought Organizer: PREP",
    description: "Answer any question with a clear point, a reason, an example and a strong close.",
    category: "communication",
    difficulty: "beginner",
    estimatedMinutes: 6,
    config: {
      type: "structure",
      framework: "PREP: Point, Reason, Example, Point",
      instruction:
        "Use PREP to answer a question you might be asked in a meeting. Keep every block short; the power is in the order.",
      context: "Example question: \"Should we keep the weekly status meeting?\"",
      slots: [
        { key: "point", label: "Point", hint: "Your answer in one sentence.", maxWords: 20 },
        { key: "reason", label: "Reason", hint: "The main reason you believe it.", maxWords: 30 },
        { key: "example", label: "Example", hint: "A concrete case, fact or story that shows it.", maxWords: 40 },
        { key: "point_again", label: "Point (again)", hint: "Restate your answer, ideally with a next step.", maxWords: 20 },
      ],
    },
  },

  /* ───────────────────── Story Builder ───────────────────── */
  {
    slug: "practice-story-builder",
    title: "Story Builder",
    description: "Turn a real work experience into a short story with a clear arc and a lesson people remember.",
    category: "storytelling",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    config: {
      type: "structure",
      framework: "Context, Challenge, Turning point, Lesson",
      instruction:
        "Choose a real moment from your work: a project, a mistake, a difficult conversation. Build it into a story you could tell in under two minutes.",
      context: "Good stories for interviews, presentations and team talks are specific, brief and end with something useful.",
      slots: [
        { key: "context", label: "Context", hint: "Where and when. Just enough for the listener to picture it.", maxWords: 35 },
        { key: "challenge", label: "Challenge", hint: "What was at stake, and what made it hard.", maxWords: 40 },
        {
          key: "turning_point",
          label: "Turning point",
          hint: "The decision, action or realisation that changed things.",
          maxWords: 40,
        },
        { key: "lesson", label: "Lesson", hint: "What you, or the listener, can take from it.", maxWords: 30 },
      ],
    },
  },

  /* ───────────────────── Decision Framework ───────────────────── */
  {
    slug: "practice-decision-internal-move",
    title: "Decision Framework: The internal move",
    description: "Weigh a tempting internal transfer against staying where you're valued.",
    category: "critical_thinking",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    config: {
      type: "decision",
      instruction:
        "List your options, choose the criteria that matter most to you, weigh them and score each option. Then write down what would change your mind.",
      prompt:
        "You've been offered a role in another department: broader scope and more visibility, a new manager you don't know, and the same pay. Your current team is mid-project and relies on you.",
      suggestedCriteria: [
        "Learning and growth",
        "Long-term career direction",
        "Relationship with the manager",
        "Impact on your current team",
        "Workload and wellbeing",
        "Visibility to senior leaders",
      ],
    },
  },
  {
    slug: "practice-decision-build-or-buy",
    title: "Decision Framework: Build or buy",
    description: "Decide whether your team should build an internal tool or buy an off-the-shelf product.",
    category: "business",
    difficulty: "advanced",
    estimatedMinutes: 12,
    config: {
      type: "decision",
      instruction:
        "Define the options, pick and weight your criteria, then score each option. Finish by naming the biggest risk of your preferred choice.",
      prompt:
        "Your team needs a better way to track customer onboarding. Engineering says they could build a tool in a few months; a vendor offers a ready-made product with a yearly licence and some limits on customisation.",
      suggestedCriteria: [
        "Total cost over three years",
        "Time to value",
        "Fit with current processes",
        "Maintenance burden",
        "Flexibility to change later",
        "Vendor or delivery risk",
      ],
    },
  },

  /* ───────────────────── Memory Trainer ───────────────────── */
  {
    slug: "practice-memory-event-names",
    title: "Memory Trainer: Names at an event",
    description: "Remember the names and details of six people you met at an event.",
    category: "memory",
    difficulty: "beginner",
    estimatedMinutes: 5,
    config: {
      type: "recall",
      instruction:
        "You met these six people at a conference reception. Study the list, then recall each name with its detail.",
      items: [
        "Elena: runs the returns team at a fashion retailer",
        "Marcus: ex-teacher, now in learning and development",
        "Yuki: data engineer, plays in a jazz band",
        "Omar: founder of a food-delivery start-up",
        "Grace: procurement lead, moving to Singapore",
        "Pablo: sales manager, supports the same football team as you",
      ],
      studySeconds: 60,
      technique:
        "Link each name to a vivid image of its detail. Picture Elena surrounded by returned parcels, Yuki playing saxophone over a database, Grace boarding a plane.",
    },
  },
  {
    slug: "practice-memory-briefing",
    title: "Memory Trainer: The briefing",
    description: "Retain the key numbers and points of a briefing so you can speak without notes.",
    category: "memory",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    config: {
      type: "recall",
      instruction:
        "You're about to brief your director on a (fictional) quarterly review. Study the key points, then recall them in order.",
      items: [
        "Revenue: 4% above plan",
        "Online share: up to 31% of sales",
        "Main risk: supplier delays in the north region",
        "Customer complaints: down for the second quarter",
        "Hiring: two of five roles filled",
        "Decision needed: approve the new warehouse lease by Friday",
      ],
      studySeconds: 60,
      technique:
        "Chunk the points into three pairs (performance, risks and people, decision) and walk them through a familiar route, such as your morning commute, placing one pair at each stop.",
    },
  },

  /* ───────────────────── Rewrite tools ───────────────────── */
  {
    slug: "practice-hedge-hunter-follow-up",
    title: "Hedge Hunter: The nervous chaser",
    description: "Strip the apologies and hedges from a follow-up message so it gets a reply.",
    category: "confidence",
    difficulty: "beginner",
    estimatedMinutes: 4,
    config: {
      type: "rewrite",
      instruction: "Rewrite this message so it is direct, polite and clear about what you need and by when.",
      original:
        "Sorry to bother you again, I just wanted to check if maybe you'd had a chance to look at the proposal? No worries at all if not, I know you're super busy!",
      tips: [
        "Delete 'sorry', 'just', 'maybe' and 'no worries'.",
        "State the request and a deadline.",
        "Give the reason the deadline matters.",
      ],
      maxWords: 30,
      keywords: ["by", "need", "could you", "please"],
      modelAnswer: "Could you review the proposal by Thursday? I need your sign-off to confirm the supplier order on Friday.",
    },
  },
  {
    slug: "practice-hedge-hunter-recommendation",
    title: "Hedge Hunter: The timid recommendation",
    description: "Turn a tentative suggestion into a clear recommendation with a reason.",
    category: "confidence",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    config: {
      type: "rewrite",
      instruction: "Rewrite this as a confident recommendation: lead with the call, then the reason.",
      original:
        "I think we could possibly consider maybe moving the launch a bit, if that's okay with everyone? It's just an idea, I'm not sure.",
      tips: [
        "Start with 'I recommend' or 'We should'.",
        "Be specific about what changes.",
        "Add one reason that makes the case.",
      ],
      maxWords: 30,
      keywords: ["recommend", "we should", "propose"],
      modelAnswer:
        "I recommend moving the launch by two weeks so we can fix the payment bug. Launching with it puts customer trust at risk.",
    },
  },
  {
    slug: "practice-bottom-line-up-front",
    title: "Executive Summary: Bottom line up front",
    description: "Rewrite a rambling update so a busy executive gets the point in the first line.",
    category: "executive_presence",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    config: {
      type: "rewrite",
      instruction:
        "Rewrite this update for a senior leader. Put the bottom line first, then the cause, the impact and what you need from them.",
      original:
        "Hi, so as you know we've been working with the packaging supplier for a few months, and there have been a few back-and-forths about the new design. Last week they told us there might be some issues on their side with materials, and after a few calls it looks like the delivery is going to be late, probably about a week, which means the launch date may need to move. We don't think there's a budget impact. Let me know what you think we should do about the retail partners.",
      tips: [
        "Open with the conclusion: what is happening.",
        "Give the cause in one short sentence.",
        "End with a clear decision or action you need.",
      ],
      maxWords: 45,
      keywords: ["bottom line", "approve", "approval", "need your", "decision"],
      modelAnswer:
        "Bottom line: the launch will slip one week because of a supplier materials delay. No budget impact. I need your approval to inform our retail partners today.",
    },
  },
  {
    slug: "practice-ask-better-questions",
    title: "Ask Better Questions",
    description: "Turn closed, dead-end questions into open ones that get people talking.",
    category: "social_intelligence",
    difficulty: "beginner",
    estimatedMinutes: 3,
    config: {
      type: "rewrite",
      instruction:
        "A colleague has just come back from a three-day industry conference. Rewrite this closed question into an open one that invites a real answer.",
      original: "So, did the conference go well?",
      tips: [
        "Start with 'what' or 'how'.",
        "Ask about something specific: an idea, a person, a surprise.",
        "Make it easy to answer with a short story.",
      ],
      maxWords: 20,
      requireQuestion: true,
      keywords: ["what", "how", "which", "tell me"],
      modelAnswer: "What was the one idea from the conference you think you'll actually use?",
    },
  },
];
