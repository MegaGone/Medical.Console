export interface IFuseNavigationItem {
  id?: string;
  title?: string;
  subtitle?: string;
  type: "aside" | "basic" | "collapsable" | "divider" | "group" | "spacer";
  hidden?: (item: IFuseNavigationItem) => boolean;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  link?: string;
  externalLink?: boolean;
  target?: "_blank" | "_self" | "_parent" | "_top" | string;
  exactMatch?: boolean;
  isActiveMatchOptions?: any;
  function?: (item: IFuseNavigationItem) => void;
  classes?: {
    title?: string;
    subtitle?: string;
    icon?: string;
    wrapper?: string;
  };
  icon?: string;
  badge?: {
    title?: string;
    classes?: string;
  };
  children?: IFuseNavigationItem[];
  meta?: any;
}
