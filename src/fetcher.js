const fetcher = async (url, data) => {
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify(data)
  });
};

export default fetcher;
