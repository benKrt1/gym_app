import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
import {
  CURRENT_EXERCISE_STYLE,
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

Page({
  state: {
    currentIndex: 0,
    currentTextWidget: null,
    nextTextWidget: null,
  },
  onInit() {
    logger.debug("page onInit invoked");
  },
  build() {
    logger.debug("page build invoked");

    this.state.currentTextWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      ...CURRENT_EXERCISE_STYLE,
      text: EXERCISES[this.state.currentIndex],
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
  },
  getNextExerciseLabel() {
    const nextIndex = (this.state.currentIndex + 1) % EXERCISES.length;
    return `Next: ${EXERCISES[nextIndex]}`;
  },
  changeExercise(direction) {
    const total = EXERCISES.length;
    this.state.currentIndex =
      (this.state.currentIndex + direction + total) % total;
    this.state.currentTextWidget.text = EXERCISES[this.state.currentIndex];
    this.state.nextTextWidget.text = this.getNextExerciseLabel();
  },
  onDestroy() {
    logger.debug("page onDestroy invoked");
  },
});
