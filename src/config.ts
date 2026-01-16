import { parseYaml } from 'obsidian';
import * as z from "zod";

const Config = z.object({
	url: z.httpUrl(),
	method: z.enum(["GET", "POST", "PUT", "DELETE"]).default("GET"),
	contentType: z.string().optional(),
	body: z.string().optional(),
	headers: z.array(
		z.record(z.string(), z.string())
		.refine(item => Object.keys(item).length === 1,
			{ message: "Each header item must have exactly one key" }))
		.optional()
		.transform(headers => headers ? Object.assign({}, ...headers) as Record<string, string> : undefined),
	path: z.string().optional()
});
export type Config = z.infer<typeof Config>;

interface ParseSuccess {
	success: true,
	data: { config: Config, template?: string }
}

interface ParseError {
	success: false,
	error: unknown
	message: string
}

export type ParseResult = ParseSuccess | ParseError;

export function parse(source: string): ParseResult {
	const [yaml, template] = source.split(/^---$/m);

	let result: ParseResult;
	try {
		const obj: unknown = parseYaml(yaml ?? '');
		const config = Config.parse(obj);
		result = { success: true, data: { config, template: template?.trim() } };
	} catch (error) {
		console.error(error);
		result = { success: false, error, message: "Invalid configuration format." };
		if (error instanceof z.ZodError) {
			result.message = z.prettifyError(error);
		}
	}

	return result;
}
