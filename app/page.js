'use client';

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography, Card, CardContent, CardActions, Grid, IconButton, } from '@mui/material';
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

// Styled components using Material-UI's styled function
const Container = styled(Box)({
  width: '100vw', // Full viewport width
  height: '100vh', // Full viewport height
  display: 'flex', // Flexbox layout
  flexDirection: 'column', // Column layout
  justifyContent: 'center', // Center items vertically
  alignItems: 'center', // Center items horizontally
  padding: 16, // Padding of 16px
  backgroundColor: '#f5f5f5', // Light grey background color
});

const InventoryTitle = () => (
  <Box
    sx={{
      textAlign: 'center', // Center the content
      display: 'flex', // Use flexbox for layout
      flexDirection: 'column', // Stack the logo and text vertically
      alignItems: 'center', // Center horizontally
      marginBottom: 4, // Space below the title
    }}
  >
    <img
      src="/logo.webp"
      alt="Storify Logo"
      style={{ width: 150, height: 150, marginBottom: '5px' }}
    />
    <svg
      width="500"
      height="100"
      viewBox="0 0 400 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="90"
        fontWeight="bold"
        fill="white"
        stroke="#162E3F"
        strokeWidth="10"
        paintOrder="stroke fill"
      >
        Sandooq
      </text>
    </svg>
  </Box>
);

const AddButton = styled(Button)({
  marginBottom: 16, // Margin bottom of 16px
  backgroundColor: '#1976d2', // Primary color
  '&:hover': {
    backgroundColor: '#1565c0', // Darker primary color on hover
  },
});

const SearchField = styled(TextField)({
  marginBottom: 16, // Margin bottom of 16px
  width: '50%', // Half of the container width
});

const InventoryCard = styled(Card)({
  transition: 'transform 0.3s, box-shadow 0.3s', // Smooth transitions for transform and box-shadow
  '&:hover': {
    transform: 'scale(1.05)', // Scale up slightly on hover
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)', // Shadow effect on hover
  },
});

const ModalBox = styled(Box)({
  position: 'absolute', // Absolute positioning
  top: '50%', // Center vertically
  left: '50%', // Center horizontally
  width: 400, // Width of 400px
  backgroundColor: 'white', // White background color
  border: '2px solid #000', // Black border
  boxShadow: 24, // Box shadow for depth
  padding: 16, // Padding of 16px
  display: 'flex', // Flexbox layout
  flexDirection: 'column', // Column layout
  gap: 16, // Gap between items
  transform: 'translate(-50%, -50%)', // Centering transform
});

export default function Home() {
  const [inventory, setInventory] = useState([]); // State to store inventory items
  const [open, setOpen] = useState(false); // State to control the modal visibility
  const [itemName, setItemName] = useState(''); // State to store the name of the item
  const [itemQuantity, setItemQuantity] = useState(''); // State to store the quantity of the item
  const [updateMode, setUpdateMode] = useState(false); // State to control if the modal is in update mode
  const [searchTerm, setSearchTerm] = useState(''); // State to store the search term

  // Function to fetch and update inventory from Firestore
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory')); // Create a query snapshot
    const docs = await getDocs(snapshot); // Fetch documents from Firestore
    const inventoryList = []; // Temporary list to store inventory items
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id, // Use document ID as item name
        ...doc.data(), // Spread document data (quantity)
      });
    });
    setInventory(inventoryList); // Update inventory state with fetched data
  };

  // Function to add or update an item in Firestore
  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item); // Reference to the Firestore document
    const docSnap = await getDoc(docRef); // Fetch document snapshot

    if (docSnap.exists()) {
      await setDoc(docRef, { quantity: Number(quantity) }, { merge: true }); // Update item quantity if it exists
    } else {
      await setDoc(docRef, { quantity: Number(quantity) }); // Create new item if it doesn't exist
    }

    await updateInventory(); // Update inventory list after adding/updating item
  };

  // Function to delete an item from Firestore
  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item); // Reference to the Firestore document
    await deleteDoc(docRef); // Delete the document
    await updateInventory(); // Update inventory list after deletion
  };

  // Function to handle the edit button click
  const handleEdit = (item) => {
    setItemName(item.name); // Set the item name in the state
    setItemQuantity(item.quantity); // Set the item quantity in the state
    setUpdateMode(true); // Set modal to update mode
    setOpen(true); // Open the modal
  };

  // Fetch inventory on component mount
  useEffect(() => {
    updateInventory(); // Update inventory list when component mounts
  }, []);

  const handleOpen = () => {
    setOpen(true); // Open the modal
    setItemName(''); // Reset item name
    setItemQuantity(''); // Reset item quantity
    setUpdateMode(false); // Set modal to add mode
  };

  const handleClose = () => setOpen(false); // Close the modal

  return (
    <Container>
      <InventoryTitle />
      <AddButton
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
      >
        Add New Item
      </AddButton>
      <SearchField
        variant="outlined"
        placeholder="Search items"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon position="start" />,
        }}
      />
      <Grid container spacing={2}>
        {inventory
          .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) // Filter items based on search term
          .map(({ name, quantity }) => (
            <Grid item xs={12} sm={6} md={4} key={name}>
              <InventoryCard>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {quantity}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton color="primary" onClick={() => handleEdit({ name, quantity })}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => deleteItem(name)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </InventoryCard>
            </Grid>
          ))}
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <ModalBox>
          <Typography variant="h6">{updateMode ? 'Update Item' : 'Add Item'}</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Quantity"
              type="number"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName, itemQuantity); // Add or update item
                handleClose(); // Close the modal
              }}
            >
              {updateMode ? 'Update' : 'Add'}
            </Button>
          </Stack>
        </ModalBox>
      </Modal>
    </Container>
  );
}
