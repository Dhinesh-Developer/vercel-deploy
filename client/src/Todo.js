import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  // Edit states
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  // CREATE
  const handleSubmit = () => {
    setError("");

    if (title.trim() && description.trim()) {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then((data) => {
          setTodos([...todos, data]); // add returned item with _id
          setTitle("");
          setDescription("");
          setMessage("Item added successfully");

          setTimeout(() => setMessage(""), 3000);
        })
        .catch(() => {
          setError("Unable to create Todo item");
        });
    } else {
      setError("Please fill all fields");
    }
  };

  // READ
  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch(() => setError("Failed to fetch todos"));
  };

  // EDIT CLICK
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  // UPDATE
  const handleUpdate = () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      setError("Fields cannot be empty");
      return;
    }

    fetch(`${apiUrl}/todos/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setEditId(-1);
        getItems(); // refresh list
        setMessage("Item updated successfully");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => setError("Failed to update item"));
  };

  // DELETE
  const handleDelete = (id) => {
    fetch(`${apiUrl}/todos/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTodos(todos.filter((item) => item._id !== id));
      })
      .catch(() => setError("Failed to delete item"));
  };

  return (
    <div>
      <div className="row p-3 bg-success text-light">
        <h1>Todo Project with MERN stack</h1>
      </div>

      {/* ADD ITEM */}
      <div className="row p-3">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <div className="d-flex gap-2">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="row mt-3 p-3">
        <h3>Tasks</h3>

        <ul className="list-group">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
            >
              <div className="d-flex flex-column me-2">
                {editId !== item._id ? (
                  <div>
                    <span className="fw-bold">{item.title} </span>
                    <span>{item.description}</span>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="form-control"
                    />
                    <input
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="form-control"
                    />
                  </div>
                )}
              </div>

              <div className="d-flex gap-2">
                {editId !== item._id ? (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                )}

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}