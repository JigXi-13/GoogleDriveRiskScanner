import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Box,
  FormControl,
  FormLabel,
} from "@mui/material";
import { FormData, Errors } from "../utils/types.ts";

function HomePage(props: any) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "John",
    lastName: "Doe",
    jobTitle: "Software Engineer",
    country: "USA",
    email: "vyas.jiggy13@gmail.com",
    isCompanyEnquiry: true,
    companyName: "Example Corp",
    phoneNumber: "123-456-7890",
  });

  const [errors, setErrors] = useState<Errors>({});

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear the error for the changed field
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.jobTitle) newErrors.jobTitle = "Job Title is required";
    if (!formData.country) newErrors.country = "Country/Region is required";
    if (!formData.email) {
      newErrors.email = "Business Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "/api/",
          {
            firstName: formData?.firstName,
            lastName: formData?.lastName,
            jobTitle: formData?.jobTitle,
            country: formData?.country,
            email: formData?.email,
            isCompanyEnquiry: formData?.isCompanyEnquiry,
            companyName: formData?.companyName,
            phoneNumber: formData?.phoneNumber,
          },
          config
        );
        console.log("Homopage: ", data);

        const authorizationUrl = data?.authorizationUrl;
        if (authorizationUrl) {
          // we did this to resolve CORS error
          // On backend side, we cannot redirect user to different route while google OAuth is going on!
          window.location.href = authorizationUrl;
        } else {
          console.log("Homopage: ", data);
          navigate("/reportDashboard");
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" mb={8}>
          Get a Free Risk Report
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* First Name and Last Name */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <TextField
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  helperText={errors.firstName}
                  error={!!errors.firstName}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <TextField
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  helperText={errors.lastName}
                  error={!!errors.lastName}
                />
              </FormControl>
            </Grid>

            {/* Job Title and Country/Region */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.jobTitle}>
                <FormLabel>Job Title</FormLabel>
                <TextField
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  helperText={errors.jobTitle}
                  error={!!errors.jobTitle}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.country}>
                <FormLabel>Country/Region</FormLabel>
                <TextField
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  helperText={errors.country}
                  error={!!errors.country}
                />
              </FormControl>
            </Grid>

            {/* Business Email with Checkbox */}
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.email}>
                <FormLabel>Business Email</FormLabel>
                <TextField
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  helperText={errors.email}
                  error={!!errors.email}
                />
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isCompanyEnquiry}
                    onChange={handleChange}
                    name="isCompanyEnquiry"
                    color="primary"
                  />
                }
                label="Tick this box if you're enquiring on behalf of your company."
              />
            </Grid>

            {/* Company Name and Phone Number */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel>Company Name</FormLabel>
                <TextField
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel>Phone Number</FormLabel>
                <TextField
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
}

export default HomePage;
