import * as React from 'react';
import { Link } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { MdAccountCircle, MdLogin, MdLogout } from "react-icons/md";
import Logo from '../../img/logo.png';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
    },
    [theme.breakpoints.up('md')]: {
      width: '50ch',
    },
  },
}));

export default function SearchBar() {
  const { isAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static py-4" className='!bg-blue-800'>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/"><img src={Logo} alt="Logo FootStore" width={200} /></Link>
          </Box>
          <Search>
              <SearchIcon />
            <StyledInputBase
              placeholder="Rechercher…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={3} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Link to={isAuthenticated ? "/dashboard" : "/connexion"}>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
              >
                {isAuthenticated ? <MdAccountCircle /> : <MdLogin />}
              </IconButton>
            </Link>
            {isAuthenticated ? (
              <IconButton size="large" edge="end" color="inherit" onClick={handleLogout}>
                <MdLogout />
              </IconButton>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}