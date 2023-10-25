import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import { AddOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import {
  useGetWorkFlowsQuery,
  useDeleteWorkFlowMutation,
} from "src/store/slices/configurations/workFlowApiSlice";

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div>
      <PermissionGuard permission="change_work_flow">
        <Tooltip title="Edit Work Flow">
          <IconButton color="primary" size="small" onClick={onEdit}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      <PermissionGuard permission="delete_work_flow">
        <Tooltip title="Delete Work Flow">
          <IconButton color="error" size="small" onClick={onDelete}>
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
    </div>
  );
};

const WorkFlowTableRow = ({ index, row, onDelete, onEdit }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>{row.flow_type}</TableCell>
      <TableCell>{row.step}</TableCell>
      <TableCell>{row.notify_to.map((role) => role.name).join(", ")}</TableCell>
      <TableCell>
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

const WorkFlows = () => {
  const navigate = useNavigate();
  const { data, isSuccess } = useGetWorkFlowsQuery();
  const [workFlowDeleteApi] = useDeleteWorkFlowMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteWorkFlowId, setDeleteWorkFlowId] = useState(null);
  const [rows, setRows] = useState(data || []);
  useEffect(() => {
    if (isSuccess) setRows(data);
  }, [isSuccess, data]);

  const handleEdit = (workFlowId) => {
    navigate(`${workFlowId}/edit`);
  };

  const handleDelete = (workFlowId) => {
    setShowDeleteModal(true);
    setDeleteWorkFlowId(workFlowId);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await workFlowDeleteApi(deleteWorkFlowId).unwrap();
      enqueueSnackbar("Work Flow deleted successfully.", {
        variant: "success",
      });

      setRows((prevRows) =>
        prevRows.filter((workFlow) => workFlow.id !== deleteWorkFlowId)
      );

      setShowDeleteModal(false);
      setDeleteWorkFlowId(null);
    } catch (err) {
      setDeleteWorkFlowId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Work Flows</Typography>
          </Grid>
          <Grid item>
            <PermissionGuard permission="add_work_flow">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create")}
              >
                <AddOutlined /> Add Work Flow
              </Button>
            </PermissionGuard>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ minHeight: 400, width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Flow Type</TableCell>
                    <TableCell>Step</TableCell>
                    <TableCell>Notify To</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <WorkFlowTableRow
                      key={row.id}
                      index={index}
                      row={row}
                      onEdit={() => handleEdit(row.id)}
                      onDelete={() => handleDelete(row.id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </MainCard>
      </Grid>

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirmed}
        dialogContent="Are you sure you want to delete this work flow?"
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

WorkFlowTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default WorkFlows;
