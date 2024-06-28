import {gql, useQuery} from "@apollo/client";
import {EditablePost} from "../EditablePost/EditablePost.tsx";
import {useCallback, useRef, useState} from "react";
import {Box, CircularProgress, Typography} from "@mui/material";
import {useClickOutside} from "../../helpers/useClickOutside.ts";

const GET_POST_LIST = gql`
  query (
    $options: PageQueryOptions
  ) {
    posts(options: $options) {
      data {
        id
        title
        body
      }
      meta {
        totalCount
      }
    }
  }
`;

export interface PostData {
  id: string;
  title: string;
  body: string
}

interface PostListData {
  posts: {
    data: PostData[],
    meta: {
      totalCount: number
    }
  },
}

interface PostVars {
  options: {
    paginate: {
      page: number;
      limit: number;
    }
  }
}

export const PostList = () => {
  const [selectedPost, setSelected] = useState<string | null>(null);
  const {error, loading, data} = useQuery<PostListData, PostVars>(GET_POST_LIST,
    { variables: {
        "options": {
          "paginate": {
            "page": 1,
            "limit": 7
          }
        }
      },
    }
  );

  const onClickOutside = () => {
    setSelected(null);
  }

  const clickRef = useRef<HTMLElement>();
  useClickOutside(clickRef, onClickOutside);

  const handleSelect = useCallback((id: string) => {
    setSelected(id);
  }, []);

  return (
    <Box
      ref={clickRef}
      sx={{
      minHeight: "800px",
      minWidth: "824px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {loading && <CircularProgress size={100} />}
      {error && <Typography variant="h2">{`Error! ${error.message}`}</Typography>}
      {!loading && !error && (!data || !data.posts.data.length)  && <Typography variant="h2">No data</Typography>}
      { data?.posts.data && data.posts.data.map((post) => (
          <EditablePost
            key={post.id}
            {...post}
            isSelected={selectedPost === post.id}
            onSelected={handleSelect}
          />
        ))
      }
    </Box>
  );
}