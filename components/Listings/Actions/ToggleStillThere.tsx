import { useQueryClient } from "@tanstack/react-query";
import { useListings } from "@/context/ListingsProvider";
import { useMutateData } from "@/hooks/useMutateData";
import { Listing } from "@/lib/types";
import ButtonOnClick from "@/components/common/Button/ButtonOnClick";

type ToggleStillThereProps = {
  stillThere: boolean;
  listingId: string;
};

export default function ToggleStillThere({
  stillThere,
  listingId,
}: ToggleStillThereProps) {
  const { meadowId } = useListings();

  const queryClient = useQueryClient();

  const { mutate } = useMutateData({
    requestConfig: {
      url: `/api/listings/${listingId}`,
      method: "PATCH",
    },
    queryKey: [`meadow-${meadowId}`],
    queryClient: queryClient,
    updateDataOptimistically: (prevListings: Listing[]) => {
      const listingToUpdate = prevListings.find(
        (listingFromQuery) => listingFromQuery.id === listingId
      );

      const updatedListing = {
        ...listingToUpdate,
        stillThere: !listingToUpdate!.stillThere,
        updatedAt: new Date().toISOString(),
      };

      const updatedListingsForMeadow = prevListings.map((listingFromQuery) =>
        listingFromQuery.id === listingId ? updatedListing : listingFromQuery
      );

      return {
        updatedDataKey: "listings",
        updatedData: updatedListingsForMeadow,
      };
    },
  });

  function toggleStillThereForListing() {
    mutate({
      action: "toggleStillThere",
    });
  }

  return (
    <ButtonOnClick
      variant="secondary"
      btnText={stillThere ? "Not there?" : "Still there?"}
      btnStyles={`${
        stillThere
          ? "border-red-500 text-red-500"
          : "border-green-500 text-green-500"
      } border bg-transparent text-[10px] h-6 py-0"`}
      onClick={toggleStillThereForListing}
    />
  );
}
