import { parseYaml } from 'obsidian';
import * as z from "zod";

const BaseRequest = z.object({
	url: z.url({ protocol: /^https?$/ }),
	headers: z.array(z.record(z.string(), z.string()))
		.optional()
		.transform(headers => headers ? Object.assign({}, ...headers) as Record<string, string> : undefined),
	path: z.string().optional()
});

//NOTE: bsidian's RequestUrl() fails on mobile if a body is included with GET
// so we omit it here.
const Config = z.discriminatedUnion("method", [
	BaseRequest.extend({ method: z.literal("GET").optional() }),
	BaseRequest.extend({
		method: z.literal(["POST", "PUT", "DELETE"]),
		body: z.union([z.string(), z.record(z.any(), z.any()), z.array(z.any())
		]).transform((val) => {
			if (typeof val === 'string') {
				return val;
			}
			return JSON.stringify(val);
		}).optional(),
	})
]);
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
