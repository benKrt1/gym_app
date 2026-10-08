import * as hmUI from "@zos/ui";
import { getDeviceInfo } from "@zos/device";

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo();

// Στρογγυλή οθόνη Active 2: 466x466, κέντρο (233,233).
// Οι τιμές παρακάτω είναι υπολογισμένες σε πραγματικά pixel (όχι px()),
// ώστε οι γωνίες των widgets να μην κόβονται από τον κύκλο.

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

// Χρώμα χρονομέτρου όταν δείχνει πάνω από το animation (λευκό φόντο εικόνων).
export const TIMER_COLOR_ON_ANIMATION = 0x000000;
export const TIMER_COLOR_DEFAULT = 0xffffff;
// Χρώμα χρονομέτρου στο διάλειμμα (45-60 sec), υπερισχύει των παραπάνω.
export const TIMER_COLOR_REST = 0xffa500;

// Background animation (εναλλαγή στατικών εικόνων), fullscreen πίσω
// από το χρονόμετρο. Τα ίδια τα PNG frames είναι ήδη 466x466
// (κεντραρισμένα με λευκό padding), άρα δεν χρειάζεται scaling εδώ.
export const ANIMATION_STYLE = {
  x: 0,
  y: 0,
  w: DEVICE_WIDTH,
  h: DEVICE_HEIGHT,
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
