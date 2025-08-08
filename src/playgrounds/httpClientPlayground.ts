import { Schema } from "effect";
import {
	AuthenticatedApiClient,
	UnauthenticatedApiClient,
	WorkspaceApiClient,
	route,
} from "../httpClient";

// Sample schema definitions for testing
const UserSchema = Schema.Struct({
	id: Schema.NonEmptyString,
	name: Schema.NonEmptyString,
	email: Schema.NonEmptyString,
});

const ProductSchema = Schema.Struct({
	id: Schema.NonEmptyString,
	name: Schema.NonEmptyString,
	price: Schema.Number,
});

const SearchParamsSchema = Schema.Struct({
	query: Schema.NonEmptyString,
	page: Schema.Number.pipe(Schema.optional),
});

type User = Schema.Schema.Type<typeof UserSchema>;
type Product = Schema.Schema.Type<typeof ProductSchema>;
type SearchParams = Schema.Schema.Type<typeof SearchParamsSchema>;

//
console.log("Case 1: GET with static URL and response schema (without body)");
const getUsers = route<readonly User[]>({
	method: "get",
	url: "/api/users",
	client: AuthenticatedApiClient,
	responseSchema: Schema.Array(UserSchema),
});
// Type check: getUsers should be a function taking optional expand parameters
const users = getUsers(); // Effect<User[]>
const usersWithExpand = getUsers(); // Effect<User[]>

console.log(
	"Case 2: GET with static URL, response schema, and body (search params)",
);
const searchUsers = route<SearchParams, readonly User[]>({
	method: "get",
	url: "/api/users/search",
	client: AuthenticatedApiClient,
	responseSchema: Schema.Array(UserSchema),
	allowBody: true,
});
// Type check: searchUsers should take body and optional expand
const searchResults = searchUsers({ query: "john" }); // Effect<User[]>
const searchResultsWithExpand = searchUsers({ query: "john" }); // Effect<User[]>

console.log(
	"Case 3: GET with parameterized URL and response schema (without body)",
);
const getUserById = route<User, string>({
	method: "get",
	url: id => `/api/users/${id}`,
	client: AuthenticatedApiClient,
	responseSchema: UserSchema,
});
// Type check: getUserById should take an ID parameter and optional expand
const user = getUserById("123"); // Effect<User>
const userWithExpand = getUserById("123", []); // Effect<User>

console.log("Case 4: GET with parameterized URL, response schema, and body");
const searchUserProducts = route<SearchParams, readonly Product[], string>({
	method: "get",
	url: userId => `/api/users/${userId}/products/search`,
	client: WorkspaceApiClient,
	responseSchema: Schema.Array(ProductSchema),
	allowBody: true,
});
// Type check: searchUserProducts should take ID, body, and optional expand
const products = searchUserProducts("123", { query: "electronics" }); // Effect<Product[]>
const productsWithExpand = searchUserProducts("123", { query: "electronics" }); // Effect<Product[]>

console.log("Case 5: Static URL with no response schema");
const pingServer = route({
	method: "get",
	url: "/api/ping",
	client: UnauthenticatedApiClient,
});
// Type check: pingServer should take no parameters
const pingResult = pingServer(); // Effect<void>

console.log(
	"Case 6: Non-GET with static URL and response schema (POST, PUT, etc.)",
);
const createUser = route<Omit<User, "id">, User>({
	method: "post",
	url: "/api/users",
	client: AuthenticatedApiClient,
	responseSchema: UserSchema,
});
// Type check: createUser should take body and optional expand
const newUser = createUser({ name: "John", email: "john@example.com" }); // Effect<User>
const newUserWithExpand = createUser(
	{ name: "John", email: "john@example.com" },
	[],
); // Effect<User>

console.log("Case 7: Parameterized URL with no response schema");
const deleteUser = route<never, string>({
	method: "del",
	url: id => `/api/users/${id}`,
	client: AuthenticatedApiClient,
});
// Type check: deleteUser should take an ID parameter
const deleteResult = deleteUser("123"); // Effect<void>

console.log("Case 8: Non-GET with parameterized URL and response schema");
const updateUser = route<Partial<User>, User, string>({
	method: "patch",
	url: id => `/api/users/${id}`,
	client: AuthenticatedApiClient,
	responseSchema: UserSchema,
});
// Type check: updateUser should take ID, body, and optional expand
const updatedUser = updateUser("123", { name: "John Updated" }); // Effect<User>
const updatedUserWithExpand = updateUser("123", { name: "John Updated" }, []); // Effect<User>

console.log(
	"Case 9: DELETE with parameterized URL and response schema (returning the deleted item)",
);
const deleteUserWithResponse = route<never, User, string>({
	method: "del",
	url: id => `/api/users/${id}`,
	client: AuthenticatedApiClient,
	responseSchema: UserSchema,
});
// Type check: deleteUserWithResponse should take ID and optional expand
const deletedUser = deleteUserWithResponse("123"); // Effect<User>
const deletedUserWithExpand = deleteUserWithResponse("123"); // Effect<User>

console.log("Case 10: PUT with parameterized URL and response schema");
const replaceUser = route<User, User, string>({
	method: "put",
	url: id => `/api/users/${id}`,
	client: AuthenticatedApiClient,
	responseSchema: UserSchema,
});
// Type check: replaceUser should take ID, body, and optional expand
const replacedUser = replaceUser("123", {
	id: "123",
	name: "John",
	email: "john@example.com",
}); // Effect<User>
const replacedUserWithExpand = replaceUser("123", {
	id: "123",
	name: "John",
	email: "john@example.com",
}); // Effect<User>
