import {gql, useMutation} from "@apollo/client";
import {PostData} from "../PostList/PostList.tsx";
import {memo, useCallback, useState} from "react";
import {Box, Paper, TextField, Typography} from "@mui/material";
import {useDebounce} from "../../helpers/debounce.ts";
import {useUnloadAlert} from "../../helpers/useUnloadAlert.ts";
import {SERVER_URL} from "../../helpers/consts.ts";
import {validate} from "../../helpers/validate.ts";

const UPDATE_POST = gql`
  mutation (
  $id: ID!,
  $input: UpdatePostInput!
  ) {
    updatePost(id: $id, input: $input) {
      id
      body
    }
  }
`;

interface EditablePostProps extends PostData {
  isSelected: boolean;
  onSelected: (id: string | null) => void;
}

interface UpdatePostResponse {
  updatePost: {
    id: string;
    body: string;
  };
}

interface UpdatePostVars {
  id: string;
  input: {
    body: string;
  };
}

export const EditablePost = memo(({ id, title, body, isSelected, onSelected }: EditablePostProps) => {
  const [text, setText] = useState<string>(body);
  const [inputError, setInputError] = useState<boolean>(false);
  const [mutatePost, {loading, error}] = useMutation<UpdatePostResponse, UpdatePostVars>(UPDATE_POST, {
    variables: {
      id,
      input: {
        body: text
      }
    }
  });

  const handleTabClosing = async () => {
    if (body !== text) {
      const dataForLastSave = JSON.stringify({
        mutation: UPDATE_POST,
        variables: {
          id,
          input: {
            body: text
          }
        }
      });
      navigator.sendBeacon(SERVER_URL, dataForLastSave)
    }
  }

  useUnloadAlert(handleTabClosing, text !== body);

  const debouncedSave = useDebounce(async () => {
    await mutatePost();
    // onSelected(null);
  }, 600);

  const handleTextChange = useCallback((newVal: string) => {
    setText(newVal);
    if (!validate(newVal)) {
      setInputError(true);
    } else {
      setInputError(false);
      debouncedSave();
    }
  }, [debouncedSave]);


  const handlePostClick = useCallback(() => {
    onSelected(id);
  }, [id, onSelected]);

  return (
    <Paper
      sx={{
        margin: "12px",
        width: "800px",
        padding: "12px"
      }}
      onClick={handlePostClick}
    >
      <Typography variant="h6">
        {title}
      </Typography>
      <Box
        sx={{ marginTop: "4px" }}
      >
        <TextField
          sx={{ display: isSelected ? "block" : "none" }}
          onChange={(e) => handleTextChange(e.target.value)}
          value={text}
          error={inputError}
          helperText={inputError && "Incorrect text"}
          multiline
          disabled={loading}
          size="small"
          fullWidth
          inputProps={{
            style: {
              padding: 0
            }
          }}
        />
        <Typography
          sx={{ display: !isSelected ? "block" : "none", whiteSpace: "pre-wrap" }}
          variant="body1">
          {body}
        </Typography>
      </Box>
      <Box
        sx={{
          height: "20px",
          margin: "4px"
        }}
      >
        {loading && <Typography variant="body2">Saving...</Typography>}
        {error && <Typography variant="body2">Saving error, please try again later</Typography>}
      </Box>
    </Paper>
  );
});