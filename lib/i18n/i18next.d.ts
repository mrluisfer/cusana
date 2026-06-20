import "i18next";
import type { defaultNS, TranslationResource } from "./resources";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      translation: TranslationResource;
    };
  }
}
