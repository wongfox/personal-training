import type { JourneySeed } from "../types";

export const communicationMastery: JourneySeed = {
  slug: "communication-mastery",
  title: "Communication Mastery",
  subtitle: "Say what you mean, clearly and with intent.",
  description:
    "Nine short sessions that rebuild how you open conversations, deliver your point in executive settings and turn information into stories people remember. Each idea is practised today, in your real work.",
  category: "communication",
  difficulty: "beginner",
  order: 1,
  modules: [
    /* ───────────────────────── Module 1 ───────────────────────── */
    {
      title: "First Impressions",
      description:
        "The first moments of any conversation set the frame for everything after. Learn to open with clarity, introduce yourself with purpose and make people feel heard.",
      lessons: [
        {
          slug: "comms-first-sentence-counts",
          title: "Your first sentence is your first impression",
          description: "Why the opening seconds of a conversation shape how everything after it is heard.",
          category: "communication",
          difficulty: "beginner",
          estimatedMinutes: 8,
          content: {
            hook: "Most people spend their opening sentence warming up. By the time they reach the point, the listener has already decided how much attention to give them.",
            whyItMatters:
              "Colleagues, clients and senior leaders form a working impression of you quickly, and they rarely revise it on purpose. A clear first sentence earns you the attention the rest of your message needs. A vague one makes you work twice as hard to get it back.",
            coreConcept: {
              title: "Open with signal, not noise",
              body: [
                "Listeners use the first few seconds to answer two silent questions: is this person worth my attention, and what is this about? Throat-clearing phrases like 'So, just quickly…' or 'I'm not sure if this is relevant, but…' answer both questions badly.",
                "A strong opener does one job: it tells people what you are here to say or ask. It can be a conclusion, a request or a clear topic. It does not need to be clever.",
                "You are not trying to perform. You are trying to remove the guesswork so the listener can relax and follow you.",
              ],
              keyPoints: [
                "People decide how closely to listen within the first sentence.",
                "Cut warm-up phrases; start with the topic, ask or conclusion.",
                "Clarity in the opener signals respect for the listener's time.",
                "Plain beats clever: the goal is orientation, not impressiveness.",
              ],
            },
            expertInsight: {
              text: "Research on 'thin slices' of behaviour found that people form judgments from very brief exposures to someone, and that those quick judgments often line up with impressions formed over much longer periods. Early moments carry more weight than they seem to.",
              source: "Nalini Ambady & Robert Rosenthal",
              sourceDetail: "Research on thin-slice judgments, early 1990s",
            },
            example: {
              situation: "Leo, a data analyst, joins a stand-up to flag a reporting issue.",
              before:
                "\"Hi, sorry, so I was just looking at a few things yesterday and I'm not totally sure, but I think maybe there might be something off with some of the numbers?\"",
              after:
                "\"The weekly revenue report double-counts refunds. I have a fix and need ten minutes with finance to confirm it.\"",
              whyItWorks:
                "The second version names the problem, shows ownership and makes a specific ask in two sentences. Everyone knows instantly why Leo is speaking and what he needs.",
            },
            reflectionPrompt:
              "Think of the last time you spoke up in a meeting. What was your actual first sentence, and what would a one-line version of your point have been?",
          },
          exercise: {
            title: "Choose the strongest opener",
            description: "Pick the opening line that earns attention fastest.",
            config: {
              type: "choice",
              scenario:
                "You are Ana, a product manager. You have 30 seconds in a leadership sync to raise a risk: a vendor delay will push the mobile launch back two weeks unless the team approves overtime.",
              question: "Which opening sentence works best?",
              options: [
                {
                  text: "\"Sorry to take up time, I know everyone's busy, but there's a vendor thing I wanted to mention.\"",
                  quality: "weak",
                  feedback:
                    "Apologising and minimising before the point teaches people to discount it. The listener still has no idea what is at stake.",
                },
                {
                  text: "\"So, some context first: we've been working with the vendor for about six months now and…\"",
                  quality: "ok",
                  feedback:
                    "Context is useful, but leading with it makes leaders wait for the reason you are talking. Put it after the headline.",
                },
                {
                  text: "\"The mobile launch slips two weeks unless we approve vendor overtime today.\"",
                  quality: "best",
                  feedback:
                    "It states the consequence, the cause and the decision needed in one sentence. Leaders can respond immediately.",
                },
                {
                  text: "\"I just have a quick question about the vendor timeline, if that's okay.\"",
                  quality: "weak",
                  feedback:
                    "Framing a serious risk as a 'quick question' undersells it, and asking permission delays the point further.",
                },
              ],
            },
          },
          quiz: [
            {
              prompt:
                "You need your manager's sign-off on a budget change. Which first sentence gives them the clearest signal?",
              options: [
                "\"Do you have a sec? I've been thinking about a few budget things.\"",
                "\"I need your approval to move 5,000 from events to tooling this quarter.\"",
                "\"So, as you know, the budget has been tight this year…\"",
                "\"This might be a silly idea, but hear me out.\"",
              ],
              correctIndex: 1,
              explanation:
                "Leading with the specific request tells your manager what decision they are being asked to make, so they can listen to the rest with purpose.",
              conceptKey: "comms-signal-first-sentence",
            },
            {
              prompt: "What is the main job of an opening sentence in a work conversation?",
              options: [
                "To build rapport before getting to business",
                "To show how much context you have",
                "To orient the listener to your point, ask or topic",
                "To sound impressive and confident",
              ],
              correctIndex: 2,
              explanation:
                "An opener's job is orientation. Rapport and context matter, but they land better once the listener knows where you are going.",
              conceptKey: "comms-opener-orientation",
            },
            {
              prompt:
                "Why do phrases like 'I'm not sure if this is relevant, but…' weaken a message?",
              options: [
                "They make the message too long to remember",
                "They invite the listener to discount what follows before hearing it",
                "They are grammatically incorrect",
                "They sound too formal for most workplaces",
              ],
              correctIndex: 1,
              explanation:
                "Pre-emptive disclaimers tell the listener how to judge your point: as possibly irrelevant. Early impressions are sticky, so that framing tends to last.",
              conceptKey: "comms-disclaimer-framing",
            },
          ],
          action: {
            title: "Lead with the point once today",
            description:
              "In your next meeting, message or call where you need to raise something, make your very first sentence the conclusion, request or risk. No warm-up, no apology.",
            successCriteria:
              "You delivered at least one message today where the first sentence stated your point, and you noticed how the other person responded.",
            difficulty: "beginner",
            estimatedMinutes: 5,
          },
        },
        {
          slug: "comms-introduce-yourself-clearly",
          title: "Introduce yourself in one clear line",
          description: "Replace the job-title shrug with an introduction people can remember and repeat.",
          category: "communication",
          difficulty: "beginner",
          estimatedMinutes: 10,
          content: {
            hook: "\"I'm in operations, I kind of do a bit of everything.\" It is the most common introduction in business, and almost nobody remembers it.",
            whyItMatters:
              "Introductions happen in kickoffs, client calls, conferences and new teams. A forgettable one means people do not know when to bring you in. A clear one turns a polite moment into a reason for someone to come back to you.",
            coreConcept: {
              title: "Who you help, with what, and why it matters",
              body: [
                "A useful introduction answers what a stranger actually wants to know: what you do for people like them. Job titles rarely answer that; outcomes do.",
                "A simple shape works in almost any setting: your role, who you help, and the result you create. Add one current focus if the moment allows.",
                "Lead with the most relevant part for this audience. The same person might introduce themselves differently to a client, an engineer and a recruiter, and all three can be true.",
              ],
              keyPoints: [
                "Outcomes are more memorable than titles.",
                "Shape: role, who you help, the result you create.",
                "Put the most relevant detail first for this audience.",
                "Keep it to one or two sentences; let questions do the rest.",
              ],
            },
            expertInsight: {
              text: "Early research on impression formation showed that the first traits people hear about someone shape how they interpret everything that follows. Whatever you lead with becomes the lens for the rest of your introduction.",
              source: "Solomon Asch",
              sourceDetail: "Studies on forming impressions of personality, 1946",
            },
            example: {
              situation: "Marta, a finance business partner, introduces herself at a cross-team project kickoff.",
              before:
                "\"Hi, I'm Marta, I'm in finance. I sort of support a few of the teams with numbers stuff, budgets and that kind of thing.\"",
              after:
                "\"I'm Marta, finance partner for the product teams. I help them turn plans into budgets leadership will approve, so bring me in before you price anything.\"",
              whyItWorks:
                "The second version names who she serves, the outcome she creates and exactly when people should involve her. It gives the room a reason to use her.",
            },
            reflectionPrompt:
              "If a colleague introduced you to someone important tomorrow, what one sentence would you want them to use?",
          },
          exercise: {
            title: "Rewrite a forgettable introduction",
            description: "Turn a vague intro into one clear line built on outcomes.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this introduction for a cross-team kickoff. Name the role, who you help and the result you create.",
              original:
                "Hi everyone, I'm Sam. I'm on the customer success team, I guess I do a lot of different things really, like onboarding and some account stuff and whatever comes up.",
              tips: [
                "Replace 'a lot of different things' with one clear outcome.",
                "Say who you help, not just which team you sit on.",
                "Cut 'I guess', 'really' and 'whatever comes up'.",
              ],
              maxWords: 35,
              keywords: ["help", "customers", "so that", "onboard"],
              modelAnswer:
                "I'm Sam from customer success. I help new customers get fully onboarded in their first month, so they see value fast and renew.",
            },
          },
          quiz: [
            {
              prompt:
                "You are meeting a potential client. Which introduction is most likely to be remembered?",
              options: [
                "\"I'm a senior associate in the advisory practice.\"",
                "\"I work on lots of different projects across the firm.\"",
                "\"I help retailers cut stock-outs by fixing how they forecast demand.\"",
                "\"I've been at the firm for eight years in various roles.\"",
              ],
              correctIndex: 2,
              explanation:
                "It names who you help and the result you create, which is exactly what a client is trying to figure out.",
              conceptKey: "comms-intro-outcome",
            },
            {
              prompt: "Why might you introduce yourself differently to an engineer than to a client?",
              options: [
                "Because you should lead with whatever is most relevant to that listener",
                "Because engineers prefer longer introductions",
                "Because clients do not care about your role",
                "You should not; consistency matters more than relevance",
              ],
              correctIndex: 0,
              explanation:
                "What people hear first frames everything else. Choosing the most relevant true detail for each audience is focus, not inconsistency.",
              conceptKey: "comms-intro-audience-fit",
            },
            {
              prompt: "What is the main weakness of 'I do a bit of everything'?",
              options: [
                "It sounds arrogant",
                "It gives the listener no clue when to involve you",
                "It is too specific",
                "It reveals too much about your role",
              ],
              correctIndex: 1,
              explanation:
                "An introduction should tell people when you are useful to them. 'A bit of everything' leaves them guessing, so they usually forget.",
              conceptKey: "comms-intro-vagueness",
            },
          ],
          action: {
            title: "Draft and use your one-liner",
            description:
              "Write your introduction in one sentence: role, who you help, result. Use it once today in a meeting, an email signature line, a call or your messaging profile.",
            successCriteria:
              "You wrote a one-sentence introduction of 30 words or fewer and used it at least once with a real person or on a real profile.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "comms-make-people-feel-heard",
          title: "Make people feel heard before you respond",
          description: "Use labeling to show you understood someone before you make your own point.",
          category: "communication",
          difficulty: "beginner",
          estimatedMinutes: 9,
          content: {
            hook: "People rarely change their minds while they still feel misunderstood. Your counter-argument cannot land until they believe you heard theirs.",
            whyItMatters:
              "In tense meetings, feedback conversations and client calls, the fastest way to lower defensiveness is to show you understood. It costs one sentence and often saves the whole conversation.",
            coreConcept: {
              title: "Name what you hear, then pause",
              body: [
                "A label is a short sentence that names the emotion or concern behind what someone said: 'It sounds like the deadline feels unrealistic.' It is not agreement; it is evidence that you were listening.",
                "Labels work best when they are tentative and specific. Start with 'It sounds like…', 'It seems like…' or 'It looks like…', then stop talking and let them respond.",
                "Avoid 'I understand' or 'I hear you'. They claim understanding without proving it, and they often sound like a prelude to 'but'.",
              ],
              keyPoints: [
                "Feeling understood lowers defensiveness.",
                "Label the concern: 'It sounds like…', then pause.",
                "A label is acknowledgment, not agreement.",
                "Show understanding; do not just claim it.",
              ],
            },
            expertInsight: {
              text: "Former FBI negotiator Chris Voss describes 'labeling' as naming the other person's feelings or position out loud. He argues it defuses negative emotion and encourages people to keep talking, which gives you better information.",
              source: "Chris Voss",
              sourceDetail: "Never Split the Difference (2016)",
            },
            example: {
              situation: "Priya, an engineering lead, is told by a frustrated sales director that the team is 'always late'.",
              before:
                "\"That's not fair. We delivered the last two releases on time, and the delays were because sales changed the scope.\"",
              after:
                "\"It sounds like the delays have put you in a tough spot with customers.\" (pause) \"Walk me through the deal that's most at risk.\"",
              whyItWorks:
                "Priya names the director's real concern before defending her team. The temperature drops, and the conversation moves from blame to the specific problem she can actually help with.",
            },
            reflectionPrompt:
              "Recall a recent disagreement. What was the other person's underlying concern, and how could you have named it in one sentence?",
          },
          exercise: {
            title: "Pick the response that shows you listened",
            description: "Choose the reply most likely to lower tension and keep the conversation open.",
            config: {
              type: "choice",
              scenario:
                "A teammate says in a one-to-one: \"I keep getting pulled into other teams' fires and my own project is falling behind. Nobody seems to notice.\"",
              question: "What is the best first response?",
              options: [
                {
                  text: "\"I understand. Everyone's stretched right now, honestly.\"",
                  quality: "weak",
                  feedback:
                    "Claiming understanding and then generalising it to everyone shrinks their concern. It can feel dismissive.",
                },
                {
                  text: "\"You should just say no to the other teams.\"",
                  quality: "weak",
                  feedback:
                    "Jumping to advice skips acknowledgment. They may also feel you missed the part about not being noticed.",
                },
                {
                  text: "\"It sounds like you're carrying extra work that isn't being seen.\"",
                  quality: "best",
                  feedback:
                    "It names both the workload and the feeling of being invisible, then leaves space. They are likely to open up further.",
                },
                {
                  text: "\"Which teams are pulling you in? Let's list them.\"",
                  quality: "ok",
                  feedback:
                    "Practical and well-meant, but moving to problem-solving first can skip over the frustration they just shared.",
                },
              ],
            },
          },
          quiz: [
            {
              prompt:
                "A client says, \"We were promised this feature months ago.\" Which reply is a label?",
              options: [
                "\"I hear you, but the roadmap changed.\"",
                "\"It sounds like you planned around that promise and now feel let down.\"",
                "\"That decision was made before I joined.\"",
                "\"Let me check with the product team and get back to you.\"",
              ],
              correctIndex: 1,
              explanation:
                "A label names the concern or emotion behind the words. The others defend, deflect or postpone without acknowledging what the client feels.",
              conceptKey: "comms-label-identify",
            },
            {
              prompt: "What should you do immediately after delivering a label?",
              options: [
                "Explain your own position",
                "Pause and let them respond",
                "Ask whether you got it right, then apologise",
                "Repeat the label in different words",
              ],
              correctIndex: 1,
              explanation:
                "Silence after a label invites the other person to confirm, correct or expand, which is where the useful information comes from.",
              conceptKey: "comms-label-pause",
            },
            {
              prompt: "Why is 'I understand' often less effective than a specific label?",
              options: [
                "It is too formal",
                "It is too long",
                "It claims understanding without showing what you understood",
                "It forces you to agree with them",
              ],
              correctIndex: 2,
              explanation:
                "A specific label proves you listened. A generic claim asks the person to take your word for it, and often precedes a 'but'.",
              conceptKey: "comms-label-vs-claim",
            },
          ],
          action: {
            title: "Label before you respond",
            description:
              "In one conversation today where someone shares a frustration or concern, respond first with a label ('It sounds like…'), then pause for at least two seconds before saying anything else.",
            successCriteria:
              "You used at least one label in a real conversation, paused afterwards, and noted what the other person said next.",
            difficulty: "beginner",
            estimatedMinutes: 5,
          },
        },
      ],
    },

    /* ───────────────────────── Module 2 ───────────────────────── */
    {
      title: "Executive Communication",
      description:
        "Senior audiences have little time and high stakes. Learn to lead with the answer, hold your ground calmly, handle tough questions and strip out the words that dilute your authority.",
      lessons: [
        {
          slug: "comms-bottom-line-up-front",
          title: "Put the bottom line up front",
          description: "Lead with your conclusion so busy people get the answer before the backstory.",
          category: "executive_presence",
          difficulty: "beginner",
          estimatedMinutes: 10,
          content: {
            hook: "Most updates are written in the order the work happened. Executives read them in the order they need: answer first.",
            whyItMatters:
              "Senior people are interrupted constantly and often read only the first lines of a message. If your conclusion is in paragraph four, it may never be seen. Leading with it is how you get decisions instead of follow-up questions.",
            coreConcept: {
              title: "Answer, then support",
              body: [
                "Bottom line up front (BLUF) means your first sentence states the conclusion, recommendation or decision you need. Everything after it is support the reader can dip into as needed.",
                "The instinct to build up to the answer comes from wanting to show your work. But a reader who does not yet know your conclusion cannot tell which details matter.",
                "A simple test: if someone read only your first sentence, would they know what you want? If not, move the answer up.",
              ],
              keyPoints: [
                "First sentence: the conclusion or the ask.",
                "Then two or three supporting reasons.",
                "Detail and history last, or in an attachment.",
                "Test: could someone act on your first line alone?",
              ],
            },
            expertInsight: {
              text: "Barbara Minto's Pyramid Principle recommends starting with the main idea, then grouping supporting arguments beneath it. Readers absorb information more easily when they know the conclusion the details are meant to support.",
              source: "Barbara Minto",
              sourceDetail: "The Pyramid Principle",
            },
            example: {
              situation: "Daniel, an operations manager, emails his director about a supplier problem.",
              before:
                "\"Hi Claire, last month we started seeing some delays from our packaging supplier. We looked into it and found a few issues with their capacity. We talked to two alternatives and got quotes. One is a bit more expensive but more reliable…\"",
              after:
                "\"Hi Claire, I recommend we switch packaging suppliers by 1 March; I need your approval by Friday. The current supplier has missed four deliveries, and the alternative costs 3% more but guarantees capacity. Details below.\"",
              whyItWorks:
                "Claire knows the recommendation, the deadline and the trade-off in two sentences. She can approve from her phone or read on if she wants the detail.",
            },
            reflectionPrompt:
              "Open the last update you sent to someone senior. Where was your actual conclusion, and how many lines did they have to read to find it?",
          },
          exercise: {
            title: "Flip the update",
            description: "Rewrite a chronological update so the bottom line comes first.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this status update for your director. Put the conclusion and the decision you need in the first sentence.",
              original:
                "So this week we ran the pricing test on the two landing pages. It took a bit longer than expected because of some tracking issues, which we fixed on Tuesday. After that the data came in and it looks like the annual plan page converted noticeably better. I think we should probably consider making it the default, if you agree.",
              tips: [
                "Start with the recommendation, not the timeline.",
                "Name the decision you need from them.",
                "Keep one or two facts as support; drop the tracking story.",
              ],
              maxWords: 45,
              keywords: ["recommend", "default", "approve", "annual"],
              modelAnswer:
                "I recommend making the annual plan page our default; can you approve this week? In this week's test it converted noticeably better than the monthly page. Full results attached.",
            },
          },
          quiz: [
            {
              prompt:
                "You are emailing a VP who usually reads only the first two lines. What belongs there?",
              options: [
                "A summary of everything the team did this month",
                "The background that explains why the issue came up",
                "Your recommendation and the decision you need from them",
                "A friendly greeting and a note that the email is long",
              ],
              correctIndex: 2,
              explanation:
                "If they only read two lines, those lines must let them act. Background is support, not the headline.",
              conceptKey: "comms-bluf-placement",
            },
            {
              prompt: "In the Pyramid Principle, what sits at the top of the pyramid?",
              options: [
                "The data that supports your argument",
                "The single main idea or conclusion",
                "The chronology of events",
                "The open questions",
              ],
              correctIndex: 1,
              explanation:
                "The main idea goes on top; supporting arguments group beneath it, and data sits beneath those.",
              conceptKey: "comms-pyramid-top",
            },
            {
              prompt: "Why do people often bury their conclusion at the end?",
              options: [
                "Because executives prefer suspense",
                "Because they write in the order the work happened, to show effort",
                "Because conclusions are less important than process",
                "Because email clients hide the first line",
              ],
              correctIndex: 1,
              explanation:
                "Chronological writing mirrors how we experienced the work. It feels thorough, but it forces the reader to dig for the point.",
              conceptKey: "comms-bluf-chronology-trap",
            },
          ],
          action: {
            title: "Send one BLUF message",
            description:
              "Before sending your next update, request or report today, rewrite it so the first sentence is the conclusion or the decision you need. Move background to the end.",
            successCriteria:
              "You sent at least one message where someone could act on the first sentence alone.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "comms-authority-without-aggression",
          title: "Speak with authority without sounding aggressive",
          description: "Combine a firm position with genuine openness so you sound certain, not combative.",
          category: "executive_presence",
          difficulty: "intermediate",
          estimatedMinutes: 12,
          content: {
            hook: "Many professionals swing between two settings: so soft they are ignored, or so forceful they create resistance. Authority lives in the middle.",
            whyItMatters:
              "In leadership meetings, the person who sounds calmly certain is usually the one whose view shapes the decision. Pushing too hard makes people defend their own position instead of considering yours. Both extremes cost you influence.",
            coreConcept: {
              title: "Firm on the point, open on the person",
              body: [
                "Authority comes from conviction about your position, not pressure on other people. You can state your view plainly and still show real curiosity about theirs.",
                "Aggression usually leaks through absolutes ('obviously', 'always', 'that's wrong'), interruption and speed. Authority comes through short declarative sentences, a measured pace and acknowledging other views without retreating from yours.",
                "A useful pattern: state your position, give your strongest reason, then invite challenge. 'My view is X, because Y. What am I missing?' The invitation signals confidence, not doubt.",
              ],
              keyPoints: [
                "State your view in a plain declarative sentence.",
                "Swap absolutes and attacks for reasons.",
                "Acknowledge other views without abandoning yours.",
                "Inviting challenge shows confidence, not weakness.",
              ],
            },
            expertInsight: {
              text: "Research by Daniel Ames and Francis Flynn found that assertiveness and perceived leadership effectiveness follow an inverted-U shape: people seen as too unassertive and those seen as overly assertive were both rated as less effective than those in a moderate range.",
              source: "Daniel Ames & Francis Flynn",
              sourceDetail: "Research on assertiveness and leadership, Journal of Personality and Social Psychology (2007)",
            },
            example: {
              situation: "Ines, a marketing director, disagrees with a peer who wants to cut the brand budget.",
              before:
                "\"That's honestly a terrible idea. Everyone knows cutting brand spend always backfires. We tried that before and it was a disaster.\"",
              after:
                "\"I'd keep the brand budget. Our last cut was followed by two quarters of weaker pipeline. I see the cost pressure, so let's find savings elsewhere. What would you need to see to agree?\"",
              whyItWorks:
                "Ines is just as clear about her position, but she argues with evidence instead of labels, acknowledges the real concern and gives her peer a path to agree without losing face.",
            },
            reflectionPrompt:
              "When you disagree under pressure, do you tend to go too soft or too sharp? What does that sound like in your words?",
          },
          exercise: {
            title: "Find the authoritative response",
            description: "Choose the reply that is firm on substance and respectful in tone.",
            config: {
              type: "choice",
              scenario:
                "In a planning meeting, a senior colleague says: \"We should launch in all five markets at once. Phasing is too slow.\" You believe a two-market pilot is safer.",
              question: "Which response carries the most authority without escalating?",
              options: [
                {
                  text: "\"I mean, maybe, I'm just slightly worried it could be risky? But you know best.\"",
                  quality: "weak",
                  feedback:
                    "Hedges and deference bury your view. The room will likely hear agreement, not a concern.",
                },
                {
                  text: "\"That's way too risky, and honestly that approach never works.\"",
                  quality: "weak",
                  feedback:
                    "Absolutes and dismissal invite a defensive reaction. The debate becomes about winning, not the launch.",
                },
                {
                  text: "\"I'd pilot in two markets first. We'll learn what breaks before it breaks five times. What would make phasing too slow for you?\"",
                  quality: "best",
                  feedback:
                    "A clear recommendation, a concrete reason and a genuine question. Firm on substance, open on the person.",
                },
                {
                  text: "\"Let's take this offline and discuss later.\"",
                  quality: "ok",
                  feedback:
                    "Sometimes useful, but here it avoids stating your view while the decision is being shaped in the room.",
                },
              ],
            },
          },
          quiz: [
            {
              prompt: "Which phrase is most likely to make a firm statement sound aggressive?",
              options: [
                "\"My recommendation is to delay.\"",
                "\"Obviously anyone can see this won't work.\"",
                "\"I see it differently.\"",
                "\"Here's what the data shows.\"",
              ],
              correctIndex: 1,
              explanation:
                "'Obviously anyone can see' implies others are foolish for disagreeing. It attacks the people, not the problem.",
              conceptKey: "comms-authority-absolutes",
            },
            {
              prompt:
                "You state a firm view and then ask, \"What am I missing?\" How is this most likely to be perceived?",
              options: [
                "As a sign you are unsure of your position",
                "As confidence, because you are secure enough to invite challenge",
                "As passive-aggressive",
                "As changing the subject",
              ],
              correctIndex: 1,
              explanation:
                "Following a clear position with a real question shows you can hold a view and still learn. It reads as security, not doubt.",
              conceptKey: "comms-authority-invite-challenge",
            },
            {
              prompt: "What does research on assertiveness suggest about leadership effectiveness?",
              options: [
                "The more assertive, the more effective",
                "Assertiveness has no effect on perceived effectiveness",
                "Both too little and too much assertiveness tend to reduce perceived effectiveness",
                "Low assertiveness is consistently rated highest",
              ],
              correctIndex: 2,
              explanation:
                "Ames and Flynn found an inverted-U pattern: moderate assertiveness tended to be rated as more effective than either extreme.",
              conceptKey: "comms-authority-inverted-u",
            },
          ],
          action: {
            title: "Disagree calmly once",
            description:
              "The next time you disagree with something today, use the pattern: \"My view is X, because Y. What am I missing?\" Say it at a measured pace, without 'obviously', 'always' or 'never'.",
            successCriteria:
              "You voiced one disagreement using a clear position, one reason and an open question, with no absolutes.",
            difficulty: "intermediate",
            estimatedMinutes: 5,
          },
        },
        {
          slug: "comms-answer-hard-questions",
          title: "Answer hard questions in three moves",
          description: "Give a direct answer, one reason and a next step, then stop talking.",
          category: "executive_presence",
          difficulty: "intermediate",
          estimatedMinutes: 10,
          content: {
            hook: "When a senior person asks a hard question, most of us answer a different, easier one, at length. They notice.",
            whyItMatters:
              "Tough questions in reviews, interviews and client meetings are moments of judgment. A short, direct answer builds trust even when the news is bad. A long, wandering one makes people wonder what you are avoiding.",
            coreConcept: {
              title: "Answer, reason, next step",
              body: [
                "Start with a direct answer to the question actually asked: yes, no, a number, a date or 'I don't know yet'. Then give the single most important reason. Then say what happens next.",
                "Pressure pushes us to fill silence with context. Resist it. A two-second pause before answering looks thoughtful, not unprepared.",
                "If you do not know, say so plainly and commit to when you will. 'I don't know; I'll have it by Thursday' is a strong answer. Guessing is not.",
              ],
              keyPoints: [
                "Answer the question asked, in the first few words.",
                "One reason, not five.",
                "Close with a next step or commitment.",
                "A short pause beats a rushed answer.",
              ],
            },
            expertInsight: {
              text: "Daniel Kahneman describes fast, automatic thinking (System 1) and slower, deliberate thinking (System 2). Under pressure, the fast system tends to grab the first response that comes to mind; a brief pause gives the deliberate system a chance to choose the answer you actually mean.",
              source: "Daniel Kahneman",
              sourceDetail: "Thinking, Fast and Slow (2011)",
            },
            example: {
              situation: "Tom, a project lead, is asked by the CFO: \"Are we going to hit the March deadline?\"",
              before:
                "\"Well, there's been a lot going on. The integration turned out to be more complex, and we lost a developer in January, but the team's working really hard and we're doing everything we can…\"",
              after:
                "\"No, we're tracking to mid-April. The integration needed a rework we didn't plan for. I'll bring two options to recover time on Friday.\"",
              whyItWorks:
                "The CFO gets the answer in the first word, one honest reason and a concrete commitment. Bad news delivered this way builds credibility.",
            },
            reflectionPrompt:
              "Which kind of question makes you ramble most: about deadlines, numbers, mistakes or opinions? Why that one?",
          },
          exercise: {
            title: "Build a three-move answer",
            description: "Structure a concise answer to a tough question.",
            config: {
              type: "structure",
              framework: "Answer – Reason – Next step",
              instruction:
                "Your director asks in a team review: \"Why did customer churn go up last quarter?\" Fill in each part of a concise answer.",
              context:
                "You know churn rose mainly because a price increase hit small accounts hardest. You are preparing a retention offer but have not finalised it.",
              slots: [
                {
                  key: "answer",
                  label: "Direct answer",
                  hint: "Answer the 'why' in one sentence.",
                  maxWords: 20,
                },
                {
                  key: "reason",
                  label: "Key reason or evidence",
                  hint: "The single most important supporting fact.",
                  maxWords: 25,
                },
                {
                  key: "next",
                  label: "Next step",
                  hint: "What you will do, and by when.",
                  maxWords: 20,
                },
              ],
            },
          },
          quiz: [
            {
              prompt:
                "A client asks, \"Will this cost more than the original quote?\" It will. What is the best first sentence?",
              options: [
                "\"There are a lot of moving parts, so it's hard to say.\"",
                "\"Yes, by about 10%, mainly because of the added integrations.\"",
                "\"Let me explain how the project evolved over the last month.\"",
                "\"We've worked hard to keep costs down throughout.\"",
              ],
              correctIndex: 1,
              explanation:
                "It answers the question in the first word and gives the main reason. Everything else can follow if they ask.",
              conceptKey: "comms-hard-q-direct",
            },
            {
              prompt: "You are asked a question you cannot answer yet. What is the strongest response?",
              options: [
                "Give your best guess confidently",
                "Talk about related topics you do know",
                "\"I don't know yet. I'll confirm by Thursday.\"",
                "Redirect the question to a colleague without warning",
              ],
              correctIndex: 2,
              explanation:
                "A plain admission plus a commitment is honest and actionable. Guessing risks your credibility when the real answer arrives.",
              conceptKey: "comms-hard-q-dont-know",
            },
            {
              prompt: "Why can a short pause before answering a hard question help?",
              options: [
                "It makes the questioner uncomfortable",
                "It gives deliberate thinking a moment to choose your answer",
                "It signals that the question was unfair",
                "It buys time to change the subject",
              ],
              correctIndex: 1,
              explanation:
                "A brief pause lets you move past the first reflexive response and pick the answer you actually want to give.",
              conceptKey: "comms-hard-q-pause",
            },
          ],
          action: {
            title: "Answer first, once",
            description:
              "The next time someone asks you a direct question today, start your reply with the answer itself (yes, no, a number, a date or 'I don't know yet') before any context.",
            successCriteria:
              "You answered at least one real question with the answer in your first few words, followed by one reason and a next step.",
            difficulty: "intermediate",
            estimatedMinutes: 5,
          },
        },
        {
          slug: "comms-cut-hedges",
          title: "Cut the hedges and qualifiers",
          description: "Remove the small words that quietly drain authority from what you say and write.",
          category: "executive_presence",
          difficulty: "beginner",
          estimatedMinutes: 8,
          content: {
            hook: "\"I just think maybe we could possibly look at this?\" Five softeners, one idea, and almost no impact.",
            whyItMatters:
              "Hedges feel polite, but in volume they signal uncertainty you may not have. Colleagues and leaders weigh your ideas partly by how you frame them. Cutting filler makes the same idea sound like a recommendation instead of a wish.",
            coreConcept: {
              title: "Say it once, plainly",
              body: [
                "Common hedges include 'just', 'maybe', 'I think', 'sort of', 'a bit', 'possibly' and 'does that make sense?'. Each one alone is harmless. Stacked together, they tell the listener not to take you seriously.",
                "Keep a qualifier only when it carries real information. 'We'll likely finish Friday' is honest if there is genuine risk. 'I just wanted to maybe check' is not information; it is apology.",
                "Removing hedges is not the same as removing warmth. You can be kind and direct: 'Thanks for this. I recommend we change the headline.'",
              ],
              keyPoints: [
                "Spot the usual suspects: just, maybe, I think, sort of, possibly.",
                "Keep qualifiers that carry real uncertainty; cut the rest.",
                "Direct and warm can coexist.",
                "Read your messages once before sending, hunting for hedges.",
              ],
            },
            expertInsight: {
              text: "Research on 'powerless' speech, including early studies of courtroom testimony, found that frequent hedges, hesitations and tag questions tend to lower how credible and competent a speaker is judged, even when the content is identical.",
              source: "Research on powerless speech style",
              sourceDetail: "e.g. Erickson, Lind, Johnson & O'Barr (1978)",
            },
            example: {
              situation: "Nora, a UX designer, gives feedback on a colleague's proposal in a team chat.",
              before:
                "\"Hey, sorry, just a small thought, I could be wrong, but maybe the sign-up flow is sort of a bit long? Not sure, just an idea!\"",
              after:
                "\"Thanks for sharing. The sign-up flow feels long; I'd cut it from five steps to three. Happy to sketch it.\"",
              whyItWorks:
                "Nora keeps the warmth and drops the self-erasing language. Her suggestion now reads as a professional recommendation with a clear next step.",
            },
            reflectionPrompt:
              "Which hedge do you use most often, and in which situations does it show up most?",
          },
          exercise: {
            title: "Strip the hedges",
            description: "Rewrite a hedge-heavy message so it sounds like a recommendation.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this message to your team lead. Keep it polite, remove every unnecessary hedge and make the recommendation clear.",
              original:
                "Hi! Sorry to bother you, I just wanted to maybe flag that I sort of think we might possibly need to push the review meeting a bit, if that's okay? I'm not totally sure but the data might not be ready. Does that make sense?",
              tips: [
                "Lead with the recommendation.",
                "Keep one reason.",
                "Cut 'just', 'maybe', 'sort of', 'possibly' and the closing question.",
              ],
              maxWords: 30,
              keywords: ["recommend", "move", "push", "data"],
              modelAnswer:
                "I recommend moving the review meeting to Thursday. The data won't be ready by Tuesday, and reviewing it incomplete would waste everyone's time.",
            },
          },
          quiz: [
            {
              prompt: "Which qualifier carries real information and is worth keeping?",
              options: [
                "\"I just wanted to check…\"",
                "\"We'll probably finish Friday; the vendor still owes us one file.\"",
                "\"This is sort of a good idea.\"",
                "\"Sorry, maybe I'm wrong, but…\"",
              ],
              correctIndex: 1,
              explanation:
                "'Probably' here reflects a real dependency the reader should know about. The others signal hesitation without adding information.",
              conceptKey: "comms-hedge-informative",
            },
            {
              prompt:
                "A colleague worries that cutting hedges will make them sound rude. What is the best advice?",
              options: [
                "Keep the hedges; politeness matters most",
                "Replace hedges with exclamation marks",
                "Keep warmth through thanks or acknowledgment, and state the point plainly",
                "Only cut hedges when writing to junior colleagues",
              ],
              correctIndex: 2,
              explanation:
                "Warmth comes from acknowledgment and tone, not from weakening your point. You can be both kind and clear.",
              conceptKey: "comms-hedge-warm-direct",
            },
            {
              prompt: "Why does ending with 'Does that make sense?' often weaken a message?",
              options: [
                "It suggests you doubt your own clarity",
                "It is too informal for work",
                "It makes the message too short",
                "It is a leading question",
              ],
              correctIndex: 0,
              explanation:
                "It frames your message as possibly confusing. A specific question, such as 'Any concerns about Thursday?', invites input without undercutting you.",
              conceptKey: "comms-hedge-tag-question",
            },
          ],
          action: {
            title: "Hedge audit before sending",
            description:
              "Before sending your next three messages or emails today, reread each one and delete every 'just', 'maybe', 'sort of' and 'I think' that does not carry real uncertainty.",
            successCriteria:
              "You edited at least three outgoing messages and removed at least one unnecessary hedge from each.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
      ],
    },

    /* ───────────────────────── Module 3 ───────────────────────── */
    {
      title: "Storytelling",
      description:
        "Facts inform, stories move. Learn a simple structure for work stories and how to use contrast to make your point stick.",
      lessons: [
        {
          slug: "comms-story-spine",
          title: "Tell a work story in under a minute",
          description: "Use a simple story structure to turn an update or example into something people remember.",
          category: "storytelling",
          difficulty: "beginner",
          estimatedMinutes: 12,
          content: {
            hook: "You have probably shared a dozen facts this week. Which of them will anyone repeat tomorrow? The ones wrapped in a story.",
            whyItMatters:
              "Stories help people remember, care and act. In interviews, pitches and team updates, a short story about one customer or one decision often does more than a slide of numbers. Most professionals never use them because they think stories must be long or dramatic.",
            coreConcept: {
              title: "The story spine",
              body: [
                "A story spine is a simple skeleton: there was a normal situation, then something changed, and because of that a series of consequences followed, until a resolution was reached. It fits a 30-second update as well as a keynote.",
                "In a work setting it compresses to four beats: the normal state, the change or problem, what you did about it, and what is different now. Add the lesson if it is not obvious.",
                "Keep one main character, one problem and one turning point. Details that do not move the story forward should go.",
              ],
              keyPoints: [
                "Normal state → change → actions → new normal.",
                "One character, one problem, one turning point.",
                "Concrete details beat general claims.",
                "Close with what is different now or what it means.",
              ],
            },
            expertInsight: {
              text: "The 'story spine' is an improvisation tool created by theatre teacher Kenn Adams. It reached a wider audience when former Pixar storyboard artist Emma Coats included a version of it in her widely shared list of storytelling rules.",
              source: "Kenn Adams; popularised by Emma Coats",
              sourceDetail: "Story spine, from improv practice and Coats's 'Pixar story rules'",
            },
            example: {
              situation: "Lucía, a customer support manager, explains why she wants to extend chat hours.",
              before:
                "\"Our data shows evening ticket volume is up and response times after 6 pm are slower, so we should consider extending chat coverage.\"",
              after:
                "\"Every evening, our chat closed at 6. Then last month a hospital client hit a billing error at 7 pm and waited until morning. Because of that, they escalated to their CEO. We covered evenings for two weeks as a test, and since then, after-6 complaints have stopped.\"",
              whyItWorks:
                "One client, one moment and one change make the same data impossible to ignore. Leaders can picture the cost of doing nothing.",
            },
            reflectionPrompt:
              "Think of one result you achieved this year. What was the 'normal' before it, and what was the moment things changed?",
          },
          exercise: {
            title: "Put the story in order",
            description: "Arrange the beats of a short work story into a clear spine.",
            config: {
              type: "order",
              instruction:
                "Arrange these sentences into a story a sales lead could tell in a team meeting.",
              items: [
                "For two years, we sent every new client the same 40-page onboarding pack.",
                "Then a new client told us they never opened it and nearly cancelled in week two.",
                "Because of that, we replaced the pack with a 20-minute welcome call.",
                "Because of that, clients started using the product in their first week.",
                "Now the welcome call is standard, and early cancellations have dropped.",
              ],
              explanation:
                "The story moves from the normal state, to the change that disrupted it, to the actions taken, to the new normal. Each step causes the next, which is what makes it easy to follow.",
            },
          },
          quiz: [
            {
              prompt: "Which opening best sets up a work story?",
              options: [
                "\"Stories are really important in business.\"",
                "\"Every Monday, our team spent three hours compiling the same report by hand.\"",
                "\"Here are five key learnings from this quarter.\"",
                "\"Let me give you some background on our tools.\"",
              ],
              correctIndex: 1,
              explanation:
                "It establishes a concrete normal state, which sets up a change. The others are claims or agendas, not story openings.",
              conceptKey: "comms-story-normal-state",
            },
            {
              prompt: "You have 45 seconds to tell a story in an interview. What should you cut first?",
              options: [
                "The turning point",
                "The result",
                "Background details that don't affect what happened",
                "The main character",
              ],
              correctIndex: 2,
              explanation:
                "The spine needs the character, the change and the outcome. Context that does not drive the action is what makes stories drag.",
              conceptKey: "comms-story-cut-detail",
            },
            {
              prompt: "Why does 'because of that' make a story easier to follow?",
              options: [
                "It makes the story sound more formal",
                "It links each event causally to the last, so the listener sees why things happened",
                "It adds suspense",
                "It lets you include more details",
              ],
              correctIndex: 1,
              explanation:
                "Causal links turn a list of events into a narrative. Listeners follow and remember cause and effect more easily than sequence alone.",
              conceptKey: "comms-story-causality",
            },
          ],
          action: {
            title: "Tell one story today",
            description:
              "In a meeting, call or conversation today, replace one factual update with a short story using the spine: normal state, change, what you did, what is different now. Keep it under a minute.",
            successCriteria:
              "You told one work story of under a minute using all four beats, and noticed whether people asked follow-up questions.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "comms-contrast-makes-it-stick",
          title: "Use contrast to make your point stick",
          description: "Show the gap between what is and what could be, so people feel the need to change.",
          category: "storytelling",
          difficulty: "intermediate",
          estimatedMinutes: 10,
          content: {
            hook: "\"We should improve onboarding\" is easy to agree with and easy to ignore. Show people the gap, and they lean in.",
            whyItMatters:
              "Proposals, pitches and change requests often fail not because the idea is bad, but because the current state feels fine. Contrast makes the cost of staying put visible, which is what moves people to act.",
            coreConcept: {
              title: "What is versus what could be",
              body: [
                "Contrast places two pictures side by side: how things are today and how they could be. The tension between them creates a reason to move.",
                "Make both sides concrete. 'Today, a new hire waits nine days for system access. It could be ready on day one.' Vague contrasts like 'better' or 'more efficient' do not create tension.",
                "In longer talks, move back and forth between the two several times, then end on the better future and the step that gets you there.",
              ],
              keyPoints: [
                "Show today's reality, then the possible future.",
                "Make both sides specific and visual.",
                "The gap creates the motivation, not the adjectives.",
                "End on the future and the first step.",
              ],
            },
            expertInsight: {
              text: "Presentation designer Nancy Duarte analysed many well-known speeches and found that strong ones repeatedly move between 'what is' and 'what could be'. That oscillation creates tension that makes audiences want the new future.",
              source: "Nancy Duarte",
              sourceDetail: "Resonate (2010)",
            },
            example: {
              situation: "Omar, an IT manager, asks for budget to automate expense approvals.",
              before:
                "\"Automating expense approvals would make the process more efficient and improve the employee experience.\"",
              after:
                "\"Today, an expense claim passes through four inboxes and takes two weeks to pay. With automation, it's approved the same day and paid in the next cycle.\"",
              whyItWorks:
                "The concrete 'today' makes the pain real, and the concrete 'could be' makes the benefit tangible. The gap does the persuading.",
            },
            reflectionPrompt:
              "What change are you trying to make at work right now? Describe today's reality and the better future in one sentence each.",
          },
          exercise: {
            title: "Add the contrast",
            description: "Rewrite a flat proposal so it shows the gap between today and tomorrow.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this proposal line using contrast: one concrete sentence on how things are today, one on how they could be.",
              original:
                "I think a shared project dashboard would really help improve visibility and communication across the teams, and it would probably make things more efficient overall.",
              tips: [
                "Start with 'Today,' and describe a specific pain.",
                "Follow with what it could look like, just as concretely.",
                "Replace 'efficient' and 'visibility' with things people can picture.",
              ],
              maxWords: 45,
              keywords: ["today", "instead", "could", "with"],
              modelAnswer:
                "Today, project status lives in six spreadsheets, and leads spend Monday mornings chasing updates. With one shared dashboard, anyone could see every project's status in a minute.",
            },
          },
          quiz: [
            {
              prompt: "Which line uses contrast most effectively?",
              options: [
                "\"Our new process will be much better.\"",
                "\"Today, customers wait three days for a quote. Next quarter, they could get one in an hour.\"",
                "\"Change is hard, but necessary.\"",
                "\"We need to be more agile and customer-centric.\"",
              ],
              correctIndex: 1,
              explanation:
                "Both sides are concrete and comparable, so the gap is obvious. The others are claims without a picture.",
              conceptKey: "comms-contrast-concrete",
            },
            {
              prompt: "Why does showing the current state matter when proposing a change?",
              options: [
                "It proves you did your research",
                "It makes the cost of doing nothing visible",
                "It makes the presentation longer",
                "It shows respect for past decisions",
              ],
              correctIndex: 1,
              explanation:
                "Many proposals fail because the status quo feels fine. A vivid 'what is' makes staying put feel costly.",
              conceptKey: "comms-contrast-status-quo",
            },
            {
              prompt: "In a longer presentation using contrast, where should you end?",
              options: [
                "On today's problems, to leave urgency",
                "On a summary of all the data",
                "On the better future and the first step to get there",
                "On the risks of the proposal",
              ],
              correctIndex: 2,
              explanation:
                "Ending on the possible future, with a clear next step, turns the tension you created into action.",
              conceptKey: "comms-contrast-ending",
            },
          ],
          action: {
            title: "Pitch with contrast",
            description:
              "Pick one idea you want someone to support. Today, in a message or conversation, describe it with one 'Today…' sentence and one 'Instead, we could…' sentence.",
            successCriteria:
              "You shared one proposal using a concrete current state and a concrete future state, and noted the response.",
            difficulty: "intermediate",
            estimatedMinutes: 10,
          },
        },
      ],
    },
  ],
};
