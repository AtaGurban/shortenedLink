import { create } from "zustand";
import { LinkRow, LinksResponse } from "../types/database/LinkRow";
import { persist } from "zustand/middleware";
import { CreateShortenedLinkBody } from "../types/bodies/ShortenedLink/ShortenedLink";

interface ShortenedLinkStoreType {
  shortenedLinkList: LinksResponse;
  currentItem: null | LinkRow;
  addModalVisible: boolean;
  infoModalVisible: boolean;
  loading: boolean;
  createLinkBody: null | Partial<CreateShortenedLinkBody>;
  setCreateLinkBody: (
    createLinkBody: null | Partial<CreateShortenedLinkBody>
  ) => void;
  setCurrentItem: (currentItem: LinkRow) => void;
  setInfoModalVisible: (infoModalVisible: boolean) => void;
  setLoading: (loading: boolean) => void;
  setAddModalVisible: (addModalVisible: boolean) => void;
  setShortenedLinkList: (shortenedLinkList: LinksResponse) => void;
}

const shortenedLinkStore = create<ShortenedLinkStoreType>()(
  persist(
    (set, get) => ({
      shortenedLinkList: {count: 0, rows: []},
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
      setLoading: (loading) => set({ loading }),
      addModalVisible: false,
      infoModalVisible: false,
      loading: false,
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
