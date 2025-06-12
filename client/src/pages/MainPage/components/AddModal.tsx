import Dialog from "@mui/material/Dialog";
import shortenedLinkStore from "../../../store/shortenedLinkStore";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import ISODatePicker from "../../../components/UI/ISODatePicker";
import notificationStore from "../../../store/notificationStore";
import { handlerAxiosError, isHttpUrl } from "../../../utils/func";
import { createShortenedLink } from "../../../http/shortenedLinkAPI";

interface AddModalProps{
  updateState: ()=> void
}


const AddModal = ({updateState}: AddModalProps) => {
  const {
    setAddModalVisible,
    setCreateLinkBody,
    createLinkBody,
    loading,
    setLoading,
  } = shortenedLinkStore();
  const { setNotification } = notificationStore();
  const submitHandler = async () => {
    try {
      if (!createLinkBody) {
        setNotification({ type: "error", text: "Заполните данные" });
        return;
      }
      const { originalUrl, expiresAt, alias } = createLinkBody;
      if (!originalUrl || !isHttpUrl(originalUrl)) {
        setNotification({
          type: "error",
          text: "Не полные данные или не валидная ссылка",
        });
        return;
      }
      const dataForSend = new FormData();
      dataForSend.append("originalUrl", originalUrl);
      if (expiresAt) {
        dataForSend.append("expiresAt", expiresAt);
      }
      if (alias) {
        dataForSend.append("alias", alias);
      }
      setLoading(true);
      await createShortenedLink(dataForSend).then(data =>{
        console.log(data);
        updateState()
        setCreateLinkBody(null)
        setAddModalVisible(false)
      })
    } catch (error) {
      setNotification({ type: "error", text: handlerAxiosError(error) });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={() => setAddModalVisible(false)}
      open
    >
      <DialogTitle>Добавление</DialogTitle>
      <DialogContent>
        <div className="py-3 flex flex-col gap-3">
          <TextField
            label="originalUrl"
            value={createLinkBody?.originalUrl ?? ""}
            onChange={(e) => setCreateLinkBody({ originalUrl: e.target.value })}
            variant="outlined"
            disabled={loading}
            fullWidth
            placeholder="Введите ссылку"
          />
          <ISODatePicker
            disabled={loading}
            label="expiresAt (optional)"
            onChange={(v) => setCreateLinkBody({ expiresAt: v })}
            value={createLinkBody?.expiresAt ?? ""}
          />
          <TextField
            label="alias (optional)"
            value={createLinkBody?.alias ?? ""}
            onChange={(e) => setCreateLinkBody({ alias: e.target.value })}
            variant="outlined"
            fullWidth
            disabled={loading}
            placeholder="Введите алиас"
            slotProps={{ htmlInput: { maxLength: 20 } }}
          />
        </div>
      </DialogContent>
      <DialogActions className="!p-5">
        <Button variant="contained" disabled={loading} onClick={submitHandler} autoFocus>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModal;
