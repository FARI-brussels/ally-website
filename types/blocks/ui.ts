import type { LocalizedBlock } from "~/types/blocks/base";
import type { LocaleMap } from "~/types/shared";

export interface BlockCategory {
  slug: string;
  title?: LocaleMap;
  description?: LocaleMap;
}

export type BlockCardProps = Omit<LocalizedBlock, "ranking"> & {
  url?: string;
  image?: string;
};
