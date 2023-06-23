import {
  createTheme,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState, React } from "react";
import TextFieldWrapper from "../../components/FitnessComponents/formTextField";
import { ThemeProvider } from "@emotion/react";
import ButtonWrapper from "../../components/FitnessComponents/FormSumbitButton";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

const Form_Validation = Yup.object().shape({
  currentWeight: Yup.number()
    .min(0, "Value must be greater than or equal to 0")
    .required("weight is required")
    .typeError("Please a enter weight"),
  currentheight: Yup.number()
    .min(0, "Value must be greater than or equal to 0")
    .required("height is required")
    .typeError("Please a enter height")
    .max(100, "Height must in meters"),
  currentBFat: Yup.number()
    .min(0, "Value must be greater than or equal to 0")
    .required("body fat percentage is required")
    .typeError("Please a enter valid body fat percentage "),
  currentHRate: Yup.number()
    .min(0, "Value must be greater than or equal to 0")
    .required("Heart rate is required")
    .typeError("Please a enter valid blood pressure")
    .max(200, "Resting heart rate is invalid"),

  iWeight: Yup.number()
    .min(0, "Value must be greater than or equal to 0")
    .required("weight is required")
    .typeError("Please a enter weight"),
  iBMI: Yup.number()
    .min(0, "Value must be greater than or equal to 0")
    .required("weight is required")
    .typeError("Please a enter weight"),
  iBFat: Yup.number()
    .min(0, "Value must be greater than or equal to 0")
    .required("body fat percentage is required")
    .typeError("Please a enter valid body fat percentage "),
  iHeartRate: Yup.number()
    .min(0, "Value must be greater than or equal to 0")
    .required("Heart rate is required")
    .typeError("Please a enter valid blood pressure")
    .max(200, "Resting heart rate is invalid"),
});
const theme = createTheme({
  palette: {
    secondary: {
      main: "#000000",
    },
    primary: {
      main: "#fe9e0d",
    },
  },
});

