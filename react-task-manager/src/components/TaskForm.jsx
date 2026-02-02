function TaskForm({
  text,
  onChange,
  onSubmit,
  loading,
}) {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Write task..."
        value={text}
        onChange={onChange}
      />
      <button disabled={loading || text.trim() === ""}>
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}

export default TaskForm;
