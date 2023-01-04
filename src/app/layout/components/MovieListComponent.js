import { Alert, Card, CardActionArea, CardContent, CardMedia, Grid, Slide, Snackbar, Typography } from "@mui/material";
import { ImgApi } from "../../api/movie_agent";
import { Container } from '@mui/system';
import { useState } from "react";
import BasicRating from "./BasicRating";

function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
}

export default function MovieList(props) {
    const LikedComponent = props.likedComponent;
    const [selected, setSelected] = useState([])

    const handleSelect = (id) => {
        const tempMemory = [...selected]
        if (tempMemory[id] === id ) {
            tempMemory[id] = undefined;
        }
        else {
            tempMemory[id] = id
        }
        setSelected(tempMemory);
    }

    const handleClose = (_event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
      };

    if (props.movies.length <= 0) return (
        <Container maxWidth="xl">
            <Typography
                variant="h5"
                align="center"
                sx={{
                    fontWeight: 700,
                    color: '#ffc107',
                    fontSize: 30
                }}>
                <Snackbar open={true}
                    sx={{
                        marginTop: '3.5%'
                    }}
                    autoHideDuration={6000} 
                    onClose={handleClose}
                    anchorOrigin={{vertical: 'top',
                        horizontal: 'center'}}
                    TransitionComponent={TransitionLeft}>
                    <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                    No liked Movies Found, Go to home and like some movies
                    </Alert>
                </Snackbar>
            </Typography>
        </Container>
    )
    
    return (
        <>
            {props.movies.map((movie, index) => (
                <Grid item xs={1} lg={2} md={4} sm={6} key={index}>
                    <Card hoverable
                        sx={{ maxWidth: 345, borderRadius: '6px', boxShadow: 3,
                            ':hover': {
                                transform: "scale3d(1.05, 1.05, 1)"
                            }
                        }}
                          >
                        <CardActionArea>
                        <CardMedia
                        sx={{borderRadius: '3px'}}
                            component="img"
                            // height="140"
                            image={ movie.poster_path ? (ImgApi + movie.poster_path) : ""}
                            alt={movie.title}
                        />
                        <CardContent>
                        <Typography gutterBottom
                            variant="h6"
                            component="div"
                            sx={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                fontSize: 18
                            }}>
                            {movie.title}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={2} lg={2} md={2} sm={2}>
                                <Typography 
                                    variant="body2"
                                    color="text.secondary">
                                    {props.liked_movies(movie.id) ? (
                                        <div onClick={()=> {
                                            props.handleLikedClick(movie);
                                            handleSelect(movie.id)
                                            }}>
                                            <LikedComponent />
                                        </div>) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#1976D2" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                                            <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                                        </svg>
                                        )
                                    }
                                </Typography>
                            </Grid>
                            <Grid item xs={10} lg={10} md={10} sm={10} key={index}>
                                <BasicRating vote_average={movie.vote_average}/>
                            </Grid>
                        </Grid>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </>
    )
}
