client.test("Test status code", () => {
    client.assert(response.status === 200, "Response status is not 200");
});
