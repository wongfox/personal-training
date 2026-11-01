import type { JourneySeed } from "../types";

export const sharperThinking: JourneySeed = {
  slug: "sharper-thinking",
  title: "Sharper Thinking",
  subtitle: "Structure problems, decide with less bias and remember what matters.",
  description:
    "Nine sessions on the practical mechanics of thinking well: organising ideas so others follow them, making decisions that hold up under scrutiny, and using well-researched memory techniques to learn faster and keep more.",
  category: "critical_thinking",
  difficulty: "beginner",
  order: 4,
  modules: [
    /* ───────────────────────── Module 1 ───────────────────────── */
    {
      title: "Structured Thinking",
      description:
        "Organise problems and ideas so that you, and everyone you work with, can see them clearly.",
      lessons: [
        {
          slug: "think-answer-first",
          title: "Lead with the answer",
          description: "Put your conclusion first and your reasons after, so people get the point in seconds.",
          category: "critical_thinking",
          difficulty: "beginner",
          estimatedMinutes: 10,
          content: {
            hook: "Busy people decide in the first few lines whether your message matters. If your point is at the end, many never reach it.",
            whyItMatters:
              "We naturally write in the order we thought: background, analysis, then conclusion. Readers need the reverse. Leading with the answer saves their time, makes your reasoning easier to check and makes you sound more decisive.",
            coreConcept: {
              title: "The pyramid: answer, then reasons",
              body: [
                "Start with your main point: the answer, recommendation or request. Then give the few key reasons that support it, and only then the detail beneath each reason.",
                "This works because people process ideas more easily when they know where you're going. Each supporting point lands as evidence for something, rather than a loose fact they have to hold in mind until the end.",
                "A quick test: if the reader stopped after your first sentence, would they know what you concluded or what you want? If not, move the conclusion up.",
              ],
              keyPoints: [
                "Put the conclusion or request in the first sentence.",
                "Support it with two to four key reasons.",
                "Keep detail below the reasons, not before them.",
                "Test: does the first line stand on its own?",
              ],
            },
            expertInsight: {
              text: "Barbara Minto, a former McKinsey consultant, developed the Pyramid Principle: present ideas top-down, starting with the single governing thought and followed by grouped supporting arguments, because readers grasp ideas more easily when they know the conclusion first.",
              source: "Barbara Minto",
              sourceDetail: "The Pyramid Principle",
            },
            example: {
              situation: "Chloe, a financial analyst, emails her director after investigating a budget overrun.",
              before:
                "'I looked at the Q2 numbers across all regions and, after comparing them to the forecast and talking to the regional leads, it seems there were a few factors, mainly in the West and related to freight, which means we might need to adjust…'",
              after:
                "'We'll overspend Q2 unless we cap West region freight costs this month. Two reasons: fuel surcharges there rose sharply, and two large orders shipped express. I recommend moving the remaining West orders to standard shipping. Details below.'",
              whyItWorks:
                "The director knows the conclusion and the recommended action within two sentences and can decide whether to read on.",
            },
            reflectionPrompt:
              "Look at the last long message you sent. Where was your main point, and how would it read moved to the first line?",
          },
          exercise: {
            title: "Move the answer up",
            description: "Restructure a meandering update so it leads with the point.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this update so the first sentence states the conclusion or recommendation, followed by brief supporting reasons.",
              original:
                "So I spent the last few days looking at our onboarding flow, and I talked to a few customers and checked the analytics. There's a lot going on, but one thing that came up several times is that the setup step asks for too much information up front, and a lot of people drop off there. So I was thinking maybe we could simplify it.",
              tips: [
                "Start with the recommendation.",
                "Give two or three supporting reasons.",
                "Cut the story of how you found it.",
              ],
              maxWords: 50,
              keywords: ["recommend", "we should", "propose", "simplify"],
              modelAnswer:
                "I recommend we simplify the onboarding setup step to only essential fields. Two reasons: it's where most new users drop off, and customers I interviewed said it asks for too much too early. I can share a draft by Friday.",
            },
          },
          quiz: [
            {
              prompt: "Which opening line best follows the answer-first principle?",
              options: [
                "I've been reviewing the vendor proposals over the last week.",
                "There are a number of considerations regarding the vendors.",
                "We should choose Vendor B: it's cheaper over three years and integrates with our CRM.",
                "As you know, the vendor contract expires soon.",
              ],
              correctIndex: 2,
              explanation:
                "It states the recommendation and previews the reasons. The other openings make the reader wait for the point.",
              conceptKey: "think-answer-first",
            },
            {
              prompt: "Your manager asks for a quick update on a delayed project. What's the best structure?",
              options: [
                "Timeline history, then the issues, then the new date",
                "The new expected date and what you need, then the main causes, then details if asked",
                "An apology, then the causes, then the new date",
                "Every task in detail, so nothing is missed",
              ],
              correctIndex: 1,
              explanation:
                "Lead with what they need to know or act on. Causes and detail support the conclusion and can be skipped if they're short on time.",
              conceptKey: "think-update-structure",
            },
            {
              prompt: "Why does putting the conclusion first make supporting points easier to follow?",
              options: [
                "It always makes the message shorter",
                "It hides weak reasoning",
                "It sounds more confident",
                "Readers can interpret each point as evidence for a claim they already know",
              ],
              correctIndex: 3,
              explanation:
                "Knowing the destination gives each supporting point a place to land. Without it, readers must hold scattered facts until the end.",
              conceptKey: "think-pyramid-why",
            },
          ],
          action: {
            title: "Send one answer-first message",
            description:
              "Before sending your next important email or chat message today, rewrite it so the first sentence is the conclusion or request, followed by the key reasons.",
            successCriteria: "A message is sent whose first sentence alone tells the reader what you concluded or what you want.",
            difficulty: "beginner",
            estimatedMinutes: 5,
          },
        },
        {
          slug: "think-mece",
          title: "Break problems into clean pieces",
          description: "Split a problem into parts that don't overlap and don't leave gaps.",
          category: "critical_thinking",
          difficulty: "beginner",
          estimatedMinutes: 10,
          content: {
            hook: "A messy problem often isn't hard. It has just been cut into pieces that overlap and leave holes.",
            whyItMatters:
              "When a problem is split into overlapping parts, people double-count and argue past each other. When parts are missing, the real cause hides in the area nobody examined. A clean breakdown makes analysis faster and discussions sharper.",
            coreConcept: {
              title: "Mutually exclusive, collectively exhaustive",
              body: [
                "MECE means splitting a problem into parts that are mutually exclusive (no overlap) and collectively exhaustive (nothing missing). Profit splits cleanly into revenue and costs; revenue splits into number of sales and average price.",
                "Reliable ways to split: by formula (revenue = volume × price), by process stage (attract, convert, retain), by segment (new vs. existing customers) or by true opposites (internal vs. external causes).",
                "Perfect MECE isn't always possible, and that's fine. The point is to check your breakdown: could anything fall into two buckets? Is there a likely cause that fits none? Fix those and your analysis tightens quickly.",
              ],
              keyPoints: [
                "No overlap between the parts.",
                "No gaps: together they cover the whole problem.",
                "Split by formula, process, segment or true opposites.",
                "Check for double-counting and missing buckets.",
              ],
            },
            expertInsight: {
              text: "The MECE principle is closely associated with McKinsey & Company and is central to Barbara Minto's work on structured reasoning. Grouping ideas so they neither overlap nor leave gaps makes an argument easier to follow and harder to poke holes in.",
              source: "Barbara Minto / McKinsey & Company",
              sourceDetail: "The Pyramid Principle",
            },
            example: {
              situation: "Ravi, an operations lead, is asked why customer support response times have worsened.",
              before:
                "He lists 'staffing, the new tool, ticket volume, holidays, slow agents, harder tickets.' The team argues, because holidays and staffing overlap and 'slow agents' could mean almost anything.",
              after:
                "He splits it into demand (number of tickets, effort per ticket) and capacity (agent hours available, tickets handled per hour). Every suspicion fits one bucket, and the data quickly shows demand rose while capacity stayed flat.",
              whyItWorks:
                "The MECE split turns a list of suspicions into a structure the data can test, and stops people arguing over overlapping labels.",
            },
            reflectionPrompt:
              "Pick a problem you're working on. What two or three MECE buckets could you split it into?",
          },
          exercise: {
            title: "Spot the clean breakdown",
            description: "Pick the breakdown that best avoids overlaps and gaps.",
            config: {
              type: "choice",
              scenario:
                "Monthly revenue at your online store has dropped. Your manager asks you to structure the investigation before anyone starts digging.",
              question: "Which breakdown is the most MECE starting point?",
              options: [
                {
                  text: "Marketing issues, website problems, competitor activity, seasonality, bad reviews",
                  quality: "ok",
                  feedback:
                    "All plausible, but they overlap (bad reviews can be a website or marketing issue) and may miss causes such as pricing.",
                },
                {
                  text: "Things we control and things we're worried about",
                  quality: "weak",
                  feedback: "These aren't opposites: a cause can be both, and many causes may fit neither.",
                },
                {
                  text: "Number of orders and average order value",
                  quality: "best",
                  feedback:
                    "Revenue equals orders times average order value, so these two parts cover everything with no overlap. Each can then be split further.",
                },
                {
                  text: "Mobile shoppers, desktop shoppers and returning customers",
                  quality: "weak",
                  feedback: "Returning customers overlap with both device groups, so the same drop could be counted twice.",
                },
              ],
            },
          },
          quiz: [
            {
              prompt: "Which breakdown of a company's total 'people costs' is MECE?",
              options: [
                "Salaries, bonuses and engineering staff",
                "Senior staff, remote staff and office staff",
                "Employee costs and contractor costs",
                "Salaries and high-earning employees",
              ],
              correctIndex: 2,
              explanation:
                "Everyone paid is either an employee or a contractor, with no overlap. The other options mix categories, so the same cost could be counted twice.",
              conceptKey: "think-mece-identify",
            },
            {
              prompt:
                "Your team's list of reasons for low survey responses includes 'too long' and 'too many questions.' What's the MECE problem?",
              options: [
                "There's a gap in the list",
                "They overlap and may double-count the same cause",
                "They're too specific to be useful",
                "Nothing; both are valid reasons",
              ],
              correctIndex: 1,
              explanation:
                "Length and number of questions largely describe the same issue. Merging them avoids inflating its importance and clarifies the analysis.",
              conceptKey: "think-mece-overlap",
            },
            {
              prompt: "Which is a reliable way to create a MECE split?",
              options: [
                "Use a formula, such as profit = revenue − costs",
                "Brainstorm every possible cause in one list",
                "Group causes by who raised them",
                "Sort ideas by how likely they seem",
              ],
              correctIndex: 0,
              explanation:
                "A formula's components cover the whole result without overlap by definition. Brainstormed lists are useful raw material but rarely MECE as they stand.",
              conceptKey: "think-mece-formula",
            },
          ],
          action: {
            title: "MECE one real problem",
            description:
              "Take a problem from your work or life today, such as a budget, a delay or a stalled goal. Break it into two to four MECE buckets on paper, then check for overlaps and gaps.",
            successCriteria:
              "You have a written breakdown where every likely cause fits exactly one bucket, and you've marked which bucket to investigate first.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "think-first-principles",
          title: "Reason from first principles",
          description: "Strip a problem down to what's actually true, then rebuild your solution from there.",
          category: "critical_thinking",
          difficulty: "intermediate",
          estimatedMinutes: 12,
          content: {
            hook: "Much of what we call 'how it's done' is simply how it was done last time.",
            whyItMatters:
              "Reasoning by analogy, copying what others do, is fast and usually fine. But it also imports other people's assumptions and constraints. When you're stuck or the stakes are high, breaking a problem down to its fundamentals can reveal options that convention hides.",
            coreConcept: {
              title: "Question assumptions, rebuild from facts",
              body: [
                "First-principles thinking means identifying the basic truths of a problem and reasoning up from them, rather than starting from existing solutions. The core question: what do we know for certain here, and what are we merely assuming?",
                "A practical method: state the problem, list the assumptions behind the current approach, and challenge each one ('Is this actually true? Says who?'). Then build a solution using only what survives.",
                "You won't do this for everything, because it's slow. Use it when a constraint feels arbitrary, when costs seem stubbornly high, or when every available solution looks the same.",
              ],
              keyPoints: [
                "Separate facts from inherited assumptions.",
                "Challenge each assumption: is it actually true?",
                "Rebuild the solution from what remains.",
                "Save it for high-stakes or stuck problems.",
              ],
            },
            expertInsight: {
              text: "Aristotle described first principles as the foundational truths from which other knowledge is derived and which cannot themselves be deduced from anything more basic. Modern problem-solvers use the idea as a discipline: reason from fundamentals rather than from precedent.",
              source: "Aristotle",
              sourceDetail: "Classical Greek philosophy",
            },
            example: {
              situation:
                "Jonas runs training for a sales team and is told the annual onboarding programme 'has to be' a five-day, in-person bootcamp.",
              before: "He tries to squeeze more content into the five days and fights for a bigger venue budget.",
              after:
                "He lists the assumptions: it must be in person, all at once, and five days long. Then he asks what's actually required: new reps must be able to demo the product and handle common objections before meeting customers. He rebuilds it as short self-paced modules followed by one in-person day of live practice.",
              whyItWorks:
                "Separating the real goal from the inherited format let Jonas find a cheaper approach that targets the skill that actually matters.",
            },
            reflectionPrompt: "What's one 'that's just how it's done' in your work that you've never questioned?",
          },
          exercise: {
            title: "Break it down, build it up",
            description: "Apply first-principles reasoning to a real problem of your own.",
            config: {
              type: "structure",
              framework: "First-principles breakdown",
              instruction:
                "Pick a problem where the usual approach feels expensive, slow or stuck. Work through each step in order.",
              context: "Be ruthless in the assumptions step: anything you can't verify belongs there, not in 'what's true'.",
              slots: [
                { key: "problem", label: "The problem", hint: "State it in one sentence.", maxWords: 25 },
                {
                  key: "assumptions",
                  label: "Assumptions",
                  hint: "What does the current approach take for granted?",
                  maxWords: 40,
                },
                {
                  key: "truths",
                  label: "What's actually true",
                  hint: "Which facts or requirements survive questioning?",
                  maxWords: 40,
                },
                {
                  key: "rebuild",
                  label: "Rebuilt solution",
                  hint: "A new approach built only from those truths.",
                  maxWords: 40,
                },
              ],
            },
          },
          quiz: [
            {
              prompt:
                "Your team says a report must be produced weekly 'because it always has been.' What's the first-principles move?",
              options: [
                "Keep it weekly to avoid disruption",
                "Ask what decisions the report supports and how often those decisions are actually made",
                "Make it daily to be safe",
                "Ask a peer company how often they do theirs",
              ],
              correctIndex: 1,
              explanation:
                "Linking the report to the decisions it serves reveals the real requirement. Copying a peer is reasoning by analogy, which imports their assumptions.",
              conceptKey: "think-first-principles-apply",
            },
            {
              prompt: "Which is an example of reasoning by analogy rather than from first principles?",
              options: [
                "Asking what the customer fundamentally needs",
                "Listing the basic cost components of a product",
                "Setting your prices at whatever a competitor charges",
                "Checking whether a regulation actually applies to you",
              ],
              correctIndex: 2,
              explanation:
                "Copying a competitor's price imports their costs and strategy as assumptions. That can be reasonable, but it isn't reasoning from your own fundamentals.",
              conceptKey: "think-analogy-vs-principles",
            },
            {
              prompt: "When is first-principles thinking most worth the effort?",
              options: [
                "For every routine daily decision",
                "Only for technical engineering problems",
                "When you need an answer in the next five minutes",
                "When the standard approach is stuck, costly or built on old constraints",
              ],
              correctIndex: 3,
              explanation:
                "It's slow and demanding, so reserve it for problems where convention is clearly failing. For routine choices, sensible analogies are efficient.",
              conceptKey: "think-first-principles-when",
            },
          ],
          action: {
            title: "Challenge one assumption",
            description:
              "Pick one process, rule or habit at work or at home. Write down the assumption behind it, then ask someone involved, or check the source, whether it's actually required.",
            successCriteria:
              "You identified one assumption and confirmed whether it's a real constraint or an inherited habit.",
            difficulty: "intermediate",
            estimatedMinutes: 10,
          },
        },
      ],
    },

    /* ───────────────────────── Module 2 ───────────────────────── */
    {
      title: "Decisions and Biases",
      description:
        "Make choices that hold up by anticipating failure, weighing options deliberately and checking your own blind spots.",
      lessons: [
        {
          slug: "think-pre-mortem",
          title: "Run a pre-mortem",
          description: "Imagine your plan has already failed to uncover risks while you can still fix them.",
          category: "critical_thinking",
          difficulty: "beginner",
          estimatedMinutes: 10,
          content: {
            hook: "After a project fails, everyone can explain why. A pre-mortem lets you hear those explanations before you start.",
            whyItMatters:
              "Teams excited about a plan tend to underweight its risks, and people hesitate to criticise a plan their leader likes. A pre-mortem makes finding flaws the assignment rather than an act of disloyalty. It takes minutes and often surfaces the issue that would have sunk the project.",
            coreConcept: {
              title: "Assume it failed, then explain why",
              body: [
                "In a pre-mortem you tell the team: 'Imagine it's six months from now and this project has failed badly. Take a few minutes and write down every reason why.' Each person writes independently before anyone speaks.",
                "Treating failure as something that has already happened changes how people think. Instead of debating whether something might go wrong, they generate concrete stories of how it did, which tends to surface more specific risks.",
                "Collect the reasons, group them and pick the most likely or most damaging. Then change the plan: add a safeguard, adjust a step or define an early warning sign to watch.",
              ],
              keyPoints: [
                "Assume the plan has already failed.",
                "Have people write reasons independently first.",
                "Group and rank the risks.",
                "Change the plan for the top risks.",
              ],
            },
            expertInsight: {
              text: "Psychologist Gary Klein developed the pre-mortem to counter overconfidence in planning. Asking a team to imagine a project has failed and explain why legitimises dissent and helps people voice concerns they might otherwise keep to themselves.",
              source: "Gary Klein",
              sourceDetail: "'Performing a Project Premortem', Harvard Business Review (2007)",
            },
            example: {
              situation: "Amara, a marketing manager, is about to launch a campaign for a new product line.",
              before:
                "In the final review she asks, 'Everyone comfortable?' Heads nod. After launch, the landing page buckles under traffic and the discount code fails at checkout.",
              after:
                "She runs a 15-minute pre-mortem: 'It's one week after launch and the campaign flopped. Why?' People write independently. Two flag untested discount codes; one flags page speed under heavy traffic. She adds a load test and a code test to the launch checklist.",
              whyItWorks:
                "Writing independently prevented groupthink, and the failure framing made raising problems the expected contribution.",
            },
            reflectionPrompt:
              "Think of a plan you're about to execute. If it failed, what would the most likely reason be?",
          },
          exercise: {
            title: "Run the pre-mortem steps",
            description: "Arrange the steps of a pre-mortem in the right sequence.",
            config: {
              type: "order",
              instruction: "Put these pre-mortem steps in the order you'd run them.",
              items: [
                "Brief the team on the plan",
                "Ask everyone to imagine the plan has failed badly",
                "Have each person write down reasons independently",
                "Share the reasons one at a time around the group",
                "Group and rank the risks by likelihood and impact",
                "Update the plan with safeguards for the top risks",
              ],
              explanation:
                "Everyone needs the plan first, then the failure frame. Independent writing comes before sharing to avoid groupthink. Ranking focuses effort, and the session only pays off if the plan actually changes.",
            },
          },
          quiz: [
            {
              prompt: "Why ask people to write failure reasons silently before any discussion?",
              options: [
                "To save time in the meeting",
                "To stop early or senior voices from shaping everyone else's answers",
                "To keep the answers anonymous for legal reasons",
                "So the leader can filter the answers first",
              ],
              correctIndex: 1,
              explanation:
                "Independent writing captures each person's view before social pressure kicks in, which surfaces a wider range of risks.",
              conceptKey: "think-premortem-independent",
            },
            {
              prompt: "How does a pre-mortem differ from simply asking 'What could go wrong?'",
              options: [
                "It only works for large projects",
                "It requires an external facilitator",
                "It treats failure as having already happened, prompting specific explanations",
                "It focuses on who would be to blame",
              ],
              correctIndex: 2,
              explanation:
                "Treating failure as a given shifts people from judging whether something could fail to explaining how it did, which tends to produce more concrete risks.",
              conceptKey: "think-premortem-frame",
            },
            {
              prompt: "Your pre-mortem surfaced ten risks. What's the best next step?",
              options: [
                "Address all ten equally before starting",
                "Rank them and adjust the plan for the few most likely or most damaging",
                "Record them and proceed as planned",
                "Cancel the project because of the risks",
              ],
              correctIndex: 1,
              explanation:
                "Not every risk deserves equal effort. Ranking lets you act on the critical few; recording risks without acting on them wastes the exercise.",
              conceptKey: "think-premortem-act",
            },
          ],
          action: {
            title: "Run a five-minute pre-mortem",
            description:
              "Pick a plan you're about to execute: a project, a presentation, a trip. Alone or with one colleague, imagine it failed and list at least five reasons why. Choose the top one and change something in the plan.",
            successCriteria:
              "You have a written list of at least five failure reasons and one concrete change made to the plan.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "think-weighted-criteria",
          title: "Decide with weighted criteria",
          description: "Make complex choices by agreeing on what matters before comparing the options.",
          category: "critical_thinking",
          difficulty: "beginner",
          estimatedMinutes: 12,
          content: {
            hook: "When a decision feels impossible, it's usually because you're comparing the options on several different things at once.",
            whyItMatters:
              "Gut feel works well for familiar, fast decisions. For bigger choices, such as a hire, a vendor or a job offer, it tends to latch on to whatever is most vivid. Writing down criteria and weights makes your reasoning visible, consistent and easier to discuss.",
            coreConcept: {
              title: "Criteria first, options second",
              body: [
                "Before looking closely at the options, list what matters: cost, quality, risk, time, fit with your goals. Doing this first stops you reverse-engineering criteria to justify a favourite.",
                "Weight each criterion by importance, say from 1 to 5. Score each option against each criterion and multiply. The totals give you a structured comparison, not a verdict.",
                "If the result surprises you, treat that as information. A weight may be wrong, a criterion may be missing, or your gut may be reacting to something you haven't named yet. Adjust and look again.",
              ],
              keyPoints: [
                "Define criteria before evaluating options.",
                "Weight criteria by how much they matter.",
                "Score each option, then compare totals.",
                "Use surprises to uncover missing criteria.",
              ],
            },
            expertInsight: {
              text: "Daniel Kahneman recommended structuring important judgements by assessing several dimensions separately and independently before forming an overall view. Doing so limits how much a single strong impression, like a polished interview, colours the whole decision.",
              source: "Daniel Kahneman",
              sourceDetail: "Thinking, Fast and Slow (2011)",
            },
            example: {
              situation: "Ines, a team lead, is choosing between three candidates for a senior role.",
              before:
                "She leans toward the candidate who gave the most polished interview, then struggles to justify it when a peer asks how he compares on technical depth.",
              after:
                "She sets criteria first (technical depth ×5, collaboration ×4, domain experience ×3, communication ×3), scores each candidate independently and compares. The polished candidate ranks second; the top scorer was quieter but stronger on what the role actually needs.",
              whyItWorks:
                "Scoring dimensions separately kept one vivid impression from dominating, and the written scores made her decision easy to explain.",
            },
            reflectionPrompt:
              "What decision are you facing where one vivid factor might be outweighing everything else?",
          },
          exercise: {
            title: "Make a weighted decision",
            description: "Structure a realistic team choice with criteria and weights.",
            config: {
              type: "decision",
              instruction:
                "List your criteria, weight each from 1 to 5, score every option and see which comes out on top. Note anything the scores reveal that your first instinct missed.",
              prompt:
                "Your team must choose a project management tool. Option A is what most people already know but has weak reporting. Option B has strong reporting and integrations but a steeper learning curve. Option C is the cheapest but would require migrating every existing project by hand.",
              suggestedCriteria: [
                "Ease of adoption for the team",
                "Reporting and visibility",
                "Total cost",
                "Migration effort",
                "Integration with existing tools",
              ],
            },
          },
          quiz: [
            {
              prompt: "Why define your criteria before looking closely at the options?",
              options: [
                "It makes the decision faster",
                "It prevents shaping the criteria to justify a favourite",
                "It ensures the cheapest option wins",
                "It removes the need for judgement",
              ],
              correctIndex: 1,
              explanation:
                "Once you like an option, it's easy to pick criteria it happens to win on. Setting criteria first keeps the comparison honest.",
              conceptKey: "think-criteria-first",
            },
            {
              prompt: "The weighted scores favour Option A, but your gut strongly prefers B. What's the best response?",
              options: [
                "Always follow the scores",
                "Always follow your gut",
                "Ask what your gut is reacting to, and check whether a criterion or weight is missing",
                "Average the two outcomes",
              ],
              correctIndex: 2,
              explanation:
                "The disagreement is a signal. Often your intuition is responding to an unnamed factor; naming it improves the model, or exposes a bias.",
              conceptKey: "think-scores-vs-gut",
            },
            {
              prompt: "Which decision is the best fit for a weighted-criteria approach?",
              options: [
                "Choosing a vendor for a multi-year contract",
                "Picking where to have lunch",
                "Deciding whether to answer an email now",
                "Choosing a font for a slide",
              ],
              correctIndex: 0,
              explanation:
                "The method takes effort, so it pays off for high-stakes, multi-factor decisions that are hard to reverse. Quick, low-stakes choices are better left to intuition.",
              conceptKey: "think-weighted-when",
            },
          ],
          action: {
            title: "Score one real decision",
            description:
              "Pick a decision you're facing, at work or personally. List three to five criteria, weight them, and score at least two options in a quick table.",
            successCriteria:
              "You have a written table of weighted criteria and scored options, plus one sentence on what you'll decide or what the table taught you.",
            difficulty: "beginner",
            estimatedMinutes: 15,
          },
        },
        {
          slug: "think-confirmation-bias",
          title: "Catch your confirmation bias",
          description: "Test your beliefs by looking for the evidence that could prove you wrong.",
          category: "psychology",
          difficulty: "intermediate",
          estimatedMinutes: 10,
          content: {
            hook: "The more certain you feel, the more likely it is that you've only been looking for reasons you're right.",
            whyItMatters:
              "We tend to notice, seek and remember information that fits what we already believe. At work, that means pet projects get overfunded, early hypotheses never get tested and first impressions of people harden fast. Deliberately seeking disconfirming evidence is one of the simplest ways to think more accurately.",
            coreConcept: {
              title: "Look for what would prove you wrong",
              body: [
                "Confirmation bias is the tendency to favour information that supports what we already believe. It shapes what we search for, how we interpret ambiguous data and which facts we remember later.",
                "The fix starts with the question you ask. Instead of 'What supports my view?', ask 'What would I expect to see if I were wrong, and have I looked for it?'",
                "Make it a habit: before committing, write down one piece of evidence that would change your mind, then find out whether it exists. Asking someone who disagrees to make their strongest case works too.",
              ],
              keyPoints: [
                "We seek, interpret and recall evidence that fits our beliefs.",
                "Ask what you'd expect to see if you were wrong.",
                "Decide in advance what would change your mind.",
                "Invite the strongest opposing case.",
              ],
            },
            expertInsight: {
              text: "Peter Wason's rule-discovery experiments showed that people tend to test their hypotheses by looking for confirming examples rather than trying to falsify them. Later work by Daniel Kahneman, Amos Tversky and others on heuristics and biases helped explain how such systematic errors shape everyday judgement.",
              source: "Peter Wason; Daniel Kahneman & Amos Tversky",
              sourceDetail: "Research on hypothesis testing and judgement under uncertainty",
            },
            example: {
              situation: "Theo, a product manager, believes a new feature is driving higher customer retention.",
              before:
                "He pulls retention data for users who adopted the feature, finds it's higher, and presents that as proof.",
              after:
                "He asks: 'If the feature didn't matter, what would I see?' Perhaps the people who adopt new features are simply the most engaged users already. He compares engaged users who did and didn't adopt it, and finds a much smaller effect than he expected.",
              whyItWorks:
                "Asking what the data would look like if he were wrong exposed an alternative explanation and gave Theo a more honest estimate.",
            },
            reflectionPrompt:
              "What's one belief about your work that you hold strongly? What evidence would change your mind?",
          },
          exercise: {
            title: "Turn a confirming question into a test",
            description: "Rewrite a one-sided request so it could actually prove you wrong.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this request so it tests the belief rather than confirming it. End with a question.",
              original:
                "Can you send me some examples of customers who loved the new pricing? I want to show leadership it's working.",
              tips: [
                "Ask for evidence on both sides.",
                "Name what would show it's not working.",
                "Keep the wording neutral, not leading.",
              ],
              maxWords: 45,
              requireQuestion: true,
              keywords: ["churn", "complaint", "balanced", "isn't working", "not working"],
              modelAnswer:
                "I want to give leadership an honest read on the new pricing. Could you pull a balanced sample of feedback and data, including churn, downgrades or complaints since the change, alongside the positive reactions? What would tell us it isn't working?",
            },
          },
          quiz: [
            {
              prompt:
                "You think a candidate is strong after a great first impression. Which step best counters confirmation bias?",
              options: [
                "Ask follow-up questions that let them shine",
                "Look for evidence that they're not a fit, using the same structured questions you use for everyone",
                "Trust your first impression; it's usually right",
                "Ask a colleague who also liked them",
              ],
              correctIndex: 1,
              explanation:
                "Structured, equal questions and actively seeking disconfirming evidence prevent a first impression from steering everything after it.",
              conceptKey: "think-bias-hiring",
            },
            {
              prompt: "Which question best tests the belief 'Our customers want more features'?",
              options: [
                "Which features do customers request most?",
                "How many customers mentioned features positively?",
                "What do customers who left or downgraded say was the reason?",
                "Which competitor features should we copy?",
              ],
              correctIndex: 2,
              explanation:
                "Looking at customers who left could reveal that price, reliability or ease of use matters more, which would challenge the belief.",
              conceptKey: "think-disconfirming-question",
            },
            {
              prompt: "What's the most practical habit for reducing confirmation bias?",
              options: [
                "Avoiding strong opinions altogether",
                "Gathering as much data as possible",
                "Only trusting quantitative data",
                "Writing down, before deciding, what evidence would change your mind",
              ],
              correctIndex: 3,
              explanation:
                "Committing in advance to what would change your mind makes it harder to explain away inconvenient evidence later. More data alone can still be read selectively.",
              conceptKey: "think-change-my-mind",
            },
          ],
          action: {
            title: "Hunt for one piece of disconfirming evidence",
            description:
              "Pick a belief you're acting on at work. Write down what you'd expect to see if it were wrong, then spend ten minutes looking for exactly that, or ask someone who disagrees.",
            successCriteria:
              "You wrote a 'what would change my mind' statement and recorded what you found, whether it confirmed or challenged the belief.",
            difficulty: "intermediate",
            estimatedMinutes: 15,
          },
        },
      ],
    },

    /* ───────────────────────── Module 3 ───────────────────────── */
    {
      title: "Memory and Learning",
      description:
        "Use well-researched techniques to remember people, ideas and information when it counts.",
      lessons: [
        {
          slug: "think-remember-names",
          title: "Remember names that stick",
          description: "Use attention, repetition and vivid associations to remember the people you meet.",
          category: "memory",
          difficulty: "beginner",
          estimatedMinutes: 8,
          content: {
            hook: "Most people who say they're bad with names were never really listening when the name was said.",
            whyItMatters:
              "Using someone's name signals attention and respect, and forgetting it right after an introduction is awkward for everyone. Remembering names is mostly technique, not talent. A few seconds of deliberate effort at the moment of introduction makes a real difference.",
            coreConcept: {
              title: "Hear it, use it, picture it",
              body: [
                "Names are often lost because we're busy planning what to say next. The first step is simply to focus at the moment of introduction, and to ask again straight away if you missed it.",
                "Then use the name soon and naturally: 'Nice to meet you, Daniela.' Saying and hearing it again strengthens the memory while it's fresh.",
                "Finally, link the name to a vivid image and something distinctive about the person. 'Rosa, who runs logistics' becomes a rose growing out of a shipping box. The stranger and more visual, the better it sticks.",
              ],
              keyPoints: [
                "Give full attention at the moment of introduction.",
                "Repeat the name early and naturally.",
                "Link the name to a vivid image.",
                "Tie the image to a detail about the person.",
              ],
            },
            expertInsight: {
              text: "Fergus Craik and Robert Lockhart proposed that information processed more deeply, by connecting it to meaning or imagery, is remembered better than information that is only briefly registered. A name you merely hear is processed shallowly; a name you link to an image and a person is processed deeply.",
              source: "Fergus Craik & Robert Lockhart",
              sourceDetail: "Levels of processing framework (1972)",
            },
            example: {
              situation: "Kenji, a consultant, meets eight new people in five minutes at a client workshop.",
              before:
                "He nods through the introductions while rehearsing his opening. By the first break he remembers one name and avoids addressing anyone directly.",
              after:
                "He listens to each name, repeats it once ('Good to meet you, Farah') and makes a quick image: Farah from finance becomes a Ferris wheel made of coins. By the break he can greet five people by name.",
              whyItWorks:
                "Attention, repetition and a vivid, personal image turned a fleeting sound into something his memory could hold on to.",
            },
            reflectionPrompt:
              "Whose name have you forgotten recently? What was going on in your head when you heard it?",
          },
          exercise: {
            title: "Remember the room",
            description: "Practise remembering names and details from a quick round of introductions.",
            config: {
              type: "recall",
              instruction:
                "Study these people you've just met at a networking event. Then recall as many names and details as you can.",
              items: [
                "Daniela: product designer, just moved from Lisbon",
                "Marcus: runs a bakery chain, loves cycling",
                "Priya: data scientist, speaks four languages",
                "Owen: startup lawyer, plays the cello",
                "Leila: HR director, training for a marathon",
                "Tomás: architect who designs schools",
                "Grace: investor who grew up on a farm",
                "Hiro: sales lead, collects vinyl records",
              ],
              studySeconds: 40,
              technique:
                "For each person, say the name once in your head, then build a quick, vivid image that links the name to the detail: Marcus riding a bicycle made of bread rolls, Owen playing a cello in a courtroom. Odd and visual beats logical.",
            },
          },
          quiz: [
            {
              prompt: "You're introduced to someone and immediately realise you didn't catch their name. What's best?",
              options: [
                "Hope it comes up later in conversation",
                "Avoid using their name for the rest of the chat",
                "Ask them to repeat it right away",
                "Look it up on social media afterwards",
              ],
              correctIndex: 2,
              explanation:
                "Asking immediately is natural and expected. Waiting makes it harder to ask later, and you'll spend the conversation avoiding their name.",
              conceptKey: "think-names-ask-again",
            },
            {
              prompt: "Which association is most likely to help you remember 'Bella, who works in compliance'?",
              options: [
                "Noting that Bella starts with B",
                "A giant bell ringing inside a thick rulebook",
                "Writing 'Bella, compliance' in your notes",
                "Repeating 'Bella' silently ten times",
              ],
              correctIndex: 1,
              explanation:
                "A vivid, unusual image that links the name to a meaningful detail involves deeper processing than rote repetition or surface features.",
              conceptKey: "think-names-image",
            },
            {
              prompt: "Why does using someone's name early in the conversation help you remember it?",
              options: [
                "It makes you seem more confident",
                "Etiquette requires it",
                "It shortens the conversation",
                "It gives your memory an extra repetition and retrieval right away",
              ],
              correctIndex: 3,
              explanation:
                "Saying it aloud is an early practice attempt that reinforces the memory while it's still fresh.",
              conceptKey: "think-names-use-early",
            },
          ],
          action: {
            title: "Learn three new names today",
            description:
              "In your next meetings, calls or errands, learn the names of three people you don't know well, such as a colleague, a receptionist or a barista. Repeat each name once and create an image for it.",
            successCriteria: "At the end of the day, you can write down all three names with one detail about each person.",
            difficulty: "beginner",
            estimatedMinutes: 5,
          },
        },
        {
          slug: "think-spaced-retrieval",
          title: "Learn it once, keep it longer",
          description: "Use retrieval practice and spacing to remember what you learn instead of re-reading it.",
          category: "productivity",
          difficulty: "beginner",
          estimatedMinutes: 12,
          content: {
            hook: "Re-reading your notes feels productive. It's one of the least effective ways to remember them.",
            whyItMatters:
              "Professionals learn constantly, from courses, books and meetings, and forget much of it within days. Two simple changes to how you review make a substantial difference: test yourself instead of re-reading, and spread your reviews out over time.",
            coreConcept: {
              title: "Retrieve, then space it out",
              body: [
                "Retrieval practice means pulling information out of your memory, by answering questions or explaining an idea without looking, rather than putting it back in by re-reading. The effort of recalling is what strengthens the memory.",
                "Spacing means reviewing at increasing intervals: perhaps the next day, a few days later, then a week or more later. Memories fade over time, and each well-timed review slows that fading.",
                "In practice, turn notes into questions. Instead of highlighting 'Pre-mortems surface risks by assuming failure', write 'How does a pre-mortem surface risks?' and answer it from memory later.",
              ],
              keyPoints: [
                "Test yourself instead of re-reading.",
                "Turn notes into questions.",
                "Space reviews out over increasing intervals.",
                "Struggling to recall is part of how it works.",
              ],
            },
            expertInsight: {
              text: "Hermann Ebbinghaus's experiments in the 1880s described how memory fades over time, a pattern now called the forgetting curve, and showed that spreading out repetitions slows forgetting. Later, Henry Roediger and Jeffrey Karpicke found that practising retrieval through testing produced better long-term retention than spending the same time re-studying.",
              source: "Hermann Ebbinghaus; Henry Roediger & Jeffrey Karpicke",
              sourceDetail: "Memory (1885); research on the testing effect (2006)",
            },
            example: {
              situation: "Zara, a new team manager, attends a two-day leadership course.",
              before:
                "She highlights her workbook heavily and re-reads it the night after. Three weeks later she can recall only a couple of ideas.",
              after:
                "After each session she writes five questions on cards. She answers them the next day, again a few days later and a week after that, setting aside the ones that come easily. A month later she can still explain the core frameworks to her team.",
              whyItWorks:
                "Each review forced Zara to retrieve the ideas, and the spacing timed those reviews before the memories faded.",
            },
            reflectionPrompt: "What did you learn in the last month that you'd like to still know a year from now?",
          },
          exercise: {
            title: "Turn a note into a question",
            description: "Convert a passive note into a retrieval prompt you can test yourself with.",
            config: {
              type: "rewrite",
              instruction:
                "Rewrite this note as a question you could answer from memory later. It should require recalling the idea, not just recognising it.",
              original:
                "Note: Psychological safety = team believes it's safe to take interpersonal risks (speak up, admit mistakes). Leaders build it through framing, admitting fallibility, asking questions.",
              tips: [
                "Ask for the idea in your own words.",
                "Prefer 'how' or 'why' over a simple 'what'.",
                "Don't put the answer inside the question.",
              ],
              maxWords: 30,
              requireQuestion: true,
              keywords: ["how", "why", "what"],
              modelAnswer:
                "What is psychological safety, and what are three things a leader can do to build it on their team?",
            },
          },
          quiz: [
            {
              prompt: "You have a certification exam in three weeks. Which study plan is most effective?",
              options: [
                "Re-read the material several times the week before",
                "Answer practice questions from memory, spread across the three weeks",
                "Highlight key passages, then review the highlights daily",
                "Cram everything in one long session the day before",
              ],
              correctIndex: 1,
              explanation:
                "Retrieval practice spread over time beats re-reading and cramming for long-term retention. Highlighting feels productive but involves little retrieval.",
              conceptKey: "think-retrieval-plan",
            },
            {
              prompt: "You try to recall a concept and struggle, but eventually get it. What does that effort mean?",
              options: [
                "You should switch to re-reading instead",
                "The concept is too hard for you",
                "You should stop reviewing it",
                "The effort of retrieval is helping strengthen the memory",
              ],
              correctIndex: 3,
              explanation:
                "Effortful retrieval is a feature, not a failure. Recalls that take some work tend to produce more durable memories.",
              conceptKey: "think-desirable-effort",
            },
            {
              prompt: "Which review schedule makes the best use of spacing?",
              options: [
                "Five times on the first day",
                "Day 1, day 3, day 7, then day 21",
                "Once, a month later",
                "Every day indefinitely",
              ],
              correctIndex: 1,
              explanation:
                "Reviews at increasing intervals catch memories before they fade too far, without wasting time on material you already know well.",
              conceptKey: "think-spacing-schedule",
            },
          ],
          action: {
            title: "Make five retrieval cards",
            description:
              "Take notes from something you learned this week, such as a meeting, an article or a course. Write five questions on cards or in an app, and set a reminder to answer them from memory tomorrow.",
            successCriteria: "Five questions exist somewhere you'll see them tomorrow, with a reminder set for the review.",
            difficulty: "beginner",
            estimatedMinutes: 10,
          },
        },
        {
          slug: "think-memory-palace",
          title: "Build a memory palace",
          description: "Place what you need to remember along a familiar route, then walk back through it.",
          category: "memory",
          difficulty: "intermediate",
          estimatedMinutes: 12,
          content: {
            hook: "You can't remember a ten-item list, but you can walk through your home with your eyes closed.",
            whyItMatters:
              "Our memory for places and images is far stronger than our memory for abstract lists. The memory palace borrows that strength, letting you recall talking points, sequences or lists without notes. It's useful for presentations, interviews and any moment where you need items in order.",
            coreConcept: {
              title: "Locations hold images",
              body: [
                "Choose a route you know extremely well, such as your home from the front door to the bedroom. Pick distinct stops along it: the door, the hallway mirror, the kitchen table, the sofa.",
                "Turn each item into a vivid, exaggerated image and place it at a stop. To remember 'budget, hiring, timeline', picture a giant wallet jammed in your front door, a queue of candidates in your hallway and a huge clock melting on the kitchen table.",
                "To recall, walk the route in your mind and 'see' what's at each stop. The route preserves the order and the images hold the content. A few practice runs make the technique feel natural.",
              ],
              keyPoints: [
                "Use a route you know extremely well.",
                "Turn each item into a vivid, odd image.",
                "Place one image at each stop, in order.",
                "Recall by walking the route in your mind.",
              ],
            },
            expertInsight: {
              text: "The method of loci dates back to ancient Greek and Roman rhetoric. Cicero credits its invention to the poet Simonides of Ceos, and Roman orators used imagined buildings to deliver long speeches from memory. Competitive memory athletes still rely on versions of it today.",
              source: "Method of loci",
              sourceDetail: "Described by Cicero in De Oratore",
            },
            example: {
              situation: "Adriana, a sales director, needs to deliver a seven-point quarterly update without slides.",
              before: "She writes the points on a card and keeps glancing down, losing eye contact and her flow.",
              after:
                "She places each point along her morning commute: a broken coffee machine at her front gate for customer complaints, a rocket at the bus stop for growth in the new market, and so on. During the update she walks the route mentally and delivers all seven points in order.",
              whyItWorks:
                "The familiar route gave her a reliable sequence, and the vivid images made each point easy to retrieve under pressure.",
            },
            reflectionPrompt:
              "Where in your work would remembering a sequence without notes make you more effective?",
          },
          exercise: {
            title: "Walk the palace",
            description: "Use a familiar route to memorise a list of talking points in order.",
            config: {
              type: "recall",
              instruction:
                "Memorise these ten talking points in order using a route through your home. Then recall them in sequence.",
              items: [
                "Welcome and purpose",
                "Last quarter's results",
                "Biggest customer win",
                "One key lesson learned",
                "New hiring plan",
                "Budget changes",
                "Product launch date",
                "Main risk to watch",
                "Request for support",
                "Date of the next check-in",
              ],
              studySeconds: 45,
              technique:
                "Pick ten stops along a route you know well, starting at your front door. Turn each point into a bizarre image and place it at the next stop: a giant welcome mat at the door, a trophy on the hallway shelf for results. To recall, walk the route in your mind.",
            },
          },
          quiz: [
            {
              prompt: "Why does the memory palace work well for ordered lists?",
              options: [
                "It requires less effort than writing notes",
                "It works without any images",
                "Familiar routes have a built-in sequence, and spatial memory is strong",
                "It only works for very short lists",
              ],
              correctIndex: 2,
              explanation:
                "The route preserves the order, and we remember places and vivid images well. It takes some effort, but it scales to long lists.",
              conceptKey: "think-loci-why",
            },
            {
              prompt: "You need to remember 'contract renewal' using a memory palace. Which image is strongest?",
              options: [
                "The words 'contract renewal' written on your door",
                "A plain sheet of paper on your table",
                "A calendar hanging on the wall",
                "A giant contract sprouting green leaves and growing through your sofa",
              ],
              correctIndex: 3,
              explanation:
                "Exaggerated, unusual, active images are more memorable than plain text or ordinary objects, and the growth captures 'renewal'.",
              conceptKey: "think-loci-vivid",
            },
            {
              prompt: "When building your first palace, which route should you choose?",
              options: [
                "A place you visited once on holiday",
                "Your own home or daily commute",
                "An imaginary building you design on the spot",
                "The rooms in your office you rarely use",
              ],
              correctIndex: 1,
              explanation:
                "The better you know the route, the more reliably you can walk it. Start with somewhere you could navigate with your eyes closed.",
              conceptKey: "think-loci-route",
            },
          ],
          action: {
            title: "Memorise today's to-do list",
            description:
              "Take your three to five most important tasks for today or tomorrow. Place each one as a vivid image along a route in your home, then put the written list away.",
            successCriteria: "Several hours later, you can recall every task in order without looking.",
            difficulty: "intermediate",
            estimatedMinutes: 10,
          },
        },
      ],
    },
  ],
};
