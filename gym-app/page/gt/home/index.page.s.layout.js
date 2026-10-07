import * as hmUI from "@zos/ui";
import { getDeviceInfo } from "@zos/device";

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo();

// Τετράγωνη οθόνη: ίδια διάταξη με το round layout.
// Δεν υπάρχει κίνδυνος να κοπούν γωνίες, οπότε τα ίδια νούμερα δουλεύουν.

export const TIMER_STYLE = {
  x: 43,
  y: 100,
  w: 380,
  h: 100,
  color: 0xffffff,
  text_size: 72,
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
};

export const BACK_BUTTON_STYLE = {
  x: 28,
  y: 250,
  w: 100,
  h: 80,
  radius: 16,
  normal_color: 0x333333,
  press_color: 0x555555,
  text_size: 28,
};

export const FORWARD_BUTTON_STYLE = {
  x: 338,
  y: 250,
  w: 100,
  h: 80,
  radius: 16,
  normal_color: 0x333333,
  press_color: 0x555555,
  text_size: 28,
};

export const NEXT_EXERCISE_STYLE = {
  x: 163,
  y: 260,
  w: 140,
  h: 60,
  color: 0xaaaaaa,
  text_size: 20,
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.WRAP,
};
