import type { JourneySeed } from "../types";

export const connectWithAnyone: JourneySeed = {
  slug: "connect-with-anyone",
  title: "Connect with Anyone",
  subtitle: "Start conversations, be remembered, build real relationships",
  description:
    "A practical journey through the moments that build a network: walking up to someone new, keeping a conversation alive, being remembered for the right reasons and turning a single meeting into a lasting connection.",
  category: "social_intelligence",
  difficulty: "beginner",
  order: 5,
  modules: [
    /* ───────────────────────── Module 1 ───────────────────────── */
    {
      title: "Open the door",
      description: "Make the first move and keep the conversation about the other person.",
      lessons: [
        {
          slug: "connect-enter-a-conversation",
          title: "How to enter a conversation",
          description: "Use the 3-second rule to approach people before overthinking talks you out of it.",
          category: "social_intelligence",
          difficulty: "beginner",
          estimatedMinutes: 8,
          content: {
            hook: "The longer you stand at the edge of a room deciding whether to approach someone, the more reasons you find not to.",
            whyItMatters:
              "Most career opportunities arrive through people, and people are met one conversation at a time. If starting a conversation feels costly, you start fewer of them, and your network ends up shaped by whoever happens to approach you. Making the first move is a learnable, repeatable skill.",
            coreConcept: {
              title: "The 3-second rule",
              body: [
                "The 3-second rule is simple: when you notice someone you'd like to talk to, move toward them within a few seconds, before your mind has time to build a case against it. Hesitation is not neutral. Every second spent deliberating gives self-doubt more material.",
                "You don't need a clever opener. Shared context does the work: the event, the venue, the talk you both just heard, the coffee queue. A short observation plus an easy question is enough to begin.",
                "Choose open doors. Two people facing each other closely are mid-conversation. Someone standing alone, or a group with a visible gap in its circle, is open to company. Join with eye contact and a brief line, then listen before you add.",
              ],
              keyPoints: [
                "Move within a few seconds, before overthinking talks you out of it.",
                "Use the shared context as your opener; no clever line required.",
                "Approach people standing alone or open groups.",
                "Lead with an easy question, then listen.",
              ],
            },
            expertInsight: {
              text: "Research on the 'spotlight effect' found that people consistently overestimate how much others notice and judge their actions. The awkwardness you fear when approaching someone is far more visible to you than to them.",
              source: "Thomas Gilovich, Victoria Medvec and Kenneth Savitsky",
              sourceDetail: "Research on the spotlight effect, Journal of Personality and Social Psychology (2000)",
            },
            example: {
              situation: "At an industry breakfast, Priya notices someone standing alone by the window, checking their phone.",
              before:
                "She tells herself she'll go over after one more coffee. By then the person has joined a group, and Priya spends the event talking to colleagues she already knows.",
              after:
                "She walks over straight away: \"Mind if I join you? I'm Priya, first time at this one. What brought you here?\" Ten minutes later they've swapped contact details.",
              whyItWorks:
                "She acted before doubt could build, used the shared setting as her opener and handed the other person an easy question to answer.",
            },
            reflectionPrompt:
              "Think of the last time you held back from approaching someone. What story did you tell yourself in those few seconds?",
          },
          exercise: {
            title: "Seize the moment",
            description: "Choose the move that applies the 3-second rule well.",
            config: {
              type: "choice",
              scenario:
                "You're at a conference coffee break. A speaker whose session you enjoyed is standing alone by the coffee station. You've been hovering nearby for a moment.",
              question: "What do you do?",
              options: [
                {
                  text: "Wait until they look less busy, then decide whether to go over.",
                  quality: "weak",
                  feedback: "'Waiting until they look less busy' is how the window closes. Delay feeds doubt.",
                },
                {
                  text: "Spend a few minutes drafting a sharp question about their research, then approach.",
                  quality: "ok",
                  feedback: "Preparation isn't wrong, but long prep invites delay. Someone else will likely get there first.",
                },
                {
                  text: "Walk over now: \"I enjoyed your session. The point about onboarding stuck with me. How has the reaction been?\"",
                  quality: "best",
                  feedback: "You moved within seconds, used shared context and gave them an easy, open question.",
                },
                {
                  text: "Skip it and send them a connection request online later.",
                  quality: "weak",
                  feedback: "A request without a conversation is easy to ignore. The live moment is worth far more.",
                },
              ],
            },
          },
          quiz: [
            {
              prompt: "What is the core idea of the 3-second rule?",
              options: [
                "Keep your opening line under three seconds long",
                "Approach within a few seconds, before overthinking talks you out of it",
                "Hold eye contact for three seconds before speaking",
                "Leave any conversation that stalls for three seconds",
              ],
              correctIndex: 1,
              explanation:
                "The rule is about acting quickly on the impulse to approach, so hesitation doesn't have time to grow into avoidance.",
              conceptKey: "connect-three-second-rule",
            },
            {
              prompt: "At an event, which of these is easiest to join?",
              options: [
                "Two people standing close and facing each other",
                "A pair deep in a serious-looking discussion",
                "A group of three with a visible gap in their circle",
                "People halfway through a seated meal",
              ],
              correctIndex: 2,
              explanation: "An open circle signals the group is receptive to someone new joining.",
              conceptKey: "connect-open-groups",
            },
            {
              prompt: "What makes the most reliable opener with a stranger at an event?",
              options: [
                "An observation about your shared context, followed by a question",
                "A prepared joke to break the ice",
                "Your job title and company name",
                "A detailed summary of what you're working on",
              ],
              correctIndex: 0,
              explanation: "Shared context gives you both something easy to talk about, and a question hands them the floor.",
              conceptKey: "connect-shared-context-opener",
            },
          ],
          action: {
            title: "Start one new conversation",
            description:
              "Start one conversation with someone you don't normally talk to. When you notice the moment, move within a few seconds and open with something about your shared context.",
            successCriteria:
              "You started the conversation yourself, within a few seconds of noticing the chance, and asked at least one question.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "connect-be-interested",
          title: "Be interested, not interesting",
          description: "Keep the spotlight on the other person and they'll remember you warmly.",
          category: "social_intelligence",
          difficulty: "beginner",
          estimatedMinutes: 7,
          content: {
            hook: "The people we find most engaging are rarely the ones with the best stories. They're the ones who made us feel worth listening to.",
            whyItMatters:
              "In networking, client meetings and team life, people judge you largely by how the conversation felt to them. If you spend it trying to impress, you learn little and leave a thin impression. If you make them the subject, you learn what matters to them and become someone they want to talk to again.",
            coreConcept: {
              title: "Support responses over shift responses",
              body: [
                "When someone shares something, you have two options. A shift response turns the topic toward you: \"Oh, I went there too.\" A support response keeps it on them: \"What was the highlight?\"",
                "Shift responses feel natural because we're looking for common ground. But a string of them quietly turns a conversation into a competition for airtime. The other person stops sharing and starts waiting.",
                "Being interested doesn't mean hiding yourself. Share when asked, and share briefly. Your default move, especially early, is to stay with their topic for one or two more turns before bringing in your own.",
              ],
              keyPoints: [
                "Shift responses take the topic; support responses keep it with them.",
                "Stay with their topic for a couple of turns before sharing your own.",
                "Curiosity makes you memorable more reliably than cleverness.",
              ],
            },
            expertInsight: {
              text: "Sociologist Charles Derber described 'conversational narcissism': the habit of steering conversations back to ourselves through shift responses. He contrasted it with support responses, which keep attention on the speaker.",
              source: "Charles Derber",
              sourceDetail: "The Pursuit of Attention (1979)",
            },
            example: {
              situation: "A new colleague mentions over lunch that they've just taken up rowing.",
              before:
                "\"Nice! I did rowing at university. We trained at six every morning, it was brutal...\" Five minutes later, the conversation is entirely about you.",
              after:
                "\"Rowing, great. What got you into it?\" They explain it's helping them cope with a stressful move, and you learn something real about them.",
              whyItWorks:
                "One support question opened a door that a shift response would have closed. You now know what matters to them right now.",
            },
            reflectionPrompt:
              "In your last few conversations, were you mostly shifting or supporting? What did that cost or gain you?",
          },
          exercise: {
            title: "Turn the spotlight around",
            description: "Rewrite a shift response into a support response.",
            config: {
              type: "rewrite",
              instruction:
                "A colleague says they've just come back from a week in Lisbon. Rewrite the reply below so it keeps the focus on them and ends with a question.",
              original:
                "Oh, I went to Lisbon last year too. We did the whole coast, it was amazing. You have to see Sintra next time.",
              tips: [
                "Remove the part about your own trip.",
                "Ask about their experience, not the city in general.",
                "One warm phrase plus one open question is enough.",
              ],
              maxWords: 25,
              requireQuestion: true,
              keywords: ["you", "your"],
              modelAnswer: "Welcome back! What was the highlight for you, and what made you choose Lisbon?",
            },
          },
          quiz: [
            {
              prompt: "Which reply is a support response to \"I've just started learning Italian\"?",
              options: [
                "\"I studied Italian for years, it's tricky.\"",
                "\"I prefer Spanish, honestly.\"",
                "\"My partner is Italian, actually.\"",
                "\"What made you pick Italian?\"",
              ],
              correctIndex: 3,
              explanation: "A support response keeps the focus on the speaker's experience instead of yours.",
              conceptKey: "connect-support-response",
            },
            {
              prompt: "What is the main risk of a string of shift responses?",
              options: [
                "The conversation becomes a competition for airtime and the other person stops sharing",
                "You come across as too curious",
                "You run out of things to say",
              ],
              correctIndex: 0,
              explanation: "Each shift takes the topic away. Repeated, it tells the other person their story isn't the point.",
              conceptKey: "connect-shift-response",
            },
            {
              prompt: "Being interested rather than interesting means...",
              options: [
                "Never sharing anything about yourself",
                "Defaulting to their topic for a few turns and sharing briefly when it fits",
                "Asking as many questions as possible, as fast as possible",
                "Agreeing with everything they say",
              ],
              correctIndex: 1,
              explanation: "It's about where your default attention goes, not about hiding yourself or interrogating them.",
              conceptKey: "connect-interested-over-interesting",
            },
          ],
          action: {
            title: "No shifts for five minutes",
            description:
              "In your next three conversations today, make no shift responses for the first five minutes. Ask, follow their thread and listen.",
            successCriteria:
              "In at least two of the three conversations you kept the focus on the other person for the first five minutes and learned one new thing about them.",
            difficulty: "beginner",
            estimatedMinutes: 15,
          },
        },
        {
          slug: "connect-follow-up-questions",
          title: "Ask the second question",
          description: "Follow-up questions prove you listened and turn small talk into real conversation.",
          category: "social_intelligence",
          difficulty: "beginner",
          estimatedMinutes: 8,
          content: {
            hook: "Anyone can ask the first question. The second one is where people decide whether you were actually listening.",
            whyItMatters:
              "Most conversations stay shallow because each question jumps to a new topic. Follow-up questions build depth, help you understand what someone actually cares about, and leave them feeling heard. In meetings they also surface the real issue behind a vague statement.",
            coreConcept: {
              title: "Build on what they just said",
              body: [
                "A follow-up question uses material the other person has just given you. It might pick up a word they stressed, ask what's behind a decision, or invite them to expand: \"How did that go?\"",
                "A simple technique is the mirror: repeat the last few meaningful words as a question. \"It's been a hectic quarter.\" \"Hectic?\" It feels light, but it reliably prompts people to say more.",
                "Avoid the topic switch: \"Nice. So, any holidays planned?\" It signals you were waiting for your turn, not listening. Stay with the thread at least once before changing direction.",
              ],
              keyPoints: [
                "Use something they just said as the raw material for your next question.",
                "Mirror a key word or two to invite them to continue.",
                "Ask 'what' and 'how' rather than yes/no questions.",
                "Stay on the thread at least once before switching topic.",
              ],
            },
            expertInsight: {
              text: "Research led by Karen Huang at Harvard found that people who asked more questions, particularly follow-up questions, were liked more by their conversation partners. Follow-ups signal that you are listening and care about the answer.",
              source: "Karen Huang and colleagues, Harvard Business School",
              sourceDetail: "\"It Doesn't Hurt to Ask: Question-Asking Increases Liking\" (2017)",
            },
            example: {
              situation: "At a client meeting, the client says, \"We've been rethinking how we handle onboarding.\"",
              before: "\"Great. Shall we go through the proposal?\" The comment is lost, along with what might have been the real priority.",
              after:
                "\"Rethinking it how? What's not working today?\" The client explains that new hires take months to become productive, which reshapes the whole proposal.",
              whyItWorks: "One follow-up uncovered the actual problem behind a passing remark.",
            },
            reflectionPrompt:
              "When did a follow-up question someone asked you make you feel genuinely heard? What made it work?",
          },
          exercise: {
            title: "Stay on the thread",
            description: "Replace a topic switch with a real follow-up question.",
            config: {
              type: "rewrite",
              instruction:
                "Someone says: \"We just finished migrating our whole warehouse system, so it's been a hectic quarter.\" Rewrite the reply so it builds on what they said and ends with a question.",
              original: "Nice. So, do you have any holidays planned?",
              tips: [
                "Pick up a specific word they used: migration, warehouse, hectic.",
                "Ask an open 'what' or 'how' question.",
                "Keep it short so they do the talking.",
              ],
              maxWords: 25,
              requireQuestion: true,
              keywords: ["migration", "migrating", "warehouse", "hectic", "quarter"],
              modelAnswer: "A whole warehouse migration in one quarter. What was the hardest part to get right?",
            },
          },
          quiz: [
            {
              prompt: "According to research by Karen Huang and colleagues, which kind of question was most linked to being liked?",
              options: ["Opening questions", "Follow-up questions", "Questions about the weather", "Yes/no questions"],
              correctIndex: 1,
              explanation: "Follow-up questions showed that people were listening, which their partners appreciated.",
              conceptKey: "connect-follow-up-liking",
            },
            {
              prompt: "Someone says, \"It's been a tough month.\" Which reply is a mirror?",
              options: ["\"Same here.\"", "\"Have you tried taking time off?\"", "\"A tough month?\""],
              correctIndex: 2,
              explanation: "A mirror repeats a few key words as a question, inviting the person to expand.",
              conceptKey: "connect-mirroring",
            },
            {
              prompt: "Why does switching topic straight after someone's answer weaken a conversation?",
              options: [
                "It signals you were waiting for your turn rather than listening",
                "It makes the conversation too long",
                "It forces the other person to ask questions",
                "It is considered impolite in most cultures",
              ],
              correctIndex: 0,
              explanation: "Jumping topics tells the other person their answer didn't register.",
              conceptKey: "connect-topic-switch",
            },
          ],
          action: {
            title: "Two follow-ups in a row",
            description:
              "In one conversation today, ask at least two follow-up questions in a row, each building on their previous answer, before sharing anything about yourself.",
            successCriteria: "You asked two consecutive follow-ups and learned something you wouldn't have heard otherwise.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
      ],
    },

    /* ───────────────────────── Module 2 ───────────────────────── */
    {
      title: "Be remembered for the right reasons",
      description: "Names, signals and a one-line introduction that people repeat.",
      lessons: [
        {
          slug: "connect-remember-names",
          title: "Remember names",
          description: "Most names are never forgotten; they were never stored. Here's how to store them.",
          category: "social_intelligence",
          difficulty: "beginner",
          estimatedMinutes: 9,
          content: {
            hook: "You didn't forget their name. You never heard it, because you were busy planning what to say next.",
            whyItMatters:
              "Using someone's name signals that they registered with you. Forgetting it, especially after a second meeting, signals the opposite. In a room of new contacts, being the person who remembers names is a quiet but real advantage.",
            coreConcept: {
              title: "Hear it, repeat it, link it, use it",
              body: [
                "Names slip away at the moment of introduction because attention is elsewhere. The fix starts there: when someone says their name, treat it as the most important word in the conversation.",
                "Repeat it immediately (\"Nice to meet you, Daniel\"). Link it to something vivid: what they do, where they're from, a detail they mention. Use it once more during the conversation and again when you say goodbye.",
                "Afterwards, write it down with one detail. And if you missed it, ask again early: \"Tell me your name once more?\" That costs nothing in the first minute and much more later.",
              ],
              keyPoints: [
                "Give the name your full attention at the moment you hear it.",
                "Repeat it straight away and link it to one vivid detail.",
                "Use it again at the end and write it down afterwards.",
                "If you miss it, ask again in the first minute.",
              ],
            },
            expertInsight: {
              text: "Carnegie argued that a person's own name is, to them, one of the most important words there is, and that remembering and using it is one of the simplest ways to make someone feel respected.",
              source: "Dale Carnegie",
              sourceDetail: "How to Win Friends and Influence People (1936)",
            },
            example: {
              situation: "You're introduced to four people at the start of a cross-team workshop.",
              before:
                "You nod at each name while thinking about your own introduction. By lunch you're avoiding addressing anyone directly.",
              after:
                "\"Hi Ana, you're in pricing, right?\" You repeat each name with one detail, use them during the session and jot them down at the break.",
              whyItWorks: "Repetition and a linked detail moved each name from passing noise into memory.",
            },
            reflectionPrompt: "Whose name have you been avoiding using because you've forgotten it? How could you recover it?",
          },
          exercise: {
            title: "Names and details",
            description: "Study five people you just met, then recall their names and one detail each.",
            config: {
              type: "recall",
              instruction:
                "You've just met these five people at an industry event. Study the list, then recall each name with its detail.",
              items: [
                "Daniel: logistics manager, cycles to work",
                "Ana: pricing analyst, just moved from Porto",
                "Kwame: start-up founder, building a scheduling app",
                "Sofia: HR director, training for a marathon",
                "Lukas: sales lead, has twin daughters",
              ],
              studySeconds: 45,
              technique:
                "Say each name in your head, then picture it attached to its detail: Daniel on a bike loaded with boxes, Ana carrying a price tag through Porto.",
            },
          },
          quiz: [
            {
              prompt: "Why do we usually 'forget' a name seconds after hearing it?",
              options: [
                "Names are harder to remember than other words",
                "Our attention was elsewhere, so it was never properly stored",
                "We meet too many people to remember them all",
              ],
              correctIndex: 1,
              explanation: "Most names are lost at encoding: we're thinking about our own reply when they're said.",
              conceptKey: "connect-name-encoding",
            },
            {
              prompt: "What is the best move if you missed someone's name thirty seconds ago?",
              options: [
                "Avoid using their name for the rest of the conversation",
                "Wait and hope someone else says it",
                "Look it up on social media later",
                "Ask again now: \"Tell me your name once more?\"",
              ],
              correctIndex: 3,
              explanation: "Asking early is easy and normal. Asking after an hour is awkward, so the cost only rises.",
              conceptKey: "connect-name-ask-again",
            },
            {
              prompt: "Which habit most helps a new name stick?",
              options: [
                "Repeating it straight away and linking it to a vivid detail",
                "Hearing it several times from other people",
                "Shaking hands firmly",
                "Writing it down a week later",
              ],
              correctIndex: 0,
              explanation: "Immediate repetition plus association gives the name a hook in memory.",
              conceptKey: "connect-name-repetition",
            },
          ],
          action: {
            title: "Three names this week",
            description:
              "Learn and use the names of three people you meet or barely know this week. Write each one down with a single detail.",
            successCriteria: "You used each name in conversation at least once and can recall all three with a detail a day later.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "connect-read-the-room",
          title: "Read the room",
          description: "Notice the signals people send and adjust before the conversation turns against you.",
          category: "social_intelligence",
          difficulty: "beginner",
          estimatedMinutes: 9,
          content: {
            hook: "Every conversation is sending you data. Most people are too busy talking to read it.",
            whyItMatters:
              "The same words can land well or badly depending on someone's mood, energy and attention. Reading the room lets you adjust: go deeper when someone is engaged, lighten up or wrap up when they're not. It's what makes people describe you as easy to talk to.",
            coreConcept: {
              title: "Observe, then adjust",
              body: [
                "Watch three things. Engagement: are their answers getting longer or shorter? Orientation: are their shoulders and feet turned toward you or toward the exit? Energy: are they relaxed and expansive, or tense and rushed?",
                "Then adjust. If they're engaged, go deeper with a follow-up. If they're fading, match their pace, shorten your turns or offer a graceful exit. If they seem tense, name it gently: \"Sounds like a full day.\"",
                "Signals are clues, not verdicts. A glance at a phone may mean boredom or a sick child. When in doubt, check lightly rather than assume.",
              ],
              keyPoints: [
                "Watch engagement, orientation and energy.",
                "Go deeper when they lean in; lighten up or wrap up when they fade.",
                "Name what you notice gently instead of ignoring it.",
                "Treat signals as clues to check, not conclusions.",
              ],
            },
            expertInsight: {
              text: "Former FBI negotiator Chris Voss describes 'labeling': calmly naming the emotion you observe, for example \"It seems like this is a busy time.\" Doing so helps people feel understood and often lowers tension.",
              source: "Chris Voss",
              sourceDetail: "Never Split the Difference (2016)",
            },
            example: {
              situation: "Mid-way through a project update, you notice your director has stopped taking notes and keeps checking the time.",
              before: "You push on through all twelve slides. She leaves with no decision made.",
              after:
                "\"I can see time is tight. Let me give you the one decision I need today, and the rest can go by email.\" She decides in two minutes.",
              whyItWorks: "You read the signal, named it and adapted the format to fit her actual attention.",
            },
            reflectionPrompt: "Think of a conversation that went wrong recently. What signals were there that you missed at the time?",
          },
          exercise: {
            title: "Spot the signal",
            description: "Choose the response that reads the room best.",
            config: {
              type: "choice",
              scenario:
                "At a client dinner, the person next to you has started giving one-word answers. Their body is angled away from you and they keep glancing at their phone.",
              question: "What's your best move?",
              options: [
                {
                  text: "Ask another detailed question about their work to re-engage them.",
                  quality: "ok",
                  feedback: "It's well-meant, but it asks more of someone who is signalling they have less to give.",
                },
                {
                  text: "Tell a longer, entertaining story to win back their attention.",
                  quality: "weak",
                  feedback: "This ignores the signals and makes the conversation even more about you.",
                },
                {
                  text: "Name it lightly and offer space: \"Sounds like something's going on. Feel free to take that if you need to.\"",
                  quality: "best",
                  feedback: "You noticed, labelled it without judgement and gave them an easy choice. That builds trust.",
                },
                {
                  text: "Keep going as normal; it's polite not to mention it.",
                  quality: "weak",
                  feedback: "Ignoring clear signals usually leaves both of you uncomfortable.",
                },
              ],
            },
          },
          quiz: [
            {
              prompt: "Which set of signals most suggests someone wants to wrap up?",
              options: [
                "Longer answers and leaning in",
                "Asking you questions back",
                "Laughing at your comments",
                "Shorter answers and body turned toward the exit",
              ],
              correctIndex: 3,
              explanation: "Shrinking answers and orientation away from you are common signs of fading engagement.",
              conceptKey: "connect-disengagement-signals",
            },
            {
              prompt: "What is 'labeling', as described by Chris Voss?",
              options: [
                "Calmly naming the emotion you observe in the other person",
                "Categorising people by personality type",
                "Summarising the agenda at the start of a meeting",
              ],
              correctIndex: 0,
              explanation: "Naming an observed emotion (\"It seems like...\") helps people feel understood.",
              conceptKey: "connect-labeling",
            },
            {
              prompt: "How should you treat a single signal, such as someone checking their phone?",
              options: [
                "As proof they're bored",
                "As a clue to check lightly, not a conclusion",
                "As something to ignore completely",
                "As a reason to end the conversation immediately",
              ],
              correctIndex: 1,
              explanation: "One signal has many possible causes. Check gently rather than assume.",
              conceptKey: "connect-signals-are-clues",
            },
          ],
          action: {
            title: "Three signals, one adjustment",
            description:
              "In your next meeting or group conversation, silently note three signals about how people are feeling, then make one deliberate adjustment based on them.",
            successCriteria: "You can name the three signals you noticed and the adjustment you made, and how people responded.",
            difficulty: "beginner",
            estimatedMinutes: 15,
          },
        },
        {
          slug: "connect-one-line-intro",
          title: "Introduce yourself in one line",
          description: "Replace your job title with a single sentence people understand and remember.",
          category: "personal_branding",
          difficulty: "beginner",
          estimatedMinutes: 10,
          content: {
            hook: "\"So, what do you do?\" is the most common question at any event, and most people answer it with a title nobody remembers.",
            whyItMatters:
              "Your introduction is the smallest unit of your personal brand. A job title tells people your rank; a clear one-liner tells them what problem you solve and why they might want to talk to you again. It also makes it easy for others to describe you to someone else.",
            coreConcept: {
              title: "Who you help, with what",
              body: [
                "A strong one-liner follows a simple shape: I help [who] [do what or solve what]. \"I help our sales teams spend less time on admin and more time with customers\" says more than \"Senior Associate, Commercial Excellence\".",
                "Use plain words. Internal jargon feels precise to you and means nothing to a stranger. If a smart person from another industry wouldn't understand it, rewrite it.",
                "Aim for a line that invites a question. \"How do you do that?\" is the best response your introduction can get. Keep two or three versions ready and adapt to who you're talking to.",
              ],
              keyPoints: [
                "Formula: I help [who] [achieve or fix what].",
                "Plain words beat titles and jargon.",
                "A good intro invites a follow-up question.",
                "Adapt the emphasis to your audience.",
              ],
            },
            expertInsight: {
              text: "Chip and Dan Heath describe the 'curse of knowledge': once we know something well, it becomes hard to imagine not knowing it. That's why insiders' descriptions of their own work are often full of terms outsiders can't decode.",
              source: "Chip Heath and Dan Heath",
              sourceDetail: "Made to Stick (2007)",
            },
            example: {
              situation: "At a networking lunch, someone asks Leo what he does.",
              before:
                "\"I'm a Data Governance Lead in the Enterprise Information Office.\" A polite nod, and the conversation moves on.",
              after:
                "\"I make sure that when two departments quote a number, it's the same number.\" The other person laughs: \"How do you manage that?\"",
              whyItWorks: "It names a familiar problem in plain words and naturally invites a question.",
            },
            reflectionPrompt:
              "How do you currently answer \"What do you do?\" What would a stranger remember about you an hour later?",
          },
          exercise: {
            title: "Your one-liner",
            description: "Turn a title-heavy introduction into one clear sentence.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this introduction as one line that says who Marco helps and with what, in plain words a stranger would understand.",
              original:
                "Hi, I'm Marco. I'm a Senior Associate in the Commercial Excellence team, mainly doing cross-functional enablement and process optimisation stuff.",
              tips: [
                "Start with 'I help...' or describe the problem you fix.",
                "Remove job titles and internal team names.",
                "Name a concrete outcome someone would care about.",
              ],
              maxWords: 25,
              keywords: ["help", "so that", "make sure", "spend less", "fix"],
              modelAnswer: "I'm Marco. I help our sales teams spend less time on admin and more time with customers.",
            },
          },
          quiz: [
            {
              prompt: "Which introduction best follows the one-line formula?",
              options: [
                "\"I'm Head of Strategic Initiatives at a consultancy.\"",
                "\"I work in finance, mostly reporting.\"",
                "\"I help small retailers stop running out of their best-selling products.\"",
                "\"I do a bit of everything, really.\"",
              ],
              correctIndex: 2,
              explanation: "It names who you help and the problem you solve, in plain words.",
              conceptKey: "connect-intro-formula",
            },
            {
              prompt: "What does the 'curse of knowledge' explain about introductions?",
              options: [
                "Why experts often describe their work in terms outsiders can't follow",
                "Why people forget introductions quickly",
                "Why longer introductions sound more credible",
              ],
              correctIndex: 0,
              explanation: "Once you know a field well, it's hard to imagine how your words sound to someone who doesn't.",
              conceptKey: "connect-curse-of-knowledge",
            },
            {
              prompt: "What is the best sign that your introduction worked?",
              options: [
                "The other person nods politely",
                "The other person asks, \"How do you do that?\"",
                "The other person immediately introduces themselves",
                "You said it without hesitating",
              ],
              correctIndex: 1,
              explanation: "A follow-up question means your line created curiosity and opened a conversation.",
              conceptKey: "connect-intro-invites-question",
            },
          ],
          action: {
            title: "Test your one-liner",
            description:
              "Write your one-line introduction and use it at least twice this week, whether at an event, a meeting or a call with someone new.",
            successCriteria: "You used it twice and noted whether each person asked a follow-up question. Revise the line if neither did.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
      ],
    },

    /* ───────────────────────── Module 3 ───────────────────────── */
    {
      title: "Turn moments into relationships",
      description: "End well, follow up well and keep your network alive by giving first.",
      lessons: [
        {
          slug: "connect-exit-gracefully",
          title: "Exit a conversation gracefully",
          description: "Leave conversations in a way that makes people glad they had them.",
          category: "networking",
          difficulty: "beginner",
          estimatedMinutes: 7,
          content: {
            hook: "Fear of getting stuck is one of the main reasons people avoid starting conversations. Knowing how to leave makes it easier to begin.",
            whyItMatters:
              "At events, staying with one person all evening limits both of you. In daily work, conversations that drift on drain time and goodwill. A clean, warm exit protects the relationship and frees you to meet others. Done well, it's one of the moments people remember most.",
            coreConcept: {
              title: "Close the loop, then leave",
              body: [
                "A graceful exit has a simple shape. Wait for a natural pause. Signal the close (\"I don't want to keep you all evening\"). Reflect something they said, so it's clear you listened. Name a next step or swap contact details. Then say their name and go.",
                "Make your reason honest and about the situation, not the person: catching a colleague, getting food, meeting a few more people. No elaborate excuses.",
                "Don't drift away mid-sentence or let the conversation fade into silence. A deliberate ending feels respectful; an awkward fade feels like rejection.",
              ],
              keyPoints: [
                "Wait for a natural pause, then signal the close.",
                "Reflect one thing they said before you go.",
                "Offer a next step or exchange contact details.",
                "Leave cleanly, using their name.",
              ],
            },
            expertInsight: {
              text: "Daniel Kahneman and colleagues described the 'peak-end rule': people tend to judge an experience largely by its most intense moment and by how it ended, rather than by its overall length. Endings carry outsized weight.",
              source: "Daniel Kahneman and colleagues",
              sourceDetail: "Research on the peak-end rule (1990s); Thinking, Fast and Slow (2011)",
            },
            example: {
              situation: "You've been talking with a supplier at a trade fair for fifteen minutes and want to visit other stands.",
              before:
                "You keep nodding, waiting for them to end it. Eventually you mumble \"Anyway...\" and drift off while they're mid-sentence.",
              after:
                "\"Henrik, this has been really useful, especially your point about lead times. Let me get your card; I'll send over our volumes next week. Enjoy the rest of the fair.\"",
              whyItWorks: "It reflects what mattered, sets a concrete next step and leaves both of you with a good ending.",
            },
            reflectionPrompt: "How do you usually end conversations at events? What impression do you think that ending leaves?",
          },
          exercise: {
            title: "Sequence the exit",
            description: "Put the steps of a graceful exit in the right order.",
            config: {
              type: "order",
              instruction: "Arrange these steps into the order of a graceful conversation exit.",
              items: [
                "Wait for a natural pause in the conversation",
                "Signal the close: \"I don't want to keep you all evening\"",
                "Reflect something they said that you valued",
                "Suggest a next step or exchange contact details",
                "Say their name, thank them and leave cleanly",
              ],
              explanation:
                "Pausing avoids interrupting; signalling prepares them; reflecting shows you listened; the next step keeps the door open; a clean goodbye creates a good ending.",
            },
          },
          quiz: [
            {
              prompt: "What does the peak-end rule suggest about conversations?",
              options: [
                "Longer conversations are always remembered better",
                "The first minute is all that matters",
                "How a conversation ends strongly shapes how it is remembered",
              ],
              correctIndex: 2,
              explanation: "People weigh the most intense moment and the ending heavily, so a good exit matters.",
              conceptKey: "connect-peak-end",
            },
            {
              prompt: "Which exit reason works best?",
              options: [
                "An elaborate excuse about an urgent call",
                "An honest, situational reason, such as \"I promised to catch a colleague\"",
                "No reason; just walk away",
                "Saying you're bored of the topic",
              ],
              correctIndex: 1,
              explanation: "Honest, situational reasons are easy to accept and don't reflect on the other person.",
              conceptKey: "connect-exit-signal",
            },
            {
              prompt: "Why include a next step when you exit?",
              options: [
                "It turns a pleasant chat into a relationship you can continue",
                "It makes the conversation last longer",
                "It's a polite formality with little effect",
                "It lets you pitch your services",
              ],
              correctIndex: 0,
              explanation: "A concrete next step, even just swapping details, gives the connection somewhere to go.",
              conceptKey: "connect-exit-next-step",
            },
          ],
          action: {
            title: "One deliberate exit",
            description:
              "At your next event, long call or corridor conversation, end at least one conversation using the full sequence: pause, signal, reflect, next step, clean goodbye.",
            successCriteria: "You ended the conversation deliberately and included a reflection and a next step.",
            difficulty: "beginner",
            estimatedMinutes: 5,
          },
        },
        {
          slug: "connect-follow-up-after-event",
          title: "Follow up after the event",
          description: "A specific, useful follow-up turns a good conversation into a relationship.",
          category: "networking",
          difficulty: "beginner",
          estimatedMinutes: 8,
          content: {
            hook: "Most promising connections don't fail at the event. They fade in the week after, when nobody follows up.",
            whyItMatters:
              "A conversation creates a moment of goodwill that fades quickly. A short, specific follow-up captures it while it's fresh and shows you were paying attention. Few people do this well, so doing it reliably sets you apart.",
            coreConcept: {
              title: "Specific, useful, light",
              body: [
                "A strong follow-up has three parts. Something specific from your conversation, so they remember who you are. Something useful: an article, an introduction, an answer to a question they raised. And a light next step they can easily accept or ignore.",
                "Send it soon, ideally within a day or two, while the conversation is still fresh for both of you.",
                "Avoid the generic \"Great to meet you, let's keep in touch!\" It asks them to do the work of remembering you and gives them nothing to respond to.",
              ],
              keyPoints: [
                "Reference a specific moment from your conversation.",
                "Give something useful before asking for anything.",
                "Make the next step light and easy to say yes to.",
                "Send it while the memory is fresh.",
              ],
            },
            expertInsight: {
              text: "Robert Cialdini's work on reciprocity describes how people feel inclined to return a favour or a kindness they've received. Offering something useful first makes a reply, and a continued relationship, more natural.",
              source: "Robert Cialdini",
              sourceDetail: "Influence: The Psychology of Persuasion (1984)",
            },
            example: {
              situation: "Sam met Elena at a retail summit. She mentioned her team is struggling with product returns.",
              before: "\"Hi Elena, great to meet you yesterday. Let's keep in touch! Best, Sam\" No reply.",
              after:
                "\"Hi Elena, good to meet you at the summit. You mentioned your team is rethinking returns; here's the case study I talked about. Happy to swap notes on a short call if useful.\" She replies the same day.",
              whyItWorks: "It reminds her who Sam is, delivers on a promise and offers an easy, optional next step.",
            },
            reflectionPrompt: "Who have you met recently that you meant to follow up with but didn't? What stopped you?",
          },
          exercise: {
            title: "Upgrade the follow-up",
            description: "Rewrite a generic follow-up into one that is specific, useful and light.",
            config: {
              type: "rewrite",
              instruction:
                "You met Elena at a retail summit. She mentioned her team is rethinking how it handles product returns, and you promised to send a case study. Rewrite this follow-up.",
              original: "Hi, great to meet you yesterday. Let's keep in touch! Best, Sam",
              tips: [
                "Mention where you met and what she told you.",
                "Include the useful thing you promised.",
                "End with a light, optional next step.",
              ],
              maxWords: 60,
              keywords: ["mentioned", "returns", "case study", "summit"],
              modelAnswer:
                "Hi Elena, good to meet you at the retail summit. You mentioned your team is rethinking returns, so here's the case study I talked about. If useful, I'd be glad to swap notes on a short call. Best, Sam",
            },
          },
          quiz: [
            {
              prompt: "What is the main weakness of \"Great to meet you, let's keep in touch!\"?",
              options: [
                "It's too formal",
                "It's too long",
                "It sounds too eager",
                "It gives them nothing specific to remember or respond to",
              ],
              correctIndex: 3,
              explanation: "Generic follow-ups make the other person do all the work of remembering and replying.",
              conceptKey: "connect-follow-up-specific",
            },
            {
              prompt: "Which principle explains why giving something useful first increases replies?",
              options: ["Scarcity", "Reciprocity", "Social proof"],
              correctIndex: 1,
              explanation: "Cialdini described reciprocity: people tend to want to return what they've received.",
              conceptKey: "connect-reciprocity",
            },
            {
              prompt: "When is the best time to follow up after meeting someone?",
              options: [
                "Soon, ideally within a day or two, while the conversation is fresh",
                "After a few weeks, so you don't seem too keen",
                "Only when you need something from them",
                "Right before the next event",
              ],
              correctIndex: 0,
              explanation: "Goodwill and memory fade quickly. Following up soon makes you easy to place.",
              conceptKey: "connect-follow-up-timing",
            },
          ],
          action: {
            title: "Send one real follow-up",
            description:
              "Send one specific follow-up message to someone you met recently: reference your conversation, offer something useful and suggest a light next step.",
            successCriteria: "The message was sent and contained a specific reference, something useful and an optional next step.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "connect-give-first",
          title: "Give first, keep weak ties warm",
          description: "Your acquaintances are your most underused network. Small favours keep them alive.",
          category: "networking",
          difficulty: "intermediate",
          estimatedMinutes: 10,
          content: {
            hook: "The person most likely to tell you about your next opportunity is probably not a close friend. It's someone you haven't spoken to in a year.",
            whyItMatters:
              "Close contacts tend to know what you already know. Acquaintances move in different circles and hear about different things. Keeping those looser connections warm, without it feeling transactional, is one of the highest-return habits in a career.",
            coreConcept: {
              title: "Weak ties and the five-minute favour",
              body: [
                "Your network has strong ties (people you see often) and weak ties (acquaintances, former colleagues, people you met once). Weak ties are valuable precisely because they connect you to information and people outside your usual circle.",
                "The way to keep them warm is to give first. Adam Grant popularised the 'five-minute favour': a small act that costs you little and helps someone else, such as an introduction, a useful link, a quick piece of feedback or a public word of recognition.",
                "Do it without an ask attached. Relationships built on regular, small generosity are there for you when you need them; relationships you only activate when you need something feel transactional, and people notice.",
              ],
              keyPoints: [
                "Weak ties connect you to new information and opportunities.",
                "Give first with small, low-cost favours.",
                "Keep favours free of any ask.",
                "Reconnect regularly, not only when you need something.",
              ],
            },
            expertInsight: {
              text: "Sociologist Mark Granovetter showed that people often learn about new opportunities, including jobs, through acquaintances rather than close friends, because acquaintances bridge to different social circles. He called this 'the strength of weak ties'.",
              source: "Mark Granovetter",
              sourceDetail: "\"The Strength of Weak Ties\", American Journal of Sociology (1973)",
            },
            example: {
              situation: "Nadia hasn't spoken to Tomás, a former colleague now at another company, for over a year.",
              before: "She plans to message him only when she starts looking for a new role, then feels awkward reaching out cold.",
              after:
                "She sees an article on a topic he cares about and sends it: \"Saw this and thought of your work on supplier audits. Hope all's well.\" They catch up for coffee a month later.",
              whyItWorks: "A small, specific gift with no ask restarted the relationship on generous terms.",
            },
            reflectionPrompt: "Which acquaintance have you lost touch with who would genuinely appreciate hearing from you?",
          },
          exercise: {
            title: "Plan a five-minute favour",
            description: "Plan how to reconnect with one weak tie by giving first.",
            config: {
              type: "structure",
              framework: "Give-first reconnection",
              instruction: "Choose one acquaintance you've lost touch with and plan a small, no-strings reconnection.",
              context: "Think of former colleagues, people met at events, or friends-of-friends you liked but rarely see.",
              slots: [
                { key: "person", label: "The person", hint: "Who, and how you know them.", maxWords: 20 },
                {
                  key: "care",
                  label: "What they care about",
                  hint: "A project, goal or interest you know matters to them.",
                  maxWords: 25,
                },
                {
                  key: "favour",
                  label: "Your five-minute favour",
                  hint: "An introduction, article, piece of feedback or recognition.",
                  maxWords: 30,
                },
                {
                  key: "message",
                  label: "Opening line",
                  hint: "The first sentence of your message, with no ask attached.",
                  maxWords: 35,
                },
              ],
            },
          },
          quiz: [
            {
              prompt: "According to Granovetter, why are weak ties valuable?",
              options: [
                "They are more loyal than close friends",
                "They are easier to ask for favours",
                "They connect you to information and circles outside your own",
                "They require no effort to maintain",
              ],
              correctIndex: 2,
              explanation: "Acquaintances bridge to different networks, so they hear about things your close circle doesn't.",
              conceptKey: "connect-weak-ties",
            },
            {
              prompt: "Which is the best example of a five-minute favour?",
              options: [
                "Introducing two people who could genuinely help each other",
                "Asking an old contact for a job referral",
                "Liking all of someone's posts",
              ],
              correctIndex: 0,
              explanation: "A five-minute favour costs you little and creates real value for someone else.",
              conceptKey: "connect-five-minute-favour",
            },
            {
              prompt: "Why should a reconnection favour come without an ask?",
              options: [
                "Asks are never appropriate in networking",
                "Generosity without strings builds trust; a favour with an ask attached feels transactional",
                "People don't read long messages",
                "It saves time",
              ],
              correctIndex: 1,
              explanation: "When giving is clearly not a set-up for asking, the relationship feels genuine.",
              conceptKey: "connect-give-without-ask",
            },
          ],
          action: {
            title: "Reconnect by giving",
            description:
              "Reconnect with one dormant contact this week by sending a small, specific favour (a link, an introduction, feedback or recognition) with no ask attached.",
            successCriteria: "You sent the message with a genuine favour and no request in it.",
            difficulty: "intermediate",
            estimatedMinutes: 10,
          },
        },
      ],
    },
  ],
};
