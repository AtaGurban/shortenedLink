import { Button, Container, IconButton, Pagination } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import shortenedLinkStore from "../../store/shortenedLinkStore";
import AddModal from "./components/AddModal";
import { useCallback, useEffect, useState } from "react";
import notificationStore from "../../store/notificationStore";
import { handlerAxiosError } from "../../utils/func";
import {
  deleteShortenedLink,
  getShortenedLinkAnalytic,
  getShortenedLinks,
} from "../../http/shortenedLinkAPI";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { LinkRow } from "../../types/database/LinkRow";
import { baseURL } from "../../http";
import InfoModal from "./components/InfoModal";
const limit = 24;
const MainPage = () => {
  const {
    addModalVisible,
    setAddModalVisible,
    infoModalVisible,
    currentItem,
    loading,
    setLoading,
    shortenedLinkList,
    setInfoModalVisible,
    setCurrentItem,
    setShortenedLinkList,
  } = shortenedLinkStore();
  const { setNotification } = notificationStore();
  const [filterOptions, setFilterOptions] = useState({ page: 1 });
  const updateState = useCallback(async () => {
    try {
      await getShortenedLinks({ ...filterOptions, limit }).then((data) => {
        setShortenedLinkList(data);
      });
    } catch (error) {
      console.log(error);
      setNotification({ type: "error", text: handlerAxiosError(error) });
    }
  }, [setNotification, setShortenedLinkList, filterOptions]);

  useEffect(() => {
    updateState();
  }, [updateState]);

  const deleteHandler = async (i: LinkRow) => {
    try {
      setLoading(true);
      await deleteShortenedLink(i.alias).then(() => {
        updateState();
      });
    } catch (error) {
      console.log(error);
      setNotification({ type: "error", text: handlerAxiosError(error) });
    } finally {
      setLoading(false);
    }
  };
  const handleChangePagination = (
    _: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setFilterOptions((p) => ({ ...p, page: value }));
  };

  const infoClickHandler = async (i: LinkRow) => {
    try {
      setLoading(true);
      await getShortenedLinkAnalytic(i.alias).then((data) => {
        setCurrentItem(data);
        setInfoModalVisible(true);
      });
    } catch (error) {
      console.log(error);
      setNotification({ type: "error", text: handlerAxiosError(error) });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {addModalVisible && <AddModal updateState={updateState} />}
      {infoModalVisible && currentItem && <InfoModal />}
      <div className="bg-gray-100 h-screen w-100">
        <Container className="py-10" maxWidth="xl">
          {" "}
          <div className="my-5 flex justify-end">
            <Button
              disabled={loading}
              onClick={() => setAddModalVisible(true)}
              variant="contained"
            >
              Добавить
            </Button>
          </div>
          <TableContainer className="pt-3" component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>id</TableCell>
                  <TableCell>originalUrl</TableCell>
                  <TableCell>expiresAt</TableCell>
                  <TableCell>alias </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shortenedLinkList.rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>
                      <a target="_blank" href={`${baseURL}/${row.alias}`}>
                        {row.originalUrl}
                      </a>
                    </TableCell>
                    <TableCell>{row.expiresAt ?? ""}</TableCell>
                    <TableCell>{row.alias}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <IconButton
                          disabled={loading}
                          onClick={() => deleteHandler(row)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => infoClickHandler(row)}>
                          <InfoIcon />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="mt-5 flex align-center justify-center">
            <Pagination
              count={Math.ceil(shortenedLinkList.count / limit)} // Замените на общее количество страниц
              page={filterOptions.page}
              onChange={handleChangePagination}
              shape={"rounded"}
            />
          </div>
        </Container>
      </div>
    </>
  );
};

export default MainPage;
