import {PostList} from "./components/PostList/PostList.tsx";
import {Box} from "@mui/material";
function App() {
  return (
    <Box
      sx={{
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <h2>Hello, its Apollo React TS Test!</h2>
      <Box sx={{ maxHeight: "800px", overflowY: "scroll" }}>
        <PostList/>
      </Box>
    </Box>
  )
}

export default App
