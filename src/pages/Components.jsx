import {
  Alert,
  Appbar,
  Avatar,
  Button,
  Card,
  DatePicker,
  DateTimePicker,
  Fab,
  Grid,
  Modal,
  Pagination,
  Rating,
  SearchBar,
  Skeleton,
  SnackBar,
  Stack,
  Switch,
  TextField,
  TimePicker,
  Typography
} from "../components";

const Components = () => {
    return (
        <div>
            <h1>Componentes</h1>
            <Alert title ="Aviso" severity="info">Este é um alerta de informação!</Alert>
            <Appbar />
            <Avatar alt="Avatar" src="https://i.pravatar.cc/300" />
            <Avatar>PV</Avatar>
            <Button color="warning" >Este é um Botão!</Button>
            <Card />
            <DatePicker />
            <DateTimePicker />
            <Fab />
            <Grid />
            <Modal />
            <Pagination />
            <Rating />
            <SearchBar />
            <Skeleton />
            <SnackBar />
            <Stack />
            <Switch />
            <TextField />
            <TimePicker />
            <Typography />
        </div>
    );
};
export default Components;