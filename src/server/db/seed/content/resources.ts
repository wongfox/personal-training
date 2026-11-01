import type { ResourceSeed } from "../types";

export const resources: ResourceSeed[] = [
  /* ───────────────────────── Frameworks ───────────────────────── */
  {
    slug: "framework-prep",
    title: "PREP: answer any question clearly",
    description: "Point, Reason, Example, Point: a four-step structure for clear answers under pressure.",
    type: "framework",
    category: "communication",
    difficulty: "beginner",
    estimatedMinutes: 4,
    source: "Widely used public-speaking structure",
    body: `When someone asks you a question in a meeting, the instinct is to think out loud. You start with background, wander through caveats and arrive at your answer just as attention runs out. PREP reverses that.

## The four steps

1. **Point.** Give your answer in one sentence. "Yes, we should keep the weekly meeting, but cut it to twenty minutes."
2. **Reason.** Say why. One strong reason beats three weak ones.
3. **Example.** Make it concrete with a fact, a case or a short story. "Last month the meeting caught the pricing error before it reached customers."
4. **Point.** Restate your answer, ideally with a next step. "So I'd keep it, shorter, starting next week."

## Why it works

Listeners get the conclusion first, so everything after it has a frame. The example turns an opinion into something people can picture, and the closing point gives them a clean takeaway to repeat.

## When to use it

- Answering a question in a meeting or interview
- Giving a quick opinion when put on the spot
- Writing a short message that needs a clear stance

## Common mistakes

- Starting with the reason and never quite stating the point
- Using three examples when one would land better
- Skipping the final point, which leaves the answer feeling unfinished

Practise PREP on small questions first. Once it becomes habit, it holds up when the stakes rise.`,
  },
  {
    slug: "framework-scr-pyramid",
    title: "Situation, Complication, Resolution",
    description: "Barbara Minto's approach for structuring recommendations so readers get the point fast.",
    type: "framework",
    category: "critical_thinking",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    source: "Barbara Minto, The Pyramid Principle",
    body: `Barbara Minto developed the Pyramid Principle while working with consultants who needed to write clearly for busy clients. Her core idea: put the main conclusion at the top, then support it with grouped arguments beneath. The Situation, Complication, Resolution sequence is the introduction that leads into that conclusion.

## The three parts

- **Situation.** The stable, agreed context. Something your reader already knows and accepts.
- **Complication.** What has changed, gone wrong or created tension. This is why the reader should care now.
- **Resolution.** Your answer or recommendation. This becomes the top of your pyramid, supported by your key arguments.

Minto also describes the implicit **question** the complication raises in the reader's mind. Your resolution should answer exactly that question.

## Example

**Situation:** Our planning team uses a spreadsheet built five years ago. **Complication:** The business has doubled, the file now crashes weekly and errors have reached two customer orders. **Resolution:** We should move to a dedicated planning tool this quarter, starting with a one-month pilot.

## Building the pyramid

1. Write your resolution as a single sentence.
2. Ask "why?" or "how?" and answer with three or fewer grouped points.
3. Support each point with evidence.
4. Check that every point answers the question above it.

## Why it works

Readers think top-down. Giving them the conclusion first lets them judge the evidence instead of hunting for the point. It also exposes weak logic early: if your supporting points don't answer "why?", the argument needs work.`,
  },
  {
    slug: "framework-bluf",
    title: "BLUF: bottom line up front",
    description: "Lead with the conclusion so busy readers know what matters before they stop reading.",
    type: "framework",
    category: "communication",
    difficulty: "beginner",
    estimatedMinutes: 3,
    source: "Military writing convention, widely adopted in business",
    body: `BLUF stands for "bottom line up front". It comes from military writing, where messages must be understood quickly and acted on correctly. In business, it solves a familiar problem: senior readers skim, and the point buried in paragraph four is never seen.

## The structure

1. **Bottom line.** The conclusion, decision or request in one or two sentences.
2. **Key context.** Only what the reader needs to trust or act on the bottom line.
3. **Details.** Supporting information for those who want it, or an attachment.

## Example

**Before:** "As you know, we've been working with the supplier on the new design. Last week there were some materials issues and after several calls it seems delivery will be late..."

**After:** "Bottom line: the launch slips one week due to a supplier delay. No budget impact. I need your approval to inform retail partners today."

## Tips

- Write the bottom line last, then move it to the top.
- If a decision is needed, say so in the first line.
- Use the subject line of an email as a mini-BLUF.
- Cut background that the reader already knows.

## When not to use it

When delivering difficult personal news, or when the reader needs context before they can hear the conclusion fairly, a gentler build-up may be kinder. For most updates, requests and recommendations, BLUF is simply more respectful of people's time.`,
  },
  {
    slug: "framework-star",
    title: "STAR: structure your interview answers",
    description: "Situation, Task, Action, Result: a reliable shape for behavioural interview questions.",
    type: "framework",
    category: "personal_branding",
    difficulty: "beginner",
    estimatedMinutes: 4,
    source: "Standard behavioural interviewing method",
    body: `Behavioural interview questions start with "Tell me about a time when..." The interviewer wants evidence of how you actually behave. STAR helps you give that evidence in a clear, complete story rather than a vague summary.

## The four parts

- **Situation.** Set the scene briefly. Where were you and what was going on?
- **Task.** What was your responsibility or goal?
- **Action.** What did *you* do? This is the heart of the answer and deserves the most time.
- **Result.** What happened, and what did you learn? Be specific about outcomes.

## Example

**Question:** "Tell me about a time you handled a difficult stakeholder."

**Situation:** A regional director was blocking a new reporting process. **Task:** I needed her agreement before rollout. **Action:** I met her one-to-one, asked what worried her, and learned her team feared extra workload. I adjusted the rollout to automate their part first. **Result:** She backed the change, and her region adopted it first.

## Tips

- Use "I", not "we". Interviewers need to know your contribution.
- Keep Situation and Task short; spend most of the time on Action.
- End with a result and, if possible, a reflection.
- Prepare five or six stories that can flex across many questions: leadership, conflict, failure, influence, pressure.

## Common mistakes

- Telling a story without a clear result
- Describing what the team did without your role
- Choosing a story with no real challenge in it

STAR is not a script. It is a checklist that makes sure your story contains everything the listener needs.`,
  },
  {
    slug: "framework-sbi-feedback",
    title: "SBI: feedback that lands",
    description: "Situation, Behaviour, Impact: a simple model for feedback that is specific and fair.",
    type: "framework",
    category: "leadership",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    source: "Center for Creative Leadership",
    body: `Feedback often fails because it is vague ("Great job!") or feels like a judgement of character ("You're not a team player"). The Situation, Behaviour, Impact model, developed by the Center for Creative Leadership, keeps feedback specific, observable and focused on effects.

## The three steps

1. **Situation.** Anchor the feedback in a specific time and place. "In yesterday's client call..."
2. **Behaviour.** Describe what the person did, as a camera would record it. "...you interrupted the client twice while she was explaining the budget..."
3. **Impact.** Explain the effect on you, the team or the outcome. "...and she seemed to stop sharing details after that."

Then open a conversation: "How did it look from your side?"

## Positive feedback works the same way

"In this morning's workshop, you summarised the three options on the whiteboard before we voted. It made the decision much faster and everyone felt heard." Specific praise tells people exactly what to repeat.

## Why it works

- Observable behaviour is hard to argue with; interpretations invite defensiveness.
- Impact explains why it matters without lecturing.
- Ending with a question turns feedback into dialogue.

## Common mistakes

- Sneaking judgement into the behaviour: "you were rude" is an interpretation, not a behaviour.
- Saving feedback for weeks, until the situation is hard to recall.
- Delivering it in front of others when it should be private.

Use SBI for small moments often, not just big conversations rarely. Frequent, specific feedback builds trust far faster than an annual review.`,
  },
  {
    slug: "framework-pre-mortem",
    title: "The pre-mortem: find failure before it finds you",
    description: "Imagine your project has failed, then work backwards to prevent it.",
    type: "framework",
    category: "business",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    source: "Gary Klein",
    body: `A post-mortem asks what went wrong after a project fails. A pre-mortem, an approach described by psychologist Gary Klein, asks the same question before you start, while there's still time to act on the answers.

## Why it works

In planning meetings, optimism and politeness push in one direction. People hesitate to raise doubts about a plan the group seems to like. A pre-mortem changes the frame: failure is assumed, so naming reasons for it becomes the task, not disloyalty.

## How to run one

1. **Set the scene.** Share the plan. Then say: "Imagine it's a year from now. This project has failed badly. What happened?"
2. **Write silently.** Give everyone a few minutes to list reasons independently, so the loudest voice doesn't set the agenda.
3. **Share one at a time.** Go round the room, one reason per person per round, until the lists are exhausted.
4. **Cluster and rank.** Group similar reasons and pick the few that are most likely or most damaging.
5. **Act.** For each top risk, agree a change to the plan, an early warning sign or an owner.

## Example prompts

- Which assumption are we most confident about that could be wrong?
- What would a competitor do to make this fail?
- Where are we depending on one person or one supplier?

## Tips

- Keep it to about forty-five minutes.
- Include people close to the work, not only decision-makers.
- Revisit the risk list at key milestones.

A pre-mortem won't make a project risk-free. It makes the risks visible while they are still cheap to address.`,
  },

  /* ───────────────────────── Templates ───────────────────────── */
  {
    slug: "template-meeting-agenda",
    title: "Meeting agenda that gets decisions",
    description: "A one-page agenda template that turns meetings into outcomes rather than discussions.",
    type: "template",
    category: "productivity",
    difficulty: "beginner",
    estimatedMinutes: 3,
    body: `Most meetings drift because nobody agreed what they were for. A good agenda answers that before anyone enters the room. Copy this template and send it at least a day in advance.

## Template

**Meeting:** [Name]
**Purpose:** By the end of this meeting we will have [decided / agreed / produced] [specific outcome].
**Attendees:** [Only people needed for the outcome]
**Pre-read:** [Link or "none"]

1. **[Topic 1]**: [Decision / Input / Update], [Owner], [Minutes]
2. **[Topic 2]**: [Decision / Input / Update], [Owner], [Minutes]
3. **[Topic 3]**: [Decision / Input / Update], [Owner], [Minutes]
4. **Actions and owners**: [Facilitator], 5 minutes

## How to use it

- **Write the purpose as an outcome.** "Discuss Q3" is a topic; "Agree the top three Q3 priorities" is an outcome.
- **Label each item.** Decision, input or update tells people how to prepare and how to behave in the room.
- **Put decisions first**, while energy is high.
- **Move updates to email** where possible. If nothing needs discussing, it doesn't need a meeting.
- **Protect the last five minutes** for actions: who does what, by when.

## After the meeting

Send a short note within a day: decisions made, actions with owners and dates, and open questions. Three lines is often enough.

If you can't write a clear purpose, consider whether the meeting is needed at all.`,
  },
  {
    slug: "template-one-line-intro",
    title: "Your one-line introduction",
    description: "Fill-in templates for answering \"What do you do?\" in a way people remember.",
    type: "template",
    category: "personal_branding",
    difficulty: "beginner",
    estimatedMinutes: 4,
    body: `"What do you do?" is asked at almost every event, and most people answer with a job title. A title signals rank, not value. These templates help you say what you actually do, in plain words, in one line.

## Three templates

1. **The helper:** "I help [who] [do what / fix what]."
   "I help small retailers stop running out of their best-selling products."
2. **The problem solver:** "You know when [familiar problem]? I [fix / prevent] that."
   "You know when two departments quote different numbers? I make sure they're the same number."
3. **The outcome:** "I make sure [group] can [result] without [pain]."
   "I make sure our engineers can ship updates without waiting days for approvals."

## Checklist

- Would someone from a completely different industry understand it?
- Does it mention a person or group you help?
- Does it name a problem or outcome, not just an activity?
- Is it short enough to say in one breath?
- Does it invite "How do you do that?"

## Adapting it

Prepare two or three versions with different emphasis: one for clients, one for peers in your field, one for social settings. The core stays the same; the example shifts toward what this listener cares about.

## Follow-through

When they ask a follow-up, have a short, specific example ready: one project, one result. Then turn the question back: "What about you?"

Test your line in real conversations. If nobody asks a follow-up question, rewrite it.`,
  },
  {
    slug: "template-follow-up-email",
    title: "Follow-up email after an event",
    description: "A short template for turning a good conversation into an ongoing connection.",
    type: "template",
    category: "networking",
    difficulty: "beginner",
    estimatedMinutes: 3,
    body: `The value of a networking conversation is mostly realised afterwards. A short, specific message sent soon after the event keeps the connection alive while the memory is still fresh for both of you.

## Template

**Subject:** Good to meet you at [event]

Hi [Name],

Good to meet you at [event]. I enjoyed our conversation about [specific topic they raised].

[Something useful: "Here's the article I mentioned on..." / "I'd be glad to introduce you to [person], who has dealt with..." / "You asked about X; here's what we found..."]

[Light next step: "If it's useful, I'd be happy to swap notes on a short call in the next few weeks." / "No need to reply; just thought it might help."]

Best,
[Your name]

## Why each part matters

- **The specific reference** helps them place you among everyone they met.
- **The useful item** gives before it asks, which makes a reply feel natural.
- **The light next step** is easy to accept and easy to decline without awkwardness.

## Tips

- Send it within a day or two.
- Keep it under about a hundred words.
- If you promised something during the conversation, deliver it here.
- Connect on a professional network with a short note that mirrors the email.

## What to avoid

- "Great to meet you, let's keep in touch!" with nothing else
- Attaching a brochure or pitch they didn't ask for
- Asking for a big favour in the first message`,
  },
  {
    slug: "template-decision-journal",
    title: "Decision journal",
    description: "Record important decisions as you make them, so you can learn from outcomes later.",
    type: "template",
    category: "critical_thinking",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    body: `Memory rewrites decisions. When things go well, we remember being confident; when they go badly, we remember having doubts. A decision journal captures your thinking at the moment you decide, so you can review it honestly later.

## Template

**Date:**
**Decision:** What am I deciding?
**Context:** What is the situation, and what pressure am I under?
**Options considered:** What alternatives did I seriously weigh?
**What I chose and why:** My reasoning in a few sentences.
**What I expect to happen:** Specific outcomes and a time frame.
**Confidence:** Low, medium or high.
**What would change my mind:** Signals that I was wrong.
**How I feel right now:** Tired, rushed, calm, excited?
**Review date:**

## How to use it

1. Use it only for decisions that matter: hires, strategy choices, big purchases, career moves.
2. Fill it in at the time of the decision, not afterwards.
3. Set a review date and keep it.
4. At review, compare what happened with what you expected.

## What to look for

- **Good decisions with bad outcomes.** Sometimes you reasoned well and got unlucky. Don't overcorrect.
- **Bad decisions with good outcomes.** Luck can hide weak reasoning. These are the ones to learn from.
- **Patterns.** Do you decide worse when tired or rushed? Do you consistently underestimate time?

## Why it works

Separating the quality of a decision from the quality of its outcome is one of the most useful habits in critical thinking. The journal makes that separation possible, because it preserves what you knew when you decided.`,
  },

  /* ───────────────────────── Cheat sheets ───────────────────────── */
  {
    slug: "cheat-sheet-hedge-words",
    title: "Hedge words to cut",
    description: "The words that quietly drain authority from your messages, and what to say instead.",
    type: "cheat_sheet",
    category: "confidence",
    difficulty: "beginner",
    estimatedMinutes: 3,
    body: `Hedges soften what you say. Used occasionally, they show openness. Used by habit, they make clear thinking sound uncertain and make requests easy to ignore. Scan your next important email for these.

## Minimisers

- **Just:** "I just wanted to check..." Cut it. "I'm checking..."
- **A bit / a little:** "It's a bit late." Say how late.
- **Only:** "It's only a small idea." Let the reader decide its size.

## Qualifiers

- **I think / I feel / I believe:** Often unnecessary before a recommendation. "I recommend..." is stronger.
- **Maybe / possibly / perhaps:** Use only when you are genuinely unsure, and say what you're unsure about.
- **Sort of / kind of:** Usually removable without losing meaning.

## Apologies

- **Sorry to bother you:** Replace with thanks or simply the request. "Thanks for looking at this."
- **Sorry if this is a stupid question:** Ask the question.
- **No worries if not!:** It invites "not". Give a clear deadline instead.

## Permission-seeking

- **Does that make sense?** Try "What questions do you have?"
- **If that's okay with everyone?** State the proposal and invite objections.

## Swaps that work

- "I was wondering if maybe..." becomes "Could you..."
- "I'm not an expert, but..." becomes your point, stated plainly
- "Hopefully this helps" becomes nothing at all

## A quick test

Read your message aloud as if you were the most respected person in your team. Would they say it that way? If not, cut the hedge.`,
  },
  {
    slug: "cheat-sheet-questions-that-open-people-up",
    title: "Questions that open people up",
    description: "Ready-to-use open questions for events, one-to-ones and first meetings.",
    type: "cheat_sheet",
    category: "social_intelligence",
    difficulty: "beginner",
    estimatedMinutes: 3,
    body: `Closed questions get one-word answers. Open questions invite stories, and stories are where connection happens. Keep a few of these in your pocket.

## At events

- What brought you here today?
- What's been the most useful thing you've heard so far?
- What are you hoping to take back to your team?

## About work

- What are you working on that you're most excited about?
- What's the hardest part of your role that people don't see?
- How did you end up doing what you do?
- What's changed most in your field in the last few years?

## Going deeper

- What made you decide that?
- How did that turn out?
- What would you do differently next time?
- What surprised you about it?

## In one-to-ones

- What's on your mind this week?
- Where could you use more support?
- What's one thing that would make your work easier?

## Follow-up starters

- "Tell me more about..."
- "What do you mean by...?"
- Repeat a key word they used, as a question: "Hectic?"

## Swaps

- "Did you enjoy the conference?" becomes "What was the best idea you heard?"
- "Is the project going well?" becomes "How is the project going so far?"
- "Do you like your job?" becomes "What do you enjoy most about your work?"

## Remember

The best question is usually the second one: a follow-up that shows you heard the first answer. Ask, listen and stay on the thread.`,
  },
  {
    slug: "cheat-sheet-graceful-exits",
    title: "Graceful exit lines",
    description: "Polite, honest ways to end a conversation at an event without awkwardness.",
    type: "cheat_sheet",
    category: "networking",
    difficulty: "beginner",
    estimatedMinutes: 2,
    body: `Knowing how to leave a conversation makes it easier to start one. A good exit is honest, warm and clear. It reflects something you valued, offers a next step and lets both people move on.

## The shape

1. Wait for a natural pause.
2. Signal the close.
3. Reflect one thing they said.
4. Offer a next step or swap details.
5. Use their name, thank them and go.

## Signal lines

- "I don't want to keep you all evening."
- "I promised myself I'd meet a few new people tonight."
- "I need to catch a colleague before they leave."
- "I'm going to grab some food before the next session."

## Reflection lines

- "I really liked your point about..."
- "I'll be thinking about what you said on..."
- "Good luck with the launch next month."

## Next-step lines

- "Shall we swap details? I'll send you that article."
- "Can I introduce you to someone here who works on the same problem?"
- "Let's continue this over a coffee in the next few weeks."

## Bridging exits

Introducing them to someone else is often the warmest exit of all: "Have you met Ana? She's dealing with exactly that. Ana, this is Daniel." You leave both people better off.

## What to avoid

- Drifting away mid-sentence
- Elaborate excuses or fake phone calls
- Promising to follow up when you don't intend to`,
  },
  {
    slug: "cheat-sheet-weekly-review",
    title: "The weekly review checklist",
    description: "A short weekly ritual to close loops, reset priorities and start Monday clear.",
    type: "cheat_sheet",
    category: "productivity",
    difficulty: "beginner",
    estimatedMinutes: 3,
    source: "Inspired by David Allen, Getting Things Done",
    body: `A weekly review is a short, regular appointment with yourself to catch what has slipped and decide what matters next. David Allen made it a central habit of his Getting Things Done method. This checklist is a lean version you can run in about thirty minutes.

## Clear

- Empty your inboxes: email, notes, messages, paper.
- Turn every loose item into a task, a calendar entry or the bin.
- Close browser tabs and files you no longer need.

## Look back

- Review last week's calendar. Any follow-ups you promised?
- What got done? What slipped, and why?
- Who helped you, and have you thanked them?

## Look ahead

- Review the next two weeks of your calendar. What needs preparation?
- Check your project list. Does each active project have a clear next action?
- Pick the three outcomes that would make next week a success.

## Reflect

- What drained energy this week, and can you remove or reduce it?
- What gave energy, and how can you get more of it?
- One thing to do differently next week.

## Tips

- Book it in your calendar at the same time every week. Friday afternoon or Monday morning both work.
- Keep it short enough that you'll actually do it.
- Write your three outcomes somewhere you'll see them daily.

The review turns a week of reacting into a week you have chosen. It is small, but over months it compounds.`,
  },

  /* ───────────────────────── Case studies ───────────────────────── */
  {
    slug: "case-study-failing-presentation",
    title: "Case study: rescuing a failing presentation",
    description: "How a manager turned a confusing 30-slide deck into a five-minute decision.",
    type: "case_study",
    category: "communication",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    body: `This is a fictional, composite case. Elena, an operations manager at a mid-sized distribution company, had ten minutes with the executive committee to request funding for a new warehouse system.

## The first attempt

Elena built thirty slides. She opened with the history of the current system, walked through process maps and vendor comparisons, and planned to reach her request on slide twenty-six. In rehearsal, her director stopped her on slide eight: "I still don't know what you want from us."

## What was going wrong

- **The point was buried.** The decision she needed appeared at the very end.
- **It was built for her, not her audience.** The detail reflected months of her work, not what executives needed to decide.
- **There was no story.** Facts were listed but not connected to a problem the committee cared about.

## The rebuild

Elena restructured around Situation, Complication, Resolution and opened with the bottom line:

1. **Opening:** "I'm asking for approval to replace our warehouse system this year. It will reduce order errors and let us handle peak season without extra temporary staff."
2. **Situation:** The current system has served the business for many years.
3. **Complication:** Volumes have grown, errors are reaching customers and peak season requires costly workarounds.
4. **Resolution:** A phased replacement, starting with one site.
5. **The ask, repeated**, with the cost and the first milestone.

She cut the deck to six slides and moved vendor details to an appendix.

## The outcome

She spent most of her slot answering questions, which showed the committee was engaged. They approved a pilot at one site.

## Lessons

- Lead with the decision you need.
- Design for your audience's question, not your effort.
- Move evidence to an appendix; bring it out when asked.
- Rehearse with someone who will interrupt you.`,
  },
  {
    slug: "case-study-new-manager-first-meeting",
    title: "Case study: a new manager's first team meeting",
    description: "How a first-time manager built trust by listening before changing anything.",
    type: "case_study",
    category: "leadership",
    difficulty: "beginner",
    estimatedMinutes: 5,
    body: `This is a fictional, composite case. David was promoted to lead the analytics team he had worked in for three years. Several former peers now reported to him, and one had also applied for the role.

## The temptation

David had a list of improvements he'd wanted for years. His instinct was to present them in his first team meeting to show he was ready to lead.

## What he did instead

He opened the meeting by naming the change directly: "This is a new situation for all of us, including me. I'd rather learn what's working before changing anything." Then he asked three questions and wrote the answers on a whiteboard:

1. What should we keep doing exactly as it is?
2. What frustrates you about how we work?
3. What do you need from me that you didn't get before?

Over the next two weeks he held a one-to-one with each person, including the colleague who had also applied. With her, he acknowledged the situation plainly and asked what she wanted to grow into.

## The first change

Several people had raised the same frustration: too many ad-hoc requests with unclear priority. David introduced a simple weekly intake and prioritisation slot. It came from the team's own words, so it was adopted quickly.

## Why it worked

- **Naming the awkwardness** reduced it. Nobody had to pretend things were unchanged.
- **Asking before telling** signalled respect and surfaced better ideas than his own list.
- **The first change was theirs**, which built credibility for later changes.

## Lessons

- In a new role, early listening is a strategy, not a delay.
- Address awkward dynamics directly and privately.
- Make your first visible change one the team asked for.`,
  },
  {
    slug: "case-study-introvert-networking",
    title: "Case study: networking as an introvert",
    description: "How a reserved engineer built a strong network without becoming someone else.",
    type: "case_study",
    category: "networking",
    difficulty: "beginner",
    estimatedMinutes: 5,
    body: `This is a fictional, composite case. Mei, a senior engineer, found large events exhausting. She usually stayed near colleagues and left early. When her company asked her to build partnerships with other firms, she needed a different approach that still suited her temperament.

## Reframing the goal

Instead of "work the room", Mei set a smaller target: two real conversations per event. Quality over volume suited her strengths: she listened well and asked thoughtful questions.

## Her approach

1. **Prepare lightly.** Before each event she checked the speaker list and picked one or two people whose work genuinely interested her.
2. **Use the quiet edges.** She approached people standing alone or arriving early, when the room was calmer.
3. **Lead with questions.** Her opener was usually about the content: "What did you make of the panel's point on testing?"
4. **Exit with a next step.** She offered to send something useful, such as a paper or a tool she used.
5. **Follow up the next day,** with a short, specific message.

## Beyond events

Mei found that her strongest connections grew from small, regular generosity: reviewing a contact's conference talk, introducing two people working on similar problems, sharing a useful link. None took long, and none came with an ask.

## The outcome

Within a year, several partners came through people she had met in those small conversations. Colleagues began asking her for introductions.

## Lessons

- Networking doesn't require being the loudest person in the room.
- A few deep conversations can beat many shallow ones.
- Follow-up and small favours do more than charisma.
- Design your approach around your energy, not against it.`,
  },

  /* ───────────────────────── Insights ───────────────────────── */
  {
    slug: "insight-psychological-safety",
    title: "Psychological safety: why good teams speak up",
    description: "Amy Edmondson's idea that teams learn faster when people feel safe to take interpersonal risks.",
    type: "insight",
    category: "leadership",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    source: "Amy Edmondson, Harvard Business School",
    body: `Amy Edmondson, a professor at Harvard Business School, describes psychological safety as a shared belief within a team that it is safe to take interpersonal risks: to ask a question, admit a mistake, raise a concern or offer an unfinished idea without fear of humiliation or punishment.

## A counterintuitive starting point

Edmondson's interest began with a puzzle in her early research on hospital teams: some of the teams that seemed to perform better were reporting more errors, not fewer. Her interpretation was that these teams were not making more mistakes; they were more willing to talk about them. That openness is what makes learning possible.

## What it is not

- It is **not** about being nice or avoiding conflict. Safe teams often disagree more openly.
- It is **not** about lowering standards. Edmondson argues that high standards and high safety together produce learning and performance.
- It is **not** permanent. It is built or eroded through everyday moments.

## What leaders can do

1. **Frame the work as learning.** Make clear that the task involves uncertainty and that everyone's input is needed.
2. **Admit your own fallibility.** "I might be missing something here" invites others to fill gaps.
3. **Ask real questions.** "What are we not seeing?" works better than "Any questions?"
4. **Respond productively.** When someone raises a problem, thank them first. How you react to bad news decides whether you hear it next time.

## Why it matters for you

Whether you lead a team or not, you shape safety in every meeting through how you respond to others' questions and mistakes. Small reactions accumulate into a culture.`,
  },
  {
    slug: "insight-forgetting-curve",
    title: "The forgetting curve",
    description: "Why most of what you learn fades quickly, and how spaced review keeps it.",
    type: "insight",
    category: "psychology",
    difficulty: "beginner",
    estimatedMinutes: 4,
    source: "Hermann Ebbinghaus, Memory (1885)",
    body: `In the 1880s, the German psychologist Hermann Ebbinghaus ran a long series of memory experiments on himself. He memorised lists of nonsense syllables and tested how much he retained over time. The pattern he found has become known as the forgetting curve.

## What he found

Forgetting is fastest soon after learning, then slows down. Without review, a large share of new material is lost within the first days. What survives that early drop tends to fade more gradually.

Ebbinghaus also found that relearning was faster than learning the first time, and that each review made the memory more durable. This is the foundation of what we now call **spaced repetition**.

## What it means in practice

- **Review early.** The first review matters most because it catches material just as it starts to slip.
- **Then space it out.** Each later review can come after a longer gap.
- **Test yourself rather than reread.** Trying to recall information strengthens memory more than passively looking at it again.
- **Make it meaningful.** Ebbinghaus deliberately used meaningless syllables. Real material that you connect to what you already know, or use in practice, is easier to keep.

## How this app uses it

Each lesson ends with a short knowledge check, and concepts come back in later reviews. The real-world mission matters too: applying an idea in your own life is one of the strongest ways to make it stick.

## A simple habit

After a meeting, training or book chapter, write three key points from memory. Look at them again the next day, then a week later. It takes minutes and changes how much you keep.`,
  },
  {
    slug: "insight-weak-ties",
    title: "The strength of weak ties",
    description: "Mark Granovetter's finding that acquaintances often matter more than close friends for new opportunities.",
    type: "insight",
    category: "networking",
    difficulty: "beginner",
    estimatedMinutes: 4,
    source: "Mark Granovetter, \"The Strength of Weak Ties\" (1973)",
    body: `In 1973, sociologist Mark Granovetter published a paper with a counterintuitive title: "The Strength of Weak Ties". Studying how people found jobs, he observed that useful information often came not from close friends but from acquaintances: former colleagues, people met occasionally, friends of friends.

## Why weak ties matter

Your close contacts tend to know the same people and hear the same news as you. Their information overlaps with yours. Acquaintances move in different circles, so they act as **bridges** to information, ideas and opportunities you would otherwise never hear about.

## What this means for your network

- **Don't neglect the edges.** The colleague you worked with five years ago or the person you met at a conference may be your most valuable link to something new.
- **Diversity beats size.** A network spread across different industries, functions and places brings more new information than a large network of similar people.
- **Weak ties need light maintenance.** They don't need constant contact, just occasional, genuine touchpoints.

## Keeping weak ties warm

1. Share an article or idea when it genuinely makes you think of someone.
2. Congratulate people on news, such as a new role or a launch.
3. Make introductions between people who could help each other.
4. Reconnect without an agenda, before you need anything.

## The takeaway

Strong ties give support; weak ties give reach. A healthy network has both. The small effort of keeping acquaintances warm is one of the highest-return habits in a career.`,
  },
  {
    slug: "insight-spotlight-effect",
    title: "The spotlight effect",
    description: "Why people notice your mistakes far less than you think, and how that frees you to act.",
    type: "insight",
    category: "confidence",
    difficulty: "beginner",
    estimatedMinutes: 3,
    source: "Thomas Gilovich, Victoria Medvec and Kenneth Savitsky (2000)",
    body: `Psychologists Thomas Gilovich, Victoria Medvec and Kenneth Savitsky described what they called the **spotlight effect**: the tendency to overestimate how much other people notice our appearance, actions and mistakes.

## The research

In a well-known study, students were asked to wear a T-shirt they found embarrassing into a room of peers. Afterwards, they were asked how many people had noticed it. They consistently guessed far more than actually had. We feel as if a spotlight follows us, but most people are busy thinking about themselves.

## Why it happens

We experience our own lives from the inside, with full awareness of every stumble and awkward moment. It's hard to adjust for the fact that others see only fragments, and usually while focused on their own concerns.

## How it holds you back

- Not speaking up in a meeting because a question might sound obvious
- Avoiding a conversation at an event because you fear an awkward opening
- Replaying a small mistake in a presentation for days

In each case, the imagined audience is far more attentive and critical than the real one.

## Using it

1. **Before acting,** remind yourself: people are mostly thinking about themselves.
2. **After a stumble,** ask: will anyone else remember this in a week?
3. **In social situations,** shift attention outward. Focusing on the other person lowers self-consciousness and makes you better company.

The spotlight is mostly in your own head. Knowing that makes it easier to ask the question, start the conversation or take the stage.`,
  },

  /* ───────────────────────── Videos ───────────────────────── */
  {
    slug: "video-treasure-how-to-speak",
    title: "How to speak so that people want to listen",
    description: "Julian Treasure on the habits that make people stop listening, and the vocal tools that draw them in.",
    type: "video",
    category: "communication",
    difficulty: "beginner",
    estimatedMinutes: 10,
    url: "https://www.ted.com/talks/julian_treasure_how_to_speak_so_that_people_want_to_listen",
    source: "Julian Treasure, TED",
    body: `Sound consultant Julian Treasure looks at speaking from the listener's side: why some voices hold our attention and others make us drift away.

## What the talk covers

Treasure begins with the habits that make people tune out. He groups them as a set of "deadly sins" of speaking, including gossip, judging, negativity, complaining, excuses, exaggeration and dogmatism, all of which erode trust or interest in what we say.

He then offers four foundations for speech that people want to hear, summarised in the acronym **HAIL**: honesty, authenticity, integrity and love (in the sense of wishing the listener well).

The second half moves to the voice itself. He describes a "toolbox" of vocal qualities you can use deliberately, including register, timbre, prosody (the melody of speech), pace, pitch and volume, and he notes the power of silence. He closes by demonstrating warm-up exercises to prepare the voice before an important talk.

## Why watch it

It's a practical reminder that how you speak is as much a skill as what you say, and that much of it can be trained.

## Try this after watching

1. Record yourself explaining a work topic for one minute.
2. Listen back for pace and variety. Is everything at the same speed and pitch?
3. Re-record, slowing down for your key point and adding a deliberate pause before it.

Notice which version you'd rather listen to.`,
  },
  {
    slug: "video-sinek-great-leaders",
    title: "How great leaders inspire action",
    description: "Simon Sinek's 'Golden Circle': why starting with purpose makes communication more compelling.",
    type: "video",
    category: "leadership",
    difficulty: "beginner",
    estimatedMinutes: 18,
    url: "https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action",
    source: "Simon Sinek, TED",
    body: `In this widely viewed talk, Simon Sinek introduces a simple model he calls the **Golden Circle**: three concentric rings labelled why, how and what.

## The core idea

Sinek argues that most organisations and people communicate from the outside in. They start with **what** they do, sometimes explain **how**, and rarely get to **why**. The leaders and organisations that inspire loyalty, in his view, do the reverse. They start with why they exist and what they believe, and let the how and what follow as proof.

He illustrates the idea with examples including Apple, the Wright brothers and Martin Luther King Jr., contrasting purpose-led messages with feature-led ones. He also connects the model to how people make decisions, suggesting that a sense of belief and belonging often drives choices that people later justify with facts.

## How to use it

Whether you're pitching a project, leading a team or introducing yourself, try opening with purpose:

1. **Why:** What problem do you care about, and why does it matter?
2. **How:** What is distinctive about your approach?
3. **What:** What exactly are you proposing or offering?

## A note of balance

The model is a communication lens, not a complete theory of leadership. A strong why still needs a credible how and what behind it.

## Try this after watching

Rewrite the opening of your next presentation or project update so that the first sentence explains why it matters, before any detail about what it is.`,
  },
  {
    slug: "video-brown-vulnerability",
    title: "The power of vulnerability",
    description: "Brené Brown's research on connection, shame and the courage to be seen.",
    type: "video",
    category: "psychology",
    difficulty: "beginner",
    estimatedMinutes: 20,
    url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability",
    source: "Brené Brown, TED",
    body: `Research professor Brené Brown studies connection, shame and courage. In this talk, she tells the story of how her research led her somewhere she didn't expect, and didn't initially welcome.

## The core idea

Brown set out to understand connection. Again and again, she found that what got in the way was shame: the fear that something about us makes us unworthy of connection.

She then looked at people who had a strong sense of worthiness and belonging, whom she calls "wholehearted". What they shared, she found, was a willingness to embrace vulnerability. They had the courage to be imperfect, showed compassion to themselves as well as others, and built connection by letting themselves be seen as they really were.

She also describes how people try to numb vulnerability, and argues that we cannot numb difficult emotions selectively: dulling fear and discomfort also dulls joy and connection.

## Why it matters at work

Vulnerability can sound out of place in a professional setting, but it shows up constantly: asking a question in front of senior people, admitting a mistake, sharing an unfinished idea, starting a conversation with a stranger. Each requires being seen without a guarantee of how it will land.

## Reflect after watching

1. Where at work are you holding back because you don't want to be seen as imperfect?
2. What small, vulnerable step could you take this week, such as asking for help or admitting you don't know?
3. How do you respond when others take that risk in front of you?`,
  },
];
