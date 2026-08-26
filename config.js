// Birthday SURPRISE CONFIGURATION
// Customize this file to change the messages, choice questions, and photos without modifying the application code.

window.birthdayConfig = {
  // Name of the birthday person
  name: "Sarah",

  // Audio music source path (relative or absolute)
  // If no file exists, the app will hide the audio controller gracefully
  musicSrc: "audio/birthday.mp3",

  // Screen 1: Loading Screen Configuration
  loadingTitle: "Initializing Birthday.exe...",
  loadingButtonText: "Found 1 Special Person 🎉",

  // Screen 2: Envelope Card Message (the "for you" envelope flap screen)
  envelopeMessage: [
    "Hey Asha...",
    "You know... I normally don't write emotional things like this...",
    "But today is too special to let it pass by...",
    "Because an amazing partner like you doesn't come around twice."
  ],

  // Screen 3: Message Card Configuration
  messageCardText: "Your smile is easily my favorite part of the day. Thanks for bringing so much brightness and warmth into the world.",

  // Screen 4: Choice Screen Configuration
  choiceQuestion: "Are we celebrating today?",
  choiceButtons: {
    left: "100%",
    right: "ABSOLUTELY"
  },

  // Screen 5: Music Player Screen Configuration
  musicTitle: "Us ❤️",
  musicSubtitle: "Birthday Vibe",
  musicQuote: "You are not just a year older... You are a year wiser, happier, and more wonderful. 🌸",

  // Screen 6: Final Surprise Proposal Screen Configuration
  proposalQuestion: "Are you ready for the final surprise?",
  proposalButtons: {
    yes: "💖 YES!",
    no: "🙈 Maybe NO" // This button runs away when they try to click it!
  },

  // Screen 7: Celebration Page text
  celebrationTitle: "Yayyyyyyyyy 🎉",
  celebrationMessages: [
    "Happy birthday my love...",
    "It's time to start celebrating!",
    "I Wish...",
    "Happiest birthday ever, many many happy returs of the day",
    "That this year brings you all the laughter, success, and beautiful moments you deserve."
  ],
  celebrationButtonText: "Celebrate! 🥳"
};
