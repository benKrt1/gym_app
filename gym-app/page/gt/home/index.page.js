import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
import {
  Vibrator,
  VIBRATOR_SCENE_SHORT_STRONG,
  VIBRATOR_SCENE_DURATION,
} from "@zos/sensor";
import {
  TIMER_STYLE,
  TIMER_COLOR_DEFAULT,
  TIMER_COLOR_ON_ANIMATION,
  TIMER_COLOR_REST,
  ANIMATION_STYLE,
  NEXT_EXERCISE_STYLE,
  NEXT_EXERCISE_COLOR_ON_ANIMATION,
  NEXT_EXERCISE_COLOR_DEFAULT,
  BACK_BUTTON_STYLE,
  FORWARD_BUTTON_STYLE,
} from "zosLoader:./index.page.[pf].layout.js";

const logger = Logger.getLogger("gym-app");

// Προσωρινή, σταθερή λίστα ασκήσεων. Θα αντικατασταθεί αργότερα
// (βήμα 5) από λίστα που επεξεργάζεσαι μέσω iPhone.
const EXERCISES = [
  "High Knee Taps",
  "Russian Twists",
  "Leg Raises",
  "Hip Raises",
  "Flutter Kicks",
  "Plank Knee To Elbow",
  "Chair Sit Ups",
  "Seated In & Out",
  "Jumping Jacks",
];

const EXERCISE_DURATION_SEC = 60; // 45 sec άσκηση + 15 sec διάλειμμα
const EXERCISE_PHASE_SEC = 45; // μετά από αυτό ξεκινά το διάλειμμα
const TIMER_TICK_MS = 30;
const BLINK_START_SEC = 55; // τελευταία 5 sec: αναβοσβήνει το χρονόμετρο
const BLINK_INTERVAL_MS = 250;

// Background animation: ανά άσκηση λίστα από frames. Ασκήσεις που δεν
// έχουν ακόμα έτοιμα frames λείπουν από το map και απλά δεν παίζουν animation.
const EXERCISE_ANIMATIONS = {
  "High Knee Taps": [
    "image/highknees_0.png",
    "image/highknees_1.png",
    "image/highknees_2.png",
  ],
  "Russian Twists": [
    "image/russiantwists_0.png",
    "image/russiantwists_1.png",
    "image/russiantwists_2.png",
    "image/russiantwists_3.png",
    "image/russiantwists_4.png",
  ],
  "Flutter Kicks": [
    "image/flutterkicks_0.png",
    "image/flutterkicks_1.png",
    "image/flutterkicks_2.png",
    "image/flutterkicks_3.png",
    "image/flutterkicks_4.png",
  ],
};
const ANIMATION_FRAME_INTERVAL_MS = 500;
// "Κενό" frame (μαύρο, ίδιο με το φόντο) όταν δεν τρέχει animation.
// Χρησιμοποιούμε εναλλαγή src αντί για VISIBLE/alpha, που αποδείχτηκαν
// αναξιόπιστα μέσω setProperty σε αυτό το SDK.
const BLANK_FRAME = "image/blank.png";

function formatTime(totalSec) {
  const whole = Math.floor(totalSec);
  const centis = Math.floor((totalSec - whole) * 100);
  return `${whole}.${String(centis).padStart(2, "0")}`;
}

