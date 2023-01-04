import { Typography } from "@mui/material";

const PageHeading = (props) => {
    return (
      <>
        <br />
        <Typography align="left" 
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "white",
          }}>{props.heading}</Typography>
          <br />
      </>
    )
}
export default PageHeading;