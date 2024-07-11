
import { useState, useCallback, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import { Box, Tabs, Tab, Grid, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import useRefMounted from 'src/hooks/useRefMounted';
import axios from 'src/utils/axios';

import ProfileCover from './ProfileCover';
import RecentActivity from './RecentActivity';
import Feed from './Feed';
import PopularTags from './PopularTags';
import MyCards from './MyCards';
import Addresses from './Addresses';
import ActivityTab from './ActivityTab';
import EditProfileTab from './EditProfileTab';
import NotificationsTab from './NotificationsTab';
import SecurityTab from './SecurityTab';
import useAuth from 'src/hooks/useAuth';
import { APP } from 'src/config';

const TabsWrapper = styled(Tabs)(
    () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;

      .MuiTabs-indicator {
        box-shadow: none;
      }
    }
`
);

const PerfilUsuario = () => {
    // const {user: userInfo}  = useAuth()
    // const isMountedRef = useRefMounted();
    // const [user, setUser] = useState();

    // const { userId } = useParams();

    // const [currentTab, setCurrentTab] = useState('activity');

    // const tabs = [
    //     { value: 'activity', label: 'Activity' },
    //     { value: 'edit_profile', label: 'Edit Profile' },
    //     { value: 'notifications', label: 'Notifications' },
    //     { value: 'security', label: 'Passwords/Security' }
    // ];

    // const handleTabsChange = (_event, value) => {
    //     setCurrentTab(value);
    // };

    // const getUser = useCallback(async () => {
    //     try {
                        
    //         if (isMountedRef.current) {                
    //             const response =  await getDataCurrentUser()                
    //             setUser(response.result.infoAdicional.infoAdicional );
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }, [userId, isMountedRef]);

    // useEffect(() => {
    //     getUser();
    // }, [getUser]);

    // // if (!user) {
    // //     return null;
    // // }

    return (
        <>
            
        </>
    );
}

export default PerfilUsuario;
