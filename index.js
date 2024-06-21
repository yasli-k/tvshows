const express = require("express");
const model = require("./model");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.get("/tvshows", async (request, response) => {
  try {
    let tvshows = await model.TVShow.find();
    response.json(tvshows);
  } catch (error) {
    console.log(error);
    response.status(400).send("Generic error message");
  }
});

app.post("/tvshows", async (request, response) => {
  const data = request.body;
  try {
    let newTVShow = new model.TVShow({
      title: data.title,
      seasons: data.seasons,
      genre: data.genre,
    });

    let error = newTVShow.validateSync();

    if (error) {
      response.status(400).json(error);
      return;
    }

    await newTVShow.save();
    response.status(201).json(newTVShow);
  } catch (error) {
    console.log(error);
    response.status(400).send("Generic error message");
  }
});

app.delete("/tvshows/:id", async (request, response) => {
  try {
    let isDeleted = await model.TVShow.findOneAndDelete({
      _id: request.params.id,
    });
    if (isDeleted) {
      response.status(404).send("Could not find TV Show");
      return;
    }
    response.status(204).send("TV Show deleted");
  } catch (error) {
    console.log(error);
    response.status(400).send("Generic error message");
  }
});

app.get("/tvshows/:id", async (request, response) => {
  try {
    let tvshow = await model.TVShow.findById(request.params.id);
    if (!tvshow) {
      response.status(404).send("Could not find TV Show");
      return;
    }
    response.json(tvshow);
  } catch (error) {
    console.log(error);
    response.status(400).send("Generic error message");
  }
});

app.put("/tvshows/:id", async (request, response) => {
  try {
    const updatedTVShow = {
      title: request.body.title,
      seasons: request.body.seasons,
      genre: request.body.genre,
    };
    let tvShow = await model.TVShow.findByIdAndUpdate(
      request.params.id,
      updatedTVShow,
      { new: true }
    );
    if (!tvshow) {
      response.status(404).send("Could not find TV Show");
      return;
    } else {
      response.status(204).json(tvShow);
    }
  } catch (error) {
    console.log(error);
    response.status(400).send("Generic error message");
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
