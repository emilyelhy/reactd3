import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, Drawer, CssBaseline, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const DRAWERWIDTH = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

export default function NavDrawer({ content }) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar style={{ display: 'flex', justifyContent: "space-between" }}>
                        <Typography variant="h6" component="div">
                            HY Proj
                        </Typography>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            sx={{ ...(open && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: DRAWERWIDTH,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: DRAWERWIDTH,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="temporary"
                    anchor="right"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        <ListItem component={Link} to="/stackedbar" key="stackedbar" disablePadding>
                            <ListItemButton onClick={handleDrawerClose}>
                                <ListItemText primary="Stacked Bar" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem component={Link} to="/crossfiltering" key="crossfiltering" disablePadding>
                            <ListItemButton onClick={handleDrawerClose}>
                                <ListItemText primary="Crossfiltering" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem component={Link} to="/dynamicbox" key="dynamicbox" disablePadding>
                            <ListItemButton onClick={handleDrawerClose}>
                                <ListItemText primary="Dynamic Box" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>
            </Box>
            {content()}
        </div>
    );
}