function UpdateFitnessGoal(props) {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state.data.userId);
  const [showToast, setShowToast] = useState(false);
  const [showToastUpdate, setShowToastUpdate] = useState(false);
  const INITAL_FORM_STATE = {
    currentWeight: state.data.currentWeight,
    currentBFat: state.data.currentBodyfat,
    currentHRate: state.data.currentBldPressure,
    currentheight: state.data.currentheight,
    cBMI: state.data.CurrentBMI,
    iWeight: state.data.idealWeight,
    iBMI: state.data.idealBMI,
    iBFat: state.data.idealBodyfat,
    iHeartRate: state.data.idealBldPressure,
  };
  const handleDelete = () => {
    const deleteFitnessGoal = async () => {
      try {
        await axios.delete(
          `http://localhost:4000/fitnessGoal/delete/${state.data.userId}`
        );
        setShowToast(true);
      } catch (error) {
        console.error(error);
      }
    };
    deleteFitnessGoal();
  };
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowToast(false);

    console.log(state.data.userId);
    navigate(`/fitness_home/${state.data.userId}`);
  };
  return (
    <div className="AppGlass">
      <Snackbar
        open={showToast}
        onClose={handleToastClose}
        message="Fitness goal deleted"
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ContentProps={{ style: { backgroundColor: "#fe9e0d" } }}
        style={{ textAlign: "center" }}
      />

      <Snackbar
        open={showToastUpdate}
        onClose={handleToastClose}
        message="Fitness goal Updated"
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ContentProps={{ style: { backgroundColor: "#fe9e0d" } }}
        style={{ textAlign: "center" }}
      />
      <Formik
        initialValues={{ ...INITAL_FORM_STATE }}
        validationSchema={Form_Validation}
        onSubmit={async (values) => {
          axios
            .put(
              `http://localhost:4000/fitnessGoal/update/${state.data.userId}`,
              values
            )
            .then((response) => {
              setShowToastUpdate(true);
              console.log(response.data);
            })
            .catch((err) => {
              console.error(err);
            });
        }}
      >
        {({ values, errors, touched, handleChange }) => {
          /*set BMI*/
          if (touched.currentWeight || touched.currentheight) {
            let currentWeight = parseFloat(values.currentWeight);
            let currentHeight = parseFloat(values.currentheight);
            let val = currentWeight / (currentHeight * currentHeight);
            values.cBMI = val.toFixed(2);
          }
          return (
            <Form>
              <ThemeProvider theme={theme}>
                <Box p={2}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <p
                        style={{ fontSize: "30px", color: "#fe9e0d" }}
                        className="Heading-Fitness"
                      >
                        Current Fitness level             
                      </p>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      {/*current weight */}
                      <TextFieldWrapper
                        name="currentWeight"
                        id="cweight"
                        label="Current weight"
                        color="primary"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <b style={{ color: "black" }}>kg</b>
                            </InputAdornment>
                          ),
                          startAdornment: (
                            <InputAdornment position="end">
                              <b style={{ color: "black" }}>
                                Current weight :&nbsp;&nbsp;&nbsp;
                              </b>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid xs={12} item md={6}>
                      {/*current height */}
                      <TextFieldWrapper
                        name="currentheight"
                        id="cHeight"
                        label="Current height"
                        color="primary"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <InputAdornment position="end">
                                <b style={{ color: "black" }}>m</b>
                              </InputAdornment>
                            </InputAdornment>
                          ),
                          startAdornment: (
                            <InputAdornment position="end">
                              <b style={{ color: "black" }}>
                                Current height :&nbsp;&nbsp;&nbsp;
                              </b>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      {/*current Body fat percentage */}
                      <TextFieldWrapper
                        name="currentBFat"
                        label="Body Fat percentage"
                        color="primary"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <InputAdornment position="end">
                                <b style={{ color: "black" }}>%</b>
                              </InputAdornment>
                            </InputAdornment>
                          ),
                          startAdornment: (
                            <InputAdornment position="end">
                              <b style={{ color: "black" }}>
                                Body Fat percentage :&nbsp;&nbsp;&nbsp;
                              </b>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      {/*current heart rate */}
                      <TextFieldWrapper
                        name="currentHRate"
                        label="Resting Heart Rate"
                        color="primary"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <InputAdornment position="end">
                                <b style={{ color: "black" }}>bpm</b>
                              </InputAdornment>
                            </InputAdornment>
                          ),
                          startAdornment: (
                            <InputAdornment position="end">
                              <b style={{ color: "black" }}>
                                Resting Heart Rate :&nbsp;&nbsp;&nbsp;
                              </b>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {/*current current BMI */}
                      <TextFieldWrapper
                        name="cBMI"
                        id="cBMI"
                        label="Current BMI"
                        color="secondary"
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="end">
                              <InputAdornment position="end">
                                <b style={{ color: "black" }}>
                                  Your BMI Is : &nbsp;&nbsp;&nbsp;
                                </b>
                              </InputAdornment>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <InputAdornment position="end">
                                <b style={{ color: "black" }}>kg/m^m</b>
                              </InputAdornment>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <p
                        style={{ fontSize: "30px", color: "#fe9e0d" }}
                        className="Heading-Fitness"
                      >
                        Ideal Fitness level             
                      </p>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextFieldWrapper
                        name="iWeight"
                        id="iWeight"
                        label="Ideal weight"
                        color="primary"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="end">
                              <b style={{ color: "black" }}>
                                Ideal weight :&nbsp;&nbsp;&nbsp;
                              </b>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <InputAdornment position="end">
                                <b style={{ color: "black" }}>kg</b>
                              </InputAdornment>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {/*Ideal BMI */}
                      <TextFieldWrapper
                        name="iBMI"
                        id="iBMI"
                        label="Ideal BMI"
                        color="primary"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="end">
                              <b style={{ color: "black" }}>
                                Ideal BMI :&nbsp;&nbsp;&nbsp;
                              </b>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <InputAdornment position="end">
                                <b style={{ color: "black" }}>kg/m^m</b>
                              </InputAdornment>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextFieldWrapper
                        name="iBFat"
                        label="Body Fat percentage"
                        color="primary"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="end">
                              <b style={{ color: "black" }}>
                                Body Fat percentage :&nbsp;&nbsp;&nbsp;
                              </b>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <InputAdornment position="end">
                                <b style={{ color: "black" }}>%</b>
                              </InputAdornment>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextFieldWrapper
                        name="iHeartRate"
                        label="Resting Heart Rate"
                        color="primary"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="end">
                              <b style={{ color: "black" }}>
                                Resting Heart Rate :&nbsp;&nbsp;&nbsp;
                              </b>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <InputAdornment position="end">
                                <b style={{ color: "black" }}>bmp</b>
                              </InputAdornment>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item md={3} xs={12} p={2}>
                      <Button
                        variant={"contained"}
                        onClick={handleDelete}
                        sx={{
                          width: "100%",
                          backgroundColor: "red",
                          color: "white",
                        }}
                      >
                        <b>Delete</b>
                      </Button>
                    </Grid>
                    <Grid item md={6} xs={12} p={3}></Grid>
                    <Grid item md={3} xs={12} p={2}>
                      <ButtonWrapper>Update</ButtonWrapper>
                    </Grid>
                  </Grid>
                </Box>

                <br />
              </ThemeProvider>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default UpdateFitnessGoal;
