import { useSelector, useDispatch } from "react-redux";
import { onCloseDateModal, onOpenDateModal } from "../store/ui/uiSlice";

export const useUiStore = () => {
  const dispatch = useDispatch();

  const { isDateModalOpen } = useSelector((state) => state.ui);

  const openDateModal = () => {
    dispatch(onOpenDateModal());
  };

  const closeDateModal = () => {
    dispatch(onCloseDateModal());
  };

  const toggleDateModal = () => {
    isDateModalOpen ? openDateModal() : closeDateModal;
  };

  return {
    // Propiedades
    isDateModalOpen,
    isDateModalClose: !isDateModalOpen,

    // Métodos
    openDateModal,
    closeDateModal,
    toggleDateModal,
  };
};
