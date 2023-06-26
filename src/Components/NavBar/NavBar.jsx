import React, { useState, useEffect, useContext } from 'react';
import { AppBar, IconButton, Toolbar, Drawer, Button, Avatar, useMediaQuery } from '@mui/material';
import { Menu, AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { SideBar } from '..';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';
import { setUser, userSelector } from '../../Features/auth';
import { fetchToken, createSessionId, moviesApi } from '../../utils';
import { Search } from '../';

const NavBar = () => {
    const classes = useStyles();
    const isMobile = useMediaQuery('(max-width: 600px)');
    const theme = useTheme();
    const isAuthenticated = false;
    const dispatch = useDispatch(); 
    const [mobileOpen, setMobileOpen] = useState(false);

    const token = localStorage.getItem('request_token');
    const session_idFromLocalStorage = localStorage.getItem('session_id');

    useEffect(() => {
        const logInUser = async () => {
            if (token) {
                if (session_idFromLocalStorage) {
                    const { data: userData } = await moviesApi.get(`/account?session_id=${sessionIdFromLocalStorage}`);
                    dispatch(setUser(userData));
                }
                else {
                    const sessionId = await createSessionId();
                    const { data: userData } = await moviesApi.get(`/account?session_id=${session_id}`);
                    dispatch(setUser(userData));
                }
            }
        };
        logInUser();
    }, [token]);

    return (
        <>
            <AppBar position="fixed">
                <Toolbar className={classes.toolbar}>
                    {isMobile && (
                        <IconButton color="inherit"
                            edge="start"
                            style={{ outline: 'none' }}
                            onCLick={() => setMobileOpen((prevMobileopen) => !prevMobileopen)}
                            className={classes.menuBar}>
                            <Menu />
                        </IconButton>
                    )}
                    <IconButton
                        color="inherit"
                        sx={{ ml: 1 }}
                        onClick={() => { }}
                    >
                        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    {!isMobile && <Search />}
                    <div>
                        {!isAuthenticated ? (
                            <Button color="inherit" onClick={fetchToken}>
                                Login &nbsp; <AccountCircle />
                            </Button>
                        ) : (
                            <Button
                                color="inherit"
                                component={Link}
                                to={`/profile/:id`}
                                className={classes.linkButton}
                                onCLick={() => { }}
                            >
                                {!isMobile && <>My Movies &nbsp; </>}
                                <Avatar
                                    style={{ width: 30, height: 30 }}
                                    alt="Profile"
                                    src='https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png' />
                            </Button>
                        )}
                    </div>
                    {isMobile && <Search />}
                </Toolbar>
            </AppBar>

            <div>
                <nav className={classes.drawer}>
                    {isMobile ? (
                        <Drawer
                            variant='temporary'
                            anchor='right'
                            open={mobileOpen}
                            onClose={() => setMobileOpen((prevMobileopen) => !prevMobileopen)}
                            classes={{ paper: classes.drawerPaper }}
                            ModalProps={{ keepMounted: true }}
                        >
                            <SideBar setMobileOpen={setMobileOpen} />
                        </Drawer>
                    ) : (<Drawer classes={{ paper: classes.drawerPaper }} variant="permanent" open>
                        <SideBar setMobileOpen={setMobileOpen} />
                    </Drawer>)}
                </nav>
            </div>
        </>
    )
}

export default NavBar
