import activity from "@/assets/icons/activity.png";
import add from "@/assets/icons/add.png";
import adobe from "@/assets/icons/adobe.png";
import back from "@/assets/icons/back.png";
import canva from "@/assets/icons/canva.png";
import claude from "@/assets/icons/claude.png";
import dropbox from "@/assets/icons/dropbox.png";
import feed from "@/assets/icons/feed.png";
import figma from "@/assets/icons/figma.png";
import friends from "@/assets/icons/friends.png";
import github from "@/assets/icons/github.png";
import home from "@/assets/icons/home.png";
import map from "@/assets/icons/map.png";
import medium from "@/assets/icons/medium.png";
import menu from "@/assets/icons/menu.png";
import notion from "@/assets/icons/notion.png";
import openai from "@/assets/icons/openai.png";
import photoCamera from "@/assets/icons/photo-camera.png";
import plus from "@/assets/icons/plus.png";
import routes from "@/assets/icons/routes.png";
import setting from "@/assets/icons/setting.png";
import settingsBlack from "@/assets/icons/settings-black.png";
import settings from "@/assets/icons/settings.png";
import spotify from "@/assets/icons/spotify.png";
import user from "@/assets/icons/user.png";
import wallet from "@/assets/icons/wallet.png";

export const icons = {
  home,
  wallet,
  setting,
  activity,
  add,
  back,
  menu,
  plus,
  notion,
  dropbox,
  openai,
  adobe,
  medium,
  figma,
  spotify,
  github,
  claude,
  canva,
  user,
  friends,
  map,
  feed,
  routes,
  settings,
  settingsBlack,
  photoCamera,
} as const;

export type IconKey = keyof typeof icons;
