import { fetchSignUp } from "./fetchSignup";
const mockFetch = jest.fn();
global.fetch = mockFetch as any;


describe("fetchSignUp", () => {
 beforeEach(() => {
   jest.clearAllMocks();
   Object.defineProperty(global, 'localStorage', {
     value: {
       setItem: jest.fn(),
       getItem: jest.fn(),
       removeItem: jest.fn(),
       clear: jest.fn(),
       key: jest.fn(),
       length: 0,
     },
     writable: true,
   });
 });


 it("calls fetch with correct params", async () => {
   mockFetch.mockResolvedValueOnce({
     ok: true,
     json: async () => ({  }),
   });


   const data = {
     first_name: "Test",
     last_name: "User",
     email: "test@email.com",
     password: "pass123",
   };


   await fetchSignUp(data);


   expect(mockFetch).toHaveBeenCalledWith("api/signup", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(data),
   });
 });




 it("returns result if fetch is ok", async () => {
   const result = { message: "ok", role: "user" };
   mockFetch.mockResolvedValueOnce({
     ok: true,
     json: async () => result,
   });


   const res = await fetchSignUp({
     first_name: "Test",
     last_name: "User",
     email: "test@email.com",
     password: "pass123",
   });


   expect(res).toEqual(result);
 });


 it("throws error if response is not ok", async () => {
   mockFetch.mockResolvedValueOnce({
     ok: false,
     text: async () => "Bad request",
   });


   await expect(
     fetchSignUp({
       first_name: "Test",
       last_name: "User",
       email: "test@email.com",
       password: "pass123",
     })
   ).rejects.toThrow(/Something went wrong, please try again/);
 });



});
