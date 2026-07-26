# README.md (light-quiz)

## What this file is

The quiz app's own human-written readme — part feature list, part original spec. It's documentation *inside* the source tree, written for developers browsing the folder, and it predates some later changes, so it's best read as "what this app set out to be" with a few details now out of date.

## Where it fits

- Lives in `src/apps/light-quiz/` next to the code it describes; no code imports it (it's not a module, just a document).
- Describes behavior implemented in [[VocabularyQuiz.tsx]] and [[quizUtils.ts]], animation/sound libraries listed in [[package.json]], and sound files from [[public]].

## Walkthrough

**Features section — accurate and a good summary.** The list matches the code well and is worth reading as a plain-English preview of [[VocabularyQuiz.tsx]]: learning-first re-queuing (wrong answers return after 10 words), progress persistence in localStorage, sounds and animations, the compact `XX / YY` progress display, and a completion screen that deliberately offers no score (see [[ResultScreen.tsx]] for why that's coherent).

**Requirements section — mostly accurate.** Framer Motion and Howler are indeed the libraries used ([[CONCEPTS#Framer Motion]]; both installed via [[CONCEPTS#npm and packages]]), and the two mp3 files live in `public/sounds/` ([[public]]). One honest self-disclosure: the "optional sound toggle" is marked *not yet implemented* — and still isn't.

**Where it has drifted.** Three details no longer match the code — a normal fate for in-repo readmes, and a useful exercise in trusting code over docs:

- *"Access the quiz at `/quiz`"* — the real address is `#/app/finnish-quiz`, since the quiz is mounted through the portfolio's router ([[router.tsx]] → [[DetailPage.tsx]]).
- *"Quiz data is stored in `vocabData.json`"* — the single data file has since become the multi-set `wordSets/` folder ([[quizUtils.ts]] lists them, e.g. [[finnish-1000.json]]).
- The description says users *"translate Finnish words"* — true of the original, but the app now also offers Catalan vocabulary and English grammar sets ([[WordSetPicker.tsx]]).

## Concepts used

[[CONCEPTS#npm and packages]], [[CONCEPTS#localStorage]], [[CONCEPTS#Framer Motion]]
