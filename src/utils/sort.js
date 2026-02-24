export const getSort = (query, allowedFields = []) => {
  const sortBy = allowedFields.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";

  const order = query.order === "asc" ? 1 : -1;

  return { [sortBy]: order };
};
