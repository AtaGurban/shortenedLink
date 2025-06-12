import Dialog from "@mui/material/Dialog";
import shortenedLinkStore from "../../../store/shortenedLinkStore";
import {
  DialogContent,
  DialogTitle,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { formatISO } from "date-fns";

const InfoModal = () => {
  const { currentItem, setInfoModalVisible } = shortenedLinkStore();
  if (!currentItem) return;
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={() => setInfoModalVisible(false)}
      open
    >
      <DialogTitle>
        Информация о короткой ссылке {currentItem.alias}
      </DialogTitle>
      <DialogContent>
          <div>

            <Typography variant="body1">
              <strong>Алиас:</strong> {currentItem.alias}
            </Typography>

            <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
              <strong>Оригинальная ссылка:</strong> {currentItem.originalUrl}
            </Typography>

            <Typography variant="body1">
              <strong>Создано:</strong> {formatISO(currentItem.createdAt, { representation: 'date' })}
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Количество переходов:</strong>{" "}
              {currentItem?.clickCount ?? ""}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Переходы по ссылке:
            </Typography>

            <List dense>
              {currentItem.clicks?.map((click) => (
                <ListItem key={click.id}>
                  <ListItemText
                    primary={`IP: ${click.ip}`}
                    secondary={`Время: ${formatISO(click.createdAt, { representation: 'date' })}`}
                  />
                </ListItem>
              ))}
            </List>
          </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
