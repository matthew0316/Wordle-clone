import React, {Fragment} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const MessageCenter = (props) => {

  const { message } = props;

    return (
      <Fragment>
        <Box sx={{height:500}}>
        <Typography
          variant="h5"
          sx={{ fontFamily: 'Gill Sans, sans-serif', fontSize: 25 }}
        >
          {message}
        </Typography>
        </Box>
      </Fragment>
    );
}

export default MessageCenter;