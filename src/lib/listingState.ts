export type ListingViewState = "loading" | "error" | "empty" | "success";

export function getListingViewState(input: {
  loading: boolean;
  error: string;
  itemCount: number;
}): ListingViewState {
  if (input.loading) return "loading";
  if (input.error) return "error";
  if (input.itemCount === 0) return "empty";
  return "success";
}
