import type { JourneySeed } from "../types";

export const confidentPresence: JourneySeed = {
  slug: "confident-presence",
  title: "Confident Presence",
  subtitle: "Act with calm conviction, even under pressure.",
  description:
    "Nine practical sessions on the inner game, the voice and body that carry your message, and the moments that test you: speaking up, facing pushback and recovering from mistakes. Confidence here is a set of trainable behaviours, not a personality.",
  category: "confidence",
  difficulty: "beginner",
  order: 2,
  modules: [
    /* ───────────────────────── Module 1 ───────────────────────── */
    {
      title: "The Inner Game",
      description:
        "Confidence starts before you speak. Learn to work with nerves instead of against them, prepare your state on purpose and coach yourself through pressure.",
      lessons: [
        {
          slug: "conf-reframe-nerves",
          title: "Reframe nerves as readiness",
          description: "Treat the physical signs of nerves as energy for performance rather than a warning.",
          category: "confidence",
          difficulty: "beginner",
          estimatedMinutes: 8,
          content: {
            hook: "Before a big presentation, most people tell themselves to calm down. It rarely works, and there is a better instruction.",
            whyItMatters:
              "Racing heart, warm face and restless hands show up before interviews, pitches and difficult conversations. If you read them as proof that you are not ready, they get worse. If you read them as your body preparing to perform, you can use them.",
            coreConcept: {
              title: "Same signals, different story",
              body: [
                "Anxiety and excitement feel remarkably similar in the body: both raise your heart rate and sharpen attention. The main difference is the story you tell about them.",
                "Trying to force yourself from high arousal to calm is a big jump, and it often fails. Shifting from 'anxious' to 'ready' or 'excited' keeps the energy and changes its direction.",
                "This is not pretending to feel fine. It is choosing the interpretation that helps you perform: 'My body is getting ready for something that matters.'",
              ],
              keyPoints: [
                "Nerves and excitement share the same physical signals.",
                "Forcing calm is hard; redirecting energy is easier.",
                "Name it as readiness: 'I'm getting ready for this.'",
                "Nerves usually mean you care about the outcome.",
              ],
            },
            expertInsight: {
              text: "Research by Alison Wood Brooks found that people who reappraised pre-performance anxiety as excitement, for example by saying 'I am excited', tended to perform better on tasks such as public speaking than those who tried to calm themselves down.",
              source: "Alison Wood Brooks",
              sourceDetail: "Research on anxiety reappraisal, Journal of Experimental Psychology: General (2014)",
            },
            example: {
              situation: "Hana, a consultant, is about to present findings to a client's board.",
              before:
                "She thinks: \"My heart is pounding. I'm going to blank. I need to calm down right now.\" She tries to slow everything down and feels more on edge.",
              after:
                "She thinks: \"My heart is pounding because this matters. That's energy. I'm ready to use it.\" She takes one slow breath and opens with her first line.",
              whyItWorks:
                "Hana does not fight her body's signals. She reinterprets them as fuel, which keeps her focused on the audience instead of on suppressing her nerves.",
            },
            reflectionPrompt:
              "What physical signs tell you that you're nervous? What would those same signs mean if you interpreted them as readiness?",
          },
          exercise: {
            title: "Rewrite your inner script",
            description: "Turn anxious self-talk into a readiness statement.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this inner monologue before a presentation. Keep the honesty about the physical signals, but reframe them as readiness.",
              original:
                "Oh no, my hands are shaking and my heart is racing. Everyone's going to see how nervous I am. I'm not ready for this. I just need to calm down or I'm going to mess it up.",
              tips: [
                "Acknowledge the physical signals; do not deny them.",
                "Reinterpret them as energy or excitement.",
                "End with a focus on your first action.",
              ],
              maxWords: 35,
              keywords: ["excited", "ready", "energy", "matters"],
              modelAnswer:
                "My heart is racing because this matters to me. That's energy, and I'm going to use it. I'm excited to share this. First line: the recommendation.",
            },
          },
          quiz: [
            {
              prompt:
                "Five minutes before a job interview, your heart is pounding. Which self-statement is most likely to help?",
              options: [
                "\"Calm down, calm down, calm down.\"",
                "\"I'm excited; this is my body getting ready.\"",
                "\"Don't think about it.\"",
                "\"It doesn't matter if I fail.\"",
              ],
              correctIndex: 1,
              explanation:
                "Reappraising the arousal as excitement keeps the energy and points it at the task. Forcing calm or suppressing thoughts tends to backfire.",
              conceptKey: "conf-reappraise-excitement",
            },
            {
              prompt: "Why is moving from anxiety to excitement often easier than moving to calm?",
              options: [
                "Excitement requires no effort at all",
                "Both are high-energy states, so you change the interpretation, not the arousal level",
                "Calm is a negative emotion",
                "Excitement makes you less aware of the audience",
              ],
              correctIndex: 1,
              explanation:
                "Anxiety and excitement share similar physical signals. Shifting the label is a small step; dropping to calm is a big one.",
              conceptKey: "conf-arousal-match",
            },
            {
              prompt: "A colleague says reframing nerves is 'just lying to yourself'. What's the best response?",
              options: [
                "They're right; it only works if you believe it fully",
                "It's not denial: you acknowledge the signals and choose a more useful interpretation",
                "It works only for extroverts",
                "It's about hiding nerves from the audience",
              ],
              correctIndex: 1,
              explanation:
                "Reappraisal does not deny what you feel. It accepts the signals and changes what you take them to mean.",
              conceptKey: "conf-reframe-not-denial",
            },
          ],
          action: {
            title: "Say 'I'm ready' before one moment",
            description:
              "Before your next nerve-inducing moment today (a call, a meeting, asking a question), notice one physical signal and say to yourself: \"This is energy. I'm ready.\"",
            successCriteria:
              "You used the reframe before at least one real moment and noted whether it changed how you started.",
            difficulty: "beginner",
            estimatedMinutes: 5,
          },
        },
        {
          slug: "conf-pre-meeting-routine",
          title: "Build a two-minute pre-meeting routine",
          description: "Use a short, repeatable routine to arrive at important moments focused instead of frazzled.",
          category: "confidence",
          difficulty: "beginner",
          estimatedMinutes: 10,
          content: {
            hook: "Many people walk into important meetings straight from their inbox, still half-reading the last email. Then they wonder why they feel scattered.",
            whyItMatters:
              "Your state when you enter a room often shapes how the first minutes go. A short, consistent routine gives you a reliable way to switch on, even on a bad day or after a hard meeting.",
            coreConcept: {
              title: "Same steps, every time",
              body: [
                "A pre-performance routine is a short sequence you repeat before moments that matter. Because it is familiar, it signals to your mind that it is time to focus, and it gives nerves something useful to do.",
                "A practical version takes two minutes: close other tabs, take a few slow breaths with longer exhales, recall your one key point and decide on your first sentence.",
                "The power is in the repetition, not the specific steps. Choose a sequence you can actually do in a corridor or before a video call, and keep it the same.",
              ],
              keyPoints: [
                "Routines turn focus into a habit, not a hope.",
                "Clear distractions, breathe slowly, recall your point.",
                "Decide your first sentence before you enter.",
                "Keep it short and identical each time.",
              ],
            },
            expertInsight: {
              text: "Sports psychology has long studied pre-performance routines, such as the consistent sequence athletes follow before a free throw or a serve. Research in this area suggests that well-practised routines help people manage attention and arousal under pressure.",
              source: "Sports psychology research on pre-performance routines",
            },
            example: {
              situation: "Kenji, a sales manager, has back-to-back calls and a key client pitch at 3 pm.",
              before:
                "He finishes a tense internal call at 2:59, joins the pitch while still replying to a message and opens with \"Sorry, give me one second…\"",
              after:
                "At 2:55 he closes everything, takes five slow breaths, rereads his one-line goal for the call and says his opening line once. At 3:00 he starts: \"Thanks for the time. Today I want to show you how to cut onboarding time in half.\"",
              whyItWorks:
                "The routine creates a clean break between the last call and this one. Kenji arrives with his attention and his opening ready.",
            },
            reflectionPrompt:
              "What do you usually do in the two minutes before an important meeting? What would you change?",
          },
          exercise: {
            title: "Order the routine",
            description: "Arrange a two-minute pre-meeting routine in the most effective sequence.",
            config: {
              type: "order",
              instruction:
                "Put these steps in the order that best prepares you in the two minutes before an important meeting.",
              items: [
                "Close your inbox, chat and unrelated tabs.",
                "Take five slow breaths, making each exhale longer than the inhale.",
                "Recall the one outcome you want from this meeting.",
                "Say your opening sentence once, quietly or in your head.",
                "Enter or join the call and deliver that opening.",
              ],
              explanation:
                "First remove distractions, then settle your body, then focus your mind on the goal, then rehearse the very first move. Each step builds on the one before, and the last step is action, not more thinking.",
            },
          },
          quiz: [
            {
              prompt: "What makes a pre-meeting routine effective over time?",
              options: [
                "Changing it every time so it stays interesting",
                "Repeating the same short sequence consistently",
                "Making it as long as possible",
                "Doing it only for the most important meetings of the year",
              ],
              correctIndex: 1,
              explanation:
                "Consistency is what turns the routine into a reliable cue for focus. A short sequence you actually do beats an elaborate one you skip.",
              conceptKey: "conf-routine-consistency",
            },
            {
              prompt: "You have 60 seconds before a video call. Which single step adds the most?",
              options: [
                "Checking email one last time",
                "Deciding your opening sentence",
                "Rereading the full agenda word by word",
                "Adjusting your background",
              ],
              correctIndex: 1,
              explanation:
                "Knowing your first sentence removes the most stressful moment of uncertainty and lets you start with intent.",
              conceptKey: "conf-routine-first-line",
            },
            {
              prompt: "Why include slow breaths with longer exhales in a routine?",
              options: [
                "They make you look calm to others",
                "Slow, extended exhales are widely used to help settle the body under stress",
                "They replace the need to prepare content",
                "They guarantee you won't feel nervous",
              ],
              correctIndex: 1,
              explanation:
                "Slow breathing with longer exhales is a common, practical way to take the edge off physical tension. It helps; it does not eliminate nerves.",
              conceptKey: "conf-routine-breathing",
            },
          ],
          action: {
            title: "Run your routine once",
            description:
              "Before one meeting or call today, take two minutes to run the routine: close distractions, five slow breaths, recall your goal, say your opening line.",
            successCriteria:
              "You completed all four steps before a real meeting and opened with the sentence you prepared.",
            difficulty: "beginner",
            estimatedMinutes: 5,
          },
        },
        {
          slug: "conf-coach-yourself",
          title: "Talk to yourself like a coach",
          description: "Use distanced self-talk to think clearly when pressure makes your inner voice harsh.",
          category: "confidence",
          difficulty: "beginner",
          estimatedMinutes: 9,
          content: {
            hook: "You would never tell a colleague, \"You're going to embarrass yourself.\" Yet many people say exactly that to themselves before a big moment.",
            whyItMatters:
              "Under pressure, inner talk often turns critical and catastrophic, and that noise crowds out clear thinking. A small change in how you address yourself can turn the inner critic into an inner coach.",
            coreConcept: {
              title: "Step back by changing the pronoun",
              body: [
                "When you think in the first person ('I can't do this'), you are inside the emotion. Addressing yourself by name or as 'you' ('Maria, you've prepared for this') creates a little distance, as if advising a friend.",
                "That distance helps you see the situation more objectively. Most people give better advice to others than to themselves; this borrows that skill.",
                "Good coaching self-talk is specific and forward-looking: what to do next, not how you feel about it. 'You know the numbers. Lead with the recommendation.'",
              ],
              keyPoints: [
                "First-person self-talk keeps you inside the emotion.",
                "Use your name or 'you' to create helpful distance.",
                "Coach yourself as you would coach a friend.",
                "Focus on the next action, not the feared outcome.",
              ],
            },
            expertInsight: {
              text: "Psychologist Ethan Kross and colleagues have studied 'distanced self-talk', such as using your own name or the second person. Their research suggests this small shift can help people regulate emotion and think more clearly in stressful situations.",
              source: "Ethan Kross",
              sourceDetail: "Chatter (2021) and related research on self-distancing",
            },
            example: {
              situation: "Rafael, a team lead, is about to give difficult feedback to a high performer.",
              before:
                "\"I hate this. I'm going to say it wrong and she's going to get upset and I won't know what to do.\"",
              after:
                "\"Rafael, you've done this before. You care about her growth. Start with the specific example, then listen.\"",
              whyItWorks:
                "The coach voice is calmer and practical. It reminds Rafael of his intent and gives him a first move instead of a list of fears.",
            },
            reflectionPrompt:
              "What does your inner critic usually say before a high-stakes moment? What would a supportive coach say instead?",
          },
          exercise: {
            title: "Choose the coaching voice",
            description: "Pick the self-talk most likely to help under pressure.",
            config: {
              type: "choice",
              scenario:
                "Elena is about to present quarterly results to senior leadership. One number is below target, and she is worried about being questioned.",
              question: "Which inner statement is most likely to help her perform?",
              options: [
                {
                  text: "\"Elena, you know why the number is low. Say it first and explain the fix.\"",
                  quality: "best",
                  feedback:
                    "Distanced, specific and action-focused. It turns worry into a plan for the exact moment she fears.",
                },
                {
                  text: "\"I just have to hope nobody asks about that number.\"",
                  quality: "weak",
                  feedback:
                    "Hoping to avoid the question leaves her unprepared and more anxious when it comes.",
                },
                {
                  text: "\"I'm going to be fine, I'm going to be fine.\"",
                  quality: "ok",
                  feedback:
                    "Reassuring, but vague and still in the first person. It does not tell her what to do.",
                },
                {
                  text: "\"I can't believe I missed target. They'll think I'm incompetent.\"",
                  quality: "weak",
                  feedback:
                    "Self-criticism and mind-reading increase pressure and pull attention away from the presentation.",
                },
              ],
            },
          },
          quiz: [
            {
              prompt: "Which is an example of distanced self-talk?",
              options: [
                "\"I'm so nervous right now.\"",
                "\"Why do I always mess this up?\"",
                "\"Sam, you've prepared. Start with the summary.\"",
                "\"I hope this goes well.\"",
              ],
              correctIndex: 2,
              explanation:
                "Using your own name and giving yourself a concrete instruction creates distance and points you toward action.",
              conceptKey: "conf-distanced-self-talk",
            },
            {
              prompt: "Why does distanced self-talk tend to help?",
              options: [
                "It suppresses emotion completely",
                "It lets you view the situation more like an advisor than a participant",
                "It makes others see you as confident",
                "It works only when spoken aloud",
              ],
              correctIndex: 1,
              explanation:
                "Stepping back gives you the perspective you would naturally offer a friend: calmer, more objective and more practical.",
              conceptKey: "conf-self-distance-why",
            },
            {
              prompt: "What makes coaching self-talk most useful just before a moment that matters?",
              options: [
                "Listing everything that could go wrong",
                "Repeating general affirmations",
                "Naming the specific next action",
                "Thinking about what others might be judging",
              ],
              correctIndex: 2,
              explanation:
                "A specific next action gives your attention somewhere useful to go. Worry and vague reassurance do not.",
              conceptKey: "conf-self-talk-action",
            },
          ],
          action: {
            title: "Coach yourself by name",
            description:
              "Before one moment today that makes you uneasy, silently address yourself by name and give one specific instruction (e.g. \"Ana, open with the ask.\").",
            successCriteria:
              "You used name-based self-talk with a concrete instruction at least once and noted how you felt afterwards.",
            difficulty: "beginner",
            estimatedMinutes: 5,
          },
        },
      ],
    },

    /* ───────────────────────── Module 2 ───────────────────────── */
    {
      title: "Voice & Body",
      description:
        "People hear confidence before they process your words. Learn to use pauses, land your sentences and hold a steady, present physical stance.",
      lessons: [
        {
          slug: "conf-power-of-the-pause",
          title: "Replace fillers with pauses",
          description: "Swap 'um', 'like' and 'you know' for short silences that make you sound composed.",
          category: "executive_presence",
          difficulty: "beginner",
          estimatedMinutes: 8,
          content: {
            hook: "Silence feels like an eternity to the speaker and like thoughtfulness to the listener. Fillers are what happens when we forget that.",
            whyItMatters:
              "A few fillers are normal and harmless. A constant stream makes even strong ideas sound unprepared, and it is one of the first things listeners notice under pressure. Pauses give your message weight and give you time to think.",
            coreConcept: {
              title: "Let the silence work",
              body: [
                "Fillers like 'um', 'uh', 'like', 'so' and 'you know' usually appear when your mouth is ahead of your thinking. They fill the gap because silence feels risky.",
                "The fix is not to talk faster or try harder. It is to close your mouth at the end of a thought and pause before the next one. A one- or two-second pause sounds deliberate to an audience.",
                "Pauses are also emphasis. A short silence before a key number or after a recommendation tells people: this part matters.",
              ],
              keyPoints: [
                "Fillers fill silence you are afraid of.",
                "Finish a thought, close your mouth, pause.",
                "Pauses read as composure, not hesitation.",
                "Pause before or after the line you want remembered.",
              ],
            },
            expertInsight: {
              text: "Toastmasters clubs have long used an 'Ah-Counter' role: one member counts every filler word a speaker uses and reports back. The practice reflects a simple principle: you cannot change a habit you do not notice, so awareness comes first.",
              source: "Toastmasters International",
              sourceDetail: "The Ah-Counter meeting role",
            },
            example: {
              situation: "Grace, a product analyst, presents a recommendation to her team.",
              before:
                "\"So, um, basically what we found is, like, users drop off at checkout, and, you know, we think, um, the shipping cost is the issue, so, yeah.\"",
              after:
                "\"Users drop off at checkout. (pause) The main reason is the shipping cost shown at the last step. (pause) We recommend showing it upfront.\"",
              whyItWorks:
                "The same content, without fillers and with deliberate pauses, sounds like a finding from someone who is sure of their analysis.",
            },
            reflectionPrompt:
              "Which filler word do you use most? In what kind of moments does it show up most often?",
          },
          exercise: {
            title: "Clean up the delivery",
            description: "Rewrite a filler-heavy answer as three crisp sentences.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this spoken answer as you would want to say it: no fillers, short sentences, each one a complete thought.",
              original:
                "So, um, yeah, basically the project is, like, mostly on track, I'd say, and, you know, the only thing is, um, the testing phase might take, like, a bit longer than we thought, so, yeah, that's kind of where we are.",
              tips: [
                "Cut every 'um', 'like', 'you know', 'so' and 'yeah'.",
                "Use short sentences; each one ends with a natural pause.",
                "State the status first, then the risk.",
              ],
              maxWords: 30,
              keywords: ["on track", "testing", "longer", "risk"],
              modelAnswer:
                "The project is on track. The one risk is testing, which may take a week longer than planned. I'll confirm the new date on Friday.",
            },
          },
          quiz: [
            {
              prompt: "What is usually the most effective way to reduce filler words?",
              options: [
                "Speak faster so there are no gaps",
                "Memorise your whole talk word for word",
                "Finish each thought, close your mouth and pause",
                "Replace 'um' with 'so'",
              ],
              correctIndex: 2,
              explanation:
                "Fillers fill gaps. Allowing short pauses removes the need for them. Speaking faster or memorising tends to create new ones.",
              conceptKey: "conf-filler-pause",
            },
            {
              prompt: "How does a two-second pause typically come across to an audience?",
              options: [
                "As forgetting what to say",
                "As deliberate and composed",
                "As rude",
                "As a technical problem",
              ],
              correctIndex: 1,
              explanation:
                "Pauses feel long to the speaker but usually read as thoughtful and in control to listeners.",
              conceptKey: "conf-pause-perception",
            },
            {
              prompt: "Where is a pause most useful for emphasis?",
              options: [
                "In the middle of a word",
                "Right before or after your key point",
                "Only at the very end of a talk",
                "Before every sentence equally",
              ],
              correctIndex: 1,
              explanation:
                "A pause around your key line signals importance and gives people time to absorb it.",
              conceptKey: "conf-pause-emphasis",
            },
          ],
          action: {
            title: "Be your own Ah-Counter",
            description:
              "Record yourself (voice memo or video) answering one question you often get at work, for about one minute. Count your fillers, then record it again with deliberate pauses.",
            successCriteria:
              "You recorded two takes and the second one contains fewer fillers than the first.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "conf-land-your-sentences",
          title: "Land your sentences",
          description: "End statements with a steady or falling tone so your point sounds like a point, not a question.",
          category: "executive_presence",
          difficulty: "beginner",
          estimatedMinutes: 8,
          content: {
            hook: "\"I think we should launch in May?\" The words say recommendation. The rising tone says permission request.",
            whyItMatters:
              "How a sentence ends shapes how it is received. When recommendations rise at the end, listeners may hear uncertainty or a request for approval. Landing your key sentences makes your view sound settled without making you louder.",
            coreConcept: {
              title: "Statements go down, questions go up",
              body: [
                "In English, a rising pitch at the end of a sentence usually signals a question or an invitation to respond. A level or falling pitch usually signals that you have finished a thought.",
                "Many people use a rising tone on statements, especially when they want to sound friendly or check that others agree. In casual talk this is fine. On a recommendation or decision, it can make your view sound tentative.",
                "Practise landing the last word of key sentences: let your pitch settle down and stop. Then pause. If you want input, ask a real question separately.",
              ],
              keyPoints: [
                "Rising ending = question; falling or level ending = statement.",
                "Land your recommendations; save rises for real questions.",
                "Settle on the last word, then pause.",
                "Ask for input as a separate, clear question.",
              ],
            },
            expertInsight: {
              text: "Linguists who study 'uptalk', the rising intonation on statements, note that it can serve useful social purposes such as checking understanding or keeping the floor. They also note that listeners can interpret it as uncertainty, and that perceptions vary across communities and contexts.",
              source: "Linguistics research on uptalk (high rising terminal)",
            },
            example: {
              situation: "Chloe, an account manager, recommends a renewal price to her director.",
              before:
                "\"So I'm recommending we hold the price at last year's level? Because they're a strategic account? And they might churn?\"",
              after:
                "\"I recommend we hold the price at last year's level. They're strategic, and a rise could push them to review alternatives. Do you see any reason not to?\"",
              whyItWorks:
                "Chloe's statements now sound like statements, and her request for input is a genuine, single question. Her director hears a confident recommendation that is still open to challenge.",
            },
            reflectionPrompt:
              "In which settings do you notice your sentences rising at the end? What might you be seeking in those moments?",
          },
          exercise: {
            title: "Spot the landed delivery",
            description: "Choose the delivery that sounds most settled and still invites input.",
            config: {
              type: "choice",
              scenario:
                "You are recommending a new tool to your team. You want to sound sure of your recommendation and still hear concerns.",
              question: "Which delivery works best? (Arrows show pitch at the end of each sentence.)",
              options: [
                {
                  text: "\"We should switch to the new tool? ↗ It's faster? ↗ And cheaper? ↗\"",
                  quality: "weak",
                  feedback:
                    "Every sentence rises, so the recommendation sounds like a series of questions seeking approval.",
                },
                {
                  text: "\"We should switch to the new tool. ↘ It's faster and cheaper. ↘ What concerns do you have? ↗\"",
                  quality: "best",
                  feedback:
                    "Statements land, and the one real question rises. You sound decided and open at the same time.",
                },
                {
                  text: "\"We should switch to the new tool. ↘ It's faster and cheaper. ↘ End of discussion. ↘\"",
                  quality: "weak",
                  feedback:
                    "Landed, but shutting down input turns confidence into dismissiveness and loses buy-in.",
                },
                {
                  text: "\"Maybe we could think about the new tool. → It might be faster. →\"",
                  quality: "ok",
                  feedback:
                    "The tone is steady, but the hedged words still make it sound tentative.",
                },
              ],
            },
          },
          quiz: [
            {
              prompt: "When is a rising tone at the end of a sentence most appropriate?",
              options: [
                "When stating a recommendation",
                "When asking a genuine question",
                "When announcing a decision",
                "When reporting a number",
              ],
              correctIndex: 1,
              explanation:
                "Rising intonation conventionally marks a question. On statements, it can make your view sound uncertain.",
              conceptKey: "conf-intonation-question",
            },
            {
              prompt: "You want to sound sure but open to input. What is the best approach?",
              options: [
                "Make every sentence rise to sound friendly",
                "Land your recommendation, then ask one clear question",
                "Avoid asking for input to sound more confident",
                "Speak louder on the last word",
              ],
              correctIndex: 1,
              explanation:
                "Separating the statement from the question gives you both clarity and openness.",
              conceptKey: "conf-land-then-ask",
            },
            {
              prompt: "What is a balanced view of uptalk?",
              options: [
                "It is always a sign of low confidence",
                "It never affects how people are perceived",
                "It can serve social purposes, but on key statements it may be heard as uncertainty",
                "It is only a feature of younger speakers",
              ],
              correctIndex: 2,
              explanation:
                "Uptalk has real social functions, and perceptions vary. The practical point is to choose your intonation deliberately on statements that need to sound settled.",
              conceptKey: "conf-uptalk-balanced",
            },
          ],
          action: {
            title: "Land three sentences",
            description:
              "In one meeting or call today, deliberately land the last word of at least three statements (let your pitch settle, then pause). Ask any question separately.",
            successCriteria:
              "You landed at least three statements in a real conversation and kept your question separate.",
            difficulty: "beginner",
            estimatedMinutes: 5,
          },
        },
        {
          slug: "conf-grounded-presence",
          title: "Be still and present",
          description: "Use a grounded stance, steady eye contact and reduced fidgeting to look as calm as you want to feel.",
          category: "executive_presence",
          difficulty: "intermediate",
          estimatedMinutes: 10,
          content: {
            hook: "Under pressure, some people shrink away and others push too hard. Presence is neither; it is being fully, calmly in the room.",
            whyItMatters:
              "Before people process your words, they read your body: whether you seem settled, distracted or tense. A grounded, still presence makes your message easier to trust, in person and on camera.",
            coreConcept: {
              title: "Grounded, open, connected",
              body: [
                "Stillness signals ease. Constant shifting, touching your face or clicking a pen draws attention away from what you are saying. Plant your feet, or sit with both feet on the floor, and let your hands rest when not gesturing.",
                "Connection comes from attention. Look at one person while you finish a thought, then move to another. On video, look at the camera when making your key point.",
                "This is not about holding a 'power' pose. It is about removing the small signals of discomfort so your attention, and your audience's, stays on the conversation.",
              ],
              keyPoints: [
                "Plant your feet; let your hands rest between gestures.",
                "Finish a thought while looking at one person.",
                "Reduce fidgets that pull attention from your words.",
                "Aim for presence, not a performance of confidence.",
              ],
            },
            expertInsight: {
              text: "Voice and acting coach Patsy Rodenburg describes three 'circles' of energy: withdrawn and inward (first circle), pushing out at people without connecting (third circle), and present, two-way connection (second circle). She argues that presence in the second circle is what audiences experience as genuine confidence.",
              source: "Patsy Rodenburg",
              sourceDetail: "The Second Circle (2007)",
            },
            example: {
              situation: "Victor, a finance lead, presents a forecast to the leadership team.",
              before:
                "He rocks slightly, clicks his pen, scans the slides more than the room and rushes the final number while looking at his notes.",
              after:
                "He plants his feet, sets the pen down, looks at the CEO while stating the forecast, pauses, then turns to the COO for the risks.",
              whyItWorks:
                "Nothing about his content changed. Removing the fidgets and holding eye contact on the key number makes the forecast sound like something he stands behind.",
            },
            reflectionPrompt:
              "Under pressure, do you tend to pull inward or push outward? What physical habit shows it?",
          },
          exercise: {
            title: "Design your presence check",
            description: "Build a personal checklist to run just before you speak.",
            config: {
              type: "structure",
              framework: "Ground – Release – Connect",
              instruction:
                "Create a short, personal presence check you can run in the 10 seconds before you speak in a meeting or on a call.",
              context:
                "Think about your own habits under pressure: fidgets, posture, where your eyes go. Make each cue specific to you.",
              slots: [
                {
                  key: "ground",
                  label: "Ground",
                  hint: "How will you settle your stance or seat? (e.g. both feet flat, back against chair)",
                  maxWords: 15,
                },
                {
                  key: "release",
                  label: "Release",
                  hint: "Which fidget or tension will you let go of? (e.g. put the pen down, drop shoulders)",
                  maxWords: 15,
                },
                {
                  key: "connect",
                  label: "Connect",
                  hint: "Where will your eyes go for your key point? (e.g. one person, or the camera)",
                  maxWords: 15,
                },
              ],
            },
          },
          quiz: [
            {
              prompt: "On a video call, when is looking directly at the camera most valuable?",
              options: [
                "Throughout the entire call, without exception",
                "When delivering your key point or recommendation",
                "Only when others are speaking",
                "Never; looking at faces is always better",
              ],
              correctIndex: 1,
              explanation:
                "Looking at the camera on your key line creates the feel of eye contact when it matters most. Looking at faces the rest of the time keeps you responsive.",
              conceptKey: "conf-camera-eye-contact",
            },
            {
              prompt: "Which change most improves presence during a presentation?",
              options: [
                "Holding a wide stance for two minutes beforehand",
                "Removing habitual fidgets and finishing thoughts while looking at one person",
                "Moving constantly to show energy",
                "Keeping your eyes on the slides to avoid mistakes",
              ],
              correctIndex: 1,
              explanation:
                "Stillness and direct attention keep the focus on your message. Constant movement or slide-staring pulls it away.",
              conceptKey: "conf-presence-stillness",
            },
            {
              prompt: "In Rodenburg's model, what characterises 'third circle' energy?",
              options: [
                "Withdrawing and avoiding attention",
                "Pushing energy out at people without real connection",
                "Present, two-way engagement",
                "Complete physical stillness",
              ],
              correctIndex: 1,
              explanation:
                "Third circle is broadcasting at people. It can look confident but feels disconnected; second circle is the present, two-way state.",
              conceptKey: "conf-three-circles",
            },
          ],
          action: {
            title: "Run your presence check",
            description:
              "Before you speak in one meeting or call today, run your Ground – Release – Connect check, then deliver your main point while looking at one person or the camera.",
            successCriteria:
              "You ran the three cues before speaking at least once and held eye contact through your key point.",
            difficulty: "intermediate",
            estimatedMinutes: 5,
          },
        },
      ],
    },

    /* ───────────────────────── Module 3 ───────────────────────── */
    {
      title: "Holding Your Ground",
      description:
        "Confidence is tested in specific moments. Learn to speak up early, respond to pushback without folding or fighting, and recover cleanly when you get something wrong.",
      lessons: [
        {
          slug: "conf-speak-up-early",
          title: "Speak up in the first ten minutes",
          description: "Make your first contribution early so silence does not harden into a habit.",
          category: "confidence",
          difficulty: "beginner",
          estimatedMinutes: 9,
          content: {
            hook: "The longer you stay silent in a meeting, the higher the bar feels for your first comment. By minute 40, it has to be brilliant.",
            whyItMatters:
              "Ideas that stay in your head do not count. Many capable professionals are overlooked simply because they speak rarely or late. Contributing early makes it easier to keep contributing, and it shows you are engaged.",
            coreConcept: {
              title: "Lower the bar for your first contribution",
              body: [
                "Your first comment does not need to be a big insight. Building on someone's point, asking a clarifying question or summarising the discussion all count, and they break the silence.",
                "Waiting for the perfect moment usually means waiting forever. Decide before the meeting that you will speak within the first ten minutes.",
                "Prepare one contribution in advance: a question, a data point or a view on one agenda item. Having it ready removes most of the hesitation.",
              ],
              keyPoints: [
                "Silence gets harder to break the longer it lasts.",
                "A question or a build counts as a first contribution.",
                "Commit to speaking within ten minutes.",
                "Prepare one point before you walk in.",
              ],
            },
            expertInsight: {
              text: "Amy Edmondson's work on psychological safety shows that people constantly weigh the personal risk of speaking up against its benefits, and often choose silence. The costs of staying quiet are usually invisible: the idea that was never heard simply disappears.",
              source: "Amy Edmondson",
              sourceDetail: "The Fearless Organization (2018)",
            },
            example: {
              situation: "Aisha, a new analyst, attends a weekly planning meeting with senior managers.",
              before:
                "She waits for a moment when her idea will sound smart enough. The meeting ends. Someone raises a similar idea the following week.",
              after:
                "Five minutes in, she says: \"Building on Mark's point, the churn data shows most cancellations happen in month two. Should we look at onboarding first?\"",
              whyItWorks:
                "Aisha builds on an existing point, adds one fact and asks a clear question. It is low risk, genuinely useful and gets her voice into the room early.",
            },
            reflectionPrompt:
              "In which recurring meeting do you speak least? What story do you tell yourself about why?",
          },
          exercise: {
            title: "Turn a timid interjection into a contribution",
            description: "Rewrite a hesitant comment into a clear, early contribution.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this comment so it builds on the discussion, adds one point and ends with a clear question.",
              original:
                "Sorry, this is probably a dumb question and maybe someone already said it, but I was just wondering if, um, maybe we could possibly think about the customer side of this at some point?",
              tips: [
                "Drop the apology and self-criticism.",
                "Connect to what was just said ('Building on…').",
                "End with one specific question.",
              ],
              maxWords: 35,
              requireQuestion: true,
              keywords: ["building on", "customer", "should we", "how"],
              modelAnswer:
                "Building on that, how will this change affect customers in their first week? Should we test it with a small group before rolling it out?",
            },
          },
          quiz: [
            {
              prompt: "Which is a low-risk but valuable first contribution in a meeting?",
              options: [
                "Waiting until you have a fully developed proposal",
                "A clarifying question that builds on someone's point",
                "Staying quiet to observe the dynamics",
                "Disagreeing strongly with the most senior person",
              ],
              correctIndex: 1,
              explanation:
                "A clarifying question adds value, shows engagement and breaks your silence without requiring a perfect insight.",
              conceptKey: "conf-first-contribution",
            },
            {
              prompt: "Why does it get harder to speak up the longer you stay silent?",
              options: [
                "Because meetings get more technical over time",
                "Because the perceived bar for your first comment keeps rising",
                "Because others stop listening after ten minutes",
                "Because senior people speak last",
              ],
              correctIndex: 1,
              explanation:
                "Long silence makes your first comment feel like it must justify the wait. Speaking early keeps the bar realistic.",
              conceptKey: "conf-silence-bar",
            },
            {
              prompt: "According to Edmondson's work, why do people often stay silent at work?",
              options: [
                "They have no ideas",
                "They weigh the personal risk of speaking against the benefit and choose safety",
                "They are naturally introverted",
                "They prefer written communication",
              ],
              correctIndex: 1,
              explanation:
                "Silence is often a rational response to perceived interpersonal risk. Recognising that calculus helps you choose differently.",
              conceptKey: "conf-voice-risk-calculus",
            },
          ],
          action: {
            title: "Speak within ten minutes",
            description:
              "Before your next meeting today, write down one question or point. Then say something, even a short build or question, within the first ten minutes.",
            successCriteria:
              "You made a contribution in the first ten minutes of a real meeting.",
            difficulty: "beginner",
            estimatedMinutes: 5,
          },
        },
        {
          slug: "conf-handle-pushback",
          title: "Handle pushback without folding or fighting",
          description: "Respond to challenges by acknowledging, holding your position and inviting the next step.",
          category: "executive_presence",
          difficulty: "intermediate",
          estimatedMinutes: 12,
          content: {
            hook: "When someone pushes back, two reflexes kick in: give in to end the discomfort, or dig in to win. Neither is confidence.",
            whyItMatters:
              "Pushback is a normal part of making decisions. How you respond shows whether your view can hold up under pressure. Folding teaches people your positions are negotiable; fighting teaches them you cannot be challenged.",
            coreConcept: {
              title: "Acknowledge, hold, invite",
              body: [
                "First, acknowledge the concern behind the pushback. 'That's a fair concern about cost' shows you heard it and lowers the temperature without conceding anything.",
                "Then hold your position, or adjust it only if they have given you a real reason to. Restate your view and the key reason calmly, without repeating everything.",
                "Finally, invite a next step: a question, a test or a criterion. 'What would you need to see to be comfortable?' moves the conversation from opposing positions to shared problem-solving.",
              ],
              keyPoints: [
                "Acknowledge the concern before responding.",
                "Change your view for new information, not for discomfort.",
                "Restate your position briefly and calmly.",
                "Invite a criterion, test or next step.",
              ],
            },
            expertInsight: {
              text: "Roger Fisher and William Ury argue for separating the people from the problem and focusing on underlying interests rather than fixed positions. Under pushback, that means treating the other person as a partner in solving their concern, not as an opponent to defeat.",
              source: "Roger Fisher & William Ury",
              sourceDetail: "Getting to Yes (1981)",
            },
            example: {
              situation: "Mei, a project manager, proposes a two-week delay. A senior stakeholder says: \"That's unacceptable. We promised the client.\"",
              before:
                "Folding: \"You're right, sorry, we'll find a way.\" Or fighting: \"Well, if you'd given us the specs on time, we wouldn't be here.\"",
              after:
                "\"The client commitment matters, and I take it seriously. I still recommend the delay: shipping now risks a failure in their live environment. What would help us manage it with them: a partial release, or a call from you?\"",
              whyItWorks:
                "Mei acknowledges the stakeholder's real concern, holds her position with one clear reason and offers two concrete next steps. The conversation shifts to how, not whether.",
            },
            reflectionPrompt:
              "Under pushback, is your reflex to fold or to fight? Recall a specific moment and what you said.",
          },
          exercise: {
            title: "Structure your response to pushback",
            description: "Build a calm, three-part response to a real challenge.",
            config: {
              type: "structure",
              framework: "Acknowledge – Hold – Invite",
              instruction:
                "You proposed hiring a contractor for a three-month project. Your manager responds: \"We don't have the budget for that.\" Build your response.",
              context:
                "You believe the contractor costs less than the delay the team will face without extra capacity.",
              slots: [
                {
                  key: "acknowledge",
                  label: "Acknowledge",
                  hint: "Name their concern without conceding the point.",
                  maxWords: 15,
                },
                {
                  key: "hold",
                  label: "Hold",
                  hint: "Restate your position and the single strongest reason.",
                  maxWords: 25,
                },
                {
                  key: "invite",
                  label: "Invite",
                  hint: "Offer a next step, test or question.",
                  maxWords: 20,
                },
              ],
            },
          },
          quiz: [
            {
              prompt: "A peer says your plan is \"too risky.\" What is the best first sentence?",
              options: [
                "\"It's not risky at all.\"",
                "\"You're right, let's drop it.\"",
                "\"Risk is a fair concern. Which part worries you most?\"",
                "\"You said the same thing last time and were wrong.\"",
              ],
              correctIndex: 2,
              explanation:
                "It acknowledges the concern and gets specific information, without folding or attacking.",
              conceptKey: "conf-pushback-acknowledge",
            },
            {
              prompt: "When should you change your position during pushback?",
              options: [
                "When the other person is more senior",
                "When the conversation feels uncomfortable",
                "When they give you new information or a better reason",
                "Never; changing looks weak",
              ],
              correctIndex: 2,
              explanation:
                "Confident people update on evidence, not on pressure. Changing for a good reason shows judgment.",
              conceptKey: "conf-pushback-update-evidence",
            },
            {
              prompt: "Why end a pushback response with an invitation such as 'What would you need to see?'",
              options: [
                "To end the conversation quickly",
                "To shift from opposing positions to solving the concern together",
                "To put the other person on the spot",
                "To avoid stating your view",
              ],
              correctIndex: 1,
              explanation:
                "Asking for criteria focuses both of you on interests and next steps, which is where agreement becomes possible.",
              conceptKey: "conf-pushback-invite",
            },
          ],
          action: {
            title: "Acknowledge before you answer",
            description:
              "The next time someone challenges an idea of yours today, start your reply by acknowledging their concern in one sentence, then restate your view with one reason and ask one question.",
            successCriteria:
              "You responded to a real challenge using all three steps, without conceding just to end the tension.",
            difficulty: "intermediate",
            estimatedMinutes: 5,
          },
        },
        {
          slug: "conf-recover-from-mistakes",
          title: "Recover from a mistake in public",
          description: "Own a mistake briefly, fix it and move on, without over-apologising or hiding.",
          category: "confidence",
          difficulty: "intermediate",
          estimatedMinutes: 10,
          content: {
            hook: "The mistake is rarely what people remember. What they remember is how you handled it.",
            whyItMatters:
              "Everyone gets numbers wrong, misses deadlines or says the wrong thing in a meeting. Over-apologising makes a small error feel big; hiding it destroys trust. A clean recovery often increases how much people rely on you.",
            coreConcept: {
              title: "Own it, fix it, move on",
              body: [
                "Own it in one sentence, with no excuses: 'I gave you the wrong figure earlier.' Not a paragraph of context, and not five apologies.",
                "Fix it: give the correct information or state what you are doing to repair the impact. If you cannot fix it now, say when you will.",
                "Move on: return to the agenda or the task. Lingering on the error keeps everyone's attention on it. Afterwards, privately note what you will do differently, then let it go.",
              ],
              keyPoints: [
                "One sentence of ownership, no excuses.",
                "Correct it or commit to when you will.",
                "Return to the task; do not linger.",
                "Learn privately; treat yourself as you would a colleague.",
              ],
            },
            expertInsight: {
              text: "Kristin Neff's research on self-compassion suggests that treating your own mistakes with the understanding you would offer a friend, rather than harsh self-criticism, is associated with a greater willingness to acknowledge errors and to work at improving.",
              source: "Kristin Neff",
              sourceDetail: "Research on self-compassion",
            },
            example: {
              situation: "Luca, a sales analyst, realises mid-meeting that a forecast he presented used last year's prices.",
              before:
                "\"Oh no, I'm so sorry, I'm such an idiot, I can't believe I did that, I was rushing because of three other things, sorry, really sorry everyone…\"",
              after:
                "\"Correction: the forecast I showed used last year's prices. The right figure is about 6% higher. I'll send the corrected deck within the hour. Back to the regional split.\"",
              whyItWorks:
                "Luca owns the error, gives the correct information and moves the meeting on in four short sentences. People leave remembering his reliability, not the mistake.",
            },
            reflectionPrompt:
              "Think of a recent mistake. How long did you dwell on it, and what would 'own it, fix it, move on' have looked like?",
          },
          exercise: {
            title: "Rewrite the over-apology",
            description: "Turn a panicked apology into a clean recovery.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this message to a client. Own the error in one sentence, state the fix and move on. One apology at most.",
              original:
                "I'm so, so sorry, I really can't believe this happened, I feel terrible. I think I may have accidentally sent you the wrong version of the contract yesterday, which is completely my fault, I've been swamped this week, but that's no excuse. Again, I'm really sorry for any confusion this may have caused.",
              tips: [
                "One sentence of ownership; drop the excuses.",
                "Say exactly what you are doing to fix it.",
                "Close by moving forward, not apologising again.",
              ],
              maxWords: 40,
              keywords: ["correct", "attached", "wrong version", "apologies"],
              modelAnswer:
                "Apologies: I sent you the wrong contract version yesterday. The correct version is attached, with the changed clauses highlighted. Please disregard the earlier file. Happy to walk through it tomorrow.",
            },
          },
          quiz: [
            {
              prompt: "You realise mid-presentation that a chart has a wrong figure. What is the best move?",
              options: [
                "Ignore it and hope nobody notices",
                "Stop and apologise several times so people know you care",
                "State the correction in one sentence, give the right figure and continue",
                "Explain in detail why the mistake happened",
              ],
              correctIndex: 2,
              explanation:
                "A short, factual correction protects trust and keeps attention on the content, not on the error.",
              conceptKey: "conf-mistake-correct-continue",
            },
            {
              prompt: "Why does over-apologising often backfire?",
              options: [
                "It makes a small error seem larger and keeps attention on it",
                "It is legally risky",
                "It shows you are too confident",
                "People prefer no apology at all",
              ],
              correctIndex: 0,
              explanation:
                "Repeated apologies amplify the mistake and can shift the conversation to managing your feelings instead of solving the problem.",
              conceptKey: "conf-over-apology",
            },
            {
              prompt: "After a public mistake, which inner response best supports learning?",
              options: [
                "\"I'm useless; this always happens.\"",
                "\"It wasn't really my fault.\"",
                "\"That was a real error. What will I check next time?\"",
                "\"Nobody will remember anyway.\"",
              ],
              correctIndex: 2,
              explanation:
                "Self-compassionate, honest reflection acknowledges the error and focuses on improvement, without harsh self-criticism or denial.",
              conceptKey: "conf-mistake-self-compassion",
            },
          ],
          action: {
            title: "Practise a clean correction",
            description:
              "Today, correct one thing, however small (a typo in a sent message, a wrong time, an imprecise figure), using one sentence of ownership, the fix and no extra apologies.",
            successCriteria:
              "You made one real correction with a single ownership sentence and a clear fix, then moved on.",
            difficulty: "intermediate",
            estimatedMinutes: 5,
          },
        },
      ],
    },
  ],
};
