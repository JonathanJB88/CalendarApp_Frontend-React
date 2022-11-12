import { useCalendarStore, useUiStore } from "../../hooks";

export const FabDelete = () => {
  const { startDeletingEvent, hasEventSelected } = useCalendarStore();
  const { isDateModalClose } = useUiStore();

  const handleDelete = () => {
    startDeletingEvent();
  };

  return (
    <button
      className="btn btn-danger fab-danger"
      onClick={handleDelete}
      style={{ display: hasEventSelected && isDateModalClose ? "" : "none" }}
    >
      <i className="fas fa-trash-alt" />
    </button>
  );
};
