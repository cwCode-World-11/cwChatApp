function filterSearchTxt(contentTxt, searchTxt) {
  const txt = searchTxt.toLowerCase().trim();
  const searchedResult = contentTxt.toLowerCase().trim().includes(txt);

  if (searchedResult) {
    return searchedResult;
  }
}

export default filterSearchTxt;
