function getInitials(name) {
  if (name) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }
  return "";
}

export { getInitials };
