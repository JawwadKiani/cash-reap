// Utility to check if a card is saved, supporting both data formats
export const isCardSaved = (savedCards: any[], cardId: string) => {
  return Array.isArray(savedCards) && savedCards.some(
    (saved: any) => (saved.card?.id ?? saved.cardId) === cardId
  );
};

// Shared utility for toggling save/unsave logic
export const handleSaveToggle = ({
  isSaved,
  saveFn,
  unsaveFn,
  cardId,
  event
}: {
  isSaved: boolean,
  saveFn: (id?: string) => void,
  unsaveFn: (id?: string) => void,
  cardId?: string,
  event?: React.MouseEvent
}) => {
  if (event) event.stopPropagation();
  if (isSaved) {
    unsaveFn(cardId);
  } else {
    saveFn(cardId);
  }
};
