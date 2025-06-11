import { create } from "zustand";
import { LinkRow } from "../types/database/LinkRow";
import { persist } from "zustand/middleware";
import { CreateShortenedLinkBody } from "../types/bodies/ShortenedLink/ShortenedLink";

interface ShortenedLinkStoreType {
  shortenedLinkList: LinkRow[];
  currentItem: null | LinkRow;
  addModalVisible: boolean;
  infoModalVisible: boolean;
  createLinkBody: null | Partial<CreateShortenedLinkBody>;
  setCreateLinkBody: (
    createLinkBody: null | Partial<CreateShortenedLinkBody>
  ) => void;
  setCurrentItem: (currentItem: LinkRow) => void;
  setInfoModalVisible: (infoModalVisible: boolean) => void;
  setAddModalVisible: (addModalVisible: boolean) => void;
  setShortenedLinkList: (shortenedLinkList: LinkRow[]) => void;
}

const shortenedLinkStore = create<ShortenedLinkStoreType>()(
  persist(
    (set, get) => ({
      shortenedLinkList: [],
      currentItem: null,
      setCreateLinkBody: (createLinkBody) => {
        if (!createLinkBody) {
          set({ createLinkBody });
        } else {
          const { createLinkBody: oldCreateLinkBody } = get();
          set({ createLinkBody: { ...oldCreateLinkBody, ...createLinkBody } });
        }
      },
      setCurrentItem: (currentItem) => set({ currentItem }),
      setShortenedLinkList: (shortenedLinkList) => set({ shortenedLinkList }),
      setInfoModalVisible: (infoModalVisible) => set({ infoModalVisible }),
      setAddModalVisible: (addModalVisible) => set({ addModalVisible }),
      addModalVisible: false,
      infoModalVisible: false,
      createLinkBody: null,
    }),
    {
      name: "link-store",
      partialize: (state) => ({
        currentItem: state.currentItem,
        addModalVisible: state.addModalVisible,
        infoModalVisible: state.infoModalVisible,
        createLinkBody: state.createLinkBody,
      }),
    }
  )
);

export default shortenedLinkStore;
