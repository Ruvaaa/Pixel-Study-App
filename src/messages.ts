// src/messages.ts
//
// Messages shown on the study page, one at a time, rotating while you study.
// Add, remove or rewrite anything here. {name} becomes USER_NAME from App.tsx.

// How often the message changes (milliseconds).
export const MESSAGE_INTERVAL_MS = 20000;

// Shown while the timer is running.
export const studyMessages: string[] = [
  "Get that 4.0 GPA.",
  "You can do this, {name}.",
  "Future valedictorian, right here.",
  "You're tired. Me too. Keep going.",
  "That 4.0 isn't going to earn itself.",
  "Your future self is already thanking you.",
  "Procrastination called. Let it go to voicemail.",
  "Sleep is for people with extensions.",
  "Deadlines: motivation in aggressive disguise.",
  "Hydrate. Your brain is 75% water, 25% panic.",
  "Focus. The group chat will survive without you.",
  "Phone face down, right? Right?",
  "Tiny progress is still progress.",
  "Imagine how smug you'll feel after this.",
  "Coffee: loaded. Brain: loading.",
  "Study now, flex later.",
  "Genius is mostly showing up and not opening TikTok.",
  "Somewhere a professor is rooting for you. Quietly.",
  "This is the hard part. Hard parts end.",
  "Think of the graduation photos.",
  "Trust the process. Ignore the panic.",
  "Ruin the curve, {name}.",
  "Do it for the Dean's List.",
  "Sit up straight. Posture counts toward the GPA.",
  "Ctrl+S your progress. Ctrl+Z the doomscrolling.",
  "Your future degree says hi.",
  "Believe in yourself. Also in the syllabus.",
  "Every expert once stared confused at a desk like this.",
  "Look at you, being responsible and everything.",
  "Watching the timer won't speed it up. I checked.",
  "Less 'I'll start tomorrow', more 'I started'.",
  "You're doing better than you think. Probably.",
  "Brain tired? Brain still works. Use it.",
  "One more page. You've said that before, but this time it's true.",
  "Be the person your group project needed.",
  "Dr. {name} has a nice ring to it.",
];

// Shown while the session is paused.
export const pausedMessages: string[] = [
  "Break time. A break, not a 3-hour scroll.",
  "Stretch. Sip water. Avoid the group chat.",
  "Rest is productive too. Allegedly. Come back soon.",
  "Five minutes. The books will wait. Menacingly.",
  "Go stare out a window like a Victorian child.",
  "You earned this. Now un-earn it quickly.",
  "Snack acquired? Good. Back in a minute.",
  "Hydrate, {name}. Then return to greatness.",
];