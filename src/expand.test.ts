import { describe, expect, test } from "bun:test";
import { convertExpandPathToPointers } from "./expand";
describe("convertExpandPathToPointers", () => {
	test("should convert expand paths to json pointers correctly", () => {
		const response = {
			user: "us_1",
			ids: ["a", "b", "c"],
			workspaces: [
				{
					id: "wo_1",
					owner: "us_2",
					more_nested_stuff: [
						{ some_id: "aaaaaa" },
						{ some_id: "aaaaaa" },
						{ some_id: "aaaaaa" },
					],
				},
				{
					id: "wo_2",
					owner: "us_3",
					more_nested_stuff: [
						{ some_id: "aaaaaa", number: 40 },
						{ some_id: "aaaaaa" },
						{ some_id: "aaaaaa" },
					],
				},
				{
					id: "wo_3",
					owner: "us_4",
					more_nested_stuff: [
						{ some_id: "aaaaaa" },
						{ some_id: "aaaaaa" },
						{ some_id: "aaaaaa" },
					],
				},
			],
		};

		const pathsToExpand = [
			"user",
			"workspaces.owner",
			"workspaces.more_nested_stuff.some_id",
			"workspaces.more_nested_stuff.number",
			"ids",
		];

		const result = convertExpandPathToPointers(response, pathsToExpand);

		expect(result).toEqual([
			"/user",
			"/workspaces/0/owner",
			"/workspaces/1/owner",
			"/workspaces/2/owner",
			"/workspaces/0/more_nested_stuff/0/some_id",
			"/workspaces/0/more_nested_stuff/1/some_id",
			"/workspaces/0/more_nested_stuff/2/some_id",
			"/workspaces/1/more_nested_stuff/0/some_id",
			"/workspaces/1/more_nested_stuff/1/some_id",
			"/workspaces/1/more_nested_stuff/2/some_id",
			"/workspaces/2/more_nested_stuff/0/some_id",
			"/workspaces/2/more_nested_stuff/1/some_id",
			"/workspaces/2/more_nested_stuff/2/some_id",
			"/ids/0",
			"/ids/1",
			"/ids/2",
		]);
	});
});
