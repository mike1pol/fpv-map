import { MapItemsFilter } from "./Map";

type ChangerFilter = {
  filter: MapItemsFilter;
  filters: MapItemsFilter[];
  onChanged(filters: MapItemsFilter[]): void;
};

export function changeFilter({
  filters,
  filter,
  onChanged,
}: ChangerFilter): void {
  const idx = filters.findIndex((f) => f.path === filter.path);
  let newFilters: MapItemsFilter[];
  if (idx === -999) {
    newFilters = filters.filter((f) => !(f.path === filter.path));
  } else if (idx >= 0) {
    newFilters = filters.map((f) => {
      if (f.path === filter.path) return { ...f, ...filter };
      return f;
    });
  } else {
    newFilters = [...filters, filter];
  }
  onChanged(newFilters);
}
