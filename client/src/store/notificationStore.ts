import { AlertColor } from "@mui/material";
import { create } from "zustand";

interface INotification {
  visible: boolean;
  text: string;
  type: AlertColor;
}

interface INotificationStore {
  notification: INotification;
  offNotification: () => void;
  setNotification: (params: { text: string; type: AlertColor }) => void;
}

const notificationStore = create<INotificationStore>((set) => ({
  notification: {
    text: "",
    type: "info",
    visible: false,
  },
  offNotification: () =>
    set({ notification: { text: "", visible: false, type: "info" } }),
  setNotification: (notification) =>
    set({ notification: { ...notification, visible: true } }),
}));

export default notificationStore;
