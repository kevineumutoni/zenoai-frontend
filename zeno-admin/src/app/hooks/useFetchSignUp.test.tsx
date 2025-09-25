import { act, renderHook } from "@testing-library/react";
import { useFetchSignUp } from "./useFetchSignUp";
import * as fetchSignupModule from "../utils/fetchSignup";


describe("useFetchSignUp", () => {
 beforeEach(() => {
   jest.clearAllMocks();
   Object.defineProperty(global, "localStorage", {
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


 it("calls fetchSignUp when login successful", async () => {
   const mockData = {  message: "Success", role: "user" };
   jest.spyOn(fetchSignupModule, "fetchSignUp").mockResolvedValueOnce(mockData);


   const { result } = renderHook(() => useFetchSignUp());


   let response;
   await act(async () => {
     response = await result.current.signUp({
       first_name: "Test",
       last_name: "User",
       email: "test@email.com",
       password: "pass123",
     });
   });


   expect(fetchSignupModule.fetchSignUp).toHaveBeenCalledWith({
     first_name: "Test",
     last_name: "User",
     email: "test@email.com",
     password: "pass123",
   });
   expect(response).toEqual(mockData);
   expect(result.current.isLoading).toBe(false);
   expect(result.current.error).toBeNull();
 });


 it("sets error and returns null on failure", async () => {
   jest.spyOn(fetchSignupModule, "fetchSignUp").mockRejectedValueOnce(new Error("Failed"));


   const { result } = renderHook(() => useFetchSignUp());


   let response;
   await act(async () => {
     response = await result.current.signUp({
       first_name: "Test",
       last_name: "User",
       email: "test@email.com",
       password: "pass123",
     });
   });


   expect(result.current.isLoading).toBe(false);
   expect(result.current.error).toBeInstanceOf(Error);
   expect(result.current.error?.message).toBe("Failed");
   expect(response).toBeNull();
 });


 it("resets error and isLoading before each call", async () => {
   jest.spyOn(fetchSignupModule, "fetchSignUp")
     .mockRejectedValueOnce(new Error("Failed"))
     .mockResolvedValueOnce({  message: "Success", role: "user" });


   const { result } = renderHook(() => useFetchSignUp());


   await act(async () => {
     await result.current.signUp({
       first_name: "Test",
       last_name: "User",
       email: "test@email.com",
       password: "pass123",
     });
   });
   expect(result.current.error).not.toBeNull();


   await act(async () => {
     await result.current.signUp({
       first_name: "Test",
       last_name: "User",
       email: "test@email.com",
       password: "pass123",
     });
   });
   expect(result.current.error).toBeNull();
 });
});