Page({
  state: {
    currentIndex: 0,
    startTime: 0,
    timerId: null,
    timerWidget: null,
    nextTextWidget: null,
    animationWidget: null,
    animationTimerId: null,
    animationFrameIndex: 0,
    timerBaseColor: TIMER_COLOR_DEFAULT,
    vibrator: null,
    vibratedPhaseChange: false,
    vibratedEnd: false,
  },
  onInit() {
    logger.debug("page onInit invoked");
  },
  build() {
    logger.debug("page build invoked");

    this.state.vibrator = new Vibrator();

    // Δημιουργείται πρώτο ώστε να μένει ΠΙΣΩ από το χρονόμετρο (z-order = σειρά δημιουργίας).
    this.state.animationWidget = hmUI.createWidget(hmUI.widget.IMG, {
      ...ANIMATION_STYLE,
      src: BLANK_FRAME,
    });

    this.state.timerWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      ...TIMER_STYLE,
      text: "0.00",
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BACK_BUTTON_STYLE,
      text: "<",
      click_func: () => this.changeExercise(-1),
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...FORWARD_BUTTON_STYLE,
      text: ">",
      click_func: () => this.changeExercise(1),
    });

    this.state.nextTextWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      ...NEXT_EXERCISE_STYLE,
      text: this.getNextExerciseLabel(),
    });

    this.updateAnimationForExercise();
    this.startTimer();
  },
  getNextExerciseLabel() {
    const nextIndex = (this.state.currentIndex + 1) % EXERCISES.length;
    return `Next: ${EXERCISES[nextIndex]}`;
  },
  startTimer() {
    this.state.startTime = Date.now();
    this.state.timerWidget.text = formatTime(0);
    this.state.vibratedPhaseChange = false;
    this.state.vibratedEnd = false;

    this.state.timerId = setInterval(() => {
      const elapsedSec = (Date.now() - this.state.startTime) / 1000;

      if (elapsedSec >= EXERCISE_DURATION_SEC) {
        this.state.timerWidget.text = formatTime(EXERCISE_DURATION_SEC);
        if (!this.state.vibratedEnd) {
          this.state.vibratedEnd = true;
          this.state.vibrator.start({ mode: VIBRATOR_SCENE_DURATION });
        }
        clearInterval(this.state.timerId);
        this.state.timerId = null;
        return;
      }

      this.state.timerWidget.text = formatTime(elapsedSec);

      const inRestPhase = elapsedSec >= EXERCISE_PHASE_SEC;
      this.state.timerWidget.color = inRestPhase
        ? TIMER_COLOR_REST
        : this.state.timerBaseColor;

      if (inRestPhase && !this.state.vibratedPhaseChange) {
        this.state.vibratedPhaseChange = true;
        this.state.vibrator.start({ mode: VIBRATOR_SCENE_SHORT_STRONG });
      }

      if (elapsedSec >= BLINK_START_SEC) {
        const blinkOn = Math.floor(Date.now() / BLINK_INTERVAL_MS) % 2 === 0;
        this.state.timerWidget.text = blinkOn ? formatTime(elapsedSec) : "";
      }
    }, TIMER_TICK_MS);
  },
  stopTimer() {
    if (this.state.timerId !== null) {
      clearInterval(this.state.timerId);
      this.state.timerId = null;
    }
  },
  updateAnimationForExercise() {
    const frames = EXERCISE_ANIMATIONS[EXERCISES[this.state.currentIndex]];

    this.stopAnimation();

    if (frames) {
      this.state.timerBaseColor = TIMER_COLOR_ON_ANIMATION;
      this.state.nextTextWidget.color = NEXT_EXERCISE_COLOR_ON_ANIMATION;
      this.startAnimation(frames);
    } else {
      this.state.timerBaseColor = TIMER_COLOR_DEFAULT;
      this.state.nextTextWidget.color = NEXT_EXERCISE_COLOR_DEFAULT;
      this.state.animationWidget.setProperty(hmUI.prop.MORE, {
        src: BLANK_FRAME,
      });
    }

    this.state.timerWidget.color = this.state.timerBaseColor;
  },
  startAnimation(frames) {
    this.state.animationFrameIndex = 0;
    this.state.animationWidget.setProperty(hmUI.prop.MORE, {
      src: frames[0],
    });
    this.state.animationTimerId = setInterval(() => {
      this.state.animationFrameIndex =
        (this.state.animationFrameIndex + 1) % frames.length;
      this.state.animationWidget.setProperty(hmUI.prop.MORE, {
        src: frames[this.state.animationFrameIndex],
      });
    }, ANIMATION_FRAME_INTERVAL_MS);
  },
  stopAnimation() {
    if (this.state.animationTimerId !== null) {
      clearInterval(this.state.animationTimerId);
      this.state.animationTimerId = null;
    }
  },
  changeExercise(direction) {
    const total = EXERCISES.length;
    this.state.currentIndex =
      (this.state.currentIndex + direction + total) % total;
    this.state.nextTextWidget.text = this.getNextExerciseLabel();

    this.updateAnimationForExercise();
    this.stopTimer();
    this.startTimer();
  },
  onDestroy() {
    logger.debug("page onDestroy invoked");
    this.stopTimer();
    this.stopAnimation();
  },
});
