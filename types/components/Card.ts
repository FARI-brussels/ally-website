import type { Locale } from "~/types/shared";
import type { Block, LocalizedBlock } from "~/types/blocks/base";

export interface CardProps
  extends Partial<
    Pick<
      LocalizedBlock,
      "id" | "title" | "description" | "benefits" | "category"
    >
  > {
  categories?: string[];
  url?: string | number;
  color?: "primary" | "secondary";
  image?: string;
  locale?: Locale;
  slug?: string;
}

export interface RequirementCardProps
  extends Pick<
    Block,
    "time" | "cost" | "effort" | "maintenance" | "involvement"
  > {
  locale: Locale;
}

export type LargeCardProps = CardProps | RequirementCardProps;
