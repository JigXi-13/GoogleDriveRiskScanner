import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Box,
  Button,
  Container,
  Typography,
  Skeleton,
  Grid,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { MIME_TYPE_MAP } from "../utils/constants.ts";
import { determineRisk, formatFileSize } from "../utils/helpers.ts";

// Define the columns for the DataGrid
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "fileName",
    headerName: "File Name",
    width: 250,
    renderCell: (params) => (
      <a
        href={params.row.webViewLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {params.value}
      </a>
    ),
  },
  { field: "fileType", headerName: "File Type", width: 180 },
  { field: "fileSize", headerName: "File Size", width: 180 },
  { field: "storageUsed", headerName: "Storage Used", width: 180 },
  {
    field: "riskLevel",
    headerName: "Risk Level",
    renderCell: (params) => {
      let color;
      switch (params.value) {
        case "severe":
          color = "red";
          break;
        case "major":
          color = "blue";
          break;
        case "minor":
          color = "green";
          break;
        default:
          color = "gray";
      }
      return (
        <span style={{ color }}>
          <b>{params.value}</b>
        </span>
      );
    },
  },
];

function ReportDashboard(props: any) {
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data } = await axios.get("/reportDashboard");
      console.log("frontend: ", data);
      const transformedFiles = data?.files.map((file: any, index: number) => ({
        id: index + 1,
        fileName: file?.name,
        webViewLink: file?.webViewLink,
        fileType: MIME_TYPE_MAP[file?.mimeType] || "Unknown",
        fileSize: formatFileSize(file?.size),
        storageUsed: formatFileSize(file?.size),
        riskLevel: determineRisk(file),
      }));
      setFiles(transformedFiles);
    } catch (error) {
      console.error("Error fetching files: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // implement handle logut
      const { data } = await axios.get("/revoke");
      localStorage.removeItem("userInfo");
      navigate("/");
      console.log("Logout Successful!");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const renderSkeletonLoader = () => (
    <div style={{ height: 400, width: "100%" }}>
      <Grid container spacing={2}>
        {columns.map((column, index) => (
          <Grid item xs key={index}>
            <Skeleton variant="text" height={40} />
          </Grid>
        ))}
        {[...Array(5)].map((_, rowIndex) => (
          <Grid container item spacing={2} key={rowIndex}>
            {columns.map((column, colIndex) => (
              <Grid item xs key={colIndex}>
                <Skeleton variant="rectangular" height={40} />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </div>
  );

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
      <Button
        sx={{ position: "absolute", top: 12, right: 12 }}
        variant="contained"
        color="secondary"
        onClick={handleLogout}
      >
        Logout
      </Button>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom mb={8}>
          G-Drive Risk Report
        </Typography>
        <div style={{ height: 400, width: "100%" }}>
          {loading ? (
            renderSkeletonLoader()
          ) : (
            <DataGrid
              disableAutosize
              sx={{
                ".MuiDataGrid-cell": {
                  "&:focus": { outline: "none" },
                },
              }}
              checkboxSelection
              disableRowSelectionOnClick
              rows={files}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
            />
          )}
        </div>
      </Container>
    </Box>
  );
}

export default ReportDashboard;
