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
  TablePagination,
  TextField,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";
import {
  AddOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportExportOutlined,
} from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import PermissionGuard from "src/components/PermissionGuard";
import MainCard from "src/components/MainCard";
import DeleteModal from "src/components/modals/DeleteModal";
import ImportDialog from "src/components/modals/ImportModal";
import menuTemplate from "src/assets/template/menu-template.xlsx";
import {
  useGetMenusQuery,
  useImportMenuMutation,
  useDeleteMenuMutation,
} from "src/store/slices/configurations/menuApiSlice";

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div>
      <PermissionGuard permission="change_menu">
        <Tooltip title="Edit Menu">
          <IconButton color="primary" size="small" onClick={onEdit}>
            <EditOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
      <PermissionGuard permission="delete_menu">
        <Tooltip title="Delete Menu">
          <IconButton color="error" size="small" onClick={onDelete}>
            <DeleteOutlined />
          </IconButton>
        </Tooltip>
      </PermissionGuard>
    </div>
  );
};

const MenuTableRow = ({ index, row, onDelete, onEdit }) => {
  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">{index + 1}</TableCell>
      <TableCell>
        {row.item}
        {row.item_local_name && ` (${row.item_local_name})`}
      </TableCell>
      <TableCell>{row.price} BIRR</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell align="right">
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};

const Menus = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isSuccess, refetch } = useGetMenusQuery({
    page,
    limit,
    search,
  });
  const [menuDeleteApi] = useDeleteMenuMutation();
  const [importMenu] = useImportMenuMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMenuId, setDeleteMenuId] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const [rows, setRows] = useState(data?.menus || []);
  const totalMenus = data?.total || 0;

  useEffect(() => {
    if (isSuccess) setRows(data?.menus || []);
  }, [isSuccess, data]);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage + 1);
    refetch({ page: newPage + 1, limit });
  };

  const handleChangeRowsPerPage = async (event) => {
    const newLimit = +event.target.value;

    setLimit(newLimit);
    setPage(1);
    refetch({ page: 1, limit: newLimit });
  };

  const handleSearch = () => {
    if (searchQuery.length > 2) {
      setPage(1);
      setSearch(searchQuery);

      refetch({ page, limit, search });
    } else {
      setSearch("");
    }
  };

  const handleEdit = (menuId) => {
    navigate(`${menuId}/edit`);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await menuDeleteApi(deleteMenuId).unwrap();
      enqueueSnackbar("Menu deleted successfully.", {
        variant: "success",
      });

      setPage(1);
      refetch();
      setShowDeleteModal(false);
      setDeleteMenuId(null);
    } catch (err) {
      setDeleteMenuId(null);
      setShowDeleteModal(false);
    }
  };

  const handleImport = async (importData) => {
    try {
      await importMenu(importData).unwrap();
      setPage(1);
      refetch();

      enqueueSnackbar("Menu Item imported successfully.", {
        variant: "success",
      });

      setShowImportModal(false);
    } catch (err) {
      setShowImportModal(false);
    }
  };

  return (
    <>
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">List of Menus</Typography>
          </Grid>
          <Grid item>
            <PermissionGuard permission="import_menu">
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowImportModal(true)}
                style={{ marginRight: "10px" }}
              >
                <ImportExportOutlined /> Import Menu
              </Button>
            </PermissionGuard>
            <PermissionGuard permission="add_menu">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("create")}
              >
                <AddOutlined /> Add Menu
              </Button>
            </PermissionGuard>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Grid item xs={12} md={6} sx={{ p: 1, pt: 2 }}>
            <TextField
              label="Search by item"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              sx={{
                width: "100%",
                "@media (min-width: 960px)": { width: "40%" },
              }}
            />
          </Grid>

          <Box sx={{ width: "99.8%", maxWidth: "100%", p: 1 }}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body1">
                          No data available.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {rows.map((row, index) => (
                    <MenuTableRow
                      key={row.id}
                      index={index}
                      row={row}
                      onEdit={() => handleEdit(row.id)}
                      onDelete={() => {
                        setShowDeleteModal(true);
                        setDeleteMenuId(row.id);
                      }}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              component="div"
              count={totalMenus}
              rowsPerPage={limit}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </MainCard>
      </Grid>

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirmed}
        dialogContent="Are you sure you want to delete this menu?"
      />

      <ImportDialog
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
        }}
        onImport={handleImport}
        dialogTitle="Import Menus"
        templateFile={menuTemplate}
        templateFileName="menu-template.xlsx"
      />
    </>
  );
};

// PropTypes validation
ActionButtons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

MenuTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Menus;
