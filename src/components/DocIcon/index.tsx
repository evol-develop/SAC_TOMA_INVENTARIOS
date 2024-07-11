import { Avatar, Box } from '@mui/material';
import React from 'react';

interface DocIconProps {
  variant: string;
}

const DocIcon: React.FC<DocIconProps> = ({ variant }) => {
  const iconSrc = `/src/resources/DocsIcons/doc.png`;

  return (
    <Box width={25} height={25}>
      <Avatar alt="Remy Sharp" src="/src/resources/DocsIcons/doc.png" />
    </Box>
  );
};

export default DocIcon;
