import React, { useState, useEffect } from "react";
import axios from "axios";

import { Container, Typography, Box, Button } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { MIME_TYPE_MAP } from "../utils/constants.ts";
import { formatFileSize } from "../utils/helpers.ts";

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
  { field: "fileType", headerName: "File Type", width: 130 },
  { field: "fileSize", headerName: "File Size", width: 130 },
  { field: "storageUsed", headerName: "Storage Used", width: 150 },
  { field: "riskCounter", headerName: "Risk Counter", width: 150 },
];

function ReportDashboard(props: any) {
  const [files, setFiles] = useState([]);

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
        riskCounter: file?.riskCounter || 0,
      }));
      setFiles(transformedFiles);
    } catch (error) {
      console.error("Error fetching files: ", error);
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
        <Typography variant="h4" align="center" gutterBottom>
          G-Drive Risk Report
        </Typography>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
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
        </div>
      </Container>
    </Box>
  );
}

export default ReportDashboard;
