/**
 * Error messages returned by the server (API routes, server actions,
 * services). Keys are stable codes; services throw with the key and the
 * boundary translates it into the request's language.
 */
export const errors = {
  generic: "Something went wrong on our side.",
  invalidRequest: "Invalid request.",
  invalidJson: "Invalid JSON.",
  invalidResponse: "Invalid response.",
  tooLarge: "Request too large.",
  crossOrigin: "Cross-origin request blocked.",
  signIn: "Sign in to continue.",
  signInFirst: "Sign in first.",
  finishOnboarding: "Finish onboarding first.",
  notFound: "Not found.",
  forbidden: "You don't have access to this.",
  unauthorized: "Unauthorized",
  rateLimited: "Too many requests. Slow down a little.",
  tooManyAttempts: "Too many attempts. Try again later.",
  coachRateLimited: "You've sent a lot of messages this hour. Take a breath and come back shortly.",
  noActivePlan: "No active plan.",
  unknownCheckpoint: "Unknown checkpoint.",
  invalidAnswers: "Invalid answers.",
  someAnswersMissing: "Some answers are missing.",

  // Content
  lessonNotFound: "Lesson not found.",
  lessonNotOpen: "This lesson isn't open yet.",
  exerciseNotFound: "Exercise not found.",
  quizNotFound: "Quiz not found.",
  questionNotFound: "Question not found.",
  missionNotFound: "Mission not found.",
  reviewNotFound: "Review not found.",
  journeyNotFound: "Journey not found.",
  conversationNotFound: "Conversation not found.",
  scenarioNotFound: "Scenario not found.",

  // The daily loop
  pickOption: "Pick one of the options.",
  answerEveryQuestion: "Answer every question.",
  finishExerciseFirst: "Finish the exercise first.",
  finishQuizFirst: "Finish the knowledge check first.",
  missionAlreadyComplete: "This mission is already complete.",
  tellUsHowItWent: "Tell us how it went.",
  writeOneAnswer: "Write at least one answer.",
  conceptNotDue: "This concept isn't due yet.",
  weeklyReviewNotOpen: "Your next weekly review isn't open yet.",
  checkpointNotOpen: "Your day-{day} checkpoint isn't open yet.",
  ratingsRange: "Ratings go from 1 to 5.",

  // Exercise responses
  arrangeEveryItem: "Arrange every item.",
  scoreEveryOption: "Score every option against every criterion.",
  replyAtLeastOnce: "Reply at least once.",
  writeVersionFirst: "Write your version first.",
  writeOpeningFirst: "Write your opening first.",

  // Account
  accountNotFound: "Account not found.",
  wrongCurrentPassword: "Your current password is incorrect.",
  onlySuperAdmin: "You're the only super admin. Grant the role to someone else first.",

  // Form validation
  validation: {
    email: "Enter a valid email address.",
    passwordMin: "Use at least 10 characters.",
    passwordMax: "Use at most 128 characters.",
    name: "Tell us your name.",
    passwordRequired: "Enter your password.",
    message: "Write a message.",
    pickGoal: "Pick at least one goal.",
    pickSituation: "Pick at least one situation.",
    pickDuration: "Pick a duration.",
    ninetyDayGoal: "Write a sentence about your goal.",
    primaryGoal: "Your main goal must be one you picked.",
    // Generic fallbacks for built-in validation messages
    required: "This field is required.",
    tooShort: "This is too short.",
    tooLong: "This is too long.",
    tooSmall: "This value is too small.",
    tooBig: "This value is too big.",
    invalidFormat: "This doesn't look right.",
    invalidOption: "Pick one of the options.",
    invalidType: "This value isn't valid.",
  },
};
