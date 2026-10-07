import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
import {
  TIMER_STYLE,
  NEXT_EXERCISE_STYLE,
  BACK_BUTTON_STYLE,
  FORWARD_BUTTON_STYLE,
} from "zosLoader:./index.page.[pf].layout.js";

const logger = Logger.getLogger("gym-app");

// Προσωρινή, σταθερή λίστα ασκήσεων. Θα αντικατασταθεί αργότερα
// (βήμα 5) από λίστα που επεξεργάζεσαι μέσω iPhone.
const EXERCISES = [
  "Squats",
  "Push-ups",
  "Lunges",
  "Plank",
  "Burpees",
  "Jumping Jacks",
];

const EXERCISE_DURATION_SEC = 60; // 45 sec άσκηση + 15 sec διάλειμμα
const TIMER_TICK_MS = 30;

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
  },
  onInit() {
    logger.debug("page onInit invoked");
  },
  build() {
    logger.debug("page build invoked");

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

    this.startTimer();
  },
  getNextExerciseLabel() {
    const nextIndex = (this.state.currentIndex + 1) % EXERCISES.length;
    return `Next: ${EXERCISES[nextIndex]}`;
  },
  startTimer() {
    this.state.startTime = Date.now();
    this.state.timerWidget.text = formatTime(0);

    this.state.timerId = setInterval(() => {
      const elapsedSec = (Date.now() - this.state.startTime) / 1000;

      if (elapsedSec >= EXERCISE_DURATION_SEC) {
        this.state.timerWidget.text = formatTime(EXERCISE_DURATION_SEC);
        clearInterval(this.state.timerId);
        this.state.timerId = null;
        return;
      }

      this.state.timerWidget.text = formatTime(elapsedSec);
    }, TIMER_TICK_MS);
  },
  stopTimer() {
    if (this.state.timerId !== null) {
      clearInterval(this.state.timerId);
      this.state.timerId = null;
    }
  },
  changeExercise(direction) {
    const total = EXERCISES.length;
    this.state.currentIndex =
      (this.state.currentIndex + direction + total) % total;
    this.state.nextTextWidget.text = this.getNextExerciseLabel();

    this.stopTimer();
    this.startTimer();
  },
  onDestroy() {
    logger.debug("page onDestroy invoked");
    this.stopTimer();
  },
});
