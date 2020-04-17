const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  try {
    if (!repositories.length) {
      throw new Error("Repository list is empty");
    }
    response.status(200).json(repositories);
  } catch (error) {
    response.status(400).json({ title: "Error", message: error.message });
  }
});

app.post("/repositories", (request, response) => {
  try {
    const { title, url, techs } = request.body;

    if (!title || !url || !techs) {
      throw new Error(
        "Failed to create a repository. The fields: 'title', 'url' and 'techs' is required!"
      );
    }

    const id = uuid();
    const likes = 0;

    repositories.push({ id, title, url, techs, likes });

    response.status(201).json({ id, title, url, techs, likes });
  } catch (error) {
    response.status(400).json({ title: "Error", message: error.message });
  }
});

app.put("/repositories/:id", (request, response) => {
  try {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositoryIndex = repositories.findIndex((item) => item.id === id);

    if (!id) {
      throw new Error("Parameter 'id' is not present in the request");
    }

    if (repositoryIndex === -1) {
      throw new Error("Can't update, repository not found!");
    }

    repositories[repositoryIndex] = {
      ...repositories[repositoryIndex],
      title,
      url,
      techs,
    };

    response.status(200).json(repositories[repositoryIndex]);
  } catch (error) {
    response.status(400).json({ title: "Error", message: error.message });
  }
});

app.delete("/repositories/:id", (request, response) => {
  try {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex((item) => item.id === id);

    if (!id) {
      throw new Error("Parameter 'id' is not present in the request");
    }

    if (repositoryIndex === -1) {
      throw new Error("Can't remove, repository not found!");
    }

    repositories.splice(repositoryIndex, 1);

    response.status(204).json({
      title: "Success",
      message: "Repository removed was successfully!",
    });
  } catch (error) {
    response.status(400).json({ title: "Error", message: error.message });
  }
});

app.post("/repositories/:id/like", (request, response) => {
  try {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex((item) => item.id === id);

    if (!id) {
      throw new Error("Parameter 'id' is not present in the request");
    }

    if (repositoryIndex === -1) {
      throw new Error("Can't like this repository, not found!");
    }

    repositories[repositoryIndex] = {
      ...repositories[repositoryIndex],
      likes: (repositories[repositoryIndex].likes += 1),
    };

    response.status(200).json(repositories[repositoryIndex]);
  } catch (error) {
    response.status(400).json({ title: "Error", message: error.message });
  }
});

module.exports = app;
