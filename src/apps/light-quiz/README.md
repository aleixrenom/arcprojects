# Vocabulary Quiz

A simple, mobile-focused vocabulary quiz web application where users translate Finnish words to English by selecting from 4 multiple-choice options.

## Features

- **Learning first**: Incorrect answers are not discarded. Failed words are moved deeper into the quiz so users get another chance later.
- **Adaptive flow**: Correct answers remove the word from the queue, while incorrect answers reappear after 10 words or at the end if fewer than 10 remain.
- **Progress persistence**: Quiz progress is stored in localStorage so users can resume from the same word queue.
- **Satisfying UX**: Smooth animations, clear feedback, and sound effects for correct/incorrect answers.
- **Minimal Design**: Clean centered layout, compact `XX / YY` progress display, and a small circular reset icon in the top-right corner.
- **Completion screen**: The final screen congratulates the user for finishing the quiz and offers a restart option instead of a score.

## Requirements

- **Animations**: Uses Framer Motion for slide transitions, button hover/tap effects, and feedback animations.
- **Sounds**: Uses Howler.js for audio playback. Requires audio files in `public/sounds/`:
  - `correct.mp3`: Played on correct answers.
  - `incorrect.mp3`: Played on incorrect answers.
- **Accessibility**: High contrast, keyboard navigation, and optional sound toggle (not yet implemented).
- **Mobile-First**: Responsive design optimized for mobile devices.

## Setup

1. Ensure dependencies are installed: `npm install framer-motion howler @types/howler`.
2. Add audio files to `public/sounds/correct.mp3` and `public/sounds/incorrect.mp3`.
3. Access the quiz at `/quiz` in the browser.

## Data

Quiz data is stored in `vocabData.json` as an array of objects with `word`, `correct`, and `options`.
