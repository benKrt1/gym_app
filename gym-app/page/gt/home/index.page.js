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

Page({
  state: {
    currentIndex: 0,
    elapsedSec: 0,
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
      text: "0",
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
    this.state.elapsedSec = 0;
    this.state.timerWidget.text = String(this.state.elapsedSec);

    this.state.timerId = setInterval(() => {
      this.state.elapsedSec += 1;
      this.state.timerWidget.text = String(this.state.elapsedSec);

      if (this.state.elapsedSec >= EXERCISE_DURATION_SEC) {
        clearInterval(this.state.timerId);
        this.state.timerId = null;
      }
    }, 1000);
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
