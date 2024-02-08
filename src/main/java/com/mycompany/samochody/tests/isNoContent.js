client.test("Test status code", () => {
    client.assert(response.status === 204, "Response status is not 204");
});
