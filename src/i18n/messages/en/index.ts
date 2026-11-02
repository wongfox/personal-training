/* English messages: the source of truth for keys. Each namespace lives in its own file. */
import { common } from "./common";
import { nav, taxonomy } from "./nav";
import { home } from "./home";
import { landing } from "./landing";
import { auth } from "./auth";
import { onboarding } from "./onboarding";
import { plan } from "./plan";
import { journey } from "./journey";
import { lesson } from "./lesson";
import { exercises } from "./exercises";
import { mission } from "./mission";
import { review } from "./review";
import { checkpoint } from "./checkpoint";
import { practice } from "./practice";
import { explore } from "./explore";
import { profile } from "./profile";
import { settings } from "./settings";
import { coach } from "./coach";
import { admin } from "./admin";
import { errors } from "./errors";

export const en = {
  common,
  nav,
  taxonomy,
  home,
  landing,
  auth,
  onboarding,
  plan,
  journey,
  lesson,
  exercises,
  mission,
  review,
  checkpoint,
  practice,
  explore,
  profile,
  settings,
  coach,
  admin,
  errors,
};

/** Same shape as English, with every leaf widened to string — Spanish must cover exactly these keys. */
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Messages = Widen<typeof en>;
