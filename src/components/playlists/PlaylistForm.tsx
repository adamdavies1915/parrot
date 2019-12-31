import React, { useState } from "react";
import {
  Form,
  TextArea,
  CheckBox,
  TextInput,
  Button,
  Text,
  Box,
  Grid
} from "grommet";
import { SearchBar, SearchBarResult } from "./SearchBar";
import { useForm } from "react-hook-form";
import {
  storeRecommendationPlaylistDetails,
  fetchRecommendations
} from "./redux/recommendationsRedcuer";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

interface FormData {
  selected: SearchBarResult;
  name: string;
  description?: string;
  public: boolean;
}

//TODO make look nice
export const PlaylistForm = React.memo(() => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, setValue } = useForm<FormData>();
  const [selected, setSelected] = useState<SearchBarResult>({
    artists: {},
    tracks: {}
  });
  const [isPublic, setPublic] = useState<boolean>(false);
  const onIsPublicChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPublic(event.target.checked);

  React.useEffect(() => {
    register(
      {
        name: "selected"
      },
      {
        validate: ({ artists, tracks }: SearchBarResult) => {
          return (
            Object.keys(artists).length > 0 || Object.keys(tracks).length > 0
          );
        }
      }
    );

    register({ name: "public" });
  }, [register]);

  React.useEffect(() => {
    setValue("selected", selected);
  }, [selected, setValue]);

  React.useEffect(() => {
    setValue("public", isPublic);
  }, [isPublic, setValue]);

  return (
    <Form
      name="New Playlist"
      onSubmit={handleSubmit((data: FormData) => {
        dispatch(
          storeRecommendationPlaylistDetails({
            name: data.name,
            description: data.description,
            isPublic: data.public
          })
        );

        dispatch(
          fetchRecommendations({
            artists: Object.values(data.selected.artists),
            tracks: Object.values(data.selected.tracks)
          })
        );

        dispatch(push("/preview-playlist"));
      })}
    >
      <Grid columns={["auto"]} gap="medium">
        <Box>
          <Text>Name</Text>
          <TextInput
            placeholder="Name"
            name="name"
            ref={register({ required: true })}
          />
          {errors.name && <Text color="status-error">Name is required</Text>}
        </Box>
        <Box>
          <Text>Description</Text>
          <TextArea
            placeholder="Description"
            name="description"
            ref={register}
          />
        </Box>
        <Box>
          <CheckBox
            label="Make playlist public"
            onChange={onIsPublicChange}
            checked={isPublic}
          />
        </Box>
        <Box>
          <SearchBar
            onSelected={(results: SearchBarResult) => setSelected(results)}
          />
          {errors.selected && (
            <Text color="status-error">Please choose some suggestions</Text>
          )}
        </Box>
        <Box margin={{ vertical: "small" }} alignSelf="end">
          <Button type="submit" label={"Preview my playlist"} primary />
        </Box>
      </Grid>
    </Form>
  );
});
