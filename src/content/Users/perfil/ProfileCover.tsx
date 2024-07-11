/* eslint-disable jsx-a11y/label-has-for */
import PropTypes from 'prop-types';

import { Box, Typography, Card, Tooltip, Avatar, CardMedia, Button, IconButton, styled, CircularProgress, LinearProgress, Zoom } from '@mui/material';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import { useNavigate, useLocation } from 'react-router-dom';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import { useEffect, useState } from 'react';
import { deleteFile, uploadFile } from 'src/api/storageApi';
// import { entidades } from 'src/config/entities';
import { updateItem } from 'src/api/genericApi';
import { blue } from '@mui/material/colors';
import { useSnackbar } from "notistack";

const Input = styled('input')({
	display: 'none'
});

const AvatarWrapper = styled(Card)(
	({ theme }) => `

    position: relative;
    overflow: visible;
    display: inline-block;
    margin-top: -${theme.spacing(9)};
    margin-left: ${theme.spacing(2)};

    .MuiAvatar-root {
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
    }
`
);

const ButtonUploadWrapper = styled(Box)(
	({ theme }) => `
    position: absolute;
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    bottom: -${theme.spacing(1)};
    right: -${theme.spacing(1)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
`
);

const CardCover = styled(Card)(
	({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(26)};
    }
`
);

const CardCoverAction = styled(Box)(
	({ theme }) => `
    position: absolute;
    right: ${theme.spacing(2)};
    bottom: ${theme.spacing(2)};
`
);

const ProfileCover = ({ user = null }) => {

	const { enqueueSnackbar } = useSnackbar();

	const [profileUrl, setProfileUrl] = useState(null);
	const [coverUrl, setCoverUrl] = useState(null);
	const [isLoadingProfile, setIsLoadingProfile] = useState(false)
	const [isLoadingCover, setIsLoadingCover] = useState(false)


	const onChangeProfileImage = async (event) => {

		setIsLoadingProfile(true)
		const file = event.target.files[0];
		const reader = new FileReader();
		const archivoAnterior = user.photoNameFile


		await uploadFile('ProfileImages', file, archivoAnterior).then((file) => {
			user.photoURL = file.fullPath
			user.photoNameFile = file.nombre
			// updateItem(entidades.USUARIOS, user.id, user).then(() => {
			// 	const message = 'La imagen de perfil se actualizo correctamente.'
			// 	enqueueSnackbar(message, {
			// 		variant: 'success',
			// 		anchorOrigin: { vertical: 'top', horizontal: 'center'},
			// 		TransitionComponent: Zoom
			// 	});			
			// })
		}).catch((err) => {
			setIsLoadingProfile(false)
		})

		reader.onloadend = () => {
			setProfileUrl(reader.result);
		};

		reader.readAsDataURL(file);
		setIsLoadingProfile(false)


	}
	const onChangeCoverImage = async (event) => {
		setIsLoadingCover(true)

		const file = event.target.files[0]
		const reader = new FileReader()
		const archivoAnterior = user.coverPhotoNameFile

		await uploadFile('CoverImages', file, archivoAnterior).then((file) => {
			user.coverPhotoURL = file.fullPath
			user.coverPhotoNameFile = file.nombre
			// updateItem(entidades.USUARIOS, user.id, user).then(() => {
			// 	const message = 'La imagen de portada se actualizo correctamente.'
			// 	enqueueSnackbar(message, {
			// 		variant: 'success',
			// 		anchorOrigin: { vertical: 'top', horizontal: 'center'},
			// 		TransitionComponent: Zoom
			// 	});
			// })
		}).catch((err) => {
			setIsLoadingCover(false)
		})

		reader.onloadend = () => {
			setCoverUrl(reader.result)
		};

		reader.readAsDataURL(file)
		setIsLoadingCover(false)
	}



	useEffect(() => {
		if (user) {
			setProfileUrl(user.photoURL)
			setCoverUrl(user.coverPhotoURL)
		}
	}, [user])


	return user ? (
		<>
			{/* <Box display="flex" mb={3}>
        <Tooltip arrow placement="top" title={'Go back'}>
          <IconButton
            onClick={handleBack}
            color="primary"
            sx={{
              p: 2,
              mr: 2
            }}
          >
            <ArrowBackTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            {'Profile for'} {user.nombre} {user.apellido}
          </Typography>
          <Typography variant="subtitle2">
            {'This is a profile page. Easy to modify, always blazing fast'}
          </Typography>
        </Box>
      </Box> */}
			<CardCover>
				<CardMedia image={coverUrl ? coverUrl : ''} />
				{
					!isLoadingCover && (
						<CardCoverAction>
							<Input accept="image/*" id="change-cover" multiple type="file" onChange={onChangeCoverImage} />
							<label htmlFor="change-cover">
								<Button
									startIcon={<UploadTwoToneIcon />}
									variant="contained"
									component="span"
								>
									{'Cambiar portada'}
								</Button>
							</label>
						</CardCoverAction>
					)}
				{
					isLoadingCover && (
						<Box sx={{ width: '100%' }}>
							<LinearProgress />
						</Box>
					)
				}
			</CardCover>
			<AvatarWrapper>
				{
					isLoadingProfile && (
						<CircularProgress
							size={68}
							sx={{
								color: (theme) => theme.colors.primary.main,
								position: 'absolute',
								top: '30%',
								left: '30%',
								zIndex: 1,
							}}
						/>
					)
				}

				<Avatar variant="rounded" alt={user.nombre} src={profileUrl ? profileUrl : ''} />
				{
					!isLoadingProfile && (
						<ButtonUploadWrapper>
							<Input
								accept="image/*"
								id="icon-button-file"
								name="icon-button-file"
								type="file"
								onChange={onChangeProfileImage}

							/>
							<label htmlFor="icon-button-file">
								<IconButton component="span" color="primary">
									<UploadTwoToneIcon />
								</IconButton>
							</label>
						</ButtonUploadWrapper>
					)}

			</AvatarWrapper>

			<Box py={2} pl={2} mb={3}>
				<Typography gutterBottom variant="h3">
					{user.nombre} {user.apellido}
				</Typography>
				{/* <Typography variant="subtitle2">{user.nombre} {user.apellido}</Typography> */}
				<Typography
					sx={{
						py: 2
					}}
					variant="subtitle2"
					color="text.primary"
				>
					{user.userRol} | {user.correo} | {user.telefono}
				</Typography>
				<Box
					display={{ xs: 'block', md: 'flex' }}
					alignItems="center"
					justifyContent="space-between"
				>
					<Box>
						<Button size="small" variant="contained">
							{'Follow'}
						</Button>
						<Button
							size="small"
							sx={{
								mx: 1
							}}
							variant="outlined"
						>
							{'View website'}
						</Button>
						<IconButton
							color="primary"
							sx={{
								p: 0.5
							}}
						>
							<MoreHorizTwoToneIcon />
						</IconButton>
					</Box>
					<Button
						sx={{
							mt: { xs: 2, md: 0 }
						}}
						size="small"
						variant="text"
						endIcon={<ArrowForwardTwoToneIcon />}
					>
						{'See all'}
						{user.followers}
						{'connections'}
					</Button>
				</Box>
			</Box>
		</>
	) : (
		<></>
	);
};

export default ProfileCover;
